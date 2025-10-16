import { getRequestConfig } from "next-intl/server";
import path from "path";
import fs from "fs";

export const locales = ["en", "es"];
export const defaultLocale = "en";

export default getRequestConfig(async ({ locale }) => {
  console.log(`[i18n] resolving locale: "${locale}"`);

  if (!locale || typeof locale !== "string") {
    console.warn("[i18n] locale missing or not a string; falling back to defaultLocale");
    locale = defaultLocale;
  }

  const messagesPath = path.resolve(process.cwd(), "messages", `${locale}.json`);

  try {
    if (!fs.existsSync(messagesPath)) {
      console.warn(`[i18n] messages file not found for locale "${locale}" at ${messagesPath}`);
      return { locale, messages: {} }; // 👈 agregado locale
    }

    const imported = await import(messagesPath);
    const messages = imported?.default ?? imported;
    if (!messages || typeof messages !== "object") {
      console.warn(`[i18n] messages for "${locale}" are invalid, returning empty object`);
      return { locale, messages: {} }; // 👈 agregado locale
    }

    console.log(`[i18n] loaded messages for "${locale}"`);
    return { locale, messages }; // 👈 agregado locale
  } catch (err) {
    console.error(`[i18n] error loading messages for "${locale}":`, err);
    return { locale, messages: {} }; // 👈 agregado locale
  }
});
