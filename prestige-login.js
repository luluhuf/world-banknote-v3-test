
/* World Banknote Collector — Prestige Login V1 */
(() => {
  "use strict";

  const style = document.createElement("style");

  style.textContent = `
    body:has(#auth:not(.hidden)) {
      background:
        radial-gradient(ellipse at 50% 12%,
          #284663 0%, #091625 62%);
    }

    body:has(#auth:not(.hidden)) > h1 {
      display:none;
    }

    #auth {
      min-height:85vh;
      display:flex;
      flex-direction:column;
      justify-content:center;
      padding:12px 0 30px;
    }

    #auth .card {
      background:linear-gradient(
        160deg,#1c344c,#112438 75%
      );
      border:1px solid #78613b;
      border-radius:26px;
      padding:28px 22px;
      box-shadow:0 18px 45px #0005;
    }

    #auth .prestige-brand {
      text-align:center;
      margin-bottom:26px;
    }

    #auth .prestige-logo {
      display:block;
      width:112px;
      height:112px;
      margin:0 auto 18px;
      border-radius:25px;
      box-shadow:0 8px 28px #0006;
      object-fit:cover;
    }

    #auth .prestige-title {
      font-size:26px;
      font-weight:800;
      letter-spacing:2px;
      line-height:1.2;
      color:#f8f4e9;
    }

    #auth .prestige-title span {
      color:#e5bd70;
    }

    #auth .prestige-subtitle {
      color:#b9c5d2;
      font-size:13px;
      margin-top:10px;
      letter-spacing:1px;
    }

    #auth h2 {
      color:#e5bd70;
      font-size:21px;
      text-align:center;
      margin-bottom:22px;
    }

    #auth .field {
      margin:18px 0;
    }

    #auth .field label {
      color:#e5bd70;
      font-size:14px;
      font-weight:600;
      margin-bottom:9px;
    }

    #auth input {
      background:#091a2c;
      border:1px solid #536a82;
      border-radius:14px;
      padding:16px;
      color:#fff;
      font-size:16px;
    }

    #auth input:focus {
      outline:2px solid #e5bd70;
      border-color:#e5bd70;
    }

    #auth #loginBtn {
      display:block;
      width:100%;
      margin:24px 0 10px;
      padding:17px;
      border-radius:15px;
      background:linear-gradient(
        135deg,#f1d28b,#d5a64f
      );
      color:#091625;
      font-size:17px;
      font-weight:800;
      box-shadow:0 6px 18px #0004;
    }

    #auth .prestige-footer {
      text-align:center;
      font-size:11px;
      letter-spacing:2px;
      color:#a7b5c6;
      margin-top:24px;
    }

    #auth .muted {
      display:none;
    }

    #auth-status {
      text-align:center;
      font-size:14px;
    }
  `;

  document.head.appendChild(style);

  const auth = document.getElementById("auth");
  if (!auth) return;

  const card = auth.querySelector(".card");
  if (!card) return;

  const brand = document.createElement("div");
  brand.className = "prestige-brand";

  const logo = document.createElement("img");
  logo.className = "prestige-logo";
  logo.src = "icon-512.png";
  logo.alt = "World Banknote Collector";

  const title = document.createElement("div");
  title.className = "prestige-title";
  title.innerHTML =
    "WORLD BANKNOTE<br><span>COLLECTOR</span>";

  const subtitle = document.createElement("div");
  subtitle.className = "prestige-subtitle";
  subtitle.textContent =
    "LA PASSION DES BILLETS DU MONDE";

  brand.append(logo,title,subtitle);
  card.prepend(brand);

  const heading = card.querySelector("h2");
  if (heading) {
    heading.textContent = "🔐 Espace collectionneur";
  }

  const intro = heading?.nextElementSibling;
  if (intro?.tagName === "P") {
    intro.textContent =
      "Bienvenue dans ta collection privée.";
    intro.style.textAlign = "center";
  }

  const login = document.getElementById("loginBtn");
  if (login) {
    login.textContent = "Accéder à ma collection →";
  }

  const footer = document.createElement("div");
  footer.className = "prestige-footer";
  footer.textContent =
    "COLLECTION PRIVÉE · ACCÈS SÉCURISÉ";

  card.appendChild(footer);
})();
