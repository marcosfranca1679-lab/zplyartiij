import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { User, Phone, Mail, Hash, LogOut, Plus, Calendar, Pencil, Trash2, X, Check, Share2, Lock, UserCircle, Shield, CreditCard, Users, Search, RefreshCw, FileText } from "lucide-react";
import jsPDF from "jspdf";
import { ClientPaymentsModal } from "@/components/ClientPaymentsModal";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Client {
  id: string;
  name: string;
  phone: string;
  email: string;
  client_code: string;
  subscription_type: string;
  created_at: string;
  registration_date: string;
  username: string | null;
  password_hash: string | null;
  has_loyalty: boolean;
}

const ClientRegistration = () => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [clientCode, setClientCode] = useState("");
  const [subscriptionType, setSubscriptionType] = useState("");
  const [registrationDate, setRegistrationDate] = useState(new Date().toISOString().split('T')[0]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [hasLoyalty, setHasLoyalty] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [clients, setClients] = useState<Client[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Client>>({});
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [clientToDelete, setClientToDelete] = useState<Client | null>(null);
  const [paymentsModalOpen, setPaymentsModalOpen] = useState(false);
  const [selectedClientForPayments, setSelectedClientForPayments] = useState<Client | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate("/login");
      } else {
        setUserId(session.user.id);
        setCheckingAuth(false);
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/login");
      } else {
        setUserId(session.user.id);
        setCheckingAuth(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (userId) {
      fetchClients();
    }
  }, [userId]);

  const fetchClients = async () => {
    const { data, error } = await supabase
      .from("clients")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setClients(data);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!subscriptionType) {
      toast({
        title: "Erro",
        description: "Selecione o tipo de assinatura",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.from("clients").insert({
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim(),
        client_code: clientCode.trim(),
        subscription_type: subscriptionType,
        registration_date: registrationDate,
        username: username.trim() || null,
        password_hash: password.trim() || null,
        has_loyalty: hasLoyalty,
        created_by: userId,
      });

      if (error) {
        toast({
          title: "Erro ao cadastrar",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Cliente cadastrado!",
          description: "O cliente foi cadastrado com sucesso",
        });
        setName("");
        setPhone("");
        setEmail("");
        setClientCode("");
        setSubscriptionType("");
        setRegistrationDate(new Date().toISOString().split('T')[0]);
        setUsername("");
        setPassword("");
        setHasLoyalty(false);
        fetchClients();
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro inesperado",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (client: Client) => {
    setEditingId(client.id);
    setEditForm({
      name: client.name,
      phone: client.phone,
      email: client.email,
      client_code: client.client_code,
      subscription_type: client.subscription_type,
      registration_date: client.registration_date,
      username: client.username,
      password_hash: client.password_hash,
      has_loyalty: client.has_loyalty,
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const handleSaveEdit = async (clientId: string) => {
    try {
      const { error } = await supabase
        .from("clients")
        .update({
          name: editForm.name?.trim(),
          phone: editForm.phone?.trim(),
          email: editForm.email?.trim(),
          client_code: editForm.client_code?.trim(),
          subscription_type: editForm.subscription_type,
          registration_date: editForm.registration_date,
          username: editForm.username?.trim() || null,
          password_hash: editForm.password_hash?.trim() || null,
          has_loyalty: editForm.has_loyalty,
        })
        .eq("id", clientId);

      if (error) {
        toast({
          title: "Erro ao atualizar",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Cliente atualizado!",
          description: "Os dados foram salvos com sucesso",
        });
        setEditingId(null);
        setEditForm({});
        fetchClients();
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro inesperado",
        variant: "destructive",
      });
    }
  };

  const handleDeleteClick = (client: Client) => {
    setClientToDelete(client);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!clientToDelete) return;

    try {
      const { error } = await supabase
        .from("clients")
        .delete()
        .eq("id", clientToDelete.id);

      if (error) {
        toast({
          title: "Erro ao excluir",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Cliente excluído!",
          description: "O cliente foi removido com sucesso",
        });
        fetchClients();
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro inesperado",
        variant: "destructive",
      });
    } finally {
      setDeleteDialogOpen(false);
      setClientToDelete(null);
    }
  };

  const handleShare = async (client: Client) => {
    const registrationDay = new Date(client.registration_date).getDate();
    const subscriptionText = client.subscription_type === "mensal" ? "Mensal" : "Trimestral";
    
    const loyaltyText = client.has_loyalty 
      ? `⚠️ *TERMO DE FIDELIDADE*

A presente assinatura possui período mínimo de fidelidade de 12 (doze) meses, contados a partir da data de cadastro do contratante.

O não pagamento das mensalidades ou trimestralidades, conforme o plano escolhido, implicará na rescisão contratual e na aplicação de multa rescisória no valor total de R$ 230,00 (duzentos e trinta reais), calculada proporcionalmente ao período restante da fidelidade, no montante de R$ 19,00 (dezenove reais) por mês não cumprido.`
      : `📄 *TERMO SEM FIDELIDADE*

A assinatura não possui período de fidelidade.

A cobrança é realizada de forma mensal ou trimestral, conforme o plano contratado.

Em caso de não pagamento, não será aplicada multa, ocorrendo apenas a suspensão (corte) do sinal até a regularização do débito.`;
    
    const shareText = `📺 *ZPlayer IPTV*

👤 *Nome:* ${client.name}
📞 *Telefone:* ${client.phone}
📧 *Email:* ${client.email}
🔢 *Código:* ${client.client_code}

🔐 *Dados de Acesso:*
👤 Usuário: ${client.username || "Não definido"}
🔑 Senha: ${client.password_hash || "Não definida"}

📋 *Assinatura:* ${subscriptionText}
📅 *Vencimento:* Todo dia ${registrationDay} de cada ${client.subscription_type === "mensal" ? "mês" : "trimestre"}
🔒 *Fidelidade:* ${client.has_loyalty ? "Com Fidelidade (12 meses)" : "Sem Fidelidade"}

${loyaltyText}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Dados do Cliente - ZPlayer IPTV",
          text: shareText,
        });
      } catch (error) {
        // User cancelled or share failed, copy to clipboard instead
        await navigator.clipboard.writeText(shareText);
        toast({
          title: "Copiado!",
          description: "Os dados foram copiados para a área de transferência",
        });
      }
    } else {
      await navigator.clipboard.writeText(shareText);
      toast({
        title: "Copiado!",
        description: "Os dados foram copiados para a área de transferência",
      });
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  const handleGenerateContract = (client: Client) => {
    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.getWidth();
    const margin = 20;
    const contentWidth = pageWidth - margin * 2;
    let y = 20;

    // Header
    pdf.setFontSize(20);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(220, 38, 38);
    pdf.text("ZPlayer IPTV", pageWidth / 2, y, { align: "center" });
    
    y += 10;
    pdf.setFontSize(14);
    pdf.setTextColor(0, 0, 0);
    pdf.text("TERMO DE ASSINATURA", pageWidth / 2, y, { align: "center" });

    // Line separator
    y += 8;
    pdf.setDrawColor(220, 38, 38);
    pdf.setLineWidth(0.5);
    pdf.line(margin, y, pageWidth - margin, y);

    // Client Data Section
    y += 15;
    pdf.setFontSize(12);
    pdf.setFont("helvetica", "bold");
    pdf.text("DADOS DO CONTRATANTE", margin, y);

    y += 10;
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(10);
    
    const registrationDay = new Date(client.registration_date).getDate();
    const subscriptionText = client.subscription_type === "mensal" ? "Mensal" : "Trimestral";
    const planPrice = client.subscription_type === "mensal" ? "R$ 29,99" : "R$ 70,00";
    const formattedDate = new Date(client.registration_date).toLocaleDateString("pt-BR");
    
    const clientData = [
      `Nome: ${client.name}`,
      `Telefone: ${client.phone}`,
      `E-mail: ${client.email}`,
      `Código do Cliente: ${client.client_code}`,
      `Usuário IPTV: ${client.username || "Não definido"}`,
      `Senha IPTV: ${client.password_hash || "Não definida"}`,
      `Plano: ${subscriptionText}`,
      `Valor: ${planPrice}`,
      `Data de Cadastro: ${formattedDate}`,
      `Vencimento: Todo dia ${registrationDay} de cada ${client.subscription_type === "mensal" ? "mês" : "trimestre"}`,
      `Fidelidade: ${client.has_loyalty ? "Com Fidelidade (12 meses)" : "Sem Fidelidade"}`,
    ];

    clientData.forEach((line) => {
      pdf.text(line, margin, y);
      y += 6;
    });

    // Separator
    y += 5;
    pdf.setDrawColor(200, 200, 200);
    pdf.setLineWidth(0.3);
    pdf.line(margin, y, pageWidth - margin, y);

    // Guidelines Section
    y += 10;
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(12);
    pdf.text("DIRETRIZES DE ASSINATURA", margin, y);

    y += 10;
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(9);

    const guidelines = [
      { title: "1. Tipos de Planos", content: "A assinatura está disponível em dois tipos de planos:\n• Plano Mensal: válido por 30 (trinta) dias;\n• Plano Trimestral: válido por 3 (três) meses.\nO pagamento deve ser realizado dentro do prazo estipulado. O não pagamento resultará no corte imediato do sinal, sem necessidade de aviso prévio." },
      { title: "2. Benefícios da Assinatura", content: "Ao contratar qualquer um dos planos disponíveis, o assinante terá direito a:\n• Filmes e séries disponíveis 24 horas por dia;\n• Canais adultos, mediante solicitação do assinante;\n• Canais abertos com funcionamento 24 horas;\n• Todos os serviços oferecidos por valor fixo, conforme o plano escolhido." },
      { title: "3. Fidelidade", content: "Ao optar por um plano com fidelidade, o assinante compromete-se a permanecer com o plano contratado pelo período mínimo de 12 (doze) meses.\nO não pagamento durante o período de fidelidade acarretará multa contratual no valor total de R$ 230,00, calculada proporcionalmente em R$ 19,00 (dezenove reais) por mês não cumprido." },
      { title: "4. Cancelamento da Fidelidade", content: "O cancelamento do plano com fidelidade ocorrerá sem aplicação de multa somente nos casos em que a operadora deixar de fornecer o sinal, de forma definitiva ou por período prolongado que inviabilize a utilização do serviço.\nEm qualquer outra hipótese, o cancelamento antecipado durante o período de fidelidade implicará na cobrança da multa contratual, conforme os valores estabelecidos neste termo." },
      { title: "5. Requisitos Técnicos", content: "• O serviço funciona 100% via internet;\n• Antes da ativação do serviço, será realizado um teste de conexão, com registro da velocidade pelo vendedor responsável;\n• Para a contratação da assinatura, é obrigatória uma velocidade mínima de 10 Mbps (megabits por segundo)." },
    ];

    guidelines.forEach((section) => {
      // Check if we need a new page
      if (y > 250) {
        pdf.addPage();
        y = 20;
      }

      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(10);
      pdf.text(section.title, margin, y);
      y += 6;

      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(9);
      const lines = pdf.splitTextToSize(section.content, contentWidth);
      lines.forEach((line: string) => {
        if (y > 280) {
          pdf.addPage();
          y = 20;
        }
        pdf.text(line, margin, y);
        y += 5;
      });
      y += 5;
    });

    // COMO FUNCIONA O IPTV Section
    if (y > 220) {
      pdf.addPage();
      y = 20;
    }

    y += 5;
    pdf.setDrawColor(200, 200, 200);
    pdf.setLineWidth(0.3);
    pdf.line(margin, y, pageWidth - margin, y);

    y += 10;
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(12);
    pdf.text("COMO FUNCIONA O IPTV", margin, y);

    y += 8;
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(9);
    const iptvIntro = "Um sistema de IPTV (Televisão por Protocolo de Internet) é um método de entrega de conteúdo de TV, como canais ao vivo, filmes e séries, usando a internet em vez de sinais de antena ou cabo, funcionando como um serviço de streaming que permite assistir em diversos dispositivos conectados, oferecendo interatividade e flexibilidade com alta qualidade de imagem e som, especialmente em redes de fibra ótica.";
    const iptvIntroLines = pdf.splitTextToSize(iptvIntro, contentWidth);
    iptvIntroLines.forEach((line: string) => {
      if (y > 280) {
        pdf.addPage();
        y = 20;
      }
      pdf.text(line, margin, y);
      y += 5;
    });

    y += 5;
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(10);
    pdf.text("Como funciona?", margin, y);

    y += 6;
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(9);
    const iptvDetails = [
      "• Transmissão via IP: O conteúdo é enviado pela rede IP, o mesmo protocolo de internet usado para acessar sites e outros serviços de streaming.",
      "• Redes dedicadas: Muitas vezes, provedores usam redes IP privadas para garantir maior estabilidade e evitar travamentos da internet pública, resultando em melhor performance.",
      "• Dispositivos: Pode ser acessado em Smart TVs, computadores, tablets, celulares e outros aparelhos com um aplicativo de IPTV ou um aparelho específico (TV Box)."
    ];

    iptvDetails.forEach((detail) => {
      const detailLines = pdf.splitTextToSize(detail, contentWidth);
      detailLines.forEach((line: string) => {
        if (y > 280) {
          pdf.addPage();
          y = 20;
        }
        pdf.text(line, margin, y);
        y += 5;
      });
      y += 2;
    });

    // Acceptance Section
    if (y > 240) {
      pdf.addPage();
      y = 20;
    }

    y += 10;
    pdf.setDrawColor(200, 200, 200);
    pdf.setLineWidth(0.3);
    pdf.line(margin, y, pageWidth - margin, y);

    y += 10;
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(11);
    pdf.text("ACEITE DOS TERMOS", margin, y);

    y += 8;
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(9);
    const acceptanceText = `Eu, ${client.name}, portador(a) do contato ${client.phone}, declaro que li e compreendi todas as cláusulas contidas neste Termo de Assinatura e aceito integralmente as condições estabelecidas para a contratação do plano ${subscriptionText}${client.has_loyalty ? " com fidelidade de 12 meses" : " sem fidelidade"}.`;
    const acceptanceLines = pdf.splitTextToSize(acceptanceText, contentWidth);
    acceptanceLines.forEach((line: string) => {
      pdf.text(line, margin, y);
      y += 5;
    });

    y += 15;
    pdf.text(`Data: ${new Date().toLocaleDateString("pt-BR")}`, margin, y);

    y += 20;
    pdf.setDrawColor(0, 0, 0);
    pdf.setLineWidth(0.5);
    pdf.line(margin, y, margin + 80, y);
    y += 5;
    pdf.setFontSize(8);
    pdf.text("Assinatura do Contratante", margin, y);

    // Footer
    const footerY = pdf.internal.pageSize.getHeight() - 15;
    pdf.setFontSize(8);
    pdf.setTextColor(128, 128, 128);
    pdf.text("ZPlayer IPTV - Documento gerado automaticamente", pageWidth / 2, footerY, { align: "center" });

    // Save the PDF
    pdf.save(`Contrato_${client.name.replace(/\s+/g, "_")}_${client.client_code}.pdf`);

    toast({
      title: "PDF gerado!",
      description: "O contrato foi baixado com sucesso",
    });
  };

  const getVencimentoInfo = (client: Client) => {
    const registrationDay = new Date(client.registration_date).getDate();
    if (client.subscription_type === "mensal") {
      return `Dia ${registrationDay}/mês`;
    } else {
      return `Dia ${registrationDay}/trim.`;
    }
  };

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.phone.includes(searchQuery) ||
    client.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.client_code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-primary border-t-transparent"></div>
          <p className="text-muted-foreground text-sm">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/25">
                <Users className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-foreground">Gestão de Clientes</h1>
                <p className="text-xs text-muted-foreground">ZPlayer IPTV</p>
              </div>
            </div>
            <Button 
              variant="outline" 
              onClick={handleLogout} 
              className="border-border/50 text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-all"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <Card className="bg-card/50 border-border/50 backdrop-blur-sm hover:bg-card/70 transition-all">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total de Clientes</p>
                  <p className="text-2xl font-bold text-foreground">{clients.length}</p>
                </div>
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Users className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card/50 border-border/50 backdrop-blur-sm hover:bg-card/70 transition-all">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Com Fidelidade</p>
                  <p className="text-2xl font-bold text-foreground">{clients.filter(c => c.has_loyalty).length}</p>
                </div>
                <div className="h-12 w-12 rounded-xl bg-yellow-500/10 flex items-center justify-center">
                  <Shield className="h-6 w-6 text-yellow-500" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card/50 border-border/50 backdrop-blur-sm hover:bg-card/70 transition-all">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Plano Trimestral</p>
                  <p className="text-2xl font-bold text-foreground">{clients.filter(c => c.subscription_type === 'trimestral').length}</p>
                </div>
                <div className="h-12 w-12 rounded-xl bg-green-500/10 flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-green-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* New Client Form */}
        <Card className="bg-card/50 border-border/50 backdrop-blur-sm mb-8 overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-primary/10 via-accent/10 to-transparent border-b border-border/50">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Plus className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <CardTitle className="text-foreground">Novo Cliente</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Preencha os dados para cadastrar um novo cliente
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Info */}
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-4 flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Informações Pessoais
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-foreground text-sm">Nome Completo</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="name"
                        placeholder="Nome do cliente"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="pl-10 bg-secondary/50 border-border/50 text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:ring-primary/20 transition-all"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-foreground text-sm">Telefone</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="phone"
                        placeholder="(00) 00000-0000"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="pl-10 bg-secondary/50 border-border/50 text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:ring-primary/20 transition-all"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-foreground text-sm">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="email@exemplo.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10 bg-secondary/50 border-border/50 text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:ring-primary/20 transition-all"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="clientCode" className="text-foreground text-sm">Código do Cliente</Label>
                    <div className="relative">
                      <Hash className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="clientCode"
                        placeholder="Código único"
                        value={clientCode}
                        onChange={(e) => setClientCode(e.target.value)}
                        className="pl-10 bg-secondary/50 border-border/50 text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:ring-primary/20 transition-all"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Access Credentials */}
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-4 flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  Credenciais de Acesso
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="username" className="text-foreground text-sm">Usuário</Label>
                    <div className="relative">
                      <UserCircle className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="username"
                        placeholder="Nome de usuário"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="pl-10 bg-secondary/50 border-border/50 text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:ring-primary/20 transition-all"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-foreground text-sm">Senha</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="password"
                        placeholder="Senha do cliente"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10 bg-secondary/50 border-border/50 text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:ring-primary/20 transition-all"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Subscription Info */}
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-4 flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Informações da Assinatura
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="registrationDate" className="text-foreground text-sm">Data do Cadastro</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="registrationDate"
                        type="date"
                        value={registrationDate}
                        onChange={(e) => setRegistrationDate(e.target.value)}
                        className="pl-10 bg-secondary/50 border-border/50 text-foreground focus:border-primary/50 focus:ring-primary/20 transition-all"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subscription" className="text-foreground text-sm">Tipo de Assinatura</Label>
                    <Select value={subscriptionType} onValueChange={setSubscriptionType}>
                      <SelectTrigger className="bg-secondary/50 border-border/50 text-foreground focus:border-primary/50 focus:ring-primary/20">
                        <SelectValue placeholder="Selecione o plano" />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-border">
                        <SelectItem value="mensal" className="text-foreground hover:bg-secondary/50">
                          <span className="flex items-center gap-2">
                            <Badge variant="secondary" className="text-xs">R$ 29,90</Badge>
                            Mensal
                          </span>
                        </SelectItem>
                        <SelectItem value="trimestral" className="text-foreground hover:bg-secondary/50">
                          <span className="flex items-center gap-2">
                            <Badge variant="secondary" className="text-xs">R$ 74,90</Badge>
                            Trimestral
                          </span>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Loyalty Toggle */}
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-yellow-500/10 via-yellow-500/5 to-transparent rounded-xl border border-yellow-500/20">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-yellow-500/20 flex items-center justify-center">
                    <Shield className="h-5 w-5 text-yellow-500" />
                  </div>
                  <div>
                    <Label htmlFor="loyalty" className="text-foreground font-medium">Contrato com Fidelidade</Label>
                    <p className="text-muted-foreground text-sm">Período mínimo de 12 meses</p>
                  </div>
                </div>
                <Switch
                  id="loyalty"
                  checked={hasLoyalty}
                  onCheckedChange={setHasLoyalty}
                  className="data-[state=checked]:bg-yellow-500"
                />
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground font-semibold shadow-lg shadow-primary/25 transition-all"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary-foreground border-t-transparent"></div>
                    Cadastrando...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Plus className="h-5 w-5" />
                    Cadastrar Cliente
                  </span>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Clients Table */}
        {clients.length > 0 && (
          <Card className="bg-card/50 border-border/50 backdrop-blur-sm overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-secondary/50 via-secondary/30 to-transparent border-b border-border/50">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-secondary flex items-center justify-center">
                    <Users className="h-5 w-5 text-foreground" />
                  </div>
                  <div>
                    <CardTitle className="text-foreground">Clientes Cadastrados</CardTitle>
                    <CardDescription className="text-muted-foreground">
                      {filteredClients.length} de {clients.length} clientes
                    </CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative flex-1 sm:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar cliente..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 bg-secondary/50 border-border/50 text-foreground placeholder:text-muted-foreground focus:border-primary/50"
                    />
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={fetchClients}
                    className="border-border/50 text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-border/50 hover:bg-transparent">
                      <TableHead className="text-muted-foreground font-medium">Cliente</TableHead>
                      <TableHead className="text-muted-foreground font-medium">Contato</TableHead>
                      <TableHead className="text-muted-foreground font-medium">Credenciais</TableHead>
                      <TableHead className="text-muted-foreground font-medium">Plano</TableHead>
                      <TableHead className="text-muted-foreground font-medium">Status</TableHead>
                      <TableHead className="text-muted-foreground font-medium text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredClients.map((client) => (
                      <TableRow key={client.id} className="border-border/50 hover:bg-secondary/30 transition-colors">
                        {editingId === client.id ? (
                          <>
                            <TableCell colSpan={5} className="p-4">
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                <Input
                                  value={editForm.name || ""}
                                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                  className="bg-secondary/50 border-border/50 text-foreground h-9"
                                  placeholder="Nome"
                                />
                                <Input
                                  value={editForm.phone || ""}
                                  onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                                  className="bg-secondary/50 border-border/50 text-foreground h-9"
                                  placeholder="Telefone"
                                />
                                <Input
                                  value={editForm.email || ""}
                                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                                  className="bg-secondary/50 border-border/50 text-foreground h-9"
                                  placeholder="Email"
                                />
                                <Input
                                  value={editForm.client_code || ""}
                                  onChange={(e) => setEditForm({ ...editForm, client_code: e.target.value })}
                                  className="bg-secondary/50 border-border/50 text-foreground h-9"
                                  placeholder="Código"
                                />
                                <Input
                                  value={editForm.username || ""}
                                  onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
                                  className="bg-secondary/50 border-border/50 text-foreground h-9"
                                  placeholder="Usuário"
                                />
                                <Input
                                  value={editForm.password_hash || ""}
                                  onChange={(e) => setEditForm({ ...editForm, password_hash: e.target.value })}
                                  className="bg-secondary/50 border-border/50 text-foreground h-9"
                                  placeholder="Senha"
                                />
                                <Select
                                  value={editForm.subscription_type || ""}
                                  onValueChange={(value) => setEditForm({ ...editForm, subscription_type: value })}
                                >
                                  <SelectTrigger className="bg-secondary/50 border-border/50 text-foreground h-9">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent className="bg-card border-border">
                                    <SelectItem value="mensal" className="text-foreground">Mensal</SelectItem>
                                    <SelectItem value="trimestral" className="text-foreground">Trimestral</SelectItem>
                                  </SelectContent>
                                </Select>
                                <Input
                                  type="date"
                                  value={editForm.registration_date || ""}
                                  onChange={(e) => setEditForm({ ...editForm, registration_date: e.target.value })}
                                  className="bg-secondary/50 border-border/50 text-foreground h-9"
                                />
                              </div>
                              <div className="flex items-center gap-3 mt-3">
                                <div className="flex items-center gap-2">
                                  <Switch
                                    checked={editForm.has_loyalty || false}
                                    onCheckedChange={(checked) => setEditForm({ ...editForm, has_loyalty: checked })}
                                  />
                                  <span className="text-sm text-muted-foreground">Fidelidade</span>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-1">
                                <Button
                                  size="sm"
                                  onClick={() => handleSaveEdit(client.id)}
                                  className="h-8 bg-green-500/20 text-green-500 hover:bg-green-500/30"
                                >
                                  <Check className="h-4 w-4 mr-1" />
                                  Salvar
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={handleCancelEdit}
                                  className="h-8 text-muted-foreground hover:text-foreground"
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </>
                        ) : (
                          <>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-primary font-semibold">
                                  {client.name.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                  <p className="font-medium text-foreground">{client.name}</p>
                                  <p className="text-xs text-muted-foreground">#{client.client_code}</p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="space-y-1">
                                <p className="text-sm text-foreground flex items-center gap-1.5">
                                  <Phone className="h-3 w-3 text-muted-foreground" />
                                  {client.phone}
                                </p>
                                <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                                  <Mail className="h-3 w-3" />
                                  {client.email}
                                </p>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="space-y-1">
                                <p className="text-sm text-foreground font-mono">{client.username || "—"}</p>
                                <p className="text-xs text-muted-foreground font-mono">{client.password_hash || "—"}</p>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="space-y-1">
                                <Badge 
                                  variant="secondary" 
                                  className={client.subscription_type === 'trimestral' 
                                    ? 'bg-green-500/20 text-green-400 border-green-500/30' 
                                    : 'bg-primary/20 text-primary border-primary/30'
                                  }
                                >
                                  {client.subscription_type === 'mensal' ? 'Mensal' : 'Trimestral'}
                                </Badge>
                                <p className="text-xs text-muted-foreground">{getVencimentoInfo(client)}</p>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge 
                                variant="secondary"
                                className={client.has_loyalty 
                                  ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' 
                                  : 'bg-secondary text-muted-foreground'
                                }
                              >
                                {client.has_loyalty ? (
                                  <span className="flex items-center gap-1">
                                    <Shield className="h-3 w-3" />
                                    Fidelidade
                                  </span>
                                ) : 'Sem Fidelidade'}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex justify-end gap-1">
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  onClick={() => handleGenerateContract(client)}
                                  className="h-8 w-8 text-purple-500 hover:text-purple-400 hover:bg-purple-500/10"
                                  title="Gerar Contrato PDF"
                                >
                                  <FileText className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  onClick={() => {
                                    setSelectedClientForPayments(client);
                                    setPaymentsModalOpen(true);
                                  }}
                                  className="h-8 w-8 text-yellow-500 hover:text-yellow-400 hover:bg-yellow-500/10"
                                  title="Pagamentos"
                                >
                                  <CreditCard className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  onClick={() => handleShare(client)}
                                  className="h-8 w-8 text-green-500 hover:text-green-400 hover:bg-green-500/10"
                                  title="Compartilhar"
                                >
                                  <Share2 className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  onClick={() => handleEdit(client)}
                                  className="h-8 w-8 text-blue-500 hover:text-blue-400 hover:bg-blue-500/10"
                                  title="Editar"
                                >
                                  <Pencil className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  onClick={() => handleDeleteClick(client)}
                                  className="h-8 w-8 text-destructive hover:text-destructive/80 hover:bg-destructive/10"
                                  title="Excluir"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </>
                        )}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              
              {filteredClients.length === 0 && searchQuery && (
                <div className="p-8 text-center">
                  <Search className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                  <p className="text-muted-foreground">Nenhum cliente encontrado para "{searchQuery}"</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {clients.length === 0 && (
          <Card className="bg-card/50 border-border/50 backdrop-blur-sm">
            <CardContent className="p-12 text-center">
              <div className="h-16 w-16 rounded-2xl bg-secondary/50 flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Nenhum cliente cadastrado</h3>
              <p className="text-muted-foreground mb-4">Comece adicionando seu primeiro cliente usando o formulário acima.</p>
            </CardContent>
          </Card>
        )}
      </main>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-card border-border">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-foreground">Excluir Cliente</AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              Tem certeza que deseja excluir o cliente <span className="text-foreground font-semibold">{clientToDelete?.name}</span>? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-secondary border-border text-foreground hover:bg-secondary/80">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <ClientPaymentsModal
        client={selectedClientForPayments}
        open={paymentsModalOpen}
        onOpenChange={setPaymentsModalOpen}
      />
    </div>
  );
};

export default ClientRegistration;
