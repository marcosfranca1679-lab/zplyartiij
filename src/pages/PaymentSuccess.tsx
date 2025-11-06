import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const PaymentSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Scroll to top on mount
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-b from-background via-secondary/30 to-background">
      <div className="max-w-md w-full text-center space-y-8">
        <div className="flex justify-center">
          <div className="w-24 h-24 rounded-full bg-green-500/20 flex items-center justify-center">
            <CheckCircle className="w-16 h-16 text-green-500" />
          </div>
        </div>

        <div className="space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-500 to-primary bg-clip-text text-transparent">
            Pagamento Aprovado!
          </h1>
          <p className="text-xl text-muted-foreground">
            Obrigado pela sua compra!
          </p>
          <p className="text-foreground">
            Seu acesso ao Z Player foi ativado com sucesso. Em breve você receberá um email com as instruções de acesso.
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

export default PaymentSuccess;