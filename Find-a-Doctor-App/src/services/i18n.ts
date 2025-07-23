import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from '../locales/en.json';
import fi from '../locales/fi.json';
import nl from '../locales/nl.json'
import de from '../locales/de.json'
import es from '../locales/es.json'
import fa from '../locales/fa.json'
import fr from '../locales/fr.json'
import ja from '../locales/ja.json'
import ko from '../locales/ko.json'
import pt_BR from '../locales/pt-BR.json'
import ru from '../locales/ru.json'
import zh_CN from '../locales/zh-CN.json'


i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      fi: { translation: fi },
      nl: { translation: nl},
      de: { translation: de},
      es: { translation: es},
      fa: { translation: fa},
      fr: { translation: fr},
      ja: { translation: ja},
      ko: { translation: ko},
      pt: { translation: pt_BR},
      ru: { translation: ru},
      zh: { translation: zh_CN},
    },
    lng: 'en',
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
    // debug: true
  });

export default i18n;
