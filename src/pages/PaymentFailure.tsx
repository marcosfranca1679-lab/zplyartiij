import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const PaymentFailure = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Scroll to top on mount
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-b from-background via-secondary/30 to-background">
      <div className="max-w-md w-full text-center space-y-8">
        <div className="flex justify-center">
          <div className="w-24 h-24 rounded-full bg-destructive/20 flex items-center justify-center">
            <XCircle className="w-16 h-16 text-destructive" />
          </div>
        </div>

        <div className="space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-destructive to-orange-500 bg-clip-text text-transparent">
            Pagamento Recusado
          </h1>
          <p className="text-xl text-muted-foreground">
            Ops! Algo deu errado.
          </p>
          <p className="text-foreground">
            Seu pagamento não foi processado. Não se preocupe, nenhum valor foi cobrado. Tente novamente ou entre em contato conosco.
          </p>
        </div>

        <div className="space-y-4">
          <Button 
            onClick={() => navigate("/#pricing")}
            className="w-full bg-gradient-to-r from-primary to-accent hover:shadow-glow"
            size="lg"
          >
            Tentar Novamente
          </Button>
          <Button 
            onClick={() => navigate("/")}
            variant="outline"
            className="w-full"
            size="lg"
          >
            Voltar para Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailure;