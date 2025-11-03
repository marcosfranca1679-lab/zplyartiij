import { useState } from "react";
import { X, Copy, Check, Sparkles, Info } from "lucide-react";
import { Button } from "./ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const CouponBanner = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [copied, setCopied] = useState(false);
  const [termsOpen, setTermsOpen] = useState(false);
  const { toast } = useToast();
  const couponCode = "BLACKZ30%";

  const handleCopy = () => {
    navigator.clipboard.writeText(couponCode);
    setCopied(true);
    toast({
      title: "Cupom copiado!",
      description: "O código foi copiado para a área de transferência.",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] backdrop-blur-md bg-gradient-to-r from-background/95 via-card/95 to-background/95 border-b border-primary/20 shadow-[0_4px_20px_rgba(13,203,237,0.15)]">
      <div className="container mx-auto px-3 py-2.5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 md:gap-4 flex-1 justify-center">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary animate-pulse" />
            <span className="text-xs md:text-sm font-semibold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Black Friday
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent rounded-lg opacity-20 blur-sm group-hover:opacity-30 transition-opacity"></div>
              <div className="relative flex items-center gap-2 bg-card/80 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-primary/30 hover:border-primary/50 transition-all duration-300">
                <span className="text-xs md:text-sm font-mono font-bold text-primary tracking-wider">
                  {couponCode}
                </span>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-5 w-5 p-0 hover:bg-primary/10 text-primary transition-all duration-200 hover:scale-110"
                  onClick={handleCopy}
                >
                  {copied ? (
                    <Check className="h-3.5 w-3.5 text-green-500" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                </Button>
              </div>
            </div>
            
            <Dialog open={termsOpen} onOpenChange={setTermsOpen}>
              <DialogTrigger asChild>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-7 px-2 hover:bg-primary/10 text-muted-foreground hover:text-primary transition-all duration-200"
                >
                  <Info className="h-3.5 w-3.5 mr-1" />
                  <span className="text-xs font-medium">Termos</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    Termos do Cupom
                  </DialogTitle>
                  <DialogDescription className="text-left space-y-3 pt-4">
                    <p className="text-foreground">
                      Cupom válido apenas para a primeira compra, válido até dia <span className="font-semibold text-primary">01/12</span>
                    </p>
                    <div className="flex items-center gap-2 p-3 bg-primary/10 rounded-lg border border-primary/20">
                      <span className="text-sm font-semibold text-foreground">CUPONS RESTANTES:</span>
                      <span className="text-2xl font-bold text-primary">32</span>
                    </div>
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </div>
          
          <span className="text-xs text-muted-foreground hidden md:inline font-medium">
            30% OFF • Todos os planos
          </span>
        </div>
        
        <Button
          size="sm"
          variant="ghost"
          className="h-6 w-6 p-0 hover:bg-primary/10 text-muted-foreground hover:text-foreground shrink-0 transition-all duration-200 hover:rotate-90"
          onClick={() => setIsVisible(false)}
        >
          <X className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
};

export default CouponBanner;
