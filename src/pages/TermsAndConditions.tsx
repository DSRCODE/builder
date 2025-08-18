import Breadcrumb from "@/components/Breadcrumb";
import { motion } from "framer-motion";
import { FileText, AlertCircle, Mail } from "lucide-react";
import { useTranslation } from "react-i18next";

const TermsAndConditions = () => {
  const { t } = useTranslation();

  const termsPoints = [
    t("terms.points.1"),
    t("terms.points.2"),
    t("terms.points.3"),
    t("terms.points.4"),
    t("terms.points.5"),
    t("terms.points.6"),
    t("terms.points.7"),
    t("terms.points.8"),
    t("terms.points.9"),
    t("terms.points.10"),
    t("terms.points.11"),
    t("terms.points.12"),
    t("terms.points.13"),
    t("terms.points.14"),
  ];

  return (
    <section id="terms" className="py-20 bg-secondary/10">
      <div className="container mx-auto px-4">
        <Breadcrumb current={"Terms & Conditions"} />
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto mb-12 text-center"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            {t("terms.title")}
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            {t("terms.intro")}
          </p>
        </motion.div>

        {/* Terms Points */}
        <div className="space-y-8 max-w-4xl mx-auto">
          {termsPoints.map((point, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 * index, duration: 0.6 }}
              className="flex items-start space-x-4"
            >
              <FileText className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
              <p className="text-muted-foreground">{point}</p>
            </motion.div>
          ))}
        </div>

        {/* Contact */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="max-w-4xl mx-auto mt-12 text-center text-muted-foreground"
        >
          <Mail className="mx-auto mb-2 h-6 w-6 text-primary" />
          <p className="text-[#FB923C]">{t("terms.contact")}</p>
        </motion.div>
      </div>
    </section>
  );
};

export default TermsAndConditions;
