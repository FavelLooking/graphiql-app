import english from "../../resources/locales/en/common.json";
import russian from "../../resources/locales/ru/common.json";

type Language = "en" | "ru";

export type Resource = {
  common: typeof english;
};
export const resources: Record<Language, Resource> = {
  en: {
    common: english,
  },
  ru: {
    common: russian,
  },
};
