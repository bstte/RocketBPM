  const flagCountryMap = {
    en: "gb",
    de: "de",
    es: "es",
  };

 export const getFlagUrl = (langId) =>
    `https://flagcdn.com/w20/${flagCountryMap[langId] || "un"}.png`;
