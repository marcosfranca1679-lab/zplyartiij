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
    "3 telas simultâneas",
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

        <div className="max-w-md mx-auto">
          <Card className="relative transition-all duration-300 hover:scale-105 border-primary shadow-glow bg-gradient-to-b from-card to-secondary">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-primary to-accent rounded-full text-xs font-semibold">
              PLANO ÚNICO
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
              >
                Assinar Agora
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Pricing;