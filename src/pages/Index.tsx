import Hero from "@/components/Hero";
import PromoBanner from "@/components/PromoBanner";
import Channels from "@/components/Channels";
import Pricing from "@/components/Pricing";
import HowItWorks from "@/components/HowItWorks";
import Testimonials from "@/components/Testimonials";
import ContentUpdates from "@/components/ContentUpdates";
import Footer from "@/components/Footer";
import HowToWatch from "@/components/HowToWatch";
import MoviesAndSeries from "@/components/MoviesAndSeries";

const Index = () => {
  return (
    <main className="min-h-screen bg-background">
      <Hero />
      <PromoBanner />
      <Channels />
      <MoviesAndSeries />
      <Pricing />
      <HowItWorks />
      <Testimonials />
      <ContentUpdates />
      <Footer />
      <HowToWatch />
    </main>
  );
};

export default Index;