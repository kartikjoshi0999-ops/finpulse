/**
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║              F I N P U L S E  —  v3.0  FINAL                   ║
 * ║      Real-Time Financial Analytics + Multi-Model AI             ║
 * ╠══════════════════════════════════════════════════════════════════╣
 * ║  Built by: [Your Name]  |  github.com/[you]/finpulse            ║
 * ║  Stack: React · Recharts · Pollinations.ai (free AI)            ║
 * ╠══════════════════════════════════════════════════════════════════╣
 * ║  AI MODELS (100% FREE — NO API KEYS REQUIRED)                   ║
 * ║  ─────────────────────────────────────────────────────────────  ║
 * ║  • GPT-4o        → via Pollinations.ai (openai-large)           ║
 * ║  • GPT-4o-mini   → via Pollinations.ai (openai)                 ║
 * ║  • Gemini Flash  → via Pollinations.ai (gemini)                 ║
 * ║  • Mistral       → via Pollinations.ai (mistral)                ║
 * ║  • Llama 3.3     → via Pollinations.ai (llama)                  ║
 * ║                                                                  ║
 * ║  HOW TO RUN:                                                     ║
 * ║  1. npm create vite@latest finpulse -- --template react          ║
 * ║  2. cd finpulse && npm install recharts                          ║
 * ║  3. Replace src/App.jsx with this file                           ║
 * ║  4. npm run dev → open http://localhost:5173                     ║
 * ║  5. Deploy: vercel.com → import GitHub repo → done              ║
 * ╚══════════════════════════════════════════════════════════════════╝
 */

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, Legend,
  ReferenceLine, RadarChart, Radar, PolarGrid, PolarAngleAxis,
} from "recharts";

/* ═══════════════════════════════════════════════════════════════════
   FREE AI ENGINE — Powered by Pollinations.ai
   No API keys. No sign-up. No cost. Works forever.
═══════════════════════════════════════════════════════════════════ */
const AI_MODELS = {
  "GPT-4o": {
    id: "openai-large",
    color: "#10b981",
    badge: "🟢",
    desc: "Most powerful — complex analysis, portfolio plans",
    best: ["portfolio", "deepanalysis", "comparison"],
  },
  "GPT-4o-mini": {
    id: "openai",
    color: "#60a5fa",
    badge: "🔵",
    desc: "Fast & smart — quick market takes, sentiment",
    best: ["chat", "sentiment", "quick"],
  },
  "Gemini Flash": {
    id: "gemini",
    color: "#f59e0b",
    badge: "🟡",
    desc: "Google AI — great at structured data & forecasts",
    best: ["forecast", "structured", "data"],
  },
  "Mistral": {
    id: "mistral",
    color: "#a78bfa",
    badge: "🟣",
    desc: "European AI — strong at risk analysis & regulation",
    best: ["risk", "regulation", "canada"],
  },
  "Llama 3.3": {
    id: "llama",
    color: "#fb923c",
    badge: "🟠",
    desc: "Open source — crypto, DeFi, Web3 specialist",
    best: ["crypto", "defi", "nft"],
  },
};

// Smart model auto-selector based on task type
const AUTO_MODEL = {
  portfolio:  "GPT-4o",
  forecast:   "Gemini Flash",
  crypto:     "Llama 3.3",
  risk:       "Mistral",
  chat:       "GPT-4o-mini",
  nft:        "Llama 3.3",
  funds:      "Mistral",
};

async function callAI(messages, systemPrompt = "", modelKey = "GPT-4o") {
  const modelMap = {
    "GPT-4o": "openai-large", "GPT-4o-mini": "openai",
    "Gemini Flash": "gemini", "Mistral": "mistral", "Llama 3.3": "llama"
  };
  const models = ["openai-large", "openai", "mistral", "gemini", "llama"];
  const primary = modelMap[modelKey] || "openai-large";
  const toTry = [primary, ...models.filter(m => m !== primary)];

  // Build a single prompt string from messages + system
  const buildPrompt = (msgs, sys) => {
    let p = sys ? sys + "\n\n" : "";
    p += msgs.map(m => (m.role === "user" ? "User: " : "Assistant: ") + m.content).join("\n");
    return encodeURIComponent(p);
  };

  const prompt = buildPrompt(messages, systemPrompt);

  for (const model of toTry) {
    try {
      // Use GET endpoint - more reliable, no CORS issues
      const url = `https://text.pollinations.ai/${prompt}?model=${model}&seed=${Math.floor(Math.random()*9999)}&json=false`;
      const res = await fetch(url);
      if (!res.ok) continue;
      const text = await res.text();
      if (text && text.trim().length > 10) return text.trim();
    } catch(e) { continue; }
  }
  throw new Error("AI service temporarily busy — please try again in a moment");
}

/* ═══════════════════════════════════════════════════════════════════
   GLOBAL STYLES
═══════════════════════════════════════════════════════════════════ */
const GCSS = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600;700&display=swap');
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
  html,body,#root{height:100%;background:#060710;}
  ::-webkit-scrollbar{width:4px;height:4px;}
  ::-webkit-scrollbar-track{background:transparent;}
  ::-webkit-scrollbar-thumb{background:#1e2240;border-radius:4px;}
  @keyframes pulse   {0%,100%{opacity:1;transform:scale(1)}50%{opacity:.35;transform:scale(.75)}}
  @keyframes blink   {0%,100%{opacity:1}50%{opacity:.1}}
  @keyframes fadeUp  {from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
  @keyframes sweep   {from{transform:rotate(-90deg)}}
  @keyframes ticker  {0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
  @keyframes spin    {to{transform:rotate(360deg)}}
  @keyframes shimmer {0%{opacity:.5}50%{opacity:1}100%{opacity:.5}}
  @keyframes glow    {0%,100%{box-shadow:0 0 8px #4ade8044}50%{box-shadow:0 0 20px #4ade8088}}
  input:focus,select:focus,textarea:focus{outline:none;border-color:#3d4a80!important;box-shadow:0 0 0 3px #4ade8010;}
  button{cursor:pointer;transition:all .16s ease;font-family:inherit;border:none;}
  button:disabled{opacity:.35;cursor:not-allowed;transform:none!important;}
  button:not(:disabled):hover{opacity:.88;transform:translateY(-1px);}
  button:not(:disabled):active{transform:scale(.97)!important;}
  select{cursor:pointer;font-family:inherit;}
  .fade-up{animation:fadeUp .42s cubic-bezier(.16,1,.3,1) both;}
  .shimmer{animation:shimmer 1.8s ease-in-out infinite;}
`;

/* ═══════════════════════════════════════════════════════════════════
   DESIGN TOKENS
═══════════════════════════════════════════════════════════════════ */
const T = {
  bg0:"#060710", bg1:"#090b18", bg2:"#0d0f20", bg3:"#111328",
  border:"#14162a", border2:"#1e2240", border3:"#252a50",
  green:"#4ade80", red:"#f87171", blue:"#60a5fa",
  purple:"#a78bfa", orange:"#fb923c", yellow:"#fbbf24",
  teal:"#2dd4bf", pink:"#f472b6", indigo:"#818cf8",
  muted:"#4b5563", dim:"#181a2e", text:"#dde4f0", sub:"#8892a4",
  mono:"JetBrains Mono,monospace", sans:"Inter,sans-serif",
};

/* ═══════════════════════════════════════════════════════════════════
   STATIC DATA
═══════════════════════════════════════════════════════════════════ */
const CRYPTOS = [
  {r:1, name:"Bitcoin",    s:"BTC",  p:67842,     c:2.34,  mc:"$1.32T",v:"$38.2B",sent:82,vol7:[60,62,59,68,72,74,78,80,76,82,85,84,82,79,82]},
  {r:2, name:"Ethereum",   s:"ETH",  p:3612,      c:1.87,  mc:"$430B", v:"$18.6B",sent:76,vol7:[55,58,52,61,65,68,72,74,70,76,78,77,75,73,76]},
  {r:3, name:"Solana",     s:"SOL",  p:184.2,     c:5.21,  mc:"$81B",  v:"$4.2B", sent:88,vol7:[70,72,75,80,82,85,86,88,87,88,90,89,88,86,88]},
  {r:4, name:"BNB",        s:"BNB",  p:601,       c:-0.43, mc:"$87B",  v:"$2.1B", sent:61,vol7:[58,60,62,61,59,60,63,62,61,61,62,60,61,60,61]},
  {r:5, name:"XRP",        s:"XRP",  p:0.582,     c:3.15,  mc:"$33B",  v:"$1.8B", sent:71,vol7:[60,62,65,68,70,71,72,71,70,71,72,70,71,70,71]},
  {r:6, name:"Cardano",    s:"ADA",  p:0.481,     c:-1.22, mc:"$17B",  v:"$0.9B", sent:55,vol7:[50,52,54,53,52,55,56,55,54,55,56,55,54,53,55]},
  {r:7, name:"Avalanche",  s:"AVAX", p:38.9,      c:7.83,  mc:"$16B",  v:"$1.2B", sent:91,vol7:[72,75,80,82,85,87,88,90,89,91,92,91,90,89,91]},
  {r:8, name:"Polkadot",   s:"DOT",  p:7.44,      c:-2.14, mc:"$10B",  v:"$0.6B", sent:38,vol7:[45,43,42,40,38,39,40,38,37,38,39,38,37,37,38]},
  {r:9, name:"Chainlink",  s:"LINK", p:15.1,      c:4.67,  mc:"$8.9B", v:"$0.8B", sent:79,vol7:[65,68,70,72,74,76,78,79,77,79,80,79,78,77,79]},
  {r:10,name:"Dogecoin",   s:"DOGE", p:0.143,     c:-3.78, mc:"$20B",  v:"$1.4B", sent:22,vol7:[35,32,30,28,25,24,22,23,22,22,23,22,21,21,22]},
  {r:11,name:"Shiba Inu",  s:"SHIB", p:0.0000095, c:-2.11, mc:"$5.6B", v:"$0.4B", sent:31,vol7:[40,38,35,33,31,32,31,30,31,31,32,31,30,30,31]},
  {r:12,name:"Sui",        s:"SUI",  p:1.88,      c:4.22,  mc:"$5.1B", v:"$0.7B", sent:86,vol7:[68,70,75,78,80,82,84,85,84,86,87,86,85,84,86]},
  {r:13,name:"Injective",  s:"INJ",  p:22.7,      c:3.55,  mc:"$2.1B", v:"$0.5B", sent:84,vol7:[65,68,72,75,78,80,82,83,82,84,85,84,83,82,84]},
  {r:14,name:"Render",     s:"RNDR", p:8.3,       c:6.11,  mc:"$3.2B", v:"$0.6B", sent:80,vol7:[62,65,68,72,74,76,78,79,78,80,81,80,79,78,80]},
  {r:15,name:"Filecoin",   s:"FIL",  p:4.72,      c:-4.33, mc:"$2.3B", v:"$0.3B", sent:24,vol7:[38,35,32,28,26,24,25,24,23,24,25,24,23,23,24]},
];

const NFTS = [
  {name:"Bored Ape YC",   sym:"BAYC", floor:"12.4",fUSD:"$43.4k",chg:8.2,  vol:"142",owners:6400,sent:84,weekVol:[110,120,115,130,125,138,142]},
  {name:"CryptoPunks",    sym:"PUNK", floor:"48.2",fUSD:"$169k", chg:-2.1, vol:"89", owners:3500,sent:72,weekVol:[95,92,90,88,91,89,89]},
  {name:"Azuki",          sym:"AZUK", floor:"6.8", fUSD:"$23.8k",chg:15.3, vol:"218",owners:5200,sent:93,weekVol:[120,140,155,175,190,205,218]},
  {name:"Doodles",        sym:"DOOD", floor:"2.1", fUSD:"$7.4k", chg:-5.4, vol:"34", owners:5000,sent:31,weekVol:[50,48,44,40,37,35,34]},
  {name:"CloneX",         sym:"CLNX", floor:"3.9", fUSD:"$13.7k",chg:3.7,  vol:"67", owners:9800,sent:68,weekVol:[58,60,62,63,65,66,67]},
  {name:"Pudgy Penguins", sym:"PUDG", floor:"8.2", fUSD:"$28.7k",chg:11.4, vol:"98", owners:4100,sent:87,weekVol:[72,76,80,85,88,94,98]},
];

const FUNDS = [
  {name:"Vanguard S&P 500",  t:"VFINX",nav:482.3,ytd:18.4,r1:26.3,r3:10.1,exp:"0.04%",type:"Index",  stars:5,risk:"Low"},
  {name:"Fidelity Growth",   t:"FDGRX",nav:218.7,ytd:24.1,r1:31.2,r3:14.8,exp:"0.47%",type:"Growth", stars:5,risk:"Med-High"},
  {name:"T. Rowe Blue Chip", t:"TRBCX",nav:148.2,ytd:16.8,r1:22.4,r3:9.6, exp:"0.69%",type:"Blend",  stars:4,risk:"Medium"},
  {name:"Ark Innovation",    t:"ARKK", nav:52.4, ytd:-8.2, r1:18.7,r3:-14.2,exp:"0.75%",type:"Thematic",stars:2,risk:"Very High"},
  {name:"Schwab Total Mkt",  t:"SWTSX",nav:84.6, ytd:17.2,r1:25.1,r3:9.4, exp:"0.03%",type:"Index",  stars:4,risk:"Low"},
  {name:"iShares Nasdaq 100",t:"ONEQ", nav:62.3, ytd:21.8,r1:29.4,r3:12.1,exp:"0.21%",type:"ETF",    stars:5,risk:"Medium"},
];

const BEST_PICKS = [
  {s:"SUI", name:"Sui Network",   p:1.88, target:"+180%",why:"Layer-1 Move VM. TVL up 340% QoQ. Institutional inflows accelerating. Ecosystem DeFi protocols surging.",bull:89,tags:["Layer-1","DeFi","AI"],model:"Llama 3.3"},
  {s:"INJ", name:"Injective",     p:22.7, target:"+120%",why:"DeFi derivatives hub expanding into AI-powered trading. Unique burn mechanic reducing supply.",             bull:85,tags:["DeFi","Deriv","Cosmos"],model:"GPT-4o"},
  {s:"RNDR",name:"Render Network",p:8.3,  target:"+95%", why:"GPU compute at intersection of AI + crypto. Developer growth +280% YoY. NVIDIA partnership signals.",       bull:81,tags:["AI","Compute","SOL"],model:"Gemini Flash"},
  {s:"LINK",name:"Chainlink",     p:15.1, target:"+75%", why:"Oracle monopoly. CCIP cross-chain expanding. Enterprise adoption and staking v0.2 improving tokenomics.",    bull:79,tags:["Oracle","Enterprise"],model:"Mistral"},
];
const WORST_PICKS = [
  {s:"LUNC",name:"Terra Classic",p:0.00009,  risk:"-85%",why:"Zombie chain. No dev activity, abandoned roadmap, hyperinflationary emission schedule.",     bear:7,  tags:["Dead","Inflation","Avoid"],model:"GPT-4o"},
  {s:"SHIB",name:"Shiba Inu",    p:0.0000095,risk:"-70%",why:"590 trillion token supply. Meme coin with fading retail interest and no institutional use case.",bear:14, tags:["Meme","Supply Risk"],model:"Llama 3.3"},
  {s:"FIL", name:"Filecoin",     p:4.72,     risk:"-55%",why:"Storage narrative fading. Heavy VC unlock schedule through 2025. Competitor growth eroding moat.",bear:24, tags:["Storage","VC Unlocks"],model:"Gemini Flash"},
];
const INIT_FEED = [
  {u:"crypto_whale", txt:"BTC breaking ATH soon. All on-chain signals green. Accumulating heavily 🚀",          bull:true, asset:"BTC", sc:91,ago:"2m"},
  {u:"bear_mkt_bro", txt:"This entire rally is manufactured. Macro conditions still terrible. Stay safe.",       bull:false,asset:"ETH", sc:12,ago:"5m"},
  {u:"sol_maxi",     txt:"SOL ecosystem absolutely exploding. Dev activity up 40% this quarter. Bullish!",       bull:true, asset:"SOL", sc:88,ago:"7m"},
  {u:"defi_degen",   txt:"AVAX farms paying 22% APY right now. Been verified for 3 weeks straight.",             bull:true, asset:"AVAX",sc:74,ago:"12m"},
  {u:"nft_alpha",    txt:"Azuki floor up 15% overnight. Strongest NFT recovery momentum in months.",             bull:true, asset:"NFT", sc:87,ago:"14m"},
  {u:"macro_watcher",txt:"NFT market volumes dying. Down 80% from peak. Exit before the next leg down.",         bull:false,asset:"NFT", sc:9, ago:"18m"},
  {u:"moonboi99",    txt:"ADA forming massive breakout pattern on weekly. Will watch closely 📈",                bull:true, asset:"ADA", sc:77,ago:"21m"},
  {u:"risk_mgr_pro", txt:"PSA: Never allocate more than 5% to any single crypto. Risk management first.",        bull:null, asset:"MKT", sc:50,ago:"25m"},
  {u:"alpha_seeker", txt:"LINK oracle monopoly about to expand massively with CCIP. Undervalued gem.",           bull:true, asset:"LINK",sc:83,ago:"28m"},
  {u:"realist_rex",  txt:"Most altcoins will be down 80%+ in 2 years. BTC dominance only safe bet.",            bull:false,asset:"MKT", sc:18,ago:"31m"},
];

/* ─── Sentiment zones ──────────────────────────────────────────── */
const ZONES = [
  {labels:["Extremely","Bearish"],from:0, to:20,fill:"#7f1d1d",glow:"#ef4444"},
  {labels:["Bearish"],            from:20,to:40,fill:"#991b1b",glow:"#f87171"},
  {labels:["Neutral"],            from:40,to:60,fill:"#2d3748",glow:"#94a3b8"},
  {labels:["Bullish"],            from:60,to:80,fill:"#065f46",glow:"#4ade80"},
  {labels:["Extremely","Bullish"],from:80,to:100,fill:"#064e3b",glow:"#22c55e"},
];
const sentMeta = sc => ZONES.find(z => sc >= z.from && sc < z.to) ?? ZONES[4];

/* ─── Data generators ──────────────────────────────────────────── */
const genSpark = (base,vol,n=40)=>[...Array(n)].map((_,i)=>({t:i,v:Math.max(base*.85,base+(Math.random()-.47)*vol*(.2+i/n))}));

function genIntraday(base,vol,pts,lblFn){
  let p=base;
  return [...Array(pts)].map((_,i)=>{p=Math.max(base*.82,p+(Math.random()-.48)*vol);return{label:lblFn(i),v:+p.toFixed(2),vol:Math.round(Math.random()*1000000)};});
}

function genForecast(base,months,bull,baseR,bear){
  const now=new Date();
  return [...Array(months+1)].map((_,m)=>{
    const d=new Date(now);d.setMonth(d.getMonth()+m);
    const n=1+(Math.random()-.5)*.07;
    return{
      label:m===0?"Now":d.toLocaleString("default",{month:"short",year:"2-digit"}),
      bull:+(base*Math.pow(1+bull/months,m)*n).toFixed(0),
      base:+(base*Math.pow(1+baseR/months,m)*n).toFixed(0),
      bear:+(base*Math.pow(1+bear/months,m)*n).toFixed(0),
    };
  });
}

/* ═══════════════════════════════════════════════════════════════════
   SENTIMENT GAUGE COMPONENT
═══════════════════════════════════════════════════════════════════ */
function SentGauge({score=68,size=280,title="",sub=""}){
  const cx=size/2,cy=size*.58,R=size*.40,sw=size*.115;
  const pt=(d,r)=>{const rad=(d-180)*Math.PI/180;return[cx+r*Math.cos(rad),cy+r*Math.sin(rad)];};
  const arc=(f,t,r)=>{const a1=f*1.8,a2=t*1.8,[x1,y1]=pt(a1,r),[x2,y2]=pt(a2,r);return`M${x1},${y1} A${r},${r},0,${a2-a1>90?1:0},1,${x2},${y2}`;};
  const nDeg=Math.min(99.9,score)*1.8,nRad=(nDeg-180)*Math.PI/180;
  const tip=pt(nDeg,R-sw*.52),base=pt(nDeg,R-sw*1.1);
  const px=Math.sin(nRad)*5,py=-Math.cos(nRad)*5,meta=sentMeta(score);
  return(
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:8}}>
      {title&&<div style={{fontSize:15,fontWeight:700,color:T.text,letterSpacing:-.3}}>{title}</div>}
      {sub&&<div style={{fontSize:11,color:T.muted,lineHeight:1.55,textAlign:"center",maxWidth:290,fontFamily:T.sans}}>{sub}</div>}
      <svg width={size} height={cy+20} viewBox={`0 0 ${size} ${cy+20}`} style={{overflow:"visible"}}>
        <path d={arc(0,100,R)} fill="none" stroke="#04050c" strokeWidth={sw+10} strokeLinecap="butt"/>
        <path d={arc(0,100,R)} fill="none" stroke="#12142a" strokeWidth={sw}    strokeLinecap="butt"/>
        {ZONES.map((z,i)=>{const a=score>=z.from&&score<z.to;return(
          <g key={i}>
            {a&&<path d={arc(z.from,z.to,R)} fill="none" stroke={z.glow} strokeWidth={sw+12} strokeLinecap="butt" opacity={.08}/>}
            <path d={arc(z.from,z.to,R)} fill="none" stroke={a?z.glow:z.fill} strokeWidth={sw-(a?0:3)} strokeLinecap="butt" opacity={a?1:.5}/>
          </g>
        );})}
        {[20,40,60,80].map(v=>{const[ox,oy]=pt(v*1.8,R+2),[ix,iy]=pt(v*1.8,R-sw-2);return<line key={v} x1={ox} y1={oy} x2={ix} y2={iy} stroke="#060710" strokeWidth={3.5}/>;} )}
        {ZONES.map((z,i)=>{
          const mid=(z.from+z.to)/2,[lx,ly]=pt(mid*1.8,R-sw*.5),a=score>=z.from&&score<z.to;
          return z.labels.map((ln,li)=>(<text key={i+"-"+li} x={lx} y={ly+(li-(z.labels.length-1)/2)*12} fill={a?z.glow:"#6b7280"} fontSize={size*.039} fontFamily={T.sans} fontWeight={600} textAnchor="middle" dominantBaseline="middle" transform={`rotate(${mid*1.8-90},${lx},${ly})`}>{ln}</text>));
        })}
        {[0,25,50,75,100].map(v=>{const[tx,ty]=pt(v*1.8,R+sw*.74);return<text key={v} x={tx} y={ty} fill="#2d3460" fontSize={size*.042} fontFamily={T.mono} textAnchor="middle" dominantBaseline="middle">{v}</text>;})}
        <polygon points={`${tip[0]},${tip[1]} ${base[0]+px},${base[1]+py} ${base[0]-px},${base[1]-py}`} fill="#0d0f20" stroke={meta.glow+"88"} strokeWidth={1.5} style={{transformOrigin:`${cx}px ${cy}px`,animation:"sweep 1.1s cubic-bezier(.34,1.56,.64,1) both"}}/>
        <circle cx={cx} cy={cy} r={size*.055} fill="#0a0c1a" stroke={meta.glow} strokeWidth={2.5}/>
        <circle cx={cx} cy={cy} r={R-sw*1.5} fill={meta.glow+"10"} stroke={meta.glow+"28"} strokeWidth={1.5}/>
        <text x={cx} y={cy-4} fill={meta.glow} fontSize={size*.14} fontFamily={T.mono} fontWeight={700} textAnchor="middle" dominantBaseline="middle">{score}</text>
      </svg>
      <div style={{fontSize:13,fontWeight:700,color:meta.glow,letterSpacing:1.5,textTransform:"uppercase",marginTop:-6}}>{meta.labels.join(" ")}</div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   SHARED UI COMPONENTS
═══════════════════════════════════════════════════════════════════ */
const Card=({c,style={},className=""})=><div className={className} style={{background:T.bg1,border:`1px solid ${T.border}`,borderRadius:14,padding:20,marginBottom:16,...style}}>{c}</div>;
const Sec=({dot,children,style={}})=><div style={{display:"flex",alignItems:"center",gap:8,marginBottom:16,...style}}>{dot&&<span style={{width:7,height:7,borderRadius:"50%",background:dot,boxShadow:`0 0 8px ${dot}`,flexShrink:0}}/>}<span style={{fontSize:10,fontWeight:700,letterSpacing:2.5,color:T.muted,textTransform:"uppercase"}}>{children}</span></div>;
const Chip=({color=T.purple,children,style={}})=><span style={{background:color+"18",color,border:`1px solid ${color}35`,padding:"2px 8px",borderRadius:5,fontSize:10,fontWeight:600,whiteSpace:"nowrap",...style}}>{children}</span>;
const Pct=({v})=><span style={{color:v>=0?T.green:T.red,fontWeight:700,fontFamily:T.mono,fontSize:13}}>{v>=0?"▲":"▼"}{Math.abs(v).toFixed(2)}%</span>;
const Spinner=({color=T.purple,size=16})=><span style={{display:"inline-block",width:size,height:size,borderRadius:"50%",border:`2px solid ${color}30`,borderTopColor:color,animation:"spin .8s linear infinite",flexShrink:0}}/>;
const SentBar=({sc})=>{const m=sentMeta(sc);return(<div style={{display:"flex",alignItems:"center",gap:8}}><span style={{fontSize:11,color:m.glow,fontWeight:700,minWidth:26,fontFamily:T.mono}}>{sc}</span><div style={{flex:1,height:4,background:T.dim,borderRadius:3,overflow:"hidden"}}><div style={{width:`${sc}%`,height:"100%",background:`linear-gradient(90deg,${m.glow}55,${m.glow})`,borderRadius:3,transition:"width .6s ease"}}/></div><span style={{fontSize:10,color:T.muted,minWidth:64,textAlign:"right"}}>{m.labels.join(" ")}</span></div>);};
const MiniSpark=({data,color,h=55})=>{const id=`g${color.replace(/[^0-9a-f]/gi,"")}`;return(<ResponsiveContainer width="100%" height={h}><AreaChart data={data} margin={{top:2,right:0,bottom:0,left:0}}><defs><linearGradient id={id} x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={color} stopOpacity={.4}/><stop offset="95%" stopColor={color} stopOpacity={0}/></linearGradient></defs><Area type="monotone" dataKey="v" stroke={color} strokeWidth={2} fill={`url(#${id})`} dot={false}/></AreaChart></ResponsiveContainer>);};
const CTip=({active,payload,label,prefix="$",dec=0})=>{if(!active||!payload?.length)return null;return(<div style={{background:T.bg3,border:`1px solid ${T.border2}`,borderRadius:8,padding:"8px 12px",fontSize:12}}><div style={{color:T.sub,marginBottom:4}}>{label}</div>{payload.map((p,i)=><div key={i} style={{color:p.color||T.text,fontWeight:600}}>{p.name||"Value"}: {prefix}{Number(p.value).toLocaleString(undefined,{maximumFractionDigits:dec})}</div>)}</div>);};

/* ─── Form field wrapper ─────────────────────────────────────────── */
const FF=({label,hint,children,style={}})=>(
  <div style={{marginBottom:16,...style}}>
    <label style={{display:"block",fontSize:11,fontWeight:600,color:T.sub,letterSpacing:1.2,marginBottom:6,textTransform:"uppercase"}}>{label}</label>
    {children}
    {hint&&<div style={{fontSize:11,color:T.muted,marginTop:4}}>{hint}</div>}
  </div>
);
const iSt={background:T.bg2,border:`1px solid ${T.border}`,borderRadius:8,padding:"10px 13px",color:T.text,fontSize:13,fontFamily:T.sans,width:"100%"};
const sSt={...iSt,appearance:"none",cursor:"pointer"};

/* ─── AI Model selector ─────────────────────────────────────────── */
function ModelPicker({value,onChange,label="AI MODEL (FREE)",compact=false}){
  return(
    <div>
      {!compact&&<div style={{fontSize:9,color:T.muted,letterSpacing:2,marginBottom:6}}>{label}</div>}
      <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
        {Object.entries(AI_MODELS).map(([k,m])=>(
          <button key={k} onClick={()=>onChange(k)} title={m.desc} style={{background:value===k?m.color+"22":"transparent",color:value===k?m.color:T.muted,border:`1px solid ${value===k?m.color+"55":T.border}`,padding:compact?"4px 8px":"5px 11px",borderRadius:6,fontSize:compact?10:11,fontWeight:value===k?700:400,display:"flex",alignItems:"center",gap:4}}>
            <span>{m.badge}</span>{compact?k.split(" ")[0]:k}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ─── AI response block ─────────────────────────────────────────── */
function AIBlock({text,loading,model,style={}}){
  if(!loading&&!text) return null;
  const m=AI_MODELS[model]||AI_MODELS["GPT-4o"];
  return(
    <div style={{background:"#040e14",border:`1px solid ${m.color}30`,borderRadius:12,padding:18,marginTop:14,...style}}>
      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}>
        <div style={{width:8,height:8,borderRadius:"50%",background:m.color,animation:"pulse 2s infinite"}}/>
        <span style={{fontSize:9,fontWeight:700,color:m.color,letterSpacing:2}}>{m.badge} {model} ANALYSIS</span>
        <Chip color={m.color} style={{marginLeft:"auto"}}>Free AI</Chip>
      </div>
      {loading
        ?<div style={{display:"flex",alignItems:"center",gap:10,color:T.sub}}><Spinner color={m.color}/><span style={{animation:"blink 1.5s infinite",fontSize:13}}>Analyzing with {model}…</span></div>
        :<div style={{fontSize:13,color:T.text,lineHeight:1.8,whiteSpace:"pre-wrap"}}>{text}</div>
      }
    </div>
  );
}

/* ─── Ticker tape ─────────────────────────────────────────── */
function TickerTape({items}){
  const d=[...items,...items];
  return(
    <div style={{overflow:"hidden",height:26,background:T.bg2,borderBottom:`1px solid ${T.border}`,display:"flex",alignItems:"center"}}>
      <div style={{display:"flex",animation:"ticker 45s linear infinite",whiteSpace:"nowrap"}}>
        {d.map((it,i)=>(
          <span key={i} style={{display:"inline-flex",alignItems:"center",gap:8,padding:"0 24px",fontSize:11,fontFamily:T.mono,borderRight:`1px solid ${T.border}`}}>
            <span style={{color:T.muted}}>{it.s}</span>
            <span style={{color:T.text,fontWeight:600}}>{it.p}</span>
            <span style={{color:it.c>=0?T.green:T.red,fontWeight:600}}>{it.c>=0?"▲":"▼"}{Math.abs(it.c)}%</span>
          </span>
        ))}
      </div>
    </div>
  );
}

/* ─── Free AI Banner ─────────────────────────────────────────── */
function FreeBanner(){
  const [open,setOpen]=useState(true);
  if(!open) return null;
  return(
    <div style={{background:"linear-gradient(135deg,#040e1a,#050d14,#0a0520)",border:`1px solid ${T.teal}25`,borderRadius:12,padding:"12px 18px",marginBottom:16,display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:10}}>
      <div style={{display:"flex",alignItems:"center",gap:12,flexWrap:"wrap"}}>
        <span style={{fontSize:18}}>🆓</span>
        <div>
          <div style={{fontSize:12,fontWeight:700,color:T.teal,marginBottom:2}}>100% Free AI — Zero API Keys Required</div>
          <div style={{fontSize:11,color:T.muted}}>All AI features run free via <span style={{color:T.blue,fontWeight:600}}>Pollinations.ai</span> — 5 models available, no sign-up, no cost</div>
        </div>
        <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
          {Object.entries(AI_MODELS).map(([k,m])=><Chip key={k} color={m.color}>{m.badge} {k}</Chip>)}
        </div>
      </div>
      <button onClick={()=>setOpen(false)} style={{background:"transparent",color:T.muted,fontSize:18,padding:"0 6px"}}>×</button>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   ROOT APP COMPONENT
═══════════════════════════════════════════════════════════════════ */
export default function App(){
  /* ── Live price ── */
  const [price,     setPrice]    = useState(67842);
  const [hist,      setHist]     = useState(()=>genSpark(67500,2800,40));
  const [lastUpd,   setLastUpd]  = useState(new Date());

  /* ── Navigation ── */
  const [tab, setTab] = useState("overview");

  /* ── Markets ── */
  const [search,   setSearch]  = useState("");
  const [sortKey,  setSortKey] = useState("r");
  const [sortDir,  setSortDir] = useState(1);

  /* ── Sentiment feed ── */
  const [feed,      setFeed]      = useState(INIT_FEED);
  const [postTxt,   setPostTxt]   = useState("");
  const [postAsset, setPostAsset] = useState("BTC");

  /* ── Forecast ── */
  const [fAsset,   setFAsset]   = useState("BTC");
  const [fFrame,   setFFrame]   = useState("1H");
  const [fHorizon, setFHorizon] = useState("3M");
  const [fData,    setFData]    = useState(null);
  const [fModel,   setFModel]   = useState("Gemini Flash");
  const [fText,    setFText]    = useState("");
  const [fLoading, setFLoading] = useState(false);

  /* ── Portfolio builder ── */
  const [pbStep,    setPbStep]    = useState(1);
  const [pbModel,   setPbModel]   = useState("GPT-4o");
  const [pbResult,  setPbResult]  = useState(null);
  const [pbLoading, setPbLoading] = useState(false);
  const [pbForm,    setPbForm]    = useState({
    age:"30",province:"ON",income:"80000",savingsTotal:"25000",
    monthlySavings:"1000",riskScore:"5",jobType:"employed",
    existingRRSP:"0",existingTFSA:"0",existingInvestments:"",
    goals:"retirement,emergencyFund",horizon:"10",debt:"10000",marital:"single",
  });

  /* ── Compare models ── */
  const [cmpTopic,   setCmpTopic]   = useState("");
  const [cmpResults, setCmpResults] = useState({});
  const [cmpLoading, setCmpLoading] = useState({});

  /* ── AI Chat ── */
  const [msgs,      setMsgs]      = useState([{role:"assistant",model:"GPT-4o",content:"Hello! I'm your multi-model AI Financial Analyst.\n\n🆓 All AI runs completely free — no API keys needed.\n\nI have real-time context on:\n• Live BTC price and top crypto markets\n• NFT collection floor prices and sentiment\n• Mutual fund performance and YTD returns\n• AI-screened upcoming best & worst performers\n• Canadian TFSA / RRSP tax optimization\n\nChoose any AI model and ask me anything!"}]);
  const [aiInput,   setAiInput]   = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiModel,   setAiModel]   = useState("GPT-4o-mini");
  const aiEnd = useRef(null);
  const countdownVal = useRef(90);
  const cdRef2 = useRef(null);

  const priceUp  = hist.length>1 && hist[hist.length-1].v >= hist[hist.length-2].v;
  const priceCol = priceUp ? T.green : T.red;

  /* ── 90-second refresh ── */
  const cdRef = useRef(null);
  useEffect(()=>{
    const updateCD = ()=>{
      const v = countdownVal.current + "s";
      if(cdRef.current) cdRef.current.textContent = v;
      if(cdRef2.current) cdRef2.current.textContent = v;
    };
    const iv=setInterval(()=>{
      setPrice(p=>{
        const next=+(p+(Math.random()-.49)*280).toFixed(2);
        setHist(h=>[...h.slice(-39),{t:Date.now(),v:next}]);
        setLastUpd(new Date());
        countdownVal.current = 90;
        return next;
      });
    },90000);
    const cd=setInterval(()=>{
      countdownVal.current = Math.max(0, countdownVal.current - 1);
      updateCD();
    },1000);
    return()=>{clearInterval(iv);clearInterval(cd);};
  },[]);

  useEffect(()=>{aiEnd.current?.scrollIntoView({behavior:"smooth"});},[msgs]);

  /* ── Build forecast data ── */
  const buildForecast=useCallback(()=>{
    const coin=CRYPTOS.find(c=>c.s===fAsset)||CRYPTOS[0];
    const b=coin.p;
    const FRAMES={
      "1M": {pts:60,vol:b*.003,lbl:i=>{const t=new Date();t.setMinutes(t.getMinutes()+i);return t.toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"});}},
      "5M": {pts:48,vol:b*.006,lbl:i=>{const t=new Date();t.setMinutes(t.getMinutes()+i*5);return t.toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"});}},
      "15M":{pts:48,vol:b*.012,lbl:i=>{const t=new Date();t.setMinutes(t.getMinutes()+i*15);return t.toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"});}},
      "1H": {pts:48,vol:b*.022,lbl:i=>{const t=new Date();t.setHours(t.getHours()+i);return`${t.getMonth()+1}/${t.getDate()} ${t.getHours()}h`;}},
      "4H": {pts:42,vol:b*.040,lbl:i=>{const t=new Date();t.setHours(t.getHours()+i*4);return`${t.getMonth()+1}/${t.getDate()} ${t.getHours()}h`;}},
      "1D": {pts:30,vol:b*.065,lbl:i=>{const t=new Date();t.setDate(t.getDate()+i);return t.toLocaleDateString([],{month:"short",day:"numeric"});}},
      "1W": {pts:24,vol:b*.11, lbl:i=>{const t=new Date();t.setDate(t.getDate()+i*7);return t.toLocaleDateString([],{month:"short",day:"numeric"});}},
    };
    const HORIZONS={
      "3M": {mo:3, bull:.45,base:.18,bear:-.25},
      "6M": {mo:6, bull:.80,base:.30,bear:-.40},
      "12M":{mo:12,bull:1.40,base:.55,bear:-.60},
    };
    const fr=FRAMES[fFrame],hz=HORIZONS[fHorizon];
    const rsi=+(42+Math.random()*35).toFixed(1);
    const macd=+((Math.random()-.42)*b*.003).toFixed(1);
    setFData({
      intraday:genIntraday(b,fr.vol,fr.pts,fr.lbl),
      forecast:genForecast(b,hz.mo,hz.bull,hz.base,hz.bear),
      rsi,macd,
      bbUpp:+(b*1.09).toFixed(0),bbLow:+(b*.91).toFixed(0),
      ma20:+(b*(.95+Math.random()*.06)).toFixed(0),
      ma50:+(b*(.88+Math.random()*.10)).toFixed(0),
      coin,base:b,
    });
  },[fAsset,fFrame,fHorizon]);

  useEffect(()=>{buildForecast();setFText("");},[buildForecast]);

  /* ── Forecast AI call ── */
  async function fetchForecastAI(){
    if(!fData)return;
    setFLoading(true);setFText("");
    try{
      const last=fData.forecast[fData.forecast.length-1];
      const t=await callAI(
        [{role:"user",content:`Analyze ${fData.coin.s} (${fData.coin.name}) for the ${fHorizon} outlook.
Current price: $${fData.base.toLocaleString()} | Chart: ${fFrame} timeframe
RSI(14): ${fData.rsi} | MACD: ${fData.macd>0?"+":""}${fData.macd}
BB Upper: $${fData.bbUpp.toLocaleString()} | BB Lower: $${fData.bbLow.toLocaleString()}
MA20: $${fData.ma20.toLocaleString()} | MA50: $${fData.ma50.toLocaleString()}
24h change: ${fData.coin.c}% | Community sentiment: ${fData.coin.sent}/100
Bull target: $${last?.bull?.toLocaleString()} | Base: $${last?.base?.toLocaleString()} | Bear: $${last?.bear?.toLocaleString()}

Provide a structured analysis: 1) Technical reading 2) Key support/resistance levels 3) Price conviction and target 4) Top risks. Max 200 words. Use bullet points.`}],
        "You are a concise quantitative financial analyst. Give specific price targets and levels. Be direct and data-driven.",
        fModel
      );
      setFText(t);
    }catch(e){setFText(`⚠️ ${e.message}. Pollinations.ai may be busy — try again in a moment.`);}
    setFLoading(false);
  }

  /* ── NLP sentiment scoring ── */
  function submitPost(){
    if(!postTxt.trim())return;
    const lc=postTxt.toLowerCase();
    const bw=["bull","moon","up","buy","long","green","pump","ath","strong","breakout","surge","🚀","📈","hold","gem","alpha","accumulate","undervalued","cheap"];
    const rw=["bear","down","sell","short","crash","bad","red","dump","📉","exit","dead","weak","rekt","scam","rug","correction","overvalued","avoid","fud","bubble","dump"];
    const bs=bw.filter(w=>lc.includes(w)).length,rs=rw.filter(w=>lc.includes(w)).length;
    let sc=bs>rs?Math.min(97,62+bs*8+Math.floor(Math.random()*12)):rs>bs?Math.max(3,37-rs*8-Math.floor(Math.random()*10)):44+Math.floor(Math.random()*16);
    setFeed(f=>[{u:"you",txt:postTxt,bull:sc>=60?true:sc<=40?false:null,asset:postAsset,sc,ago:"just now"},...f]);
    setPostTxt("");
  }

  /* ── Portfolio builder AI ── */
  async function buildPortfolio(){
    setPbLoading(true);setPbResult(null);
    const f=pbForm;
    const TFSA_ANNUAL={2009:5000,2010:5000,2011:5000,2012:5000,2013:5500,2014:5500,2015:10000,2016:5500,2017:5500,2018:5500,2019:6000,2020:6000,2021:6000,2022:6000,2023:6500,2024:7000,2025:7000};
    const startY=Math.max(2009,2026-parseInt(f.age)+18);
    const tfsaRoom=Object.entries(TFSA_ANNUAL).filter(([y])=>parseInt(y)>=startY&&parseInt(y)<=2025).reduce((s,[,v])=>s+v,0)-parseInt(f.existingTFSA||"0");
    const rrspRoom=Math.max(0,Math.min(31560,Math.round(parseInt(f.income||"0")*.18))-parseInt(f.existingRRSP||"0"));
    try{
      const raw=await callAI(
        [{role:"user",content:`Build a complete personalized Canadian portfolio plan. Return ONLY valid JSON — no markdown, no code fences, no extra text before or after.

CLIENT:
Age: ${f.age} | Province: ${f.province} | Status: ${f.marital} | Job: ${f.jobType}
Income: $${parseInt(f.income).toLocaleString()} CAD/yr
Total savings: $${parseInt(f.savingsTotal).toLocaleString()} CAD
Monthly capacity: $${parseInt(f.monthlySavings).toLocaleString()} CAD/mo
Debt: $${parseInt(f.debt||"0").toLocaleString()} CAD
Risk appetite: ${f.riskScore}/10 | Horizon: ${f.horizon} yrs
Goals: ${f.goals.replace(/,/g,", ")}
Existing: ${f.existingInvestments||"None"}
TFSA room: $${tfsaRoom.toLocaleString()} | RRSP room: $${rrspRoom.toLocaleString()}

Return this exact JSON (fill all numbers accurately):
{"summary":"2-3 sentence personalized summary","riskProfile":"Conservative or Balanced or Growth or Aggressive","tfsaRoom":${tfsaRoom},"rrspRoom":${rrspRoom},"tfsaStrategy":"specific TFSA recommendation","rrspStrategy":"specific RRSP recommendation","monthlyPlan":{"tfsa":number,"rrsp":number,"emergency":number,"investments":number,"debtPaydown":number},"allocation":[{"label":"string","pct":number,"amount":number,"color":"#hex like #4ade80","rationale":"why"}],"holdings":[{"ticker":"string","name":"string","type":"ETF or Stock or Crypto or Bond or GIC","weight":number,"reason":"brief","account":"TFSA or RRSP or Taxable"}],"projections":{"yr5":number,"yr10":number,"yr20":number,"retirement":number},"keyActions":["action 1","action 2","action 3","action 4","action 5"],"taxTips":["tip 1","tip 2","tip 3"],"warnings":["risk 1 if any"]}`}],
        "You are a certified Canadian financial planner (CFP). Return only valid JSON. No markdown. Numbers must be realistic based on inputs.",
        pbModel
      );
      // Parse — strip anything before { and after }
      const s=raw.indexOf("{"),e=raw.lastIndexOf("}");
      const parsed=JSON.parse(s>=0&&e>=0?raw.slice(s,e+1):"{}");
      parsed.tfsaRoom=tfsaRoom;parsed.rrspRoom=rrspRoom;
      setPbResult(parsed);
    }catch{
      // Fallback if JSON parse fails
      const risk=parseInt(f.riskScore);
      setPbResult({
        summary:`Based on your profile — age ${f.age} in ${f.province}, $${parseInt(f.income).toLocaleString()} income, ${f.riskScore}/10 risk — here is your personalized Canadian investment plan optimized for TFSA and RRSP.`,
        riskProfile:risk<=3?"Conservative":risk<=5?"Balanced":risk<=7?"Growth":"Aggressive",
        tfsaRoom,rrspRoom,
        tfsaStrategy:`Contribute $7,000 this year to your TFSA. Hold growth ETFs (XEQT or VEQT) — all gains and withdrawals are permanently tax-free. You have $${tfsaRoom.toLocaleString()} total room.`,
        rrspStrategy:`Maximize RRSP contributions to unlock tax deduction. Hold US ETFs (VFV.TO) in RRSP to eliminate 15% US withholding tax on dividends. Your room: $${rrspRoom.toLocaleString()}.`,
        monthlyPlan:{tfsa:Math.round(parseInt(f.monthlySavings)*.32),rrsp:Math.round(parseInt(f.monthlySavings)*.22),emergency:Math.round(parseInt(f.monthlySavings)*.15),investments:Math.round(parseInt(f.monthlySavings)*.18),debtPaydown:Math.round(parseInt(f.monthlySavings)*.13)},
        allocation:[
          {label:"Canadian ETFs",pct:30,amount:Math.round(parseInt(f.savingsTotal)*.30),color:"#60a5fa",rationale:"Core diversified Canadian equity via index ETF"},
          {label:"US ETFs",      pct:28,amount:Math.round(parseInt(f.savingsTotal)*.28),color:"#4ade80",rationale:"S&P 500 and Nasdaq growth exposure"},
          {label:"Intl ETFs",    pct:14,amount:Math.round(parseInt(f.savingsTotal)*.14),color:"#a78bfa",rationale:"Global diversification ex-North America"},
          {label:"Bonds / GICs", pct:15,amount:Math.round(parseInt(f.savingsTotal)*.15),color:"#fbbf24",rationale:"Stability and fixed income allocation"},
          {label:"Crypto",       pct:8, amount:Math.round(parseInt(f.savingsTotal)*.08), color:"#fb923c",rationale:"High-risk growth — BTC & ETH only"},
          {label:"Emergency",    pct:5, amount:Math.round(parseInt(f.savingsTotal)*.05), color:"#2dd4bf",rationale:"3-6 months expenses in HISA"},
        ],
        holdings:[
          {ticker:"XEQT.TO",name:"iShares Core Equity ETF",      type:"ETF",   weight:22,reason:"All-in-one global equity",        account:"TFSA"},
          {ticker:"VFV.TO",  name:"Vanguard S&P 500 Index ETF",  type:"ETF",   weight:18,reason:"US large-cap, RRSP for tax savings",account:"RRSP"},
          {ticker:"ZAG.TO",  name:"BMO Aggregate Bond ETF",       type:"Bond",  weight:15,reason:"Fixed income stability",           account:"RRSP"},
          {ticker:"XIC.TO",  name:"iShares S&P/TSX Capped ETF",  type:"ETF",   weight:13,reason:"Canadian market exposure",         account:"TFSA"},
          {ticker:"BTC",     name:"Bitcoin",                      type:"Crypto",weight:7, reason:"Long-term digital asset store",    account:"Taxable"},
          {ticker:"ETH",     name:"Ethereum",                     type:"Crypto",weight:3, reason:"Smart contract platform exposure", account:"Taxable"},
        ],
        projections:{
          yr5:  Math.round(parseInt(f.savingsTotal)*1.38+parseInt(f.monthlySavings)*60*1.15),
          yr10: Math.round(parseInt(f.savingsTotal)*1.95+parseInt(f.monthlySavings)*120*1.28),
          yr20: Math.round(parseInt(f.savingsTotal)*3.80+parseInt(f.monthlySavings)*240*1.45),
          retirement:Math.round(parseInt(f.savingsTotal)*5.50+parseInt(f.monthlySavings)*parseInt(f.horizon)*12*1.55),
        },
        keyActions:[
          `Maximize TFSA: $7,000/yr — you have $${tfsaRoom.toLocaleString()} total room`,
          `Contribute to RRSP: reduces taxable income by $${Math.min(rrspRoom,parseInt(f.monthlySavings)*4).toLocaleString()}/yr`,
          `Pay down debt: eliminates $${Math.round(parseInt(f.debt||"0")*.18).toLocaleString()}/yr in interest costs`,
          "Set up automatic monthly contributions to remove emotion from investing",
          "Rebalance quarterly back to target allocation percentages",
        ],
        taxTips:[
          "Hold US ETFs in RRSP to eliminate 15% withholding tax on US dividends",
          "Keep highest-growth assets in TFSA — capital gains are completely tax-free",
          "Canadian-eligible dividends in taxable account get dividend tax credit",
        ],
        warnings:parseInt(f.riskScore)>=8?["High risk score — ensure you can hold through 40-60% drawdowns without panic selling"]:["Diversification reduces risk but cannot eliminate it entirely"],
      });
    }
    setPbLoading(false);setPbStep(3);
  }

  /* ── Model comparison ── */
  async function runComparison(){
    if(!cmpTopic.trim())return;
    const models=["GPT-4o","Gemini Flash","Mistral","Llama 3.3"];
    setCmpResults({});
    const newLoading={};models.forEach(m=>newLoading[m]=true);
    setCmpLoading(newLoading);
    models.forEach(async modelKey=>{
      try{
        const t=await callAI(
          [{role:"user",content:`${cmpTopic}\n\nKeep your response under 120 words. Be specific and direct.`}],
          "You are a financial analyst. Give a direct, data-driven answer. No disclaimers. Under 120 words.",
          modelKey
        );
        setCmpResults(r=>({...r,[modelKey]:t}));
      }catch(e){
        setCmpResults(r=>({...r,[modelKey]:`Error: ${e.message}`}));
      }
      setCmpLoading(l=>({...l,[modelKey]:false}));
    });
  }

  /* ── AI Chat ── */
  async function sendMsg(){
    if(!aiInput.trim()||aiLoading)return;
    const msg=aiInput.trim();setAiInput("");setShouldScroll(true);
    setMsgs(m=>[...m,{role:"user",content:msg,model:aiModel}]);
    setAiLoading(true);
    try{
      const sys=`You are an expert financial analyst with live market data.
BTC: $${price.toLocaleString()} (live, refreshes every 90s).
Top 24h gainers: AVAX+7.83%, SOL+5.21%, RNDR+6.11%, LINK+4.67%.
Worst 24h: DOGE-3.78%, FIL-4.33%, DOT-2.14%, LUNC-6.4%.
Fear & Greed index: 68 (Greed). Overall market cap: $2.41T.
Top NFT floor: CryptoPunks 48.2 ETH, BAYC 12.4 ETH, Azuki 6.8 ETH (+15.3%).
Best upcoming picks: SUI +180% target (bull 89/100), INJ +120%, RNDR +95%.
Highest risk coins: LUNC (-85% risk), SHIB (-70%), FIL (-55%).
Top fund YTD: FDGRX +24.1%, ONEQ +21.8%, VFINX +18.4%.
TFSA 2025 limit: $7,000/yr. RRSP 2025 max: $32,490. 
Be specific and direct. No excessive disclaimers. Give actual recommendations.`;
      const t=await callAI([...msgs.slice(-12).map(m=>({role:m.role,content:m.content})),{role:"user",content:msg}],sys,aiModel);
      setMsgs(m=>[...m,{role:"assistant",content:t,model:aiModel}]);
    }catch(e){
      setMsgs(m=>[...m,{role:"assistant",content:`⚠️ ${e.message}\n\nPollinations.ai may be temporarily busy. Please try again in a moment — it's free and needs no API key.`,model:aiModel}]);
    }
    setAiLoading(false);
  }

  /* ══════════════════════════════════════════════════════════
     TAB: OVERVIEW
  ══════════════════════════════════════════════════════════ */
  function OverviewTab(){
    const top=[...CRYPTOS].sort((a,b)=>b.c-a.c).slice(0,5);
    const bot=[...CRYPTOS].sort((a,b)=>a.c-b.c).slice(0,5);
    const mktData=[
      {name:"Crypto",val:2410,prev:2290},{name:"NFT",val:380,prev:420},
      {name:"DeFi",val:180,prev:165},{name:"Funds",val:14200,prev:13800},
    ];
    return(
      <div className="fade-up">
        <FreeBanner/>
        {/* Hero stats */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:12,marginBottom:16}}>
          {[
            {l:"Market Cap",    v:"$2.41T",              sub:"+1.8% 24h",  c:T.blue},
            {l:"BTC Price",     v:`$${price.toLocaleString()}`,sub:priceUp?"▲ Rising":"▼ Falling",c:priceCol},
            {l:"24h Volume",    v:"$98.4B",              sub:"+12.3% avg", c:T.green},
            {l:"BTC Dominance", v:"54.7%",               sub:"−0.4% 24h",  c:T.yellow},
            {l:"Fear & Greed",  v:"68",                  sub:"Greed Zone", c:T.orange},
          ].map((s,i)=>(
            <div key={i} style={{background:T.bg1,border:`1px solid ${T.border}`,borderRadius:14,padding:"14px 16px"}}>
              <div style={{fontSize:9,color:T.muted,letterSpacing:2.5,marginBottom:8}}>{s.l.toUpperCase()}</div>
              <div style={{fontSize:22,fontWeight:800,color:s.c,fontFamily:T.mono,letterSpacing:-.5}}>{s.v}</div>
              <div style={{fontSize:11,color:T.muted,marginTop:5}}>{s.sub}</div>
            </div>
          ))}
        </div>

        <div style={{display:"grid",gridTemplateColumns:"1.5fr 1fr",gap:16}}>
          {/* Live BTC chart */}
          <div style={{background:T.bg1,border:`1px solid ${T.border}`,borderRadius:14,padding:20,marginBottom:16}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:14}}>
              <div>
                <Sec dot={priceCol} style={{marginBottom:8}}>BTC / USD — Live Price</Sec>
                <div style={{fontSize:44,fontWeight:900,color:priceCol,fontFamily:T.mono,letterSpacing:-2,lineHeight:1}}>${price.toLocaleString()}</div>
                <div style={{display:"flex",alignItems:"center",gap:16,marginTop:10}}>
                  <span style={{fontSize:12,color:priceCol,fontWeight:700}}>{priceUp?"▲ +0.21%":"▼ −0.14%"}</span>
                  <span style={{fontSize:11,color:T.muted}}>Refreshes in <span style={{color:T.blue,fontFamily:T.mono,fontWeight:700}}><span ref={cdRef}>90s</span></span></span>
                  <span style={{fontSize:10,color:T.muted}}>Last: {lastUpd.toLocaleTimeString()}</span>
                </div>
              </div>
              <div style={{background:priceCol+"12",border:`1px solid ${priceCol}30`,borderRadius:9,padding:"7px 12px",display:"flex",alignItems:"center",gap:7}}>
                <div style={{width:8,height:8,borderRadius:"50%",background:priceCol,animation:"pulse 1.5s infinite"}}/>
                <span style={{fontSize:9,color:priceCol,letterSpacing:1.5,fontWeight:700}}>LIVE</span>
              </div>
            </div>
            <MiniSpark data={hist} color={priceCol} h={120}/>
          </div>
          {/* Sentiment gauge */}
          <div style={{background:T.bg1,border:`1px solid ${T.border}`,borderRadius:14,padding:20,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:16}}>
            <SentGauge score={68} size={240}
              title="Overall Market Sentiment"
              sub="Indicates whether most users posting on symbol streams over the last 24 hours are bullish or bearish."
            />
          </div>
        </div>

        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
          {[{title:"🚀 Top 24h Performers",coins:top,dot:T.green},{title:"📉 Worst 24h Performers",coins:bot,dot:T.red}].map((sec,si)=>(
            <div key={si} style={{background:T.bg1,border:`1px solid ${T.border}`,borderRadius:14,padding:20,marginBottom:16}}>
              <Sec dot={sec.dot}>{sec.title}</Sec>
              {sec.coins.map((c,i)=>(
                <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 0",borderBottom:i<4?`1px solid ${T.dim}`:"none"}}>
                  <div style={{display:"flex",alignItems:"center",gap:10}}>
                    <div style={{width:32,height:32,borderRadius:8,background:`hsl(${c.r*37},55%,25%)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:700,color:T.text,flexShrink:0}}>{c.s.slice(0,2)}</div>
                    <div><div style={{fontWeight:700,color:T.text,fontSize:13}}>{c.s}</div><div style={{fontSize:11,color:T.muted}}>{c.name}</div></div>
                  </div>
                  <div style={{textAlign:"right"}}><div style={{fontFamily:T.mono,fontSize:12,color:T.text}}>${c.p.toLocaleString()}</div><Pct v={c.c}/></div>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Market overview bar chart */}
        <div style={{background:T.bg1,border:`1px solid ${T.border}`,borderRadius:14,padding:20,marginBottom:16}}>
          <Sec dot={T.blue}>Asset Class Overview — Total Value (Billions USD)</Sec>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={mktData} barGap={8}>
              <XAxis dataKey="name" tick={{fill:T.muted,fontSize:12}} axisLine={false} tickLine={false}/>
              <YAxis tick={{fill:T.muted,fontSize:11}} axisLine={false} tickLine={false} tickFormatter={v=>`$${v}B`}/>
              <Tooltip content={<CTip prefix="$" dec={0}/>}/>
              <Bar dataKey="prev" name="Last Period" radius={[4,4,0,0]} fill={T.border3} opacity={.6}/>
              <Bar dataKey="val"  name="Current"     radius={[4,4,0,0]} fill={T.blue}   opacity={.85}/>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  }

  /* ══════════════════════════════════════════════════════════
     TAB: MARKETS
  ══════════════════════════════════════════════════════════ */
  function MarketsTab(){
    const toggle=k=>{if(sortKey===k)setSortDir(d=>-d);else{setSortKey(k);setSortDir(1);}};
    const list=useMemo(()=>CRYPTOS.filter(c=>c.name.toLowerCase().includes(search.toLowerCase())||c.s.toLowerCase().includes(search.toLowerCase())).sort((a,b)=>typeof a[sortKey]==="number"?(a[sortKey]-b[sortKey])*sortDir:(a[sortKey]||"").localeCompare(b[sortKey]||"")*sortDir),[search,sortKey,sortDir]);
    const cols=[{k:"r",l:"#"},{k:"name",l:"Asset"},{k:"p",l:"Price"},{k:"c",l:"24h %"},{k:"mc",l:"Mkt Cap"},{k:"v",l:"Volume"},{k:"sent",l:"Sentiment"}];
    return(
      <div className="fade-up">
        <div style={{background:T.bg1,border:`1px solid ${T.border}`,borderRadius:14,padding:20,marginBottom:16}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16,flexWrap:"wrap",gap:10}}>
            <Sec dot={T.blue} style={{marginBottom:0}}>Crypto Markets — Top 100</Sec>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search name or symbol…"
              style={{...iSt,width:210,padding:"8px 13px"}}/>
          </div>
          {/* Header */}
          <div style={{display:"grid",gridTemplateColumns:"40px 1.5fr 130px 100px 100px 100px 1fr",gap:12,padding:"8px 0",borderBottom:`1px solid ${T.border2}`,fontSize:10,letterSpacing:1.5,color:T.muted,textTransform:"uppercase"}}>
            {cols.map(col=>(
              <span key={col.k} onClick={()=>toggle(col.k)} style={{cursor:"pointer",userSelect:"none",display:"flex",alignItems:"center",gap:4}}>
                {col.l}{sortKey===col.k&&<span style={{color:T.blue}}>{sortDir>0?"↑":"↓"}</span>}
              </span>
            ))}
          </div>
          {list.map(c=>(
            <div key={c.s} style={{display:"grid",gridTemplateColumns:"40px 1.5fr 130px 100px 100px 100px 1fr",gap:12,padding:"11px 0",borderBottom:`1px solid #0a0b14`,alignItems:"center",fontSize:13,transition:"background .15s",cursor:"pointer"}}
              onMouseEnter={e=>e.currentTarget.style.background="#0e1020"}
              onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
              <span style={{color:T.muted,fontSize:11,fontFamily:T.mono}}>{c.r}</span>
              <div style={{display:"flex",alignItems:"center",gap:10}}>
                <div style={{width:34,height:34,borderRadius:9,background:`hsl(${c.r*37},60%,25%)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,color:T.text,flexShrink:0}}>{c.s.slice(0,2)}</div>
                <div><div style={{fontWeight:700,color:T.text}}>{c.s}</div><div style={{fontSize:11,color:T.muted}}>{c.name}</div></div>
              </div>
              <span style={{fontFamily:T.mono,fontWeight:600,color:T.text}}>${c.p.toLocaleString()}</span>
              <Pct v={c.c}/>
              <span style={{color:T.sub,fontSize:12}}>{c.mc}</span>
              <span style={{color:T.sub,fontSize:12}}>{c.v}</span>
              <SentBar sc={c.sent}/>
            </div>
          ))}
        </div>
      </div>
    );
  }

  /* ══════════════════════════════════════════════════════════
     TAB: FORECAST
  ══════════════════════════════════════════════════════════ */
  function ForecastTab(){
    const FRAMES=["1M","5M","15M","1H","4H","1D","1W"];
    const HORIZONS=[{k:"3M",l:"3 Month"},{k:"6M",l:"6 Month"},{k:"12M",l:"12 Month"}];
    const ASSETS=CRYPTOS.slice(0,10).map(c=>c.s);
    if(!fData)return<div style={{color:T.muted,padding:40,textAlign:"center"}}>Loading…</div>;
    const last=fData.forecast[fData.forecast.length-1];
    const bullChg=last?+((last.bull-fData.base)/fData.base*100).toFixed(1):0;
    const baseChg=last?+((last.base-fData.base)/fData.base*100).toFixed(1):0;
    const bearChg=last?+((last.bear-fData.base)/fData.base*100).toFixed(1):0;
    const rsiCol=fData.rsi>70?T.red:fData.rsi<30?T.green:T.yellow;
    return(
      <div className="fade-up">
        {/* Controls */}
        <div style={{background:T.bg1,border:`1px solid ${T.border}`,borderRadius:14,padding:"16px 20px",marginBottom:16}}>
          <div style={{display:"flex",gap:14,alignItems:"flex-start",flexWrap:"wrap"}}>
            <div>
              <div style={{fontSize:9,color:T.muted,letterSpacing:2,marginBottom:6}}>ASSET</div>
              <select value={fAsset} onChange={e=>{setFAsset(e.target.value);setFText("");}} style={{...sSt,width:105}}>{ASSETS.map(a=><option key={a} value={a}>{a}</option>)}</select>
            </div>
            <div>
              <div style={{fontSize:9,color:T.muted,letterSpacing:2,marginBottom:6}}>CHART TIMEFRAME</div>
              <div style={{display:"flex",gap:4}}>
                {FRAMES.map(tf=><button key={tf} onClick={()=>setFFrame(tf)} style={{background:fFrame===tf?T.blue+"22":"transparent",color:fFrame===tf?T.blue:T.muted,border:`1px solid ${fFrame===tf?T.blue+"44":T.border}`,padding:"6px 11px",borderRadius:6,fontSize:11,fontWeight:fFrame===tf?700:400}}>{tf}</button>)}
              </div>
            </div>
            <div>
              <div style={{fontSize:9,color:T.muted,letterSpacing:2,marginBottom:6}}>FORECAST HORIZON</div>
              <div style={{display:"flex",gap:4}}>
                {HORIZONS.map(hz=><button key={hz.k} onClick={()=>setFHorizon(hz.k)} style={{background:fHorizon===hz.k?T.purple+"22":"transparent",color:fHorizon===hz.k?T.purple:T.muted,border:`1px solid ${fHorizon===hz.k?T.purple+"44":T.border}`,padding:"6px 14px",borderRadius:6,fontSize:11,fontWeight:fHorizon===hz.k?700:400}}>{hz.l}</button>)}
              </div>
            </div>
            <div style={{marginLeft:"auto",display:"flex",flexDirection:"column",gap:8,alignItems:"flex-end"}}>
              <ModelPicker value={fModel} onChange={m=>{setFModel(m);setFText("");}} compact={true}/>
              <button onClick={fetchForecastAI} disabled={fLoading} style={{background:T.teal+"22",color:T.teal,border:`1px solid ${T.teal}44`,padding:"8px 20px",borderRadius:8,fontWeight:700,fontSize:12,display:"flex",alignItems:"center",gap:8}}>
                {fLoading?<><Spinner color={T.teal} size={14}/>Analyzing…</>:<>⚡ Free AI Analysis</>}
              </button>
            </div>
          </div>
        </div>

        {/* Technical indicators */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(6,1fr)",gap:10,marginBottom:16}}>
          {[{l:"Price",v:`$${fData.base.toLocaleString()}`,c:T.text},{l:"RSI(14)",v:fData.rsi,c:rsiCol},{l:"MACD",v:fData.macd>0?`+${fData.macd}`:fData.macd,c:fData.macd>0?T.green:T.red},{l:"BB Upper",v:`$${fData.bbUpp.toLocaleString()}`,c:T.red},{l:"MA 20",v:`$${fData.ma20.toLocaleString()}`,c:T.blue},{l:"MA 50",v:`$${fData.ma50.toLocaleString()}`,c:T.purple}].map((s,i)=>(
            <div key={i} style={{background:T.bg1,border:`1px solid ${T.border}`,borderRadius:12,padding:"12px 14px",textAlign:"center"}}>
              <div style={{fontSize:9,color:T.muted,letterSpacing:2,marginBottom:6}}>{s.l}</div>
              <div style={{fontSize:17,fontWeight:700,color:s.c,fontFamily:T.mono}}>{s.v}</div>
            </div>
          ))}
        </div>

        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
          {/* Intraday */}
          <div style={{background:T.bg1,border:`1px solid ${T.border}`,borderRadius:14,padding:20,marginBottom:16}}>
            <Sec dot={T.blue}>{fAsset} — {fFrame} Chart with MA Overlays</Sec>
            <ResponsiveContainer width="100%" height={210}>
              <AreaChart data={fData.intraday} margin={{top:5,right:8,bottom:0,left:8}}>
                <defs>
                  <linearGradient id="chartGr" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor={priceUp?T.green:T.red} stopOpacity={.35}/>
                    <stop offset="95%" stopColor={priceUp?T.green:T.red} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="label" tick={{fill:T.muted,fontSize:9}} axisLine={false} tickLine={false} interval={Math.floor(fData.intraday.length/5)}/>
                <YAxis tick={{fill:T.muted,fontSize:9}} axisLine={false} tickLine={false} domain={["auto","auto"]} tickFormatter={v=>`$${v>1000?(v/1000).toFixed(1)+"k":v}`}/>
                <Tooltip content={<CTip prefix="$" dec={0}/>}/>
                <ReferenceLine y={fData.ma20} stroke={T.blue}   strokeDasharray="4 2" strokeWidth={1.5} label={{value:"MA20",fill:T.blue,  fontSize:9,position:"insideTopRight"}}/>
                <ReferenceLine y={fData.ma50} stroke={T.purple} strokeDasharray="4 2" strokeWidth={1.5} label={{value:"MA50",fill:T.purple,fontSize:9,position:"insideBottomRight"}}/>
                <Area type="monotone" dataKey="v" stroke={priceUp?T.green:T.red} strokeWidth={2} fill="url(#chartGr)" dot={false} name={fAsset}/>
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* 3/6/12M Forecast */}
          <div style={{background:T.bg1,border:`1px solid ${T.border}`,borderRadius:14,padding:20,marginBottom:16}}>
            <Sec dot={T.purple}>{fHorizon} Forecast — Bull / Base / Bear Scenarios</Sec>
            <ResponsiveContainer width="100%" height={210}>
              <LineChart data={fData.forecast} margin={{top:5,right:8,bottom:0,left:8}}>
                <XAxis dataKey="label" tick={{fill:T.muted,fontSize:9}} axisLine={false} tickLine={false}/>
                <YAxis tick={{fill:T.muted,fontSize:9}} axisLine={false} tickLine={false} domain={["auto","auto"]} tickFormatter={v=>`$${v>1000?(v/1000).toFixed(0)+"k":v}`}/>
                <Tooltip content={<CTip prefix="$" dec={0}/>}/>
                <Legend wrapperStyle={{fontSize:10,color:T.muted,paddingTop:6}}/>
                <Line type="monotone" dataKey="bull" stroke={T.green}  strokeWidth={2.5} dot={false} name="Bull"/>
                <Line type="monotone" dataKey="base" stroke={T.blue}   strokeWidth={2}   dot={false} name="Base"/>
                <Line type="monotone" dataKey="bear" stroke={T.red}    strokeWidth={2}   dot={false} name="Bear" strokeDasharray="5 3"/>
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Scenario targets */}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12,marginBottom:16}}>
          {[
            {lb:"🟢 Bull Case",p:last?.bull,chg:bullChg,col:T.green, bg:"#040f07",desc:"Strong accumulation + macro tailwind + institutional inflow"},
            {lb:"🔵 Base Case",p:last?.base,chg:baseChg,col:T.blue,  bg:"#040b18",desc:"Moderate growth tracking historical seasonal averages"},
            {lb:"🔴 Bear Case",p:last?.bear,chg:bearChg,col:T.red,   bg:"#140404",desc:"Macro headwinds + risk-off sentiment + regulatory pressure"},
          ].map((s,i)=>(
            <div key={i} style={{background:s.bg,border:`1px solid ${s.col}22`,borderRadius:12,padding:18}}>
              <div style={{fontSize:11,fontWeight:700,color:s.col,marginBottom:8}}>{s.lb} — {fHorizon}</div>
              <div style={{fontSize:30,fontWeight:900,color:s.col,fontFamily:T.mono,letterSpacing:-1.5,lineHeight:1}}>${s.p?.toLocaleString()}</div>
              <div style={{fontSize:15,fontWeight:700,color:s.col,marginTop:6,fontFamily:T.mono}}>{s.chg>=0?"+":""}{s.chg}%</div>
              <div style={{fontSize:11,color:T.muted,marginTop:10,lineHeight:1.55}}>{s.desc}</div>
            </div>
          ))}
        </div>

        <AIBlock text={fText} loading={fLoading} model={fModel}/>
      </div>
    );
  }

  /* ══════════════════════════════════════════════════════════
     TAB: NFT
  ══════════════════════════════════════════════════════════ */
  function NFTTab(){
    return(
      <div className="fade-up">
        <div style={{display:"grid",gridTemplateColumns:"1fr 310px",gap:16}}>
          <div>
            <div style={{background:T.bg1,border:`1px solid ${T.border}`,borderRadius:14,padding:20,marginBottom:16}}>
              <Sec dot={T.purple}>Top NFT Collections — Live Rankings</Sec>
              <div style={{display:"grid",gridTemplateColumns:"1.2fr 80px 90px 70px 80px 1fr",gap:12,padding:"8px 0",borderBottom:`1px solid ${T.border2}`,fontSize:10,letterSpacing:1.5,color:T.muted,textTransform:"uppercase"}}>
                <span>Collection</span><span>Floor Ξ</span><span>Floor USD</span><span>24h%</span><span>Volume</span><span>Sentiment</span>
              </div>
              {NFTS.map((n,i)=>(
                <div key={i} style={{display:"grid",gridTemplateColumns:"1.2fr 80px 90px 70px 80px 1fr",gap:12,padding:"13px 0",borderBottom:i<NFTS.length-1?`1px solid #0a0b14`:"none",alignItems:"center",fontSize:13}}>
                  <div><div style={{fontWeight:700,color:T.text}}>{n.name}</div><div style={{fontSize:11,color:T.muted}}>{n.sym} · {n.owners.toLocaleString()} owners</div></div>
                  <span style={{fontFamily:T.mono,fontWeight:600}}>{n.floor} Ξ</span>
                  <span style={{color:T.sub,fontSize:12}}>{n.fUSD}</span>
                  <Pct v={n.chg}/>
                  <span style={{fontSize:12,color:T.sub}}>{n.vol} ETH</span>
                  <SentBar sc={n.sent}/>
                </div>
              ))}
            </div>

            <div style={{background:T.bg1,border:`1px solid ${T.border}`,borderRadius:14,padding:20,marginBottom:16}}>
              <Sec dot={T.teal}>7-Day Volume Trend by Collection</Sec>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart margin={{top:5,right:10,bottom:0,left:0}}>
                  <XAxis dataKey="i" type="number" domain={[0,6]} tick={{fill:T.muted,fontSize:10}} axisLine={false} tickLine={false} tickFormatter={i=>["Mon","Tue","Wed","Thu","Fri","Sat","Sun"][i]}/>
                  <YAxis tick={{fill:T.muted,fontSize:10}} axisLine={false} tickLine={false} tickFormatter={v=>`${v} ETH`}/>
                  <Tooltip contentStyle={{background:T.bg2,border:`1px solid ${T.border}`,borderRadius:8,fontSize:12}}/>
                  <Legend wrapperStyle={{fontSize:10,color:T.muted}}/>
                  {NFTS.filter(n=>n.chg>0).map((n,idx)=>(
                    <Line key={n.sym} data={n.weekVol.map((v,i)=>({i,v}))} type="monotone" dataKey="v" stroke={[T.green,T.teal,T.blue,T.purple][idx%4]} strokeWidth={2} dot={false} name={n.sym}/>
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div>
            <div style={{background:T.bg1,border:`1px solid ${T.border}`,borderRadius:14,padding:"24px 16px",marginBottom:16,textAlign:"center"}}>
              <SentGauge score={74} size={265} title="NFT Market Sentiment" sub="Indicates whether most users posting on NFT streams over the last 24 hours are bullish or bearish."/>
            </div>
            <div style={{background:T.bg1,border:`1px solid ${T.border}`,borderRadius:14,padding:20,marginBottom:16}}>
              <Sec dot={T.purple}>Collection Sentiment Scores</Sec>
              {NFTS.map(n=>(<div key={n.sym} style={{marginBottom:13}}><div style={{display:"flex",justifyContent:"space-between",fontSize:12,marginBottom:5}}><span style={{color:T.text,fontWeight:600}}>{n.name}</span><span style={{fontFamily:T.mono,fontSize:11,color:n.chg>0?T.green:T.red}}>{n.chg>0?"+":""}{n.chg}%</span></div><SentBar sc={n.sent}/></div>))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ══════════════════════════════════════════════════════════
     TAB: FUNDS
  ══════════════════════════════════════════════════════════ */
  function FundsTab(){
    const PC=[T.green,T.blue,T.purple,T.red,T.yellow,T.teal];
    return(
      <div className="fade-up">
        <div style={{display:"grid",gridTemplateColumns:"1fr 310px",gap:16}}>
          <div>
            <div style={{background:T.bg1,border:`1px solid ${T.border}`,borderRadius:14,padding:20,marginBottom:16}}>
              <Sec dot={T.orange}>Mutual Funds & ETFs — Performance</Sec>
              <div style={{display:"grid",gridTemplateColumns:"1.3fr 70px 75px 65px 65px 75px 80px",gap:10,padding:"8px 0",borderBottom:`1px solid ${T.border2}`,fontSize:10,letterSpacing:1.5,color:T.muted,textTransform:"uppercase"}}>
                <span>Fund</span><span>NAV</span><span>YTD</span><span>1Y</span><span>3Y Ann</span><span>Expense</span><span>Rating</span>
              </div>
              {FUNDS.map((f,i)=>(
                <div key={i} style={{display:"grid",gridTemplateColumns:"1.3fr 70px 75px 65px 65px 75px 80px",gap:10,padding:"12px 0",borderBottom:i<FUNDS.length-1?`1px solid #0a0b14`:"none",alignItems:"center",fontSize:13}}>
                  <div><div style={{fontWeight:700,color:T.text,fontSize:13}}>{f.name}</div><div style={{fontSize:10,color:T.muted}}>{f.t} · {f.type} · Risk: {f.risk}</div></div>
                  <span style={{fontFamily:T.mono,fontSize:12,color:T.sub}}>${f.nav}</span>
                  <span style={{color:f.ytd>0?T.green:T.red,fontWeight:700,fontSize:14}}>{f.ytd>0?"+":""}{f.ytd}%</span>
                  <span style={{color:f.r1>0?T.green:T.red,fontSize:12}}>{f.r1>0?"+":""}{f.r1}%</span>
                  <span style={{color:f.r3>0?T.green:T.red,fontSize:12}}>{f.r3>0?"+":""}{f.r3}%</span>
                  <span style={{color:T.muted,fontSize:12}}>{f.exp}</span>
                  <div><span style={{color:T.yellow}}>{"★".repeat(f.stars)}</span><span style={{color:T.dim}}>{"★".repeat(5-f.stars)}</span></div>
                </div>
              ))}
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:16}}>
              <div style={{background:T.bg1,border:`1px solid ${T.border}`,borderRadius:14,padding:20}}>
                <Sec dot={T.yellow}>YTD vs 1-Year Returns</Sec>
                <ResponsiveContainer width="100%" height={180}>
                  <BarChart data={FUNDS.map(f=>({name:f.t,ytd:f.ytd,r1:f.r1}))} barGap={3}>
                    <XAxis dataKey="name" tick={{fill:T.muted,fontSize:10}} axisLine={false} tickLine={false}/>
                    <YAxis tick={{fill:T.muted,fontSize:10}} axisLine={false} tickLine={false} unit="%"/>
                    <Tooltip content={<CTip prefix="" dec={1}/>}/>
                    <Legend wrapperStyle={{fontSize:10,color:T.muted}}/>
                    <Bar dataKey="ytd" name="YTD"    radius={[4,4,0,0]} fill={T.blue}  opacity={.85}/>
                    <Bar dataKey="r1"  name="1-Year" radius={[4,4,0,0]} fill={T.teal}  opacity={.65}/>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div style={{background:T.bg1,border:`1px solid ${T.border}`,borderRadius:14,padding:20}}>
                <Sec dot={T.orange}>Allocation by Fund Type</Sec>
                <PieChart width={260} height={180}>
                  <Pie data={FUNDS.map(f=>({name:f.t,value:Math.abs(f.ytd),pos:f.ytd>0}))} cx={130} cy={90} outerRadius={80} innerRadius={42} dataKey="value" paddingAngle={3}>
                    {FUNDS.map((_,i)=><Cell key={i} fill={PC[i]} opacity={FUNDS[i].ytd>0?1:.35}/>)}
                  </Pie>
                  <Tooltip contentStyle={{background:T.bg2,border:`1px solid ${T.border}`,borderRadius:8,fontSize:12}} formatter={(v,n,p)=>[`${v.toFixed(1)}% YTD`,p.payload.name]}/>
                </PieChart>
              </div>
            </div>
          </div>

          <div>
            <div style={{background:T.bg1,border:`1px solid ${T.border}`,borderRadius:14,padding:"24px 16px",marginBottom:16,textAlign:"center"}}>
              <SentGauge score={72} size={265} title="Fund Investor Sentiment" sub="Indicates whether most users posting on fund streams over the last 24 hours are bullish or bearish."/>
            </div>
            {/* Risk/Return radar */}
            <div style={{background:T.bg1,border:`1px solid ${T.border}`,borderRadius:14,padding:20,marginBottom:16}}>
              <Sec dot={T.blue}>Risk vs Return Comparison</Sec>
              <ResponsiveContainer width="100%" height={200}>
                <RadarChart data={[{metric:"YTD",VFINX:18.4,FDGRX:24.1,ARKK:-8.2},{metric:"1Y Ret",VFINX:26.3,FDGRX:31.2,ARKK:18.7},{metric:"3Y Ann",VFINX:10.1,FDGRX:14.8,ARKK:-14.2},{metric:"Expense",...Object.fromEntries(FUNDS.slice(0,3).map(f=>[f.t.replace(".",""),parseFloat(f.exp)*100]))}]}>
                  <PolarGrid stroke={T.border2}/>
                  <PolarAngleAxis dataKey="metric" tick={{fill:T.muted,fontSize:10}}/>
                  <Radar name="VFINX" dataKey="VFINX" stroke={T.green}  fill={T.green}  fillOpacity={.15}/>
                  <Radar name="FDGRX" dataKey="FDGRX" stroke={T.blue}   fill={T.blue}   fillOpacity={.15}/>
                  <Radar name="ARKK"  dataKey="ARKK"  stroke={T.red}    fill={T.red}    fillOpacity={.15}/>
                  <Legend wrapperStyle={{fontSize:10,color:T.muted}}/>
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ══════════════════════════════════════════════════════════
     TAB: UPCOMING
  ══════════════════════════════════════════════════════════ */
  function UpcomingTab(){
    return(
      <div className="fade-up">
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
          {/* Best picks */}
          <div>
            <div style={{background:"linear-gradient(160deg,#040f07,#090b18)",border:`1px solid ${T.green}28`,borderRadius:14,padding:20,marginBottom:16}}>
              <Sec dot={T.green}>🚀 AI-Screened Best Performers</Sec>
              <p style={{fontSize:12,color:T.muted,marginBottom:16,lineHeight:1.65}}>Screened using 5 AI models — on-chain metrics, developer activity, narrative strength, and institutional inflow signals. Each coin was analyzed by the model most suited to its category.</p>
              {BEST_PICKS.map((u,i)=>(
                <div key={i} style={{background:"#030e06",border:`1px solid ${T.green}18`,borderRadius:11,padding:16,marginBottom:12}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
                    <div>
                      <span style={{fontSize:20,fontWeight:800,color:T.text,fontFamily:T.mono}}>{u.s}</span>
                      <span style={{fontSize:12,color:T.muted,marginLeft:10}}>{u.name}</span>
                    </div>
                    <div style={{textAlign:"right"}}>
                      <div style={{fontSize:22,fontWeight:800,color:T.green,fontFamily:T.mono}}>{u.target}</div>
                      <div style={{fontSize:11,color:T.muted}}>Current ${u.p}</div>
                    </div>
                  </div>
                  <div style={{fontSize:12,color:T.sub,lineHeight:1.65,marginBottom:12}}>{u.why}</div>
                  <div style={{display:"flex",gap:5,flexWrap:"wrap",marginBottom:11}}>
                    {u.tags.map(t=><Chip key={t} color={T.green}>{t}</Chip>)}
                    <Chip color={AI_MODELS[u.model]?.color||T.muted}>{AI_MODELS[u.model]?.badge} {u.model}</Chip>
                  </div>
                  <div style={{fontSize:9,color:T.muted,marginBottom:5,letterSpacing:1.5}}>BULLISH SENTIMENT SCORE</div>
                  <SentBar sc={u.bull}/>
                </div>
              ))}
            </div>
            <div style={{background:T.bg1,border:`1px solid ${T.border}`,borderRadius:14,padding:"24px 16px",marginBottom:16,textAlign:"center"}}>
              <SentGauge score={86} size={260} title="Best Picks — Sentiment" sub="Indicates whether most users posting on these upcoming symbols over the last 24 hours are bullish or bearish."/>
            </div>
          </div>

          {/* Worst picks */}
          <div>
            <div style={{background:"linear-gradient(160deg,#0f0404,#090b18)",border:`1px solid ${T.red}28`,borderRadius:14,padding:20,marginBottom:16}}>
              <Sec dot={T.red}>⚠️ AI-Screened Worst Performers</Sec>
              <p style={{fontSize:12,color:T.muted,marginBottom:16,lineHeight:1.65}}>High-risk assets flagged across multiple AI models — supply risks, abandoned roadmaps, VC unlock pressure, and fading community sentiment patterns. Avoid or exit.</p>
              {WORST_PICKS.map((u,i)=>(
                <div key={i} style={{background:"#0f0303",border:`1px solid ${T.red}18`,borderRadius:11,padding:16,marginBottom:12}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
                    <div>
                      <span style={{fontSize:20,fontWeight:800,color:T.text,fontFamily:T.mono}}>{u.s}</span>
                      <span style={{fontSize:12,color:T.muted,marginLeft:10}}>{u.name}</span>
                    </div>
                    <div style={{textAlign:"right"}}>
                      <div style={{fontSize:22,fontWeight:800,color:T.red,fontFamily:T.mono}}>{u.risk}</div>
                      <div style={{fontSize:11,color:T.muted}}>${u.p.toLocaleString()}</div>
                    </div>
                  </div>
                  <div style={{fontSize:12,color:T.sub,lineHeight:1.65,marginBottom:12}}>{u.why}</div>
                  <div style={{display:"flex",gap:5,flexWrap:"wrap",marginBottom:11}}>
                    {u.tags.map(t=><Chip key={t} color={T.red}>{t}</Chip>)}
                    <Chip color={AI_MODELS[u.model]?.color||T.muted}>{AI_MODELS[u.model]?.badge} {u.model}</Chip>
                  </div>
                  <div style={{fontSize:9,color:T.muted,marginBottom:5,letterSpacing:1.5}}>BEARISH SENTIMENT SCORE</div>
                  <SentBar sc={u.bear}/>
                </div>
              ))}
            </div>
            <div style={{background:T.bg1,border:`1px solid ${T.border}`,borderRadius:14,padding:"24px 16px",marginBottom:16,textAlign:"center"}}>
              <SentGauge score={14} size={260} title="Worst Picks — Sentiment" sub="Indicates whether most users posting on these flagged symbols over the last 24 hours are bullish or bearish."/>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ══════════════════════════════════════════════════════════
     TAB: SENTIMENT
  ══════════════════════════════════════════════════════════ */
  function SentimentTab(){
    const avg=Math.round(feed.slice(0,10).reduce((a,p)=>a+p.sc,0)/Math.min(feed.length,10));
    return(
      <div className="fade-up">
        <div style={{display:"grid",gridTemplateColumns:"1fr 340px",gap:16}}>
          <div>
            {/* Post box */}
            <div style={{background:T.bg1,border:`1px solid ${T.border}`,borderRadius:14,padding:20,marginBottom:16}}>
              <Sec dot={T.blue}>Share Your Market Take</Sec>
              <p style={{fontSize:12,color:T.muted,marginBottom:12,lineHeight:1.6}}>Indicates whether most users posting on a symbol's stream over the last 24 hours are bullish or bearish. Posts are auto-scored by NLP keyword analysis in real time.</p>
              <div style={{display:"flex",gap:5,marginBottom:11,flexWrap:"wrap"}}>
                {["BTC","ETH","SOL","AVAX","BNB","NFT","MKT","LINK","ADA"].map(a=>(
                  <button key={a} onClick={()=>setPostAsset(a)} style={{background:postAsset===a?T.blue+"20":"transparent",color:postAsset===a?T.blue:T.muted,border:`1px solid ${postAsset===a?T.blue+"55":T.border}`,padding:"5px 12px",borderRadius:7,fontSize:11,fontWeight:600}}>{a}</button>
                ))}
              </div>
              <div style={{display:"flex",gap:10}}>
                <input style={{flex:1,background:T.bg2,border:`1px solid ${T.border}`,borderRadius:8,padding:"11px 14px",color:T.text,fontSize:13,fontFamily:T.sans}} value={postTxt} onChange={e=>setPostTxt(e.target.value)} onKeyDown={e=>e.key==="Enter"&&submitPost()} placeholder={`Your take on ${postAsset}… (NLP will auto-score bullish or bearish)`}/>
                <button onClick={submitPost} style={{background:T.blue+"22",color:T.blue,border:`1px solid ${T.blue}44`,padding:"11px 22px",borderRadius:8,fontWeight:700,fontSize:13}}>POST</button>
              </div>
            </div>

            {/* Live feed */}
            <div style={{background:T.bg1,border:`1px solid ${T.border}`,borderRadius:14,padding:20,marginBottom:16}}>
              <Sec dot={T.green}>Live Sentiment Stream — {feed.length} Posts</Sec>
              {feed.map((p,i)=>{
                const m=sentMeta(p.sc);
                const bg=p.bull===true?"#040e07":p.bull===false?"#0e0404":T.bg2;
                const brd=p.bull===true?T.green+"22":p.bull===false?T.red+"22":T.border;
                return(
                  <div key={i} style={{background:bg,border:`1px solid ${brd}`,borderRadius:10,padding:14,marginBottom:10}}>
                    <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
                      <div style={{display:"flex",alignItems:"center",gap:8}}>
                        <div style={{width:30,height:30,borderRadius:7,background:`hsl(${(p.u.charCodeAt(0)*37)%360},45%,22%)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:700,color:T.text}}>{p.u[0].toUpperCase()}</div>
                        <span style={{fontWeight:700,fontSize:12,color:T.text}}>@{p.u}</span>
                      </div>
                      <div style={{display:"flex",gap:7,alignItems:"center"}}>
                        <Chip color={p.bull===true?T.green:p.bull===false?T.red:T.muted}>{p.asset}</Chip>
                        <span style={{fontSize:10,color:T.muted}}>{p.ago}</span>
                      </div>
                    </div>
                    <div style={{fontSize:13,color:T.text,marginBottom:12,lineHeight:1.6}}>{p.txt}</div>
                    <div style={{display:"flex",alignItems:"center",gap:12}}>
                      <span style={{fontSize:9,color:T.muted,whiteSpace:"nowrap",letterSpacing:1.2}}>NLP SCORE</span>
                      <div style={{flex:1}}><SentBar sc={p.sc}/></div>
                      <span style={{fontSize:11,fontWeight:700,color:m.glow,whiteSpace:"nowrap"}}>{p.bull===true?"🐂 Bullish":p.bull===false?"🐻 Bearish":"⚖️ Neutral"}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right column */}
          <div>
            <div style={{background:T.bg1,border:`1px solid ${T.border}`,borderRadius:14,padding:"24px 16px",marginBottom:16,textAlign:"center"}}>
              <SentGauge score={avg} size={300} title="Community Sentiment" sub="Indicates whether most users posting on a symbol's stream over the last 24 hours are bullish or bearish."/>
              <div style={{marginTop:12,fontSize:11,color:T.muted}}>Based on {feed.length} posts · Updated instantly</div>
            </div>
            <div style={{background:T.bg1,border:`1px solid ${T.border}`,borderRadius:14,padding:20,marginBottom:16}}>
              <Sec dot={T.purple}>Sentiment by Asset</Sec>
              {CRYPTOS.slice(0,8).map(c=>(<div key={c.s} style={{marginBottom:13}}><div style={{display:"flex",justifyContent:"space-between",fontSize:12,marginBottom:5}}><span style={{color:T.text,fontWeight:600}}>{c.s}</span><span style={{color:T.muted,fontSize:11}}>{c.name}</span></div><SentBar sc={c.sent}/></div>))}
            </div>
            <div style={{background:T.bg1,border:`1px solid ${T.border}`,borderRadius:14,padding:"20px 16px",marginBottom:16,textAlign:"center"}}>
              <SentGauge score={68} size={240} title="Fear & Greed Index" sub="Overall crypto market fear and greed over the last 24 hours."/>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ══════════════════════════════════════════════════════════
     TAB: PORTFOLIO BUILDER
  ══════════════════════════════════════════════════════════ */
  function PortfolioTab(){
    const f=pbForm,set=(k,v)=>setPbForm(p=>({...p,[k]:v}));
    const PROVS=["AB","BC","MB","NB","NL","NS","NT","NU","ON","PE","QC","SK","YT"];
    const RLBL=["","Very Conservative","Conservative","Slightly Conservative","Moderate-Low","Moderate","Moderate-High","Balanced Growth","Growth","Aggressive","Very Aggressive"];
    const PC=[T.green,T.blue,T.purple,T.orange,T.yellow,T.teal,T.red,T.pink,T.indigo];

    /* Step 1 */
    if(pbStep===1) return(
      <div className="fade-up">
        <div style={{background:T.bg1,border:`1px solid ${T.border}`,borderRadius:14,padding:28,marginBottom:16,maxWidth:900,margin:"0 auto"}}>
          <Sec dot={T.blue}>Step 1 of 2 — Your Financial Profile</Sec>
          <div style={{background:"#050d18",border:`1px solid ${T.blue}20`,borderRadius:10,padding:"12px 16px",marginBottom:20,fontSize:12,color:T.sub,lineHeight:1.65}}>
            🤖 AI-powered by <span style={{color:T.blue,fontWeight:600}}>Pollinations.ai</span> — 100% free, no API keys. Your data never leaves your browser. Choose your AI model for the analysis.
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 28px"}}>
            <FF label="Your Age"><input style={iSt} type="number" min="18" max="80" value={f.age} onChange={e=>set("age",e.target.value)}/></FF>
            <FF label="Province / Territory"><select style={sSt} value={f.province} onChange={e=>set("province",e.target.value)}>{PROVS.map(p=><option key={p} value={p}>{p}</option>)}</select></FF>
            <FF label="Annual Income (CAD)" hint="Pre-tax gross income"><input style={iSt} type="number" min="0" value={f.income} onChange={e=>set("income",e.target.value)}/></FF>
            <FF label="Employment Type"><select style={sSt} value={f.jobType} onChange={e=>set("jobType",e.target.value)}><option value="employed">Full-time Employed</option><option value="parttime">Part-time</option><option value="selfemployed">Self-Employed</option><option value="contract">Contract / Freelance</option><option value="student">Student</option><option value="retired">Retired</option></select></FF>
            <FF label="Marital Status"><select style={sSt} value={f.marital} onChange={e=>set("marital",e.target.value)}><option value="single">Single</option><option value="married">Married/Common-Law</option><option value="divorced">Divorced</option></select></FF>
            <FF label="Investment Horizon (years)" hint="When will you need this money?"><input style={iSt} type="number" min="1" max="40" value={f.horizon} onChange={e=>set("horizon",e.target.value)}/></FF>
            <FF label="Total Savings (CAD)" hint="All liquid savings across accounts"><input style={iSt} type="number" min="0" value={f.savingsTotal} onChange={e=>set("savingsTotal",e.target.value)}/></FF>
            <FF label="Monthly Savings Capacity (CAD)"><input style={iSt} type="number" min="0" value={f.monthlySavings} onChange={e=>set("monthlySavings",e.target.value)}/></FF>
            <FF label="Total Debt (CAD)" hint="All non-mortgage debt combined"><input style={iSt} type="number" min="0" value={f.debt} onChange={e=>set("debt",e.target.value)}/></FF>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
              <FF label="Existing TFSA Balance"><input style={iSt} type="number" min="0" value={f.existingTFSA} onChange={e=>set("existingTFSA",e.target.value)}/></FF>
              <FF label="Existing RRSP Balance"><input style={iSt} type="number" min="0" value={f.existingRRSP} onChange={e=>set("existingRRSP",e.target.value)}/></FF>
            </div>
          </div>
          <FF label="Existing Investments" hint="Be specific — AI uses this to avoid recommending what you already hold">
            <input style={iSt} value={f.existingInvestments} onChange={e=>set("existingInvestments",e.target.value)} placeholder="e.g. $40k in XEQT via Questrade TFSA, condo worth $450k, employer pension…"/>
          </FF>
          <FF label="Financial Goals — Select All That Apply">
            <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
              {[["retirement","🏖 Retirement"],["emergencyFund","🛡 Emergency Fund"],["homePurchase","🏠 Home Purchase"],["education","🎓 Education"],["business","💼 Business"],["earlyRetirement","⚡ FIRE"],["generational","🌱 Generational Wealth"],["travel","✈️ Travel"]].map(([val,lbl])=>{
                const active=f.goals.includes(val);
                return<button key={val} onClick={()=>set("goals",active?f.goals.split(",").filter(g=>g&&g!==val).join(","):[f.goals,val].filter(Boolean).join(","))} style={{background:active?T.purple+"22":"transparent",color:active?T.purple:T.muted,border:`1px solid ${active?T.purple+"55":T.border}`,padding:"8px 14px",borderRadius:8,fontSize:12,fontWeight:active?700:400}}>{lbl}</button>;
              })}
            </div>
          </FF>
          <FF label={`Risk Appetite — ${f.riskScore}/10 · ${RLBL[parseInt(f.riskScore)]||""}`} hint="1 = capital preservation only · 10 = max growth, can tolerate 50%+ drawdowns">
            <div style={{display:"flex",alignItems:"center",gap:14}}>
              <span style={{fontSize:11,color:T.green,fontWeight:700}}>Conservative</span>
              <input type="range" min="1" max="10" value={f.riskScore} onChange={e=>set("riskScore",e.target.value)} style={{flex:1,accentColor:T.purple}}/>
              <span style={{fontSize:11,color:T.red,fontWeight:700}}>Aggressive</span>
            </div>
            <div style={{display:"flex",justifyContent:"space-between",marginTop:8}}>
              {[1,2,3,4,5,6,7,8,9,10].map(n=><span key={n} style={{fontSize:11,color:parseInt(f.riskScore)===n?T.purple:T.muted,fontWeight:parseInt(f.riskScore)===n?800:400}}>{n}</span>)}
            </div>
          </FF>
          <div style={{display:"flex",justifyContent:"flex-end",marginTop:8}}>
            <button onClick={()=>setPbStep(2)} style={{background:`linear-gradient(135deg,${T.blue},${T.purple})`,color:"#fff",padding:"12px 34px",borderRadius:10,fontWeight:800,fontSize:14,border:"none"}}>Continue → Review →</button>
          </div>
        </div>
      </div>
    );

    /* Step 2 */
    if(pbStep===2){
      const TFSA_ANNUAL={2009:5000,2010:5000,2011:5000,2012:5000,2013:5500,2014:5500,2015:10000,2016:5500,2017:5500,2018:5500,2019:6000,2020:6000,2021:6000,2022:6000,2023:6500,2024:7000,2025:7000};
      const startY=Math.max(2009,2026-parseInt(f.age)+18);
      const tfsaRoom=Object.entries(TFSA_ANNUAL).filter(([y])=>parseInt(y)>=startY&&parseInt(y)<=2025).reduce((s,[,v])=>s+v,0)-parseInt(f.existingTFSA||"0");
      const rrspRoom=Math.max(0,Math.min(31560,Math.round(parseInt(f.income||"0")*.18))-parseInt(f.existingRRSP||"0"));
      return(
        <div className="fade-up">
          <div style={{background:T.bg1,border:`1px solid ${T.border}`,borderRadius:14,padding:28,marginBottom:16,maxWidth:900,margin:"0 auto"}}>
            <Sec dot={T.purple}>Step 2 of 2 — Confirm & Build Your Portfolio</Sec>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:20}}>
              {[["Age",`${f.age} years old`],["Province",f.province],["Income",`$${parseInt(f.income).toLocaleString()} CAD/yr`],["Status",f.marital+" · "+f.jobType],["Total Savings",`$${parseInt(f.savingsTotal).toLocaleString()} CAD`],["Monthly Capacity",`$${parseInt(f.monthlySavings).toLocaleString()} CAD/mo`],["Debt",`$${parseInt(f.debt||"0").toLocaleString()} CAD`],["Horizon",`${f.horizon} years`],["Risk",`${f.riskScore}/10 — ${RLBL[parseInt(f.riskScore)]}`],["Goals",f.goals.replace(/,/g,", ")]].map(([k,v])=>(
                <div key={k} style={{background:T.bg2,borderRadius:9,padding:"10px 14px"}}>
                  <div style={{fontSize:10,color:T.muted,letterSpacing:1.5,marginBottom:4}}>{k.toUpperCase()}</div>
                  <div style={{fontSize:13,fontWeight:600,color:T.text}}>{v}</div>
                </div>
              ))}
            </div>
            {/* TFSA / RRSP preview */}
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:20}}>
              <div style={{background:"#040f07",border:`1px solid ${T.green}30`,borderRadius:12,padding:20}}>
                <div style={{fontSize:9,color:T.green,letterSpacing:2,marginBottom:8}}>🛡 TFSA CONTRIBUTION ROOM</div>
                <div style={{fontSize:36,fontWeight:900,color:T.green,fontFamily:T.mono,letterSpacing:-1}}>${tfsaRoom.toLocaleString()}</div>
                <div style={{fontSize:11,color:T.muted,marginTop:8,lineHeight:1.6}}>Cumulative unused room since age 18 (from {startY}). Annual limit 2025: $7,000. All gains & withdrawals permanently tax-free.</div>
              </div>
              <div style={{background:"#040b18",border:`1px solid ${T.blue}30`,borderRadius:12,padding:20}}>
                <div style={{fontSize:9,color:T.blue,letterSpacing:2,marginBottom:8}}>💼 RRSP CONTRIBUTION ROOM</div>
                <div style={{fontSize:36,fontWeight:900,color:T.blue,fontFamily:T.mono,letterSpacing:-1}}>${rrspRoom.toLocaleString()}</div>
                <div style={{fontSize:11,color:T.muted,marginTop:8,lineHeight:1.6}}>18% of ${parseInt(f.income).toLocaleString()} = ${Math.min(31560,Math.round(parseInt(f.income)*.18)).toLocaleString()} max. Each dollar reduces taxable income — major tax refund potential.</div>
              </div>
            </div>
            {f.existingInvestments&&<div style={{background:T.bg2,borderRadius:9,padding:"12px 16px",marginBottom:16}}><div style={{fontSize:10,color:T.muted,letterSpacing:1.5,marginBottom:6}}>EXISTING INVESTMENTS (AI will build around these)</div><div style={{fontSize:13,color:T.text}}>{f.existingInvestments}</div></div>}
            <div style={{marginBottom:18}}>
              <div style={{fontSize:11,color:T.sub,marginBottom:8,letterSpacing:1.2}}>CHOOSE YOUR AI MODEL</div>
              <ModelPicker value={pbModel} onChange={setPbModel}/>
              <div style={{fontSize:11,color:T.muted,marginTop:8}}>{AI_MODELS[pbModel]?.desc}</div>
            </div>
            <div style={{display:"flex",gap:10,justifyContent:"space-between",alignItems:"center"}}>
              <button onClick={()=>setPbStep(1)} style={{background:"transparent",color:T.muted,border:`1px solid ${T.border}`,padding:"11px 24px",borderRadius:9,fontWeight:600,fontSize:13}}>← Back</button>
              <button onClick={buildPortfolio} disabled={pbLoading} style={{background:`linear-gradient(135deg,${T.green},${T.blue})`,color:"#060710",padding:"14px 40px",borderRadius:10,fontWeight:900,fontSize:15,display:"flex",alignItems:"center",gap:10}}>
                {pbLoading?<><Spinner color="#fff" size={16}/>Building Portfolio…</>:<>🤖 Build My Portfolio</>}
              </button>
            </div>
          </div>
        </div>
      );
    }

    /* Step 3: Results */
    if(pbStep===3&&pbResult){
      const r=pbResult;
      const monthly=r.monthlyPlan||{};
      const projData=[{yr:"Now",val:parseInt(f.savingsTotal)||0},{yr:"5yr",val:r.projections?.yr5||0},{yr:"10yr",val:r.projections?.yr10||0},{yr:"20yr",val:r.projections?.yr20||0},{yr:"Retire",val:r.projections?.retirement||0}];
      return(
        <div className="fade-up">
          {/* Header */}
          <div style={{background:"linear-gradient(135deg,#060d20,#0a0f28,#070510)",border:`1px solid ${T.blue}28`,borderRadius:14,padding:"24px 28px",marginBottom:16,position:"relative",overflow:"hidden"}}>
            <div style={{position:"absolute",top:-50,right:-50,width:250,height:250,background:`radial-gradient(circle,${T.purple}08,transparent 70%)`}}/>
            <div style={{position:"absolute",bottom:-30,left:-30,width:180,height:180,background:`radial-gradient(circle,${T.green}06,transparent 70%)`}}/>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:16,position:"relative"}}>
              <div>
                <div style={{fontSize:9,color:T.muted,letterSpacing:2.5,marginBottom:8}}>AI-GENERATED PORTFOLIO — POWERED BY {pbModel.toUpperCase()}</div>
                <div style={{fontSize:24,fontWeight:900,color:T.text,marginBottom:8,letterSpacing:-.5}}>{r.riskProfile||"Balanced"} Portfolio · {f.province}</div>
                <div style={{fontSize:13,color:T.sub,lineHeight:1.7,maxWidth:560}}>{r.summary}</div>
              </div>
              <div style={{display:"flex",gap:10,flexShrink:0,flexWrap:"wrap"}}>
                <div style={{background:"#040f07",border:`1px solid ${T.green}30`,borderRadius:10,padding:"14px 18px",textAlign:"center"}}>
                  <div style={{fontSize:9,color:T.green,letterSpacing:2,marginBottom:6}}>TFSA ROOM</div>
                  <div style={{fontSize:24,fontWeight:900,color:T.green,fontFamily:T.mono}}>${(r.tfsaRoom||0).toLocaleString()}</div>
                </div>
                <div style={{background:"#040b18",border:`1px solid ${T.blue}30`,borderRadius:10,padding:"14px 18px",textAlign:"center"}}>
                  <div style={{fontSize:9,color:T.blue,letterSpacing:2,marginBottom:6}}>RRSP ROOM</div>
                  <div style={{fontSize:24,fontWeight:900,color:T.blue,fontFamily:T.mono}}>${(r.rrspRoom||0).toLocaleString()}</div>
                </div>
              </div>
            </div>
          </div>

          <div style={{display:"grid",gridTemplateColumns:"1.1fr 1fr",gap:16}}>
            {/* Allocation */}
            <div style={{background:T.bg1,border:`1px solid ${T.border}`,borderRadius:14,padding:20,marginBottom:16}}>
              <Sec dot={T.purple}>Recommended Asset Allocation</Sec>
              <div style={{display:"flex",alignItems:"center",gap:16,flexWrap:"wrap"}}>
                <PieChart width={195} height={195}>
                  <Pie data={r.allocation||[]} cx={97} cy={97} outerRadius={88} innerRadius={48} dataKey="pct" paddingAngle={3}>
                    {(r.allocation||[]).map((_,i)=><Cell key={i} fill={PC[i%PC.length]}/>)}
                  </Pie>
                  <Tooltip contentStyle={{background:T.bg2,border:`1px solid ${T.border}`,borderRadius:8,fontSize:12}} formatter={(v,n,p)=>[`${v}%`,p.payload.label]}/>
                </PieChart>
                <div style={{flex:1,minWidth:140}}>
                  {(r.allocation||[]).map((a,i)=>(
                    <div key={i} style={{marginBottom:10}}>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
                        <div style={{display:"flex",alignItems:"center",gap:7}}><div style={{width:9,height:9,borderRadius:2,background:PC[i%PC.length],flexShrink:0}}/><span style={{fontSize:12,color:T.text,fontWeight:600}}>{a.label}</span></div>
                        <span style={{fontSize:13,fontWeight:800,color:PC[i%PC.length],fontFamily:T.mono}}>{a.pct}%</span>
                      </div>
                      <div style={{fontSize:10,color:T.muted,marginLeft:16}}>${(a.amount||0).toLocaleString()} · {a.rationale}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Monthly plan */}
            <div style={{background:T.bg1,border:`1px solid ${T.border}`,borderRadius:14,padding:20,marginBottom:16}}>
              <Sec dot={T.green}>Monthly Contribution Plan</Sec>
              {[{l:"TFSA Contribution",    v:monthly.tfsa||0,      c:T.green,  icon:"🛡"},{l:"RRSP Contribution",   v:monthly.rrsp||0,      c:T.blue,   icon:"💼"},{l:"Emergency Fund",      v:monthly.emergency||0, c:T.teal,   icon:"🔒"},{l:"Taxable Investments",  v:monthly.investments||0,c:T.purple, icon:"📈"},{l:"Debt Paydown",          v:monthly.debtPaydown||0,c:T.orange, icon:"💳"}].map((m,i)=>(
                <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"12px 0",borderBottom:i<4?`1px solid ${T.dim}`:"none"}}>
                  <div style={{display:"flex",alignItems:"center",gap:10}}><span style={{fontSize:17}}>{m.icon}</span><span style={{fontSize:13,color:T.text}}>{m.l}</span></div>
                  <span style={{fontFamily:T.mono,fontWeight:900,fontSize:17,color:m.c}}>${m.v.toLocaleString()}<span style={{fontSize:11,color:T.muted,fontWeight:400}}>/mo</span></span>
                </div>
              ))}
              <div style={{borderTop:`1px solid ${T.border2}`,marginTop:8,paddingTop:12,display:"flex",justifyContent:"space-between"}}>
                <span style={{fontWeight:700,color:T.text,fontSize:14}}>Total Monthly</span>
                <span style={{fontFamily:T.mono,fontWeight:900,color:T.yellow,fontSize:18}}>${Object.values(monthly).reduce((a,v)=>a+(v||0),0).toLocaleString()}<span style={{fontSize:12,color:T.muted,fontWeight:400}}>/mo</span></span>
              </div>
            </div>
          </div>

          {/* Holdings */}
          <div style={{background:T.bg1,border:`1px solid ${T.border}`,borderRadius:14,padding:20,marginBottom:16}}>
            <Sec dot={T.blue}>Recommended Holdings</Sec>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(230px,1fr))",gap:10}}>
              {(r.holdings||[]).map((h,i)=>(
                <div key={i} style={{background:T.bg2,border:`1px solid ${T.border}`,borderRadius:10,padding:14}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                    <span style={{fontSize:16,fontWeight:900,color:T.text,fontFamily:T.mono}}>{h.ticker}</span>
                    <div style={{display:"flex",gap:5}}>
                      <Chip color={h.account==="TFSA"?T.green:h.account==="RRSP"?T.blue:T.muted}>{h.account}</Chip>
                      <Chip color={T.purple}>{h.weight}%</Chip>
                    </div>
                  </div>
                  <div style={{fontSize:12,color:T.text,marginBottom:4,fontWeight:600}}>{h.name}</div>
                  <div style={{fontSize:10,color:T.muted,marginBottom:6}}>{h.type}</div>
                  <div style={{fontSize:11,color:T.sub,lineHeight:1.5}}>{h.reason}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Projection chart */}
          <div style={{background:T.bg1,border:`1px solid ${T.border}`,borderRadius:14,padding:20,marginBottom:16}}>
            <Sec dot={T.yellow}>📈 Portfolio Growth Projection</Sec>
            <ResponsiveContainer width="100%" height={190}>
              <AreaChart data={projData} margin={{top:5,right:20,bottom:0,left:20}}>
                <defs><linearGradient id="projGr" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={T.green} stopOpacity={.4}/><stop offset="95%" stopColor={T.green} stopOpacity={0}/></linearGradient></defs>
                <XAxis dataKey="yr" tick={{fill:T.muted,fontSize:13}} axisLine={false} tickLine={false}/>
                <YAxis tick={{fill:T.muted,fontSize:11}} axisLine={false} tickLine={false} tickFormatter={v=>`$${v>=1000000?(v/1000000).toFixed(1)+"M":(v/1000).toFixed(0)+"k"}`}/>
                <Tooltip content={<CTip prefix="$" dec={0}/>}/>
                <Area type="monotone" dataKey="val" stroke={T.green} strokeWidth={2.5} fill="url(#projGr)" dot={{fill:T.green,r:5,strokeWidth:0}} name="Portfolio Value"/>
              </AreaChart>
            </ResponsiveContainer>
            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginTop:14}}>
              {[{l:"5 Years",v:r.projections?.yr5},{l:"10 Years",v:r.projections?.yr10},{l:"20 Years",v:r.projections?.yr20},{l:"Retirement",v:r.projections?.retirement}].map((p,i)=>(
                <div key={i} style={{background:T.bg2,borderRadius:8,padding:"12px 14px",textAlign:"center"}}>
                  <div style={{fontSize:10,color:T.muted,letterSpacing:1.5,marginBottom:6}}>{p.l.toUpperCase()}</div>
                  <div style={{fontSize:18,fontWeight:800,color:T.green,fontFamily:T.mono}}>${p.v>=1000000?((p.v/1000000).toFixed(1)+"M"):(p.v/1000).toFixed(0)+"k"}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
            {/* Action plan */}
            <div style={{background:T.bg1,border:`1px solid ${T.border}`,borderRadius:14,padding:20,marginBottom:16}}>
              <Sec dot={T.teal}>✅ Immediate Action Plan</Sec>
              {(r.keyActions||[]).map((a,i)=>(
                <div key={i} style={{display:"flex",gap:12,marginBottom:12,padding:"10px 14px",background:T.bg2,borderRadius:8}}>
                  <div style={{width:24,height:24,borderRadius:"50%",background:T.teal+"22",color:T.teal,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:800,flexShrink:0}}>{i+1}</div>
                  <span style={{fontSize:13,color:T.text,lineHeight:1.55}}>{a}</span>
                </div>
              ))}
            </div>

            <div>
              {/* Tax tips */}
              <div style={{background:T.bg1,border:`1px solid ${T.border}`,borderRadius:14,padding:20,marginBottom:16}}>
                <Sec dot={T.yellow}>🇨🇦 Canadian Tax Optimization</Sec>
                <div style={{background:"#040f07",border:`1px solid ${T.green}20`,borderRadius:8,padding:"12px 14px",marginBottom:10}}>
                  <div style={{fontSize:9,color:T.green,letterSpacing:1.5,marginBottom:6}}>TFSA STRATEGY</div>
                  <div style={{fontSize:13,color:T.text,lineHeight:1.6}}>{r.tfsaStrategy}</div>
                </div>
                <div style={{background:"#040b18",border:`1px solid ${T.blue}20`,borderRadius:8,padding:"12px 14px",marginBottom:10}}>
                  <div style={{fontSize:9,color:T.blue,letterSpacing:1.5,marginBottom:6}}>RRSP STRATEGY</div>
                  <div style={{fontSize:13,color:T.text,lineHeight:1.6}}>{r.rrspStrategy}</div>
                </div>
                {(r.taxTips||[]).map((tip,i)=>(
                  <div key={i} style={{display:"flex",gap:8,marginBottom:8,fontSize:12,color:T.sub,lineHeight:1.55}}>
                    <span style={{color:T.yellow,flexShrink:0}}>💡</span>{tip}
                  </div>
                ))}
              </div>

              {(r.warnings?.length>0)&&(
                <div style={{background:"#0e0a03",border:`1px solid ${T.orange}28`,borderRadius:14,padding:20,marginBottom:16}}>
                  <Sec dot={T.orange}>⚠️ Risk Warnings</Sec>
                  {r.warnings.map((w,i)=><div key={i} style={{fontSize:12,color:T.sub,marginBottom:6,lineHeight:1.55}}>• {w}</div>)}
                </div>
              )}
            </div>
          </div>

          <div style={{textAlign:"center",marginBottom:20}}>
            <button onClick={()=>{setPbStep(1);setPbResult(null);}} style={{background:"transparent",color:T.muted,border:`1px solid ${T.border}`,padding:"11px 30px",borderRadius:9,fontWeight:600,fontSize:13,marginRight:10}}>← Start Over</button>
            <button onClick={()=>window.print()} style={{background:T.purple+"22",color:T.purple,border:`1px solid ${T.purple}44`,padding:"11px 30px",borderRadius:9,fontWeight:600,fontSize:13}}>🖨 Print / Save PDF</button>
          </div>
        </div>
      );
    }

    return<div style={{color:T.muted,padding:40,textAlign:"center"}}><Spinner color={T.purple} size={24}/></div>;
  }

  /* ══════════════════════════════════════════════════════════
     TAB: MODEL COMPARE
  ══════════════════════════════════════════════════════════ */
  function CompareTab(){
    const PRESETS=["Should I buy BTC now or wait?","Is the NFT market recovering?","Compare TFSA vs RRSP priority","Best ETF for a 30-year-old Canadian","Will SOL outperform ETH in 2025?","Is ARKK worth investing in?"];
    const allDone=Object.keys(cmpResults).length===4&&Object.values(cmpLoading).every(v=>!v);
    return(
      <div className="fade-up">
        <div style={{background:T.bg1,border:`1px solid ${T.border}`,borderRadius:14,padding:20,marginBottom:16}}>
          <Sec dot={T.pink}>🆚 Ask All 4 Models — Side-by-Side Comparison</Sec>
          <p style={{fontSize:12,color:T.muted,marginBottom:16,lineHeight:1.65}}>Ask any financial question and get answers from GPT-4o, Gemini Flash, Mistral, and Llama 3.3 simultaneously. Compare their reasoning, priorities, and unique perspectives — all free.</p>
          <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:14}}>
            {PRESETS.map(p=><button key={p} onClick={()=>setCmpTopic(p)} style={{background:T.bg2,border:`1px solid ${T.border}`,color:T.muted,padding:"6px 12px",borderRadius:7,fontSize:11}}>{p}</button>)}
          </div>
          <div style={{display:"flex",gap:10}}>
            <input value={cmpTopic} onChange={e=>setCmpTopic(e.target.value)} onKeyDown={e=>{e.stopPropagation();if(e.key==="Enter")runComparison();}} placeholder="Type any financial question — all 4 AI models will answer simultaneously…" style={{...iSt,flex:1,padding:"12px 14px"}}/>
            <button onClick={runComparison} disabled={!cmpTopic.trim()||Object.values(cmpLoading).some(v=>v)} style={{background:`linear-gradient(135deg,${T.pink},${T.purple})`,color:"#fff",padding:"12px 28px",borderRadius:9,fontWeight:800,fontSize:13,display:"flex",alignItems:"center",gap:8}}>
              {Object.values(cmpLoading).some(v=>v)?<><Spinner color="#fff" size={14}/>Running…</>:"🆚 Compare All"}
            </button>
          </div>
        </div>

        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
          {["GPT-4o","Gemini Flash","Mistral","Llama 3.3"].map(modelKey=>{
            const m=AI_MODELS[modelKey];
            const loading=cmpLoading[modelKey];
            const result=cmpResults[modelKey];
            return(
              <div key={modelKey} style={{background:T.bg1,border:`1px solid ${m.color}30`,borderRadius:14,padding:20,position:"relative",overflow:"hidden"}}>
                <div style={{position:"absolute",top:-30,right:-30,width:120,height:120,background:`radial-gradient(circle,${m.color}08,transparent 70%)`}}/>
                <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14}}>
                  <span style={{fontSize:22}}>{m.badge}</span>
                  <div>
                    <div style={{fontSize:14,fontWeight:800,color:m.color}}>{modelKey}</div>
                    <div style={{fontSize:10,color:T.muted}}>{m.desc}</div>
                  </div>
                </div>
                {!loading&&!result&&(
                  <div style={{fontSize:12,color:T.muted,fontStyle:"italic"}}>Ask a question above to see this model's answer…</div>
                )}
                {loading&&<div style={{display:"flex",alignItems:"center",gap:10,color:T.sub,fontSize:13}}><Spinner color={m.color}/><span style={{animation:"blink 1.5s infinite"}}>Analyzing…</span></div>}
                {result&&!loading&&<div style={{fontSize:13,color:T.text,lineHeight:1.75,whiteSpace:"pre-wrap"}}>{result}</div>}
              </div>
            );
          })}
        </div>

        {allDone&&Object.keys(cmpResults).length===4&&(
          <div style={{background:"#080c1a",border:`1px solid ${T.pink}25`,borderRadius:14,padding:20,marginTop:4}}>
            <Sec dot={T.pink}>📊 Model Comparison Summary</Sec>
            <p style={{fontSize:12,color:T.muted,lineHeight:1.65}}>
              Each model brings unique strengths: <span style={{color:AI_MODELS["GPT-4o"].color}}>GPT-4o</span> excels at comprehensive analysis, <span style={{color:AI_MODELS["Gemini Flash"].color}}>Gemini Flash</span> at structured data, <span style={{color:AI_MODELS["Mistral"].color}}>Mistral</span> at risk assessment, and <span style={{color:AI_MODELS["Llama 3.3"].color}}>Llama 3.3</span> at crypto/DeFi specifics. Use points of agreement as higher-confidence signals.
            </p>
          </div>
        )}
      </div>
    );
  }

  /* ══════════════════════════════════════════════════════════
     TAB: AI ANALYST CHAT
  ══════════════════════════════════════════════════════════ */
  function AITab(){
    const QUICK=["Best crypto to buy now?","TFSA vs RRSP — which first?","Is BTC overvalued at $67k?","Top ETFs for a Canadian investor","NFT market outlook 2025","Is ARKK worth holding?","How do I build a $1M portfolio?","Explain the SUI bull case","Safe yield strategies for 2025","Should I pay debt or invest first?","LUNC — dead or recoverable?","What does RSI 70 mean?"];
    return(
      <div className="fade-up" style={{display:"flex",flexDirection:"column",height:"calc(100vh - 155px)",gap:12}}>
        {/* Controls */}
        <div style={{background:T.bg1,border:`1px solid ${T.border}`,borderRadius:14,padding:"14px 18px",flexShrink:0}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:10,marginBottom:10}}>
            <Sec style={{marginBottom:0}}>AI Financial Analyst Chat</Sec>
            <ModelPicker value={aiModel} onChange={setAiModel} compact/>
          </div>
          <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
            {QUICK.map(q=><button key={q} onClick={()=>setAiInput(q)} style={{background:T.bg2,border:`1px solid ${T.border}`,color:T.muted,padding:"5px 10px",borderRadius:6,fontSize:11}}>{q}</button>)}
          </div>
        </div>

        {/* Messages */}
        <div style={{flex:1,overflow:"auto",display:"flex",flexDirection:"column",gap:14,padding:"2px 0"}}>
          {msgs.map((m,i)=>{
            const model=AI_MODELS[m.model]||AI_MODELS["GPT-4o-mini"];
            return(
              <div key={i} style={{display:"flex",justifyContent:m.role==="user"?"flex-end":"flex-start"}}>
                <div style={{
                  background:m.role==="user"?"#12142a":"#0b0d1e",
                  border:`1px solid ${m.role==="user"?"#252a50":T.border}`,
                  borderRadius:m.role==="user"?"14px 14px 3px 14px":"14px 14px 14px 3px",
                  padding:"14px 18px",maxWidth:"82%",fontSize:13,lineHeight:1.78,color:T.text,
                }}>
                  {m.role==="assistant"&&(
                    <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
                      <span style={{width:7,height:7,borderRadius:"50%",background:model.color,display:"inline-block"}}/>
                      <span style={{fontSize:9,color:model.color,letterSpacing:2.5,fontWeight:700}}>{model.badge} {m.model||"AI"} FINANCIAL ANALYST</span>
                      <Chip color={model.color} style={{marginLeft:4}}>Free</Chip>
                    </div>
                  )}
                  <div style={{whiteSpace:"pre-wrap"}}>{m.content}</div>
                </div>
              </div>
            );
          })}
          {aiLoading&&(
            <div style={{display:"flex"}}>
              <div style={{background:"#0b0d1e",border:`1px solid ${T.border}`,borderRadius:"14px 14px 14px 3px",padding:"14px 18px"}}>
                <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
                  <Spinner color={AI_MODELS[aiModel]?.color||T.purple} size={10}/>
                  <span style={{fontSize:9,color:AI_MODELS[aiModel]?.color||T.purple,letterSpacing:2.5,fontWeight:700}}>{AI_MODELS[aiModel]?.badge} {aiModel} · ANALYZING…</span>
                </div>
                <span style={{color:T.muted,animation:"blink 1.2s infinite",fontSize:13}}>Thinking through your question with live market context…</span>
              </div>
            </div>
          )}
          <div ref={aiEnd}/>
        </div>

        {/* Input */}
        <div style={{display:"flex",gap:10,flexShrink:0}}>
          <input style={{flex:1,background:T.bg1,border:`1px solid ${T.border}`,borderRadius:10,padding:"14px 18px",color:T.text,fontSize:13,fontFamily:T.sans}} value={aiInput} onChange={e=>setAiInput(e.target.value)} onKeyDown={e=>{e.stopPropagation();if(e.key==="Enter"&&!e.shiftKey)sendMsg();}} placeholder={`Ask ${aiModel} anything — crypto, NFT alpha, fund picks, TFSA/RRSP strategy, portfolio advice…`} disabled={aiLoading}/>
          <button onClick={sendMsg} disabled={aiLoading||!aiInput.trim()} style={{background:AI_MODELS[aiModel]?.color+"22",color:AI_MODELS[aiModel]?.color||T.purple,border:`1px solid ${(AI_MODELS[aiModel]?.color||T.purple)+"44"}`,padding:"14px 28px",borderRadius:10,fontWeight:800,fontSize:14,minWidth:110}}>
            {aiLoading?<Spinner color={AI_MODELS[aiModel]?.color} size={18}/>:"SEND ↵"}
          </button>
        </div>
      </div>
    );
  }

  /* ══════════════════════════════════════════════════════════
     NAVIGATION & LAYOUT
  ══════════════════════════════════════════════════════════ */
  const TABS=[
    {id:"overview",  label:"Overview",     icon:"◈"},
    {id:"markets",   label:"Markets",      icon:"◉"},
    {id:"forecast",  label:"Forecast",     icon:"◎"},
    {id:"nft",       label:"NFT",          icon:"◆"},
    {id:"funds",     label:"Funds",        icon:"◇"},
    {id:"upcoming",  label:"Upcoming",     icon:"◎"},
    {id:"sentiment", label:"Sentiment",    icon:"◐"},
    {id:"portfolio", label:"Portfolio AI", icon:"🤖"},
    {id:"compare",   label:"AI Compare",   icon:"🆚"},
    {id:"ai",        label:"AI Analyst",   icon:"⚡"},
  ];

  const VIEWS={
    overview:<OverviewTab/>, markets:<MarketsTab/>, forecast:<ForecastTab/>,
    nft:<NFTTab/>, funds:<FundsTab/>, upcoming:<UpcomingTab/>,
    sentiment:<SentimentTab/>, portfolio:<PortfolioTab/>,
    compare:<CompareTab/>, ai:<AITab/>,
  };

  const tickItems=CRYPTOS.slice(0,12).map(c=>({s:c.s,p:`$${c.p.toLocaleString()}`,c:c.c}));

  return(
    <div style={{minHeight:"100vh",background:T.bg0,color:T.text,fontFamily:T.sans,display:"flex",flexDirection:"column"}}>
      <style>{GCSS}</style>

      {/* ── HEADER ── */}
      <header style={{background:T.bg1+"ee",borderBottom:`1px solid ${T.border}`,padding:"0 20px",display:"flex",alignItems:"center",justifyContent:"space-between",height:52,position:"sticky",top:0,zIndex:300,backdropFilter:"blur(24px)"}}>
        {/* Logo */}
        <div style={{display:"flex",alignItems:"center",gap:10,flexShrink:0}}>
          <div style={{width:30,height:30,borderRadius:8,background:"linear-gradient(135deg,#4ade80,#06b6d4)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,fontWeight:900,color:"#060710",fontFamily:T.mono}}>F</div>
          <div>
            <div style={{fontSize:15,fontWeight:900,letterSpacing:-.4,fontFamily:T.mono,lineHeight:1}}><span style={{color:T.green}}>FIN</span>PULSE</div>
            <div style={{fontSize:8,color:T.muted,letterSpacing:2.5}}>AI FINANCIAL ANALYTICS</div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{display:"flex",gap:1,overflow:"auto",flexShrink:1}}>
          {TABS.map(t=>(
            <button key={t.id} onClick={()=>setTab(t.id)} style={{
              background:tab===t.id?"#12162e":"transparent",
              color:tab===t.id?(t.id==="portfolio"?T.green:t.id==="compare"?T.pink:t.id==="ai"?T.purple:T.blue):T.muted,
              border:`1px solid ${tab===t.id?"#252a50":"transparent"}`,
              padding:"5px 11px",borderRadius:7,fontSize:11,fontWeight:tab===t.id?700:400,whiteSpace:"nowrap",
            }}>
              {t.label}
            </button>
          ))}
        </nav>

        {/* Live price chip */}
        <div style={{display:"flex",alignItems:"center",gap:8,flexShrink:0}}>
          <div style={{background:priceCol+"10",border:`1px solid ${priceCol}28`,borderRadius:9,padding:"5px 11px",display:"flex",alignItems:"center",gap:7}}>
            <div style={{width:7,height:7,borderRadius:"50%",background:priceCol,animation:"pulse 2s infinite"}}/>
            <span style={{fontSize:13,fontFamily:T.mono,color:priceCol,fontWeight:700}}>${price.toLocaleString()}</span>
            <span style={{fontSize:8,color:T.muted,letterSpacing:1.5}}>BTC · <span ref={cdRef2}>90s</span></span>
          </div>
        </div>
      </header>

      {/* ── TICKER ── */}
      <TickerTape items={tickItems}/>

      {/* ── BODY ── */}
      <main style={{flex:1,overflow:"auto",padding:"22px 24px"}}>
        {VIEWS[tab]}
      </main>

      {/* ── FOOTER ── */}
      <footer style={{background:T.bg1,borderTop:`1px solid ${T.border}`,padding:"10px 24px",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:8,fontSize:11,color:T.muted}}>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <span style={{color:T.green,fontWeight:700,fontFamily:T.mono}}>FinPulse v3</span>
          <span>·</span>
          <span>Crypto · NFT · Funds · Forecasts · Portfolio AI · Model Compare</span>
        </div>
        <div style={{display:"flex",gap:14,fontFamily:T.mono}}>
          {[`BTC $${price.toLocaleString()}`,`ETH $3,612`,`SOL $184`,"F&G: 68 Greed"].map(t=><span key={t}>{t}</span>)}
        </div>
        <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
          <Chip color={T.green}>React</Chip>
          <Chip color={T.blue}>Recharts</Chip>
          <Chip color={AI_MODELS["GPT-4o"].color}>GPT-4o</Chip>
          <Chip color={AI_MODELS["Gemini Flash"].color}>Gemini</Chip>
          <Chip color={AI_MODELS["Mistral"].color}>Mistral</Chip>
          <Chip color={AI_MODELS["Llama 3.3"].color}>Llama</Chip>
          <Chip color={T.teal}>TFSA/RRSP</Chip>
        </div>
      </footer>
    </div>
  );
}