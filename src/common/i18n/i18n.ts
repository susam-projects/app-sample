/* eslint-disable import/no-named-as-default */
/* eslint-disable import/no-named-as-default-member */
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "./en.ts";

export const defaultNS = "translation";
export const resources = { en } as const;

void i18n.use(initReactI18next).init({
  resources,
  defaultNS,
  lng: "en",
  interpolation: {
    escapeValue: false, // not needed for react
  },
});

export default i18n;
