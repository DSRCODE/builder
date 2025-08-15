import { motion } from "framer-motion";
import {
  Building2,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import { useTranslation } from "react-i18next";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { t } = useTranslation();

  const footerLinks = {
    company: [
      { name: [t("footer.footer_links.company.company_1")], href: "#about" },
      { name: [t("footer.footer_links.company.company_2")], href: "#" },
      { name: [t("footer.footer_links.company.company_3")], href: "#" },
      { name: [t("footer.footer_links.company.company_4")], href: "#" },
      { name: [t("footer.footer_links.company.company_5")], href: "#" },
      { name: [t("footer.footer_links.company.company_6")], href: "#" },
    ],
    policy: [
      { name: [t("footer.bottom_bar.privacy_policy")], href: "#about" },
      { name: [t("footer.bottom_bar.terms_of_service")], href: "#" },
      { name: [t("footer.bottom_bar.safety_policy")], href: "#" },
    ],
  };

  const socialLinks = [
    {
      icon: Facebook,
      href: "#",
      label: [t("footer.social_labels.social_1")],
      key: "1",
    },
    {
      icon: Twitter,
      href: "#",
      label: [t("footer.social_labels.social_2")],
      key: "2",
    },
    {
      icon: Linkedin,
      href: "#",
      label: [t("footer.social_labels.social_3")],
      key: "3",
    },
    {
      icon: Instagram,
      href: "#",
      label: [t("footer.social_labels.social_4")],
      key: "4",
    },
  ];

  const contactInfo = [
    { icon: Phone, text: "+1 (800) 523-2200" },
    { icon: Mail, text: "info@dbuildz.com" },
    { icon: MapPin, text: "1400 16th Street, Denver, CO 80202" },
  ];

  return (
    <footer className="bg-construction-dark text-white">
      <div className="container mx-auto px-4">
        {/* Main Footer Content */}
        <div className="py-16">
          <div className="grid lg:grid-cols-4 gap-12">
            {/* Company Info */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-6 lg:col-span-2"
            >
              {/* Logo */}
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center">
                  <Building2 className="h-7 w-7 text-accent-foreground" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">
                    {t("footer.company_name")}
                  </h3>
                  <p className="text-white/70 text-sm">{t("footer.tagline")}</p>
                </div>
              </div>

              <p className="text-white/80 leading-relaxed">
                {t("footer.description")}
              </p>

              {/* Contact Info */}
              <div className="space-y-3">
                {contactInfo.map((item, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <item.icon className="h-4 w-4 text-accent flex-shrink-0" />
                    <span className="text-white/80 text-sm">{item.text}</span>
                  </div>
                ))}
              </div>

              {/* Social Links */}
              <div className="flex space-x-4">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={social.key}
                    href={social.href}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 + index * 0.1, duration: 0.4 }}
                    whileHover={{ scale: 1.1 }}
                    className="w-10 h-10 bg-white/10 hover:bg-accent transition-smooth rounded-lg flex items-center justify-center group"
                  >
                    <social.icon className="h-5 w-5 text-white group-hover:text-accent-foreground transition-smooth" />
                  </motion.a>
                ))}
              </div>
            </motion.div>

            {/* Company Links */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <h4 className="text-lg font-semibold mb-6">
                {t("footer.footer_links.company_title")}
              </h4>
              <ul className="space-y-3">
                {footerLinks.company.map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.href}
                      className="text-white/70 hover:text-accent transition-smooth text-sm"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
         

            {/* Newsletter Signup */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <h4 className="text-lg font-semibold mb-2">
                {t("footer.newsletter.title")}
              </h4>
              <p className="text-white/70 mb-4">
                {t("footer.newsletter.description")}
              </p>
              <div className="flex space-x-3">
                <input
                  type="email"
                  placeholder={t("footer.newsletter.email_placeholder")}
                  className="flex-1 px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-accent transition-smooth"
                />
                <button className="px-6 py-3 bg-accent hover:bg-accent/90 transition-smooth rounded-lg font-medium text-accent-foreground">
                  {t("footer.newsletter.subscribe_button")}
                </button>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="py-6 border-t border-white/10"
        >
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-white/70 text-sm">
              © {currentYear} {t("footer.bottom_bar.copyright")}
            </div>
            <div className="flex space-x-6 text-sm">
              <a
                href="#"
                className="text-white/70 hover:text-accent transition-smooth"
              >
                {t("footer.bottom_bar.privacy_policy")}
              </a>
              <a
                href="#"
                className="text-white/70 hover:text-accent transition-smooth"
              >
                {t("footer.bottom_bar.terms_of_service")}
              </a>
              <a
                href="#"
                className="text-white/70 hover:text-accent transition-smooth"
              >
                {t("footer.bottom_bar.return_policy")}
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
