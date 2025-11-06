import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.78.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { planType, couponCode, discountPercent, whatsapp, email } = body;
    
    console.log('Received payment request:', { planType, couponCode, discountPercent, whatsapp, email, fullBody: body });
    
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

    // Aplicar desconto se houver cupom (validação no servidor)
    let finalPrice = plan.price;
    let title = plan.title;
    
    let appliedDiscount = 0;
    const normalizedCoupon = typeof couponCode === 'string' ? couponCode.toUpperCase().trim() : null;

    if (planType === 'monthly' && normalizedCoupon) {
      try {
        const clientDiscount = Number(discountPercent);
        if (supabaseUrl && supabaseServiceKey) {
          const supabase = createClient(supabaseUrl, supabaseServiceKey);
          const { data: coupon, error: couponError } = await supabase
            .from('coupons')
            .select('code,is_redeemed')
            .eq('code', normalizedCoupon)
            .eq('is_redeemed', false)
            .single();

          if (!couponError && coupon) {
            appliedDiscount = 30;
            console.log('Aplicando cupom (server-validated):', { code: normalizedCoupon, discount: appliedDiscount });
          } else {
            console.log('Cupom inválido ou já utilizado no servidor:', { code: normalizedCoupon, couponError });
            if (clientDiscount > 0) {
              appliedDiscount = clientDiscount;
              console.log('Aplicando cupom (fallback client após falha no servidor):', { code: normalizedCoupon, discount: appliedDiscount });
            }
          }
        } else if (clientDiscount > 0) {
          // Fallback caso variáveis não estejam definidas
          appliedDiscount = clientDiscount;
          console.log('Aplicando cupom (fallback client - env ausente):', { code: normalizedCoupon, discount: appliedDiscount });
        }
      } catch (e) {
        console.log('Erro ao validar cupom no servidor, usando fallback se disponível', e);
        const clientDiscount = Number(discountPercent);
        if (clientDiscount > 0) {
          appliedDiscount = clientDiscount;
          console.log('Aplicando cupom (fallback client - erro):', { code: normalizedCoupon, discount: appliedDiscount });
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
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});