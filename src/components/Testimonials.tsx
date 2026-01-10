import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";

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
  },
  {
    name: "Ana Paula Costa",
    role: "Cliente há 3 anos",
    content: "Excelente qualidade de imagem e som. Nunca fico sem assistir meus jogos favoritos!",
    rating: 5,
    avatar: "AP"
  },
  {
    name: "Roberto Alves",
    role: "Cliente há 1 ano e meio",
    content: "Muito bom! Estabilidade ótima e variedade de canais. Vale muito a pena!",
    rating: 5,
    avatar: "RA"
  },
  {
    name: "Patricia Lima",
    role: "Cliente há 8 meses",
    content: "Ótimo serviço! Só achei que poderia ter mais canais internacionais, mas no geral estou muito satisfeita.",
    rating: 4,
    avatar: "PL"
  },
  {
    name: "Fernando Santos",
    role: "Cliente há 2 anos",
    content: "Uso diariamente e nunca me decepcionei. Qualidade impecável e suporte sempre disponível!",
    rating: 5,
    avatar: "FS"
  },
  {
    name: "Juliana Mendes",
    role: "Cliente há 5 meses",
    content: "Muito satisfeita! A instalação foi super fácil e funciona perfeitamente em todos os dispositivos.",
    rating: 5,
    avatar: "JM"
  },
  {
    name: "Ricardo Ferreira",
    role: "Cliente há 1 ano",
    content: "Bom custo-benefício. Às vezes demora um pouco para carregar, mas a qualidade compensa.",
    rating: 4,
    avatar: "RF"
  },
  {
    name: "Camila Rodrigues",
    role: "Cliente há 4 meses",
    content: "Adorei! Finalmente posso assistir todas as séries que quero sem interrupções.",
    rating: 5,
    avatar: "CR"
  },
  {
    name: "Lucas Pereira",
    role: "Cliente há 3 anos",
    content: "Serviço confiável e de qualidade. Recomendo para quem busca entretenimento de verdade!",
    rating: 5,
    avatar: "LP"
  },
  {
    name: "Beatriz Souza",
    role: "Cliente há 7 meses",
    content: "Muito bom! A qualidade 4K é excelente. Só gostaria de mais opções de filmes clássicos.",
    rating: 4,
    avatar: "BS"
  }
];

const Testimonials = () => {
  return (
    <section className="py-24 px-4 relative">
      <div className="container mx-auto max-w-4xl space-y-8">
        <Card className="bg-card/50 backdrop-blur border-border shadow-glow">
          <CardContent className="p-8">
            <div className="text-center mb-6 space-y-2">
              <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                O Que Dizem Nossos Clientes
              </h2>
              <p className="text-sm text-muted-foreground">
                Milhares de clientes satisfeitos em todo o Brasil
              </p>
            </div>

            <ScrollArea className="h-[500px] pr-4">
              <div className="grid md:grid-cols-2 gap-6">
                {testimonials.map((testimonial) => (
                  <Card 
                    key={testimonial.name}
                    className="bg-background border-border hover:border-primary/50 transition-all duration-300"
                  >
                    <CardContent className="p-4 space-y-3">
                      <div className="flex gap-1">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                        ))}
                      </div>
                      
                      <p className="text-foreground text-sm leading-relaxed">
                        "{testimonial.content}"
                      </p>
                      
                      <div className="flex items-center gap-3 pt-3 border-t border-border">
                        <Avatar className="w-10 h-10 bg-gradient-to-br from-primary to-accent">
                          <AvatarFallback className="bg-transparent text-background font-semibold text-xs">
                            {testimonial.avatar}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold text-foreground text-sm">{testimonial.name}</p>
                          <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        <div>
          <h3 className="text-2xl md:text-3xl font-bold text-center mb-6 text-foreground">
            DICAS PARA TRAVAMENTO
          </h3>
          <div className="relative rounded-xl overflow-hidden shadow-glow border border-primary/20" style={{ paddingBottom: '56.25%' }}>
            <iframe
              className="absolute top-0 left-0 w-full h-full"
              src="https://www.youtube.com/embed/JL1B_W3fCiw?rel=0"
              title="DICAS PARA TRAVAMENTO"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;