import { Card } from "@/components/ui/card";
import { Tv2, Film, Trophy, Gamepad2, Music, Globe } from "lucide-react";

const categories = [
  {
    icon: Tv2,
    name: "Canais Abertos",
    count: "+2000",
    gradient: "from-blue-500 to-cyan-500"
  },
  {
    icon: Film,
    name: "Filmes & Séries",
    count: "+10000",
    gradient: "from-purple-500 to-pink-500"
  },
  {
    icon: Trophy,
    name: "Esportes",
    count: "150+",
    gradient: "from-green-500 to-emerald-500"
  },
  {
    icon: Gamepad2,
    name: "Infantil",
    count: "100+",
    gradient: "from-orange-500 to-red-500"
  },
  {
    icon: Music,
    name: "Música",
    count: "80+",
    gradient: "from-pink-500 to-rose-500"
  },
  {
    icon: Globe,
    name: "Internacional",
    count: "300+",
    gradient: "from-indigo-500 to-blue-500"
  }
];

const Channels = () => {
  return (
    <section className="py-24 px-4 relative">
      <div className="container mx-auto">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Milhares de Canais
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Entretenimento ilimitado para toda a família
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <Card 
                key={category.name}
                className="group relative overflow-hidden bg-card border-border hover:border-primary/50 transition-all duration-300 hover:scale-105 cursor-pointer"
              >
                <div className="p-6 text-center space-y-3">
                  <div className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br ${category.gradient} p-3 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-full h-full text-white" />
                  </div>
                  <h3 className="font-semibold text-foreground text-sm">{category.name}</h3>
                  <p className="text-2xl font-bold text-primary">{category.count}</p>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Channels;