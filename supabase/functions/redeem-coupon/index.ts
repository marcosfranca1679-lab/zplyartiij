import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.78.0';

const allowedOrigins = [
  'https://ifqmxyvpjlkiikeubyoa.lovableproject.com',
  'https://ifqmxyvpjlkiikeubyoa.lovable.app',
  'http://localhost:5173',
  'http://localhost:8080',
];

function getCorsHeaders(req: Request) {
  const origin = req.headers.get('origin') || '';
  const allowedOrigin = allowedOrigins.includes(origin) ? origin : allowedOrigins[0];
  return {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  };
}

interface RedeemRequest {
  phoneNumber: string;
  ipAddress: string;
  deviceFingerprint: string;
}

Deno.serve(async (req) => {
  const corsHeaders = getCorsHeaders(req);
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    // Use service role to bypass RLS
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { phoneNumber, ipAddress, deviceFingerprint }: RedeemRequest = await req.json();

    console.log('Redemption attempt:', { phoneNumber, ipAddress, deviceFingerprint });

    // Server-side validation: Brazilian phone number format
    const cleanPhone = phoneNumber.replace(/\D/g, '');
    const brazilPhoneRegex = /^[1-9]{2}9?[0-9]{8}$/;
    
    if (!brazilPhoneRegex.test(cleanPhone)) {
      console.warn('Invalid phone format:', cleanPhone);
      return new Response(
        JSON.stringify({ error: 'Número de celular inválido' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Rate limiting: check attempts in last hour
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const { data: recentAttempts, error: attemptsError } = await supabase
      .from('coupon_redemption_attempts')
      .select('id')
      .eq('ip_address', ipAddress)
      .gte('created_at', oneHourAgo);

    if (attemptsError) {
      console.error('Error checking attempts:', attemptsError);
      return new Response(
        JSON.stringify({ error: 'Erro ao processar solicitação' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (recentAttempts && recentAttempts.length >= 5) {
      console.warn('Rate limit exceeded for IP:', ipAddress);
      return new Response(
        JSON.stringify({ error: 'Muitas tentativas. Tente novamente mais tarde.' }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Log attempt
    await supabase.from('coupon_redemption_attempts').insert({
      ip_address: ipAddress,
      phone_number: cleanPhone,
    });

    // Check if IP already redeemed
    const { data: ipRedemptions, error: ipError } = await supabase
      .from('coupon_redemptions')
      .select('id')
      .eq('ip_address', ipAddress);

    if (ipError) {
      console.error('Error checking IP redemptions:', ipError);
      return new Response(
        JSON.stringify({ error: 'Erro ao verificar resgates anteriores' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (ipRedemptions && ipRedemptions.length > 0) {
      console.log('IP already redeemed:', ipAddress);
      return new Response(
        JSON.stringify({ error: 'Este endereço já resgatou um cupom.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if device already redeemed
    const { data: deviceRedemptions, error: deviceError } = await supabase
      .from('coupon_redemptions')
      .select('id')
      .eq('device_fingerprint', deviceFingerprint);

    if (deviceError) {
      console.error('Error checking device redemptions:', deviceError);
      return new Response(
        JSON.stringify({ error: 'Erro ao verificar resgates anteriores' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (deviceRedemptions && deviceRedemptions.length > 0) {
      console.log('Device already redeemed:', deviceFingerprint);
      return new Response(
        JSON.stringify({ error: 'Este dispositivo já resgatou um cupom.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Find an available coupon atomically
    const { data: availableCoupons, error: couponError } = await supabase
      .from('coupons')
      .select('id, code')
      .eq('is_redeemed', false)
      .limit(1);

    if (couponError) {
      console.error('Error fetching coupons:', couponError);
      return new Response(
        JSON.stringify({ error: 'Erro ao buscar cupons disponíveis' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!availableCoupons || availableCoupons.length === 0) {
      console.log('No coupons available');
      return new Response(
        JSON.stringify({ error: 'Não há cupons disponíveis no momento' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const coupon = availableCoupons[0];

    // Atomic transaction: mark coupon as redeemed and create redemption record
    const { error: updateError } = await supabase
      .from('coupons')
      .update({ is_redeemed: true, redeemed_at: new Date().toISOString() })
      .eq('id', coupon.id)
      .eq('is_redeemed', false); // Prevent race conditions

    if (updateError) {
      console.error('Error updating coupon:', updateError);
      return new Response(
        JSON.stringify({ error: 'Erro ao resgatar cupom' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create redemption record
    const { error: insertError } = await supabase
      .from('coupon_redemptions')
      .insert({
        coupon_id: coupon.id,
        phone_number: cleanPhone,
        ip_address: ipAddress,
        device_fingerprint: deviceFingerprint,
      });

    if (insertError) {
      console.error('Error creating redemption:', insertError);
      // Rollback coupon status
      await supabase
        .from('coupons')
        .update({ is_redeemed: false, redeemed_at: null })
        .eq('id', coupon.id);
      
      return new Response(
        JSON.stringify({ error: 'Erro ao registrar resgate' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Coupon redeemed successfully:', coupon.code);

    return new Response(
      JSON.stringify({ 
        success: true, 
        code: coupon.code,
        message: 'Cupom resgatado com sucesso!' 
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(
      JSON.stringify({ error: 'Erro inesperado ao processar solicitação' }),
      { status: 500, headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' } }
    );
  }
});
