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
    { name: t("navigation.about"), href: "#about" },
    { name: t("navigation.contact"), href: "#contact" },
  ];

  const scrollToSection = (href) => {
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
      className={`fixed top-0 left-0 right-0 z-50 transition-smooth 
    ${
      isScrolled
        ? "bg-background/95 backdrop-blur-lg border-b border-border md:text-black elegant-shadow"
        : "md:bg-transparent md:text-white"
    } 
    bg-white text-black md:text-white`}
    >
      {/* Full-width wrapper */}
      <div className="w-full px-4 lg:px-8">
        {/* Desktop Navbar */}
        <div className="hidden lg:flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <img src="/logo.png" className="w-16" alt="logo" />
            <span className="text-xl font-bold">D Buildz</span>
          </div>

          {/* Links */}
          <div className="flex items-center space-x-8">
            {navItems.map((item, index) => (
              <motion.button
                key={item.name}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                onClick={() => scrollToSection(item.href)}
                className="hover:text-primary font-medium transition-smooth"
              >
                {item.name}
              </motion.button>
            ))}
            <LanguageDropdown isScrolled={isScrolled} />
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
          </div>
        </div>

        {/* Mobile Navbar */}
        <div className="flex lg:hidden items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <img src="/logo.png" className="w-14" alt="logo" />
            <span className="text-lg font-bold">D Buildz</span>
          </div>

          {/* Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-black"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-t border-border"
          >
            <div className="py-4 space-y-2">
              {navItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => scrollToSection(item.href)}
                  className="block w-full text-left px-4 py-2 hover:text-primary hover:bg-secondary/50 transition-smooth"
                >
                  {item.name}
                </button>
              ))}
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
