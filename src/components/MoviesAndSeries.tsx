import titanic from "@/assets/movies/titanic.jpg";
import comoEuEra from "@/assets/movies/como-eu-era-antes-de-voce.jpg";
import reacher from "@/assets/movies/reacher.png";
import stillborn from "@/assets/movies/stillborn.jpg";
import stillborn2 from "@/assets/movies/stillborn-2.jpg";
import doctorSleep from "@/assets/movies/doctor-sleep.jpg";
import loneStar from "@/assets/movies/911-lone-star.webp";
import morteDoDemonio from "@/assets/movies/morte-do-demonio.jpg";
import atracaoPerigosa from "@/assets/movies/atracao-perigosa.jpg";
import beezel from "@/assets/movies/beezel.jpg";
import milagreRua34 from "@/assets/movies/milagre-rua-34.jpg";
import voces from "@/assets/movies/voces.jpg";
import houseOfTheDragon from "@/assets/movies/house-of-the-dragon.jpg";
import dexter from "@/assets/movies/dexter.jpg";
import origem from "@/assets/movies/origem.jpg";
import electricState from "@/assets/movies/electric-state.jpg";

const content = [
  { id: 1, title: "Titanic", image: titanic, type: "Filme" },
  { id: 2, title: "Como Eu Era Antes de Você", image: comoEuEra, type: "Filme" },
  { id: 3, title: "Reacher", image: reacher, type: "Série" },
  { id: 4, title: "Still/Born", image: stillborn, type: "Filme" },
  { id: 5, title: "Still/Born", image: stillborn2, type: "Filme" },
  { id: 6, title: "Doctor Sleep", image: doctorSleep, type: "Filme" },
  { id: 7, title: "9-1-1: Lone Star", image: loneStar, type: "Série" },
  { id: 8, title: "A Morte do Demônio", image: morteDoDemonio, type: "Filme" },
  { id: 9, title: "Atração Perigosa", image: atracaoPerigosa, type: "Filme" },
  { id: 10, title: "Beezel", image: beezel, type: "Filme" },
  { id: 11, title: "Milagre na Rua 34", image: milagreRua34, type: "Filme" },
  { id: 12, title: "Voces", image: voces, type: "Filme" },
  { id: 13, title: "House of the Dragon", image: houseOfTheDragon, type: "Série" },
  { id: 14, title: "Dexter", image: dexter, type: "Série" },
  { id: 15, title: "Origem", image: origem, type: "Série" },
  { id: 16, title: "The Electric State", image: electricState, type: "Filme" },
];

const MoviesAndSeries = () => {
  return (
    <section className="py-16 px-4 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
            Filmes e Séries Disponíveis
          </h2>
          <p className="text-muted-foreground text-lg">
            Confira alguns dos títulos disponíveis no nosso catálogo
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {content.map((item) => (
            <div
              key={item.id}
              className="group relative overflow-hidden rounded-lg bg-card border border-border/50 hover:border-primary/50 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-primary/20"
            >
              <div className="aspect-[2/3] overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
                <span className="text-xs font-medium text-primary mb-1">{item.type}</span>
                <h3 className="text-sm font-semibold text-foreground line-clamp-2">{item.title}</h3>
              </div>
            </div>
          ))}
        </div>

        <p className="text-center text-muted-foreground mt-8 text-sm">
          E muito mais! Milhares de filmes e séries disponíveis.
        </p>
      </div>
    </section>
  );
};

export default MoviesAndSeries;
