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
                  <p className="text-primary font-semibold mb-2">🟢 ATUALIZAÇÃO 08/01/2026 🟢</p>
                </div>

                <div className="space-y-3">
                  <div>
                    <h3 className="text-primary font-bold mb-2">📺 NOVOS CANAIS</h3>
                    <div className="border-t border-primary/20 pt-2 space-y-1 text-muted-foreground">
                      <p className="text-foreground/90 font-medium">💢 COPINHA 2026 - 04/01/2026</p>
                      <p>📺 COPINHA 01</p>
                      <p>📺 COPINHA 02</p>
                      <p>📺 COPINHA 03</p>
                      <p>📺 COPINHA 04</p>
                      <p>📺 COPINHA 05</p>
                      <p>📺 COPINHA 06</p>
                      <p>📺 COPINHA 07</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-primary font-bold mb-2">🎬 NOVOS FILMES</h3>
                    <div className="border-t border-primary/20 pt-2 space-y-1 text-muted-foreground">
                      <p className="text-foreground/90 font-medium">💢 Filmes | Drama - 04/01/2026</p>
                      <p>🎥️ Chuva de Chumbo</p>
                      <p>🎥️ Cidade do Sol</p>
                      <p>🎥️ A Segunda Guerra Civil</p>
                      <p>🎥️ Um Crime na Confeitaria</p>
                      <p>🎥️ Vida Selvagem</p>
                      <p>🎥️ A Letra Escarlate</p>
                      <p>🎥️ Freud: Além da Alma</p>
                      <p>🎥️ Esquentando o Alasca</p>
                      <p>🎥️ Garota Fantástica</p>
                      <p>🎥️ Girl Lost - A Garota de Programa</p>
                      <p>🎥️ O Maníaco do Facebook</p>
                      <p>🎥️ O Desejo de Saiuri</p>
                      <p>🎥️ Paulo, Apóstolo de Cristo</p>
                      <p>🎥️ Vidas Partidas</p>
                      <p>🎥️ Missão Especial</p>
                      <p>🎥️ Diário de uma Louca</p>
                      <p>🎥️ Avenida</p>
                      <p>🎥️ A Jovem Rainha Vitória</p>
                      <p>🎥️ Insensata Paixão</p>
                      <p>🎥️ O Confidente da Rainha</p>
                      <p>🎥️ Sangue & Chocolate</p>
                      <p>🎥️ Apenas uma Chance</p>
                      <p>🎥️ Um Sonho de Amor</p>
                      <p>🎥️ Ao Mestre, Com Carinho</p>
                      <p>🎥️ A Última Tentação de Cristo</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-primary font-bold mb-2">🍿 NOVAS SÉRIES</h3>
                    <div className="border-t border-primary/20 pt-2 space-y-1 text-muted-foreground">
                      <p className="text-foreground/90 font-medium">💢 Adicionadas em 08/01/2026</p>
                      <p>🍿 Stargate Infinity</p>
                      <p>🍿 Kamen Rider Build</p>
                      <p>🍿 Dragões A Série</p>
                      <p>🍿 Digimon Xros Wars</p>
                      <p>🍿 Bridgerton [L]</p>
                      <p>🍿 Sentenced to Be a Hero</p>
                      <p>🍿 Projeto Prometheus</p>
                      <p>🍿 Merteuil Jogos de Sedução</p>
                      <p>🍿 Velocidade e Amor</p>
                      <p>🍿 Se o Destino Quiser</p>
                      <p>🍿 O Pretendente Perfeito</p>
                      <p>🍿 Leopard Skin</p>
                      <p>🍿 Corações Destinados</p>
                      <p>🍿 Chapolin e Os Colorados</p>
                      <p>🍿 Cautiva por Amor</p>
                      <p>🍿 Barbapapa Uma Grande Família</p>
                      <p>🍿 As Aventuras do Gato de Botas</p>
                      <p>🍿 All Her Fault</p>
                      <p>🍿 Manto e Adaga</p>
                      <p>🍿 Estrada de Sangue</p>
                      <p>🍿 Digimon Frontier</p>
                      <p>🍿 Claymore</p>
                      <p>🍿 Cidade Secreta</p>
                      <p>🍿 Só para Membros Palm Beach</p>
                      <p>🍿 Mistletoe Murders</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-primary font-bold mb-2">📺 NOVOS EPISÓDIOS</h3>
                    <div className="border-t border-primary/20 pt-2 space-y-1 text-muted-foreground">
                      <p className="text-foreground/90 font-medium">💢 Digimon Frontier - 07/01/2026</p>
                      <p>📺 S01 E30 ao E50 (21 Novos Episódios)</p>
                      
                      <p className="text-foreground/90 font-medium mt-2">💢 Outras Séries - 07/01/2026</p>
                      <p>📺 Choque de Cultura A Série S01 E04</p>
                      <p>📺 Talvez Amanhã S01 E09-E10</p>
                      <p>📺 Pro Bono S01 E09</p>
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
