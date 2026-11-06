/* ---------- Data ---------- */
const NEIGH = {
  "Bronx": ["Allerton","Baychester","Belmont","Bronxdale","Castle Hill","City Island","Claremont Village","Clason Point","Co-op City","Concourse","Concourse Village","East Morrisania","Eastchester","Edenwald","Fieldston","Fordham","Highbridge","Hunts Point","Kingsbridge","Longwood","Melrose","Morris Heights","Morris Park","Morrisania","Mott Haven","Mount Eden","Mount Hope","North Riverdale","Norwood","Olinville","Parkchester","Pelham Bay","Pelham Gardens","Port Morris","Riverdale","Schuylerville","Soundview","Spuyten Duyvil","Throgs Neck","Tremont","Unionport","University Heights","Van Nest","Wakefield","West Farms","Westchester Square","Williamsbridge","Woodlawn"],
  "Brooklyn": ["Bath Beach","Bay Ridge","Bedford-Stuyvesant","Bensonhurst","Bergen Beach","Boerum Hill","Borough Park","Brighton Beach","Brooklyn Heights","Brownsville","Bushwick","Canarsie","Carroll Gardens","Clinton Hill","Cobble Hill","Columbia St","Coney Island","Crown Heights","Cypress Hills","DUMBO","Downtown Brooklyn","Dyker Heights","East Flatbush","East New York","Flatbush","Flatlands","Fort Greene","Fort Hamilton","Gowanus","Gravesend","Greenpoint","Kensington","Manhattan Beach","Midwood","Mill Basin","Navy Yard","Park Slope","Prospect Heights","Prospect-Lefferts Gardens","Red Hook","Sea Gate","Sheepshead Bay","South Slope","Sunset Park","Vinegar Hill","Williamsburg","Windsor Terrace"],
  "Manhattan": ["Battery Park City","Chelsea","Chinatown","Civic Center","East Harlem","East Village","Financial District","Flatiron District","Gramercy","Greenwich Village","Harlem","Hell's Kitchen","Inwood","Kips Bay","Little Italy","Lower East Side","Marble Hill","Midtown","Morningside Heights","Murray Hill","NoHo","Nolita","Roosevelt Island","SoHo","Stuyvesant Town","Theater District","Tribeca","Two Bridges","Upper East Side","Upper West Side","Washington Heights","West Village"],
  "Queens": ["Arverne","Astoria","Bay Terrace","Bayside","Bayswater","Belle Harbor","Bellerose","Breezy Point","Briarwood","Cambria Heights","College Point","Corona","Ditmars Steinway","Douglaston","East Elmhurst","Edgemere","Elmhurst","Far Rockaway","Flushing","Forest Hills","Fresh Meadows","Glendale","Hollis","Holliswood","Howard Beach","Jackson Heights","Jamaica","Jamaica Estates","Jamaica Hills","Kew Gardens","Kew Gardens Hills","Laurelton","Little Neck","Long Island City","Maspeth","Middle Village","Neponsit","Ozone Park","Queens Village","Rego Park","Richmond Hill","Ridgewood","Rockaway Beach","Rosedale","South Ozone Park","Springfield Gardens","St. Albans","Sunnyside","Whitestone","Woodhaven","Woodside"],
  "Staten Island": ["Arden Heights","Arrochar","Bay Terrace, Staten Island","Bull's Head","Castleton Corners","Clifton","Concord","Dongan Hills","Eltingville","Emerson Hill","Graniteville","Grant City","Great Kills","Grymes Hill","Howland Hook","Huguenot","Mariners Harbor","Midland Beach","New Brighton","New Dorp","New Dorp Beach","New Springville","Oakwood","Port Richmond","Prince's Bay","Randall Manor","Rosebank","Rossville","Shore Acres","Silver Lake","South Beach","St. George","Stapleton","Todt Hill","Tompkinsville","Tottenville","West Brighton","Westerleigh","Willowbrook"]
};
const CENTER = {
  "Bronx":[40.8448,-73.8648], "Brooklyn":[40.6782,-73.9442], "Manhattan":[40.7831,-73.9712],
  "Queens":[40.7282,-73.7949], "Staten Island":[40.5795,-74.1502]
};
const ROOMS = {
  "Entire home/apt": {icon:"🏡", color:"#7c5cff", note:"Guests get the whole place to themselves — typical of higher prices and longer availability."},
  "Private room":    {icon:"🛏️", color:"#22d3ee", note:"A private bedroom in a shared home — the most common NYC listing type, usually mid-priced."},
  "Shared room":     {icon:"🧳", color:"#ff5c8a", note:"A shared sleeping space — usually the cheapest option and the rarest category."}
};
const PRESETS = {
  luxury:  {borough:"Manhattan", neighbourhood:"Midtown", latitude:40.7549, longitude:-73.984, price:320, minimum_nights:3, availability_365:220, number_of_reviews:48, reviews_per_month:1.4, calculated_host_listings_count:4},
  brooklyn:{borough:"Brooklyn", neighbourhood:"Bushwick", latitude:40.6944, longitude:-73.9213, price:65, minimum_nights:2, availability_365:120, number_of_reviews:85, reviews_per_month:2.1, calculated_host_listings_count:1},
  budget:  {borough:"Queens", neighbourhood:"Jamaica", latitude:40.7027, longitude:-73.7890, price:35, minimum_nights:1, availability_365:340, number_of_reviews:12, reviews_per_month:0.6, calculated_host_listings_count:2}
};

/* ---------- Helpers ---------- */
const $ = id => document.getElementById(id);
const f = {
  latitude:$("latitude"), longitude:$("longitude"), price:$("price"), minimum_nights:$("minimum_nights"),
  number_of_reviews:$("number_of_reviews"), reviews_per_month:$("reviews_per_month"),
  calculated_host_listings_count:$("calculated_host_listings_count"), availability_365:$("availability_365"),
  neighbourhood:$("neighbourhood")
};
let borough = "Manhattan";

function paintRange(r){ r.style.setProperty("--p", ((r.value-r.min)/(r.max-r.min))*100 + "%"); }
function syncOutputs(){
  ["minimum_nights","availability_365"].forEach(k=>{ $("o_"+k).textContent = f[k].value; paintRange(f[k]); });
  paintRange($("priceRange"));
}
function countUp(el, to, ms=1100, dec=1){
  const t0 = performance.now();
  (function step(t){
    const p = Math.min((t-t0)/ms,1), e = 1-Math.pow(1-p,3);
    el.textContent = (to*e).toFixed(dec);
    if(p<1) requestAnimationFrame(step);
  })(t0);
}

/* ---------- Borough + neighbourhood ---------- */
function buildBoroughs(){
  const box = $("boroughs");
  Object.keys(NEIGH).forEach(b=>{
    const btn = document.createElement("button");
    btn.type="button"; btn.textContent=b; btn.dataset.b=b;
    btn.onclick = ()=> setBorough(b, true);
    box.appendChild(btn);
  });
}
function setBorough(b, recenter, keepNeigh){
  borough = b;
  document.querySelectorAll("#boroughs button").forEach(x=>x.classList.toggle("on", x.dataset.b===b));
  f.neighbourhood.innerHTML = NEIGH[b].map(n=>`<option>${n}</option>`).join("");
  if(keepNeigh) f.neighbourhood.value = keepNeigh;
  if(recenter){ f.latitude.value = CENTER[b][0]; f.longitude.value = CENTER[b][1]; drawMap(); }
}

/* ---------- Pin map (canvas) ---------- */
const map = $("map"), mctx = map.getContext("2d");
const BOUNDS = {latMin:40.49, latMax:40.92, lngMin:-74.27, lngMax:-73.68};
const toXY = (lat,lng)=>[ (lng-BOUNDS.lngMin)/(BOUNDS.lngMax-BOUNDS.lngMin)*map.width, (1-(lat-BOUNDS.latMin)/(BOUNDS.latMax-BOUNDS.latMin))*map.height ];
const toLL = (x,y)=>[ BOUNDS.latMin+(1-y/map.height)*(BOUNDS.latMax-BOUNDS.latMin), BOUNDS.lngMin+x/map.width*(BOUNDS.lngMax-BOUNDS.lngMin) ];
let pinT = 0;
function drawMap(){
  const w=map.width,h=map.height; mctx.clearRect(0,0,w,h);
  mctx.strokeStyle="rgba(255,255,255,.05)"; mctx.lineWidth=1;
  for(let x=0;x<w;x+=40){mctx.beginPath();mctx.moveTo(x,0);mctx.lineTo(x,h);mctx.stroke();}
  for(let y=0;y<h;y+=40){mctx.beginPath();mctx.moveTo(0,y);mctx.lineTo(w,y);mctx.stroke();}
  Object.entries(CENTER).forEach(([b,[la,ln]])=>{
    const [x,y]=toXY(la,ln), on=b===borough;
    const g=mctx.createRadialGradient(x,y,0,x,y,on?70:46);
    g.addColorStop(0,on?"rgba(124,92,255,.55)":"rgba(255,255,255,.12)"); g.addColorStop(1,"transparent");
    mctx.fillStyle=g; mctx.beginPath(); mctx.arc(x,y,on?70:46,0,7); mctx.fill();
    mctx.fillStyle=on?"#fff":"rgba(255,255,255,.45)"; mctx.font="600 12px Inter"; mctx.textAlign="center"; mctx.fillText(b,x,y-(on?76:52));
  });
  const la=parseFloat(f.latitude.value), ln=parseFloat(f.longitude.value);
  if(isFinite(la)&&isFinite(ln)){
    const [x,y]=toXY(la,ln), r=8+Math.sin(pinT)*3;
    mctx.strokeStyle="rgba(34,211,238,.5)"; mctx.lineWidth=2; mctx.beginPath(); mctx.arc(x,y,r+8,0,7); mctx.stroke();
    mctx.fillStyle="#22d3ee"; mctx.shadowColor="#22d3ee"; mctx.shadowBlur=18; mctx.beginPath(); mctx.arc(x,y,6,0,7); mctx.fill(); mctx.shadowBlur=0;
  }
}
(function loop(){ pinT+=.07; drawMap(); requestAnimationFrame(loop); })();
map.addEventListener("click", e=>{
  const r=map.getBoundingClientRect();
  const [la,ln]=toLL((e.clientX-r.left)*map.width/r.width,(e.clientY-r.top)*map.height/r.height);
  f.latitude.value=la.toFixed(5); f.longitude.value=ln.toFixed(5);
  // snap borough to nearest centre
  let best=borough,d=1e9; Object.entries(CENTER).forEach(([b,[a,o]])=>{const k=(a-la)**2+(o-ln)**2; if(k<d){d=k;best=b}});
  if(best!==borough) setBorough(best,false);
});

/* ---------- Presets ---------- */
function applyPreset(p){
  setBorough(p.borough,false,p.neighbourhood);
  Object.keys(f).forEach(k=>{ if(p[k]!==undefined) f[k].value=p[k]; });
  $("priceRange").value=p.price; syncOutputs();
}
document.querySelectorAll("[data-preset]").forEach(b=>b.onclick=()=>applyPreset(PRESETS[b.dataset.preset]));

/* ---------- Sync price input & sliders ---------- */
$("priceRange").oninput = e=>{ f.price.value=e.target.value; syncOutputs(); };
f.price.oninput = e=>{ $("priceRange").value=Math.min(1000,e.target.value||0); syncOutputs(); };
["minimum_nights","availability_365"].forEach(k=>f[k].oninput=syncOutputs);

/* ---------- API ---------- */
const api = ()=> $("apiUrl").value.trim().replace(/\/+$/,"");
async function ping(){
  const dot=$("statusDot"); dot.className="dot";
  try{ const r=await fetch(api()+"/"); dot.className="dot "+(r.ok?"ok":"bad"); return r.ok; }
  catch{ dot.className="dot bad"; return false; }
}
$("pingBtn").onclick = ping;

function validate(){
  let ok=true;
  Object.values(f).forEach(el=>{
    el.classList.remove("invalid");
    if(el.value===""||(el.min!==""&&+el.value<+el.min)||(el.max!==""&&+el.value>+el.max)){ el.classList.add("invalid"); ok=false; }
  });
  return ok;
}

$("form").addEventListener("submit", async e=>{
  e.preventDefault();
  const err=$("formError"); err.textContent="";
  if(!validate()){ err.textContent="Please fix the highlighted fields."; return; }
  const body={
    latitude:+f.latitude.value, longitude:+f.longitude.value, price:+f.price.value,
    minimum_nights:parseInt(f.minimum_nights.value), number_of_reviews:parseInt(f.number_of_reviews.value),
    reviews_per_month:+f.reviews_per_month.value, calculated_host_listings_count:parseInt(f.calculated_host_listings_count.value),
    availability_365:parseInt(f.availability_365.value), neighbourhood_group:borough, neighbourhood:f.neighbourhood.value
  };
  const btn=$("submit"); btn.classList.add("loading"); btn.disabled=true;
  try{
    const res=await fetch(api()+"/predict",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(body)});
    if(!res.ok){ const t=await res.json().catch(()=>({})); throw new Error(res.status===422?"The API rejected the input (validation error).":(t.detail||"Server error "+res.status)); }
    showResult(await res.json());
    $("statusDot").className="dot ok";
  }catch(ex){
    err.textContent = ex instanceof TypeError ? "Can't reach the API at "+api()+". Is uvicorn running?" : ex.message;
    $("statusDot").className="dot bad";
  }finally{ btn.classList.remove("loading"); btn.disabled=false; }
});

/* ---------- Result rendering ---------- */
function showResult(data){
  const name=data.Predicted_room_type, meta=ROOMS[name]||{icon:"🏠",color:"#7c5cff",note:""};
  // API returns a list in class order; support dict too (if you labelled it server-side)
  const classes=Object.keys(ROOMS);
  const probs = Array.isArray(data.Probability) ? classes.map((c,i)=>[c,data.Probability[i]]) : Object.entries(data.Probability);
  const top = probs.find(p=>p[0]===name)?.[1] ?? Math.max(...probs.map(p=>p[1]));

  $("empty").classList.add("hidden");
  const out=$("out"); out.classList.remove("hidden"); out.style.setProperty("--rc",meta.color);
  out.style.animation="none"; out.offsetHeight; out.style.animation="";
  $("roomIcon").textContent=meta.icon; $("roomName").textContent=name;
  countUp($("confNum"), top*100);
  $("insight").textContent=meta.note;

  $("bars").innerHTML = probs.map(([c,p])=>`
    <div class="bar" style="--bc:${ROOMS[c]?.color||"#888"}">
      <div class="row"><span>${ROOMS[c]?.icon||""} ${c}</span><b>${(p*100).toFixed(1)}%</b></div>
      <div class="track"><div class="fill" data-w="${(p*100).toFixed(1)}"></div></div>
    </div>`).join("");
  requestAnimationFrame(()=>requestAnimationFrame(()=>document.querySelectorAll(".fill").forEach(el=>el.style.width=el.dataset.w+"%")));

  // ripple burst
  const card=$("resultCard"); card.style.position="sticky";
  for(let i=0;i<3;i++){
    const r=document.createElement("div"); r.className="ring"; r.style.setProperty("--rc",meta.color);
    r.style.cssText+=`left:50%;top:35%;width:420px;height:420px;margin:-210px 0 0 -210px;animation-delay:${i*.18}s`;
    card.appendChild(r); setTimeout(()=>r.remove(),1600);
  }
  if(window.innerWidth<=900) card.scrollIntoView({behavior:"smooth",block:"center"});
}

/* ---------- Animated particle background ---------- */
(function(){
  const c=$("bg"),x=c.getContext("2d"); let W,H,pts=[],mouse={x:-999,y:-999};
  function size(){ W=c.width=innerWidth; H=c.height=innerHeight; pts=Array.from({length:Math.min(90,W/16|0)},()=>({x:Math.random()*W,y:Math.random()*H,vx:(Math.random()-.5)*.35,vy:(Math.random()-.5)*.35})); }
  addEventListener("resize",size); addEventListener("mousemove",e=>{mouse.x=e.clientX;mouse.y=e.clientY});
  size();
  (function draw(){
    x.clearRect(0,0,W,H);
    pts.forEach((p,i)=>{
      p.x+=p.vx;p.y+=p.vy; if(p.x<0||p.x>W)p.vx*=-1; if(p.y<0||p.y>H)p.vy*=-1;
      x.fillStyle="rgba(150,160,255,.6)"; x.beginPath(); x.arc(p.x,p.y,1.4,0,7); x.fill();
      for(let j=i+1;j<pts.length;j++){const q=pts[j],d=Math.hypot(p.x-q.x,p.y-q.y); if(d<120){x.strokeStyle=`rgba(124,92,255,${.16*(1-d/120)})`;x.beginPath();x.moveTo(p.x,p.y);x.lineTo(q.x,q.y);x.stroke();}}
      const dm=Math.hypot(p.x-mouse.x,p.y-mouse.y); if(dm<160){x.strokeStyle=`rgba(34,211,238,${.35*(1-dm/160)})`;x.beginPath();x.moveTo(p.x,p.y);x.lineTo(mouse.x,mouse.y);x.stroke();}
    });
    requestAnimationFrame(draw);
  })();
})();

/* ---------- Init ---------- */
buildBoroughs();
applyPreset(PRESETS.luxury);
ping();
