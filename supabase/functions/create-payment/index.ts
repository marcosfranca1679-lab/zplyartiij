import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { planType } = await req.json();
    const accessToken = Deno.env.get('MERCADO_PAGO_ACCESS_TOKEN');

    if (!accessToken) {
      throw new Error('Mercado Pago access token não configurado');
    }

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

    console.log('Criando preferência para:', plan.title);

    // Cria a preferência de pagamento no Mercado Pago
    const preferenceData = {
      items: [
        {
          title: plan.title,
          description: plan.description,
          quantity: 1,
          unit_price: plan.price,
          currency_id: 'BRL'
        }
      ],
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
      external_reference: `${planType}_${Date.now()}`
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