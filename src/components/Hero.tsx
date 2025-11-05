import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tv, Smartphone, Monitor } from "lucide-react";
import SignalQuality from "./SignalQuality";
import OnlineUsers from "./OnlineUsers";
import heroImage from "@/assets/hero-iptv.jpg";
import zplayerLogo from "@/assets/zplayer-logo-new.png";
import premiereLogo from "@/assets/premiere-logo.png";
import sportvLogo from "@/assets/sportv-logo.jpg";
import netflixLogo from "@/assets/netflix-logo.jpg";
import primeLogo from "@/assets/prime-logo.png";
import discoveryLogo from "@/assets/discovery-logo.jpg";
import globoplayLogo from "@/assets/globoplay-logo.png";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16 md:pt-20">
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
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <img 
              src={zplayerLogo} 
              alt="ZPLAYER Logo" 
              className="w-auto h-40 md:h-52 mx-auto drop-shadow-2xl"
            />
          </div>

          {/* Streaming Quality Badge */}
          <div className="flex justify-center animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-100">
            <Badge variant="secondary" className="text-sm md:text-base px-4 py-2 bg-primary/20 border-primary/30 text-primary-foreground">
              Streaming de Alta Qualidade
            </Badge>
          </div>

          {/* Signal Quality Indicator */}
          <div className="flex flex-col sm:flex-row justify-center gap-4 animate-fade-in">
            <SignalQuality />
            <OnlineUsers />
          </div>

          <h1 className="text-5xl md:text-7xl font-black font-zplayer tracking-wider bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-150">
            Z PLAYER
          </h1>

          {/* Channel Logos */}
          <div className="flex flex-wrap justify-center items-center gap-4 md:gap-6 px-4 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-200">
            <img src={premiereLogo} alt="Premiere" className="h-8 md:h-10 w-auto object-contain rounded hover:scale-110 transition-transform" />
            <img src={sportvLogo} alt="SporTV" className="h-8 md:h-10 w-auto object-contain rounded hover:scale-110 transition-transform" />
            <img src={netflixLogo} alt="Netflix" className="h-8 md:h-10 w-auto object-contain rounded hover:scale-110 transition-transform" />
            <img src={primeLogo} alt="Prime Video" className="h-8 md:h-10 w-auto object-contain rounded hover:scale-110 transition-transform" />
            <img src={discoveryLogo} alt="Discovery" className="h-8 md:h-10 w-auto object-contain rounded hover:scale-110 transition-transform" />
            <img src={globoplayLogo} alt="Globoplay" className="h-8 md:h-10 w-auto object-contain rounded hover:scale-110 transition-transform" />
          </div>

          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300">
            Milhares de canais em HD e 4K. Assista onde quiser, quando quiser.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-400">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-primary to-accent hover:shadow-glow transition-all duration-300 text-lg px-8"
              onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Começar Agora
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-primary/50 hover:bg-primary/10 text-lg px-8"
              onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Ver Planos
            </Button>
          </div>

          {/* Device Icons */}
          <div className="flex justify-center gap-8 pt-8 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-600">
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