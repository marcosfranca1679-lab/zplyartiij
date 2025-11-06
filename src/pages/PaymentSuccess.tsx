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
          <div className="bg-accent/20 border border-accent rounded-lg p-6 space-y-3">
            <p className="text-foreground font-semibold text-lg">
              Próximo Passo Importante:
            </p>
            <p className="text-foreground">
              Acesse nosso site e clique no botão <span className="font-bold text-primary">"Liberar Acesso"</span> para que seu usuário e senha sejam gerados automaticamente.
            </p>
          </div>
          <p className="text-sm text-muted-foreground">
            Em breve você receberá um email com as instruções de acesso.
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