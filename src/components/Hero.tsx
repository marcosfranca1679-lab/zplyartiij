import { Button } from "@/components/ui/button";
import { Play, Tv, Smartphone, Monitor } from "lucide-react";
import heroImage from "@/assets/hero-iptv.jpg";
import zplayerLogo from "@/assets/zplayer-logo.png";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background with gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background z-0">
        <div 
          className="absolute inset-0 opacity-20 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
      </div>

      {/* Animated gradient orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse delay-1000" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-sm">
            <Play className="w-4 h-4 text-primary" />
            <span className="text-sm text-foreground">Streaming de Alta Qualidade</span>
          </div>

          <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <img 
              src={zplayerLogo} 
              alt="ZPLAYER Logo" 
              className="w-auto h-32 md:h-40 mx-auto drop-shadow-2xl"
            />
          </div>

          <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-150">
            IPTV Premium
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-200">
            Milhares de canais em HD e 4K. Assista onde quiser, quando quiser.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-primary to-accent hover:shadow-glow transition-all duration-300 text-lg px-8"
            >
              Começar Agora
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-primary/50 hover:bg-primary/10 text-lg px-8"
            >
              Ver Planos
            </Button>
          </div>

          {/* Device Icons */}
          <div className="flex justify-center gap-8 pt-8 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-500">
            <div className="flex flex-col items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
              <Tv className="w-8 h-8" />
              <span className="text-xs">Smart TV</span>
            </div>
            <div className="flex flex-col items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
              <Smartphone className="w-8 h-8" />
              <span className="text-xs">Celular</span>
            </div>
            <div className="flex flex-col items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
              <Monitor className="w-8 h-8" />
              <span className="text-xs">Computador</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;