import{r as t,j as r}from"./index-CQOCMAfM.js";import{L as m}from"./layout-DHpyFBJu.js";import{S as c}from"./seo-BUw8bqYv.js";import{S as f}from"./sedang-dipersiapkan-CEStO4fo.js";import{M as p}from"./mic-vocal-Cmhi_VuE.js";import"./contact-CB-haxcn.js";import"./zap-DG30xs4c.js";import"./mail-4by4UbiY.js";import"./map-pin-C0CIau9K.js";import"./user-BuM1B8W6.js";import"./arrow-left-CZTozw-7.js";import"./compass-0Dcto9nN.js";import"./phone-Bv4XcrFH.js";import"./arrow-right-Ce8Z-b52.js";const d=`
@keyframes tFadeUp {
  from { opacity: 0; transform: translateY(18px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes tFloat {
  0%,100% { transform: translateY(0); }
  50%      { transform: translateY(-9px); }
}
@keyframes tGlow {
  0%,100% { box-shadow: 0 0 22px rgba(192,38,211,.45); }
  50%      { box-shadow: 0 0 44px rgba(192,38,211,.75), 0 0 72px rgba(192,38,211,.2); }
}
@keyframes tShimmer {
  0%   { background-position: -200% center; }
  100% { background-position:  200% center; }
}
@keyframes tPulse {
  0%,100% { transform: scale(1);   opacity: .5; }
  50%      { transform: scale(1.7); opacity: 0; }
}
@keyframes tMarquee {
  0%   { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
@keyframes tCardIn {
  from { opacity: 0; transform: translateY(20px) scale(.97); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
}
@keyframes tVideoIn {
  from { opacity: 0; transform: scale(.96); }
  to   { opacity: 1; transform: scale(1); }
}
.t-video-card { animation: tVideoIn .45s ease both; }
@keyframes tProgress {
  from { transform: scaleX(0); }
  to   { transform: scaleX(1); }
}
.t-progress { animation: tProgress 5s linear forwards; }
.t-shimmer {
  background: linear-gradient(90deg, #f0abfc, #e879f9, #c026d3, #a855f7, #f0abfc);
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: tShimmer 3s linear infinite;
}
.t-card    { animation: tCardIn  .4s ease both; }
.t-marquee { animation: tMarquee 32s linear infinite; }
.t-float   { animation: tFloat   4s  ease-in-out infinite; }
.t-glow    { animation: tGlow    2.5s ease-in-out infinite; }
`;function H(){const[o,u]=t.useState("semua"),[k,g]=t.useState(0),[e,y]=t.useState(""),[i,n]=t.useState([]),[b,s]=t.useState(!0),l=t.useCallback(()=>{s(!0),fetch("/api/talents").then(a=>a.ok?a.json():[]).then(a=>n(Array.isArray(a)?a:[])).catch(()=>n([])).finally(()=>s(!1))},[]);return t.useEffect(()=>{},[l]),i.filter(a=>o==="semua"||a.category===o).filter(a=>!e||a.name.toLowerCase().includes(e.toLowerCase())||a.role.toLowerCase().includes(e.toLowerCase())||a.tagline.toLowerCase().includes(e.toLowerCase())),r.jsxs(m,{children:[r.jsx("style",{children:d}),r.jsx(c,{title:"Nempo Talent — Sedang Dipersiapkan",description:"Halaman Nempo Talent sedang dipersiapkan untuk menampilkan talenta dan peluang kolaborasi lokal Garut.",keywords:"talent garut, talent lokal, kolaborasi garut",path:"/talent"}),r.jsx(f,{icon:p,iconGradient:"linear-gradient(135deg, #0194f3 0%, #7C3AED 100%)",dotColor1:"#0194f3",dotColor2:"#7C3AED",title:"Nempo Talent",titleHighlight:"Sedang Dipersiapkan",description:"Ruang untuk menemukan talenta lokal Garut sedang kami siapkan agar lebih lengkap, nyaman, dan layak untuk dikolaborasikan.",btn1Label:"Jelajahi Wisata",btn1Href:"/wisata",btn2Label:"Lihat Event",btn2Href:"/event"})]})}export{H as default};
