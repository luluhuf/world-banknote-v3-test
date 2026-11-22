
/* World Banknote Collector V5
   Catalogue mondial — Module V1
   Références par pays, monnaie et coupure.
*/

(() => {
  "use strict";

  // Coupures actuelles communes aux pays utilisant l'euro
  const euroBanknotes = [
    {value:5, label:"5 euros"},
    {value:10, label:"10 euros"},
    {value:20, label:"20 euros"},
    {value:50, label:"50 euros"},
    {value:100, label:"100 euros"},
    {value:200, label:"200 euros"},
    {value:500, label:"500 euros"}
  ];

  const catalog = {
    RO: {
      country: "Roumanie",
      currency: "RON",
      currencyName: "Leu roumain",
      current: [
        {value:1, label:"1 leu"},
        {value:5, label:"5 lei"},
        {value:10, label:"10 lei"},
        {value:20, label:"20 lei"},
        {value:50, label:"50 lei"},
        {value:100, label:"100 lei"},
        {value:200, label:"200 lei"},
        {value:500, label:"500 lei"}
      ],
      former: []
    },

    GB: {
      country: "Royaume-Uni",
      currency: "GBP",
      currencyName: "Livre sterling",
      current: [
        {value:5, label:"5 livres"},
        {value:10, label:"10 livres"},
        {value:20, label:"20 livres"},
        {value:50, label:"50 livres"}
      ],
      former: [],
      note: "Émissions de la Banque d'Angleterre uniquement."
    },

    US: {
      country: "États-Unis",
      currency: "USD",
      currencyName: "Dollar américain",
      current: [
        {value:1, label:"1 dollar"},
        {value:2, label:"2 dollars"},
        {value:5, label:"5 dollars"},
        {value:10, label:"10 dollars"},
        {value:20, label:"20 dollars"},
        {value:50, label:"50 dollars"},
        {value:100, label:"100 dollars"}
      ],
      former: []
    },

    CA: {
      country: "Canada",
      currency: "CAD",
      currencyName: "Dollar canadien",
      current: [
        {value:5, label:"5 dollars"},
        {value:10, label:"10 dollars"},
        {value:20, label:"20 dollars"},
        {value:50, label:"50 dollars"},
        {value:100, label:"100 dollars"}
      ],
      former: []
    },

    CH: {
      country: "Suisse",
      currency: "CHF",
      currencyName: "Franc suisse",
      current: [
        {value:10, label:"10 francs"},
        {value:20, label:"20 francs"},
        {value:50, label:"50 francs"},
        {value:100, label:"100 francs"},
        {value:200, label:"200 francs"},
        {value:1000, label:"1 000 francs"}
      ],
      former: []
    },

    JP: {
      country: "Japon",
      currency: "JPY",
      currencyName: "Yen japonais",
      current: [
        {value:1000, label:"1 000 yens"},
        {value:2000, label:"2 000 yens"},
        {value:5000, label:"5 000 yens"},
        {value:10000, label:"10 000 yens"}
      ],
      former: []
    }
  };

  // Pays utilisant actuellement l'euro
  const euroCountryCodes = [
    "AD","AT","BE","BG","HR","CY","EE","FI",
    "FR","DE","GR","IE","IT","LV","LT","LU",
    "MT","MC","ME","NL","PT","SM","SK","SI",
    "ES","VA"
  ];

  euroCountryCodes.forEach(code => {
    catalog[code] = {
      country: code,
      currency: "EUR",
      currencyName: "Euro",
      current: euroBanknotes,
      former: []
    };
  });

  function getCountry(code) {
    return catalog[code] || null;
  }

  function getProgress(code, banknotes = []) {
    const country = getCountry(code);

    if (!country) return null;

    const owned = new Set(
      banknotes
        .filter(n =>
          n.currency === country.currency &&
          n.era === "current" &&
          n.country === country.country
        )
        .map(n => Number(n.denomination))
    );

    const total = country.current.length;

    const collected = country.current.filter(
      item => owned.has(item.value)
    ).length;

    return {
      collected,
      total,
      percent: total
        ? Math.round(collected / total * 100)
        : 0
    };
  }

  window.WBC_CATALOG = {
    countries: catalog,
    getCountry,
    getProgress
  };

})();
