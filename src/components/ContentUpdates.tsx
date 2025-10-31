import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

const ContentUpdates = () => {
  return (
    <section className="py-12 px-4 bg-background">
      <div className="max-w-4xl mx-auto">
        <Card className="border-primary/20 bg-card/50 backdrop-blur">
          <CardHeader className="pb-3">
            <CardTitle className="text-center text-lg font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              ATUALIZAÇÃO DE CONTEÚDO
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px] w-full pr-4">
              <div className="space-y-4 text-xs">
                <div className="text-center">
                  <p className="text-primary font-semibold mb-2">🟢 ATUALIZAÇÃO 08/10/2025 🟢</p>
                </div>

                <div className="space-y-3">
                  <div>
                    <h3 className="text-primary font-bold mb-2">✅ FILMES NOVOS</h3>
                    <div className="border-t border-primary/20 pt-2 space-y-1 text-muted-foreground">
                      <p className="text-foreground/90 font-medium">💢 Filmes | Lançamentos</p>
                      <p>🎥️ Coração de Pai</p>
                      <p>🎥️ Invocação do Mal 4: O Último Ritual</p>
                      <p>🎥️ Javier Milei: la revolución liberal</p>
                      <p>🎥️ São Miguel Arcanjo - O Anjo Maior</p>
                      <p>🎥️ Segredos de Guerra</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-primary font-bold mb-2">💢 SÉRIES COM NOVOS EPISÓDIOS</h3>
                    <div className="border-t border-primary/20 pt-2 space-y-3 text-muted-foreground">
                      <div>
                        <p className="text-foreground/90 font-medium mb-1">💢 Novelas</p>
                        <p>🍿 Violetta - 136 Novos Episódios</p>
                      </div>

                      <div>
                        <p className="text-foreground/90 font-medium mb-1">💢 Series | Apple TV Plus</p>
                        <p>🍿 Raising Hope - 47 Novos Episódios</p>
                      </div>

                      <div>
                        <p className="text-foreground/90 font-medium mb-1">💢 Series | Crunchyroll</p>
                        <p>🍿 Naruto Shippuden - 267 Novos Episódios</p>
                      </div>

                      <div>
                        <p className="text-foreground/90 font-medium mb-1">💢 Series | Discovery Plus</p>
                        <p>🍿 Rumo ao Desconhecido Mistérios Paranormais - 16 Novos Episódios</p>
                      </div>

                      <div>
                        <p className="text-foreground/90 font-medium mb-1">💢 Series | Globoplay</p>
                        <p>🍿 Os Segredos de Anna - 7 Novos Episódios</p>
                      </div>

                      <div>
                        <p className="text-foreground/90 font-medium mb-1">💢 Series | Legendadas</p>
                        <p>🍿 Dragon Raja The Blazing Dawn [L] - 10 Novos Episódios</p>
                        <p>🍿 Louvada Seja Petey [L] - 3 Novos Episódios</p>
                        <p>🍿 Whitstable Pearl [L] - 11 Novos Episódios</p>
                      </div>

                      <div>
                        <p className="text-foreground/90 font-medium mb-1">💢 Series | Max</p>
                        <p>🍿 O Segredo das Coisas - 72 Novos Episódios</p>
                      </div>

                      <div>
                        <p className="text-foreground/90 font-medium mb-1">💢 Series | Netflix</p>
                        <p>🍿 Os Assassinatos de Are - 1 Novo Episódio</p>
                        <p>🍿 Outer Banks - 17 Novos Episódios</p>
                        <p>🍿 Reunião de Família - 19 Novos Episódios</p>
                      </div>

                      <div>
                        <p className="text-foreground/90 font-medium mb-1">💢 Series | Outras Produtoras</p>
                        <p>🍿 Catalendas - 79 Novos Episódios</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default ContentUpdates;
