import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.78.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ValidateRequest {
  code: string;
  planType: string;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { code, planType }: ValidateRequest = await req.json();

    console.log('Validating coupon:', { code, planType });

    // Buscar cupom pelo código
    const { data: coupon, error: couponError } = await supabase
      .from('coupons')
      .select('*')
      .eq('code', code.toUpperCase().trim())
      .eq('is_redeemed', false)
      .maybeSingle();

    if (couponError || !coupon) {
      console.log('Coupon not found or already used:', code);
      return new Response(
        JSON.stringify({ 
          valid: false, 
          error: 'Cupom inválido ou já utilizado' 
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verificar validade do cupom
    if (coupon.valid_until) {
      const validUntil = new Date(coupon.valid_until);
      if (validUntil < new Date()) {
        console.log('Coupon expired:', code);
        return new Response(
          JSON.stringify({ 
            valid: false, 
            error: 'Este cupom expirou' 
          }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    // Verificar se o cupom é válido para o plano selecionado
    if (coupon.valid_for_plan && coupon.valid_for_plan !== 'all' && coupon.valid_for_plan !== planType) {
      const planLabel = coupon.valid_for_plan === 'monthly' ? 'mensal' : 'trimestral';
      console.log('Coupon not valid for plan:', { code, planType, validFor: coupon.valid_for_plan });
      return new Response(
        JSON.stringify({ 
          valid: false, 
          error: `Este cupom só pode ser usado no plano ${planLabel}` 
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Cupom válido - retornar desconto do cupom
    const discountPercent = coupon.discount_percent || 30;
    
    console.log('Coupon valid:', { code: coupon.code, discount: discountPercent });

    return new Response(
      JSON.stringify({ 
        valid: true,
        code: coupon.code,
        discountPercent,
        message: `Cupom aplicado! ${discountPercent}% de desconto`
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(
      JSON.stringify({ 
        valid: false, 
        error: 'Erro ao validar cupom' 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
