import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { RefreshCw, Plus, Trash2, Calendar } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Coupon {
  id: string;
  code: string;
  discount_percent: number;
  valid_until: string | null;
  valid_for_plan: string | null;
  is_redeemed: boolean;
  redeemed_at: string | null;
  created_at: string;
}

const CouponsManager = () => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const { toast } = useToast();

  // Form state
  const [code, setCode] = useState("");
  const [discountPercent, setDiscountPercent] = useState("30");
  const [validUntil, setValidUntil] = useState("");
  const [validForPlan, setValidForPlan] = useState("all");

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("coupons")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setCoupons(data || []);
    } catch (error) {
      console.error("Error fetching coupons:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);

    try {
      const couponData: {
        code: string;
        discount_percent: number;
        valid_for_plan: string;
        valid_until?: string;
      } = {
        code: code.toUpperCase().trim(),
        discount_percent: parseInt(discountPercent),
        valid_for_plan: validForPlan,
      };

      if (validUntil) {
        couponData.valid_until = new Date(validUntil).toISOString();
      }

      const { error } = await supabase.from("coupons").insert(couponData);

      if (error) throw error;

      toast({
        title: "Cupom criado",
        description: `Cupom ${couponData.code} criado com sucesso`,
      });

      setDialogOpen(false);
      resetForm();
      fetchCoupons();
    } catch (error: any) {
      console.error("Error creating coupon:", error);
      toast({
        variant: "destructive",
        title: "Erro ao criar cupom",
        description: error.message || "Ocorreu um erro",
      });
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteCoupon = async (id: string, code: string) => {
    if (!confirm(`Tem certeza que deseja excluir o cupom ${code}?`)) return;

    try {
      const { error } = await supabase.from("coupons").delete().eq("id", id);

      if (error) throw error;

      toast({
        title: "Cupom excluído",
        description: `Cupom ${code} foi excluído`,
      });

      fetchCoupons();
    } catch (error: any) {
      console.error("Error deleting coupon:", error);
      toast({
        variant: "destructive",
        title: "Erro ao excluir cupom",
        description: error.message || "Ocorreu um erro",
      });
    }
  };

  const resetForm = () => {
    setCode("");
    setDiscountPercent("30");
    setValidUntil("");
    setValidForPlan("all");
  };

  const generateRandomCode = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCode(result);
  };

  const getPlanLabel = (plan: string | null) => {
    switch (plan) {
      case "monthly":
        return "Mensal";
      case "quarterly":
        return "Trimestral";
      case "all":
      default:
        return "Todos";
    }
  };

  const isExpired = (validUntil: string | null) => {
    if (!validUntil) return false;
    return new Date(validUntil) < new Date();
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
      <div className="flex items-center justify-between">
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Novo Cupom
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Criar Novo Cupom</DialogTitle>
              <DialogDescription>
                Configure os detalhes do cupom de desconto
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateCoupon} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="code">Código do Cupom</Label>
                <div className="flex gap-2">
                  <Input
                    id="code"
                    placeholder="PROMO30"
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                    required
                    className="flex-1"
                  />
                  <Button type="button" variant="outline" onClick={generateRandomCode}>
                    Gerar
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="discount">Desconto (%)</Label>
                <Input
                  id="discount"
                  type="number"
                  min="1"
                  max="100"
                  value={discountPercent}
                  onChange={(e) => setDiscountPercent(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="validUntil">Válido até (opcional)</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="validUntil"
                    type="datetime-local"
                    value={validUntil}
                    onChange={(e) => setValidUntil(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="validForPlan">Válido para</Label>
                <Select value={validForPlan} onValueChange={setValidForPlan}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os planos</SelectItem>
                    <SelectItem value="monthly">Apenas Mensal</SelectItem>
                    <SelectItem value="quarterly">Apenas Trimestral</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2 pt-4">
                <Button type="button" variant="outline" className="flex-1" onClick={() => setDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" className="flex-1" disabled={creating}>
                  {creating ? "Criando..." : "Criar Cupom"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        <Button variant="outline" size="sm" onClick={fetchCoupons}>
          <RefreshCw className="w-4 h-4 mr-2" />
          Atualizar
        </Button>
      </div>

      <div className="rounded-lg border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Código</TableHead>
              <TableHead>Desconto</TableHead>
              <TableHead>Válido para</TableHead>
              <TableHead>Validade</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Criado em</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {coupons.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  Nenhum cupom encontrado
                </TableCell>
              </TableRow>
            ) : (
              coupons.map((coupon) => (
                <TableRow key={coupon.id}>
                  <TableCell>
                    <code className="bg-muted px-2 py-1 rounded text-sm font-bold">{coupon.code}</code>
                  </TableCell>
                  <TableCell>
                    <span className="text-primary font-medium">{coupon.discount_percent}%</span>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{getPlanLabel(coupon.valid_for_plan)}</Badge>
                  </TableCell>
                  <TableCell className="text-sm">
                    {coupon.valid_until ? (
                      <span className={isExpired(coupon.valid_until) ? "text-red-400" : ""}>
                        {format(new Date(coupon.valid_until), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                      </span>
                    ) : (
                      <span className="text-muted-foreground">Sem validade</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {coupon.is_redeemed ? (
                      <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Usado</Badge>
                    ) : isExpired(coupon.valid_until) ? (
                      <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">Expirado</Badge>
                    ) : (
                      <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Disponível</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {format(new Date(coupon.created_at), "dd/MM/yyyy", { locale: ptBR })}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                      onClick={() => handleDeleteCoupon(coupon.id, coupon.code)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <p className="text-sm text-muted-foreground">
        Total de cupons: {coupons.length}
      </p>
    </div>
  );
};

export default CouponsManager;
