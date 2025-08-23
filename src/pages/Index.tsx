import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import ProjectCarousel from "@/components/ProjectCarousel";
import About from "@/components/About";
import Pricing from "@/components/Pricing";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const Index = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.state?.scrollToPricing) {
      const el = document.getElementById("pricing");
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [location]);
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
