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

    // Load logo image
    const logo = document.createElement('img') as HTMLImageElement;
    logo.crossOrigin = 'anonymous';
    
    const logoLoaded = new Promise<void>((resolve) => {
      logo.onload = () => resolve();
      logo.onerror = () => resolve(); // Continue even if logo fails
      logo.src = '/zplayer-logo-new.png';
    });

    await logoLoaded;

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
    canvas.width = 650;
    canvas.height = 850;

    // Premium background with subtle pattern
    const bgGradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    bgGradient.addColorStop(0, '#0f0f1a');
    bgGradient.addColorStop(0.5, '#1a1a2e');
    bgGradient.addColorStop(1, '#0f0f1a');
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Decorative corner accents
    ctx.fillStyle = 'rgba(220, 38, 38, 0.08)';
    ctx.beginPath();
    ctx.arc(0, 0, 200, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(canvas.width, canvas.height, 250, 0, Math.PI * 2);
    ctx.fill();

    // Top accent bar with gradient
    const accentGradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
    accentGradient.addColorStop(0, '#b91c1c');
    accentGradient.addColorStop(0.5, '#dc2626');
    accentGradient.addColorStop(1, '#b91c1c');
    ctx.fillStyle = accentGradient;
    ctx.fillRect(0, 0, canvas.width, 6);

    // Logo and header area
    let headerY = 50;
    
    if (logo.complete && logo.naturalWidth > 0) {
      const logoSize = 80;
      const logoX = (canvas.width - logoSize) / 2;
      ctx.save();
      ctx.beginPath();
      ctx.arc(logoX + logoSize/2, headerY + logoSize/2, logoSize/2 + 4, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(220, 38, 38, 0.3)';
      ctx.fill();
      ctx.restore();
      
      ctx.save();
      ctx.beginPath();
      ctx.arc(logoX + logoSize/2, headerY + logoSize/2, logoSize/2, 0, Math.PI * 2);
      ctx.clip();
      ctx.drawImage(logo, logoX, headerY, logoSize, logoSize);
      ctx.restore();
      headerY += logoSize + 20;
    }

    // Company name
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 32px system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('ZPlayer IPTV', canvas.width / 2, headerY + 25);

    // Subtitle
    ctx.font = '600 14px system-ui, -apple-system, sans-serif';
    ctx.fillStyle = '#dc2626';
    ctx.letterSpacing = '4px';
    ctx.fillText('COMPROVANTE DE PAGAMENTO', canvas.width / 2, headerY + 55);

    // Elegant divider
    const dividerY = headerY + 80;
    const dividerGradient = ctx.createLinearGradient(60, 0, canvas.width - 60, 0);
    dividerGradient.addColorStop(0, 'rgba(220, 38, 38, 0)');
    dividerGradient.addColorStop(0.5, 'rgba(220, 38, 38, 0.6)');
    dividerGradient.addColorStop(1, 'rgba(220, 38, 38, 0)');
    ctx.strokeStyle = dividerGradient;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(60, dividerY);
    ctx.lineTo(canvas.width - 60, dividerY);
    ctx.stroke();

    // Content card background
    const cardY = dividerY + 25;
    const cardHeight = 480;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
    ctx.beginPath();
    ctx.roundRect(40, cardY, canvas.width - 80, cardHeight, 16);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Client Info Section
    let y = cardY + 40;
    ctx.textAlign = 'left';
    ctx.font = 'bold 12px system-ui, -apple-system, sans-serif';
    ctx.fillStyle = '#dc2626';
    ctx.fillText('DADOS DO CLIENTE', 65, y);

    y += 30;
    ctx.font = '15px system-ui, -apple-system, sans-serif';
    ctx.fillStyle = '#e5e7eb';
    const lineHeight = 32;

    const drawInfoRow = (label: string, value: string, yPos: number) => {
      ctx.fillStyle = '#9ca3af';
      ctx.font = '13px system-ui, -apple-system, sans-serif';
      ctx.fillText(label, 65, yPos);
      ctx.fillStyle = '#ffffff';
      ctx.font = '15px system-ui, -apple-system, sans-serif';
      ctx.fillText(value, 170, yPos);
    };

    drawInfoRow('Nome:', client.name, y);
    y += lineHeight;
    drawInfoRow('Telefone:', client.phone, y);
    y += lineHeight;
    drawInfoRow('Email:', client.email, y);
    y += lineHeight;
    drawInfoRow('Código:', client.client_code, y);

    // Section divider
    y += 35;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(65, y);
    ctx.lineTo(canvas.width - 65, y);
    ctx.stroke();

    // Payment Details Section
    y += 35;
    ctx.font = 'bold 12px system-ui, -apple-system, sans-serif';
    ctx.fillStyle = '#dc2626';
    ctx.fillText('DETALHES DO PAGAMENTO', 65, y);

    y += 30;
    drawInfoRow('Referência:', monthName.charAt(0).toUpperCase() + monthName.slice(1), y);
    y += lineHeight;
    drawInfoRow('Tipo:', payment.payment_type === "monthly" ? "Plano Mensal" : "Plano Trimestral", y);
    y += lineHeight;
    drawInfoRow('Data Pgto:', paidAtFormatted, y);

    // Amount highlight box - Premium style
    y += 45;
    const amountBoxGradient = ctx.createLinearGradient(65, y - 20, 65, y + 50);
    amountBoxGradient.addColorStop(0, 'rgba(34, 197, 94, 0.15)');
    amountBoxGradient.addColorStop(1, 'rgba(34, 197, 94, 0.05)');
    ctx.fillStyle = amountBoxGradient;
    ctx.beginPath();
    ctx.roundRect(65, y - 20, canvas.width - 130, 70, 12);
    ctx.fill();
    ctx.strokeStyle = 'rgba(34, 197, 94, 0.4)';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.font = '14px system-ui, -apple-system, sans-serif';
    ctx.fillStyle = '#9ca3af';
    ctx.textAlign = 'center';
    ctx.fillText('VALOR PAGO', canvas.width / 2, y + 5);

    ctx.font = 'bold 28px system-ui, -apple-system, sans-serif';
    ctx.fillStyle = '#22c55e';
    ctx.fillText(`R$ ${payment.amount.toFixed(2).replace('.', ',')}`, canvas.width / 2, y + 38);

    // Status badge - Premium style
    y += 100;
    const badgeText = '✓ PAGAMENTO CONFIRMADO';
    ctx.font = 'bold 18px system-ui, -apple-system, sans-serif';
    const badgeTextWidth = ctx.measureText(badgeText).width;
    const badgePadding = 40;
    const badgeWidth = badgeTextWidth + badgePadding;
    const badgeHeight = 44;
    const badgeX = (canvas.width - badgeWidth) / 2;
    const badgeY = y - badgeHeight / 2;
    
    // Badge glow effect
    ctx.shadowColor = 'rgba(34, 197, 94, 0.5)';
    ctx.shadowBlur = 20;
    ctx.fillStyle = 'rgba(34, 197, 94, 0.15)';
    ctx.beginPath();
    ctx.roundRect(badgeX, badgeY, badgeWidth, badgeHeight, badgeHeight / 2);
    ctx.fill();
    ctx.shadowBlur = 0;
    
    // Badge border
    ctx.strokeStyle = '#22c55e';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(badgeX, badgeY, badgeWidth, badgeHeight, badgeHeight / 2);
    ctx.stroke();

    // Badge text - centered
    ctx.fillStyle = '#22c55e';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(badgeText, canvas.width / 2, y);

    // Footer
    const footerY = canvas.height - 80;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(60, footerY);
    ctx.lineTo(canvas.width - 60, footerY);
    ctx.stroke();

    ctx.fillStyle = '#6b7280';
    ctx.font = '13px system-ui, -apple-system, sans-serif';
    ctx.fillText('Obrigado por escolher a ZPlayer IPTV!', canvas.width / 2, footerY + 30);

    const now = new Date();
    ctx.fillStyle = '#4b5563';
    ctx.font = '11px system-ui, -apple-system, sans-serif';
    ctx.fillText(`Comprovante gerado em ${format(now, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}`, canvas.width / 2, footerY + 52);

    // Bottom accent bar
    ctx.fillStyle = accentGradient;
    ctx.fillRect(0, canvas.height - 6, canvas.width, 6);

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
