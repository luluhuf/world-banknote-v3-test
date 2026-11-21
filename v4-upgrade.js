/* World Banknote Collector V4 upgrade - load AFTER app.js (classic script, no type=module).
   Requires 01_quantites.sql to be run in Supabase first. */
(() => {
  'use strict';
  const EVENT_KEY = 'wbc_v4_quantity_events';
  const readEvents = () => localGet(EVENT_KEY, []);
  const writeEvents = events => { if (!localSet(EVENT_KEY, events)) throw Error('Stockage local saturé'); };
  const count = n => Math.max(1, Number(n.quantity) || 1);
  const known = n => n.country && n.country !== 'Non identifié' && n.currency && n.denomination != null && n.issue_year && ['current','former'].includes(n.era);
  const same = (a,b) => known(a) && known(b) && norm(a.country) === norm(b.country) && a.currency === b.currency && Number(a.denomination) === Number(b.denomination) && Number(a.issue_year) === Number(b.issue_year) && a.era === b.era;
  const originalSave = save;
  const originalSaveRemote = saveRemote;
  const originalSync = sync;
  const originalRemove = removeNote;

  // Existing rows get quantity=1 via SQL default. New rows persist quantity explicitly.
  saveRemote = async function(n) {
    await originalSaveRemote(n);
    if (count(n) !== 1) {
      const {error} = await client.from('banknotes').update({quantity:count(n)}).eq('id',n.id).eq('owner_id',user.id);
      if (error) throw error;
    }
  };

  refreshRemote = async function() {
    if (!user) return;
    const {data,error} = await client.from('banknotes').select('id,country,currency,denomination,issue_year,era,history,created_at,quantity').order('created_at',{ascending:false});
    if (error) throw error;
    const photoRes = await client.from('banknote_photos').select('banknote_id,side,storage_path');
    if (photoRes.error) throw photoRes.error;
    const paths = new Map();
    for (const p of photoRes.data||[]) if (p.side==='front') paths.set(p.banknote_id,p.storage_path);
    const remote=[];
    for (const n of data||[]) {
      const path=paths.get(n.id);
      if (path) {
        const signed=await client.storage.from('banknote-photos').createSignedUrl(path,3600);
        n.frontSigned=signed.data?.signedUrl||null;
      }
      remote.push(n);
    }
    const queued=pending();
    notes=[...remote,...queued.filter(n=>!remote.some(r=>r.id===n.id))];
    // Preserve optimistic counts for events still awaiting server acknowledgment.
    for (const e of readEvents().filter(e=>e.owner_id===user.id)) {
      const n=notes.find(n=>n.id===e.banknote_id);
      if (n) n.quantity=count(n)+e.delta;
    }
    persist(); render();
  };

  async function flushEvents() {
    if (!user || !navigator.onLine) return;
    for (const e of readEvents().filter(e=>e.owner_id===user.id)) {
      const {error} = await client.rpc('apply_banknote_quantity_event', {
        p_event_id:e.event_id,p_banknote_id:e.banknote_id,p_delta:e.delta
      });
      if (error) throw error;
      writeEvents(readEvents().filter(x=>x.event_id!==e.event_id));
    }
  }
  sync = async function() {
    if (!user || !navigator.onLine || busy) return;
    await originalSync();
    if (busy || pending().length) return;
    try { await flushEvents(); await refreshRemote(); updateSync(); }
    catch(e) { $('syncState').textContent='Quantités à synchroniser : '+e.message; }
  };

  save = async function() {
    if (!photos.front || !photos.back) return alert('Photos recto-verso obligatoires');
    let candidate;
    try { candidate=makeNote(); }
    catch(e) { $('status').textContent=e.message; return; }
    const match=notes.find(n=>same(n,candidate));
    if (!match) return originalSave();
    try {
      if (match.pending) {
        const q=pending();
        const item=q.find(n=>n.id===match.id);
        if (!item) throw Error('Billet local introuvable');
        item.quantity=count(item)+1;
        setPending(q);
      } else {
        const events=readEvents();
        events.push({event_id:uuid(),owner_id:user.id,banknote_id:match.id,delta:1});
        writeEvents(events);
      }
      match.quantity=count(match)+1;
      persist();render();show('collection');
      photos={front:null,back:null};
      $('front').value='';$('back').value='';
      for (const id of ['frontPreview','backPreview']) $(id).classList.add('hidden');
      $('result').classList.add('hidden');
      $('syncState').textContent='Doublon reconnu : quantité +1';
      if (navigator.onLine) sync();
    } catch(e) { $('status').textContent=e.message; }
  };

  render = function() {
    const total=notes.reduce((sum,n)=>sum+count(n),0);
    $('total').textContent=total+' billet'+(total!==1?'s':'')+' · '+notes.length+' modèle'+(notes.length!==1?'s':'');
    $('countries').textContent=new Set(notes.map(n=>n.country).filter(v=>v&&v!=='Non identifié')).size+' pays / zones';
    const shown=notes.filter(n=>filter==='all'||n.era===filter);
    const target=$('items');target.replaceChildren();
    if (!shown.length) {target.textContent='Aucun billet dans cette catégorie.';return;}
    const regions={
      Europe:['Roumanie','France (franc)','Allemagne (mark)','Italie (lire)','Royaume-Uni','Suisse','Zone euro'],
      'Amérique du Nord':['États-Unis','Canada'],
      Afrique:['Maroc'],
      Asie:['Inde','Japon']
    };
    const regionOf=country=>Object.keys(regions).find(r=>regions[r].includes(country))||'Autres pays';
    const groups=new Map();
    for(const n of shown) {
      const key=regionOf(n.country)+'|'+(n.country||'Non identifié');
      if(!groups.has(key))groups.set(key,[]);
      groups.get(key).push(n);
    }
    for(const [key,items] of [...groups].sort((a,b)=>a[0].localeCompare(b[0],'fr'))) {
      const [continent,country]=key.split('|');
      const section=document.createElement('section');
      const h=document.createElement('h3');
      h.textContent=continent+' · '+country+' ('+items.reduce((s,n)=>s+count(n),0)+')';
      section.append(h);
      for(const n of items.sort((a,b)=>(Number(a.denomination)||0)-(Number(b.denomination)||0))) {
        const card=document.createElement('div');card.className='card';
        const heading=document.createElement('strong');
        heading.textContent=[n.denomination,n.currency].filter(Boolean).join(' ')+' · ×'+count(n);
        const desc=document.createElement('p');
        desc.textContent=(n.era==='former'?'Ancien':n.era==='current'?'Actuel':'À vérifier')+(n.issue_year?' · '+n.issue_year:'');
        card.append(heading,desc);
        const imgSrc=n.localFront||n.frontSigned;
        if(imgSrc){const img=document.createElement('img');img.className='thumb';img.src=imgSrc;img.alt='Recto du billet';card.append(img);}
        if(n.history){const p=document.createElement('p');p.textContent=n.history;card.append(p);}
        if(n.pending){const p=document.createElement('p');p.className='gold';p.textContent='⏳ À synchroniser';card.append(p);}
        else {
          const del=document.createElement('button');del.className='secondary';del.textContent='Supprimer la fiche';del.onclick=()=>originalRemove(n);card.append(del);
          if(count(n)>1){const minus=document.createElement('button');minus.className='secondary';minus.textContent='Quantité −1';minus.onclick=async()=>{
            try{
              const events=readEvents();events.push({event_id:uuid(),owner_id:user.id,banknote_id:n.id,delta:-1});writeEvents(events);
              n.quantity=count(n)-1;persist();render();if(navigator.onLine)sync();
            }catch(e){alert(e.message);}
          };card.append(minus);}
        }
        section.append(card);
      }
      target.append(section);
    }
  };

  // start() in app.js has already wired handlers; replace only the save handler.
  $('saveBtn').onclick=save;
  render();
})();
