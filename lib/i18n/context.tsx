'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { en, Translations } from './en';
import { id } from './id';

type Locale = 'en' | 'id';

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string | any;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('en'); // Default to English

  // Persist language choice
  useEffect(() => {
    const saved = localStorage.getItem('supashield_locale') as Locale;
    if (saved && (saved === 'en' || saved === 'id')) {
      setLocaleState(saved);
    }
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem('supashield_locale', newLocale);
    // Optionally update the HTML lang attribute
    document.documentElement.lang = newLocale;
  };

  const t = (key: string) => {
    const keys = key.split('.');
    let result: any = locale === 'id' ? id : en;
    
    for (const k of keys) {
      if (result === undefined) break;
      result = result[k];
    }
    
    // Fallback to English if missing in ID, or return key path if not found
    if (result === undefined && locale === 'id') {
      let fallback: any = en;
      for (const k of keys) {
        if (fallback === undefined) break;
        fallback = fallback[k];
      }
      return fallback !== undefined ? fallback : key;
    }
    
    return result !== undefined ? result : key;
  };

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
}
