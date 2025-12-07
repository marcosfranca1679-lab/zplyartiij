import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RefreshCw, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Payment {
  id: string;
  whatsapp: string;
  email: string;
  plan_type: string;
  coupon_code: string | null;
  discount_percent: number | null;
  final_price: number;
  payment_status: string | null;
  preference_id: string;
  created_at: string;
}

const PaymentsTable = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("payments")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setPayments(data || []);
    } catch (error) {
      console.error("Error fetching payments:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPayments = payments.filter(
    (p) =>
      p.email.toLowerCase().includes(search.toLowerCase()) ||
      p.whatsapp.includes(search) ||
      (p.coupon_code && p.coupon_code.toLowerCase().includes(search.toLowerCase()))
  );

  const getStatusBadge = (status: string | null) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Aprovado</Badge>;
      case "pending":
        return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">Pendente</Badge>;
      case "rejected":
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Rejeitado</Badge>;
      default:
        return <Badge variant="outline">{status || "Desconhecido"}</Badge>;
    }
  };

  const getPlanBadge = (planType: string) => {
    switch (planType) {
      case "monthly":
        return <Badge variant="secondary">Mensal</Badge>;
      case "quarterly":
        return <Badge className="bg-primary/20 text-primary border-primary/30">Trimestral</Badge>;
      default:
        return <Badge variant="outline">{planType}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <RefreshCw className="w-6 h-6 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por email, WhatsApp ou cupom..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline" size="sm" onClick={fetchPayments}>
          <RefreshCw className="w-4 h-4 mr-2" />
          Atualizar
        </Button>
      </div>

      <div className="rounded-lg border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Data</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>WhatsApp</TableHead>
              <TableHead>Plano</TableHead>
              <TableHead>Cupom</TableHead>
              <TableHead>Desconto</TableHead>
              <TableHead>Valor Final</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPayments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                  Nenhum pagamento encontrado
                </TableCell>
              </TableRow>
            ) : (
              filteredPayments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell className="text-sm text-muted-foreground">
                    {format(new Date(payment.created_at), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                  </TableCell>
                  <TableCell className="font-medium">{payment.email}</TableCell>
                  <TableCell>{payment.whatsapp}</TableCell>
                  <TableCell>{getPlanBadge(payment.plan_type)}</TableCell>
                  <TableCell>
                    {payment.coupon_code ? (
                      <code className="bg-muted px-2 py-1 rounded text-xs">{payment.coupon_code}</code>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {payment.discount_percent ? (
                      <span className="text-green-400">{payment.discount_percent}%</span>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">
                    R$ {payment.final_price.toFixed(2)}
                  </TableCell>
                  <TableCell>{getStatusBadge(payment.payment_status)}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <p className="text-sm text-muted-foreground">
        Total de pagamentos: {filteredPayments.length}
      </p>
    </div>
  );
};

export default PaymentsTable;
