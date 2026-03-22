import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

const newMovies = [
  ["ImpunIdade: As consequências da lei da maioridade penal no Brasil", "Filmes | Lancamentos 22/03/2026"],
  ["Resgate Polar", "Filmes | Lancamentos 22/03/2026"],
  ["No Reino das Sombras", "Filmes | Lancamentos 22/03/2026"],
  ["Meu Sonho Americano", "Filmes | Lancamentos 22/03/2026"],
  ["Fresh Hell", "Filmes | Lancamentos 22/03/2026"],
  ["Servindo Nazistas", "Filmes | Lancamentos 22/03/2026"],
  ["Uno: Entre o Ouro e a Morte", "Filmes | Lancamentos 22/03/2026"],
  ["Agente Zeta", "Filmes | Lancamentos 21/03/2026"],
  ["Ruído da Morte", "Filmes | Lancamentos 21/03/2026"],
  ["Sem Deixar Vestigios", "Filmes | Lancamentos 21/03/2026"],
  ["O Diário de Pilar na Amazônia", "Filmes | Lancamentos 21/03/2026"],
  ["Peaky Blinders: O Homem Imortal", "Filmes | Lancamentos 21/03/2026"],
  ["A Face Oculta de Varginha: Poder, Dinheiro e Rituais.", "Filmes | Lancamentos 18/03/2026"],
  ["Sonhar com Leões", "Filmes | Lancamentos 18/03/2026"],
  ["Contos da Babilônia", "Filmes | Lancamentos 18/03/2026"],
  ["Bibi", "Filmes | Lancamentos 18/03/2026"],
  ["Algea: Deus da Dor", "Filmes | Lancamentos 18/03/2026"],
  ["Mar.IA", "Filmes | Lancamentos 18/03/2026"],
  ["13 Dias no Lago da Morte", "Filmes | Lancamentos 18/03/2026"],
  ["Assassino de Sangue", "Filmes | Lancamentos 18/03/2026"],
  ["Finja-se de Morta", "Filmes | Lancamentos 18/03/2026"],
  ["A Casa de Tijolos de Barro", "Filmes | Lancamentos 18/03/2026"],
  ["O Último Herege", "Filmes | Lancamentos 18/03/2026"],
  ["A Máscara da Morte", "Filmes | Lancamentos 18/03/2026"],
  ["Patrulha Noturna", "Filmes | Lancamentos 18/03/2026"],
] as const;

const newSeries = [
  "Amor Animal (2026) [L]",
  "Missao Silenciosa (2024)",
  "1995 No Tempo dos Bad Boys (2025)",
  "Colosio Assassinato Politico (2026) [L]",
  "Super Fofos Aventura na Cidade (2024)",
  "Entrelinhas Pontilhadas (2021)",
  "STEEL BALL RUN JoJos Bizarre Adventure (2026)",
  "Jesy Nelson Life After Little Mix (2026) [L]",
  "Angel Flight Operacao Translado (2023) [L]",
  "Vanished Name (2026) [L]",
  "Love Island All Stars (2024) [L]",
  "Venus Project Climax (2015) [L]",
  "Climax (2026) [L]",
  "A Woman of Substance (2026) [L]",
  "Sonho Dos Anos Dourados (2026) [L]",
  "Emergencia Radioativa (2026)",
  "Mulheres Imperfeitas (2026)",
  "A Nobreza do Amor (2026)",
  "011ZE Nova Geracao (2026)",
  "The Capture",
  "Everwood Uma Segunda Chance",
  "The Unseen (2026) [L]",
  "A Jogadora (2025) [L]",
  "Mestres das Lembrancas (2026) [L]",
  "Pluto (2024) [L]",
];

const newEpisodes = [
  "Amor Animal (2026) [L] S01 E02",
  "Amor Animal (2026) [L] S01 E03",
  "Amor Animal (2026) [L] S01 E04",
  "Amor Animal (2026) [L] S01 E05",
  "Amor Animal (2026) [L] S01 E06",
  "Amor Animal (2026) [L] S01 E07",
  "Amor Animal (2026) [L] S01 E08",
  "Missao Silenciosa (2024) S01 E01",
  "Missao Silenciosa (2024) S01 E02",
  "Missao Silenciosa (2024) S01 E03",
  "Missao Silenciosa (2024) S01 E04",
  "Missao Silenciosa (2024) S01 E05",
  "Missao Silenciosa (2024) S01 E06",
  "Missao Silenciosa (2024) S01 E07",
  "Missao Silenciosa (2024) S01 E08",
  "Amor Animal (2026) [L] S01 E01",
  "Colosio Assassinato Politico (2026) [L] S01 E01",
  "Colosio Assassinato Politico (2026) [L] S01 E02",
  "Colosio Assassinato Politico (2026) [L] S01 E03",
  "1995 No Tempo dos Bad Boys (2025) S01 E01",
  "1995 No Tempo dos Bad Boys (2025) S01 E02",
  "1995 No Tempo dos Bad Boys (2025) S01 E03",
  "Super Fofos Aventura na Cidade (2024) S01 E03",
  "Super Fofos Aventura na Cidade (2024) S01 E04",
  "Super Fofos Aventura na Cidade (2024) S01 E05",
];

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
                  <p className="text-primary font-semibold mb-2">🟢 ATUALIZAÇÃO 22/03/2026 🟢</p>
                </div>

                <div className="space-y-3">
                  <div>
                    <h3 className="text-primary font-bold mb-2">🎬 NOVOS FILMES</h3>
                    <div className="border-t border-primary/20 pt-2 space-y-2 text-muted-foreground">
                      {newMovies.map(([movie, date]) => (
                        <div key={movie}>
                          <p className="text-foreground/90 font-medium">🎥️ {movie}</p>
                          <p>{date}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-primary font-bold mb-2">🍿 NOVAS SÉRIES</h3>
                    <div className="border-t border-primary/20 pt-2 space-y-2 text-muted-foreground">
                      {newSeries.map((series) => (
                        <div key={series}>
                          <p className="text-foreground/90 font-medium">🍿 {series}</p>
                          <p>22/03/2026</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-primary font-bold mb-2">📺 NOVOS EPISÓDIOS</h3>
                    <div className="border-t border-primary/20 pt-2 space-y-2 text-muted-foreground">
                      {newEpisodes.map((episode) => (
                        <div key={episode}>
                          <p className="text-foreground/90 font-medium">📺 {episode}</p>
                          <p>22/03/2026</p>
                        </div>
                      ))}
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
