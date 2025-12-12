import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
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
import ilhaDoInverno from "@/assets/movies/ilha-do-inverno.jpg";
import forestRoad from "@/assets/movies/825-forest-road.jpg";
import invocacaoDoMal4 from "@/assets/movies/invocacao-do-mal-4.jpg";
import acordandoODiabo from "@/assets/movies/acordando-o-diabo.jpg";
import greysAnatomy from "@/assets/movies/greys-anatomy.jpg";

const movies = [
  { id: 1, title: "Titanic", image: titanic },
  { id: 2, title: "Como Eu Era Antes de Você", image: comoEuEra },
  { id: 4, title: "Still/Born", image: stillborn },
  { id: 5, title: "Still/Born", image: stillborn2 },
  { id: 6, title: "Doctor Sleep", image: doctorSleep },
  { id: 8, title: "A Morte do Demônio", image: morteDoDemonio },
  { id: 9, title: "Atração Perigosa", image: atracaoPerigosa },
  { id: 10, title: "Beezel", image: beezel },
  { id: 11, title: "Milagre na Rua 34", image: milagreRua34 },
  { id: 12, title: "Voces", image: voces },
  { id: 16, title: "The Electric State", image: electricState },
  { id: 17, title: "A Ilha do Inverno", image: ilhaDoInverno },
  { id: 18, title: "825 Forest Road", image: forestRoad },
  { id: 19, title: "Invocação do Mal 4", image: invocacaoDoMal4 },
  { id: 20, title: "Acordando o Diabo", image: acordandoODiabo },
];

const series = [
  { id: 3, title: "Reacher", image: reacher },
  { id: 7, title: "9-1-1: Lone Star", image: loneStar },
  { id: 13, title: "House of the Dragon", image: houseOfTheDragon },
  { id: 14, title: "Dexter", image: dexter },
  { id: 15, title: "Origem", image: origem },
  { id: 21, title: "Grey's Anatomy", image: greysAnatomy },
];

interface ContentCarouselProps {
  title: string;
  items: { id: number; title: string; image: string }[];
}

const ContentCarousel = ({ title, items }: ContentCarouselProps) => (
  <div className="mb-10">
    <h3 className="text-2xl font-bold text-foreground mb-4 px-2">{title}</h3>
    <Carousel
      opts={{
        align: "start",
        loop: true,
      }}
      className="w-full"
    >
      <CarouselContent className="-ml-2 md:-ml-4">
        {items.map((item) => (
          <CarouselItem key={item.id} className="pl-2 md:pl-4 basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 xl:basis-1/6">
            <div className="group relative overflow-hidden rounded-lg bg-card border border-border/50 hover:border-primary/50 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-primary/20">
              <div className="aspect-[2/3] overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
                <h4 className="text-sm font-semibold text-foreground line-clamp-2">{item.title}</h4>
              </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="left-0 -translate-x-1/2 bg-background/80 border-border hover:bg-primary hover:text-primary-foreground" />
      <CarouselNext className="right-0 translate-x-1/2 bg-background/80 border-border hover:bg-primary hover:text-primary-foreground" />
    </Carousel>
  </div>
);

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

        <ContentCarousel title="🎬 Filmes" items={movies} />
        <ContentCarousel title="📺 Séries" items={series} />

        <p className="text-center text-muted-foreground mt-4 text-sm">
          E muito mais! Milhares de filmes e séries disponíveis.
        </p>
      </div>
    </section>
  );
};

export default MoviesAndSeries;
