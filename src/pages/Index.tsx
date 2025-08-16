import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import ProjectCarousel from "@/components/ProjectCarousel";
import About from "@/components/About";
import Pricing from "@/components/Pricing";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen overflow-x-hidden">
      <Navigation />
      <Hero />
      {/* <Services /> */}
      {/* <ProjectCarousel /> */}
      <About />
      <Pricing />
      <Contact />
      <Footer />  
    </div>
  );
};

export default Index;
