/* ══════════════════════════════════════════════════════════════════
   Above 14th Street — Kishan Batra
   Ported from the approved v2 design prototype.

   The keyframe table KF, the station list STA, and the `near`
   calculation in wire() read the same scroll positions and must be
   updated in lockstep. Section i is framed at scrollY = i * 100vh.
   ══════════════════════════════════════════════════════════════════ */

/* shipped prop values (were design-tool knobs) */
const TIME_OF_DAY = "Overcast";   // "Golden hour" | "Overcast" | "Night"
const PARALLAX_DEPTH = 1.1;
const SHOW_STRIP_MAP = true;

const REDUCE = matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ── procedural skyline with real landmarks ─────────────────────── */
function buildSkylines(){
  const NS="http://www.w3.org/2000/svg";
  const el=(n,a)=>{const e=document.createElementNS(NS,n);for(const k in a)e.setAttribute(k,a[k]);return e};
  const rng=s=>()=>{s|=0;s=s+0x6D2B79F5|0;let t=Math.imul(s^s>>>15,1|s);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296};
  const night = TIME_OF_DAY==="Night";

  const grid=(g,r,x,y,w,h,rate,wc,wo)=>{
    const cols=Math.floor((w-12)/15),rows=Math.floor((h-16)/20);
    for(let c=0;c<cols;c++)for(let q=0;q<rows;q++){
      if(r()>rate)continue;
      g.appendChild(el("rect",{x:x+8+c*15,y:y+10+q*20,width:6,height:9,fill:wc,opacity:(wo*(.55+r()*.45)).toFixed(2)}));
    }
  };

  /* Empire State */
  const ESB=(svg,H,wc,wo,r,x)=>{
    const g=el("g",{}),c="#8E8677",cx=x+80;
    [[x,H-160,160,160],[x-6,H-168,172,9],[x+18,H-352,124,192],[x+38,H-478,84,126],[x+54,H-506,52,28],[x+66,H-528,28,22]]
      .forEach((b,i)=>g.appendChild(el("rect",{x:b[0],y:b[1],width:b[2],height:b[3],fill:i===1?"#7C7466":c})));
    g.appendChild(el("path",{d:`M${cx-8} ${H-528} L${cx} ${H-550} L${cx+8} ${H-528} Z`,fill:c}));
    g.appendChild(el("rect",{x:cx-2,y:H-596,width:4,height:48,fill:c}));
    g.appendChild(el("circle",{cx:cx,cy:H-600,r:3.4,fill:"#EE352E",opacity:".9"}));
    g.appendChild(el("rect",{x:x+46,y:H-478,width:3,height:126,fill:"#7C7466"}));
    g.appendChild(el("rect",{x:x+111,y:H-478,width:3,height:126,fill:"#7C7466"}));
    // floodlit crown
    g.appendChild(el("rect",{x:x+54,y:H-506,width:52,height:28,fill:night?"#FCCC0B":"#C8B98C",opacity:night?".55":".3"}));
    if(wc){grid(g,r,x+4,H-156,152,146,.8,wc,wo);grid(g,r,x+22,H-348,116,182,.8,wc,wo);grid(g,r,x+42,H-474,76,118,.8,wc,wo);}
    svg.appendChild(g);return [x-14,x+174];
  };

  /* Chrysler */
  const CHRYSLER=(svg,H,wc,wo,r,x)=>{
    const g=el("g",{}),c="#6E7B85",w=100,cx=x+w/2;
    g.appendChild(el("rect",{x:x,y:H-170,width:w,height:170,fill:c}));
    g.appendChild(el("rect",{x:x-5,y:H-176,width:w+10,height:7,fill:"#5E6B75"}));
    g.appendChild(el("rect",{x:x+11,y:H-360,width:w-22,height:190,fill:c}));
    g.appendChild(el("path",{d:`M${x+11} ${H-352} l-11 -4 l11 -5 Z`,fill:c}));
    g.appendChild(el("path",{d:`M${x+w-11} ${H-352} l11 -4 l-11 -5 Z`,fill:c}));
    let ty=H-356,tw=w-18;
    for(let i=0;i<6;i++){
      const th=36-i*3.6;
      g.appendChild(el("path",{d:`M${cx-tw/2} ${ty} Q ${cx-tw*0.1} ${ty-th*1.15} ${cx} ${ty-th*1.65} Q ${cx+tw*0.1} ${ty-th*1.15} ${cx+tw/2} ${ty} Z`,fill:c}));
      if(wc&&i<5){
        const vy=ty-3;
        g.appendChild(el("path",{d:`M${cx-3.5} ${vy} L${cx} ${vy-11} L${cx+3.5} ${vy} Z`,fill:wc,opacity:wo}));
        if(tw>36){
          g.appendChild(el("path",{d:`M${cx-15} ${vy} L${cx-11} ${vy-8} L${cx-7} ${vy} Z`,fill:wc,opacity:wo*.85}));
          g.appendChild(el("path",{d:`M${cx+7} ${vy} L${cx+11} ${vy-8} L${cx+15} ${vy} Z`,fill:wc,opacity:wo*.85}));
        }
      }
      ty-=th*.96;tw*=.66;
    }
    g.appendChild(el("path",{d:`M${cx-2.5} ${ty+6} L${cx} ${ty-70} L${cx+2.5} ${ty+6} Z`,fill:c}));
    if(wc){grid(g,r,x+3,H-166,94,158,.75,wc,wo);grid(g,r,x+14,H-356,72,184,.75,wc,wo);}
    svg.appendChild(g);return [x-16,x+w+14];
  };

  /* Flatiron — the wedge, seen prow-on */
  const FLATIRON=(svg,H,wc,wo,r,x)=>{
    const g=el("g",{}),c="#8A7A69",h=210,w=56;
    g.appendChild(el("path",{d:`M${x+w} ${H} L${x+w} ${H-h} Q${x+w/2} ${H-h-16} ${x} ${H-h+6} L${x} ${H} Z`,fill:c}));
    g.appendChild(el("path",{d:`M${x+w} ${H} L${x+w+120} ${H} L${x+w+120} ${H-h+18} L${x+w} ${H-h} Z`,fill:"#7A6B5C"}));
    g.appendChild(el("rect",{x:x-4,y:H-h-10,width:w+130,height:10,fill:"#6D5F52"}));
    for(let i=1;i<=5;i++)g.appendChild(el("rect",{x:x,y:H-h+i*34,width:w+120,height:3,fill:"#6D5F52",opacity:".7"}));
    if(wc){
      for(let f=0;f<9;f++)for(let cc=0;cc<2;cc++)
        g.appendChild(el("rect",{x:x+14+cc*20,y:H-h+18+f*22,width:8,height:11,fill:r()>.4?wc:"#3A322A",opacity:r()>.4?(wo*.85).toFixed(2):.9}));
      grid(g,r,x+w+6,H-h+22,110,h-30,.7,wc,wo);
    }
    svg.appendChild(g);return [x-8,x+w+130];
  };

  /* Met Life clock tower, 1 Madison — Union Square's neighbor */
  const METLIFE=(svg,H,wc,wo,r,x)=>{
    const g=el("g",{}),c="#B9B0A0",w=64,cx=x+w/2;
    g.appendChild(el("rect",{x:x-24,y:H-150,width:w+48,height:150,fill:"#A9A091"}));
    g.appendChild(el("rect",{x:x,y:H-330,width:w,height:180,fill:c}));
    g.appendChild(el("rect",{x:x-6,y:H-344,width:w+12,height:14,fill:"#C6BCAA"}));
    g.appendChild(el("circle",{cx:cx,cy:H-300,r:19,fill:"#F1EAD6"}));
    g.appendChild(el("circle",{cx:cx,cy:H-300,r:19,fill:"none",stroke:"#8A6A45",strokeWidth:3}));
    g.appendChild(el("path",{d:`M${cx} ${H-300} L${cx} ${H-312} M${cx} ${H-300} L${cx+9} ${H-296}`,stroke:"#3A322A","stroke-width":2.6,fill:"none"}));
    g.appendChild(el("path",{d:`M${x-4} ${H-344} L${cx} ${H-404} L${x+w+4} ${H-344} Z`,fill:"#C6BCAA"}));
    g.appendChild(el("rect",{x:cx-8,y:H-424,width:16,height:22,fill:c}));
    g.appendChild(el("rect",{x:cx-1.5,y:H-448,width:3,height:24,fill:c}));
    if(wc){grid(g,r,x-20,H-146,104,138,.7,wc,wo);grid(g,r,x+4,H-326,56,110,.6,wc,wo);}
    svg.appendChild(g);return [x-30,x+w+34];
  };

  /* One World Trade — Freedom Tower */
  const OWTC=(svg,H,wc,wo,r,x)=>{
    const g=el("g",{}),c="#9FB6C8",w=76,cx=x+w/2,h=356;
    g.appendChild(el("path",{d:`M${x} ${H} L${x+w} ${H} L${x+w-13} ${H-h} L${x+13} ${H-h} Z`,fill:c}));
    // chamfered facets
    g.appendChild(el("path",{d:`M${cx} ${H} L${x+w-13} ${H-h} L${cx} ${H-h} Z`,fill:"#8FA8BC",opacity:".8"}));
    g.appendChild(el("rect",{x:x+13,y:H-h-10,width:w-26,height:10,fill:"#B4C7D6"}));
    g.appendChild(el("rect",{x:cx-2,y:H-h-118,width:4,height:108,fill:"#C3D2DE"}));
    g.appendChild(el("circle",{cx:cx,cy:H-h-124,r:4,fill:"#EE352E",opacity:".9"}));
    if(wc){
      for(let i=0;i<5;i++)g.appendChild(el("rect",{x:x+18+i*10,y:H-h+16,width:4,height:h-30,fill:wc,opacity:(wo*.28).toFixed(2)}));
      grid(g,r,x+14,H-160,48,150,.5,wc,wo);
    }
    svg.appendChild(g);return [x-10,x+w+10];
  };

  const ROCK30=(svg,H,wc,wo,r,x)=>{
    const g=el("g",{}),c="#7E9099",w=150;
    [[x,H-140,w,140],[x+16,H-260,w-32,120],[x+30,H-372,w-60,112],[x+42,H-388,w-84,16]]
      .forEach(b=>g.appendChild(el("rect",{x:b[0],y:b[1],width:b[2],height:b[3],fill:c})));
    if(wc){for(let s=0;s<6;s++)g.appendChild(el("rect",{x:x+38+s*13,y:H-364,width:5,height:216,fill:wc,opacity:(wo*.5).toFixed(2)}));grid(g,r,x+4,H-136,142,126,.7,wc,wo);}
    svg.appendChild(g);return [x-10,x+w+10];
  };

  const VANDERBILT=(svg,H,wc,wo,r,x)=>{
    const g=el("g",{}),c="#75868F",w=104,cx=x+w/2;
    g.appendChild(el("path",{d:`M${x} ${H} L${x+w} ${H} L${x+w-14} ${H-210} L${x+w-30} ${H-330} L${x+30} ${H-330} L${x+14} ${H-210} Z`,fill:c}));
    g.appendChild(el("rect",{x:cx-22,y:H-368,width:44,height:38,fill:c}));
    g.appendChild(el("rect",{x:cx-11,y:H-392,width:22,height:24,fill:c}));
    g.appendChild(el("rect",{x:cx-1.5,y:H-424,width:3,height:32,fill:c}));
    if(wc){grid(g,r,x+18,H-326,68,110,.7,wc,wo);grid(g,r,x+16,H-206,72,200,.7,wc,wo);}
    svg.appendChild(g);return [x-10,x+w+10];
  };

  const P432=(svg,H,wc,wo,r,x)=>{
    const g=el("g",{});
    g.appendChild(el("rect",{x:x,y:H-318,width:30,height:318,fill:"#AEBFC7"}));
    for(let q=0;q<9;q++)g.appendChild(el("rect",{x:x+4,y:H-306+q*34,width:22,height:2,fill:"#98AAB3"}));
    svg.appendChild(g);return [x-6,x+36];
  };
  const STEINWAY=(svg,H,wc,wo,r,x)=>{
    const g=el("g",{}),c="#A4B6BF";
    [[x,H-300,20,300],[x,H-316,15,16],[x,H-330,10,14],[x,H-341,5,11]].forEach(b=>g.appendChild(el("rect",{x:b[0],y:b[1],width:b[2],height:b[3],fill:c})));
    svg.appendChild(g);return [x-6,x+26];
  };
  const CPT=(svg,H,wc,wo,r,x)=>{
    const g=el("g",{}),c="#A9BCC4";
    g.appendChild(el("rect",{x:x,y:H-268,width:52,height:268,fill:c}));
    g.appendChild(el("rect",{x:x-14,y:H-268,width:14,height:190,fill:c}));
    svg.appendChild(g);return [x-20,x+58];
  };

  const LIBERTY=(svg,H,wc,wo,r,x)=>{
    const g=el("g",{}),c="#7FA792",p="#8A9585",cx=x+40;
    g.appendChild(el("rect",{x:x,y:H-26,width:80,height:26,fill:p}));
    g.appendChild(el("rect",{x:x+14,y:H-64,width:52,height:38,fill:p}));
    g.appendChild(el("rect",{x:x+20,y:H-72,width:40,height:8,fill:p}));
    g.appendChild(el("path",{d:`M${cx-16} ${H-72} L${cx+16} ${H-72} L${cx+11} ${H-136} L${cx-11} ${H-136} Z`,fill:c}));
    g.appendChild(el("circle",{cx:cx,cy:H-144,r:7,fill:c}));
    for(let s=-3;s<=3;s++)g.appendChild(el("path",{d:`M${cx+s*3.4} ${H-149} L${cx+s*4.6} ${H-161} L${cx+s*3.4+1.6} ${H-149} Z`,fill:c}));
    g.appendChild(el("path",{d:`M${cx+8} ${H-128} L${cx+22} ${H-172} L${cx+26} ${H-170} L${cx+14} ${H-126} Z`,fill:c}));
    g.appendChild(el("circle",{cx:cx+25,cy:H-176,r:5,fill:"#FCCC0B",opacity:".95"}));
    g.appendChild(el("rect",{x:cx-20,y:H-118,width:9,height:16,fill:c}));
    svg.appendChild(g);return [x-8,x+88];
  };

  /* brownstone row */
  const BROWNSTONES=(svg,H,wc,wo,r,x)=>{
    const g=el("g",{}),cols=["#4A3128","#59392C","#412F29","#553A2E"],n=4,w=66,hh=168;
    for(let i=0;i<n;i++){
      const bx=x+i*w,c=cols[i%4];
      g.appendChild(el("rect",{x:bx,y:H-hh,width:w-4,height:hh,fill:c}));
      g.appendChild(el("rect",{x:bx-3,y:H-hh-8,width:w+2,height:8,fill:c}));
      const dx=bx+12;
      g.appendChild(el("rect",{x:dx,y:H-46,width:16,height:46,fill:"#241B16"}));
      for(let s=0;s<4;s++)g.appendChild(el("rect",{x:dx-2-s*4,y:H-12-s*8,width:20+s*8,height:8,fill:"#3A2A22"}));
      for(let f=0;f<3;f++)for(let cc=0;cc<2;cc++){
        const lit=r()>.35;
        g.appendChild(el("rect",{x:bx+32+cc*15,y:H-hh+18+f*48,width:9,height:26,fill:lit?wc:"#241B16",opacity:lit?(wo*.85).toFixed(2):1}));
        g.appendChild(el("rect",{x:bx+30+cc*15,y:H-hh+14+f*48,width:13,height:4,fill:"#2B1F1A"}));
      }
    }
    svg.appendChild(g);return [x-8,x+n*w+8];
  };

  const fill=(svg,o)=>{
    const vb=svg.getAttribute("viewBox").split(" "),W=+vb[2],H=+vb[3],r=rng(o.seed),zones=[];
    if(o.land)for(const [fn,lx] of o.land)zones.push(fn(svg,H,o.windows?o.winColor:null,o.winOp,r,lx));
    let x=-40;
    while(x<W+40){
      const w=40+Math.round(r()*80);
      const hit=zones.find(z=>x<z[1]&&x+w>z[0]);
      if(hit){x=hit[1]+4;continue}
      const baseH=o.minH+Math.round(r()*(o.maxH-o.minH));
      let h=baseH;
      const color=o.palette[Math.floor(r()*o.palette.length)],g=el("g",{});
      g.appendChild(el("rect",{x,y:H-h,width:w,height:h,fill:color}));
      if(o.cornice&&r()>.4)g.appendChild(el("rect",{x:x-4,y:H-h-7,width:w+8,height:7,fill:color}));
      if(o.towers&&r()>.86){
        const sw=Math.max(16,w*.42),sx=x+(w-sw)/2,sh=h*.34;
        g.appendChild(el("rect",{x:sx,y:H-h-sh,width:sw,height:sh,fill:color}));
        g.appendChild(el("rect",{x:sx+sw/2-2.5,y:H-h-sh-46,width:5,height:46,fill:color}));
        h+=sh+46;
      }
      if(o.tanks&&r()>.62){
        const tw=26,tx=x+8+r()*(w-tw-16),ty=H-h-40;
        g.appendChild(el("rect",{x:tx,y:ty,width:tw,height:26,fill:color}));
        g.appendChild(el("path",{d:`M${tx-3} ${ty} L${tx+tw/2} ${ty-13} L${tx+tw+3} ${ty} Z`,fill:color}));
        g.appendChild(el("rect",{x:tx+3,y:ty+26,width:3,height:14,fill:color}));
        g.appendChild(el("rect",{x:tx+tw-6,y:ty+26,width:3,height:14,fill:color}));
      }
      if(o.windows){
        const cols=Math.floor((w-14)/16),rows=Math.floor((baseH-20)/22);
        for(let c=0;c<cols;c++)for(let q=0;q<rows;q++){
          if(r()>o.windows)continue;
          g.appendChild(el("rect",{x:x+9+c*16,y:H-baseH+14+q*22,width:7,height:10,fill:o.winColor,opacity:(o.winOp*(.55+r()*.45)).toFixed(2)}));
        }
      }
      svg.appendChild(g);x+=w+4+Math.round(r()*14);
    }
  };

  const wo = night?.95:.5, woN = night?1:.95;
  fill(document.getElementById("sFar"),{seed:7,palette:["#A9BCC4","#B2C3CA","#9FB3BD"],minH:80,maxH:190,windows:night?.35:0,winColor:"#F7E7B8",winOp:wo*.6,towers:false,tanks:false,
    land:[[LIBERTY,110],[CPT,420],[P432,660],[STEINWAY,850],[OWTC,1300]]});
  fill(document.getElementById("sMid"),{seed:23,palette:["#7E9099","#75868F","#83939B","#6E7F88"],minH:150,maxH:330,windows:.86,winColor:"#F7E7B8",winOp:wo,towers:true,tanks:false,
    land:[[METLIFE,200],[ROCK30,700],[VANDERBILT,1180]]});
  fill(document.getElementById("sNear"),{seed:104,palette:["#22201D","#2E2622","#3B2A23","#332E27","#26221E"],minH:170,maxH:400,windows:.8,winColor:"#FCCC0B",winOp:woN,towers:true,tanks:true,cornice:true,
    land:[[FLATIRON,110],[CHRYSLER,540],[ESB,900],[BROWNSTONES,1250]]});
}

/* ── tunnel furniture that whips past the window ────────────────── */
function buildFore(){
  const NS="http://www.w3.org/2000/svg";
  const svg=document.getElementById("foreSvg");
  if(!svg)return;
  const el=(n,a)=>{const e=document.createElementNS(NS,n);for(const k in a)e.setAttribute(k,a[k]);return e};
  for(let i=0;i<90;i++){
    const x=i*250+((i*97)%80);
    svg.appendChild(el("rect",{x,y:0,width:15,height:900,fill:"#0A0908",opacity:".85"}));
    svg.appendChild(el("rect",{x:x-5,y:0,width:5,height:900,fill:"#1A1815",opacity:".5"}));
    if(i%4===1)svg.appendChild(el("circle",{cx:x+8,cy:170,r:8,fill:"#4E8CFF",opacity:".5"}));
  }
  const d=[];
  for(let i=0;i<90;i++)d.push(`M${i*250} 250 q125 46 250 0`);
  svg.appendChild(el("path",{d:d.join(" "),fill:"none",stroke:"#14120F","stroke-width":9,opacity:".8"}));
}

function applyTime(){
  const t=TIME_OF_DAY;
  const sky=document.getElementById("sky"),tint=document.getElementById("nightTint");
  if(!sky)return;
  if(t==="Overcast"){sky.style.background="linear-gradient(180deg,#9AA6AC 0%,#B6BEC1 46%,#CBCCC4 78%,#D9D6C9 100%)";tint.style.opacity="0"}
  else if(t==="Night"){sky.style.background="linear-gradient(180deg,#0B1730 0%,#16233A 44%,#2A3448 76%,#3E4150 100%)";tint.style.opacity=".22"}
  else{sky.style.background="linear-gradient(180deg,#8FB3C4 0%,#BBD0D8 42%,#E4E0D2 78%,#F2E7CE 100%)";tint.style.opacity="0"}
}

/* ── scroll engine ──────────────────────────────────────────────── */
function wire(){
  const depth=Math.max(.3,Math.min(1.8,PARALLAX_DEPTH));
  const yl=[...document.querySelectorAll("[data-rate]")].map(n=>({n,r:parseFloat(n.dataset.rate)}));
  const xl=[...document.querySelectorAll("[data-xrate]")].map(n=>({n,r:parseFloat(n.dataset.xrate)}));
  const A=document.getElementById("stageA"),B=document.getElementById("stageB"),
        dusk=document.getElementById("dusk"),num=document.getElementById("rdNum"),
        cap=document.getElementById("rdCap"),sf=document.getElementById("stripFill"),
        btns=[...document.querySelectorAll(".stopBtn")],
        secs=[...document.querySelectorAll("main section")],
        train=document.getElementById("train"),
        scrimA=document.getElementById("scrimA"),
        fore=document.getElementById("rideFore"),
        carRoute=document.getElementById("carRoute"),
        carDot=document.getElementById("carDot");
  let lightChrome=null;
  const strip=document.getElementById("strip");
  if(!SHOW_STRIP_MAP&&strip)strip.style.display="none";

  // ride keyframes: [scroll in vh, x offset in vw] — section i is framed
  // at scrollY = i * 100vh; stations must land on their copy's position
  const KF=[[240,0],[300,-100],[400,-300],[500,-500],[600,-560],[700,-600]];
  const STA=[{at:300,n:"23 St",s:"Baruch College · 6"},{at:400,n:"47–50 Sts",s:"NBCUniversal · B D F M"},{at:500,n:"116 St",s:"Columbia University · 1"},{at:700,n:"Last stop",s:"Everyone off"}];

  let cur=0,target=0;

  // resolve CSS 100vw/100vh to px via a probe — exact against the
  // vh/vw-authored stage geometry in every browser
  const probe=document.createElement("div");
  probe.style.cssText="position:fixed;left:0;top:0;width:100vw;height:100vh;visibility:hidden;pointer-events:none";
  document.body.appendChild(probe);
  let unitW=0,unitH=0;
  const measureUnits=()=>{const r=probe.getBoundingClientRect();unitW=r.width;unitH=r.height};
  measureUnits();
  const vh=()=>unitH, vw=()=>unitW;

  // Virtual scroll position, in vh-units of the design's 8×100vh grid:
  // section i's top maps to v = i*100, interpolated between real section
  // tops. On a desktop viewport (every section exactly 100vh) this equals
  // scrollY/vh*100; on narrow viewports, where content makes sections
  // taller than 100vh, it keeps every station glued to its copy.
  let tops=[];
  const measure=()=>{measureUnits();tops=secs.map(s=>s.offsetTop)};
  measure();
  const vOf=s=>{
    let i=0;
    for(let j=1;j<tops.length;j++){if(tops[j]<=s)i=j;else break}
    const t0=tops[i];
    const t1=i+1<tops.length?tops[i+1]:t0+secs[i].offsetHeight;
    const f=t1>t0?(s-t0)/(t1-t0):0;
    return (i+f)*100;
  };

  const rideX=v=>{
    if(v<=KF[0][0])return KF[0][1];
    for(let i=1;i<KF.length;i++){
      if(v<=KF[i][0]){
        const [a,ao]=KF[i-1],[b,bo]=KF[i];
        return ao+(bo-ao)*(v-a)/(b-a);
      }
    }
    return KF[KF.length-1][1];
  };

  const paint=()=>{
    const v=vOf(cur);          // virtual position, vh-units
    const s=v/100*vh();        // virtual position, px

    for(const l of yl){
      const r=l.r>=1?l.r:1-(1-l.r)*depth;
      l.n.style.transform=`translate3d(0,${-(s*r).toFixed(1)}px,0)`;
    }
    const off=rideX(v)*vw()/100;
    for(const l of xl) l.n.style.transform=`translate3d(${(off*l.r).toFixed(1)}px,0,0)`;

    const g=1.15*vh();
    dusk.style.opacity=Math.min(1,Math.max(0,(s-g*.45)/(g*.9))).toFixed(3);
    const b=Math.min(1,Math.max(0,(v-232)/54));
    B.style.opacity=b.toFixed(3);
    A.style.opacity=(1-b).toFixed(3);
    A.style.visibility=b>=1?"hidden":"visible";
    // dark scrim keeps copy legible once the backdrop turns pale
    scrimA.style.opacity=Math.min(.88,Math.max(0,(v-62)/48)).toFixed(3);
    // chrome flips to ink while the backdrop is the pale sky
    const pale=v<70;
    if(pale!==lightChrome){
      lightChrome=pale;
      document.body.classList.toggle("chrome-ink",pale);
    }
    // tunnel furniture only whips past between stations
    const near=Math.min(Math.abs(v-300),Math.abs(v-400),Math.abs(v-500),Math.abs(v-700));
    fore.style.opacity=Math.min(.9,Math.max(0,(near-16)/34)).toFixed(3);
    if(carRoute){
      const line=v>=452?["Broadway–7 Av local · 116 St","#EE352E"]
                :v>=352?["Sixth Av local · 47–50 Sts","#FF6319"]
                       :["Lexington Av local · 23 St","#00933C"];
      if(carRoute.textContent!==line[0]){carRoute.textContent=line[0];carDot.style.background=line[1]}
    }
    if(v<236){
      const surface=g*.55,ft=s<surface?Math.round(1050*(1-s/surface)):-Math.round(180*((s-surface)/(2.4*vh())));
      num.textContent=(ft>0?"+":"")+ft.toLocaleString()+" ft";
      cap.textContent=ft>0?"Above sea level":"Below street";
    }else{
      const s=STA.find(s=>v<=s.at+18)||STA[STA.length-1];
      num.textContent=s.n;
      cap.textContent=Math.abs(v-s.at)<20?"Now arriving · "+s.s:"Next stop · "+s.s;
    }

    const end=document.documentElement.scrollHeight-document.documentElement.clientHeight;
    sf.style.height=(100*cur/end).toFixed(2)+"%";
    const mid=cur+vh()*.5;let act=0;
    secs.forEach((s,i)=>{if(s.offsetTop<=mid)act=i});
    btns.forEach((btn,i)=>btn.style.opacity=i===act?"1":"0.4");

    // train pulls in at the platform, then out
    if(train){
      const p=Math.min(1,Math.max(0,(v-186)/44));
      train.setAttribute("transform",`translate(${(1700-1700*p).toFixed(0)} 0)`);
    }
  };

  if(REDUCE){
    // reduced-motion fallback: one static frame per section — no
    // smoothing, no parallax drift, no train movement between repaints
    const snap=()=>{
      measure();
      const mid=scrollY+vh()*.5;let act=0;
      secs.forEach((s,i)=>{if(s.offsetTop<=mid)act=i});
      cur=secs[act].offsetTop;
      paint();
    };
    addEventListener("scroll",snap,{passive:true});
    addEventListener("resize",snap);
    snap();
  }else{
    const loop=()=>{
      target=scrollY;
      cur+=(target-cur)*0.14;
      if(Math.abs(target-cur)<0.4)cur=target;
      paint();requestAnimationFrame(loop);
    };
    loop();
    addEventListener("resize",()=>{measure();paint()});
  }

  btns.forEach(b=>b.addEventListener("click",()=>{
    const t=secs[+b.dataset.to];
    if(t)scrollTo({top:t.offsetTop,behavior:REDUCE?"auto":"smooth"});
  }));
}

document.addEventListener("DOMContentLoaded",()=>{
  buildSkylines();
  buildFore();
  applyTime();
  wire();
});
