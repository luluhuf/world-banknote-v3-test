
/* World Banknote Collector — Brocante Prices V1 */
(() => {
  "use strict";

  const el = id => document.getElementById(id);

  const style = document.createElement("style");
  style.textContent = `
    #bc-market {
      background:#15283c;
      border:1px solid #62543d;
      border-radius:16px;
      padding:16px;
      margin:14px 0;
      color:#f8f4e9;
    }
    #bc-market h3 {color:#e5bd70}
    #bc-market .market-row {
      display:flex;
      justify-content:space-between;
      gap:12px;
      margin:12px 0;
    }
    #bc-market .market-muted {
      color:#b9c5d2;
      font-size:14px;
    }
    #bc-market a {
      color:#e5bd70;
      overflow-wrap:anywhere;
    }
  `;
  document.head.appendChild(style);

  function money(value) {
    return Number(value).toLocaleString("fr-FR", {
      style:"currency",
      currency:"EUR"
    });
  }

  function createInterface() {
    const identification = el("bc-identification");

    if (!identification || el("bc-market")) return;

    const market = document.createElement("div");
    market.id = "bc-market";

    market.innerHTML = `
      <h3>📊 Comparateur de prix</h3>

      <div class="market-row">
        <span>Ventes réalisées</span>
        <strong id="bc-sold-value">—</strong>
      </div>

      <div class="market-row">
        <span>Annonces en cours</span>
        <strong id="bc-active-value">—</strong>
      </div>

      <div class="market-row">
        <span>Fourchette estimée</span>
        <strong id="bc-estimated-value">—</strong>
      </div>

      <h3>🛒 Verdict</h3>
      <p id="bc-verdict">
        En attente d'une estimation vérifiée.
      </p>

      <h3>🔗 Sources</h3>
      <div id="bc-sources" class="market-muted">
        Aucune source de prix connectée.
      </div>
    `;

    identification.appendChild(market);
  }

  function setText(id, value) {
    const node = el(id);
    if (node) node.textContent = value;
  }

  function renderSources(sources) {
    const target = el("bc-sources");
    if (!target) return;

    target.replaceChildren();

    if (!Array.isArray(sources) || !sources.length) {
      target.textContent =
        "Aucune source de prix vérifiée disponible.";
      return;
    }

    for (const source of sources) {
      if (!source || typeof source !== "object") continue;

      const url = source.url;

      if (typeof url !== "string" ||
          !/^https:\/\/[^ ]+$/i.test(url)) continue;

      const link = document.createElement("a");
      link.href = url;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.textContent =
        source.title || "Voir la source";

      const row = document.createElement("p");
      row.appendChild(link);
      target.appendChild(row);
    }

    if (!target.children.length) {
      target.textContent =
        "Aucun lien de source exploitable.";
    }
  }

  let lastEstimate = null;

  function updateVerdict() {
    const input = el("bc-price");
    if (!input) return;

    const priceText = input.value.trim();

    if (!priceText) {
      setText("bc-verdict",
        "Saisis le prix demandé par le vendeur.");
      return;
    }

    const price = Number(priceText);

    if (!Number.isFinite(price) || price < 0) {
      setText("bc-verdict", "Prix invalide.");
      return;
    }

    const min = Number(lastEstimate?.estimated_min);
    const max = Number(lastEstimate?.estimated_max);

    if (
      !lastEstimate ||
      lastEstimate.estimated_min == null ||
      lastEstimate.estimated_max == null ||
      !Number.isFinite(min) ||
      !Number.isFinite(max) ||
      min < 0 || max < min
    ) {
      setText("bc-verdict",
        "⏳ Prix vendeur : " + money(price) +
        ". Comparaison impossible sans données de marché vérifiées.");
      return;
    }

    let verdict;

    if (price < min) {
      verdict = "🟢 Prix inférieur à la fourchette estimée.";
    } else if (price <= max) {
      verdict = "🟡 Prix dans la fourchette estimée.";
    } else {
      verdict = "🔴 Prix supérieur à la fourchette estimée.";
    }

    setText("bc-verdict",
      verdict + " Vendeur : " + money(price) +
      " · Estimation : " + money(min) +
      " à " + money(max) + ".");
  }

  async function fetchEstimate(result) {
    createInterface();

    lastEstimate = null;

    setText("bc-sold-value", "—");
    setText("bc-active-value", "—");
    setText("bc-estimated-value", "—");
    setText("bc-verdict", "Recherche des prix…");
    renderSources([]);

    try {
      const {data, error} =
        await client.auth.getSession();

      if (error || !data.session) {
        throw new Error("Connexion requise.");
      }

      const response = await fetch(
        URL_BASE + "/functions/v1/estimate-banknote",
        {
          method:"POST",
          headers:{
            "Content-Type":"application/json",
            apikey:PUBLIC_KEY,
            Authorization:
              "Bearer " + data.session.access_token
          },
          body:JSON.stringify({
            country:result.country,
            currency:result.currency,
            amount:result.amount,
            year:result.year
          })
        }
      );

      const estimate = await response.json();

      if (!response.ok) {
        throw new Error(
          estimate.error || "Estimation indisponible."
        );
      }

      lastEstimate = estimate;

      const sold = Array.isArray(estimate.sold_listings)
        ? estimate.sold_listings : [];
      const active = Array.isArray(estimate.active_listings)
        ? estimate.active_listings : [];

      setText("bc-sold-value",
        sold.length ? sold.length + " référence(s)" : "—");

      setText("bc-active-value",
        active.length ? active.length + " annonce(s)" : "—");

      if (estimate.estimated_min != null &&
          estimate.estimated_max != null) {
        setText("bc-estimated-value",
          money(estimate.estimated_min) +
          " – " + money(estimate.estimated_max));
      } else {
        setText("bc-estimated-value",
          "Non disponible");
      }

      renderSources(estimate.sources);
      updateVerdict();

    } catch (error) {
      console.error("Estimation Brocante :", error);
      lastEstimate = null;
      setText("bc-verdict",
        "⚠️ Recherche indisponible : " +
        error.message);
    }
  }

  function initialize() {
    createInterface();

    const priceInput = el("bc-price");
    if (priceInput) {
      priceInput.addEventListener("input", updateVerdict);
    }

    const analyze = el("bc-analyze");

    if (!analyze) return;

    analyze.addEventListener("click", async () => {
      const identification = el("bc-identification");
      if (!identification) return;

      // Attendre la fin de l'analyse Gemini.
      const observer = new MutationObserver(() => {
        if (
          !identification.classList.contains("hidden") &&
          el("bc-status")?.textContent.includes(
            "Analyse terminée"
          )
        ) {
          observer.disconnect();

          const description =
            el("bc-description")?.textContent || "";

          const match = description.match(
            /^(.*?) — (.*?) (.*?) · Année : (.*)$/
          );

          if (!match) {
            setText("bc-verdict",
              "Identification insuffisante.");
            return;
          }

          fetchEstimate({
            country:match[1],
            amount:match[2],
            currency:match[3],
            year:match[4] === "À vérifier"
              ? "" : match[4]
          });
        }
      });

      observer.observe(identification, {
        attributes:true,
        attributeFilter:["class"]
      });

      setTimeout(() => observer.disconnect(), 60000);
    });
  }

  initialize();
})();

/* World Banknote Collector — Numista Display V1 */
(() => {
  "use strict";

  const originalFetch = window.fetch;

  window.fetch = async function (...args) {
    const response = await originalFetch.apply(this, args);

    const url = String(args[0] || "");

    if (!url.includes("/functions/v1/estimate-banknote")) {
      return response;
    }

    try {
      const data = await response.clone().json();
      const references = data.numista?.references || [];

      let target = document.getElementById("bc-numista");

      if (!target) {
        target = document.createElement("div");
        target.id = "bc-numista";

        target.style.cssText = `
          margin-top:16px;
          padding-top:12px;
          border-top:1px solid #62543d;
        `;

        document.getElementById("bc-market")
          ?.appendChild(target);
      }

      target.replaceChildren();

      const heading = document.createElement("h3");
      heading.textContent = "🏦 Références Numista";
      target.appendChild(heading);

      if (!references.length) {
        const p = document.createElement("p");
        p.textContent = "Aucune référence compatible trouvée.";
        target.appendChild(p);
        return response;
      }

      for (const ref of references) {
        const p = document.createElement("p");

        p.textContent =
          `${ref.title} · Réf. ${ref.id} · ` +
          `${ref.min_year ?? "?"}–${ref.max_year ?? "?"}`;

        target.appendChild(p);
      }

    } catch (error) {
      console.warn("Affichage Numista :", error);
    }

    return response;
  };
})();
