import React, { createContext, useContext, useState, useEffect } from "react";
import { Language, TRANSLATIONS } from "./translations";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, replacements?: any[]) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem("roblox_archives_language");
    return (saved === "en" || saved === "th" ? saved : "en") as Language;
  });

  useEffect(() => {
    localStorage.setItem("roblox_archives_language", language);
  }, [language]);

  const t = (key: string, replacements?: any[]): string => {
    const dict = TRANSLATIONS[language] || TRANSLATIONS["en"];
    let template = dict[key] || TRANSLATIONS["en"][key] || key;
    if (replacements && replacements.length > 0) {
      replacements.forEach((val, idx) => {
        template = template.replace(`{${idx}}`, String(val));
      });
    }
    return template;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
export type { Language };
