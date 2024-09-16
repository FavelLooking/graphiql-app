import english from "../../resources/locales/en/common.json";

type Language = "en";

export type Resource = {
  common: typeof english;
};
export const resources: Record<Language, Resource> = {
  en: {
    common: english,
  },
};
