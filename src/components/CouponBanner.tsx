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
    <div className="fixed top-0 left-0 right-0 z-[100] bg-gradient-to-r from-primary via-accent to-primary animate-gradient bg-[length:200%_auto] shadow-lg border-b border-primary/30">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-1 justify-center">
          <span className="text-sm md:text-base font-semibold text-background">
            🎉 Oferta Especial Black Friday!
          </span>
          <div className="flex items-center gap-2 bg-background/20 backdrop-blur-sm px-4 py-2 rounded-lg border border-background/30">
            <span className="text-xs md:text-sm font-bold text-background tracking-wider">
              {couponCode}
            </span>
            <Button
              size="sm"
              variant="ghost"
              className="h-6 w-6 p-0 hover:bg-background/20 text-background"
              onClick={handleCopy}
            >
              {copied ? (
                <Check className="h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
          <span className="text-xs md:text-sm text-background hidden sm:inline">
            30% de desconto em todos os planos!
          </span>
        </div>
        <Button
          size="sm"
          variant="ghost"
          className="h-6 w-6 p-0 hover:bg-background/20 text-background shrink-0"
          onClick={() => setIsVisible(false)}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default CouponBanner;
