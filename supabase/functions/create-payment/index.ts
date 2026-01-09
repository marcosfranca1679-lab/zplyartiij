import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.78.0";

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

serve(async (req) => {
  const corsHeaders = getCorsHeaders(req);
  
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    // Removido discountPercent - nunca confiar em valores de desconto do cliente
    const { planType, couponCode, whatsapp, email } = body;
    
    console.log('Received payment request:', { planType, couponCode, whatsapp, email });
    
    const accessToken = Deno.env.get('MERCADO_PAGO_ACCESS_TOKEN');

    if (!accessToken) {
      throw new Error('Mercado Pago access token não configurado');
    }

    // Variáveis do backend para validação de cupom no servidor
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    // Define os dados do plano
    const plans = {
      monthly: {
        title: 'Z Player - Plano Mensal',
        price: 29.99,
        description: 'Acesso completo por 1 mês'
      },
      quarterly: {
        title: 'Z Player - Plano Trimestral',
        price: 70.00,
        description: 'Acesso completo por 3 meses - Economize R$ 20'
      }
    };

    const plan = plans[planType as keyof typeof plans];
    if (!plan) {
      throw new Error('Plano inválido');
    }

    // Aplicar desconto se houver cupom (validação APENAS no servidor - nunca confiar no cliente)
    let finalPrice = plan.price;
    let title = plan.title;
    
    let appliedDiscount = 0;
    const normalizedCoupon = typeof couponCode === 'string' ? couponCode.toUpperCase().trim() : null;

    if (planType === 'monthly' && normalizedCoupon) {
      // Validação obrigatória no servidor - sem fallback para valores do cliente
      if (!supabaseUrl || !supabaseServiceKey) {
        console.error('Missing Supabase credentials - cannot validate coupon securely');
        // NÃO aplicar desconto se não puder validar no servidor
        console.log('Cupom ignorado por falta de credenciais do servidor:', { code: normalizedCoupon });
      } else {
        try {
          const supabase = createClient(supabaseUrl, supabaseServiceKey);
          const { data: coupon, error: couponError } = await supabase
            .from('coupons')
            .select('code, discount_percent, is_redeemed')
            .eq('code', normalizedCoupon)
            .eq('is_redeemed', false)
            .single();

          if (!couponError && coupon) {
            // Usar desconto do banco de dados, NUNCA do cliente
            appliedDiscount = coupon.discount_percent || 30;
            console.log('Cupom válido (server-validated):', { code: normalizedCoupon, discount: appliedDiscount });
          } else {
            // Cupom inválido ou já utilizado - NÃO aplicar nenhum desconto
            console.log('Cupom inválido ou já utilizado - nenhum desconto aplicado:', { code: normalizedCoupon, error: couponError?.message });
          }
        } catch (e) {
          // Erro na validação - NÃO aplicar desconto por segurança
          console.error('Erro ao validar cupom no servidor - nenhum desconto aplicado:', e);
        }
      }
    }

    if (appliedDiscount > 0) {
      finalPrice = Math.round((plan.price * (1 - appliedDiscount / 100)) * 100) / 100;
      title = `${plan.title} - Cupom ${normalizedCoupon} (${appliedDiscount}% OFF)`;
    }

    console.log('Criando preferência para:', title);

    // Cria a preferência de pagamento no Mercado Pago
    const preferenceData = {
      items: [
        {
          title: title,
          description: plan.description,
          quantity: 1,
          unit_price: finalPrice,
          currency_id: 'BRL'
        }
      ],
      payer: {
        email: email,
        phone: {
          number: whatsapp
        }
      },
      back_urls: {
        success: `${req.headers.get('origin')}/pagamento/sucesso`,
        failure: `${req.headers.get('origin')}/pagamento/falha`,
        pending: `${req.headers.get('origin')}/pagamento/pendente`
      },
      auto_return: 'approved',
      payment_methods: {
        installments: planType === 'quarterly' ? 3 : 1,
        default_installments: 1
      },
      statement_descriptor: 'ZPLAYER',
      external_reference: `${planType}_${Date.now()}`,
      metadata: {
        whatsapp: whatsapp,
        email: email,
        coupon_code: normalizedCoupon || ''
      }
    };

    const response = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(preferenceData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Erro Mercado Pago:', errorText);
      throw new Error(`Erro ao criar preferência: ${response.status}`);
    }

    const preference = await response.json();
    console.log('Preferência criada:', preference.id);

    // Salvar informações do pagamento no banco de dados
    if (supabaseUrl && supabaseServiceKey) {
      const supabaseClient = createClient(supabaseUrl, supabaseServiceKey);
      const { error: dbError } = await supabaseClient
        .from('payments')
        .insert({
          whatsapp,
          email,
          plan_type: planType,
          coupon_code: normalizedCoupon || null,
          discount_percent: appliedDiscount,
          final_price: finalPrice,
          preference_id: preference.id,
          payment_status: 'pending'
        });

      if (dbError) {
        console.error('Erro ao salvar pagamento no banco:', dbError);
        // Continuar mesmo com erro no banco, pois o pagamento foi criado no Mercado Pago
      } else {
        console.log('Pagamento salvo no banco com sucesso');
      }
    }

    return new Response(
      JSON.stringify({ 
        preferenceId: preference.id,
        initPoint: preference.init_point 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Erro na função create-payment:', error);
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        status: 500,
        headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' }
      }
    );
  }
});
