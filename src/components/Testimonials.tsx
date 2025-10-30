import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const testimonials = [
  {
    name: "Carlos Silva",
    role: "Cliente há 2 anos",
    content: "Melhor serviço de IPTV que já usei! Qualidade excepcional e nunca trava. Recomendo!",
    rating: 5,
    avatar: "CS"
  },
  {
    name: "Maria Santos",
    role: "Cliente há 1 ano",
    content: "Adoro poder assistir meus programas favoritos em qualquer lugar. O suporte é muito atencioso!",
    rating: 5,
    avatar: "MS"
  },
  {
    name: "João Oliveira",
    role: "Cliente há 6 meses",
    content: "Preço justo, muitos canais e qualidade 4K. Minha família toda está adorando!",
    rating: 5,
    avatar: "JO"
  }
];

const Testimonials = () => {
  return (
    <section className="py-24 px-4 relative">
      <div className="container mx-auto">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            O Que Dizem Nossos Clientes
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Milhares de clientes satisfeitos em todo o Brasil
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial) => (
            <Card 
              key={testimonial.name}
              className="bg-card border-border hover:border-primary/50 transition-all duration-300 hover:scale-105"
            >
              <CardContent className="p-6 space-y-4">
                <div className="flex gap-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-primary text-primary" />
                  ))}
                </div>
                
                <p className="text-foreground leading-relaxed">
                  "{testimonial.content}"
                </p>
                
                <div className="flex items-center gap-3 pt-4 border-t border-border">
                  <Avatar className="w-12 h-12 bg-gradient-to-br from-primary to-accent">
                    <AvatarFallback className="bg-transparent text-background font-semibold">
                      {testimonial.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-foreground">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;