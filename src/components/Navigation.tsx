import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import LanguageDropdown from "./LanguageDropdown";
import { useAuth } from "@/contexts/authContext";

const Navigation = () => {
  const { t } = useTranslation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { name: t("navigation.home"), href: "#home" },
    // { name: t('navigation.services'), href: "#services" },
    // { name: t('navigation.projects'), href: "#projects" },
    { name: t("navigation.about"), href: "#about" },
    { name: t("navigation.contact"), href: "#contact" },
  ];

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-smooth ${
        isScrolled
          ? "bg-background/95 backdrop-blur-lg border-b border-border elegant-shadow"
          : "bg-transparent text-white"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center space-x-2"
          >
            <img src="/logo.png" className="w-16" alt="" />
            <span
              className={`text-xl font-bold ${
                isScrolled ? "text-foreground" : "text-white"
              }`}
            >
              D Buildz
            </span>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navItems.map((item, index) => (
              <motion.button
                key={item.name}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                onClick={() => scrollToSection(item.href)}
                className={`${
                  isScrolled ? "text-foreground" : "text-background"
                }  hover:text-primary transition-smooth font-medium`}
              >
                {item.name}
              </motion.button>
            ))}

            {/* Language Dropdown */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7 }}
            >
              <LanguageDropdown isScrolled={isScrolled} />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8 }}
            >
              {user ? (
                <Link
                  to="/dashboard"
                  className={cn(
                    buttonVariants(),
                    "bg-primary hover:bg-primary-glow transition-smooth"
                  )}
                >
                  Dashboard
                </Link>
              ) : (
                <Link
                  to="/login"
                  className={cn(
                    buttonVariants(),
                    "bg-primary hover:bg-primary-glow transition-smooth"
                  )}
                >
                  {t("navigation.login")}
                </Link>
              )}
            </motion.div>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-foreground"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-background border-t border-border"
          >
            <div className="py-4 space-y-2">
              {navItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => scrollToSection(item.href)}
                  className="block w-full text-left px-4 py-2 text-foreground hover:text-primary hover:bg-secondary/50 transition-smooth"
                >
                  {item.name}
                </button>
              ))}

              {/* Mobile Language Dropdown */}
              <div className="px-4 py-2">
                <LanguageDropdown isScrolled={true} />
              </div>

              <div className="px-4 pt-2">
                {user ? (
                  <Link
                    to="/dashboard"
                    className={cn(
                      buttonVariants(),
                      "w-full bg-primary hover:bg-primary-glow"
                    )}
                  >
                    Dashboard
                  </Link>
                ) : (
                  <Link
                    to="/login"
                    className={cn(
                      buttonVariants(),
                      "w-full bg-primary hover:bg-primary-glow"
                    )}
                  >
                    {t("navigation.login")}
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
};

export default Navigation;
