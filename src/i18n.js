import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { mainTranslations } from './locales/main';
import { schoolTranslations } from './locales/school';
import { expertiseTranslations } from './locales/expertise';
import { loginTranslations } from './locales/login';
import { socialTranslations } from './locales/social';
import { cyberAssistantTranslations } from './locales/cyberAssistant';

const resources = {
  zh: {
    translation: {
      main: mainTranslations.zh,
      school: schoolTranslations.zh,
      exp: expertiseTranslations.zh,
      login: loginTranslations.zh,
      social: socialTranslations.zh,
      cyber: cyberAssistantTranslations.zh
    }
  },
  'zh-TW': {
    translation: {
      main: mainTranslations['zh-TW'],
      school: schoolTranslations['zh-TW'],
      exp: expertiseTranslations['zh-TW'],
      login: loginTranslations['zh-TW'],
      social: socialTranslations['zh-TW'],
      cyber: cyberAssistantTranslations['zh-TW']
    }
  },
  en: {
    translation: {
      main: mainTranslations.en,
      school: schoolTranslations.en,
      exp: expertiseTranslations.en,
      login: loginTranslations.en,
      social: socialTranslations.en,
      cyber: cyberAssistantTranslations.en
    }
  },
  pt: {
    translation: {
      main: mainTranslations.pt,
      school: schoolTranslations.pt,
      exp: expertiseTranslations.pt,
      login: loginTranslations.pt,
      social: socialTranslations.pt,
      cyber: cyberAssistantTranslations.pt
    }
  },
  es: {
    translation: {
      main: mainTranslations.es,
      school: schoolTranslations.es,
      exp: expertiseTranslations.es,
      login: loginTranslations.es,
      social: socialTranslations.es,
      cyber: cyberAssistantTranslations.es
    }
  },
  de: {
    translation: {
      main: mainTranslations.de,
      school: schoolTranslations.de,
      exp: expertiseTranslations.de,
      login: loginTranslations.de,
      social: socialTranslations.de,
      cyber: cyberAssistantTranslations.de
    }
  },
  fr: {
    translation: {
      main: mainTranslations.fr,
      school: schoolTranslations.fr,
      exp: expertiseTranslations.fr,
      login: loginTranslations.fr,
      social: socialTranslations.fr,
      cyber: cyberAssistantTranslations.fr
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'zh', // default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false 
    }
  });

export default i18n;
