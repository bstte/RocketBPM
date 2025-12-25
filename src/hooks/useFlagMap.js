
const flagCountryMap = {
  en: "gb",
  de: "de",
  es: "es",
  fr: "fr",
  "pt-BR": "br",
  it: "it",
  pl: "pl",
  nl: "nl",
  "zh-CN": "cn",
  hi: "in",
};
export const getFlagUrl = (langId) =>
  `https://flagcdn.com/w20/${flagCountryMap[langId] || "un"}.png`;
