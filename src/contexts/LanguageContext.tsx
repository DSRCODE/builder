import React, { createContext, useContext, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

export interface Language {
  code: string;
  name: string;
  nativeName: string;
}

export const languages: Language[] = [
  { code: "en", name: "English", nativeName: "English" },
  { code: "hi", name: "Hindi", nativeName: "हिंदी" },
  { code: "te", name: "Telugu", nativeName: "తెలుగు" },
  { code: "kn", name: "Kannada", nativeName: "ಕನ್ನಡ" },
  // { code: "ta", name: "Tamil", nativeName: "தமிழ்" },
];

interface LanguageContextType {
  currentLanguage: Language;
  changeLanguage: (languageCode: string) => void;
  languages: Language[];
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};

interface LanguageProviderProps {
  children: React.ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({
  children,
}) => {
  const { i18n } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState<Language>(
    languages.find((lang) => lang.code === i18n.language) || languages[0]
  );

  useEffect(() => {
    const handleLanguageChange = (lng: string) => {
      const newLanguage =
        languages.find((lang) => lang.code === lng) || languages[0];
      setCurrentLanguage(newLanguage);
    };

    i18n.on("languageChanged", handleLanguageChange);
    return () => {
      i18n.off("languageChanged", handleLanguageChange);
    };
  }, [i18n]);

  const changeLanguage = (languageCode: string) => {
    i18n.changeLanguage(languageCode);
  };

  const value: LanguageContextType = {
    currentLanguage,
    changeLanguage,
    languages,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};
