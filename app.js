
const ADMIN_PW='icombthecrowdandpickyouout';
const INSTRS=['Drums','Bass','Electric guitar','Stand-up bass','Keyboards','Violin','Cello','Trumpet','Saxophone','Clarinet','Harp','Percussion','Female vocals'];
const LIVE_PKGS=[
  {id:'cer',label:'Ceremony — live music only',price:'$500–$600',pn:'depending on travel',incl:['Live music performance (not recorded)','Wireless mic for officiant','1 custom song request'],sq:false},
  {id:'cock',label:'Cocktail hour only',price:'$800',pn:'',incl:['Live ambient music during cocktail hour'],sq:false},
  {id:'cer-cock',label:'Ceremony + cocktail hour',price:'$800–$1,000',pn:'depending on setup',incl:['Live music performance (not recorded)','Wireless mic for officiant','1 custom song request','Live cocktail hour coverage'],sq:true},
  {id:'cer-cock-din',label:'Ceremony + cocktail hour + dinner music',price:'$1,600',pn:'ideal for intimate weddings',incl:['Live music performance (not recorded)','Wireless mic for officiant','1 custom song request','Live cocktail hour coverage','Background dinner music'],sq:true},
];
const DJ_PKGS=[
  {id:'dj-rec',label:'DJ / emcee — reception only',price:'$2,500',pn:'',incl:['Full DJ reception coverage','MC duties and announcements','Professional sound system'],sq:false},
  {id:'dj-full',label:'DJ / emcee — full day',price:'$3,000',pn:'',incl:['Full-day DJ and emcee coverage','MC duties and announcements','Professional sound system'],sq:false},
  {id:'dj-cer',label:'DJ / emcee + ceremony live music',price:'$3,000',pn:'live music included at no extra cost',incl:['Live music performance (not recorded)','Wireless mic for officiant','1 custom song request','Full DJ and emcee coverage'],sq:false},
  {id:'full',label:'Full package — ceremony, cocktail hour + DJ / emcee',price:'$3,500+',pn:'additional equipment needs may apply',incl:['Live music performance (not recorded)','Wireless mic for officiant','1 custom song request','Live cocktail hour coverage','Full DJ and emcee reception coverage'],sq:true},
];

let ST={name:'',email:'',phone:'',cats:[],pkg:null,bandInstrs:[],setup:1,venue:'',zone:'',date:''};
let blocked=[];
let prevNS=1;
let isBand=false;
let skipSetup=false;

function prog(n){document.getElementById('prog').style.width=Math.round((n/5)*100)+'%';}
function show(id){
  document.querySelectorAll('.step').forEach(s=>s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  const mp={'s0':0,'s1':1,'s2':2,'s2b':2,'s3':3,'s4':4,'s5':5};
  if(mp[id]!==undefined)prog(mp[id]);
}
function herr(id){const e=document.getElementById(id);if(e)e.style.display='none';}
function serr(id,m){const e=document.getElementById(id);if(e){e.style.display='block';if(m)e.textContent=m;}}
function ns(from){prevNS=from;show('s-ns');}
function backNS(){show(typeof prevNS==='number'?'s'+prevNS:'s'+prevNS);}
function selCat(el){el.closest('.cat-card').classList.toggle('sel',el.checked);}
function selR(el){document.querySelectorAll(`input[name="${el.name}"]`).forEach(r=>r.closest('.opt').classList.toggle('sel',r.checked));}

function buildInstrs(){
  const g=document.getElementById('instr-grid');g.innerHTML='';
  INSTRS.forEach(inst=>{
    const l=document.createElement('label');l.className='ichip';
    l.innerHTML=`<input type="checkbox" name="instr" value="${inst}" onchange="togInstr(this)"><span class="ichip-label">${inst}</span>`;
    g.appendChild(l);
  });
}
function togInstr(el){el.closest('.ichip').classList.toggle('sel',el.checked);updBand();}
function getSel(){return[...document.querySelectorAll('input[name="instr"]:checked')].map(x=>x.value);}
function updBand(){
  const sel=getSel();const tot=sel.length+1;
  const el=document.getElementById('band-sum');
  if(!sel.length){el.textContent='';return;}
  const est=tot*600+tot*150+tot*50;
  el.textContent=`${tot} musicians (including Conner) — starting from $${est.toLocaleString()}`;
}
function buildPkgs(cats){
  const w=document.getElementById('pkg-opts');w.innerHTML='';
  const hasLive=cats.includes('live');const hasDJ=cats.includes('dj');const hasBand=cats.includes('band');
  let pkgs=[];
  if((hasLive||hasBand)&&!hasDJ)pkgs=LIVE_PKGS;
  else if(hasDJ&&!hasLive&&!hasBand)pkgs=DJ_PKGS;
  else pkgs=[...LIVE_PKGS,...DJ_PKGS];
  pkgs.forEach(p=>{
    const l=document.createElement('label');l.className='opt';
    l.innerHTML=`<input type="radio" name="pkg" value="${p.id}" onchange="selR(this)"><div><div class="opt-title">${p.label}</div>${p.pn?`<div class="opt-sub">${p.pn}</div>`:''}<div class="opt-price">${p.price}</div></div>`;
    w.appendChild(l);
  });
}
function go0(){
  herr('e0');
  const n=document.getElementById('f-name').value.trim();
  const e=document.getElementById('f-email').value.trim();
  const p=document.getElementById('f-phone').value.trim();
  if(!n||!e||!e.includes('@')||!p){serr('e0');return;}
  ST.name=n;ST.email=e;ST.phone=p;show('s1');
}
function go1(){
  herr('e1');
  const cats=[...document.querySelectorAll('input[name="cat"]:checked')].map(x=>x.value);
  if(!cats.length){serr('e1');return;}
  ST.cats=cats;
  isBand=cats.includes('band')&&cats.length===1;
  if(isBand){show('s2b');return;}
  buildPkgs(cats);show('s2');
}
function go2(){
  herr('e2');
  const r=document.querySelector('input[name="pkg"]:checked');
  if(!r){serr('e2');return;}
  const all=[...LIVE_PKGS,...DJ_PKGS];
  ST.pkg=all.find(p=>p.id===r.value);
  skipSetup=!ST.pkg.sq;
  if(skipSetup)show('s4');else show('s3');
}
function go2b(){
  herr('e2b');
  const sel=getSel();
  if(!sel.length){serr('e2b');return;}
  ST.bandInstrs=sel;ST.pkg=null;show('s4');
}
function back4(){
  if(isBand)show('s2b');
  else if(skipSetup)show('s2');
  else show('s3');
}
function go3(){
  herr('e3');
  const r=document.querySelector('input[name="setup"]:checked');
  if(!r){serr('e3');return;}
  ST.setup=parseInt(r.value);show('s4');
}
async function go4(){
  herr('e4');
  const v=document.getElementById('f-venue').value.trim();
  if(!v){serr('e4');return;}
  ST.venue=v;
  document.getElementById('load4').style.display='block';
  document.getElementById('btn4').disabled=true;
  try{
    const prompt=`Estimate driving time from Highland Park, Los Angeles CA 90042 to: "${v}". JSON only, no markdown: {"minutes":<number>,"zone":"<under30|under60|under120|over120>"}`;
    const r=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:80,messages:[{role:"user",content:prompt}]})});
    const d=await r.json();
    const res=JSON.parse(d.content.map(c=>c.text||'').join('').replace(/```json|```/g,'').trim());
    ST.zone=res.zone;
  }catch(e){ST.zone='under60';}
  document.getElementById('load4').style.display='none';
  document.getElementById('btn4').disabled=false;
  show('s5');
}
function chkDate(){
  const d=document.getElementById('f-date').value;
  const bann=document.getElementById('unavail');const btn=document.getElementById('btn5');
  if(blocked.includes(d)){bann.style.display='block';btn.disabled=true;}
  else{bann.style.display='none';btn.disabled=false;}
}
function go5(){
  herr('e5');
  const d=document.getElementById('f-date').value;
  if(!d){serr('e5');return;}
  if(blocked.includes(d))return;
  ST.date=d;buildQuote();show('s-quote');
  submitToGoogleForm();
}
function submitToGoogleForm(){
  const FORM_ID='1FAIpQLSe9X-RsA7NKxA8GCjmlcr85i-RlQSEr0fOHgzSAjAdhlgN_9A';
  const svc=isBand?`Live band (${ST.bandInstrs.length+1} musicians: Conner, ${ST.bandInstrs.join(', ')})`:(ST.pkg?ST.pkg.label:'N/A');
  const setupLabel=ST.pkg&&ST.pkg.sq?(ST.setup===1?'Same location (1 setup)':'Different locations (2 setups)'):'N/A';
  const zoneLabels={under30:'Local (under 30 min)',under60:'Nearby (30-60 min)',under120:'Regional (1-2 hrs)',over120:'Long-distance (2+ hrs)'};
  const params=new URLSearchParams({
    'entry.1503499766': ST.email,
    'entry.1810494856': ST.name,
    'entry.1554710627': ST.phone,
    'entry.147289212':  ST.date,
    'entry.1810531719': ST.venue,
    'entry.552911332':  svc,
    'entry.687933710':  ST.bandInstrs.length?ST.bandInstrs.join(', '):'N/A',
    'entry.715197167':  zoneLabels[ST.zone]||ST.zone||'Unknown',
    'entry.1443677138': setupLabel,
  });
  const url=`https://docs.google.com/forms/d/e/${FORM_ID}/formResponse`;
  fetch(url,{method:'POST',mode:'no-cors',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:params.toString()}).catch(()=>{});
}
function getPrice(){
  const p=ST.pkg;const z=ST.zone;const over=(z==='over120');
  if(isBand||!p){
    const tot=ST.bandInstrs.length+1;
    const tv=over?tot*150:tot*50;
    return'Starting from $'+(tot*600+tot*150+tv).toLocaleString();
  }
  if(p.id==='cer')return over?'$600 + travel':'$500–$600';
  if(p.id==='cer-cock'){return ST.setup===2?(over?'$1,000–$1,100':'$1,000'):(over?'$800–$900':'$800');}
  if(p.id==='full')return over?'$3,500+ (travel TBD)':'$3,500+';
  return over&&!['dj-full','dj-rec'].includes(p.id)?p.price+' + travel':p.price;
}
function buildQuote(){
  const fn=ST.name.split(' ')[0];
  document.getElementById('q-greet').textContent=`Here's what I'd typically quote for your day, ${fn}.`;
  const zl={under30:'Local (under 30 min)',under60:'Nearby (30–60 min)',under120:'Regional (1–2 hrs)',over120:'Long-distance (2+ hrs)'};
  document.getElementById('zpill').innerHTML=ST.zone?`<div class="zpill">${zl[ST.zone]||''}</div>`:'';
  document.getElementById('q-price').textContent=getPrice();
  let lbl='';let incl=[];let note='';
  if(isBand||(!ST.pkg&&ST.bandInstrs.length)){
    const tot=ST.bandInstrs.length+1;
    lbl=`Live band — ${tot} musicians`;
    incl=['Conner as band leader (acoustic guitar / vocals)',...ST.bandInstrs.map(i=>i+' player'),'2 rehearsals included','Travel and logistics coordination'];
    note=`Band pricing is a starting estimate: ${tot} musicians × $600 performance + $150 rehearsal + travel. Final quote confirmed after a quick conversation.`;
  }else if(ST.pkg){
    lbl=ST.pkg.label;
    if(ST.pkg.sq&&ST.pkg.id!=='full')lbl+=ST.setup===1?' · same location (1 setup)':' · separate locations (2 setups)';
    incl=ST.pkg.incl;
    if(ST.pkg.id==='full')note='Additional equipment needs (lighting, lapel mics) may affect final pricing — we\'ll confirm together.';
  }
  if(ST.date){const d=new Date(ST.date+'T12:00:00');lbl+=' · '+d.toLocaleDateString('en-US',{month:'long',day:'numeric',year:'numeric'});}
  document.getElementById('q-pkg').textContent=lbl;
  document.getElementById('q-incl').innerHTML=incl.map(i=>`<div class="iitem"><div class="idot"></div><div>${i}</div></div>`).join('');
  document.getElementById('q-note').innerHTML=note?`<p class="qnote" style="margin-top:12px;">${note}</p>`:'';
}
function contact(){
  const svc=isBand?`Live band (${ST.bandInstrs.length+1} musicians: Conner, ${ST.bandInstrs.join(', ')})`:(ST.pkg?ST.pkg.label:'');
  const d=ST.date?new Date(ST.date+'T12:00:00').toLocaleDateString('en-US',{month:'long',day:'numeric',year:'numeric'}):'TBD';
  const sub=encodeURIComponent('Wedding music inquiry');
  const body=encodeURIComponent(`Hi Conner,\n\nMy name is ${ST.name} and I'm interested in booking you for my wedding on ${d}.\n\nVenue: ${ST.venue}\nPackage: ${svc}\nPhone: ${ST.phone}\n\nLooking forward to hearing from you!`);
  window.open(`mailto:info@connercherland.com?subject=${sub}&body=${body}`);
}
function startOver(){
  ST={name:'',email:'',phone:'',cats:[],pkg:null,bandInstrs:[],setup:1,venue:'',zone:'',date:''};
  isBand=false;skipSetup=false;
  document.querySelectorAll('input[type=radio],input[type=checkbox]').forEach(el=>el.checked=false);
  document.querySelectorAll('.opt,.cat-card,.ichip').forEach(el=>el.classList.remove('sel'));
  ['f-name','f-email','f-phone','f-venue','f-date'].forEach(id=>{const el=document.getElementById(id);if(el)el.value='';});
  document.getElementById('unavail').style.display='none';
  document.getElementById('btn5').disabled=false;
  document.getElementById('band-sum').textContent='';
  show('s0');
}
function togAdm(){const p=document.getElementById('adm-panel');p.style.display=p.style.display==='none'?'block':'none';}
function authAdm(){
  if(document.getElementById('adm-pw').value===ADMIN_PW){
    document.getElementById('adm-auth').style.display='none';
    document.getElementById('adm-inner').style.display='block';
    loadDates();
  }else{document.getElementById('e-pw').style.display='block';}
}
// Blocked dates use localStorage since this is a standalone HTML file
function loadDates(){
  try{const s=localStorage.getItem('blocked_dates');blocked=s?JSON.parse(s):[];}
  catch(e){blocked=[];}
  renderDates();
}
function saveDates(){try{localStorage.setItem('blocked_dates',JSON.stringify(blocked));}catch(e){}}
function renderDates(){
  const l=document.getElementById('dlist');
  if(!blocked.length){l.innerHTML='<div style="font-size:13px;color:#aaa;">No blocked dates yet.</div>';return;}
  l.innerHTML=blocked.map(d=>{
    const f=new Date(d+'T12:00:00').toLocaleDateString('en-US',{weekday:'short',month:'long',day:'numeric',year:'numeric'});
    return`<div class="ditem"><span>${f}</span><button class="ddel" onclick="remDate('${d}')">&times;</button></div>`;
  }).join('');
}
function addDate(){
  const d=document.getElementById('new-date').value;
  const e=document.getElementById('e-adm');e.style.display='none';
  if(!d){e.textContent='Please select a date.';e.style.display='block';return;}
  if(blocked.includes(d)){e.textContent='Already blocked.';e.style.display='block';return;}
  blocked.push(d);blocked.sort();saveDates();
  document.getElementById('new-date').value='';renderDates();
}
function remDate(d){
  blocked=blocked.filter(x=>x!==d);saveDates();renderDates();
}
buildInstrs();loadDates();
