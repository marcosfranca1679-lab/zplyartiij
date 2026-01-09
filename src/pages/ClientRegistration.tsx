import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { User, Phone, Mail, Hash, LogOut, Plus, Calendar, Pencil, Trash2, X, Check, Share2, Lock, UserCircle } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
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
  password: string | null;
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
  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [clients, setClients] = useState<Client[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Client>>({});
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [clientToDelete, setClientToDelete] = useState<Client | null>(null);
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
        password: password.trim() || null,
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
      password: client.password,
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
          password: editForm.password?.trim() || null,
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
    
    const shareText = `📺 *ZPlayer IPTV*

👤 *Nome:* ${client.name}
📞 *Telefone:* ${client.phone}
📧 *Email:* ${client.email}
🔢 *Código:* ${client.client_code}

🔐 *Dados de Acesso:*
👤 Usuário: ${client.username || "Não definido"}
🔑 Senha: ${client.password || "Não definida"}

📋 *Assinatura:* ${subscriptionText}
📅 *Vencimento:* Todo dia ${registrationDay} de cada ${client.subscription_type === "mensal" ? "mês" : "trimestre"}`;

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

  const getVencimentoInfo = (client: Client) => {
    const registrationDay = new Date(client.registration_date).getDate();
    if (client.subscription_type === "mensal") {
      return `Vencimento: dia ${registrationDay} de cada mês`;
    } else {
      return `Vencimento: dia ${registrationDay} a cada 3 meses`;
    }
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-white">Cadastro de Clientes</h1>
          <Button variant="outline" onClick={handleLogout} className="border-gray-700 text-gray-300 hover:bg-gray-800">
            <LogOut className="h-4 w-4 mr-2" />
            Sair
          </Button>
        </div>

        <Card className="bg-gray-900/80 border-gray-800 mb-6">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Novo Cliente
            </CardTitle>
            <CardDescription className="text-gray-400">
              Preencha os dados do cliente
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-white">Nome</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="name"
                      placeholder="Nome completo"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="pl-10 bg-gray-800 border-gray-700 text-white"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-white">Telefone</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="phone"
                      placeholder="(00) 00000-0000"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="pl-10 bg-gray-800 border-gray-700 text-white"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="email@exemplo.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 bg-gray-800 border-gray-700 text-white"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="clientCode" className="text-white">Código do Cliente</Label>
                  <div className="relative">
                    <Hash className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="clientCode"
                      placeholder="Código"
                      value={clientCode}
                      onChange={(e) => setClientCode(e.target.value)}
                      className="pl-10 bg-gray-800 border-gray-700 text-white"
                      required
                    />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-white">Usuário</Label>
                  <div className="relative">
                    <UserCircle className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="username"
                      placeholder="Nome de usuário"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="pl-10 bg-gray-800 border-gray-700 text-white"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-white">Senha</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="password"
                      placeholder="Senha do cliente"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 bg-gray-800 border-gray-700 text-white"
                    />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="registrationDate" className="text-white">Data do Cadastro</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="registrationDate"
                      type="date"
                      value={registrationDate}
                      onChange={(e) => setRegistrationDate(e.target.value)}
                      className="pl-10 bg-gray-800 border-gray-700 text-white"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subscription" className="text-white">Tipo de Assinatura</Label>
                  <Select value={subscriptionType} onValueChange={setSubscriptionType}>
                    <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                      <SelectValue placeholder="Selecione a assinatura" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      <SelectItem value="mensal" className="text-white hover:bg-gray-700">Mensal</SelectItem>
                      <SelectItem value="trimestral" className="text-white hover:bg-gray-700">Trimestral</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button
                type="submit"
                className="w-full bg-red-600 hover:bg-red-700"
                disabled={loading}
              >
                {loading ? "Cadastrando..." : "Cadastrar Cliente"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {clients.length > 0 && (
          <Card className="bg-gray-900/80 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Clientes Cadastrados</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-gray-700">
                      <TableHead className="text-gray-400">Nome</TableHead>
                      <TableHead className="text-gray-400">Telefone</TableHead>
                      <TableHead className="text-gray-400">Email</TableHead>
                      <TableHead className="text-gray-400">Código</TableHead>
                      <TableHead className="text-gray-400">Usuário</TableHead>
                      <TableHead className="text-gray-400">Senha</TableHead>
                      <TableHead className="text-gray-400">Assinatura</TableHead>
                      <TableHead className="text-gray-400">Vencimento</TableHead>
                      <TableHead className="text-gray-400">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {clients.map((client) => (
                      <TableRow key={client.id} className="border-gray-700">
                        {editingId === client.id ? (
                          <>
                            <TableCell>
                              <Input
                                value={editForm.name || ""}
                                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                className="bg-gray-800 border-gray-700 text-white h-8"
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                value={editForm.phone || ""}
                                onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                                className="bg-gray-800 border-gray-700 text-white h-8"
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                value={editForm.email || ""}
                                onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                                className="bg-gray-800 border-gray-700 text-white h-8"
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                value={editForm.client_code || ""}
                                onChange={(e) => setEditForm({ ...editForm, client_code: e.target.value })}
                                className="bg-gray-800 border-gray-700 text-white h-8"
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                value={editForm.username || ""}
                                onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
                                className="bg-gray-800 border-gray-700 text-white h-8"
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                value={editForm.password || ""}
                                onChange={(e) => setEditForm({ ...editForm, password: e.target.value })}
                                className="bg-gray-800 border-gray-700 text-white h-8"
                              />
                            </TableCell>
                            <TableCell>
                              <Select
                                value={editForm.subscription_type || ""}
                                onValueChange={(value) => setEditForm({ ...editForm, subscription_type: value })}
                              >
                                <SelectTrigger className="bg-gray-800 border-gray-700 text-white h-8">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-gray-800 border-gray-700">
                                  <SelectItem value="mensal" className="text-white">Mensal</SelectItem>
                                  <SelectItem value="trimestral" className="text-white">Trimestral</SelectItem>
                                </SelectContent>
                              </Select>
                            </TableCell>
                            <TableCell>
                              <Input
                                type="date"
                                value={editForm.registration_date || ""}
                                onChange={(e) => setEditForm({ ...editForm, registration_date: e.target.value })}
                                className="bg-gray-800 border-gray-700 text-white h-8"
                              />
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-1">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handleSaveEdit(client.id)}
                                  className="h-8 w-8 p-0 text-green-500 hover:text-green-400 hover:bg-green-500/10"
                                >
                                  <Check className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={handleCancelEdit}
                                  className="h-8 w-8 p-0 text-gray-400 hover:text-gray-300 hover:bg-gray-700"
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </>
                        ) : (
                          <>
                            <TableCell className="text-white">{client.name}</TableCell>
                            <TableCell className="text-gray-300">{client.phone}</TableCell>
                            <TableCell className="text-gray-300">{client.email}</TableCell>
                            <TableCell className="text-gray-300">{client.client_code}</TableCell>
                            <TableCell className="text-gray-300">{client.username || "-"}</TableCell>
                            <TableCell className="text-gray-300">{client.password || "-"}</TableCell>
                            <TableCell className="text-gray-300 capitalize">{client.subscription_type}</TableCell>
                            <TableCell className="text-gray-300 text-xs">
                              {getVencimentoInfo(client)}
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-1">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handleShare(client)}
                                  className="h-8 w-8 p-0 text-green-500 hover:text-green-400 hover:bg-green-500/10"
                                  title="Compartilhar"
                                >
                                  <Share2 className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handleEdit(client)}
                                  className="h-8 w-8 p-0 text-blue-500 hover:text-blue-400 hover:bg-blue-500/10"
                                  title="Editar"
                                >
                                  <Pencil className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handleDeleteClick(client)}
                                  className="h-8 w-8 p-0 text-red-500 hover:text-red-400 hover:bg-red-500/10"
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
            </CardContent>
          </Card>
        )}
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-gray-900 border-gray-700">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Excluir Cliente</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              Tem certeza que deseja excluir o cliente <span className="text-white font-semibold">{clientToDelete?.name}</span>? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ClientRegistration;