import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { X } from "lucide-react";

const AnnouncementModal = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(true);
  }, []);

  if (!open) return null;

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/50 z-50" onClick={() => setOpen(false)} />
      
      {/* Caixa centralizada */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-[600px] bg-background border-border shadow-2xl relative">
          <button
            onClick={() => setOpen(false)}
            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          >
            <X className="h-5 w-5" />
            <span className="sr-only">Fechar</span>
          </button>
          
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-foreground pr-8">
              Atualização Importante sobre o Player M3U8
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-4 text-foreground/90">
            <p>Prezados,</p>
            <p>
              Informamos que em breve estaremos removendo o player M3U8 do servidor. 
              Caso você utilize o M3U8 no seu aplicativo, solicitamos que realize a 
              migração para o formato MPEG-TS ou utilize a configuração Default, que 
              redirecionará automaticamente para .TS.
            </p>
            <p>
              Para alterar, basta acessar as configurações do app, procurar por algo 
              como "Player" ou "Formato do fluxo" e selecionar o formato desejado. 
              Caso você nunca tenha realizado alterações, não é necessário fazer nada 
              — o padrão Default já será aplicado automaticamente.
            </p>
            <p>
              <strong>Motivo:</strong> Estamos enfrentando bloqueios de domínio DNS na 
              Cloudflare, e todas as indicações apontam que estes bloqueios estão 
              relacionados ao uso do player M3U8.
            </p>
            <p>
              Agradecemos a compreensão e pedimos que realizem a atualização o quanto 
              antes para evitar interrupções no serviço.
            </p>
            <p className="font-semibold">Atenciosamente.</p>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default AnnouncementModal;
