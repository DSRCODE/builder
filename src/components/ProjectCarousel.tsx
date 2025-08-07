import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, MapPin, Calendar, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import buildingImage from "@/assets/building-modern.jpg";

const ProjectCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const projects = [
    {
      id: 1,
      title: "Downtown Corporate Center",
      category: "Commercial",
      location: "Denver, CO",
      year: "2024",
      value: "$45M",
      description: "A state-of-the-art 20-story corporate headquarters featuring sustainable design and cutting-edge technology integration.",
      image: buildingImage,
      features: ["LEED Platinum", "Smart Building Technology", "Energy Efficient"],
    },
    {
      id: 2,
      title: "Healthcare Innovation Campus",
      category: "Healthcare",
      location: "Austin, TX",
      year: "2024",
      value: "$85M",
      description: "Modern medical facility with advanced patient care areas, research labs, and collaborative spaces for healthcare innovation.",
      image: buildingImage,
      features: ["Advanced Medical Equipment", "Patient-Centered Design", "Research Facilities"],
    },
    {
      id: 3,
      title: "Sustainable Manufacturing Hub",
      category: "Industrial",
      location: "Phoenix, AZ",
      year: "2023",
      value: "$32M",
      description: "Eco-friendly manufacturing facility designed for efficiency and sustainability with renewable energy systems.",
      image: buildingImage,
      features: ["Solar Integration", "Zero Waste Design", "Automated Systems"],
    },
    {
      id: 4,
      title: "University Science Complex",
      category: "Education",
      location: "Seattle, WA",
      year: "2023",
      value: "$67M",
      description: "Cutting-edge science and research complex with modern laboratories, collaborative spaces, and sustainable features.",
      image: buildingImage,
      features: ["Advanced Laboratories", "Collaborative Spaces", "Sustainable Design"],
    },
  ];

  // Auto-advance slides
  useEffect(() => {
    if (!isAutoPlaying) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % projects.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [isAutoPlaying, projects.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % projects.length);
    setIsAutoPlaying(false);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + projects.length) % projects.length);
    setIsAutoPlaying(false);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
  };

  return (
    <section id="projects" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-accent/10 border border-accent/20 mb-6">
            <span className="text-accent font-medium">Featured Work</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="gradient-text">Our Latest Projects</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Explore our portfolio of successfully completed projects across various sectors, 
            showcasing our commitment to quality, innovation, and client satisfaction.
          </p>
        </motion.div>

        {/* Carousel */}
        <div className="relative max-w-6xl mx-auto">
          <div className="relative overflow-hidden rounded-2xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, x: 300 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -300 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="relative"
              >
                <Card className="border-0 shadow-2xl">
                  <CardContent className="p-0">
                    <div className="grid lg:grid-cols-2 min-h-[500px]">
                      {/* Image Side */}
                      <div className="relative overflow-hidden">
                        <img
                          src={projects[currentSlide].image}
                          alt={projects[currentSlide].title}
                          className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent"></div>
                        
                        {/* Category Badge */}
                        <div className="absolute top-6 left-6">
                          <div className="bg-accent/90 backdrop-blur-sm text-accent-foreground px-4 py-2 rounded-full font-medium text-sm">
                            {projects[currentSlide].category}
                          </div>
                        </div>
                      </div>

                      {/* Content Side */}
                      <div className="p-8 lg:p-12 flex flex-col justify-center">
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2, duration: 0.5 }}
                          className="space-y-6"
                        >
                          <h3 className="text-3xl lg:text-4xl font-bold text-foreground">
                            {projects[currentSlide].title}
                          </h3>
                          
                          <p className="text-muted-foreground text-lg leading-relaxed">
                            {projects[currentSlide].description}
                          </p>

                          {/* Project Details */}
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="flex items-center space-x-2">
                              <MapPin className="h-4 w-4 text-primary" />
                              <span className="text-sm text-muted-foreground">{projects[currentSlide].location}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Calendar className="h-4 w-4 text-primary" />
                              <span className="text-sm text-muted-foreground">{projects[currentSlide].year}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <DollarSign className="h-4 w-4 text-primary" />
                              <span className="text-sm text-muted-foreground">{projects[currentSlide].value}</span>
                            </div>
                          </div>

                          {/* Features */}
                          <div className="flex flex-wrap gap-2">
                            {projects[currentSlide].features.map((feature) => (
                              <span
                                key={feature}
                                className="bg-secondary/50 text-secondary-foreground px-3 py-1 rounded-full text-sm"
                              >
                                {feature}
                              </span>
                            ))}
                          </div>

                          <Button
                            className="bg-primary hover:bg-primary-glow transition-smooth w-fit"
                          >
                            View Project Details
                          </Button>
                        </motion.div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Arrows */}
          <Button
            variant="outline"
            size="icon"
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-background/80 backdrop-blur-sm border-border/50 hover:bg-background"
            onClick={prevSlide}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          
          <Button
            variant="outline"
            size="icon"
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-background/80 backdrop-blur-sm border-border/50 hover:bg-background"
            onClick={nextSlide}
          >
            <ChevronRight className="h-5 w-5" />
          </Button>

          {/* Dot Indicators */}
          <div className="flex justify-center mt-8 space-x-2">
            {projects.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-smooth ${
                  index === currentSlide
                    ? "bg-primary"
                    : "bg-muted hover:bg-primary/50"
                }`}
              />
            ))}
          </div>

          {/* Progress Bar */}
          <div className="mt-4 w-full bg-muted rounded-full h-1">
            <motion.div
              className="bg-primary h-1 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${((currentSlide + 1) / projects.length) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProjectCarousel;