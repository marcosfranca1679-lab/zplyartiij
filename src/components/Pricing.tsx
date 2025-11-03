import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";

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

const Pricing = () => {
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
                asChild
              >
                <a href="https://wa.me/5548999118524?text=ola" target="_blank" rel="noopener noreferrer">
                  Assinar Agora
                </a>
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
                  <span className="px-3 py-1 bg-destructive/20 text-destructive rounded-full text-sm font-semibold">-17%</span>
                </div>
                <div>
                  <span className="text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">R$ 75</span>
                  <span className="text-muted-foreground">/trimestre</span>
                </div>
                <p className="text-sm text-primary font-medium">Economize R$ 15,00</p>
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
                asChild
              >
                <a href="https://wa.me/5548999118524?text=Quero o plano trimestral" target="_blank" rel="noopener noreferrer">
                  Presentear Agora 🎁
                </a>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Pricing;