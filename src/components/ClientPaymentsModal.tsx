import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Calendar, CreditCard, Share2, Plus, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface ClientPayment {
  id: string;
  payment_month: string;
  payment_type: string;
  amount: number;
  paid_at: string;
}

interface Client {
  id: string;
  name: string;
  phone: string;
  email: string;
  client_code: string;
  subscription_type: string;
  registration_date: string;
  username: string | null;
  password_hash: string | null;
  has_loyalty: boolean;
}

interface ClientPaymentsModalProps {
  client: Client | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const MONTHLY_PRICE = 29.90;
const QUARTERLY_PRICE = 74.90;

export const ClientPaymentsModal = ({ client, open, onOpenChange }: ClientPaymentsModalProps) => {
  const [payments, setPayments] = useState<ClientPayment[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (client && open) {
      fetchPayments();
    }
  }, [client, open]);

  const fetchPayments = async () => {
    if (!client) return;

    setLoading(true);
    const { data, error } = await supabase
      .from("client_payments")
      .select("*")
      .eq("client_id", client.id)
      .order("payment_month", { ascending: false });

    if (!error && data) {
      setPayments(data);
    }
    setLoading(false);
  };

  const handleRenewal = async (type: "monthly" | "quarterly") => {
    if (!client) return;

    const now = new Date();
    const paymentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const amount = type === "monthly" ? MONTHLY_PRICE : QUARTERLY_PRICE;

    try {
      const { error } = await supabase.from("client_payments").insert({
        client_id: client.id,
        payment_month: paymentMonth.toISOString().split('T')[0],
        payment_type: type,
        amount: amount,
        created_by: (await supabase.auth.getUser()).data.user?.id,
      });

      if (error) {
        toast({
          title: "Erro ao registrar pagamento",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Pagamento registrado!",
          description: `Renovação ${type === "monthly" ? "mensal" : "trimestral"} registrada com sucesso`,
        });
        fetchPayments();
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro inesperado",
        variant: "destructive",
      });
    }
  };

  const handleDeletePayment = async (paymentId: string) => {
    try {
      const { error } = await supabase
        .from("client_payments")
        .delete()
        .eq("id", paymentId);

      if (error) {
        toast({
          title: "Erro ao excluir",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Pagamento excluído",
          description: "O registro foi removido com sucesso",
        });
        fetchPayments();
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro inesperado",
        variant: "destructive",
      });
    }
  };

  const handleShareReceipt = async (payment: ClientPayment) => {
    if (!client) return;

    const paymentDate = new Date(payment.payment_month);
    const monthName = format(paymentDate, "MMMM 'de' yyyy", { locale: ptBR });
    const paidAtFormatted = format(new Date(payment.paid_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });

    const receiptText = `📺 *ZPlayer IPTV - Comprovante de Pagamento*

👤 *Cliente:* ${client.name}
📞 *Telefone:* ${client.phone}
📧 *Email:* ${client.email}
🔢 *Código:* ${client.client_code}

💳 *Detalhes do Pagamento:*
📅 Mês Referência: ${monthName.charAt(0).toUpperCase() + monthName.slice(1)}
📋 Tipo: ${payment.payment_type === "monthly" ? "Mensal" : "Trimestral"}
💰 Valor: R$ ${payment.amount.toFixed(2).replace('.', ',')}
🕐 Pago em: ${paidAtFormatted}

✅ *STATUS: PAGO*

---
ZPlayer IPTV - Obrigado pela preferência!`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Comprovante de Pagamento - ZPlayer IPTV",
          text: receiptText,
        });
      } catch (error) {
        await navigator.clipboard.writeText(receiptText);
        toast({
          title: "Copiado!",
          description: "Comprovante copiado para a área de transferência",
        });
      }
    } else {
      await navigator.clipboard.writeText(receiptText);
      toast({
        title: "Copiado!",
        description: "Comprovante copiado para a área de transferência",
      });
    }
  };

  const formatMonthYear = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "MMMM 'de' yyyy", { locale: ptBR });
  };

  if (!client) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-900 border-gray-700 max-w-lg max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-green-500" />
            Pagamentos - {client.name}
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Histórico de pagamentos e renovação
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 flex-1 overflow-auto">
          {/* Botões de Renovação */}
          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={() => handleRenewal("monthly")}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Renovar Mensal
              <span className="ml-1 text-xs opacity-80">(R$ {MONTHLY_PRICE.toFixed(2).replace('.', ',')})</span>
            </Button>
            <Button
              onClick={() => handleRenewal("quarterly")}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Renovar Trimestral
              <span className="ml-1 text-xs opacity-80">(R$ {QUARTERLY_PRICE.toFixed(2).replace('.', ',')})</span>
            </Button>
          </div>

          {/* Histórico de Pagamentos */}
          <div className="border-t border-gray-700 pt-4">
            <h3 className="text-white font-medium mb-3 flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Histórico de Pagamentos
            </h3>

            {loading ? (
              <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-500"></div>
              </div>
            ) : payments.length === 0 ? (
              <p className="text-gray-500 text-center py-4">
                Nenhum pagamento registrado
              </p>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {payments.map((payment) => (
                  <div
                    key={payment.id}
                    className="bg-gray-800 rounded-lg p-3 flex items-center justify-between"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-white font-medium capitalize">
                          {formatMonthYear(payment.payment_month)}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                          payment.payment_type === "monthly" 
                            ? "bg-green-500/20 text-green-400" 
                            : "bg-blue-500/20 text-blue-400"
                        }`}>
                          {payment.payment_type === "monthly" ? "Mensal" : "Trimestral"}
                        </span>
                      </div>
                      <div className="text-gray-400 text-sm">
                        R$ {payment.amount.toFixed(2).replace('.', ',')} • {format(new Date(payment.paid_at), "dd/MM/yyyy", { locale: ptBR })}
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleShareReceipt(payment)}
                        className="h-8 w-8 p-0 text-green-500 hover:text-green-400 hover:bg-green-500/10"
                        title="Compartilhar comprovante"
                      >
                        <Share2 className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeletePayment(payment.id)}
                        className="h-8 w-8 p-0 text-red-500 hover:text-red-400 hover:bg-red-500/10"
                        title="Excluir pagamento"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
