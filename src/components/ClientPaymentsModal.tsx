import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Calendar, CreditCard, Share2, Plus, Trash2, Image, Download } from "lucide-react";
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

const MONTHLY_PRICE = 29.99;
const QUARTERLY_PRICE = 70.00;

export const ClientPaymentsModal = ({ client, open, onOpenChange }: ClientPaymentsModalProps) => {
  const [payments, setPayments] = useState<ClientPayment[]>([]);
  const [loading, setLoading] = useState(false);
  const [generatingImage, setGeneratingImage] = useState<string | null>(null);
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
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const paymentMonthStr = `${year}-${month}-01`;
    const amount = type === "monthly" ? MONTHLY_PRICE : QUARTERLY_PRICE;

    try {
      const { error } = await supabase.from("client_payments").insert({
        client_id: client.id,
        payment_month: paymentMonthStr,
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

  const generateReceiptImage = async (payment: ClientPayment) => {
    if (!client) return;

    setGeneratingImage(payment.id);

    const paymentDate = new Date(payment.paid_at);
    const monthName = format(paymentDate, "MMMM 'de' yyyy", { locale: ptBR });
    const paidAtFormatted = format(paymentDate, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });

    // Create canvas
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      toast({
        title: "Erro",
        description: "Não foi possível gerar a imagem",
        variant: "destructive",
      });
      setGeneratingImage(null);
      return;
    }

    // Set canvas size
    canvas.width = 600;
    canvas.height = 700;

    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#1a1a2e');
    gradient.addColorStop(1, '#16213e');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Top accent bar
    const accentGradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
    accentGradient.addColorStop(0, '#dc2626');
    accentGradient.addColorStop(1, '#ef4444');
    ctx.fillStyle = accentGradient;
    ctx.fillRect(0, 0, canvas.width, 8);

    // Header
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 28px Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('📺 ZPlayer IPTV', canvas.width / 2, 60);

    ctx.font = '16px Arial, sans-serif';
    ctx.fillStyle = '#9ca3af';
    ctx.fillText('COMPROVANTE DE PAGAMENTO', canvas.width / 2, 90);

    // Divider
    ctx.strokeStyle = '#374151';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(40, 115);
    ctx.lineTo(canvas.width - 40, 115);
    ctx.stroke();

    // Client Info Section
    ctx.textAlign = 'left';
    ctx.font = 'bold 14px Arial, sans-serif';
    ctx.fillStyle = '#dc2626';
    ctx.fillText('DADOS DO CLIENTE', 40, 150);

    ctx.font = '15px Arial, sans-serif';
    ctx.fillStyle = '#e5e7eb';
    
    let y = 180;
    const lineHeight = 30;

    ctx.fillText(`👤  Nome: ${client.name}`, 40, y);
    y += lineHeight;
    ctx.fillText(`📞  Telefone: ${client.phone}`, 40, y);
    y += lineHeight;
    ctx.fillText(`📧  Email: ${client.email}`, 40, y);
    y += lineHeight;
    ctx.fillText(`🔢  Código: ${client.client_code}`, 40, y);

    // Divider
    y += 30;
    ctx.strokeStyle = '#374151';
    ctx.beginPath();
    ctx.moveTo(40, y);
    ctx.lineTo(canvas.width - 40, y);
    ctx.stroke();

    // Payment Details Section
    y += 35;
    ctx.font = 'bold 14px Arial, sans-serif';
    ctx.fillStyle = '#dc2626';
    ctx.fillText('DETALHES DO PAGAMENTO', 40, y);

    y += 30;
    ctx.font = '15px Arial, sans-serif';
    ctx.fillStyle = '#e5e7eb';

    ctx.fillText(`📅  Mês Referência: ${monthName.charAt(0).toUpperCase() + monthName.slice(1)}`, 40, y);
    y += lineHeight;
    ctx.fillText(`📋  Tipo: ${payment.payment_type === "monthly" ? "Mensal" : "Trimestral"}`, 40, y);
    y += lineHeight;

    // Amount highlight box
    y += 10;
    ctx.fillStyle = 'rgba(34, 197, 94, 0.15)';
    ctx.fillRect(40, y - 25, canvas.width - 80, 45);
    ctx.strokeStyle = '#22c55e';
    ctx.lineWidth = 2;
    ctx.strokeRect(40, y - 25, canvas.width - 80, 45);

    ctx.font = 'bold 22px Arial, sans-serif';
    ctx.fillStyle = '#22c55e';
    ctx.textAlign = 'center';
    ctx.fillText(`💰 R$ ${payment.amount.toFixed(2).replace('.', ',')}`, canvas.width / 2, y + 5);

    ctx.textAlign = 'left';
    y += 55;
    ctx.font = '15px Arial, sans-serif';
    ctx.fillStyle = '#e5e7eb';
    ctx.fillText(`🕐  Pago em: ${paidAtFormatted}`, 40, y);

    // Status badge
    y += 50;
    ctx.fillStyle = 'rgba(34, 197, 94, 0.2)';
    const badgeWidth = 180;
    const badgeX = (canvas.width - badgeWidth) / 2;
    ctx.beginPath();
    ctx.roundRect(badgeX, y - 25, badgeWidth, 40, 20);
    ctx.fill();

    ctx.font = 'bold 18px Arial, sans-serif';
    ctx.fillStyle = '#22c55e';
    ctx.textAlign = 'center';
    ctx.fillText('✅ PAGO', canvas.width / 2, y + 2);

    // Footer
    ctx.fillStyle = '#6b7280';
    ctx.font = '12px Arial, sans-serif';
    ctx.fillText('ZPlayer IPTV - Obrigado pela preferência!', canvas.width / 2, canvas.height - 50);

    const now = new Date();
    ctx.fillStyle = '#4b5563';
    ctx.font = '10px Arial, sans-serif';
    ctx.fillText(`Gerado em ${format(now, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}`, canvas.width / 2, canvas.height - 30);

    // Convert to blob and share/download
    canvas.toBlob(async (blob) => {
      if (!blob) {
        toast({
          title: "Erro",
          description: "Não foi possível gerar a imagem",
          variant: "destructive",
        });
        setGeneratingImage(null);
        return;
      }

      const file = new File([blob], `comprovante-${client.name.replace(/\s+/g, '-')}-${format(paymentDate, 'MM-yyyy')}.png`, { type: 'image/png' });

      // Try to share if supported
      if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({
            title: 'Comprovante de Pagamento - ZPlayer IPTV',
            files: [file],
          });
          toast({
            title: "Sucesso!",
            description: "Comprovante compartilhado",
          });
        } catch (error) {
          // User cancelled or share failed, download instead
          downloadImage(blob, file.name);
        }
      } else {
        // Download fallback
        downloadImage(blob, file.name);
      }

      setGeneratingImage(null);
    }, 'image/png');
  };

  const downloadImage = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Download concluído!",
      description: "O comprovante foi baixado com sucesso",
    });
  };

  const handleShareReceipt = async (payment: ClientPayment) => {
    if (!client) return;

    const paymentDate = new Date(payment.paid_at);
    const monthName = format(paymentDate, "MMMM 'de' yyyy", { locale: ptBR });
    const paidAtFormatted = format(paymentDate, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });

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
    const date = new Date(dateString + 'T00:00:00');
    return format(date, "MMMM 'de' yyyy", { locale: ptBR });
  };

  if (!client) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border max-w-lg max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-foreground flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-green-500" />
            Pagamentos - {client.name}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Histórico de pagamentos e renovação
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 flex-1 overflow-auto">
          {/* Botões de Renovação */}
          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <Button
              onClick={() => handleRenewal("monthly")}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white flex items-center justify-center gap-2"
            >
              <Plus className="h-4 w-4 shrink-0" />
              <span>Mensal</span>
              <span className="text-xs opacity-80">(R$ {MONTHLY_PRICE.toFixed(2).replace('.', ',')})</span>
            </Button>
            <Button
              onClick={() => handleRenewal("quarterly")}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-2"
            >
              <Plus className="h-4 w-4 shrink-0" />
              <span>Trimestral</span>
              <span className="text-xs opacity-80">(R$ {QUARTERLY_PRICE.toFixed(2).replace('.', ',')})</span>
            </Button>
          </div>

          {/* Histórico de Pagamentos */}
          <div className="border-t border-border pt-4">
            <h3 className="text-foreground font-medium mb-3 flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Histórico de Pagamentos
            </h3>

            {loading ? (
              <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-500"></div>
              </div>
            ) : payments.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                Nenhum pagamento registrado
              </p>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {payments.map((payment) => (
                  <div
                    key={payment.id}
                    className="bg-secondary/50 rounded-lg p-3 flex items-center justify-between"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-foreground font-medium capitalize">
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
                      <div className="text-muted-foreground text-sm">
                        R$ {payment.amount.toFixed(2).replace('.', ',')} • {format(new Date(payment.paid_at), "dd/MM/yyyy", { locale: ptBR })}
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => generateReceiptImage(payment)}
                        disabled={generatingImage === payment.id}
                        className="h-8 w-8 p-0 text-blue-500 hover:text-blue-400 hover:bg-blue-500/10"
                        title="Gerar comprovante em imagem"
                      >
                        {generatingImage === payment.id ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent" />
                        ) : (
                          <Image className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleShareReceipt(payment)}
                        className="h-8 w-8 p-0 text-green-500 hover:text-green-400 hover:bg-green-500/10"
                        title="Compartilhar comprovante em texto"
                      >
                        <Share2 className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeletePayment(payment.id)}
                        className="h-8 w-8 p-0 text-destructive hover:text-destructive/80 hover:bg-destructive/10"
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
