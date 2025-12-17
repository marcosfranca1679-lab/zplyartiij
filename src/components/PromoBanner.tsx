import promoBanner from "@/assets/promo-banner.jpg";

const PromoBanner = () => {
  return (
    <section className="w-full py-4 bg-background">
      <div className="container mx-auto px-4">
        <div className="relative w-full max-w-4xl mx-auto rounded-2xl overflow-hidden shadow-2xl shadow-primary/20 animate-fade-in">
          <img 
            src={promoBanner} 
            alt="Z Player - Cansado de pagar caro por pouco conteúdo? Tenha filmes, séries, animes e canais ao vivo em um só lugar!" 
            className="w-full h-auto object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/30 to-transparent pointer-events-none" />
        </div>
      </div>
    </section>
  );
};

export default PromoBanner;
