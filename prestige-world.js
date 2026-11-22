
/* World Banknote Collector — Prestige World V1 */
(() => {
  "use strict";

  const countryData = `
Afghanistan|AF
Afrique du Sud|ZA
Albanie|AL
Algérie|DZ
Allemagne|DE
Andorre|AD
Angola|AO
Antigua-et-Barbuda|AG
Arabie saoudite|SA
Argentine|AR
Arménie|AM
Australie|AU
Autriche|AT
Azerbaïdjan|AZ
Bahamas|BS
Bahreïn|BH
Bangladesh|BD
Barbade|BB
Belgique|BE
Belize|BZ
Bénin|BJ
Bhoutan|BT
Biélorussie|BY
Birmanie|MM
Bolivie|BO
Bosnie-Herzégovine|BA
Botswana|BW
Brésil|BR
Brunei|BN
Bulgarie|BG
Burkina Faso|BF
Burundi|BI
Cambodge|KH
Cameroun|CM
Canada|CA
Cap-Vert|CV
Chili|CL
Chine|CN
Chypre|CY
Colombie|CO
Comores|KM
Congo|CG
Corée du Nord|KP
Corée du Sud|KR
Costa Rica|CR
Côte d'Ivoire|CI
Croatie|HR
Cuba|CU
Danemark|DK
Djibouti|DJ
Dominique|DM
Égypte|EG
Émirats arabes unis|AE
Équateur|EC
Érythrée|ER
Espagne|ES
Estonie|EE
Eswatini|SZ
États-Unis|US
Éthiopie|ET
Fidji|FJ
Finlande|FI
France|FR
Gabon|GA
Gambie|GM
Géorgie|GE
Ghana|GH
Grèce|GR
Grenade|GD
Guatemala|GT
Guinée|GN
Guinée-Bissau|GW
Guinée équatoriale|GQ
Guyana|GY
Haïti|HT
Honduras|HN
Hongrie|HU
Îles Marshall|MH
Îles Salomon|SB
Inde|IN
Indonésie|ID
Irak|IQ
Iran|IR
Irlande|IE
Islande|IS
Israël|IL
Italie|IT
Jamaïque|JM
Japon|JP
Jordanie|JO
Kazakhstan|KZ
Kenya|KE
Kirghizistan|KG
Kiribati|KI
Koweït|KW
Laos|LA
Lesotho|LS
Lettonie|LV
Liban|LB
Liberia|LR
Libye|LY
Liechtenstein|LI
Lituanie|LT
Luxembourg|LU
Macédoine du Nord|MK
Madagascar|MG
Malaisie|MY
Malawi|MW
Maldives|MV
Mali|ML
Malte|MT
Maroc|MA
Maurice|MU
Mauritanie|MR
Mexique|MX
Micronésie|FM
Moldavie|MD
Monaco|MC
Mongolie|MN
Monténégro|ME
Mozambique|MZ
Namibie|NA
Nauru|NR
Népal|NP
Nicaragua|NI
Niger|NE
Nigeria|NG
Norvège|NO
Nouvelle-Zélande|NZ
Oman|OM
Ouganda|UG
Ouzbékistan|UZ
Pakistan|PK
Palaos|PW
Palestine|PS
Panama|PA
Papouasie-Nouvelle-Guinée|PG
Paraguay|PY
Pays-Bas|NL
Pérou|PE
Philippines|PH
Pologne|PL
Portugal|PT
Qatar|QA
République centrafricaine|CF
République démocratique du Congo|CD
République dominicaine|DO
Roumanie|RO
Royaume-Uni|GB
Russie|RU
Rwanda|RW
Saint-Christophe-et-Niévès|KN
Sainte-Lucie|LC
Saint-Marin|SM
Saint-Vincent-et-les-Grenadines|VC
Salvador|SV
Samoa|WS
Sao Tomé-et-Principe|ST
Sénégal|SN
Serbie|RS
Seychelles|SC
Sierra Leone|SL
Singapour|SG
Slovaquie|SK
Slovénie|SI
Somalie|SO
Soudan|SD
Soudan du Sud|SS
Sri Lanka|LK
Suède|SE
Suisse|CH
Suriname|SR
Syrie|SY
Tadjikistan|TJ
Tanzanie|TZ
Tchad|TD
Tchéquie|CZ
Thaïlande|TH
Timor oriental|TL
Togo|TG
Tonga|TO
Trinité-et-Tobago|TT
Tunisie|TN
Turkménistan|TM
Turquie|TR
Tuvalu|TV
Ukraine|UA
Uruguay|UY
Vanuatu|VU
Vatican|VA
Venezuela|VE
Viêt Nam|VN
Yémen|YE
Zambie|ZM
Zimbabwe|ZW
`.trim().split("\n").map(line => {
    const [name, code] = line.split("|");
    return {name, code};
  });

  const euroCountries = new Set([
    "AD","AT","BE","BG","HR","CY","EE","FI",
    "FR","DE","GR","IE","IT","LV","LT","LU",
    "MT","MC","ME","NL","PT","SM","SK","SI",
    "ES","VA"
  ]);

  const normalize = s => String(s ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

  let search = "";
  let mode = "all";

  const style = document.createElement("style");
  style.textContent = `
    #world .world-stat {
      background:#15283c;
      border:1px solid #66583f;
      border-radius:16px;
      padding:18px;
      margin:12px 0;
    }
    #world .world-gold {color:#e5bd70}
    #world .world-bar {
      height:9px;background:#30435c;
      border-radius:20px;overflow:hidden;
      margin:14px 0;
    }
    #world .world-fill {
      height:100%;background:#e5bd70;
      transition:width .3s;
    }
    #world .world-search {
      width:100%;padding:14px;
      background:#102238;color:white;
      border:1px solid #b99a60;
      border-radius:12px;font-size:16px;
      margin:12px 0;
    }
    #world .world-filters {
      display:flex;gap:7px;overflow-x:auto;
      padding:5px 0;
    }
    #world .world-filters button {
      white-space:nowrap;font-size:12px;
      padding:10px;
    }
    #world .world-country {
      background:#15283c;
      border:1px solid #334b60;
      border-radius:13px;
      padding:13px;
      margin:9px 0;
    }
    #world .world-country strong {
      color:#f8f4e9;
    }
    #world .world-country small {
      display:block;color:#b9c8d8;
      margin-top:5px;
    }
  `;
  document.head.append(style);

  // Styles des progressions dans les fiches pays
  const progressStyle = document.createElement("style");

  progressStyle.textContent = `
    .world-overlay .world-stat {
      background: #15283c;
      border: 1px solid #66583f;
      border-radius: 16px;
      padding: 18px;
      margin: 20px 0;
    }

    .world-overlay .world-gold {
      color: #e5bd70;
    }

    .world-bar {
      display: block;
      width: 100%;
      height: 12px;
      background: #30435c;
      border-radius: 20px;
      overflow: hidden;
      margin: 14px 0;
    }

    .world-fill {
      display: block;
      height: 100%;
      background: linear-gradient(
        90deg,
        #b88938,
        #e5bd70,
        #f6dc9c
      );
      border-radius: 20px;
      transition: width 0.6s ease;
    }
  `;

  document.head.append(progressStyle);

  const world = document.createElement("section");
  world.id = "world";
  world.className = "hidden";

  world.innerHTML = `
    <h2>🌍 Le Monde</h2>
    <div class="world-stat">
      <div class="world-gold">MA CONQUÊTE DU MONDE</div>
      <h2 id="worldCount">0 / 195 pays</h2>
      <p id="worldPercent">0 % du monde</p>
      <div class="world-bar">
        <div id="worldFill" class="world-fill"></div>
      </div>
      <p id="worldDetails"></p>
    </div>
    <input id="worldSearch" class="world-search"
      type="search" placeholder="🔎 Rechercher un pays...">
    <div class="world-filters">
      <button data-world="all">Tous</button>
      <button data-world="owned">Débloqués</button>
      <button data-world="missing">À débloquer</button>
      <button data-world="current">Actuels</button>
      <button data-world="former">Anciens</button>
    </div>
    <div id="worldList"></div>
  `;

  const nav = document.querySelector("#signedApp nav");
  const share = document.getElementById("share");

  if(!nav || !share) return;

  share.before(world);

  const navButton = nav.querySelector('[data-page="unlock"]');
navButton.dataset.page = "world";
  const flag = code => {
    return [...code.toUpperCase()]
      .map(c => String.fromCodePoint(
        127397 + c.charCodeAt(0)
      )).join("");
  };

  function getStatus(country) {
    const list = typeof notes !== "undefined" ? notes : [];
    const matching = list.filter(n => {
      const c = normalize(n.country);
      const exact = c === normalize(country.name);
      const euro = euroCountries.has(country.code) &&
        n.currency === "EUR" &&
        n.era === "current" &&
        (c === "zone euro" || euroCountries.has(
          countryData.find(x =>
            normalize(x.name) === c
          )?.code
        ));
      return exact || euro;
    });

    return {
      owned:matching.length > 0,
      current:matching.some(n => n.era === "current"),
      former:matching.some(n => n.era === "former"),
      count:matching.length
    };
  }

  function renderWorld() {
    const statuses = countryData.map(c => ({
      ...c, ...getStatus(c)
    }));

    const owned = statuses.filter(c => c.owned).length;
    const current = statuses.filter(c => c.current).length;
    const former = statuses.filter(c => c.former).length;
    const pct = owned / 195 * 100;

    document.getElementById("worldCount").textContent =
      owned + " / 195 pays";
    document.getElementById("worldPercent").textContent =
      pct.toFixed(2).replace(".", ",") + " % du monde";
    document.getElementById("worldFill").style.width =
      pct + "%";
    document.getElementById("worldDetails").textContent =
      current + " pays actuels · " +
      former + " pays anciens";

    const list = document.getElementById("worldList");
    list.replaceChildren();

    const filtered = statuses.filter(c => {
      const matches = normalize(c.name).includes(normalize(search));
      const selected =
        mode === "all" ||
        (mode === "owned" && c.owned) ||
        (mode === "missing" && !c.owned) ||
        (mode === "current" && c.current) ||
        (mode === "former" && c.former);
      return matches && selected;
    });

    for(const c of filtered) {
      const card = document.createElement("div");
      card.className = "world-country";

      const title = document.createElement("strong");
      title.textContent =
        flag(c.code) + " " + c.name;

      const detail = document.createElement("small");
      detail.textContent = c.owned
        ? "✓ Débloqué · " + c.count + " billet(s)"
        : "🔒 À débloquer";

      card.append(title,detail);
      list.append(card);
    }
  }

  document.getElementById("worldSearch")
    .addEventListener("input", e => {
      search = e.target.value;
      

      renderWorld();
    });

  world.querySelectorAll("[data-world]").forEach(b => {
    b.onclick = () => {
      mode = b.dataset.world;
      
  /* Prestige World — Fiches pays V1 */

  const denominations = {
    RO: [
      {value:1, label:"1 leu"},
      {value:5, label:"5 lei"},
      {value:10, label:"10 lei"},
      {value:20, label:"20 lei"},
      {value:50, label:"50 lei"},
      {value:100, label:"100 lei"},
      {value:200, label:"200 lei"},
      {value:500, label:"500 lei"}
    ]
  };

  const detailStyle = document.createElement("style");
  detailStyle.textContent = `
    .world-overlay {
      position:fixed;
      inset:0;
      z-index:9999;
      background:#091625;
      color:#f8f4e9;
      overflow-y:auto;
      padding:20px 16px 90px;
    }
    .world-detail {
      max-width:650px;
      margin:auto;
    }
    .world-detail h2 {
      color:#e5bd70;
      margin-top:20px;
    }
    .world-note {
      background:#15283c;
      border:1px solid #334b60;
      border-radius:13px;
      padding:14px;
      margin:10px 0;
    }
    .world-note.owned {
      border-color:#e5bd70;
    }
    .world-note small {
      display:block;
      color:#b9c8d8;
      margin-top:5px;
    }
  `;
  document.head.append(detailStyle);

  function openCountry(country) {
    const overlay=document.createElement("div");
    overlay.className="world-overlay";

    const detail=document.createElement("div");
    detail.className="world-detail";

    const close=document.createElement("button");
    close.textContent="← Retour au monde";
    close.onclick=()=>overlay.remove();

    const title=document.createElement("h2");
    title.textContent=flag(country.code)+" "+country.name;

    detail.append(close,title);

    const allNotes=typeof notes!=="undefined"?notes:[];

    
const matching = allNotes.filter(n => {
  const sameCountry =
    normalize(n.country) === normalize(country.name);

  const sharedEuro =
    euroCountries.has(country.code) &&
    n.currency === "EUR" &&
    n.era === "current";

  return sameCountry || sharedEuro;
});


    const summary=document.createElement("p");
    summary.textContent=matching.length+
      " billet(s) enregistré(s) pour ce pays.";
    detail.append(summary);
    
    // Progression des coupures par pays
    const catalog = window.WBC_CATALOG?.getCountry(country.code);

    if (catalog && catalog.current?.length) {
      const unique = new Set(
        matching
          .filter(n =>
            n.era === "current" &&
            n.currency === catalog.currency
          )
          .map(n => Number(n.denomination))
      );

      const total = catalog.current.length;
      const collected = catalog.current.filter(
        b => unique.has(b.value)
      ).length;

      const percent = collected / total * 100;

      const progress = document.createElement("div");
      progress.className = "world-stat";

      const heading = document.createElement("h3");
      heading.className = "world-gold";
      heading.textContent = "🏆 Progression actuelle";

      const count = document.createElement("p");
      count.textContent =
        collected + " / " + total +
        " coupures · " + percent.toFixed(1).replace(".", ",") + " %";

      const bar = document.createElement("div");
      bar.className = "world-bar";

      const fill = document.createElement("div");
      fill.className = "world-fill";
      fill.style.width = percent + "%";

      bar.append(fill);

      const missing = document.createElement("p");
      missing.textContent =
        (total - collected) + " coupure(s) à trouver";

      progress.append(heading, count, bar, missing);
      detail.append(progress);
    }


    const currentTitle=document.createElement("h3");
    currentTitle.textContent="💵 Billets actuels";
    detail.append(currentTitle);

    
const catalogCountry = window.WBC_CATALOG?.getCountry(country.code);

const values = catalogCountry?.current || denominations[country.code];


    if(values) {
      for(const item of values) {
        const owned=matching.some(n=>
          n.era==="current" &&
          Number(n.denomination)===item.value
        );

        const card=document.createElement("div");
        card.className="world-note"+(owned?" owned":"");
        
card.style.cursor = "pointer";

card.onclick = () => {
  if (owned) {
    const billet = matching.find(n =>
      n.era === "current" &&
      Number(n.denomination) === item.value
    );

    if (!billet) return;
      
const fiche = document.createElement("div");
fiche.style.cssText = `
  position:fixed;inset:0;z-index:10001;
  background:#091625;color:#f8f4e9;
  overflow-y:auto;padding:25px 18px 90px;
`;

const contenu = document.createElement("div");
contenu.style.cssText = "max-width:600px;margin:auto";

const retour = document.createElement("button");
retour.textContent = "← Retour aux billets";
retour.style.cssText = `
  background:#e5bd70;color:#091625;
  border:0;border-radius:12px;
  padding:14px;font-weight:bold;
  margin-bottom:25px;
`;
retour.onclick = () => fiche.remove();

const titre = document.createElement("h2");
titre.textContent = "💵 " + item.label;
titre.style.color = "#e5bd70";

const infos = document.createElement("div");
infos.style.cssText = `
  background:#15283c;
  border:1px solid #b88938;
  border-radius:16px;padding:20px;
  line-height:1.9;
`;

const pays = document.createElement("p");
pays.textContent = "🌍 Pays : " + country.name;

const annee = document.createElement("p");
annee.textContent = "📅 Année : " +
  (billet.issue_year || "Non renseignée");

const histoire = document.createElement("p");
histoire.textContent = "📜 " +
  (billet.history || billet.bio ||
  "Histoire de ce billet à compléter.");

infos.append(pays, annee, histoire);
contenu.append(retour, titre, infos);
fiche.append(contenu);
document.body.append(fiche);

  } else {
    if (confirm(
      "🔒 " + item.label +
      "\n\nTu ne possèdes pas encore ce billet." +
      "\nVeux-tu ouvrir le scanner ?"
    )) {
      fiche.remove();
      if (typeof show === "function") show("scan");
    }
  }
};


        const name=document.createElement("strong");
        name.textContent=(owned?"✓ ":"🔒 ")+item.label;

        const status=document.createElement("small");
        status.textContent=owned
          ?"Coupure présente dans ta collection"
          :"Coupure à trouver";

        card.append(name,status);
        detail.append(card);
      }
    } else {
      const info=document.createElement("p");
      info.textContent=
        "Catalogue des coupures à compléter pour ce pays.";
      detail.append(info);

      for(const n of matching.filter(n=>n.era==="current")) {
        const card=document.createElement("div");
        card.className="world-note owned";
        card.textContent="✓ "+n.denomination+
          " "+(n.currency||"");
        detail.append(card);
      }
    }

    const formerTitle=document.createElement("h3");
    formerTitle.textContent="📜 Billets anciens";
    detail.append(formerTitle);

    const former=matching.filter(n=>n.era==="former");

    if(!former.length) {
      const info=document.createElement("p");
      info.textContent=
        "Aucun ancien billet enregistré. "+
        "Le catalogue historique sera ajouté progressivement.";
      detail.append(info);
    } else {
      for(const n of former) {
        const card=document.createElement("div");
        card.className="world-note owned";
        card.textContent="✓ "+n.denomination+
          " "+(n.currency||"")+
          (n.issue_year?" · "+n.issue_year:"");
        detail.append(card);
      }
    }

    overlay.append(detail);
    document.body.append(overlay);
  }

  // Ouvre la fiche du pays sélectionné.
  document.getElementById("worldList")
    .addEventListener("click",event=>{
      const card=event.target.closest(".world-country");
      if(!card)return;

      const cards=[
        ...document.querySelectorAll(
          "#worldList .world-country"
        )
      ];

      const index=cards.indexOf(card);

      const visible=countryData.filter(c=>{
        const status=getStatus(c);
        const matches=normalize(c.name)
          .includes(normalize(search));

        const selected=
          mode==="all"||
          (mode==="owned"&&status.owned)||
          (mode==="missing"&&!status.owned)||
          (mode==="current"&&status.current)||
          (mode==="former"&&status.former);

        return matches&&selected;
      });

      if(visible[index])openCountry(visible[index]);
    });

      renderWorld();
    };
  });

  navButton.onclick = () => {
    if(typeof show === "function") show("world");
    document.querySelectorAll(
      "#signedApp > section"
    ).forEach(s => {
      s.classList.toggle("hidden",s.id !== "world");
    });
    nav.querySelectorAll("button").forEach(b => {
      b.classList.toggle("active",b === navButton);
    });
    renderWorld();
  };

  const originalShow = show;
  show = function(pg) {
    originalShow(pg);
    world.classList.toggle("hidden",pg !== "world");
  };

  renderWorld();
})();
