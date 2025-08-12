import { motion } from "framer-motion";
import { Users, Award, Building2, TrendingUp, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useTranslation } from "react-i18next";
import teamImage from "@/assets/team-construction.jpg";
import abtimg from "@/assets/abt.jpeg";

const About = () => {
  const { t } = useTranslation();

  const achievements = [
    { icon: Building2, value: "500+", label: t("about.projects") },
    { icon: Users, value: "50+", label: t("about.experience") },
    { icon: Award, value: "100%", label: t("about.clients") },
    { icon: TrendingUp, value: "$2B+", label: t("about.awards") },
  ];

  const values = [
    `${t("about.value_list.l1")}`,
    `${t("about.value_list.l2")}`,
    `${t("about.value_list.l3")}`,
    `${t("about.value_list.l4")}`,
  ];

  return (
    <section id="about" className="py-20 bg-secondary/20">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Column - Image and Stats */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            {/* Image */}
            <div className="relative rounded-2xl overflow-hidden">
              <img
                src={abtimg}
                alt="D Buildz Team"
                className="w-full h-96 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent"></div>

              {/* Floating Stats Card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="absolute -bottom-6 -right-6 bg-background card-shadow rounded-xl p-6 border border-border/50"
              >
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">50+</div>
                  <div className="text-muted-foreground text-sm">
                    {t("about.subtitle")}
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Achievement Stats */}
            <div className="grid grid-cols-2 gap-4">
              {achievements.map((achievement, index) => (
                <motion.div
                  key={achievement.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + index * 0.1, duration: 0.6 }}
                >
                  <Card className="text-center hover-lift transition-smooth">
                    <CardContent className="p-6">
                      <div className="flex justify-center mb-3">
                        <achievement.icon className="h-8 w-8 text-primary" />
                      </div>
                      <div className="text-2xl font-bold text-foreground mb-1">
                        {achievement.value}
                      </div>
                      <div className="text-muted-foreground text-sm">
                        {achievement.label}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right Column - Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div>
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
                <span className="text-primary font-medium">
                  {t("about.title")}
                </span>
              </div>

              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                {t("about.subtitle")}
              </h2>

              <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
                <p>{t("about.description")}</p>
              </div>
              <div className="space-y-6 mt-4 text-lg text-muted-foreground leading-relaxed">
                <p>{t("about.description2")}</p>
              </div>
            </div>

            {/* Values List */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-foreground mb-4">
                {t("about.value_list.title")}
              </h3>
              {values.map((value, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
                  className="flex items-start space-x-3"
                >
                  <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">{value}</span>
                </motion.div>
              ))}
            </div>

            <div className="space-y-6 mt-4 text-lg text-muted-foreground leading-relaxed">
              <p>{t("about.description3")}</p>
            </div>

            {/* Call to Action */}
            <div className="pt-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="bg-primary hover:bg-primary-glow transition-smooth"
                >
                  {t("about.cta.b1")}
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-primary/20 hover:bg-primary/5"
                >
                  {t("about.cta.b2")}
                </Button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Quote Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-20 text-center"
        >
          <div className="max-w-4xl mx-auto">
            <blockquote className="text-2xl md:text-3xl font-medium text-foreground leading-relaxed">
              {t("about.cta.btm_title")}
            </blockquote>
            <div className="mt-6 flex items-center justify-center space-x-4">
              <div className="w-12 h-0.5 bg-primary"></div>
              <span className="text-muted-foreground font-medium">
                {t("about.cta.btm_desc")}
              </span>
              <div className="w-12 h-0.5 bg-primary"></div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;
