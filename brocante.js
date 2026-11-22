
/* World Banknote Collector V5 — Brocante automatique */
(() => {
  "use strict";

  const style = document.createElement("style");
  style.textContent = `
    #brocante h2, #brocante h3 {color:#e5bd70}
    #brocante .bc-card {
      background:#15283c;
      border:1px solid #62543d;
      border-radius:16px;
      padding:16px;
      margin:14px 0;
    }
    #brocante .bc-photo {
      display:block;
      width:100%;
      max-height:220px;
      object-fit:contain;
      margin:10px 0;
      border-radius:10px;
      background:#091625;
    }
    #brocante label {
      display:block;
      color:#e5bd70;
      margin:12px 0 6px;
    }
    #brocante input[type=number] {
      width:100%;
      padding:12px;
      font-size:17px;
      color:white;
      background:#102238;
      border:1px solid #62748e;
      border-radius:10px;
    }
    #brocante .bc-owned {
      color:#8de0a4;
      font-weight:bold;
    }
    #brocante .bc-new {
      color:#e5bd70;
      font-weight:bold;
    }
  `;
  document.head.appendChild(style);

  const signedApp = document.getElementById("signedApp");
  const nav = signedApp?.querySelector("nav");
  if (!signedApp || !nav) return;

  const section = document.createElement("section");
  section.id = "brocante";
  section.className = "hidden";

  section.innerHTML = `
    <h2>🛒 Mode Brocante</h2>
    <p>Photographie un billet pour l'identifier
    et vérifier ta collection.</p>

    <div class="bc-card">
      <h3>📸 Scanner le billet</h3>

      <label for="bc-front">Recto</label>
      <label class="filelabel" for="bc-front">
        📷 Photographier le recto
      </label>
      <input id="bc-front" type="file"
        accept="image/*" capture="environment">
      <img id="bc-front-preview"
        class="bc-photo hidden" alt="Recto">

      <label for="bc-back">Verso</label>
      <label class="filelabel" for="bc-back">
        📷 Photographier le verso
      </label>
      <input id="bc-back" type="file"
        accept="image/*" capture="environment">
      <img id="bc-back-preview"
        class="bc-photo hidden" alt="Verso">

      <button id="bc-analyze">
        🤖 Identifier avec Gemini
      </button>
      <p id="bc-status" role="status"></p>
    </div>

    <div id="bc-identification"
      class="bc-card hidden">
      <h3>💵 Identification du billet</h3>
      <p id="bc-description"></p>
      <p id="bc-confidence"></p>
      <p id="bc-ownership"></p>
      <h3>📖 Histoire</h3>
      <p id="bc-history"></p>

      <h3>💰 Valeur marchande</h3>
      <p>Estimation indisponible :
      aucune référence de prix vérifiée.</p>

      <label for="bc-price">
        Prix demandé par le vendeur (€)
      </label>
      <input id="bc-price" type="number"
        min="0" step="0.01"
        placeholder="Ex : 8">

      <p id="bc-price-result"></p>
    </div>
  `;

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

  const get = id => document.getElementById(id);
  const pictures = {front:null, back:null};

  function normalize(value) {
    return String(value ?? "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim()
      .toUpperCase();
  }

  function ownership(result) {
    const country = normalize(result.country);
    const currency = normalize(result.currency);
    const amount = Number(
      String(result.amount ?? "").replace(",", ".")
    );
    const year = Number(result.year);

    if (!country || !currency ||
        !String(result.amount ?? "").trim() ||
        !Number.isFinite(amount)) {
      return {
        text:"Identification insuffisante pour vérifier la collection.",
        owned:null
      };
    }

    const candidates = notes.filter(n =>
      normalize(n.country) === country &&
      normalize(n.currency) === currency &&
      Number(n.denomination) === amount
    );

    if (!candidates.length) {
      return {
        text:"🆕 Non possédé dans ma collection (selon les informations identifiées).",
        owned:false
      };
    }

    if (year && candidates.some(n =>
      Number(n.issue_year) === year
    )) {
      return {
        text:"✅ Déjà possédé dans ma collection — même pays, monnaie, valeur et année.",
        owned:true
      };
    }

    return {
      text:"🔎 Coupure déjà présente dans ma collection, mais série ou année à vérifier.",
      owned:null
    };
  }

  for (const side of ["front","back"]) {
    get("bc-" + side).addEventListener(
      "change", async event => {
        const file = event.target.files?.[0];
        if (!file) return;

        try {
          pictures[side] = null;
          get("bc-identification")
            .classList.add("hidden");

          const data = await compress(file);
          pictures[side] = data;

          const preview = get("bc-" + side + "-preview");
          preview.src = data;
          preview.classList.remove("hidden");

          get("bc-status").textContent =
            "✅ Photo " +
            (side === "front" ? "recto" : "verso") +
            " prête.";
        } catch (error) {
          get("bc-status").textContent =
            "Photo impossible : " + error.message;
        }
      }
    );
  }

  get("bc-analyze").addEventListener(
    "click", async () => {
      const status = get("bc-status");
      const analyzeButton = get("bc-analyze");

      if (!pictures.front || !pictures.back) {
        status.textContent =
          "Photographie le recto et le verso.";
        return;
      }

      analyzeButton.disabled = true;
      status.textContent =
        "🤖 Gemini identifie le billet…";

      try {
        if (!client) {
          throw new Error("Supabase indisponible.");
        }

        const {data, error} =
          await client.auth.getSession();

        if (error || !data.session) {
          throw new Error("Connexion requise.");
        }

        const response = await fetch(
          URL_BASE + "/functions/v1/identify-banknote",
          {
            method:"POST",
            headers:{
              "Content-Type":"application/json",
              apikey:PUBLIC_KEY,
              Authorization:
                "Bearer " +
                data.session.access_token
            },
            body:JSON.stringify({
              front:pictures.front,
              back:pictures.back
            })
          }
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result.error || "Analyse indisponible."
          );
        }

        const country = result.country || "Inconnu";
        const amount = result.amount ?? "?";
        const currency = result.currency || "";
        const year = result.year || "À vérifier";

        get("bc-description").textContent =
          country + " — " + amount + " " +
          currency + " · Année : " + year;

        const confidence = {
          high:"Élevée",
          medium:"Moyenne",
          low:"Faible"
        };

        get("bc-confidence").textContent =
          "Confiance Gemini : " +
          (confidence[result.confidence] || "Non précisée") +
          (result.needs_review
            ? " · Vérification nécessaire"
            : "");

        const match = ownership(result);
        const ownershipElement = get("bc-ownership");

        ownershipElement.textContent = match.text;
        ownershipElement.className =
          match.owned === true ? "bc-owned" :
          match.owned === false ? "bc-new" : "";

        get("bc-history").textContent =
          result.history ||
          "Histoire non disponible.";

        get("bc-identification")
          .classList.remove("hidden");

        status.textContent =
          "✅ Analyse terminée !";

      } catch (error) {
        console.error("Brocante :", error);
        status.textContent =
          "⚠️ " + error.message;
      } finally {
        analyzeButton.disabled = false;
      }
    }
  );

  get("bc-price").addEventListener("input", () => {
    const value = get("bc-price").value;
    const target = get("bc-price-result");

    if (!value) {
      target.textContent = "";
      return;
    }

    const price = Number(value);

    if (!Number.isFinite(price) || price < 0) {
      target.textContent =
        "⚠️ Prix invalide.";
      return;
    }

    target.textContent =
      "Prix demandé : " +
      price.toLocaleString("fr-FR", {
        style:"currency",
        currency:"EUR"
      }) +
      ". Comparaison indisponible tant qu'aucune estimation marchande vérifiée n'est disponible.";
  });
})();
