import { useState } from "react";
import { X, Copy, Check } from "lucide-react";
import { Button } from "./ui/button";
import { useToast } from "@/hooks/use-toast";

const CouponBanner = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [copied, setCopied] = useState(false);
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
    <div className="fixed top-0 left-0 right-0 z-[100] bg-gradient-to-r from-primary via-accent to-primary animate-gradient bg-[length:200%_auto] shadow-md border-b border-primary/30">
      <div className="container mx-auto px-3 py-2 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 md:gap-3 flex-1 justify-center">
          <span className="text-xs md:text-sm font-semibold text-background">
            🎉 Oferta Black Friday!
          </span>
          <div className="flex items-center gap-1.5 bg-background/20 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-background/30">
            <span className="text-xs font-bold text-background tracking-wider">
              {couponCode}
            </span>
            <Button
              size="sm"
              variant="ghost"
              className="h-5 w-5 p-0 hover:bg-background/20 text-background"
              onClick={handleCopy}
            >
              {copied ? (
                <Check className="h-3.5 w-3.5" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )}
            </Button>
          </div>
          <span className="text-xs text-background hidden md:inline">
            30% OFF em todos os planos!
          </span>
        </div>
        <Button
          size="sm"
          variant="ghost"
          className="h-5 w-5 p-0 hover:bg-background/20 text-background shrink-0"
          onClick={() => setIsVisible(false)}
        >
          <X className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
};

export default CouponBanner;
