import Hero from "@/components/Hero";
import Channels from "@/components/Channels";
import Pricing from "@/components/Pricing";
import HowItWorks from "@/components/HowItWorks";
import Testimonials from "@/components/Testimonials";
import ContentUpdates from "@/components/ContentUpdates";
import Footer from "@/components/Footer";
import HowToWatch from "@/components/HowToWatch";
import AnnouncementModal from "@/components/AnnouncementModal";

const Index = () => {
  return (
    <main className="min-h-screen bg-background">
      <AnnouncementModal />
      <Hero />
      <Channels />
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