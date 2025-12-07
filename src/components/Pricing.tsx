import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Check, Loader2, CreditCard, Tag } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { toast } from "sonner";

const plan = {
  name: "Completo",
  price: "R$ 29,99",
  period: "/mês",
  description: "Acesso completo a todos os recursos",
  features: [
    "Mais de 20.000 canais",
    "Qualidade 4K Ultra HD",
    "1 tela simultânea",
    "Suporte 24/7",
    "Sem anúncios",
    "Filmes e séries on demand",
    "Canais internacionais"
  ]
};

const plans = {
  monthly: {
    name: "Plano Mensal",
    price: "R$ 29,99",
    period: "/mês",
    total: "R$ 29,99",
    description: "Acesso completo por 1 mês",
  },
  quarterly: {
    name: "Plano Trimestral",
    price: "R$ 23,33",
    period: "/mês",
    total: "R$ 70,00",
    originalTotal: "R$ 90,00",
    description: "Acesso completo por 3 meses",
    savings: "Economize R$ 20,00"
  }
};

const Pricing = () => {
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'quarterly' | null>(null);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number } | null>(null);
  const [validatingCoupon, setValidatingCoupon] = useState(false);
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");

  const handlePayment = async (planType: 'monthly' | 'quarterly') => {
    // Validação de WhatsApp (apenas números, mínimo 10 dígitos)
    const whatsappClean = whatsapp.replace(/\D/g, '');
    if (!whatsappClean || whatsappClean.length < 10 || whatsappClean.length > 11) {
      toast.error("WhatsApp inválido. Use apenas números (DDD + número)");
      return;
    }

    // Validação de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      toast.error("Email inválido");
      return;
    }

    setLoadingPlan(planType);
    
    try {
      const requestBody: any = { 
        planType,
        whatsapp: whatsapp.replace(/\D/g, '').trim(),
        email: email.trim().toLowerCase()
      };
      
      // Incluir cupom no request (mesmo que o usuário não tenha clicado em "Aplicar")
      if (planType === 'monthly' && couponCode.trim()) {
        requestBody.couponCode = couponCode.trim().toUpperCase();
      }
      // Se o cupom já foi validado, enviar também o desconto esperado (apenas informativo)
      if (appliedCoupon && planType === 'monthly') {
        requestBody.discountPercent = Number(appliedCoupon.discount);
      }

      console.log('[Checkout] Sending payment request:', requestBody);

      const { data, error } = await supabase.functions.invoke('create-payment', {
        body: requestBody
      });

      if (error) throw error;

      if (data?.initPoint) {
        window.location.href = data.initPoint;
      } else {
        throw new Error('URL de pagamento não recebida');
      }
    } catch (error) {
      console.error('Erro ao criar pagamento:', error);
      toast.error('Erro ao processar pagamento. Tente novamente.');
      setLoadingPlan(null);
    }
  };

  const openCheckout = (planType: 'monthly' | 'quarterly') => {
    setSelectedPlan(planType);
    setCheckoutOpen(true);
    setCouponCode("");
    setAppliedCoupon(null);
    setWhatsapp("");
    setEmail("");
  };

  const validateCoupon = async () => {
    if (!couponCode.trim()) {
      toast.error("Digite um código de cupom");
      return;
    }

    if (selectedPlan !== 'monthly') {
      toast.error("Cupons só podem ser usados no plano mensal");
      return;
    }

    setValidatingCoupon(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('validate-coupon', {
        body: { 
          code: couponCode.trim().toUpperCase(),
          planType: selectedPlan
        }
      });

      if (error) throw error;

      if (data?.valid) {
        setAppliedCoupon({
          code: data.code,
          discount: data.discountPercent
        });
        toast.success(data.message || "Cupom aplicado com sucesso!");
      } else {
        toast.error(data?.error || "Cupom inválido");
      }
    } catch (error) {
      console.error('Erro ao validar cupom:', error);
      toast.error("Erro ao validar cupom");
    } finally {
      setValidatingCoupon(false);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
  };

  const calculateTotal = () => {
    if (!selectedPlan) return "R$ 0,00";
    
    const basePrice = selectedPlan === 'monthly' ? 29.99 : 70.00;
    
    if (appliedCoupon && selectedPlan === 'monthly') {
      const discountedPrice = basePrice * (1 - appliedCoupon.discount / 100);
      return `R$ ${discountedPrice.toFixed(2).replace('.', ',')}`;
    }
    
    return selectedPlan === 'monthly' ? "R$ 29,99" : "R$ 70,00";
  };

  const confirmCheckout = () => {
    if (selectedPlan) {
      handlePayment(selectedPlan);
    }
  };

  return (
    <section id="pricing" className="py-24 px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/30 to-background" />
      
      <div className="container mx-auto relative z-10">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Escolha Seu Plano
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Planos flexíveis para todas as necessidades. Cancele quando quiser.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Monthly Plan */}
          <Card className="relative transition-all duration-300 hover:scale-105 border-primary shadow-glow bg-gradient-to-b from-card to-secondary">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-primary to-accent rounded-full text-xs font-semibold">
              PLANO MENSAL
            </div>
            
            <CardHeader className="text-center pb-8">
              <CardTitle className="text-2xl mb-2">{plan.name}</CardTitle>
              <CardDescription className="text-muted-foreground">{plan.description}</CardDescription>
              <div className="mt-4">
                <span className="text-5xl font-bold text-foreground">{plan.price}</span>
                <span className="text-muted-foreground">{plan.period}</span>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {plan.features.map((feature) => (
                <div key={feature} className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                    <Check className="w-3 h-3 text-primary" />
                  </div>
                  <span className="text-sm text-foreground">{feature}</span>
                </div>
              ))}
            </CardContent>

            <CardFooter>
              <Button 
                className="w-full bg-gradient-to-r from-primary to-accent hover:shadow-glow"
                size="lg"
                onClick={() => openCheckout('monthly')}
                disabled={loadingPlan !== null}
              >
                Assinar Agora
              </Button>
            </CardFooter>
          </Card>

          {/* Gift Card - Quarterly Plan */}
          <Card className="relative overflow-hidden transition-all duration-300 hover:scale-105 border-accent shadow-glow bg-gradient-to-br from-accent/20 via-card to-primary/20">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-accent to-primary rounded-full text-xs font-semibold">
              CARTÃO PRESENTE
            </div>
            
            {/* Gift Card Visual Design */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/30 to-transparent rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-accent/30 to-transparent rounded-full blur-3xl" />
            
            <CardHeader className="text-center pb-6 relative z-10">
              <div className="mb-4 mx-auto w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-glow">
                <svg className="w-10 h-10 text-background" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <CardTitle className="text-2xl mb-2">Trimestral</CardTitle>
              <CardDescription className="text-muted-foreground">3 meses de acesso completo</CardDescription>
              
              <div className="mt-6 space-y-2">
                <div className="flex items-center justify-center gap-3">
                  <span className="text-2xl text-muted-foreground line-through">R$ 90,00</span>
                  <span className="px-3 py-1 bg-destructive/20 text-destructive rounded-full text-sm font-semibold">-22%</span>
                </div>
                <div>
                  <span className="text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">R$ 70</span>
                  <span className="text-muted-foreground">/trimestre</span>
                </div>
                <p className="text-sm text-primary font-medium">Economize R$ 20,00</p>
              </div>
            </CardHeader>

            <CardContent className="space-y-4 relative z-10">
              <div className="bg-card/50 backdrop-blur-sm rounded-lg p-4 space-y-3 border border-primary/20">
                {plan.features.slice(0, 5).map((feature) => (
                  <div key={feature} className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                      <Check className="w-3 h-3 text-primary" />
                    </div>
                    <span className="text-sm text-foreground">{feature}</span>
                  </div>
                ))}
                <div className="flex items-center gap-3 pt-2 border-t border-primary/20">
                  <div className="flex-shrink-0 w-5 h-5 rounded-full bg-accent/20 flex items-center justify-center">
                    <Check className="w-3 h-3 text-accent" />
                  </div>
                  <span className="text-sm text-accent font-semibold">3 meses de entretenimento</span>
                </div>
              </div>
            </CardContent>

            <CardFooter className="relative z-10">
              <Button 
                className="w-full bg-gradient-to-r from-accent to-primary hover:shadow-glow text-background font-semibold"
                size="lg"
                onClick={() => openCheckout('quarterly')}
                disabled={loadingPlan !== null}
              >
                Comprar Agora
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Checkout Dialog */}
        <Dialog open={checkoutOpen} onOpenChange={setCheckoutOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-primary" />
                Confirmar Assinatura
              </DialogTitle>
              <DialogDescription>
                Revise os detalhes do seu plano antes de continuar
              </DialogDescription>
            </DialogHeader>

            {selectedPlan && (
              <div className="space-y-4 py-4">
                {/* Contact Information */}
                <div className="bg-muted/30 rounded-lg p-4 space-y-3">
                  <div className="text-sm font-medium mb-2">
                    Informações de Contato
                  </div>
                  <div className="space-y-2">
                    <Input
                      placeholder="WhatsApp (ex: 11999999999)"
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value.replace(/\D/g, ''))}
                      type="tel"
                      maxLength={11}
                      required
                    />
                    <Input
                      placeholder="Email (ex: seuemail@exemplo.com)"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      type="email"
                      required
                    />
                  </div>
                </div>

                {/* Cupom Section - Only for monthly plan */}
                {selectedPlan === 'monthly' && !appliedCoupon && (
                  <div className="bg-muted/30 rounded-lg p-4 space-y-3">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <Tag className="w-4 h-4 text-primary" />
                      <span>Tem um cupom de desconto?</span>
                    </div>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Digite o código"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                        className="flex-1"
                        disabled={validatingCoupon}
                      />
                      <Button
                        onClick={validateCoupon}
                        disabled={validatingCoupon || !couponCode.trim()}
                        variant="outline"
                      >
                        {validatingCoupon ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          "Aplicar"
                        )}
                      </Button>
                    </div>
                  </div>
                )}

                {/* Applied Coupon Display */}
                {appliedCoupon && (
                  <div className="bg-accent/20 border border-accent rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Tag className="w-4 h-4 text-accent" />
                        <span className="font-medium text-sm">Cupom {appliedCoupon.code}</span>
                        <span className="text-xs bg-accent text-background px-2 py-0.5 rounded-full">
                          -{appliedCoupon.discount}%
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={removeCoupon}
                        className="h-6 px-2 text-xs"
                      >
                        Remover
                      </Button>
                    </div>
                  </div>
                )}

                <div className="bg-secondary/50 rounded-lg p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-lg">{plans[selectedPlan].name}</h3>
                      <p className="text-sm text-muted-foreground">{plans[selectedPlan].description}</p>
                    </div>
                  </div>

                  <div className="border-t border-border pt-3 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Valor base:</span>
                      <span className={appliedCoupon ? "line-through text-muted-foreground" : "font-medium"}>
                        {plans[selectedPlan].price}
                      </span>
                    </div>
                    
                    {appliedCoupon && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Desconto ({appliedCoupon.discount}%):</span>
                        <span className="text-accent font-medium">
                          -R$ {(29.99 * appliedCoupon.discount / 100).toFixed(2).replace('.', ',')}
                        </span>
                      </div>
                    )}

                    {selectedPlan === 'quarterly' && plans[selectedPlan].originalTotal && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Valor original:</span>
                        <span className="line-through text-muted-foreground">{plans[selectedPlan].originalTotal}</span>
                      </div>
                    )}

                    <div className="flex justify-between items-center pt-2 border-t border-border">
                      <span className="font-semibold">Total:</span>
                      <span className="text-2xl font-bold text-primary">{calculateTotal()}</span>
                    </div>

                    {selectedPlan === 'quarterly' && plans[selectedPlan].savings && (
                      <div className="text-center">
                        <span className="inline-block px-3 py-1 bg-accent/20 text-accent rounded-full text-sm font-medium">
                          {plans[selectedPlan].savings}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-muted/50 rounded-lg p-3 text-sm text-muted-foreground">
                  <p className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    Pagamento processado de forma segura pelo Mercado Pago
                  </p>
                </div>
              </div>
            )}

            <DialogFooter className="flex-col sm:flex-col gap-2">
              <Button
                className="w-full bg-gradient-to-r from-primary to-accent hover:shadow-glow"
                size="lg"
                onClick={confirmCheckout}
                disabled={loadingPlan !== null}
              >
                {loadingPlan ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processando...
                  </>
                ) : (
                  <>
                    <CreditCard className="mr-2 h-4 w-4" />
                    Ir para Pagamento
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setCheckoutOpen(false)}
                disabled={loadingPlan !== null}
              >
                Cancelar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Admin link */}
      <div className="mt-8 text-center">
        <a 
          href="/admin" 
          className="inline-flex items-center gap-2 px-4 py-2 text-sm text-muted-foreground bg-muted/50 hover:bg-muted rounded-lg transition-colors border border-border/50"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
            <polyline points="10 17 15 12 10 7"/>
            <line x1="15" y1="12" x2="3" y2="12"/>
          </svg>
          Login Admin
        </a>
      </div>
    </section>
  );
};

export default Pricing;