import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

const PaymentPending = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Scroll to top on mount
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-b from-background via-secondary/30 to-background">
      <div className="max-w-md w-full text-center space-y-8">
        <div className="flex justify-center">
          <div className="w-24 h-24 rounded-full bg-yellow-500/20 flex items-center justify-center">
            <Clock className="w-16 h-16 text-yellow-500" />
          </div>
        </div>

        <div className="space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent">
            Pagamento Pendente
          </h1>
          <p className="text-xl text-muted-foreground">
            Seu pagamento está sendo processado
          </p>
          <p className="text-foreground">
            Estamos aguardando a confirmação do pagamento. Você receberá um email assim que for aprovado. Isso pode levar alguns minutos.
          </p>
        </div>

        <div className="space-y-4">
          <Button 
            onClick={() => navigate("/")}
            className="w-full bg-gradient-to-r from-primary to-accent hover:shadow-glow"
            size="lg"
          >
            Voltar para Home
          </Button>
          <p className="text-sm text-muted-foreground">
            Tem dúvidas? Entre em contato pelo WhatsApp
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentPending;