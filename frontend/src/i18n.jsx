// Multilanguage support was planned, but not connected.
// Author didn't have time to finish before the deadline.
// Might be implemented in the future.

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import translationEN from './locales/en.json';
import translationRU from './locales/ru.json';
import translationLV from './locales/lv.json';

const resources = {
  en: { translation: translationEN },
  ru: { translation: translationRU },
  lv: { translation: translationLV },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
