import { motion } from "framer-motion";
import { Building, HardHat, Wrench, Users, CheckCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const Services = () => {
  const services = [
    {
      icon: Building,
      title: "Commercial Construction",
      description: "From office buildings to retail spaces, we deliver exceptional commercial projects that meet your business needs.",
      features: ["Office Buildings", "Retail Centers", "Mixed-Use Developments"],
      color: "text-primary",
    },
    {
      icon: HardHat,
      title: "Industrial Projects",
      description: "Specialized industrial construction including manufacturing facilities, warehouses, and processing plants.",
      features: ["Manufacturing Facilities", "Warehouses", "Processing Plants"],
      color: "text-accent",
    },
    {
      icon: Wrench,
      title: "Infrastructure",
      description: "Essential infrastructure projects including bridges, roads, utilities, and public works development.",
      features: ["Bridge Construction", "Road Development", "Utility Systems"],
      color: "text-primary-glow",
    },
    {
      icon: Users,
      title: "Design-Build",
      description: "Integrated design and construction services for streamlined project delivery and enhanced collaboration.",
      features: ["Integrated Solutions", "Cost Efficiency", "Timeline Optimization"],
      color: "text-construction-orange",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
    },
  };

  return (
    <section id="services" className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <span className="text-primary font-medium">Our Expertise</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="gradient-text">Construction Services</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            With over five decades of experience, we provide comprehensive construction services 
            across multiple sectors, delivering quality and innovation in every project.
          </p>
        </motion.div>

        {/* Services Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16"
        >
          {services.map((service, index) => (
            <motion.div 
              key={service.title} 
              variants={itemVariants}
              transition={{ duration: 0.6 }}
            >
              <Card className="h-full group hover-lift card-shadow hover:glow-shadow transition-smooth border-border/50">
                <CardContent className="p-8">
                  <div className="flex flex-col items-center text-center space-y-6">
                    {/* Icon */}
                    <div className={`p-4 rounded-full bg-secondary/50 group-hover:bg-primary/10 transition-smooth`}>
                      <service.icon className={`h-8 w-8 ${service.color} group-hover:scale-110 transition-smooth`} />
                    </div>

                    {/* Content */}
                    <div className="space-y-4">
                      <h3 className="text-xl font-bold text-foreground">{service.title}</h3>
                      <p className="text-muted-foreground leading-relaxed">{service.description}</p>
                    </div>

                    {/* Features */}
                    <div className="w-full space-y-2">
                      {service.features.map((feature) => (
                        <div key={feature} className="flex items-center space-x-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-primary flex-shrink-0" />
                          <span className="text-muted-foreground">{feature}</span>
                        </div>
                      ))}
                    </div>

                    {/* Learn More Button */}
                    <Button
                      variant="ghost"
                      className="group/btn text-primary hover:text-primary-foreground hover:bg-primary transition-smooth"
                    >
                      Learn More
                      <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-smooth" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <div className="bg-primary/5 border border-primary/20 rounded-2xl p-8 md:p-12">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              Ready to Start Your Next Project?
            </h3>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Our experienced team is ready to bring your vision to life. Contact us today 
              to discuss your construction needs and get a personalized quote.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary-glow transition-smooth px-8"
              >
                Get Free Quote
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="px-8"
              >
                View Portfolio
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Services;