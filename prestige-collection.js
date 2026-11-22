
/* World Banknote Collector — Prestige Collection */
(() => {
  "use strict";

  const css = document.createElement("style");
  css.textContent = `
    #collection .pc-search {
      width:100%;padding:14px;margin:12px 0;
      background:#102238;color:white;
      border:1px solid #b99a60;border-radius:12px;
      font-size:16px
    }
    #items.pc-grid {
      display:grid;grid-template-columns:repeat(2,minmax(0,1fr));
      gap:12px;margin-top:15px
    }
    .pc-card {
      background:#15283c;border:1px solid #62543d;
      border-radius:15px;padding:10px;min-width:0
    }
    .pc-card img {
      width:100%;aspect-ratio:1.6;object-fit:contain;
      background:#091625;border-radius:9px
    }
    .pc-card strong {
      display:block;color:#e5bd70;margin:8px 0 4px
    }
    .pc-card small {color:#cbd5df;display:block}
    .pc-card button {font-size:12px;padding:9px}
    .pc-overlay {
      position:fixed;inset:0;z-index:9999;
      background:#091625;color:white;
      overflow:auto;padding:18px
    }
    .pc-detail {max-width:650px;margin:auto}
    .pc-detail img {
      width:100%;max-height:65vh;object-fit:contain;
      touch-action:pinch-zoom
    }
    .pc-detail h2 {color:#e5bd70}
 
.pc-country {
  grid-column:1/-1;
  border:1px solid #62543d;
  border-radius:15px;
  overflow:hidden;
  background:#102238;
}
.pc-country summary {
  padding:16px;
  color:#e5bd70;
  font-weight:bold;
  cursor:pointer;
  list-style:none;
}
.pc-country summary::-webkit-details-marker {
  display:none;
}
.pc-country-grid {
  display:grid;
  grid-template-columns:repeat(2,minmax(0,1fr));
  gap:12px;
  padding:12px;
}
.pc-country-count {
  float:right;
  color:#cbd5df;
  font-size:12px;
  font-weight:normal;
}
 `;
  document.head.append(css);

function updateCollectionStats() {
  if (typeof notes === "undefined") return;

  let dashboard = document.getElementById("pc-stats");

  if (!dashboard) {
    dashboard = document.createElement("div");
    dashboard.id = "pc-stats";
    dashboard.style.cssText =
      "display:grid;grid-template-columns:repeat(3,1fr);" +
      "gap:8px;margin:15px 0;";

    const items = document.getElementById("items");
    if (!items) return;
    items.before(dashboard);
  }

  const countries = new Set(
    notes.map(n => n.country).filter(Boolean)
  );

  const references = new Set(
    notes.map(n =>
      [n.country, n.denomination, n.currency,
       n.issue_year, n.era].join("|")
    )
  );

  const duplicates = notes.length - references.size;

  const stats = [
    ["💵", notes.length, "Billets"],
    ["🌍", countries.size, "Pays"],
    ["📚", duplicates, "Doublons"]
  ];

  dashboard.replaceChildren();

  for (const [icon, value, label] of stats) {
    const card = document.createElement("div");
    card.style.cssText =
      "background:#15283c;border:1px solid #62543d;" +
      "border-radius:12px;padding:12px 5px;" +
      "text-align:center;color:#e5bd70;";

    const number = document.createElement("strong");
    number.style.cssText =
      "display:block;font-size:24px;margin:6px 0;";
    number.textContent = value;

    const caption = document.createElement("small");
    caption.style.color = "#cbd5df";
    caption.textContent = icon + " " + label;

    card.append(number, caption);
    dashboard.append(card);
  }
}

  let search = "";
  const image = (n,side) =>
    side==="front"
      ? n.localFront||n.frontSigned||""
      : n.localBack||n.backSigned||"";

  async function loadBack(n) {
    if(image(n,"back")||n.pending||!user)return;
    const {data,error}=await client
      .from("banknote_photos")
      .select("storage_path")
      .eq("banknote_id",n.id)
      .eq("side","back")
      .maybeSingle();
    if(error||!data?.storage_path)return;
    const r=await client.storage
      .from("banknote-photos")
      .createSignedUrl(data.storage_path,3600);
    if(!r.error)n.backSigned=r.data?.signedUrl;
  }

  function openNote(n) {
    const overlay=document.createElement("div");
    overlay.className="pc-overlay";
    const detail=document.createElement("div");
    detail.className="pc-detail";
    const close=document.createElement("button");
    close.textContent="✕ Fermer";
    close.onclick=()=>overlay.remove();

    const title=document.createElement("h2");
    title.textContent=(n.country||"Non identifié")
      +" — "+(n.denomination??"?")+" "+(n.currency||"");

    const photo=document.createElement("img");
    photo.alt="Photo du billet";

    const front=document.createElement("button");
    front.textContent="Recto";
    const back=document.createElement("button");
    back.textContent="Verso";

    function display(side) {
      const src=image(n,side);
      photo.removeAttribute("src");
      if(src)photo.src=src;
      photo.alt=src?side:"Photo indisponible";
      front.disabled=side==="front";
      back.disabled=side==="back";
    }

    front.onclick=()=>display("front");
    back.onclick=async()=>{
      back.disabled=true;
      try{await loadBack(n)}catch(e){console.warn(e)}
      display("back");
    };

    const info=document.createElement("p");
    info.textContent=
      (n.era==="current"?"Actuel":
       n.era==="former"?"Ancien":"À vérifier")
      +(n.issue_year?" · "+n.issue_year:"");

    const history=document.createElement("p");
    history.textContent=n.history||
      "Aucune fiche historique vérifiée.";

    detail.append(close,title,photo,front,back,info,history);

    if(!n.pending){
      const del=document.createElement("button");
      del.className="secondary";
      del.textContent="Supprimer ce billet";
      del.onclick=async()=>{
        await removeNote(n);
        if(!notes.some(x=>x.id===n.id))overlay.remove();
      };
      detail.append(del);
    }

    overlay.append(detail);
    document.body.append(overlay);
    display("front");
  }

  function renderGallery() {
    const target=document.getElementById("items");
    if(!target||typeof notes==="undefined")return;

    let input=document.querySelector(".pc-search");
    if(!input){
      input=document.createElement("input");
      input.className="pc-search";
      input.type="search";
      input.placeholder="🔎 Rechercher un billet...";
      input.oninput=()=>{
        search=input.value;
        renderGallery();
      };
      target.before(input);
    }

    const normalize=s=>String(s??"")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g,"")
      .toLowerCase();

    const q=normalize(search);
    const sorted=notes.filter(n=>
      (filter==="all"||n.era===filter)&&
      [n.country,n.currency,n.denomination,n.issue_year]
        .some(v=>normalize(v).includes(q))
    ).sort((a,b)=>
      (a.country||"").localeCompare(
        b.country||"","fr",{sensitivity:"base"}
      )||(Number(a.denomination)||0)-
         (Number(b.denomination)||0)
    );

    target.replaceChildren();
    target.className="pc-grid";

    if(!sorted.length){
      const p=document.createElement("p");
      p.textContent="Aucun billet trouvé.";
      target.append(p);
      return;
    }

const countries = new Map();

for (const n of sorted) {
  const country = n.country || "Non identifié";

  if (!countries.has(country)) {
    const group = document.createElement("details");
    group.className = "pc-country";

    const heading = document.createElement("summary");
    heading.textContent = "🌍 " + country;

    const count = document.createElement("span");
    count.className = "pc-country-count";
    count.textContent = "0 billet";

    const grid = document.createElement("div");
    grid.className = "pc-country-grid";

    heading.append(count);
    group.append(heading, grid);
    target.append(group);

    countries.set(country, {grid, count, total: 0});
  }

  const entry = countries.get(country);
  entry.total++;
  entry.count.textContent =
    entry.total + (entry.total > 1 ? " billets" : " billet");
}

    for(const n of sorted){
      const card=document.createElement("div");
      card.className="pc-card";

      const img=document.createElement("img");
      const src=image(n,"front");
      if(src)img.src=src;
      img.alt="Recto";
      img.loading="lazy";

      const name=document.createElement("strong");
      name.textContent=n.country||"Non identifié";

      const meta=document.createElement("small");
      meta.textContent=
        (n.denomination??"?")+" "+(n.currency||"")
        +(n.issue_year?" · "+n.issue_year:"");

      const btn=document.createElement("button");
      btn.textContent="Voir le billet";
      btn.onclick=()=>openNote(n);

      card.append(img,name,meta,btn);

      if(n.pending){
        const wait=document.createElement("small");
        wait.textContent="⏳ À synchroniser";
        card.append(wait);
      }
      
countries.get(n.country || "Non identifié").grid.append(card);

    }
  }

  function install(){
    if(typeof render!=="function"||
       typeof show!=="function")return;

    const originalRender=render;
    render=function(){
      originalRender();
      renderGallery();
    };

    renderGallery();
  }

  install();
})();
