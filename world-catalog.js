/* WBC Catalogue mondial V2 */
(() => {
"use strict";
const catalog = {};

function add(codes,currency,currencyName,values){
  codes.split(" ").forEach(code=>{
    catalog[code]={
      country:code,
      currency,
      currencyName,
      current:values.map(value=>({
        value,
        label:value.toLocaleString("fr-FR")+" "+currency,
        status:currency==="EUR"&&value===500
          ?"valid_not_issued":"current"
      })),
      former:[],
      special:[]
    };
  });
}

// EUROPE
add("AD AT BE BG HR CY EE FI FR DE GR IE IT LV LT LU MT MC ME NL PT SM SK SI ES VA","EUR","Euro",[5,10,20,50,100,200,500]);
add("GB","GBP","Livre sterling",[5,10,20,50]);
add("CH LI","CHF","Franc suisse",[10,20,50,100,200,1000]);
add("RO","RON","Leu roumain",[1,5,10,20,50,100,200,500]);
add("RS","RSD","Dinar serbe",[10,20,50,100,200,500,1000,2000,5000]);
add("AL","ALL","Lek albanais",[200,500,1000,2000,5000,10000]);
add("BA","BAM","Mark convertible",[10,20,50,100,200]);
add("BY","BYN","Rouble bielorusse",[5,10,20,50,100,200,500]);
add("CZ","CZK","Couronne tcheque",[100,200,500,1000,2000,5000]);
add("DK","DKK","Couronne danoise",[50,100,200,500]);
add("HU","HUF","Forint",[500,1000,2000,5000,10000,20000]);
add("IS","ISK","Couronne islandaise",[500,1000,2000,5000,10000]);
add("MK","MKD","Denar",[10,50,100,200,500,1000,2000]);
add("MD","MDL","Leu moldave",[1,5,10,20,50,100,200,500,1000]);
add("NO","NOK","Couronne norvegienne",[50,100,200,500,1000]);
add("PL","PLN","Zloty",[10,20,50,100,200,500]);
add("RU","RUB","Rouble russe",[5,10,50,100,200,500,1000,2000,5000]);
add("SE","SEK","Couronne suedoise",[20,50,100,200,500,1000]);
add("UA","UAH","Hryvnia",[20,50,100,200,500,1000]);
add("TR","TRY","Livre turque",[5,10,20,50,100,200]);

// AMERIQUES
add("US EC SV PA TL MH FM PW","USD","Dollar americain",[1,2,5,10,20,50,100]);
add("CA","CAD","Dollar canadien",[5,10,20,50,100]);
add("MX","MXN","Peso mexicain",[20,50,100,200,500,1000]);
add("AG DM GD KN LC VC","XCD","Dollar des Caraibes",[5,10,20,50,100]);
add("BS","BSD","Dollar bahameen",[0.5,1,3,5,10,20,50,100]);
add("BB","BBD","Dollar barbadien",[2,5,10,20,50,100]);
add("BZ","BZD","Dollar belizien",[2,5,10,20,50,100]);
add("CR","CRC","Colon",[1000,2000,5000,10000,20000]);
add("CU","CUP","Peso cubain",[1,3,5,10,20,50,100,200,500,1000]);
add("DO","DOP","Peso dominicain",[50,100,200,500,1000,2000]);
add("GT","GTQ","Quetzal",[1,5,10,20,50,100,200]);
add("HT","HTG","Gourde",[10,20,25,50,100,250,500,1000]);
add("HN","HNL","Lempira",[1,2,5,10,20,50,100,200,500]);
add("JM","JMD","Dollar jamaicain",[50,100,500,1000,2000,5000]);
add("NI","NIO","Cordoba",[10,20,50,100,200,500,1000]);
add("TT","TTD","Dollar trinidadien",[1,5,10,20,50,100]);
add("AR","ARS","Peso argentin",[10,20,50,100,200,500,1000,2000,10000,20000]);
add("BO","BOB","Boliviano",[10,20,50,100,200]);
add("BR","BRL","Real",[2,5,10,20,50,100,200]);
add("CL","CLP","Peso chilien",[1000,2000,5000,10000,20000]);
add("CO","COP","Peso colombien",[2000,5000,10000,20000,50000,100000]);
add("GY","GYD","Dollar guyanien",[20,50,100,500,1000,2000,5000]);
add("PY","PYG","Guarani",[2000,5000,10000,20000,50000,100000]);
add("PE","PEN","Sol",[10,20,50,100,200]);
add("SR","SRD","Dollar surinamais",[5,10,20,50,100,200,500]);
add("UY","UYU","Peso uruguayen",[20,50,100,200,500,1000,2000]);
add("VE","VES","Bolivar",[5,10,20,50,100,200,500]);

// AFRIQUE
add("BJ BF CI GW ML NE SN TG","XOF","Franc CFA BCEAO",[500,1000,2000,5000,10000]);
add("CM CF TD CG GQ GA","XAF","Franc CFA BEAC",[500,1000,2000,5000,10000]);
add("ZA","ZAR","Rand",[10,20,50,100,200]);
add("DZ","DZD","Dinar algerien",[100,200,500,1000,2000]);
add("AO","AOA","Kwanza",[200,500,1000,2000,5000]);
add("BW","BWP","Pula",[10,20,50,100,200]);
add("BI","BIF","Franc burundais",[500,1000,2000,5000,10000]);
add("CV","CVE","Escudo",[200,500,1000,2000,5000]);
add("KM","KMF","Franc comorien",[500,1000,2000,5000,10000]);
add("CD","CDF","Franc congolais",[50,100,200,500,1000,5000,10000,20000]);
add("DJ","DJF","Franc djiboutien",[1000,2000,5000,10000]);
add("EG","EGP","Livre egyptienne",[1,5,10,20,50,100,200]);
add("ER","ERN","Nakfa",[1,5,10,20,50,100]);
add("SZ","SZL","Lilangeni",[10,20,50,100,200]);
add("ET","ETB","Birr",[5,10,50,100,200]);
add("GM","GMD","Dalasi",[5,10,20,50,100,200]);
add("GH","GHS","Cedi",[1,2,5,10,20,50,100,200]);
add("GN","GNF","Franc guineen",[500,1000,2000,5000,10000,20000]);
add("KE","KES","Shilling kenyan",[50,100,200,500,1000]);
add("LS","LSL","Loti",[10,20,50,100,200]);
add("LR","LRD","Dollar liberien",[5,10,20,50,100,500,1000]);
add("LY","LYD","Dinar libyen",[1,5,10,20,50]);
add("MG","MGA","Ariary",[100,200,500,1000,2000,5000,10000,20000]);
add("MW","MWK","Kwacha malawite",[20,50,100,200,500,1000,2000,5000]);
add("MA","MAD","Dirham marocain",[20,50,100,200]);
add("MU","MUR","Roupie mauricienne",[25,50,100,200,500,1000,2000]);
add("MR","MRU","Ouguiya",[50,100,200,500,1000]);
add("MZ","MZN","Metical",[20,50,100,200,500,1000]);
add("NA","NAD","Dollar namibien",[10,20,30,50,100,200]);
add("NG","NGN","Naira",[5,10,20,50,100,200,500,1000]);
add("RW","RWF","Franc rwandais",[500,1000,2000,5000]);
add("ST","STN","Dobra",[5,10,20,50,100,200]);
add("SC","SCR","Roupie seychelloise",[25,50,100,500]);
add("SL","SLE","Leone",[1,2,5,10,20]);
add("SO","SOS","Shilling somalien",[1000]);
add("SD","SDG","Livre soudanaise",[5,10,20,50,100,200,500,1000]);
add("SS","SSP","Livre sud-soudanaise",[5,10,20,25,50,100,500,1000]);
add("TZ","TZS","Shilling tanzanien",[500,1000,2000,5000,10000]);
add("TN","TND","Dinar tunisien",[5,10,20,50]);
add("UG","UGX","Shilling ougandais",[1000,2000,5000,10000,20000,50000]);
add("ZM","ZMW","Kwacha zambien",[10,20,50,100,200,500]);
add("ZW","ZWG","Zimbabwe Gold",[10,20,50,100,200]);

// ASIE
add("AF","AFN","Afghani",[1,2,5,10,20,50,100,500,1000]);
add("AM","AMD","Dram",[1000,2000,5000,10000,20000,50000]);
add("AZ","AZN","Manat",[1,5,10,20,50,100,200,500]);
add("BD","BDT","Taka",[2,5,10,20,50,100,200,500,1000]);
add("BT","BTN","Ngultrum",[1,5,10,20,50,100,500,1000]);
add("BN","BND","Dollar bruneien",[1,5,10,50,100,500,1000,10000]);
add("KH","KHR","Riel",[100,200,500,1000,2000,5000,10000,15000,20000,30000,50000,100000,200000]);
add("CN","CNY","Yuan",[1,5,10,20,50,100]);
add("KP","KPW","Won nord-coreen",[5,10,50,100,200,500,1000,2000,5000]);
add("KR","KRW","Won sud-coreen",[1000,5000,10000,50000]);
add("GE","GEL","Lari",[5,10,20,50,100,200]);
add("IN","INR","Roupie indienne",[10,20,50,100,200,500]);
add("ID","IDR","Roupie indonesienne",[1000,2000,5000,10000,20000,50000,100000]);
add("JP","JPY","Yen",[1000,2000,5000,10000]);
add("KZ","KZT","Tenge",[200,500,1000,2000,5000,10000,20000]);
add("KG","KGS","Som",[20,50,100,200,500,1000,2000,5000]);
add("LA","LAK","Kip",[500,1000,2000,5000,10000,20000,50000,100000]);
add("MY","MYR","Ringgit",[1,5,10,20,50,100]);
add("MV","MVR","Rufiyaa",[5,10,20,50,100,500,1000]);
add("MN","MNT","Tugrik",[10,20,50,100,500,1000,5000,10000,20000]);
add("MM","MMK","Kyat",[50,100,200,500,1000,5000,10000,20000]);
add("NP","NPR","Roupie nepalaise",[5,10,20,50,100,500,1000]);
add("PK","PKR","Roupie pakistanaise",[10,20,50,100,500,1000,5000]);
add("PH","PHP","Peso philippin",[20,50,100,200,500,1000]);
add("SG","SGD","Dollar singapourien",[2,5,10,50,100,1000,10000]);
add("LK","LKR","Roupie sri-lankaise",[20,50,100,500,1000,5000]);
add("TJ","TJS","Somoni",[1,3,5,10,20,50,100,200,500]);
add("TH","THB","Baht",[20,50,100,500,1000]);
add("TM","TMT","Manat turkmene",[1,5,10,20,50,100]);
add("UZ","UZS","Soum",[1000,2000,5000,10000,20000,50000,100000,200000]);
add("VN","VND","Dong",[100,200,500,1000,2000,5000,10000,20000,50000,100000,200000,500000]);

// MOYEN ORIENT
add("SA","SAR","Riyal saoudien",[1,5,10,20,50,100,200,500]);
add("BH","BHD","Dinar bahreini",[0.5,1,5,10,20]);
add("AE","AED","Dirham emirien",[5,10,20,50,100,200,500,1000]);
add("IQ","IQD","Dinar irakien",[250,500,1000,5000,10000,25000,50000]);
add("IR","IRR","Rial iranien",[10000,20000,50000,100000]);
add("IL PS","ILS","Shekel",[20,50,100,200]);
add("JO","JOD","Dinar jordanien",[1,5,10,20,50]);
add("KW","KWD","Dinar koweitien",[0.25,0.5,1,5,10,20]);
add("LB","LBP","Livre libanaise",[1000,5000,10000,20000,50000,100000]);
add("OM","OMR","Rial omanais",[0.1,0.5,1,5,10,20,50]);
add("QA","QAR","Riyal qatari",[1,5,10,50,100,200,500]);
add("SY","SYP","Livre syrienne",[50,100,200,500,1000,2000,5000]);
add("YE","YER","Rial yemenite",[50,100,200,250,500,1000]);

// OCEANIE
add("AU KI NR TV","AUD","Dollar australien",[5,10,20,50,100]);
add("NZ","NZD","Dollar neo-zelandais",[5,10,20,50,100]);
add("FJ","FJD","Dollar fidjien",[5,10,20,50,100]);
add("SB","SBD","Dollar salomonais",[5,10,20,50,100]);
add("PG","PGK","Kina",[2,5,10,20,50,100]);
add("WS","WST","Tala",[5,10,20,50,100]);
add("TO","TOP","Paanga",[2,5,10,20,50,100]);
add("VU","VUV","Vatu",[200,500,1000,2000,5000,10000]);

const names = new Intl.DisplayNames(["fr"],{type:"region"});

Object.entries(catalog).forEach(([code,c])=>{
  c.country=names.of(code);
});

function getCountry(code){
  return catalog[String(code).toUpperCase()]||null;
}

function getProgress(code,banknotes=[]){
  const c=getCountry(code);
  if(!c)return null;
  const owned=new Set(banknotes
    .filter(n=>n.currency===c.currency&&n.era==="current")
    .map(n=>Number(n.denomination)));
  const total=c.current.length;
  const collected=c.current.filter(b=>owned.has(b.value)).length;
  return {
    collected,
    total,
    percent:total?Math.round(collected/total*100):0
  };
}

window.WBC_CATALOG={
  version:2,
  countries:catalog,
  getCountry,
  getProgress
};
console.log("Catalogue V2",Object.keys(catalog).length);
})();
