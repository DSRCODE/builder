import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, PlayCircle, Building, Users, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import heroImage from "/hero-construction.jpg";

const Hero = () => {
  const { t } = useTranslation();
  const [typedText, setTypedText] = useState("");
  const fullText = t('hero.title');

  useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      if (index < fullText.length) {
        setTypedText(fullText.slice(0, index + 1));
        index++;
      } else {
        clearInterval(timer);
      }
    }, 100);

    return () => clearInterval(timer);
  }, [fullText]);

  const stats = [
    { icon: Building, value: "500+", label: t('about.projects') },
    { icon: Users, value: "50+", label: t('about.experience') },
    { icon: Award, value: "100%", label: t('about.awards') },
  ];

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center overflow-hidden"
    >
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Construction site"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 hero-gradient opacity-90"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Text Content */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-6"
            >
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-accent/10 border border-accent/20">
                <span className="text-accent font-medium">
                  Leading Construction Excellence
                </span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                <span className="block">{typedText}</span>
              </h1>

              <p className="text-xl text-white/90 leading-relaxed max-w-lg">
                {t('hero.subtitle')}
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold px-8 py-4 rounded-full transition-bounce hover:scale-105 group"
                >
                  {t('hero.getStarted')}
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-smooth" />
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-white/30 text-white bg-white/20 hover:bg-white/10 px-8 py-4 rounded-full backdrop-blur-sm"
                >
                  <PlayCircle className="mr-2 h-5 w-5" /> {t('hero.learnMore')}
                </Button>
              </div>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mt-16 grid grid-cols-3 gap-8"
            >
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="flex justify-center mb-2">
                    <stat.icon className="h-8 w-8 text-accent" />
                  </div>
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                  <div className="text-sm text-white/70">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right Column - Visual Elements */}
         <div className="relative hidden lg:flex justify-center items-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="relative"
            >
              {/* Floating Card 1 */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute -top-28 -left-8 bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20"
              >
                <div className="text-accent text-2xl font-bold">2025</div>
                <div className="text-white/80 text-sm whitespace-nowrap">
                  Innovation Year
                </div>
              </motion.div>

              {/* Floating Card 2 */}
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1.5,
                }}
                className="absolute -bottom-20 -right-8 bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20"
              >
                <div className="text-accent text-2xl font-bold">100%</div>
                <div className="text-white/80 text-sm whitespace-nowrap">
                  Employee Owned
                </div>
              </motion.div>

              {/* Central Icon */}
              {/* <div className="w-32 h-32 bg-white/10 backdrop-blur-lg rounded-full flex items-center justify-center border border-white/20">
                <Building className="h-16 w-16 text-accent" />
              </div> */}
            </motion.div>
          </div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-6 h-10 border-2 border-white/40 rounded-full flex justify-center"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
            className="w-1 h-3 bg-white/60 rounded-full mt-2"
          ></motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;
