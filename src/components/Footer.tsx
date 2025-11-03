import { Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";

const Footer = () => {
  return (
    <footer className="bg-secondary border-t border-border py-12 px-4">
      <div className="container mx-auto">
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div className="space-y-4">
            <h3 className="text-2xl font-black font-zplayer tracking-wider bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Z PLAYER
            </h3>
            <p className="text-muted-foreground text-sm">
              Streaming de alta qualidade com milhares de canais para toda a família.
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Links Rápidos</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">Início</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Planos</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Canais</a></li>
              <li><a href="https://wa.me/5548999118524?text=ola" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">Suporte</a></li>
            </ul>
          </div>
        </div>

        {/* Instagram Button */}
        <div className="pt-8 border-t border-border flex flex-col items-center gap-4">
          <a 
            href="https://www.instagram.com/zplayer_tv?igsh=MTdlazc5YXRzcGljZw==" 
            target="_blank" 
            rel="noopener noreferrer"
          >
            <Button 
              variant="outline" 
              className="group bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 border-0 text-white"
            >
              <Instagram className="w-5 h-5 mr-2" />
              Siga-nos no Instagram
            </Button>
          </a>
          <p className="text-sm text-muted-foreground">&copy; 2025 Z PLAYER. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;