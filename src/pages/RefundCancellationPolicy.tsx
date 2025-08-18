import Breadcrumb from "@/components/Breadcrumb";
import { motion } from "framer-motion";
import { RefreshCcw } from "lucide-react";
import { useTranslation } from "react-i18next";

const RefundCancellationPolicy = () => {
  const { t } = useTranslation();

  const refundPoints = [
    t("refund.points.1"),
    t("refund.points.2"),
    t("refund.points.3"),
    t("refund.points.4"),
    t("refund.points.5"),
    t("refund.points.6"),
  ];

  return (
    <section id="refund" className="py-20 bg-secondary/10">
      <div className="container mx-auto px-4">
        <Breadcrumb current={"Refund & Cancellation Policy"} />
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto mb-12 text-center"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            {t("refund.title")}
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            {t("refund.intro")}
          </p>
        </motion.div>

        <div className="space-y-6 max-w-4xl mx-auto">
          {refundPoints.map((point, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 + index * 0.1, duration: 0.5 }}
              className="flex items-start space-x-4"
            >
              <RefreshCcw className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
              <p className="text-muted-foreground">{point}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RefundCancellationPolicy;
