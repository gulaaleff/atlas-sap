/* Atlas SAP · aplicação. Conteúdo em /content, textos de interface em assets/i18n.js. */

/* ===== ESTADO (salvo só neste navegador) ===== */
const KEY='atlas-sap-v1';
const blank=()=>({v:2,xp:0,days:[],ch:{},tq:{},tqSeen:{},cards:{},chal:{},order:{},theme:'system',lang:'pt',seenVer:null,curMod:'sd'});
let S=blank();
try{const raw=localStorage.getItem(KEY); if(raw) S=Object.assign(blank(),JSON.parse(raw));}catch(e){}
/* migração do protótipo (progresso só de SD, sem prefixo de módulo) */
if(S.v!==2){
  const pre=o=>{const n={}; for(const k in o||{}) n[k.includes(':')?k:'sd:'+k]=o[k]; return n;};
  S.ch=pre(S.ch); S.tq=pre(S.tq); S.tqSeen=pre(S.tqSeen);
  if(S.challenge!==undefined&&S.challenge!==null){S.chal={sd:S.challenge};} delete S.challenge;
  if(S.order===true) S.order={sd:true}; else if(typeof S.order!=='object') S.order={};
  S.chal=S.chal||{}; S.curMod=S.curMod||'sd'; S.v=2;
}
function save(){try{localStorage.setItem(KEY,JSON.stringify(S));}catch(e){}}

/* ===== IDIOMA ===== */
const t=(k,v)=>{let s=(UI[S.lang]&&UI[S.lang][k]!==undefined)?UI[S.lang][k]:UI.pt[k]; if(s===undefined) return k; if(v&&typeof s==='string') for(const x in v) s=s.split('{'+x+'}').join(v[x]); return s;};
const LOCALE=()=>({pt:'pt-BR',en:'en-US',es:'es-ES'}[S.lang]);
const D=m=>MOD[m][S.lang]||MOD[m].pt;            /* conteúdo do módulo no idioma atual */
const C=()=>CORE[S.lang]||CORE.pt;                /* mapa global */
const TR=()=>TRAILS[S.lang]||TRAILS.pt;
function applyLang(){ if(!UI[S.lang]) S.lang='pt'; document.documentElement.lang={pt:'pt-BR',en:'en',es:'es'}[S.lang]; }

/* ===== UTILITÁRIOS ===== */
const today=()=>new Date().toISOString().slice(0,10);
const addDays=(d,n)=>{const x=new Date(d+'T12:00:00Z');x.setUTCDate(x.getUTCDate()+n);return x.toISOString().slice(0,10);};
function touch(){const d=today(); if(!S.days.includes(d)) S.days.push(d);}
function gain(n,msg){S.xp+=n; touch(); save(); renderRail(); toast(`+${n} XP · ${t(msg)}`);}
function toast(m){const el=document.getElementById('toast'); el.textContent=m; el.classList.add('show'); clearTimeout(el._h); el._h=setTimeout(()=>el.classList.remove('show'),1800);}
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const LOCK='<svg class="lock" width="12" height="12" viewBox="0 0 16 16" aria-hidden="true"><rect x="3" y="7" width="10" height="7" rx="1.5" fill="currentColor"/><path d="M5 7V5a3 3 0 0 1 6 0v2" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>';
const catName=c=>c.open?D(c.k).short:c.name[S.lang];
const catDesc=c=>c.open?D(c.k).lead:c.desc[S.lang];

const LEVELS=[0,200,600,1500];
function level(){let i=0; LEVELS.forEach((l,k)=>{if(S.xp>=l) i=k;}); const names=t('lv'), nx=LEVELS[i+1]; return {name:names[i], pct:nx!==undefined?Math.round((S.xp-LEVELS[i])/(nx-LEVELS[i])*100):100, next:nx!==undefined?names[i+1]:null, need:nx!==undefined?nx-S.xp:0};}
function streak(){let n=0, d=today(); if(!S.days.includes(d)) d=addDays(d,-1); while(S.days.includes(d)){n++; d=addDays(d,-1);} return n;}
const INTERVALS=[0,1,3,7,14];
const allCards=()=>OPEN_MODS.flatMap(m=>D(m).CARDS.map(c=>({...c,_m:m})));
function cardState(id){return S.cards[id]||{box:0,due:today()};}
function dueCards(){return allCards().filter(c=>cardState(c.id).due<=today());}
const chKey=(m,id)=>m+':'+id;
const chDone=(m,id)=>!!(S.ch[chKey(m,id)]||{}).done;
const modDone=m=>D(m).CHAPTERS.filter(c=>chDone(m,c.id)).length;
const modPct=m=>Math.round(modDone(m)/D(m).CHAPTERS.length*100);

/* ===== TRILHO ===== */
const NAV=[['painel','00'],['trilhas','01'],['mapa','02'],['modulos','03'],['revisao','04'],['desafio','05'],['glossario','06'],['novidades','07'],['guia','08']];
function renderRail(){
  document.getElementById('brandLogo').innerHTML=LOGO(34); document.getElementById('footLogo').innerHTML=LOGO(22);
  document.getElementById('tagline').textContent=t('tagline');
  document.getElementById('nav').innerHTML=NAV.map(([k,n])=>`<a href="#${k}"><span class="k">${n}</span>${t('nav_'+k)}${k==='novidades'&&S.seenVer!==CURRENT_VER?'<span class="dot" aria-label="'+t('n_new')+'"></span>':''}</a>`).join('');
  markNav();
  const L2=level(); document.getElementById('lvlName').textContent=L2.name;
  document.getElementById('xpTxt').textContent=S.xp+' XP';
  document.getElementById('xpBar').style.width=L2.pct+'%';
  const r=document.documentElement; if(S.theme==='system') r.removeAttribute('data-theme'); else r.setAttribute('data-theme',S.theme);
  document.getElementById('themeBtn').textContent=t('theme')+': '+t('th_'+S.theme);
  document.getElementById('langLbl').textContent=t('lang');
  document.querySelectorAll('[data-lang]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.lang===S.lang));
  document.getElementById('creditsLbl').textContent=t('credits');
  document.getElementById('verLbl').textContent=t('version')+' '+CURRENT_VER;
}
function markNav(){let v=curView(); if(OPEN_MODS.includes(v)) v='modulos'; document.querySelectorAll('.nav a').forEach(a=>a.setAttribute('aria-current',a.getAttribute('href')==='#'+v?'page':'false'));}
document.getElementById('themeBtn').onclick=()=>{S.theme={system:'light',light:'dark',dark:'system'}[S.theme]; save(); renderRail();};
document.querySelectorAll('[data-lang]').forEach(b=>b.onclick=()=>{S.lang=b.dataset.lang; save(); applyLang(); renderRail(); render(false);});

/* ===== VIEWS ===== */
const M=()=>document.getElementById('main');
const V={};
function banner(){ if(S.seenVer===CURRENT_VER) return ''; const c=CHANGES[0];
  return `<div class="banner" role="status"><div class="row" style="justify-content:space-between;align-items:flex-start;gap:12px"><div style="min-width:0"><span class="chip on">${t('n_new')} · v${c.v}</span><h3 style="margin-top:6px">${t('n_banner',{v:c.v})}</h3><ul>${c.items[S.lang].map(x=>`<li>${x}</li>`).join('')}</ul></div>
  <div class="row"><a class="btn ghost" href="#novidades">${t('n_see')}</a><button class="btn" type="button" id="bnOk">${t('n_ok')}</button></div></div></div>`;}
function wireBanner(){const b=document.getElementById('bnOk'); if(b) b.onclick=()=>{S.seenVer=CURRENT_VER; save(); renderRail(); render(false);};}

V.painel=()=>{
  const L2=level(), due=dueCards().length, m=S.curMod, md=D(m), nextI=md.CHAPTERS.findIndex(c=>!chDone(m,c.id)), next=nextI>=0?md.CHAPTERS[nextI]:null;
  const wk=[...Array(7)].map((_,i)=>addDays(today(),i-6)), dn=t('weekdays');
  const reviewed=allCards().some(c=>(S.cards[c.id]||{}).last===today());
  const code=CATALOG.core.find(c=>c.k===m).code;
  M().innerHTML=`<div class="view">${banner()}
  <div class="head"><span class="eyebrow">${new Date().toLocaleDateString(LOCALE(),{weekday:'long',day:'numeric',month:'long'})}</span>
  <h1>${t('p_title')}</h1><p>${t('p_lead')}</p></div>
  <div class="session">
    <div class="step ${reviewed||!due?'done':''}"><span class="n">1 · 5 min</span><h3>${t('p_s1')}</h3><p class="muted">${due?t('p_s1_due',{n:due}):t('p_s1_none')}</p><div><a class="btn ${due?'':'ghost'}" href="#revisao">${due?t('p_review'):t('p_see_cards')}</a></div></div>
    <div class="step ${next?'':'done'}"><span class="n">2 · 10 min</span><h3>${next?t('p_ch',{m:code,n:nextI+1,t:next.t}):t('p_sd_done',{m:code})}</h3><p class="muted">${next?t('p_s2_next'):t('p_s2_done')}</p><div><a class="btn" href="#${m}" id="goMod">${next?t('p_continue'):t('p_review_mod')}</a></div></div>
    <div class="step ${S.chal[m]!==undefined?'done':''}"><span class="n">3 · 5 min</span><h3>${t('p_s3')}</h3><p class="muted">${S.chal[m]!==undefined?t('p_s3_done'):t('p_s3_todo')}</p><div><a class="btn ghost" href="#desafio">${t('p_open_ch')}</a></div></div>
  </div>
  <div class="grid g3">
    <div class="panel"><span class="eyebrow">${t('p_streak')}</span><div class="stat">${streak()}<small>${t('days')}</small></div><div class="week">${wk.map(d=>`<div><i class="${S.days.includes(d)?'on':''}"></i>${dn[new Date(d+'T12:00:00Z').getUTCDay()]}</div>`).join('')}</div></div>
    <div class="panel"><span class="eyebrow">${t('p_level')}</span><div class="stat">${L2.name}</div><div class="bar xp"><i style="width:${L2.pct}%"></i></div><p class="muted">${L2.next?t('p_to_next',{n:L2.need,l:L2.next}):t('p_max')}</p></div>
    <div class="panel"><span class="eyebrow">${t('p_cards')}</span><div class="stat">${due}<small>${t('p_for_today')}</small></div><div class="boxes">${[0,1,2,3,4].map(b=>`<span>${b+1}: ${allCards().filter(c=>cardState(c.id).box===b).length}</span>`).join('')}</div><p class="muted">${t('p_box_hint')}</p></div>
  </div>
  <div class="panel"><div class="row" style="justify-content:space-between"><h2>${t('p_mods')}</h2><a href="#modulos">${t('see_all')}</a></div>
  ${OPEN_MODS.map(k=>{const p=modPct(k);return `<a class="modrow ${k===m?'cur':''}" href="#${k}"><span class="mono">${CATALOG.core.find(c=>c.k===k).code}</span><span class="nm">${D(k).short}</span><div class="bar"><i style="width:${p}%"></i></div><span class="mono muted">${modDone(k)}/${D(k).CHAPTERS.length}</span></a>`}).join('')}
  </div></div>`;
};

V.trilhas=()=>{
  const tr=TR();
  M().innerHTML=`<div class="view">${banner()}<div class="head"><span class="eyebrow">${t('tr_eyebrow',{n:tr.reduce((a,x)=>a+x.mods.length,0)})}</span><h1>${t('tr_title')}</h1><p>${t('tr_lead')}</p></div>
  ${tr.map(x=>`<div class="panel trail"><span class="num">${x.n}</span><div style="display:flex;flex-direction:column;gap:8px;min-width:0"><h2>${x.t}</h2><p class="muted">${x.d}</p>
  <div class="mods">${x.mods.map(md=>(x.live||[]).includes(md)?`<a href="#${md.toLowerCase()}">${md} · ${t('open')}</a>`:`<span>${x.n==='2'?LOCK+' ':''}${md}</span>`).join('')}</div></div></div>`).join('')}</div>`;
};

let mapSel='SD';
V.mapa=()=>{
  const NODES=C().NODES, EDGES=C().EDGES, W=120,H=52, lab=k=>NODES[k].label||k;
  const curve=(a,b)=>{const A=NODES[a],B=NODES[b],dx=B.x-A.x,dy=B.y-A.y,len=Math.hypot(dx,dy),k=len>200?0.22:0.08;return `M${A.x} ${A.y}Q${(A.x+B.x)/2-dy*k} ${(A.y+B.y)/2+dx*k} ${B.x} ${B.y}`;};
  const edges=EDGES.map(([a,b],i)=>`<path class="edge" data-i="${i}" d="${curve(a,b)}"/>`).join('');
  const nodes=Object.entries(NODES).map(([k,n])=>`<g class="node" data-k="${k}" tabindex="0" role="button" aria-label="${lab(k)}"><rect x="${n.x-W/2}" y="${n.y-H/2}" width="${W}" height="${H}" rx="8"/><text x="${n.x}" y="${n.y-2}" text-anchor="middle">${lab(k)}</text><text class="sub" x="${n.x}" y="${n.y+15}" text-anchor="middle">${n.sub}</text></g>`).join('');
  M().innerHTML=`<div class="view">${banner()}<div class="head"><span class="eyebrow">${t('m_eyebrow',{a:Object.keys(NODES).length,b:EDGES.length})}</span><h1>${t('m_title')}</h1><p>${t('m_lead')}</p></div>
  <div class="mapwrap"><div class="svgbox"><svg viewBox="0 0 790 400" role="img" aria-label="${t('m_title')}">${edges}${nodes}</svg></div>
  <div class="panel"><h3 id="mapTitle"></h3><div id="mapOpen"></div><div class="links" id="mapLinks"></div></div></div></div>`;
  const pick=k=>{mapSel=k; const rel=EDGES.map((e,i)=>[e,i]).filter(([e])=>e[0]===k||e[1]===k);
    const near=new Set([k,...rel.flatMap(([e])=>[e[0],e[1]])]);
    document.querySelectorAll('.node').forEach(g=>{g.classList.toggle('sel',g.dataset.k===k); g.classList.toggle('dim',!near.has(g.dataset.k));});
    document.querySelectorAll('.edge').forEach(l=>{const hot=rel.some(([,i])=>i==l.dataset.i); l.classList.toggle('hot',hot); l.classList.toggle('dim',!hot);});
    document.getElementById('mapTitle').textContent=`${lab(k)} · ${rel.length} ${t('m_links')}`;
    const lk=k.toLowerCase(); document.getElementById('mapOpen').innerHTML=OPEN_MODS.includes(lk)?`<a class="btn ghost" href="#${lk}">${t('m_open')} →</a>`:'';
    document.getElementById('mapLinks').innerHTML=rel.map(([e])=>`<div class="link"><b>${lab(e[0])} ↔ ${lab(e[1])}</b><span>${esc(e[2])}</span></div>`).join('');
  };
  document.querySelectorAll('.node').forEach(g=>{g.onclick=()=>pick(g.dataset.k); g.onkeydown=ev=>{if(ev.key==='Enter'||ev.key===' '){ev.preventDefault();pick(g.dataset.k);}};});
  pick(mapSel);
};

/* ----- Seletor de módulos ----- */
V.modulos=()=>{
  const card=c=>c.open
   ?`<a class="modcard" href="#${c.k}"><div class="row" style="justify-content:space-between"><span class="code">${c.code}</span><span class="chip on">${t('ch_progress',{a:modDone(c.k),b:D(c.k).CHAPTERS.length})}</span></div><b>${catName(c)}</b><p class="muted">${catDesc(c)}</p><div class="bar"><i style="width:${modPct(c.k)}%"></i></div></a>`
   :`<div class="modcard locked" aria-disabled="true"><div class="row" style="justify-content:space-between"><span class="code">${c.code}</span><span class="chip">${LOCK} ${t('soon')}</span></div><b>${catName(c)}</b><p class="muted">${catDesc(c)}</p></div>`;
  const openN=CATALOG.core.filter(c=>c.open).length, lockN=CATALOG.core.length-openN+CATALOG.other.length;
  M().innerHTML=`<div class="view">${banner()}<div class="head"><span class="eyebrow">${t('mods_eyebrow',{a:openN,b:lockN})}</span><h1>${t('mods_title')}</h1><p>${t('mods_lead')}</p></div>
  <h2>${t('mods_core')}</h2><div class="modgrid">${CATALOG.core.map(card).join('')}</div>
  <h2>${t('mods_other')}</h2><div class="modgrid small">${CATALOG.other.map(card).join('')}</div></div>`;
};

/* ----- Página do módulo: Estudo, Revisão, Integrações ----- */
let sdMode='estudo', chIdx=null, themeSel=null, integSel=null, flowKey=null, flowStep=0, orderPicked=[], lastMod=null;
const chState=(m,id)=>S.ch[chKey(m,id)]||(S.ch[chKey(m,id)]={done:false,act:{},note:''});
const tqScore=(m,th)=>{const a=S.tq[m+':'+th.id]||{}; return th.qs.filter((q,i)=>a[i]===q.a).length;};
const tqAnswered=(m,th)=>Object.keys(S.tq[m+':'+th.id]||{}).length;
function shuffled(arr,seed){const a=arr.map((x,i)=>i); let s=seed; for(let i=a.length-1;i>0;i--){s=(s*9301+49297)%233280; const j=Math.floor(s/233280*(i+1)); [a[i],a[j]]=[a[j],a[i]];} const n=a.length, fixed=a.filter((x,i)=>x===i).length; let r=(n>2&&fixed>1)?a.map((_,i)=>a[(i+2)%n]):a; if(r.every((x,i)=>x===i)) r=r.reverse(); if(n>1&&r[0]===0) r.push(r.shift()); return r;}

function flowWidget(m){const F=D(m).FLOWS, fk=F[flowKey]?flowKey:Object.keys(F)[0], st=F[fk].steps[Math.min(flowStep,F[fk].steps.length-1)];
 return `<div class="widget"><div class="scen" role="group">${Object.entries(F).map(([k,f])=>`<button type="button" data-flow="${k}" aria-pressed="${k===fk}">${f.name}</button>`).join('')}</div>
 <p class="muted">${F[fk].note} ${t('flow_click')}</p>
 <div class="flow">${F[fk].steps.map((s,i)=>`${i?'<span class="arrow">→</span>':''}<button type="button" class="doc" data-step="${i}" aria-pressed="${s===st}"><span class="t">${s.t}</span><b>${s.b}</b><span class="m">${s.m}</span></button>`).join('')}</div>
 <div class="detail"><div class="panel"><span class="eyebrow">${t('f_ctrl')}</span><p>${st.ctrl}</p></div><div class="panel"><span class="eyebrow">${t('f_integ')}</span><p>${st.integ}</p></div><div class="panel"><span class="eyebrow">${t('f_effect')}</span><p>${st.effect}</p></div><div class="panel hl"><span class="eyebrow">${t('f_arch')}</span><p>${st.arch}</p></div></div></div>`;}
function orderWidget(m){const O=D(m).ORDER, idx=shuffled(O,m.charCodeAt(0)*31+m.charCodeAt(1));
 return `<div class="panel"><h3>${t('og_title2',{m:D(m).short})}</h3><p class="muted">${t('og_lead')}</p>
 <div class="order">${idx.map(ix=>{const p=orderPicked.indexOf(ix);return `<button type="button" data-ord="${ix}" class="${p>=0?'picked':''}"><span class="pos">${p>=0?p+1:'·'}</span>${O[ix]}</button>`}).join('')}</div>
 <div id="ordMsg"></div><div><button class="btn ghost" type="button" id="ordReset">${t('restart')}</button></div></div>`;}
const hsh=str=>{let h=7; for(const ch of str) h=(h*31+ch.charCodeAt(0))%233280; return h;};
/* opções exibidas em ordem embaralhada fixa por pergunta; o índice salvo continua o original */
function qBlock(q,ans,attr){const ord=shuffled(q.o,hsh(q.q)); return `<div class="q"><h3>${q.q}</h3><div class="opts">${ord.map(j=>[q.o[j],j]).map(([o,j])=>`<button type="button" class="opt ${ans!==undefined?(j===q.a?'right':(j===ans?'wrong':'')):''}" ${attr}="${j}" ${ans!==undefined?'disabled':''}>${o}</button>`).join('')}</div>${ans!==undefined?`<div class="why"><b>${ans===q.a?t('right'):t('notquite')}</b> ${q.w}</div>`:''}</div>`;}
function termsBox(m,id){const ks=(D(m).TERMS||{})[id]||[]; const rows=ks.map(k=>GLOSS.find(g=>g.k===k)).filter(Boolean); if(!rows.length) return '';
 return `<div class="terms"><span class="eyebrow">${t('terms_t')}</span><div class="tbl"><table><thead><tr><th>PT</th><th>EN</th><th>ES</th></tr></thead><tbody>${rows.map(g=>`<tr><td class="${S.lang==='pt'?'cur':''}">${g.pt}</td><td class="${S.lang==='en'?'cur':''}">${g.en}</td><td class="${S.lang==='es'?'cur':''}">${g.es}</td></tr>`).join('')}</tbody></table></div></div>`;}

const MOD_MODE={
estudo:m=>{
 const md=D(m);
 if(chIdx===null){const i=md.CHAPTERS.findIndex(c=>!chDone(m,c.id)); chIdx=i<0?0:i; flowKey=md.CHAPTERS[chIdx].flowKey||null;}
 const c=md.CHAPTERS[chIdx], st=chState(m,c.id), allAns=c.acts.every((_,i)=>st.act[i]!==undefined);
 return `<div class="study"><nav class="chlist">${md.CHAPTERS.map((x,i)=>{const d=chDone(m,x.id);return `<button type="button" data-ch="${i}" class="${i===chIdx?'cur':''} ${d?'ok':''}"><span class="cn">${d?'✓':i+1}</span><span>${x.t}</span></button>`}).join('')}</nav>
 <article class="chapter"><span class="eyebrow">${t('ch_of',{a:chIdx+1,b:md.CHAPTERS.length})}</span><h2>${c.t}</h2>
 <div class="guide"><span class="eyebrow">${t('guide')}</span><p>${c.guide}</p></div>
 <div class="prose">${c.body}</div>
 ${c.widget==='flow'?flowWidget(m):''}${c.order?orderWidget(m):''}
 <div class="callout arch"><b>${t('arch')}</b> ${c.arch}</div>
 ${termsBox(m,c.id)}
 <section class="acts"><div class="row" style="justify-content:space-between"><h3>${t('acts')}</h3><span class="chip ${st.done?'good':''}">${st.done?t('done'):Object.keys(st.act).length+'/'+c.acts.length+' '+t('answered')}</span></div>
 ${c.acts.map((q,i)=>qBlock(q,st.act[i],`data-act="${i}" data-o`)).join('')}
 <div class="q"><h3>${t('reflect_t')}</h3><p class="muted">${c.reflect}</p><textarea id="note-${m}-${c.id}" rows="4" placeholder="${t('reflect_ph')}">${esc(st.note)}</textarea></div>
 <div class="row">${st.done?`<span class="chip good">${t('ch_done')}</span>`:`<button class="btn" type="button" id="chDone" ${allAns?'':'disabled'}>${t('ch_finish')}</button>${allAns?'':`<span class="muted">${t('ch_need')}</span>`}`}
 ${chIdx<md.CHAPTERS.length-1?`<button class="btn ghost" type="button" id="chNext">${t('next')}: ${md.CHAPTERS[chIdx+1].t} →</button>`:`<button class="btn ghost" type="button" id="toRev">${t('to_rev')}</button>`}</div></section>
 <p class="muted small">${t('sources')}: ${(SOURCES[m]||[]).map(s=>`<a href="${s[1]}" target="_blank" rel="noopener">${s[0]}</a>`).join(' · ')}</p>
 </article></div>`;},
revisao:m=>{
 const TH=D(m).THEMES;
 if(themeSel===null) return `<p class="muted">${t('rv_lead')}</p>
 <div class="themes">${TH.map(th=>{const sc=tqScore(m,th),an=tqAnswered(m,th);return `<button type="button" class="theme" data-th="${th.id}"><span class="eyebrow">${th.qs.length} ${t('questions')}</span><b>${th.t}</b><div class="bar"><i style="width:${an?sc/th.qs.length*100:0}%"></i></div><span class="muted">${an?`${sc}/${th.qs.length} ${t('correct')}`:t('not_started')}</span></button>`}).join('')}</div>
 <div class="panel row" style="justify-content:space-between"><span>${t('rv_cards_q')}</span><a class="btn ghost" href="#revisao">${t('rv_cards_btn')}</a></div>`;
 const th=TH.find(x=>x.id===themeSel), a=S.tq[m+':'+th.id]||{}, an=tqAnswered(m,th), ti=TH.indexOf(th);
 return `<div class="row"><button class="btn ghost" type="button" id="thBack">${t('themes_back')}</button><h2 style="flex:1">${th.t}</h2><span class="chip on">${tqScore(m,th)}/${th.qs.length}</span></div>
 ${th.qs.map((q,i)=>`<div class="panel"><span class="eyebrow">${t('q_of',{a:i+1,b:th.qs.length})}</span>${qBlock(q,a[i],`data-tq="${i}" data-o`)}</div>`).join('')}
 ${an===th.qs.length?`<div class="row"><button class="btn" type="button" id="thRedo">${t('redo')}</button>${ti<TH.length-1?`<button class="btn ghost" type="button" data-th="${TH[ti+1].id}">${t('next_theme')}: ${TH[ti+1].t} →</button>`:''}</div>`:''}`;},
integ:m=>{
 const IN=D(m).INTEG, code=CATALOG.core.find(c=>c.k===m).code;
 if(!IN.find(n=>n.k===integSel)) integSel=IN[0].k;
 const cx=360,cy=215,rx=270,ry=150,W=124,H=48;
 const pos=IN.map((n,i)=>{const ang=-Math.PI/2+i*2*Math.PI/IN.length;return {n,x:cx+rx*Math.cos(ang),y:cy+ry*Math.sin(ang)};});
 const sel=IN.find(n=>n.k===integSel);
 return `<p class="muted">${t('in_lead')}</p>
 <div class="mapwrap"><div class="svgbox"><svg viewBox="0 0 720 430" role="img" aria-label="${t('mode_integ')} ${code}">
 ${pos.map(p=>`<line class="edge ${p.n.k===integSel?'hot':''}" x1="${cx}" y1="${cy}" x2="${p.x}" y2="${p.y}"/>`).join('')}
 <g class="node sel"><rect x="${cx-74}" y="${cy-30}" width="148" height="60" rx="10"/><text x="${cx}" y="${cy-2}" text-anchor="middle">${code}</text><text class="sub" x="${cx}" y="${cy+16}" text-anchor="middle">${D(m).short}</text></g>
 ${pos.map(p=>`<g class="node ${p.n.k===integSel?'pick':''}" data-ik="${p.n.k}" tabindex="0" role="button" aria-label="${p.n.n}"><rect x="${p.x-W/2}" y="${p.y-H/2}" width="${W}" height="${H}" rx="8"/><text x="${p.x}" y="${p.y-2}" text-anchor="middle">${p.n.n}</text><text class="sub" x="${p.x}" y="${p.y+15}" text-anchor="middle">${p.n.sub}</text></g>`).join('')}
 </svg></div>
 <div class="panel"><span class="eyebrow">${sel.dir}</span><h3>${sel.n}</h3>
 <div><span class="eyebrow">${t('in_step')}</span><p>${sel.step}</p></div>
 <div><span class="eyebrow">${t('in_what')}</span><p>${sel.what}</p></div>
 <div class="callout arch"><b>${t('in_varies')}</b> ${sel.varies}</div></div></div>
 <div class="tbl"><table><thead><tr><th>${t('in_with')}</th><th>${t('in_dir')}</th><th>${t('in_step')}</th></tr></thead><tbody>${IN.map(n=>`<tr><td><button type="button" class="linkbtn" data-ik="${n.k}">${n.n}</button></td><td class="mono">${n.dir}</td><td>${n.step}</td></tr>`).join('')}</tbody></table></div>`;}
};

function modView(m){
 if(lastMod!==m){chIdx=null; themeSel=null; integSel=null; orderPicked=[]; flowStep=0; lastMod=m;}
 if(S.curMod!==m){S.curMod=m; save();}
 const md=D(m), tot=md.THEMES.reduce((a,x)=>a+x.qs.length,0), right=md.THEMES.reduce((a,x)=>a+tqScore(m,x),0);
 M().innerHTML=`<div class="view">${banner()}
 <div class="modswitch" role="tablist">${CATALOG.core.map(c=>c.open?`<a role="tab" href="#${c.k}" aria-selected="${c.k===m}">${c.code}</a>`:`<span class="lockd" title="${t('soon')}">${LOCK}${c.code}</span>`).join('')}<a class="more" href="#modulos">${t('see_all')} →</a></div>
 <div class="mod-head"><div class="head"><span class="eyebrow">${t('sd_eyebrow')}</span><h1>${md.name}</h1><p>${md.lead}</p></div>
 <div class="row"><span class="chip on">${modDone(m)}/${md.CHAPTERS.length} ${t('chapters')}</span><span class="chip xp">${right}/${tot} ${t('in_review')}</span></div></div>
 <div class="modes" role="tablist">${['estudo','revisao','integ'].map(k=>`<button role="tab" type="button" data-mode="${k}" aria-selected="${k===sdMode}"><b>${t('mode_'+k)}</b><span>${t('mode_'+k+'_s')}</span></button>`).join('')}</div>
 <div class="mode-body">${MOD_MODE[sdMode](m)}</div></div>`;
 wireMod(m);
}
OPEN_MODS.forEach(m=>{V[m]=()=>modView(m);});

function wireMod(m){
 const md=D(m);
 const R=(top)=>{const y=scrollY; modView(m); wireBanner(); scrollTo(0,top?0:y);};
 const $=s=>document.querySelectorAll(s);
 const setCh=i=>{chIdx=i; orderPicked=[]; flowKey=md.CHAPTERS[i].flowKey||null; flowStep=0;};
 $('[data-mode]').forEach(b=>b.onclick=()=>{sdMode=b.dataset.mode; R(true);});
 $('[data-ch]').forEach(b=>b.onclick=()=>{setCh(+b.dataset.ch); R(true);});
 const c=md.CHAPTERS[chIdx];
 $('[data-act]').forEach(b=>b.onclick=()=>{const st=chState(m,c.id),i=+b.dataset.act,j=+b.dataset.o; st.act[i]=j; save(); if(j===c.acts[i].a) gain(10,'t_act'); else touch(); R();});
 if(c){const ta=document.getElementById('note-'+m+'-'+c.id); if(ta) ta.oninput=()=>{chState(m,c.id).note=ta.value; save();};}
 const d=document.getElementById('chDone'); if(d) d.onclick=()=>{chState(m,c.id).done=true; gain(25,'t_ch'); R();};
 const n=document.getElementById('chNext'); if(n) n.onclick=()=>{setCh(chIdx+1); R(true);};
 const tr=document.getElementById('toRev'); if(tr) tr.onclick=()=>{sdMode='revisao'; themeSel=null; R(true);};
 $('[data-th]').forEach(b=>b.onclick=()=>{themeSel=b.dataset.th; R(true);});
 const tb=document.getElementById('thBack'); if(tb) tb.onclick=()=>{themeSel=null; R(true);};
 $('[data-tq]').forEach(b=>b.onclick=()=>{const th=md.THEMES.find(x=>x.id===themeSel),i=+b.dataset.tq,j=+b.dataset.o,key=m+':'+th.id; S.tq[key]=S.tq[key]||{}; S.tq[key][i]=j; const seen=key+':'+i, first=!S.tqSeen[seen]; S.tqSeen[seen]=true; save(); if(first&&j===th.qs[i].a) gain(10,'t_q'); else touch(); R();});
 const rd=document.getElementById('thRedo'); if(rd) rd.onclick=()=>{S.tq[m+':'+themeSel]={}; save(); R(true);};
 $('[data-ik]').forEach(g=>{const go=()=>{integSel=g.dataset.ik; R();}; g.onclick=go; g.onkeydown=ev=>{if(ev.key==='Enter'||ev.key===' '){ev.preventDefault();go();}};});
 $('[data-flow]').forEach(b=>b.onclick=()=>{flowKey=b.dataset.flow; flowStep=0; R();});
 $('[data-step]').forEach(b=>b.onclick=()=>{flowStep=+b.dataset.step; R();});
 $('[data-ord]').forEach(b=>b.onclick=()=>{const o=+b.dataset.ord; if(orderPicked.includes(o)) return; orderPicked.push(o);
  if(orderPicked.length===md.ORDER.length){const ok=orderPicked.every((ix,i)=>ix===i); R();
   document.getElementById('ordMsg').innerHTML=`<div class="why">${ok?t('right'):t('notquite')} ${md.ORDER.map((x,i)=>`${i+1}. ${x}`).join(' → ')}</div>`;
   if(ok&&!S.order[m]){S.order[m]=true; gain(15,'t_flow');}} else R();});
 const rs=document.getElementById('ordReset'); if(rs) rs.onclick=()=>{orderPicked=[]; R();};
}

/* ----- Revisão (Leitner) ----- */
let flipped=false, mixed=true;
V.revisao=()=>{
  const due=dueCards(), pool=mixed?due:due.filter(c=>c._m===S.curMod), c=pool[0], code=CATALOG.core.find(x=>x.k===S.curMod).code;
  M().innerHTML=`<div class="view">${banner()}<div class="head"><span class="eyebrow">${t('c_eyebrow',{n:due.length})}</span><h1>${t('c_title')}</h1><p>${t('c_lead')}</p></div>
  <div class="row"><span class="eyebrow">${t('mode')}</span><div class="scen"><button type="button" id="mxOn" aria-pressed="${mixed}">${t('c_mixed')}</button><button type="button" id="mxOff" aria-pressed="${!mixed}">${t('c_sd')} (${code})</button></div></div>
  ${c?`<div class="card"><span class="chip" style="align-self:center">${c.mod}</span><div class="front">${c.f}</div>${flipped?`<div class="back">${c.b}</div>`:`<p class="muted">${t('c_try')}</p>`}</div>
  <div class="row" style="justify-content:center">${flipped?`<button class="btn ghost" id="miss" type="button">${t('c_miss')}</button><button class="btn" id="hit" type="button">${t('c_hit')}</button>`:`<button class="btn" id="flip" type="button">${t('c_flip')}</button>`}</div>`
  :`<div class="panel" style="text-align:center;align-items:center;padding:40px"><h2>${t('c_empty')}</h2><p class="muted">${t('c_empty_l')}</p><a class="btn ghost" href="#${S.curMod}">${t('c_study')}</a></div>`}
  <div class="panel"><h3>${t('boxes')}</h3><div class="boxes">${[0,1,2,3,4].map(b=>`<span>${t('box')} ${b+1} · ${INTERVALS[b]}d<br><b class="mono">${allCards().filter(x=>cardState(x.id).box===b).length}</b></span>`).join('')}</div></div></div>`;
  document.getElementById('mxOn').onclick=()=>{mixed=true; flipped=false; render(false);};
  document.getElementById('mxOff').onclick=()=>{mixed=false; flipped=false; render(false);};
  if(!c) return;
  const f=document.getElementById('flip'); if(f) f.onclick=()=>{flipped=true; render(false);};
  const grade=ok=>{const st=cardState(c.id), box=ok?Math.min(st.box+1,4):0; S.cards[c.id]={box,due:addDays(today(),ok?INTERVALS[box]:1),last:today()}; flipped=false; gain(ok?3:1,ok?'t_card_hit':'t_card'); render(false);};
  const h=document.getElementById('hit'); if(h){h.onclick=()=>grade(true); document.getElementById('miss').onclick=()=>grade(false);}
};

/* ----- Desafio ----- */
V.desafio=()=>{
  const m=S.curMod, CH=D(m).CHALLENGE, ch=S.chal[m], best=Math.max(...CH.o.map(o=>o.s));
  M().innerHTML=`<div class="view">${banner()}<div class="head"><span class="eyebrow">${t('d_eyebrow')}</span><h1>${CH.title}</h1></div>
  <div class="row"><span class="eyebrow">${t('d_pick')}</span><div class="scen">${OPEN_MODS.map(k=>`<button type="button" data-dm="${k}" aria-pressed="${k===m}">${CATALOG.core.find(c=>c.k===k).code}${S.chal[k]!==undefined?' ✓':''}</button>`).join('')}</div></div>
  <div class="panel"><p>${CH.ctx}</p><h3>${CH.q}</h3>
  <div class="opts">${CH.o.map((o,i)=>`<button type="button" class="opt ${ch!==undefined?(o.s===best?'right':(i===ch?'wrong':'')):''}" data-chl="${i}" ${ch!==undefined?'disabled':''}>${o.t}</button>`).join('')}</div></div>
  ${ch!==undefined?`<div class="panel"><h3>${t('d_how')}</h3>${CH.o.map(o=>`<div class="row" style="align-items:flex-start;flex-wrap:nowrap"><span class="chip ${o.s===best?'good':''}" style="min-width:64px;justify-content:center">${'●'.repeat(o.s)}${'○'.repeat(3-o.s)}</span><p style="min-width:0"><b>${esc(o.t)}</b> ${o.w}</p></div>`).join('')}
  <div class="callout arch">${t('d_pattern')}</div><div><button class="btn ghost" type="button" id="chReset">${t('d_again')}</button></div></div>`:''}</div>`;
  document.querySelectorAll('[data-dm]').forEach(b=>b.onclick=()=>{S.curMod=b.dataset.dm; save(); render(false);});
  document.querySelectorAll('[data-chl]').forEach(b=>b.onclick=()=>{const i=+b.dataset.chl, first=S.chal[m]===undefined; S.chal[m]=i; save(); if(first) gain(CH.o[i].s===best?30:10,'t_ch_ans'); render(false);});
  const r=document.getElementById('chReset'); if(r) r.onclick=()=>{delete S.chal[m]; save(); render(false);};
};

/* ----- Glossário ----- */
let gq='', gmod='';
V.glossario=()=>{
  const norm=s=>s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'');
  const mods=[...new Set(GLOSS.map(g=>g.mod))];
  M().innerHTML=`<div class="view">${banner()}<div class="head"><span class="eyebrow">${t('g_eyebrow',{n:GLOSS.length})}</span><h1>${t('g_title')}</h1><p>${t('g_lead')}</p></div>
  <div class="row"><label class="sr" for="gSearch">${t('g_search')}</label><input id="gSearch" type="search" placeholder="${t('g_search')}" value="${esc(gq)}">
  <div class="scen" role="group" aria-label="${t('g_mod')}"><button type="button" data-gm="" aria-pressed="${gmod===''}">${t('g_all')}</button>${mods.map(x=>`<button type="button" data-gm="${x}" aria-pressed="${gmod===x}">${x}</button>`).join('')}</div></div>
  <div class="tbl"><table><thead><tr><th class="${S.lang==='pt'?'cur':''}">Português</th><th class="${S.lang==='en'?'cur':''}">English</th><th class="${S.lang==='es'?'cur':''}">Español</th><th>${t('g_mod')}</th></tr></thead><tbody id="gBody"></tbody></table></div>
  <p class="muted small">${t('g_note')}</p></div>`;
  const fill=()=>{const q=norm(gq); const rows=GLOSS.filter(g=>(!gmod||g.mod===gmod)&&(!q||norm(g.pt+' '+g.en+' '+g.es+' '+g.mod).includes(q)));
    document.getElementById('gBody').innerHTML=rows.length?rows.map(g=>`<tr><td class="${S.lang==='pt'?'cur':''}">${g.pt}</td><td class="${S.lang==='en'?'cur':''}">${g.en}</td><td class="${S.lang==='es'?'cur':''}">${g.es}</td><td class="mono muted">${g.mod}</td></tr>`).join(''):`<tr><td colspan="4" class="muted">${t('g_none')}</td></tr>`;};
  const inp=document.getElementById('gSearch'); inp.oninput=()=>{gq=inp.value; fill();}; fill();
  document.querySelectorAll('[data-gm]').forEach(b=>b.onclick=()=>{gmod=b.dataset.gm; render(false);});
};

/* ----- Novidades ----- */
V.novidades=()=>{
  const fmt=d=>new Date(d+'T12:00:00Z').toLocaleDateString(LOCALE(),{day:'numeric',month:'long',year:'numeric'});
  M().innerHTML=`<div class="view"><div class="head"><span class="eyebrow">${t('n_eyebrow')}</span><h1>${t('n_title')}</h1><p>${t('n_lead')}</p></div>
  <ol class="changes">${CHANGES.map((c,i)=>`<li class="${i===0&&S.seenVer!==CURRENT_VER?'fresh':''}"><div class="ver"><b>v${c.v}</b><span class="muted">${fmt(c.date)}</span>${i===0&&S.seenVer!==CURRENT_VER?`<span class="chip on">${t('n_new')}</span>`:''}</div><ul>${c.items[S.lang].map(x=>`<li>${x}</li>`).join('')}</ul></li>`).join('')}</ol></div>`;
  if(S.seenVer!==CURRENT_VER){S.seenVer=CURRENT_VER; save(); renderRail();}
};

/* ----- Como usar ----- */
V.guia=()=>{
  const th=t('u_th'), rows=t('u_rows');
  M().innerHTML=`<div class="view">${banner()}<div class="head"><span class="eyebrow">${t('u_eyebrow')}</span><h1>${t('u_title')}</h1><p>${t('u_lead')}</p></div>
  <div class="grid g2"><div class="panel"><h2>${t('u_daily')}</h2><ol class="routine"><li>${t('u_d1')}</li><li>${t('u_d2')}</li><li>${t('u_d3')}</li></ol></div>
  <div class="panel"><h2>${t('u_weekly')}</h2><ol class="routine"><li>${t('u_w1')}</li><li>${t('u_w2')}</li><li>${t('u_w3')}</li></ol></div></div>
  <div class="grid g2"><div class="panel"><h3>${t('u_lang')}</h3><p class="muted">${t('u_lang_t')}</p></div><div class="panel"><h3>${t('u_rel')}</h3><p class="muted">${t('u_rel_t')}</p></div></div>
  <div class="tbl"><table><thead><tr>${th.map(x=>`<th>${x}</th>`).join('')}</tr></thead><tbody>${rows.map(r=>`<tr>${r.map(x=>`<td>${x}</td>`).join('')}</tr>`).join('')}</tbody></table></div>
  <p class="muted">${t('sources')}: <a href="https://journals.sagepub.com/doi/10.1177/1529100612453266" target="_blank" rel="noopener">Dunlosky et al., Psychological Science in the Public Interest, 2013</a> · <a href="https://www.learningscientists.org/downloadable-materials" target="_blank" rel="noopener">The Learning Scientists</a>. ${t('u_src')}</p>
  <div class="panel"><h3>${t('u_local')}</h3><p class="muted">${t('u_local_t')}</p><div><button class="btn ghost" type="button" id="wipe">${t('u_wipe')}</button> <span id="wipeAsk"></span></div></div></div>`;
  document.getElementById('wipe').onclick=()=>{document.getElementById('wipeAsk').innerHTML=`${t('u_sure')} <button class="btn" type="button" id="wipeYes">${t('u_wipe_yes')}</button>`; document.getElementById('wipeYes').onclick=()=>{const keep={theme:S.theme,lang:S.lang,seenVer:S.seenVer}; S=Object.assign(blank(),keep); save(); renderRail(); toast(t('u_wiped')); render(false);};};
};

/* ===== ROTEAMENTO ===== */
const curView=()=>{const k=(location.hash||'#painel').slice(1); return V[k]?k:'painel';};
function render(top=true){ const v=curView(); markNav(); V[v](); wireBanner(); if(top) window.scrollTo(0,0); }
addEventListener('hashchange',()=>render(true));
applyLang(); renderRail(); render(true);
