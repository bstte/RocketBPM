
const flagCountryMap = {
  en: "gb",
  de: "de",
  es: "es",
  fr: "fr",
  "PT-BR": "br",
  it: "it",
  pl: "pl",
  nl: "nl",
  zh: "cn",
  hi: "in",
  ar: "sa",
};
export const getFlagUrl = (langId) =>
  `https://flagcdn.com/w20/${flagCountryMap[langId] || "un"}.png`;
