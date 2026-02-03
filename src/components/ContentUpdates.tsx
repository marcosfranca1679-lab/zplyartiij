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
                  <p className="text-primary font-semibold mb-2">🟢 ATUALIZAÇÃO 03/02/2026 🟢</p>
                </div>

                <div className="space-y-3">
                  <div>
                    <h3 className="text-primary font-bold mb-2">🎬 NOVOS FILMES</h3>
                    <div className="border-t border-primary/20 pt-2 space-y-1 text-muted-foreground">
                      <p className="text-foreground/90 font-medium">💢 Filmes | Lançamentos - 03/02/2026</p>
                      <p>🎥️ Americana</p>
                      <p>🎥️ Um Dia Extraordinário</p>
                      <p>🎥️ Salvação</p>
                      <p>🎥️ Palavras de Guerra</p>
                      <p>🎥️ Palhaçassino</p>
                      <p>🎥️ Nossa Vizinhança</p>
                      <p>🎥️ Kyochuu Rettou Movie</p>
                      <p>🎥️ Davi: Nasce Um Rei</p>
                      <p>🎥️ Utopia Muda</p>
                      <p>🎥️ A Natureza das Coisas Invisíveis</p>
                      <p>🎥️ Dupla Perigosa</p>
                      <p>🎥️ O Agente Secreto</p>
                      <p>🎥️ Zona Z</p>
                      <p>🎥️ Sinfonia de Guerra</p>
                      <p>🎥️ Cora Bora</p>
                      <p>🎥️ Christy - Um Novo Round</p>
                      <p>🎥️ Uma Carta à Minha Juventude</p>
                      <p>🎥️ Freaky Tales</p>
                      <p>🎥️ धुरंधर</p>
                      <p>🎥️ Traição Entre Amigas</p>
                      <p>🎥️ Entre Nós: Uma Dose Extra de Amor</p>
                      <p>🎥️ God Complex - O Complexo Industrial da Censura</p>
                      <p>🎥️ Você Vai Morrer em 6 Horas</p>
                      <p>🎥️ Zona de Caça</p>
                      <p>🎥️ Você Radical - Amnésia</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-primary font-bold mb-2">🍿 NOVAS SÉRIES</h3>
                    <div className="border-t border-primary/20 pt-2 space-y-1 text-muted-foreground">
                      <p className="text-foreground/90 font-medium">💢 Adicionadas em 03/02/2026</p>
                      <p>🍿 Vanished</p>
                      <p>🍿 Under Salt Marsh [L]</p>
                      <p>🍿 This Boy is a Professional Wizard [L]</p>
                      <p>🍿 The Guilty [L]</p>
                      <p>🍿 Taiso Samurai [L]</p>
                      <p>🍿 Misterios da Antiga China [L]</p>
                      <p>🍿 Love Island Games [L]</p>
                      <p>🍿 Dona Beja</p>
                      <p>🍿 Danca no Gelo Rumo ao Ouro</p>
                      <p>🍿 A Vida dos Santos</p>
                      <p>🍿 The Inner Eye [L]</p>
                      <p>🍿 The Rainmaker</p>
                      <p>🍿 Entre o Inverno e a Primavera [L]</p>
                      <p>🍿 Ela Caminha Sozinha</p>
                      <p>🍿 ROLL OVER AND DIE</p>
                      <p>🍿 Zashiki Warashi no Tatami chan [L]</p>
                      <p>🍿 Vivendo sem Lacos</p>
                      <p>🍿 Um dos Garotos [L]</p>
                      <p>🍿 Mel Brooks The 99 Year Old Man [L]</p>
                      <p>🍿 Amor Sombrio</p>
                      <p>🍿 A Jornada da Lenda</p>
                      <p>🍿 My Sesame Street Friends [L]</p>
                      <p>🍿 Magnum</p>
                      <p>🍿 Take That [L]</p>
                      <p>🍿 PONIES [L]</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-primary font-bold mb-2">📺 NOVOS EPISÓDIOS</h3>
                    <div className="border-t border-primary/20 pt-2 space-y-1 text-muted-foreground">
                      <p className="text-foreground/90 font-medium">💢 Adicionados em 03/02/2026</p>
                      <p>📺 Vanished S01 E01</p>
                      <p>📺 This Boy is a Professional Wizard [L] S01 E01-E04</p>
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
