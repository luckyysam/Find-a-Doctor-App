import i18n from './i18n';
import { type ClientLocation } from '../types';

// const LOCAL_STORAGE_KEY = import.meta.env.VITE_LOCAL_STORAGE_KEY


export const setupAppLanguage = async (ClientLocation: ClientLocation | null) => {

  const lang = ClientLocation?.country.iso_code.toLocaleLowerCase() || 'en';
  i18n.changeLanguage(lang);
};
