/**
 * FinPulse Terminal v6 — Bloomberg-Style Trading Terminal
 * No AI · No API Keys · Pure Statistics & Mathematics
 * React + Recharts
 *
 * STABILITY FIXES:
 * - Clock in its own isolated component (no App re-render)
 * - No key={tab} (prevents state destruction on tab switch)
 * - All tab components defined OUTSIDE App (no re-mount on render)
 * - All chart data via useMemo keyed to asset.s (not asset.p)
 * - Portfolio state fully interactable
 */

import { useState, useEffect, useRef, useMemo, memo } from "react";
import {
  ComposedChart, AreaChart, Area, LineChart, Line, BarChart, Bar,
  XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine,
  PieChart, Pie, Cell,
} from "recharts";

/* ─────────────────────────────────────────
   COLOURS
───────────────────────────────────────── */
const G   = "#00ff41";
const R   = "#ff4040";
const AM  = "#ffb700";
const BL  = "#00aaff";
const CY  = "#00ffff";
const WH  = "#e0e0e0";
const MU  = "#505060";
const BG  = "#07070e";
const BG1 = "#0c0c18";
const BG2 = "#111120";
const BG3 = "#161628";
const BD  = "#1e1e32";
const BD2 = "#282840";
const MN  = "'Courier New',Courier,monospace";
const PCOLS = [G, BL, AM, CY, R, "#a78bfa", "#f472b6", "#fb923c", "#2dd4bf"];

/* ─────────────────────────────────────────
   MARKET DATA
───────────────────────────────────────── */
const ALL_ASSETS = [
  {s:"BTC",   name:"Bitcoin",          p:67842,  c:2.34,  mc:1320, vol:38.2, beta:1.00, pe:null, div:null, sector:"Crypto",        region:"Global"},
  {s:"ETH",   name:"Ethereum",         p:3612,   c:1.87,  mc:430,  vol:18.6, beta:1.18, pe:null, div:null, sector:"Crypto",        region:"Global"},
  {s:"SOL",   name:"Solana",           p:184.2,  c:5.21,  mc:81,   vol:4.2,  beta:1.42, pe:null, div:null, sector:"Crypto",        region:"Global"},
  {s:"BNB",   name:"BNB",              p:601,    c:-0.43, mc:87,   vol:2.1,  beta:1.20, pe:null, div:null, sector:"Crypto",        region:"Asia"},
  {s:"XRP",   name:"XRP",              p:0.582,  c:3.15,  mc:33,   vol:1.8,  beta:1.14, pe:null, div:null, sector:"Crypto",        region:"Global"},
  {s:"AVAX",  name:"Avalanche",        p:38.9,   c:7.83,  mc:16,   vol:1.2,  beta:1.55, pe:null, div:null, sector:"Crypto",        region:"Global"},
  {s:"LINK",  name:"Chainlink",        p:15.1,   c:4.67,  mc:8.9,  vol:0.8,  beta:1.31, pe:null, div:null, sector:"Crypto",        region:"Global"},
  {s:"DOT",   name:"Polkadot",         p:7.44,   c:-2.14, mc:10,   vol:0.6,  beta:1.28, pe:null, div:null, sector:"Crypto",        region:"Europe"},
  {s:"AAPL",  name:"Apple",            p:189.30, c:1.24,  mc:2930, vol:52.4, beta:1.21, pe:31.2, div:0.44, sector:"Technology",    region:"US"},
  {s:"MSFT",  name:"Microsoft",        p:415.20, c:0.87,  mc:3080, vol:18.8, beta:0.92, pe:36.1, div:0.72, sector:"Technology",    region:"US"},
  {s:"NVDA",  name:"NVIDIA",           p:875.40, c:3.12,  mc:2150, vol:42.1, beta:1.72, pe:72.4, div:0.03, sector:"Semiconductors",region:"US"},
  {s:"AMZN",  name:"Amazon",           p:182.50, c:1.56,  mc:1900, vol:28.4, beta:1.18, pe:59.8, div:null, sector:"E-Commerce",    region:"US"},
  {s:"GOOGL", name:"Alphabet",         p:155.80, c:0.94,  mc:1940, vol:22.1, beta:1.05, pe:25.3, div:null, sector:"Technology",    region:"US"},
  {s:"META",  name:"Meta",             p:484.10, c:2.31,  mc:1240, vol:15.2, beta:1.32, pe:28.4, div:0.40, sector:"Social Media",  region:"US"},
  {s:"TSLA",  name:"Tesla",            p:248.20, c:-1.88, mc:792,  vol:88.4, beta:2.01, pe:62.1, div:null, sector:"Automotive",    region:"US"},
  {s:"JPM",   name:"JPMorgan",         p:197.40, c:0.78,  mc:567,  vol:8.4,  beta:1.12, pe:12.1, div:2.04, sector:"Banking",       region:"US"},
  {s:"V",     name:"Visa",             p:272.80, c:0.55,  mc:573,  vol:6.2,  beta:0.94, pe:30.8, div:0.76, sector:"Payments",      region:"US"},
  {s:"BRK.B", name:"Berkshire",        p:387.60, c:0.42,  mc:848,  vol:3.8,  beta:0.88, pe:21.4, div:null, sector:"Financials",    region:"US"},
  {s:"RY.TO", name:"Royal Bank",       p:134.20, c:0.62,  mc:190,  vol:4.2,  beta:0.88, pe:13.4, div:3.72, sector:"Banking",       region:"Canada"},
  {s:"TD.TO", name:"TD Bank",          p:82.50,  c:-0.34, mc:150,  vol:6.8,  beta:0.84, pe:11.8, div:4.90, sector:"Banking",       region:"Canada"},
  {s:"SHOP.TO",name:"Shopify",         p:112.40, c:2.14,  mc:144,  vol:3.4,  beta:1.48, pe:78.2, div:null, sector:"E-Commerce",    region:"Canada"},
  {s:"ENB.TO",name:"Enbridge",         p:51.30,  c:0.88,  mc:107,  vol:8.2,  beta:0.68, pe:18.2, div:7.44, sector:"Energy",        region:"Canada"},
  {s:"CNR.TO",name:"CN Rail",          p:168.90, c:0.44,  mc:119,  vol:2.8,  beta:0.78, pe:20.1, div:1.94, sector:"Transport",     region:"Canada"},
  {s:"SU.TO", name:"Suncor",           p:55.60,  c:1.24,  mc:58,   vol:5.4,  beta:1.18, pe:9.8,  div:4.10, sector:"Energy",        region:"Canada"},
  {s:"BCE.TO",name:"BCE",              p:46.20,  c:-0.72, mc:42,   vol:4.1,  beta:0.62, pe:16.4, div:9.12, sector:"Telecom",       region:"Canada"},
  {s:"ASML",  name:"ASML Holding",     p:876.20, c:1.44,  mc:344,  vol:2.1,  beta:1.24, pe:44.2, div:0.78, sector:"Semiconductors",region:"Europe"},
  {s:"LVMH",  name:"LVMH",             p:742.80, c:-0.32, mc:373,  vol:1.8,  beta:1.08, pe:22.1, div:1.82, sector:"Luxury",        region:"Europe"},
  {s:"NOVO",  name:"Novo Nordisk",     p:112.30, c:2.12,  mc:497,  vol:4.2,  beta:0.78, pe:38.2, div:1.18, sector:"Pharma",        region:"Europe"},
  {s:"SAP",   name:"SAP SE",           p:186.40, c:0.88,  mc:225,  vol:3.1,  beta:0.92, pe:32.4, div:1.20, sector:"Software",      region:"Europe"},
  {s:"SHELL", name:"Shell PLC",        p:32.80,  c:0.64,  mc:222,  vol:8.4,  beta:0.88, pe:11.2, div:3.96, sector:"Energy",        region:"Europe"},
  {s:"TSM",   name:"TSMC",             p:142.80, c:2.88,  mc:741,  vol:12.4, beta:1.18, pe:28.4, div:1.22, sector:"Semiconductors",region:"Asia"},
  {s:"BABA",  name:"Alibaba",          p:76.40,  c:-0.88, mc:186,  vol:18.4, beta:0.92, pe:9.2,  div:null, sector:"E-Commerce",    region:"Asia"},
  {s:"TCS.NS",name:"TCS India",        p:3842,   c:0.68,  mc:139,  vol:4.2,  beta:0.82, pe:28.2, div:1.44, sector:"IT Services",   region:"Asia"},
  {s:"SPY",   name:"SPDR S&P 500",     p:512.40, c:0.82,  mc:504,  vol:68.4, beta:1.00, pe:22.1, div:1.28, sector:"Broad Market",  region:"US"},
  {s:"QQQ",   name:"Nasdaq 100",       p:438.20, c:1.24,  mc:230,  vol:42.1, beta:1.18, pe:28.4, div:0.52, sector:"Technology",    region:"US"},
  {s:"GLD",   name:"SPDR Gold",        p:218.40, c:0.88,  mc:57,   vol:12.4, beta:0.08, pe:null, div:null, sector:"Commodities",   region:"Global"},
  {s:"AGG",   name:"US Bond ETF",      p:98.40,  c:0.12,  mc:107,  vol:8.4,  beta:0.14, pe:null, div:3.42, sector:"Bonds",         region:"US"},
  {s:"VFV.TO",name:"Vanguard S&P CAD", p:142.80, c:0.81,  mc:12.8, vol:4.2,  beta:0.98, pe:22.0, div:1.10, sector:"Broad Market",  region:"Canada"},
  {s:"XEQT.TO",name:"iShares Equity",  p:32.40,  c:0.68,  mc:8.4,  vol:3.8,  beta:0.94, pe:21.2, div:1.42, sector:"Broad Market",  region:"Canada"},
  {s:"XIC.TO",name:"iShares TSX",      p:38.20,  c:0.44,  mc:11.2, vol:5.2,  beta:0.88, pe:16.4, div:2.84, sector:"Canada",        region:"Canada"},
  {s:"EEM",   name:"Emerging Markets", p:42.80,  c:0.42,  mc:18.4, vol:28.4, beta:1.12, pe:12.8, div:2.14, sector:"Emerging Mkts", region:"EM"},
];

const FOREX_DATA = [
  {pair:"USD/CAD",rate:1.3624,c:-0.12,open:1.3640,h:1.3672,l:1.3588,spread:"0.3"},
  {pair:"EUR/USD",rate:1.0842,c:0.18, open:1.0824,h:1.0891,l:1.0808,spread:"0.1"},
  {pair:"GBP/USD",rate:1.2724,c:0.24, open:1.2694,h:1.2782,l:1.2688,spread:"0.2"},
  {pair:"USD/JPY",rate:149.82,c:-0.34,open:150.33,h:150.48,l:149.21,spread:"0.4"},
  {pair:"AUD/USD",rate:0.6512,c:0.44, open:0.6484,h:0.6561,l:0.6478,spread:"0.5"},
  {pair:"USD/CHF",rate:0.8842,c:-0.08,open:0.8849,h:0.8872,l:0.8814,spread:"0.3"},
  {pair:"USD/CNY",rate:7.2140,c:0.02, open:7.2124,h:7.2198,l:7.2048,spread:"1.2"},
  {pair:"CAD/JPY",rate:110.04,c:-0.22,open:110.28,h:110.62,l:109.82,spread:"0.6"},
  {pair:"EUR/GBP",rate:0.8520,c:0.08, open:0.8513,h:0.8534,l:0.8501,spread:"0.2"},
  {pair:"EUR/JPY",rate:162.44,c:-0.14,open:162.67,h:162.88,l:162.21,spread:"0.5"},
];

const FX_RATES = {USD:1,CAD:1.3624,EUR:0.9224,GBP:0.7862,JPY:149.82,AUD:1.5358,CHF:0.8842,CNY:7.2140,MXN:17.18,INR:83.12};

/* ─────────────────────────────────────────
   STATISTICS ENGINE
───────────────────────────────────────── */
function gaussRng() {
  let u=0,v=0;
  while(!u) u=Math.random();
  while(!v) v=Math.random();
  return Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*v);
}

// Seeded random so charts don't change on every render
function seededRng(seed) {
  let s = seed;
  return function() {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}

function genHistory(base, symbol) {
  const rng = seededRng(symbol.split("").reduce((a,c)=>a+c.charCodeAt(0),0));
  const sigma = base > 10000 ? 0.018 : base > 1000 ? 0.022 : base > 10 ? 0.030 : 0.042;
  let p = base * 0.85;
  const data = [];
  const now = new Date(2026, 1, 26); // fixed date so no re-gen
  for (let i = 89; i >= 0; i--) {
    const d = new Date(now); d.setDate(d.getDate() - i);
    const open = p;
    const ret = (rng() - 0.49) * sigma;
    const close = Math.max(base * 0.3, p * (1 + ret));
    const hi = Math.max(open, close) * (1 + rng() * sigma * 0.4);
    const lo = Math.min(open, close) * (1 - rng() * sigma * 0.4);
    data.push({
      t: `${d.getMonth()+1}/${d.getDate()}`,
      o: +open.toFixed(base < 1 ? 5 : 2),
      h: +hi.toFixed(base < 1 ? 5 : 2),
      l: +lo.toFixed(base < 1 ? 5 : 2),
      c: +close.toFixed(base < 1 ? 5 : 2),
      v: Math.round(rng() * 1500000 + 400000),
      ret,
    });
    p = close;
  }
  return data;
}

function calcEMA(arr, n) {
  const k = 2 / (n + 1);
  let e = arr[0];
  return arr.map(v => { e = v * k + e * (1 - k); return +e.toFixed(6); });
}

function calcSMA(arr, n) {
  return arr.map((_, i) =>
    i < n - 1 ? null : +(arr.slice(i - n + 1, i + 1).reduce((a, b) => a + b, 0) / n).toFixed(6)
  );
}

function calcRSI(closes, n = 14) {
  const out = Array(n).fill(null);
  const d = closes.slice(1).map((c, i) => c - closes[i]);
  let ag = d.slice(0, n).filter(x => x > 0).reduce((a, b) => a + b, 0) / n;
  let al = d.slice(0, n).filter(x => x < 0).map(Math.abs).reduce((a, b) => a + b, 0) / n;
  out.push(al === 0 ? 100 : +(100 - 100 / (1 + ag / al)).toFixed(2));
  for (let i = n; i < d.length; i++) {
    ag = (ag * (n - 1) + (d[i] > 0 ? d[i] : 0)) / n;
    al = (al * (n - 1) + (d[i] < 0 ? Math.abs(d[i]) : 0)) / n;
    out.push(al === 0 ? 100 : +(100 - 100 / (1 + ag / al)).toFixed(2));
  }
  return out;
}

function calcMACD(closes) {
  const e12 = calcEMA(closes, 12);
  const e26 = calcEMA(closes, 26);
  const macd = e12.map((v, i) => +(v - e26[i]).toFixed(6));
  const sig  = calcEMA(macd, 9);
  const hist = macd.map((v, i) => +(v - sig[i]).toFixed(6));
  return { macd, sig, hist };
}

function calcBB(closes, n = 20, k = 2) {
  return closes.map((_, i) => {
    if (i < n - 1) return { mid: null, up: null, lo: null };
    const sl = closes.slice(i - n + 1, i + 1);
    const m  = sl.reduce((a, b) => a + b, 0) / n;
    const sd = Math.sqrt(sl.reduce((a, b) => a + (b - m) ** 2, 0) / n);
    return { mid: +m.toFixed(4), up: +(m + k * sd).toFixed(4), lo: +(m - k * sd).toFixed(4) };
  });
}

function calcVaR(rets, conf = 0.95) {
  return +([...rets].sort((a, b) => a - b)[Math.floor((1 - conf) * rets.length)] * 100).toFixed(2);
}

function calcSharpe(rets, rf = 0.0525) {
  const m = rets.reduce((a, b) => a + b, 0) / rets.length;
  const s = Math.sqrt(rets.reduce((a, b) => a + (b - m) ** 2, 0) / rets.length);
  return s === 0 ? 0 : +((m * 252 - rf) / (s * Math.sqrt(252))).toFixed(2);
}

function monteCarlo(price, mu, sigma, days = 252, paths = 300) {
  const dt = 1 / 252;
  const allPaths = [];
  for (let p = 0; p < paths; p++) {
    let s = price;
    const path = [s];
    for (let d = 0; d < days; d++) {
      s = Math.max(price * 0.05, s * Math.exp((mu - sigma ** 2 / 2) * dt + sigma * Math.sqrt(dt) * gaussRng()));
      path.push(+s.toFixed(2));
    }
    allPaths.push(path);
  }
  const step = Math.ceil(days / 24);
  const summary = [];
  for (let d = 0; d <= days; d += step) {
    const vals = allPaths.map(p => p[Math.min(d, days)]).sort((a, b) => a - b);
    const n = vals.length;
    summary.push({ day: d, p10: vals[Math.floor(n * 0.10)], p25: vals[Math.floor(n * 0.25)], p50: vals[Math.floor(n * 0.50)], p75: vals[Math.floor(n * 0.75)], p90: vals[Math.floor(n * 0.90)] });
  }
  return summary;
}

function dcfCalc(fcf, growth, terminal, wacc, shares, years = 10) {
  let pv = 0, cf = fcf * 1e9;
  for (let y = 1; y <= years; y++) { cf *= (1 + growth); pv += cf / Math.pow(1 + wacc, y); }
  const tv = (cf * (1 + terminal)) / (wacc - terminal);
  return +((pv + tv / Math.pow(1 + wacc, years)) / (shares * 1e9)).toFixed(2);
}

function bsGreeks(S, K, T, r, sigma, type = "call") {
  if (T <= 0) return { price: Math.max(0, type === "call" ? S - K : K - S), delta: type === "call" ? 1 : -1, gamma: 0, theta: 0, vega: 0, rho: 0 };
  const d1 = (Math.log(S / K) + (r + sigma * sigma / 2) * T) / (sigma * Math.sqrt(T));
  const d2 = d1 - sigma * Math.sqrt(T);
  const Nc = x => { const t = 1 / (1 + 0.2316419 * Math.abs(x)); const p = 1 - (((((1.330274429 * t - 1.821255978) * t + 1.781477937) * t - 0.356563782) * t + 0.31938153) * t) * Math.exp(-x * x / 2) / Math.sqrt(2 * Math.PI); return x >= 0 ? p : 1 - p; };
  const price = type === "call" ? S * Nc(d1) - K * Math.exp(-r * T) * Nc(d2) : K * Math.exp(-r * T) * Nc(-d2) - S * Nc(-d1);
  const h = S * 0.001;
  const delta = (type === "call" ? Nc(d1) : Nc(d1) - 1);
  const phi   = Math.exp(-d1*d1/2)/Math.sqrt(2*Math.PI);
  const gamma = phi / (S * sigma * Math.sqrt(T));
  const theta = (-S * phi * sigma / (2 * Math.sqrt(T)) - r * K * Math.exp(-r * T) * (type === "call" ? Nc(d2) : Nc(-d2))) / 365;
  const vega  = S * phi * Math.sqrt(T) / 100;
  const rho   = (type === "call" ? K * T * Math.exp(-r * T) * Nc(d2) : -K * T * Math.exp(-r * T) * Nc(-d2)) / 100;
  return { price: +Math.max(0, price).toFixed(4), delta: +delta.toFixed(4), gamma: +gamma.toFixed(6), theta: +theta.toFixed(4), vega: +vega.toFixed(4), rho: +rho.toFixed(4) };
}

/* ─────────────────────────────────────────
   SHARED UI COMPONENTS
───────────────────────────────────────── */
const fmtPrice = v => v > 9999 ? "$" + Math.round(v).toLocaleString() : v >= 1 ? "$" + v.toFixed(2) : "$" + v;

const Chg = memo(({ v }) => (
  <span style={{ color: v > 0 ? G : v < 0 ? R : MU, fontFamily: MN, fontWeight: 700, fontSize: 11 }}>
    {v > 0 ? "+" : ""}{v.toFixed(2)}%
  </span>
));

const Lbl = ({ children }) => (
  <div style={{ fontSize: 9, color: MU, letterSpacing: 2, textTransform: "uppercase", fontFamily: MN, marginBottom: 4 }}>{children}</div>
);

const Panel = ({ children, style = {} }) => (
  <div style={{ background: BG1, border: `1px solid ${BD}`, padding: 12, ...style }}>{children}</div>
);

const Tag = ({ children, col = AM }) => (
  <span style={{ background: col + "22", color: col, border: `1px solid ${col}44`, padding: "1px 6px", fontSize: 9, fontWeight: 700, fontFamily: MN }}>{children}</span>
);

const iSt = { background: BG2, border: `1px solid ${BD2}`, color: WH, fontFamily: MN, fontSize: 12, padding: "5px 8px", width: "100%", outline: "none" };
const sSt = { ...iSt, cursor: "pointer" };

const BtnRow = ({ options, value, onChange, colOn = AM }) => (
  <div style={{ display: "flex", gap: 4 }}>
    {options.map(o => (
      <button key={o} onClick={() => onChange(o)}
        style={{ flex: 1, padding: "5px 8px", background: value === o ? colOn + "22" : BG2, color: value === o ? colOn : MU, border: `1px solid ${value === o ? colOn : BD}`, fontFamily: MN, fontSize: 10, cursor: "pointer", letterSpacing: 1 }}>
        {o}
      </button>
    ))}
  </div>
);

function ChartTip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: BG3, border: `1px solid ${BD2}`, padding: "8px 12px", fontFamily: MN, fontSize: 11 }}>
      <div style={{ color: AM, marginBottom: 4 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color || WH, marginBottom: 2 }}>
          {p.name}: {typeof p.value === "number" ? (p.value > 999 ? "$" + p.value.toLocaleString() : p.value.toFixed ? "$" + p.value : p.value) : p.value}
        </div>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────
   CLOCK — isolated so it never causes
   App or any sibling to re-render
───────────────────────────────────────── */
const Clock = memo(function Clock() {
  const ref = useRef(null);
  useEffect(() => {
    const update = () => { if (ref.current) ref.current.textContent = new Date().toLocaleTimeString("en-CA", { hour12: false }) + " ET"; };
    update();
    const iv = setInterval(update, 1000);
    return () => clearInterval(iv);
  }, []);
  return <span ref={ref} style={{ color: MU, borderLeft: `1px solid ${BD}`, paddingLeft: 10, fontFamily: MN, fontSize: 9 }} />;
});

/* ─────────────────────────────────────────
   TAB: TERMINAL
───────────────────────────────────────── */
const TabTerminal = memo(function TabTerminal({ asset }) {
  const [showBB, setShowBB] = useState(true);
  const [showMA, setShowMA] = useState(true);

  // Seeded history — stable, never re-generates on re-render
  const history = useMemo(() => genHistory(asset.p, asset.s), [asset.s]);
  const closes  = useMemo(() => history.map(d => d.c), [history]);

  const ind = useMemo(() => {
    const rsi  = calcRSI(closes);
    const { macd, sig, hist } = calcMACD(closes);
    const bb   = calcBB(closes);
    const sma20 = calcSMA(closes, 20);
    const sma50 = calcSMA(closes, 50);
    const rets  = history.map(d => d.ret);
    const nonzero = rets.filter(Boolean);
    const mu    = nonzero.reduce((a, b) => a + b, 0) / nonzero.length;
    const sigma = Math.sqrt(nonzero.reduce((a, b) => a + b ** 2, 0) / nonzero.length);
    return {
      rsi, macd, sig, hist, bb, sma20, sma50,
      sharpe: calcSharpe(nonzero),
      var95:  calcVaR(nonzero),
      sigma:  +(sigma * Math.sqrt(252) * 100).toFixed(1),
      mu:     +(mu * 252 * 100).toFixed(1),
    };
  }, [history]);

  const chartData = useMemo(() => history.map((d, i) => ({
    ...d,
    rsi:    ind.rsi[i] ?? null,
    macd:   ind.macd[i] ?? null,
    sig:    ind.sig[i] ?? null,
    mhist:  ind.hist[i] ?? null,
    bbUp:   ind.bb[i]?.up ?? null,
    bbLo:   ind.bb[i]?.lo ?? null,
    sma20:  ind.sma20[i] ?? null,
    sma50:  ind.sma50[i] ?? null,
  })), [history, ind]);

  const last = chartData[chartData.length - 1] || {};
  const rsiNow  = last.rsi  || 50;
  const macdNow = last.macd || 0;
  const sigNow  = last.sig  || 0;
  const cNow    = last.c    || asset.p;
  const m20     = last.sma20 || cNow;
  const m50     = last.sma50 || cNow;

  const signals = [
    { n: "RSI(14)", v: rsiNow > 70 ? "OVERBOUGHT" : rsiNow < 30 ? "OVERSOLD" : "NEUTRAL", col: rsiNow > 70 ? R : rsiNow < 30 ? G : MU },
    { n: "MACD",    v: macdNow > sigNow ? "BULLISH" : "BEARISH",                           col: macdNow > sigNow ? G : R },
    { n: "vs MA20", v: cNow > m20 ? "ABOVE" : "BELOW",                                     col: cNow > m20 ? G : R },
    { n: "vs MA50", v: cNow > m50 ? "ABOVE" : "BELOW",                                     col: cNow > m50 ? G : R },
    { n: "24H",     v: asset.c >= 0 ? "UPTREND" : "DOWNTREND",                             col: asset.c >= 0 ? G : R },
  ];
  const bulls = signals.filter(s => s.col === G).length;
  const sigCol = bulls >= 4 ? G : bulls <= 2 ? R : AM;
  const sigLbl = bulls >= 4 ? "STRONG BUY" : bulls === 3 ? "BUY" : bulls === 2 ? "HOLD" : "SELL";

  return (
    <div style={{ display: "flex", height: "calc(100vh - 88px)", overflow: "hidden", gap: 1 }}>
      {/* Chart column */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", padding: 8, gap: 6, minWidth: 0 }}>
        {/* Header */}
        <Panel style={{ padding: "8px 12px", display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
          <div>
            <span style={{ fontSize: 18, fontWeight: 800, fontFamily: MN, color: AM }}>{asset.s}</span>
            <span style={{ fontSize: 11, color: MU, marginLeft: 8 }}>{asset.name}</span>
          </div>
          <span style={{ fontSize: 22, fontWeight: 800, fontFamily: MN, color: asset.c >= 0 ? G : R }}>{fmtPrice(asset.p)}</span>
          <Chg v={asset.c} />
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
            {[["MC", asset.mc + "B"], ["VOL", asset.vol + "B"], ["BETA", asset.beta], ["P/E", asset.pe || "—"], ["DIV", asset.div ? asset.div + "%" : "—"]].map(([l, v]) => (
              <div key={l} style={{ borderLeft: `1px solid ${BD}`, paddingLeft: 10 }}>
                <Lbl>{l}</Lbl>
                <div style={{ fontFamily: MN, color: WH, fontSize: 11, fontWeight: 600 }}>{v}</div>
              </div>
            ))}
          </div>
          <div style={{ marginLeft: "auto", display: "flex", gap: 4 }}>
            {[["BB", showBB, setShowBB, CY], ["MA", showMA, setShowMA, AM]].map(([l, on, set, col]) => (
              <button key={l} onClick={() => set(!on)}
                style={{ padding: "3px 10px", background: on ? col + "22" : BG2, color: on ? col : MU, border: `1px solid ${on ? col : BD}`, fontFamily: MN, fontSize: 9, cursor: "pointer", letterSpacing: 1 }}>
                {l}
              </button>
            ))}
          </div>
        </Panel>

        {/* Price chart */}
        <Panel style={{ flex: 2, padding: 8, overflow: "hidden" }}>
          <Lbl>PRICE · {showBB ? "BOLLINGER BANDS · " : ""}{showMA ? "MA20/MA50 · " : ""}VOLUME — 90 DAYS</Lbl>
          <ResponsiveContainer width="100%" height="92%">
            <ComposedChart data={chartData} margin={{ top: 4, right: 4, bottom: 0, left: 2 }}>
              <XAxis dataKey="t" tick={{ fill: MU, fontSize: 8, fontFamily: MN }} tickLine={false} interval={Math.floor(chartData.length / 7)} />
              <YAxis yAxisId="p" tick={{ fill: MU, fontSize: 8, fontFamily: MN }} tickLine={false} axisLine={false}
                tickFormatter={v => v > 999 ? "$" + Math.round(v / 1000) + "k" : "$" + v} width={56} />
              <YAxis yAxisId="v" orientation="right" tick={{ fill: MU, fontSize: 8 }} tickFormatter={v => (v / 1e6).toFixed(0) + "M"} width={34} />
              <Tooltip content={<ChartTip />} />
              {showBB && <>
                <Line yAxisId="p" type="monotone" dataKey="bbUp" stroke={CY} strokeWidth={1} strokeDasharray="4 2" dot={false} name="BB Upper" isAnimationActive={false} />
                <Line yAxisId="p" type="monotone" dataKey="bbLo" stroke={CY} strokeWidth={1} strokeDasharray="4 2" dot={false} name="BB Lower" isAnimationActive={false} />
              </>}
              {showMA && <>
                <Line yAxisId="p" type="monotone" dataKey="sma20" stroke={AM} strokeWidth={1.5} dot={false} name="MA20" isAnimationActive={false} />
                <Line yAxisId="p" type="monotone" dataKey="sma50" stroke={BL} strokeWidth={1.5} dot={false} name="MA50" isAnimationActive={false} />
              </>}
              <Bar yAxisId="v" dataKey="v" fill={BD2} opacity={0.5} name="Volume" isAnimationActive={false} />
              <Line yAxisId="p" type="monotone" dataKey="c" stroke={asset.c >= 0 ? G : R} strokeWidth={2} dot={false} name="Close" isAnimationActive={false} />
            </ComposedChart>
          </ResponsiveContainer>
        </Panel>

        {/* RSI */}
        <Panel style={{ height: 96, padding: 8, overflow: "hidden" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 2 }}>
            <Lbl>RSI(14) — Overbought &gt;70 | Oversold &lt;30</Lbl>
            <span style={{ fontFamily: MN, fontSize: 10, color: rsiNow > 70 ? R : rsiNow < 30 ? G : CY }}>{rsiNow.toFixed(1)}</span>
          </div>
          <ResponsiveContainer width="100%" height="75%">
            <ComposedChart data={chartData} margin={{ top: 0, right: 4, bottom: 0, left: 2 }}>
              <XAxis hide />
              <YAxis domain={[0, 100]} tick={{ fill: MU, fontSize: 8 }} width={26} tickLine={false} axisLine={false} ticks={[0, 30, 50, 70, 100]} />
              <ReferenceLine y={70} stroke={R} strokeDasharray="3 2" strokeOpacity={0.7} />
              <ReferenceLine y={30} stroke={G} strokeDasharray="3 2" strokeOpacity={0.7} />
              <ReferenceLine y={50} stroke={BD2} />
              <Area type="monotone" dataKey="rsi" stroke={CY} strokeWidth={1.5} fill={CY} fillOpacity={0.07} dot={false} name="RSI" isAnimationActive={false} />
            </ComposedChart>
          </ResponsiveContainer>
        </Panel>

        {/* MACD */}
        <Panel style={{ height: 96, padding: 8, overflow: "hidden" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 2 }}>
            <Lbl>MACD(12,26,9) — Signal Crossover Strategy</Lbl>
            <span style={{ fontFamily: MN, fontSize: 10, color: macdNow > sigNow ? G : R }}>{macdNow.toFixed(4)}</span>
          </div>
          <ResponsiveContainer width="100%" height="75%">
            <ComposedChart data={chartData} margin={{ top: 0, right: 4, bottom: 0, left: 2 }}>
              <XAxis hide />
              <YAxis tick={{ fill: MU, fontSize: 8 }} width={36} tickLine={false} axisLine={false} />
              <ReferenceLine y={0} stroke={BD2} />
              <Bar dataKey="mhist" name="Hist" isAnimationActive={false}>
                {chartData.map((d, i) => <Cell key={i} fill={d.mhist >= 0 ? G : R} />)}
              </Bar>
              <Line type="monotone" dataKey="macd" stroke={CY} strokeWidth={1.5} dot={false} name="MACD" isAnimationActive={false} />
              <Line type="monotone" dataKey="sig"  stroke={AM} strokeWidth={1.5} dot={false} name="Signal" isAnimationActive={false} />
            </ComposedChart>
          </ResponsiveContainer>
        </Panel>
      </div>

      {/* Stats sidebar */}
      <div style={{ width: 195, background: BG1, borderLeft: `1px solid ${BD}`, overflowY: "auto", padding: 10, display: "flex", flexDirection: "column", gap: 14, flexShrink: 0 }}>
        <div>
          <Lbl>Risk Metrics</Lbl>
          {[["Sharpe", ind.sharpe, ""], ["Volatility", ind.sigma, "%/yr"], ["Annual Drift", ind.mu, "%"], ["VaR 95% (1D)", ind.var95, "%"], ["Beta", asset.beta, ""]].map(([l, v, u]) => (
            <div key={l} style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", borderBottom: `1px solid ${BD}22` }}>
              <span style={{ fontSize: 10, color: MU, fontFamily: MN }}>{l}</span>
              <span style={{ fontSize: 11, fontFamily: MN, fontWeight: 700, color: typeof v === "number" && v > 0 ? G : typeof v === "number" && v < 0 ? R : WH }}>{v}{u}</span>
            </div>
          ))}
        </div>

        <div>
          <Lbl>Technical Signals</Lbl>
          {signals.map(s => (
            <div key={s.n} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
              <span style={{ fontSize: 9, fontFamily: MN, color: MU }}>{s.n}</span>
              <Tag col={s.col}>{s.v}</Tag>
            </div>
          ))}
          <div style={{ marginTop: 8, padding: "9px", border: `1px solid ${sigCol}44`, background: sigCol + "09", textAlign: "center" }}>
            <Lbl>OVERALL SIGNAL</Lbl>
            <div style={{ fontFamily: MN, fontWeight: 800, fontSize: 16, color: sigCol }}>{sigLbl}</div>
            <div style={{ fontSize: 9, color: MU, marginTop: 2 }}>{bulls}/5 indicators bullish</div>
          </div>
        </div>

        <div>
          <Lbl>Bollinger Bands</Lbl>
          {[["Upper", last.bbUp], ["Lower", last.bbLo]].map(([l, v]) => (
            <div key={l} style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", borderBottom: `1px solid ${BD}22` }}>
              <span style={{ fontSize: 10, color: MU, fontFamily: MN }}>{l}</span>
              <span style={{ fontSize: 10, fontFamily: MN, color: WH }}>{v ? fmtPrice(v) : "—"}</span>
            </div>
          ))}
        </div>

        <div>
          <Lbl>Moving Averages</Lbl>
          {[["MA20", last.sma20, AM], ["MA50", last.sma50, BL]].map(([l, v, col]) => (
            <div key={l} style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", borderBottom: `1px solid ${BD}22` }}>
              <span style={{ fontSize: 10, fontFamily: MN, color: col }}>{l}</span>
              <span style={{ fontSize: 10, fontFamily: MN, color: WH }}>{v ? fmtPrice(v) : "—"}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

/* ─────────────────────────────────────────
   TAB: SCREENER
───────────────────────────────────────── */
const TabScreener = memo(function TabScreener({ onSelectAsset }) {
  const [sortKey, setSortKey] = useState("mc");
  const [sortDir, setSortDir] = useState(-1);
  const [region,  setRegion]  = useState("ALL");
  const [sector,  setSector]  = useState("ALL");
  const [signal,  setSignal]  = useState("ALL");
  const [minDiv,  setMinDiv]  = useState("");
  const [maxPE,   setMaxPE]   = useState("");

  const regions = useMemo(() => ["ALL", ...new Set(ALL_ASSETS.map(a => a.region))], []);
  const sectors = useMemo(() => ["ALL", ...new Set(ALL_ASSETS.map(a => a.sector))], []);

  const rows = useMemo(() => {
    let d = ALL_ASSETS.filter(a => {
      if (region !== "ALL" && a.region !== region) return false;
      if (sector !== "ALL" && a.sector !== sector) return false;
      if (minDiv && (a.div === null || a.div < +minDiv)) return false;
      if (maxPE  && (a.pe  === null || a.pe  > +maxPE))  return false;
      if (signal === "UP"   && a.c < 0) return false;
      if (signal === "DOWN" && a.c > 0) return false;
      return true;
    });
    return [...d].sort((a, b) => ((a[sortKey] ?? -999) - (b[sortKey] ?? -999)) * sortDir);
  }, [region, sector, signal, minDiv, maxPE, sortKey, sortDir]);

  const TH = ({ k, children }) => (
    <th onClick={() => { setSortDir(d => k === sortKey ? -d : -1); setSortKey(k); }}
      style={{ padding: "6px 10px", textAlign: "left", fontSize: 9, letterSpacing: 1.5, color: sortKey === k ? AM : MU, cursor: "pointer", whiteSpace: "nowrap", borderBottom: `1px solid ${BD}`, fontFamily: MN, userSelect: "none" }}>
      {children}{sortKey === k ? (sortDir === -1 ? " ↓" : " ↑") : ""}
    </th>
  );

  return (
    <div style={{ padding: 10 }}>
      <Panel style={{ marginBottom: 10, display: "flex", gap: 14, flexWrap: "wrap", alignItems: "flex-end" }}>
        {[["Region", region, setRegion, regions], ["Sector", sector, setSector, sectors], ["Signal", signal, setSignal, ["ALL", "UP", "DOWN"]]].map(([l, val, set, opts]) => (
          <div key={l}>
            <Lbl>{l}</Lbl>
            <select value={val} onChange={e => set(e.target.value)} style={{ ...sSt, minWidth: 110 }}>
              {opts.map(o => <option key={o}>{o}</option>)}
            </select>
          </div>
        ))}
        <div><Lbl>Min Div %</Lbl><input value={minDiv} onChange={e => setMinDiv(e.target.value)} placeholder="e.g. 2" style={{ ...iSt, width: 70 }} /></div>
        <div><Lbl>Max P/E</Lbl><input value={maxPE} onChange={e => setMaxPE(e.target.value)} placeholder="e.g. 30" style={{ ...iSt, width: 70 }} /></div>
        <span style={{ marginLeft: "auto", fontSize: 10, color: MU, fontFamily: MN, alignSelf: "center" }}>{rows.length}/{ALL_ASSETS.length} results</span>
      </Panel>
      <Panel style={{ padding: 0, overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
          <thead>
            <tr>
              <TH k="s">Ticker</TH><TH k="name">Name</TH><TH k="p">Price</TH>
              <TH k="c">24H%</TH><TH k="mc">Mkt Cap $B</TH>
              <TH k="pe">P/E</TH><TH k="div">Div%</TH>
              <TH k="beta">Beta</TH><TH k="vol">Vol $B</TH>
              <TH k="sector">Sector</TH><TH k="region">Region</TH>
              <th style={{ padding: "6px 10px", fontSize: 9, color: MU, borderBottom: `1px solid ${BD}`, fontFamily: MN }}></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((a, i) => (
              <tr key={a.s} style={{ borderBottom: `1px solid ${BD}18`, background: i % 2 === 0 ? BG1 : BG }}
                onMouseEnter={e => e.currentTarget.style.background = BG3}
                onMouseLeave={e => e.currentTarget.style.background = i % 2 === 0 ? BG1 : BG}>
                <td style={{ padding: "8px 10px", fontFamily: MN, color: AM, fontWeight: 700 }}>{a.s}</td>
                <td style={{ padding: "8px 10px", color: WH, maxWidth: 140, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{a.name}</td>
                <td style={{ padding: "8px 10px", fontFamily: MN, color: WH, fontWeight: 600 }}>{fmtPrice(a.p)}</td>
                <td style={{ padding: "8px 10px" }}><Chg v={a.c} /></td>
                <td style={{ padding: "8px 10px", fontFamily: MN, color: MU }}>{a.mc}</td>
                <td style={{ padding: "8px 10px", fontFamily: MN, color: a.pe ? MU : BD2 }}>{a.pe ? a.pe + "x" : "—"}</td>
                <td style={{ padding: "8px 10px", fontFamily: MN, color: a.div ? G : BD2 }}>{a.div ? a.div + "%" : "—"}</td>
                <td style={{ padding: "8px 10px", fontFamily: MN, color: MU }}>{a.beta}</td>
                <td style={{ padding: "8px 10px", fontFamily: MN, color: MU }}>{a.vol}</td>
                <td style={{ padding: "8px 10px" }}><Tag col={BL}>{a.sector}</Tag></td>
                <td style={{ padding: "8px 10px" }}><Tag col={MU}>{a.region}</Tag></td>
                <td style={{ padding: "8px 10px" }}>
                  <button onClick={() => onSelectAsset(a)}
                    style={{ background: AM + "22", color: AM, border: `1px solid ${AM}55`, fontSize: 9, padding: "3px 8px", fontFamily: MN, cursor: "pointer" }}>
                    CHART
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>
    </div>
  );
});

/* ─────────────────────────────────────────
   TAB: ANALYTICS
───────────────────────────────────────── */
const TabAnalytics = memo(function TabAnalytics() {
  const [mcSym,    setMcSym]    = useState("BTC");
  const [mcDays,   setMcDays]   = useState("252");
  const [mcData,   setMcData]   = useState(null);
  const [mcBusy,   setMcBusy]   = useState(false);
  const [fcf,      setFcf]      = useState("5.2");
  const [grow,     setGrow]     = useState("0.08");
  const [term,     setTerm]     = useState("0.03");
  const [wacc,     setWacc]     = useState("0.09");
  const [shares,   setShares]   = useState("15.4");
  const [dcfMkt,   setDcfMkt]   = useState("189.30");
  const [dcfRes,   setDcfRes]   = useState(null);

  function runMC() {
    setMcBusy(true);
    const a = ALL_ASSETS.find(x => x.s === mcSym) || ALL_ASSETS[0];
    setTimeout(() => {
      const hist = genHistory(a.p, a.s);
      const rets = hist.map(d => d.ret).filter(Boolean);
      const mu    = rets.reduce((a, b) => a + b, 0) / rets.length * 252;
      const sigma = Math.sqrt(rets.reduce((a, b) => a + b ** 2, 0) / rets.length * 252);
      const summary = monteCarlo(a.p, mu, sigma, +mcDays, 300);
      setMcData({ summary, sigma: +(sigma * 100).toFixed(1), mu: +(mu * 100).toFixed(1), price: a.p });
      setMcBusy(false);
    }, 20);
  }

  function runDCF() {
    const val = dcfCalc(+fcf, +grow, +term, +wacc, +shares);
    const mkt = +dcfMkt || 0;
    setDcfRes({ val, mkt, margin: mkt > 0 ? +(((val - mkt) / val) * 100).toFixed(1) : null });
  }

  useEffect(() => { runMC(); }, [mcSym, mcDays]);

  const CORR = [
    { n: "BTC",  BTC: 1.00, ETH: 0.88, SPY: 0.34, GLD: 0.12, AGG: -0.08, QQQ: 0.38 },
    { n: "ETH",  BTC: 0.88, ETH: 1.00, SPY: 0.31, GLD: 0.10, AGG: -0.06, QQQ: 0.35 },
    { n: "SPY",  BTC: 0.34, ETH: 0.31, SPY: 1.00, GLD: 0.08, AGG: -0.42, QQQ: 0.92 },
    { n: "GLD",  BTC: 0.12, ETH: 0.10, SPY: 0.08, GLD: 1.00, AGG:  0.22, QQQ: 0.06 },
    { n: "AGG",  BTC: -0.08,ETH: -0.06,SPY: -0.42,GLD: 0.22, AGG:  1.00, QQQ:-0.38 },
    { n: "QQQ",  BTC: 0.38, ETH: 0.35, SPY: 0.92, GLD: 0.06, AGG: -0.38, QQQ: 1.00 },
  ];
  const ck = ["BTC", "ETH", "SPY", "GLD", "AGG", "QQQ"];

  return (
    <div style={{ padding: 10, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
      {/* Monte Carlo */}
      <Panel>
        <Lbl>Monte Carlo Simulation — Geometric Brownian Motion</Lbl>
        <div style={{ display: "flex", gap: 10, marginBottom: 10, flexWrap: "wrap", alignItems: "flex-end" }}>
          <div>
            <Lbl>Asset</Lbl>
            <select value={mcSym} onChange={e => setMcSym(e.target.value)} style={{ ...sSt, width: 140 }}>
              {ALL_ASSETS.map(a => <option key={a.s} value={a.s}>{a.s} — {a.name}</option>)}
            </select>
          </div>
          <div>
            <Lbl>Trading Days</Lbl>
            <select value={mcDays} onChange={e => setMcDays(e.target.value)} style={{ ...sSt, width: 90 }}>
              {["63", "126", "252", "504"].map(d => <option key={d}>{d}</option>)}
            </select>
          </div>
          <button onClick={runMC} disabled={mcBusy}
            style={{ background: AM + "22", color: AM, border: `1px solid ${AM}`, fontFamily: MN, fontSize: 10, padding: "6px 14px", cursor: "pointer", opacity: mcBusy ? 0.5 : 1 }}>
            {mcBusy ? "RUNNING…" : "RUN SIM"}
          </button>
        </div>
        {mcData && (
          <>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={mcData.summary} margin={{ top: 4, right: 4, bottom: 0, left: 4 }}>
                <XAxis dataKey="day" tick={{ fill: MU, fontSize: 9, fontFamily: MN }} tickFormatter={d => "D" + d} />
                <YAxis tick={{ fill: MU, fontSize: 9, fontFamily: MN }} tickFormatter={v => v > 999 ? "$" + Math.round(v / 1000) + "k" : "$" + v} width={56} />
                <Tooltip formatter={(v, n) => ["$" + Number(v).toLocaleString(), n]} labelFormatter={l => "Day " + l} />
                <Area type="monotone" dataKey="p90" stroke="transparent" fill={G} fillOpacity={0.06} name="P90" isAnimationActive={false} />
                <Area type="monotone" dataKey="p75" stroke={G} strokeWidth={1} fill={G} fillOpacity={0.10} name="P75" isAnimationActive={false} />
                <Line type="monotone" dataKey="p50" stroke={AM} strokeWidth={2.5} dot={false} name="Median" isAnimationActive={false} />
                <Area type="monotone" dataKey="p25" stroke={R} strokeWidth={1} fill={R} fillOpacity={0.08} name="P25" isAnimationActive={false} />
                <Area type="monotone" dataKey="p10" stroke="transparent" fill={R} fillOpacity={0.05} name="P10" isAnimationActive={false} />
              </AreaChart>
            </ResponsiveContainer>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginTop: 10 }}>
              {[["Bull P90", mcData.summary.at(-1)?.p90, G], ["Median P50", mcData.summary.at(-1)?.p50, AM], ["Bear P10", mcData.summary.at(-1)?.p10, R]].map(([l, v, col]) => (
                <div key={l} style={{ background: BG3, padding: "8px", border: `1px solid ${col}30`, textAlign: "center" }}>
                  <Lbl>{l}</Lbl>
                  <div style={{ fontFamily: MN, fontWeight: 700, color: col, fontSize: 13 }}>{v ? fmtPrice(v) : "—"}</div>
                  {v && <div style={{ fontSize: 9, color: MU, marginTop: 2 }}>{((v - mcData.price) / mcData.price * 100).toFixed(1)}%</div>}
                </div>
              ))}
            </div>
            <div style={{ fontSize: 9, color: MU, marginTop: 6, fontFamily: MN }}>σ={mcData.sigma}%/yr · μ={mcData.mu}%/yr · 300 paths · GBM · {mcDays} days</div>
          </>
        )}
      </Panel>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {/* DCF */}
        <Panel>
          <Lbl>DCF Intrinsic Value — Discounted Cash Flow Model</Lbl>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 10 }}>
            {[["Free Cash Flow ($B)", fcf, setFcf], ["5Y Growth Rate", grow, setGrow], ["Terminal Growth", term, setTerm], ["WACC", wacc, setWacc], ["Shares Out. (B)", shares, setShares], ["Current Mkt Price $", dcfMkt, setDcfMkt]].map(([l, v, set]) => (
              <div key={l}>
                <Lbl>{l}</Lbl>
                <input value={v} onChange={e => set(e.target.value)} style={iSt} type="number" step="any" />
              </div>
            ))}
          </div>
          <button onClick={runDCF}
            style={{ width: "100%", background: G + "22", color: G, border: `1px solid ${G}`, fontFamily: MN, fontSize: 11, padding: "8px", cursor: "pointer", letterSpacing: 2 }}>
            CALCULATE INTRINSIC VALUE
          </button>
          {dcfRes && (
            <div style={{ marginTop: 10, background: BG3, padding: 12, border: `1px solid ${dcfRes.margin > 0 ? G : R}30` }}>
              <Lbl>Intrinsic Value Per Share</Lbl>
              <div style={{ fontFamily: MN, fontWeight: 800, fontSize: 26, color: G }}>${dcfRes.val.toLocaleString()}</div>
              {dcfRes.margin !== null && (
                <div style={{ display: "flex", gap: 14, marginTop: 6, fontSize: 11, fontFamily: MN }}>
                  <span style={{ color: MU }}>Market: <span style={{ color: WH }}>${dcfRes.mkt}</span></span>
                  <span style={{ color: dcfRes.margin > 0 ? G : R, fontWeight: 700 }}>
                    {dcfRes.margin > 0 ? "UNDERVALUED" : "OVERVALUED"} {Math.abs(dcfRes.margin)}%
                  </span>
                </div>
              )}
            </div>
          )}
        </Panel>

        {/* Correlation */}
        <Panel>
          <Lbl>Asset Correlation Matrix</Lbl>
          <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: MN, fontSize: 10 }}>
            <thead><tr>
              <th style={{ padding: "4px 6px", color: MU, fontSize: 9 }}></th>
              {ck.map(k => <th key={k} style={{ padding: "4px 6px", color: AM, fontSize: 9, textAlign: "center" }}>{k}</th>)}
            </tr></thead>
            <tbody>
              {CORR.map(row => (
                <tr key={row.n}>
                  <td style={{ padding: "4px 6px", color: AM, fontWeight: 700, fontSize: 9 }}>{row.n}</td>
                  {ck.map(k => {
                    const v = row[k];
                    const col = v >= 0.7 ? G : v >= 0.4 ? AM : v <= -0.3 ? R : MU;
                    return <td key={k} style={{ padding: "4px 6px", textAlign: "center", color: col, fontWeight: k === row.n ? 700 : 400, background: k === row.n ? BG3 : "transparent" }}>{v.toFixed(2)}</td>;
                  })}
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ fontSize: 9, color: MU, marginTop: 6 }}>Green=high positive · Yellow=low · Red=negative correlation</div>
        </Panel>
      </div>
    </div>
  );
});

/* ─────────────────────────────────────────
   TAB: OPTIONS
───────────────────────────────────────── */
const TabOptions = memo(function TabOptions({ asset }) {
  const [S,    setS]    = useState(() => String(asset.p));
  const [K,    setK]    = useState(() => String(asset.p));
  const [T,    setT]    = useState("0.25");
  const [r,    setR]    = useState("0.0525");
  const [iv,   setIv]   = useState("0.28");
  const [type, setType] = useState("call");
  const [res,  setRes]  = useState(null);

  const prevSymRef = useRef(asset.s);
  useEffect(() => {
    if (prevSymRef.current !== asset.s) {
      setS(String(asset.p));
      setK(String(asset.p));
      setRes(null);
      prevSymRef.current = asset.s;
    }
  }, [asset.s]);

  function calc() { setRes(bsGreeks(+S, +K, +T, +r, +iv, type)); }

  const chain = useMemo(() => {
    const base = +S || asset.p;
    return Array.from({ length: 11 }, (_, i) => {
      const strike = +(base * (0.90 + i * 0.02)).toFixed(base < 10 ? 3 : base < 100 ? 1 : 0);
      const call   = bsGreeks(base, strike, +T, +r, +iv, "call");
      const put    = bsGreeks(base, strike, +T, +r, +iv, "put");
      return { strike, call: call.price, put: put.price, delta: call.delta, itm: strike < base };
    });
  }, [S, T, r, iv, asset.s]);

  return (
    <div style={{ padding: 10, display: "grid", gridTemplateColumns: "320px 1fr", gap: 10 }}>
      <Panel>
        <Lbl>Black-Scholes-Merton Pricer — {asset.s}</Lbl>
        <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
          {["call", "put"].map(t => (
            <button key={t} onClick={() => setType(t)}
              style={{ flex: 1, padding: "7px", background: type === t ? (t === "call" ? G : R) + "22" : "transparent", color: type === t ? (t === "call" ? G : R) : MU, border: `1px solid ${type === t ? (t === "call" ? G : R) : BD}`, fontFamily: MN, fontSize: 11, cursor: "pointer", textTransform: "uppercase", letterSpacing: 2 }}>
              {t}
            </button>
          ))}
        </div>
        {[["Spot Price (S)", S, setS], ["Strike Price (K)", K, setK], ["Time to Expiry (yr)", T, setT], ["Risk-Free Rate", r, setR], ["Implied Volatility (σ)", iv, setIv]].map(([l, v, set]) => (
          <div key={l} style={{ marginBottom: 8 }}>
            <Lbl>{l}</Lbl>
            <input value={v} onChange={e => set(e.target.value)} style={iSt} type="number" step="any" />
          </div>
        ))}
        <button onClick={calc}
          style={{ width: "100%", background: AM + "22", color: AM, border: `1px solid ${AM}`, fontFamily: MN, fontSize: 11, padding: "9px", cursor: "pointer", letterSpacing: 2, marginTop: 4 }}>
          PRICE OPTION
        </button>
        {res && (
          <div style={{ marginTop: 12 }}>
            <div style={{ fontFamily: MN, fontWeight: 800, fontSize: 24, color: AM, marginBottom: 10 }}>${res.price}</div>
            {[["Delta Δ", res.delta, "$ change per $1 move in S"], ["Gamma Γ", res.gamma, "Rate of change of delta"], ["Theta Θ", res.theta, "Value decay per calendar day"], ["Vega ν", res.vega, "Value change per 1% IV move"], ["Rho ρ", res.rho, "Value change per 1% rate move"]].map(([l, v, d]) => (
              <div key={l} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: `1px solid ${BD}` }}>
                <div>
                  <div style={{ fontFamily: MN, color: WH, fontSize: 11 }}>{l}</div>
                  <div style={{ fontSize: 9, color: MU }}>{d}</div>
                </div>
                <span style={{ fontFamily: MN, fontSize: 12, fontWeight: 700, color: v > 0 ? G : v < 0 ? R : WH }}>{v}</span>
              </div>
            ))}
          </div>
        )}
      </Panel>

      <Panel>
        <Lbl>Options Chain — {asset.s} @ {fmtPrice(+S || asset.p)} | T={T}yr | σ={iv}</Lbl>
        <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: MN, fontSize: 11 }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${BD}` }}>
              {["Call Price", "Call Δ", "Strike", "ITM/OTM", "Put Price", "Put Δ"].map(h => (
                <th key={h} style={{ padding: "7px 12px", textAlign: "center", fontSize: 9, color: MU, letterSpacing: 1.5 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {chain.map((row, i) => (
              <tr key={i} style={{ background: row.itm ? G + "08" : BG, borderBottom: `1px solid ${BD}18` }}>
                <td style={{ padding: "7px 12px", textAlign: "center", color: G, fontWeight: 700 }}>${row.call}</td>
                <td style={{ padding: "7px 12px", textAlign: "center", color: MU }}>{row.delta.toFixed(3)}</td>
                <td style={{ padding: "7px 12px", textAlign: "center", color: AM, fontWeight: 800, fontSize: 12 }}>{fmtPrice(row.strike)}</td>
                <td style={{ padding: "7px 12px", textAlign: "center" }}><Tag col={row.itm ? G : MU}>{row.itm ? "ITM" : "OTM"}</Tag></td>
                <td style={{ padding: "7px 12px", textAlign: "center", color: R, fontWeight: 700 }}>${row.put}</td>
                <td style={{ padding: "7px 12px", textAlign: "center", color: MU }}>{(row.delta - 1).toFixed(3)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>
    </div>
  );
});

/* ─────────────────────────────────────────
   TAB: FOREX
───────────────────────────────────────── */
const TabForex = memo(function TabForex() {
  const [fromCur, setFromCur] = useState("USD");
  const [toCur,   setToCur]   = useState("CAD");
  const [amount,  setAmount]  = useState("1000");
  const curs = Object.keys(FX_RATES);
  const converted = ((+amount || 0) / FX_RATES[fromCur] * FX_RATES[toCur]).toFixed(4);
  const rate = (FX_RATES[toCur] / FX_RATES[fromCur]).toFixed(6);

  return (
    <div style={{ padding: 10 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 10 }}>
        <Panel style={{ padding: 0, overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                {["Pair", "Rate", "24H Chg", "Open", "Day High", "Day Low", "Spread (pip)"].map(h => (
                  <th key={h} style={{ padding: "8px 12px", textAlign: "left", fontSize: 9, letterSpacing: 1.5, color: MU, borderBottom: `1px solid ${BD}`, fontFamily: MN }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {FOREX_DATA.map((f, i) => (
                <tr key={f.pair} style={{ borderBottom: `1px solid ${BD}18`, background: i % 2 === 0 ? BG1 : BG }}
                  onMouseEnter={e => e.currentTarget.style.background = BG3}
                  onMouseLeave={e => e.currentTarget.style.background = i % 2 === 0 ? BG1 : BG}>
                  <td style={{ padding: "9px 12px", fontFamily: MN, color: AM, fontWeight: 700, fontSize: 12 }}>{f.pair}</td>
                  <td style={{ padding: "9px 12px", fontFamily: MN, color: WH, fontWeight: 700, fontSize: 13 }}>{f.rate}</td>
                  <td style={{ padding: "9px 12px" }}><Chg v={f.c} /></td>
                  <td style={{ padding: "9px 12px", fontFamily: MN, color: MU, fontSize: 11 }}>{f.open}</td>
                  <td style={{ padding: "9px 12px", fontFamily: MN, color: G, fontSize: 11 }}>{f.h}</td>
                  <td style={{ padding: "9px 12px", fontFamily: MN, color: R, fontSize: 11 }}>{f.l}</td>
                  <td style={{ padding: "9px 12px", fontFamily: MN, color: MU, fontSize: 11 }}>{f.spread}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Panel>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <Panel>
            <Lbl>Currency Converter</Lbl>
            <div style={{ marginBottom: 8 }}>
              <Lbl>Amount</Lbl>
              <input type="number" value={amount} onChange={e => setAmount(e.target.value)} style={iSt} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 10 }}>
              <div><Lbl>From</Lbl><select value={fromCur} onChange={e => setFromCur(e.target.value)} style={sSt}>{curs.map(c => <option key={c}>{c}</option>)}</select></div>
              <div><Lbl>To</Lbl><select value={toCur} onChange={e => setToCur(e.target.value)} style={sSt}>{curs.map(c => <option key={c}>{c}</option>)}</select></div>
            </div>
            <div style={{ background: BG3, padding: 12, border: `1px solid ${G}30`, textAlign: "center" }}>
              <div style={{ fontSize: 9, color: MU, marginBottom: 4, fontFamily: MN }}>1 {fromCur} = {rate} {toCur}</div>
              <div style={{ fontFamily: MN, fontWeight: 700, fontSize: 20, color: G }}>{Number(converted).toLocaleString(undefined, { maximumFractionDigits: 4 })} {toCur}</div>
              <div style={{ fontSize: 10, color: MU, marginTop: 4 }}>{amount} {fromCur}</div>
            </div>
          </Panel>
          <Panel>
            <Lbl>USD Cross Rates</Lbl>
            {curs.filter(c => c !== "USD").map(c => (
              <div key={c} style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", borderBottom: `1px solid ${BD}18` }}>
                <span style={{ fontFamily: MN, fontSize: 11, color: MU }}>USD/{c}</span>
                <span style={{ fontFamily: MN, fontSize: 11, color: WH, fontWeight: 700 }}>{FX_RATES[c].toFixed(4)}</span>
              </div>
            ))}
          </Panel>
        </div>
      </div>
    </div>
  );
});

/* ─────────────────────────────────────────
   TAB: PORTFOLIO
───────────────────────────────────────── */
const TFSA_LIMITS = {2009:5000,2010:5000,2011:5000,2012:5000,2013:5500,2014:5500,2015:10000,2016:5500,2017:5500,2018:5500,2019:6000,2020:6000,2021:6000,2022:6000,2023:6500,2024:7000,2025:7000};

const TabPortfolio = memo(function TabPortfolio() {
  const [invest,  setInvest]   = useState("50000");
  const [age,     setAge]      = useState("32");
  const [income,  setIncome]   = useState("95000");
  const [eTFSA,   setETFSA]    = useState("21000");
  const [eRRSP,   setERRSP]    = useState("12000");
  const [province,setProv]     = useState("Ontario");
  const [holdings, setHoldings] = useState([
    { id: 1, s: "SPY",      pct: 30, ret: "0.18", vol: "0.15" },
    { id: 2, s: "QQQ",      pct: 20, ret: "0.22", vol: "0.20" },
    { id: 3, s: "ZAG.TO",   pct: 20, ret: "0.04", vol: "0.05" },
    { id: 4, s: "GLD",      pct: 10, ret: "0.12", vol: "0.14" },
    { id: 5, s: "BTC",      pct: 10, ret: "0.60", vol: "0.65" },
    { id: 6, s: "XEQT.TO",  pct: 10, ret: "0.16", vol: "0.14" },
  ]);

  const nextId = useRef(10);

  function updateH(id, key, val) {
    setHoldings(prev => prev.map(h => h.id === id ? { ...h, [key]: key === "s" ? val : key === "pct" ? Math.max(0, +val || 0) : val } : h));
  }

  function removeH(id) { setHoldings(prev => prev.filter(h => h.id !== id)); }

  function addH() {
    nextId.current++;
    setHoldings(prev => [...prev, { id: nextId.current, s: "NEW", pct: 5, ret: "0.10", vol: "0.15" }]);
  }

  const total    = holdings.reduce((a, h) => a + h.pct, 0);
  const portRet  = holdings.reduce((a, h) => a + h.pct / 100 * (+h.ret || 0), 0);
  const portVol  = Math.sqrt(holdings.reduce((a, h) => a + (h.pct / 100 * (+h.vol || 0)) ** 2, 0));
  const sharpe   = portVol > 0 ? ((portRet - 0.0525) / portVol).toFixed(2) : "—";
  const investAmt = +invest || 50000;

  const projData = [1, 2, 3, 5, 10, 15, 20].map(yr => ({
    yr: `${yr}Y`,
    bull: Math.round(investAmt * Math.pow(1 + portRet + portVol * 0.7, yr)),
    base: Math.round(investAmt * Math.pow(1 + portRet, yr)),
    bear: Math.round(investAmt * Math.pow(Math.max(0.01, 1 + portRet - portVol * 0.5), yr)),
  }));

  const ageNum   = +age || 32;
  const startY   = Math.max(2009, 2025 - ageNum + 18);
  const tfsaRoom = Math.max(0, Object.entries(TFSA_LIMITS).filter(([y]) => +y >= startY && +y <= 2025).reduce((s, [, v]) => s + v, 0) - (+eTFSA || 0));
  const rrspRoom = Math.max(0, Math.min(31560, Math.round((+income || 0) * 0.18)) - (+eRRSP || 0));

  return (
    <div style={{ padding: 10, display: "grid", gridTemplateColumns: "380px 1fr", gap: 10, alignItems: "start" }}>
      {/* Left inputs */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <Panel>
          <Lbl>Canadian Tax Profile</Lbl>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            <div><Lbl>Age</Lbl><input value={age} onChange={e => setAge(e.target.value)} style={iSt} type="number" /></div>
            <div>
              <Lbl>Province</Lbl>
              <select value={province} onChange={e => setProv(e.target.value)} style={sSt}>
                {["Ontario", "British Columbia", "Alberta", "Quebec", "Manitoba", "Saskatchewan", "Nova Scotia", "New Brunswick", "Newfoundland"].map(p => <option key={p}>{p}</option>)}
              </select>
            </div>
            <div><Lbl>Annual Income (CAD $)</Lbl><input value={income} onChange={e => setIncome(e.target.value)} style={iSt} type="number" /></div>
            <div><Lbl>Total Investment ($)</Lbl><input value={invest} onChange={e => setInvest(e.target.value)} style={iSt} type="number" /></div>
            <div><Lbl>Existing TFSA ($)</Lbl><input value={eTFSA} onChange={e => setETFSA(e.target.value)} style={iSt} type="number" /></div>
            <div><Lbl>Existing RRSP ($)</Lbl><input value={eRRSP} onChange={e => setERRSP(e.target.value)} style={iSt} type="number" /></div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 10 }}>
            <div style={{ background: BG3, padding: "8px", border: `1px solid ${G}30`, textAlign: "center" }}>
              <Lbl>TFSA Room Available</Lbl>
              <div style={{ fontFamily: MN, fontWeight: 700, color: G, fontSize: 15 }}>${tfsaRoom.toLocaleString()}</div>
            </div>
            <div style={{ background: BG3, padding: "8px", border: `1px solid ${AM}30`, textAlign: "center" }}>
              <Lbl>RRSP Deduction Room</Lbl>
              <div style={{ fontFamily: MN, fontWeight: 700, color: AM, fontSize: 15 }}>${rrspRoom.toLocaleString()}</div>
            </div>
          </div>
        </Panel>

        <Panel>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <Lbl>Portfolio Holdings</Lbl>
            <span style={{ fontFamily: MN, fontSize: 11, color: total === 100 ? G : R, fontWeight: 700 }}>Total: {total}%</span>
          </div>
          {holdings.map((h, i) => (
            <div key={h.id} style={{ background: BG2, padding: "8px 10px", marginBottom: 6, borderLeft: `3px solid ${PCOLS[i % PCOLS.length]}` }}>
              <div style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 6 }}>
                <input
                  value={h.s}
                  onChange={e => updateH(h.id, "s", e.target.value)}
                  style={{ ...iSt, width: 80, color: PCOLS[i % PCOLS.length], fontWeight: 700 }}
                />
                <input
                  type="number" min="0" max="100"
                  value={h.pct}
                  onChange={e => updateH(h.id, "pct", e.target.value)}
                  style={{ ...iSt, width: 55 }}
                />
                <span style={{ fontSize: 10, color: MU }}>%</span>
                <button onClick={() => removeH(h.id)}
                  style={{ marginLeft: "auto", background: R + "22", color: R, border: `1px solid ${R}44`, fontSize: 13, cursor: "pointer", padding: "0px 7px", lineHeight: "20px", fontFamily: MN }}>×</button>
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                <div style={{ flex: 1 }}>
                  <Lbl>Exp. Return/yr</Lbl>
                  <input
                    type="number" step="0.01"
                    value={h.ret}
                    onChange={e => updateH(h.id, "ret", e.target.value)}
                    style={{ ...iSt, color: G }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <Lbl>Volatility/yr</Lbl>
                  <input
                    type="number" step="0.01"
                    value={h.vol}
                    onChange={e => updateH(h.id, "vol", e.target.value)}
                    style={{ ...iSt, color: R }}
                  />
                </div>
              </div>
            </div>
          ))}
          <button onClick={addH}
            style={{ width: "100%", background: BG2, color: MU, border: `1px solid ${BD2}`, fontSize: 10, padding: "7px", cursor: "pointer", fontFamily: MN, letterSpacing: 1, marginTop: 4 }}>
            + ADD POSITION
          </button>
        </Panel>
      </div>

      {/* Right: stats + charts */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
          {[["Expected Return", (portRet * 100).toFixed(1) + "%", G], ["Portfolio Volatility", (portVol * 100).toFixed(1) + "%", R], ["Sharpe Ratio", sharpe, +sharpe >= 1 ? G : +sharpe >= 0.5 ? AM : R]].map(([l, v, col]) => (
            <Panel key={l} style={{ textAlign: "center", padding: 12 }}>
              <Lbl>{l}</Lbl>
              <div style={{ fontFamily: MN, fontWeight: 800, fontSize: 22, color: col }}>{v}</div>
            </Panel>
          ))}
        </div>

        <Panel>
          <Lbl>Allocation Breakdown</Lbl>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <ResponsiveContainer width={180} height={180}>
              <PieChart>
                <Pie data={holdings.map((h, i) => ({ name: h.s, value: h.pct, color: PCOLS[i % PCOLS.length] }))}
                  dataKey="value" cx="50%" cy="50%" innerRadius={44} outerRadius={80} paddingAngle={2} isAnimationActive={false}>
                  {holdings.map((_, i) => <Cell key={i} fill={PCOLS[i % PCOLS.length]} />)}
                </Pie>
                <Tooltip formatter={v => v + "%"} />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ flex: 1 }}>
              {holdings.map((h, i) => (
                <div key={h.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 5 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <div style={{ width: 8, height: 8, background: PCOLS[i % PCOLS.length], flexShrink: 0 }} />
                    <span style={{ fontFamily: MN, fontSize: 11, color: WH, fontWeight: 700 }}>{h.s}</span>
                  </div>
                  <div style={{ display: "flex", gap: 10, fontSize: 11, fontFamily: MN }}>
                    <span style={{ color: MU }}>{h.pct}%</span>
                    <span style={{ color: G }}>R:{(+h.ret * 100).toFixed(0)}%</span>
                    <span style={{ color: R }}>σ:{(+h.vol * 100).toFixed(0)}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Panel>

        <Panel>
          <Lbl>Wealth Projection — Bull / Base / Bear Scenarios</Lbl>
          <ResponsiveContainer width="100%" height={190}>
            <AreaChart data={projData} margin={{ top: 4, right: 4, bottom: 0, left: 4 }}>
              <XAxis dataKey="yr" tick={{ fill: MU, fontSize: 10, fontFamily: MN }} />
              <YAxis tick={{ fill: MU, fontSize: 9, fontFamily: MN }} tickFormatter={v => "$" + Math.round(v / 1000) + "k"} width={52} />
              <Tooltip formatter={(v, n) => ["$" + v.toLocaleString(), n]} />
              <Area type="monotone" dataKey="bull" stroke={G} strokeWidth={1.5} fill={G} fillOpacity={0.07} name="Bull" isAnimationActive={false} />
              <Area type="monotone" dataKey="base" stroke={AM} strokeWidth={2} fill={AM} fillOpacity={0.07} name="Base" isAnimationActive={false} />
              <Area type="monotone" dataKey="bear" stroke={R} strokeWidth={1.5} fill={R} fillOpacity={0.06} name="Bear" isAnimationActive={false} />
            </AreaChart>
          </ResponsiveContainer>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 6, marginTop: 8 }}>
            {projData.filter((_, i) => [1, 2, 4, 6].includes(i)).map(d => (
              <div key={d.yr} style={{ background: BG3, padding: "8px", textAlign: "center" }}>
                <Lbl>{d.yr}</Lbl>
                <div style={{ fontFamily: MN, fontSize: 13, color: G, fontWeight: 700 }}>${Math.round(d.base / 1000)}k</div>
                <div style={{ fontSize: 9, color: MU }}>{((d.base / investAmt - 1) * 100).toFixed(0)}%</div>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
});

/* ─────────────────────────────────────────
   ROOT APP
   Clock is isolated — never causes re-render
   No key={tab} — preserves tab state
───────────────────────────────────────── */
export default function App() {
  const [tab,   setTab]   = useState("terminal");
  const [asset, setAsset] = useState(ALL_ASSETS[8]); // AAPL default

  function selectAsset(a) {
    setAsset(a);
    setTab("terminal");
  }

  const TABS = [
    { id: "terminal",  label: "TERMINAL"  },
    { id: "screener",  label: "SCREENER"  },
    { id: "analytics", label: "ANALYTICS" },
    { id: "options",   label: "OPTIONS"   },
    { id: "forex",     label: "FOREX"     },
    { id: "portfolio", label: "PORTFOLIO" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: BG, color: WH, fontFamily: MN, fontSize: 12 }}>
      <style>{`
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
        html,body,#root{height:100%;background:${BG};}
        ::-webkit-scrollbar{width:5px;height:5px;}
        ::-webkit-scrollbar-track{background:${BG1};}
        ::-webkit-scrollbar-thumb{background:${BD2};border-radius:2px;}
        button{cursor:pointer;font-family:'Courier New',Courier,monospace;transition:opacity .1s;}
        button:hover:not(:disabled){opacity:.8;}
        input,select{outline:none;font-family:'Courier New',Courier,monospace;}
        input:focus,select:focus{border-color:${AM}!important;}
        @keyframes ticker{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
        @keyframes blink{0%,100%{opacity:1}50%{opacity:0.2}}
      `}</style>

      {/* Top bar — Clock is isolated component, never triggers App re-render */}
      <div style={{ height: 32, background: BG1, borderBottom: `1px solid ${BD}`, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 10px" }}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, paddingRight: 12, borderRight: `1px solid ${BD}`, marginRight: 0 }}>
            <div style={{ width: 16, height: 16, background: AM, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 900, color: BG }}>F</div>
            <span style={{ fontSize: 11, fontWeight: 800, color: AM, letterSpacing: 2 }}>FINPULSE</span>
            <span style={{ fontSize: 8, color: MU, letterSpacing: 1 }}>v6</span>
          </div>
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              style={{ padding: "0 14px", height: 32, background: tab === t.id ? BG3 : BG1, color: tab === t.id ? AM : MU, border: "none", borderRight: `1px solid ${BD}`, fontSize: 9, letterSpacing: 2, fontWeight: tab === t.id ? 700 : 400 }}>
              {t.label}
            </button>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 9 }}>
          <span style={{ color: G, animation: "blink 2s step-end infinite" }}>● LIVE</span>
          {ALL_ASSETS.slice(0, 5).map(a => (
            <span key={a.s} style={{ borderLeft: `1px solid ${BD}`, paddingLeft: 10 }}>
              <span style={{ color: MU }}>{a.s} </span>
              <span style={{ color: WH, fontWeight: 700 }}>{fmtPrice(a.p)} </span>
              <span style={{ color: a.c > 0 ? G : R }}>{a.c > 0 ? "+" : ""}{a.c}%</span>
            </span>
          ))}
          <Clock />
        </div>
      </div>

      {/* Ticker tape */}
      <div style={{ height: 22, background: BG2, borderBottom: `1px solid ${BD}`, overflow: "hidden", display: "flex", alignItems: "center" }}>
        <div style={{ display: "flex", animation: "ticker 55s linear infinite", whiteSpace: "nowrap" }}>
          {[...ALL_ASSETS, ...ALL_ASSETS].map((a, i) => (
            <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "0 14px", fontSize: 10, borderRight: `1px solid ${BD}` }}>
              <span style={{ color: MU }}>{a.s}</span>
              <span style={{ color: WH, fontWeight: 700 }}>{fmtPrice(a.p)}</span>
              <span style={{ color: a.c >= 0 ? G : R }}>{a.c >= 0 ? "▲" : "▼"}{Math.abs(a.c)}%</span>
            </span>
          ))}
        </div>
      </div>

      {/* Asset selector bar — terminal only */}
      {tab === "terminal" && (
        <div style={{ height: 26, background: BG1, borderBottom: `1px solid ${BD}`, display: "flex", alignItems: "center", padding: "0 6px", gap: 2, overflowX: "auto" }}>
          {ALL_ASSETS.map(a => (
            <button key={a.s} onClick={() => setAsset(a)}
              style={{ padding: "2px 9px", height: 20, background: asset.s === a.s ? BG3 : "transparent", color: asset.s === a.s ? AM : MU, border: asset.s === a.s ? `1px solid ${BD2}` : "1px solid transparent", fontSize: 9, whiteSpace: "nowrap", fontWeight: asset.s === a.s ? 700 : 400 }}>
              {a.s}
            </button>
          ))}
        </div>
      )}

      {/* Tab content — NO key prop, state is preserved */}
      <div style={{ display: tab === "terminal"  ? "block" : "none" }}><TabTerminal  asset={asset} /></div>
      <div style={{ display: tab === "screener"  ? "block" : "none" }}><TabScreener  onSelectAsset={selectAsset} /></div>
      <div style={{ display: tab === "analytics" ? "block" : "none" }}><TabAnalytics /></div>
      <div style={{ display: tab === "options"   ? "block" : "none" }}><TabOptions   asset={asset} /></div>
      <div style={{ display: tab === "forex"     ? "block" : "none" }}><TabForex /></div>
      <div style={{ display: tab === "portfolio" ? "block" : "none" }}><TabPortfolio /></div>
    </div>
  );
}