import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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

        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
          <Button 
            size="lg" 
            className="bg-gradient-to-r from-primary via-accent to-primary hover:shadow-lg hover:shadow-primary/40 transition-all duration-300 text-lg px-8 text-white font-semibold"
            asChild
          >
            <a href="https://www.mediafire.com/file/gwcypcqyuxfelvw/Z+PLAYER+2.0+ARM+.apk/file" target="_blank" rel="noopener noreferrer">
              BAIXAR APP
            </a>
          </Button>
          <Button 
            size="lg" 
            variant="outline" 
            className="border-white/30 hover:bg-white/10 hover:border-white/50 text-lg px-8 text-white"
            asChild
          >
            <a href="https://wa.me/5548999118524?text=ola" target="_blank" rel="noopener noreferrer">
              SOLICITAR TESTE GRÁTIS
            </a>
          </Button>
        </div>

        <div className="mt-16 max-w-4xl mx-auto">
          <h3 className="text-2xl md:text-3xl font-bold text-center mb-8 text-foreground">
            COMO FUNCIONA NOSSO APP
          </h3>
          <div className="relative rounded-2xl overflow-hidden shadow-glow border border-primary/20" style={{ paddingBottom: '56.25%' }}>
            <iframe
              className="absolute top-0 left-0 w-full h-full"
              src="https://www.youtube.com/embed/WxzWEVnE5Qo"
              title="COMO FUNCIONA NOSSO APP"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;