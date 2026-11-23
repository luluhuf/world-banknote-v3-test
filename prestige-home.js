
/* World Banknote Collector V5 — Collection Prestige */
(() => {
  "use strict";

  const style = document.createElement("style");
  style.textContent = `
    :root {
      --prestige-bg: #091625;
      --prestige-card: #15283c;
      --prestige-gold: #e5bd70;
      --prestige-text: #f8f4e9;
    }

    body {
      background: var(--prestige-bg);
      color: var(--prestige-text);
    }

    h1 small, .gold {
      color: var(--prestige-gold);
    }

    .card {
      background: var(--prestige-card);
      border: 1px solid rgba(229,189,112,.18);
      box-shadow: 0 8px 25px rgba(0,0,0,.12);
    }

    button, .filelabel {
      background: var(--prestige-gold);
    }

    nav {
      background: #101f31;
      border-top: 1px solid rgba(229,189,112,.25);
    }

    .prestige-hero {
      padding: 24px 18px;
      border-radius: 22px;
      background:
        radial-gradient(circle at 90% 10%,
          rgba(229,189,112,.15),transparent 55%),
        linear-gradient(145deg,#1c354b,#0e2032);
      border: 1px solid rgba(229,189,112,.3);
      text-align: center;
      margin: 16px 0;
    }

    .prestige-hero h2 {
      color: var(--prestige-gold);
      margin: 0 0 12px;
    }

    .prestige-number {
      font-size: 34px;
      font-weight: 800;
      color: white;
    }

    .prestige-progress {
      height: 9px;
      background: #34475a;
      border-radius: 20px;
      overflow: hidden;
      margin: 16px 0;
    }

    .prestige-progress span {
      display: block;
      height: 100%;
      width: 0%;
      background: linear-gradient(90deg,#b98a40,#f3d796);
      transition: width .5s;
    }

    .prestige-grid {
      display: grid;
      grid-template-columns: repeat(2,minmax(0,1fr));
      gap: 12px;
      margin: 20px 0;
    }

    .prestige-tile {
      min-height: 115px;
      border: 1px solid rgba(229,189,112,.3);
      border-radius: 18px;
      background: linear-gradient(145deg,#20364b,#132538);
      color: white;
      padding: 16px 10px;
      text-align: center;
      font-size: 15px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 9px;
      margin: 0;
      width: 100%;
    }

    .prestige-tile span {
      font-size: 29px;
    }

    .prestige-tile strong {
      color: var(--prestige-gold);
    }

    .prestige-tile:active {
      transform: scale(.97);
    }

    .prestige-note {
      font-size: 12px;
      color: #aab9c9;
      text-align: center;
    }
  `;
  document.head.appendChild(style);

  const home = document.getElementById("home");
  if (!home) return;

  const oldTitle = home.querySelector("h2");
  if (oldTitle) oldTitle.remove();

  const hero = document.createElement("div");
  hero.className = "prestige-hero";
    hero.innerHTML = `
    <div style="color:#e5bd70;font-size:13px;letter-spacing:2px;margin-bottom:10px;">
      WORLD BANKNOTE COLLECTOR
    </div>
    <h2>👑 Bienvenue, luluhuf !</h2>
    <p style="color:#b9c5d2;font-size:13px;">
      Prêt à enrichir ta collection de billets du monde ? 🌍
    </p>
    <h3 style="color:#e5bd70;margin-top:22px;">
      🌍 Ma collection mondiale
    </h3>
    <div class="prestige-number" id="prestigeCountries">0 / 195</div>
    <p>Pays représentés dans ma collection</p>
    <div class="prestige-progress">
      <span id="prestigeBar"></span>
    </div>
    <small id="prestigePercent">0 % du monde</small>
  `;

  const grid = document.createElement("div");
  grid.className = "prestige-grid";

  const destinations = [
    ["💵","Mes billets","collection"],
    ["📸","Scanner","scan"],
    ["🔒","À débloquer","world"],
    ["📊","Statistiques","stats"],
    ["🌍","Pays","countries"],
    ["🔗","Partager","share"]
  ];

  destinations.forEach(([emoji,label,destination]) => {
    const button = document.createElement("button");
    button.className = "prestige-tile";

    const symbol = document.createElement("span");
    symbol.textContent = emoji;

    const title = document.createElement("strong");
    title.textContent = label;

    button.append(symbol,title);

    
button.addEventListener("click", () => {
  if (["collection","scan","share","world"].includes(destination)) {
    show(destination);

    if (destination === "world") {
      document.querySelector('#world [data-world="missing"]')?.click();
    }

  } else {
    alert("Cette rubrique arrive dans la prochaine étape de la V5 !");
  }
});


    grid.appendChild(button);
  });

  const info = document.createElement("p");
  info.className = "prestige-note";
  info.textContent = "WORLD BANKNOTE COLLECTOR • COLLECTION PRESTIGE";

  home.prepend(hero,grid,info);

  const update = () => {
    const countries = new Set(
      notes
        .filter(n => n.country && n.country !== "Non identifié")
        .map(n => norm(n.country))
    );

    const total = Math.min(countries.size,195);
    const percent = Math.round(total / 195 * 100);

    document.getElementById("prestigeCountries").textContent =
      total + " / 195";

    document.getElementById("prestigeBar").style.width =
      percent + "%";

    document.getElementById("prestigePercent").textContent =
      percent + " % du monde";
  };

  const previousRender = render;
  render = function(...args) {
    previousRender.apply(this,args);
    update();
  };

    try {
    update();
  } catch (error) {
    console.error("Erreur accueil Prestige :", error);
  }
})();
