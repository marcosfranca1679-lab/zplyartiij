import { Card, CardContent } from "@/components/ui/card";
import { CreditCard, Download, Tv } from "lucide-react";

const steps = [
  {
    icon: CreditCard,
    title: "Escolha seu Plano",
    description: "Selecione o plano perfeito para você e sua família"
  },
  {
    icon: Download,
    title: "Receba as Credenciais",
    description: "Após o pagamento, receba imediatamente suas credenciais de acesso"
  },
  {
    icon: Tv,
    title: "Comece a Assistir",
    description: "Configure em seus dispositivos e aproveite milhares de canais"
  }
];

const HowItWorks = () => {
  return (
    <section className="py-24 px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/30 to-background" />
      
      <div className="container mx-auto relative z-10">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Como Funciona
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Comece a assistir em apenas 3 passos simples
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={step.title} className="relative">
                <Card className="bg-card border-border hover:border-primary/50 transition-all duration-300 h-full">
                  <CardContent className="p-8 text-center space-y-4">
                    <div className="relative">
                      <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-primary to-accent p-4">
                        <Icon className="w-full h-full text-background" />
                      </div>
                      <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center font-bold text-background">
                        {index + 1}
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-foreground">{step.title}</h3>
                    <p className="text-muted-foreground">{step.description}</p>
                  </CardContent>
                </Card>
                
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-primary to-accent" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;