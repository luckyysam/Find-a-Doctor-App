/* eslint-disable @typescript-eslint/no-explicit-any */
import i18n from './i18n';
import { type ClientIPLocation, type languageContent } from '../types'; 

const LOCAL_STORAGE_KEY = import.meta.env.VITE_LOCAL_STORAGE_KEY

/**
 * Type guard to check if an object is a ClientIPLocation.
 * @param obj - The object to check.
 * @returns True if the object is a ClientIPLocation.
 */
const isClientIPLocation = (obj: any): obj is ClientIPLocation => {
  return obj && typeof obj ==='object' && 'country' in obj && 'iso_code' in obj.country
}

/**
 * Type guard to check if an object is a languageContent.
 * @param obj - The object to check.
 * @returns True if the object is a languageContent.
 */
const isLanguageContent = (obj: any): obj is languageContent => {
  return obj && typeof obj === 'object' && 'language' in obj && 'language_code' in obj
}

/**
 * Sets the application language based on a ClientIPLocation or languageContent object.
 * If neither is provided, falls back to English ('en').
 * 
 * @param language - The location or language object, or null.
 * @returns A Promise that resolves when the language has been set.
 */
export const setAppLanguage = async (language: ClientIPLocation | languageContent | null) => {
  if (isClientIPLocation(language)) {
    const lang = language?.country.iso_code.toLowerCase();
    i18n.changeLanguage(lang);
    return
  }
  if (isLanguageContent(language)) {
    const lang = language.language_code.toLowerCase();
    i18n.changeLanguage(lang);
    return
  }

  // Fallback
  i18n.changeLanguage('en')
};

/**
 * Attempts to set the application language based on the user's IP location
 * stored in sessionStorage under the configured LOCAL_STORAGE_KEY.
 * If parsing fails, logs an error.
 * 
 * @returns A Promise that resolves when the operation is complete.
 */
export const setIpLocation = async (): Promise<void> => {
  const location = sessionStorage.getItem(LOCAL_STORAGE_KEY)
  if (location) {
    try {
      setAppLanguage(JSON.parse(location))
    } catch (e) {
      console.error('error', e)
    }
  }
}