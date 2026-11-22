
/* World Banknote Collector V5 — Mode Brocante */
(() => {
  "use strict";

  const style = document.createElement("style");
  style.textContent = `
    #brocante .bc-card {
      background:#15283c;
      border:1px solid #62543d;
      border-radius:16px;
      padding:16px;
      margin:14px 0;
    }
    #brocante h2, #brocante h3 {
      color:#e5bd70;
    }
    #brocante label {
      display:block;
      margin:12px 0 5px;
      color:#e5bd70;
    }
    #brocante input {
      width:100%;
      padding:12px;
      border:1px solid #62748e;
      border-radius:10px;
      background:#102238;
      color:white;
      font-size:16px;
    }
    #bc-result {
      font-size:17px;
      line-height:1.6;
    }
  `;
  document.head.appendChild(style);

  const section = document.createElement("section");
  section.id = "brocante";
  section.className = "hidden";

  section.innerHTML = `
    <h2>🛒 Mode Brocante</h2>
    <p>Compare le prix demandé avec une estimation
    de marché vérifiée.</p>

    <div class="bc-card">
      <label for="bc-country">Pays du billet</label>
      <input id="bc-country" placeholder="Ex : Roumanie">

      <label for="bc-value">Valeur faciale</label>
      <input id="bc-value" placeholder="Ex : 5 lei">

      <label for="bc-year">Année ou série</label>
      <input id="bc-year" placeholder="Ex : 2005">

      <label for="bc-price">Prix demandé (€)</label>
      <input id="bc-price" type="number"
        min="0" step="0.01" placeholder="Ex : 8">

      <label for="bc-min">Estimation minimale (€)</label>
      <input id="bc-min" type="number"
        min="0" step="0.01" placeholder="Ex : 2">

      <label for="bc-max">Estimation maximale (€)</label>
      <input id="bc-max" type="number"
        min="0" step="0.01" placeholder="Ex : 4">

      <button id="bc-check">💰 Comparer les prix</button>
    </div>

    <div class="bc-card hidden" id="bc-result"></div>
  `;

  const signedApp = document.getElementById("signedApp");
  const nav = signedApp?.querySelector("nav");
  if (!signedApp || !nav) return;

  nav.before(section);

  const button = document.createElement("button");
  button.textContent = "🛒 Brocante";
  button.dataset.page = "brocante";
  nav.appendChild(button);

  const previousShow = show;
  show = function(pageName) {
    previousShow(pageName);
    section.classList.toggle(
      "hidden", pageName !== "brocante"
    );
    button.classList.toggle(
      "active", pageName === "brocante"
    );
  };

  button.addEventListener("click", () => show("brocante"));

  document.getElementById("bc-check").onclick = () => {
    const priceInput = document.getElementById("bc-price");
    const minInput = document.getElementById("bc-min");
    const maxInput = document.getElementById("bc-max");
    const result = document.getElementById("bc-result");

    const price = Number(priceInput.value);
    const min = Number(minInput.value);
    const max = Number(maxInput.value);

    result.classList.remove("hidden");

    if (
      !priceInput.value || !minInput.value || !maxInput.value ||
      ![price,min,max].every(Number.isFinite) ||
      price < 0 || min < 0 || max < min
    ) {
      result.textContent =
        "⚠️ Vérifie les trois montants saisis.";
      return;
    }

    if (price < min) {
      result.textContent =
        "🟢 Prix inférieur à l'estimation : affaire potentiellement intéressante.";
    } else if (price <= max) {
      result.textContent =
        "🟡 Prix dans la fourchette estimée.";
    } else {
      result.textContent =
        "🔴 Prix supérieur à l'estimation : négociation conseillée.";
    }
  };
})();
