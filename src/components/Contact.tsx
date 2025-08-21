import { useState } from "react";
import { motion } from "framer-motion";
import { Phone, Mail, MapPin, Clock, Send, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";

const Contact = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    // projectType: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const contactInfo = [
    {
      icon: Phone,
      title: `${t("contact.cnt_info.phn.title")}`,
      content: `${t("contact.cnt_info.phn.content")}`,
      subContent: `${t("contact.cnt_info.phn.subcontent")}`,
    },
    {
      icon: Mail,
      title: `${t("contact.cnt_info.mail.title")}`,
      content: `${t("contact.cnt_info.mail.content")}`,
      subContent: `${t("contact.cnt_info.mail.subcontent")}`,
    },
    // {
    //   icon: MapPin,
    //   title: `${t("contact.cnt_info.map.title")}`,
    //   content: `${t("contact.cnt_info.map.content")}`,
    //   subContent: `${t("contact.cnt_info.map.subcontent")}`,
    // },
    {
      icon: Clock,
      title: `${t("contact.cnt_info.clock.title")}`,
      content: `${t("contact.cnt_info.clock.content")}`,
      subContent: `${t("contact.cnt_info.clock.subcontent")}`,
    },
  ];

  const projectTypes = [
    "Commercial Building",
    "Industrial Facility",
    "Healthcare Facility",
    "Education Building",
    "Infrastructure Project",
    "Renovation/Retrofit",
    "Other",
  ];

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      toast({
        title: "Message Sent Successfully!",
        description:
          "Thank you for contacting D Buildz. We'll get back to you within 24 hours.",
      });
      setFormData({
        name: "",
        email: "",
        phone: "",
        company: "",
        // projectType: "",
        message: "",
      });
      setIsSubmitting(false);
    }, 2000);
  };

  const isFormValid = formData.name && formData.email && formData.message;

  return (
    <section
      id="contact"
      className="py-20 bg-gradient-to-br from-primary/5 to-accent/5"
    >
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
            <span className="text-primary font-medium">
              {t("contact.header.title")}
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            {t("contact.header.heading")}
            <span className="gradient-text">
              {" "}
              {t("contact.header.heading_sub")}
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            {t("contact.header.desc")}
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-12 max-w-7xl mx-auto">
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div>
              <h3 className="text-2xl font-bold text-foreground mb-6">
                {t("contact.cnt_info.title")}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {t("contact.cnt_info.desc")}
              </p>
            </div>

            <div className="space-y-6">
              {contactInfo.map((info, index) => (
                <motion.div
                  key={info.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + index * 0.1, duration: 0.6 }}
                >
                  <Card className="hover-lift transition-smooth border-border/50">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className="p-3 bg-primary/10 rounded-lg">
                          <info.icon className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-foreground mb-1">
                            {info.title}
                          </h4>
                          <p className="text-foreground font-medium">
                            {info.content}
                          </p>
                          <p className="text-muted-foreground text-sm">
                            {info.subContent}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Quick Quote CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              <Card className="bg-primary/5 border-primary/20">
                <CardContent className="p-6 text-center">
                  <h4 className="font-semibold text-foreground mb-2">
                    {t("contact.cnt_cta.title")}
                  </h4>
                  <p className="text-muted-foreground text-sm mb-4">
                    {t("contact.cnt_cta.p")}
                  </p>
                  <Button className="bg-primary hover:bg-primary-glow transition-smooth">
                    {t("contact.cnt_cta.call_now")}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-2"
          >
            <Card className="card-shadow border-border/50">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-foreground mb-6">
                  {t("contact.cnt_form.title")}
                </h3>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name and Email Row */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label
                        htmlFor="name"
                        className="text-foreground font-medium"
                      >
                        {t("contact.cnt_form.full_name")}
                      </Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder={t("contact.cnt_form.full_name_place")}
                        className="transition-smooth focus:ring-2 focus:ring-primary/20"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="email"
                        className="text-foreground font-medium"
                      >
                        {t("contact.cnt_form.email_address")}
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder={t("contact.cnt_form.email_place")}
                        className="transition-smooth focus:ring-2 focus:ring-primary/20"
                        required
                      />
                    </div>
                  </div>

                  {/* Phone and Company Row */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label
                        htmlFor="phone"
                        className="text-foreground font-medium"
                      >
                        {t("contact.cnt_form.phn_no")}
                      </Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="(555) 123-4567"
                        className="transition-smooth focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="company"
                        className="text-foreground font-medium"
                      >
                        {t("contact.cnt_form.cmp_org")}
                      </Label>
                      <Input
                        id="company"
                        name="company"
                        value={formData.company}
                        onChange={handleInputChange}
                        placeholder={t("contact.cnt_form.cmp_org_place")}
                        className="transition-smooth focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                  </div>

                  {/* Project Type */}
                  {/* <div className="space-y-2">
                    <Label
                      htmlFor="projectType"
                      className="text-foreground font-medium"
                    >
                      {t("contact.cnt_form.prj")}
                    </Label>
                    <select
                      id="projectType"
                      name="projectType"
                      value={formData.projectType}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground transition-smooth focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    >
                      <option value="">
                        {t("contact.cnt_form.prj_place")}
                      </option>
                      {projectTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div> */}

                  {/* Message */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="message"
                      className="text-foreground font-medium"
                    >
                      {t("contact.cnt_form.desc_below")}
                    </Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder={t("contact.cnt_form.prj_desc_place")}
                      rows={5}
                      className="transition-smooth focus:ring-2 focus:ring-primary/20"
                      required
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    <Button
                      type="submit"
                      disabled={!isFormValid || isSubmitting}
                      className="bg-primary hover:bg-primary-glow transition-smooth disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full mr-2"></div>
                          {t("contact.cnt_form.b1")}
                        </>
                      ) : (
                        <>
                          <Send className="mr-2 h-4 w-4" />
                          {t("contact.cnt_form.b2")}
                        </>
                      )}
                    </Button>

                    <div className="flex items-center text-muted-foreground text-sm">
                      <CheckCircle className="h-4 w-4 mr-2 text-primary" />
                      {t("contact.cnt_form.msg")}
                    </div>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
