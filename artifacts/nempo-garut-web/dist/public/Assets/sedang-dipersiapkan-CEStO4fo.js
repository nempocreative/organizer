import{j as e,L as r}from"./index-CQOCMAfM.js";import{A as n}from"./arrow-right-Ce8Z-b52.js";const c=`
@keyframes orbit1 {
  from { transform: rotate(0deg)   translateX(56px)  rotate(0deg); }
  to   { transform: rotate(360deg) translateX(56px)  rotate(-360deg); }
}
@keyframes orbit2 {
  from { transform: rotate(120deg) translateX(74px)  rotate(-120deg); }
  to   { transform: rotate(480deg) translateX(74px)  rotate(-480deg); }
}
@keyframes orbit3 {
  from { transform: rotate(240deg) translateX(44px)  rotate(-240deg); }
  to   { transform: rotate(600deg) translateX(44px)  rotate(-600deg); }
}
@keyframes orbit4 {
  from { transform: rotate(60deg)  translateX(90px) rotate(-60deg); }
  to   { transform: rotate(420deg) translateX(90px) rotate(-420deg); }
}
@keyframes orbit5 {
  from { transform: rotate(300deg) translateX(63px)  rotate(-300deg); }
  to   { transform: rotate(660deg) translateX(63px)  rotate(-660deg); }
}
@keyframes pulse-glow {
  0%, 100% { box-shadow: 0 0 0 0 rgba(255,255,255,0.25); }
  50%       { box-shadow: 0 0 0 10px rgba(255,255,255,0); }
}
@keyframes float-icon {
  0%, 100% { transform: translateY(0px); }
  50%       { transform: translateY(-6px); }
}
`;function b({icon:l,iconGradient:t,dotColor1:s,dotColor2:a,title:o,titleHighlight:i,description:d,btn1Label:x,btn1Href:m,btn2Label:f,btn2Href:h}){return e.jsxs("div",{className:"flex flex-col items-center justify-center min-h-[80vh] px-6 pt-10 pb-32 text-center",children:[e.jsx("style",{children:c}),e.jsxs("div",{className:"relative mb-6 md:mb-12 flex items-center justify-center",style:{width:200,height:200},children:[e.jsx("div",{className:"absolute rounded-full opacity-10",style:{width:170,height:170,background:t,filter:"blur(20px)"}}),e.jsx("div",{className:"absolute rounded-full border border-dashed opacity-15",style:{width:150,height:150,borderColor:a}}),e.jsx("div",{className:"absolute rounded-full border border-dashed opacity-10",style:{width:185,height:185,borderColor:s}}),e.jsx("span",{className:"absolute rounded-full",style:{width:8,height:8,top:"50%",left:"50%",marginTop:-4,marginLeft:-4,background:a,animation:"orbit1 4.5s linear infinite",boxShadow:`0 0 6px 2px ${a}88`}}),e.jsx("span",{className:"absolute rounded-full",style:{width:6,height:6,top:"50%",left:"50%",marginTop:-3,marginLeft:-3,background:s,animation:"orbit2 7s linear infinite",boxShadow:`0 0 5px 2px ${s}88`}}),e.jsx("span",{className:"absolute rounded-full",style:{width:4,height:4,top:"50%",left:"50%",marginTop:-2,marginLeft:-2,background:"#ffffff",animation:"orbit3 3s linear infinite",opacity:.8}}),e.jsx("span",{className:"absolute rounded-full",style:{width:7,height:7,top:"50%",left:"50%",marginTop:-3.5,marginLeft:-3.5,background:a,animation:"orbit4 10s linear infinite",boxShadow:`0 0 4px 2px ${a}66`}}),e.jsx("span",{className:"absolute rounded-full",style:{width:5,height:5,top:"50%",left:"50%",marginTop:-2.5,marginLeft:-2.5,background:s,animation:"orbit5 6s linear infinite",opacity:.9}}),e.jsx("div",{className:"relative z-10 h-[100px] w-[100px] rounded-[2rem] flex items-center justify-center shadow-2xl",style:{background:t,animation:"float-icon 3s ease-in-out infinite",boxShadow:"0 20px 60px rgba(0,0,0,0.25), 0 0 0 1px rgba(255,255,255,0.15) inset"},children:e.jsx(l,{className:"h-12 w-12 text-white",strokeWidth:1.5})})]}),e.jsxs("h1",{className:"text-2xl md:text-3xl font-black leading-tight text-gray-900 max-w-xs md:max-w-sm",children:[o,e.jsx("br",{}),e.jsx("span",{className:"bg-clip-text text-transparent",style:{backgroundImage:t},children:i})]}),e.jsx("p",{className:"mt-4 max-w-[280px] md:max-w-sm text-sm md:text-base text-gray-500 leading-relaxed",children:d}),e.jsx("div",{className:"mt-7 w-48 h-1.5 bg-gray-100 rounded-full overflow-hidden",children:e.jsx("div",{className:"h-full w-2/3 rounded-full animate-pulse",style:{background:t}})}),e.jsx("p",{className:"mt-2 text-[10px] text-gray-400 font-medium",children:"Sedang dalam pengembangan..."}),e.jsxs("div",{className:"mt-10 w-full max-w-xs",children:[e.jsx("p",{className:"text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-5",children:"Sementara itu"}),e.jsxs("div",{className:"flex flex-col gap-3.5",children:[e.jsx(r,{href:m,children:e.jsxs("button",{className:"flex w-full items-center justify-between rounded-2xl px-5 py-4 text-sm font-bold text-white shadow-lg transition-all hover:opacity-90 hover:-translate-y-0.5 active:scale-[0.98]",style:{background:t,boxShadow:"0 8px 24px rgba(0,0,0,0.18)"},children:[e.jsx("span",{children:x}),e.jsx(n,{className:"h-4 w-4"})]})}),e.jsx(r,{href:h,children:e.jsxs("button",{className:"flex w-full items-center justify-between rounded-2xl border border-gray-200 bg-white px-5 py-4 text-sm font-bold text-gray-700 shadow-sm transition-all hover:border-gray-300 hover:shadow-md hover:-translate-y-0.5 active:scale-[0.98]",children:[e.jsx("span",{children:f}),e.jsx(n,{className:"h-4 w-4 text-gray-400"})]})})]})]})]})}export{b as S};
