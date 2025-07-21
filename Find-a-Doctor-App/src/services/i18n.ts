import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from '../locales/en.json';
import fi from '../locales/fi.json';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      nl: { translation: fi },
    },
    lng: 'en',
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
    debug: true
  });

export default i18n;
