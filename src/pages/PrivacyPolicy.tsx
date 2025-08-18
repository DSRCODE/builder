import Breadcrumb from "@/components/Breadcrumb";
import { motion } from "framer-motion";
import { Shield, Lock, FileText, Mail } from "lucide-react";
import { useTranslation } from "react-i18next";

const PrivacyPolicy = () => {
  const { t } = useTranslation();

  const sections = [
    {
      icon: Shield,
      title: t("privacy.section1.title"),
      content: t("privacy.section1.desc"),
    },
    {
      icon: Lock,
      title: t("privacy.section2.title"),
      content: t("privacy.section2.desc"),
    },
    {
      icon: FileText,
      title: t("privacy.section3.title"),
      content: t("privacy.section3.desc"),
    },
    {
      icon: Mail,
      title: t("privacy.section4.title"),
      content: t("privacy.section4.desc"),
    },
  ];

  return (
    <section id="privacy" className="py-20 bg-secondary/10">
      <div className="container mx-auto px-4">
        <Breadcrumb current="Privacy Policy" />
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl mx-auto mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            {t("privacy.title")}
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            {t("privacy.intro")}
          </p>
        </motion.div>

        {/* Main Sections */}
        <div className="space-y-12">
          {sections.map((sec, index) => (
            <motion.div
              key={sec.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 + index * 0.1, duration: 0.6 }}
              className="bg-background rounded-xl p-6 border border-border/50 shadow-sm"
            >
              <div className="flex items-start space-x-4">
                <sec.icon className="h-8 w-8 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h2 className="text-xl font-semibold mb-2">{sec.title}</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    {sec.content}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Footer Note */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-16 text-center text-muted-foreground"
        >
          <p>{t("privacy.footer")}</p>
        </motion.div>
      </div>
    </section>
  );
};

export default PrivacyPolicy;
