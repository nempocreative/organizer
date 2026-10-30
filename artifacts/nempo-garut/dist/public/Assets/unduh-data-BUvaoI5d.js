import{c as S,u as _,b as L,r as j,j as e,C}from"./index-BCuJtoaa.js";import{L as R,B as z,C as F}from"./layout-BJ9VUz81.js";import{S as T}from"./seo-BoEE2X2Q.js";import{A as B}from"./arrow-left-C_O2y0qV.js";import{F as k}from"./file-text-BKnQ3_d_.js";import{C as E}from"./circle-check-big-nWBiXnvC.js";import{C as W}from"./circle-alert-CB77-f4J.js";import{L as I}from"./loader-circle-BNFiT4dP.js";import{U}from"./user-He4u_0hl.js";import{a as M}from"./zap-BLdTYYmN.js";import"./contact-CB-haxcn.js";import"./compass-BjEJWElB.js";import"./map-pin-CW0j6_3w.js";import"./phone-DDcopEu9.js";const O=[["path",{d:"M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2",key:"169zse"}]],G=S("activity",O),h="/".replace(/\/$/,"")+"/../api",H=[{icon:U,color:"text-[#0194f3] bg-blue-50",title:"Profil & Akun",items:["Nama, email, nomor telepon","Avatar & foto profil","Tanggal bergabung","Preferensi tampilan"]},{icon:G,color:"text-violet-500 bg-violet-50",title:"Riwayat Aktivitas",items:["Login & logout","Perubahan profil","Destinasi yang dikunjungi","Riwayat ulasan"]},{icon:M,color:"text-emerald-500 bg-emerald-50",title:"Data Keamanan",items:["Sesi aktif & riwayat sesi","Status 2FA","IP address login","Perangkat terdaftar"]},{icon:z,color:"text-amber-500 bg-amber-50",title:"Preferensi",items:["Pengaturan notifikasi","Pilihan bahasa","Mata uang","Preferensi konten"]}];function i(a){if(a==null)return"–";if(typeof a=="boolean")return a?"Ya":"Tidak";if(typeof a=="string"&&a.match(/^\d{4}-\d{2}-\d{2}/))try{return new Date(a).toLocaleString("id-ID",{day:"numeric",month:"long",year:"numeric",hour:"2-digit",minute:"2-digit"})}catch{return a}return String(a)}function K(a){const v=new Date().toLocaleString("id-ID",{weekday:"long",day:"numeric",month:"long",year:"numeric",hour:"2-digit",minute:"2-digit"}),n=a.profile??{},o=Array.isArray(a.activities)?a.activities:[],p=Array.isArray(a.sessions)?a.sessions:[],m=a.notification_prefs??{},g=a.display_preferences??{},r=[["Nama",i(n.name)],["Email",i(n.email)],["Nomor Telepon",i(n.phone)],["Login dengan Google",i(n.is_google)],["Bergabung sejak",i(n.created_at)],["Login terakhir",i(n.last_login_at)]],d=([s,t])=>`
    <tr>
      <td class="label">${s}</td>
      <td class="value">${t}</td>
    </tr>`,c=o.slice(0,30).map(s=>{const t=s;return`<tr>
      <td>${i(t.created_at)}</td>
      <td>${i(t.action??t.type)}</td>
      <td>${i(t.description??t.detail??"")}</td>
    </tr>`}).join("")||'<tr><td colspan="3" class="empty">Belum ada aktivitas tercatat</td></tr>',f=p.slice(0,10).map(s=>{const t=s;return`<tr>
      <td>${i(t.created_at??t.started_at)}</td>
      <td>${i(t.device??t.user_agent??"")}</td>
      <td>${i(t.ip_address??t.ip??"")}</td>
    </tr>`}).join("")||'<tr><td colspan="3" class="empty">Tidak ada sesi tercatat</td></tr>',x=Object.entries(m).filter(([s])=>!s.startsWith("_")&&s!=="user_id"),b=x.length?x.map(([s,t])=>`<tr><td class="label">${s.replace(/_/g," ")}</td><td class="value">${i(t)}</td></tr>`).join(""):'<tr><td colspan="2" class="empty">Tidak ada preferensi notifikasi</td></tr>',l=Object.entries(g).filter(([s])=>!s.startsWith("_")),u=l.length?l.map(([s,t])=>`<tr><td class="label">${s.replace(/_/g," ")}</td><td class="value">${i(t)}</td></tr>`).join(""):'<tr><td colspan="2" class="empty">Menggunakan pengaturan default</td></tr>';return`<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8" />
<title>Data Akun – Nempo.id</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: "Segoe UI", Arial, sans-serif;
    font-size: 13px;
    color: #1a1a2e;
    background: #fff;
    padding: 36px 44px;
    max-width: 900px;
    margin: 0 auto;
  }
  /* Header */
  .header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    border-bottom: 3px solid #0194f3;
    padding-bottom: 16px;
    margin-bottom: 24px;
  }
  .brand { display: flex; align-items: center; gap: 12px; }
  .brand-icon {
    width: 48px; height: 48px;
    background: linear-gradient(135deg, #0194f3, #0172B1);
    border-radius: 12px;
    display: flex; align-items: center; justify-content: center;
    color: #fff; font-weight: 900; font-size: 18px; letter-spacing: -1px;
  }
  .brand-text h1 { font-size: 20px; font-weight: 900; color: #0194f3; line-height: 1; }
  .brand-text p { font-size: 11px; color: #888; margin-top: 2px; }
  .export-meta { text-align: right; }
  .export-meta p { font-size: 11px; color: #888; line-height: 1.6; }
  .export-meta strong { color: #444; }

  /* Section */
  .section { margin-bottom: 28px; page-break-inside: avoid; }
  .section-header {
    display: flex; align-items: center; gap: 8px;
    background: #f0f7ff;
    border-left: 4px solid #0194f3;
    padding: 8px 12px;
    border-radius: 0 8px 8px 0;
    margin-bottom: 10px;
  }
  .section-header h2 { font-size: 13px; font-weight: 800; color: #0172B1; }
  .section-header .icon { font-size: 15px; }

  /* Table */
  table { width: 100%; border-collapse: collapse; }
  th {
    background: #f8fafc;
    text-align: left;
    font-size: 11px;
    font-weight: 700;
    color: #888;
    padding: 7px 10px;
    border-bottom: 1px solid #e8ecf0;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  td {
    padding: 7px 10px;
    border-bottom: 1px solid #f1f5f9;
    font-size: 12px;
    vertical-align: top;
  }
  td.label { color: #666; width: 35%; font-weight: 500; }
  td.value { color: #1a1a2e; font-weight: 600; }
  td.empty { color: #aaa; font-style: italic; text-align: center; padding: 14px; }
  tr:last-child td { border-bottom: none; }
  tr:hover td { background: #fafcff; }

  /* Footer */
  .footer {
    margin-top: 32px;
    padding-top: 14px;
    border-top: 1px solid #e8ecf0;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .footer p { font-size: 10px; color: #bbb; }
  .footer .badge {
    background: #f0f7ff;
    color: #0194f3;
    font-size: 10px;
    font-weight: 700;
    padding: 3px 8px;
    border-radius: 20px;
    border: 1px solid #bae6fd;
  }

  /* Print */
  @media print {
    body { padding: 20px; }
    .no-print { display: none !important; }
    .section { page-break-inside: avoid; }
  }

  /* Print button (web only) */
  .print-bar {
    position: fixed; top: 0; left: 0; right: 0;
    background: #0194f3; color: #fff;
    padding: 10px 20px;
    display: flex; align-items: center; justify-content: space-between;
    font-size: 13px; font-weight: 600;
    box-shadow: 0 2px 12px rgba(1,148,243,0.3);
    z-index: 999;
  }
  .print-bar button {
    background: #fff; color: #0194f3;
    border: none; border-radius: 8px;
    padding: 6px 16px; font-weight: 700; font-size: 13px;
    cursor: pointer;
  }
  .print-bar button:hover { background: #e0f0ff; }
  @media print { .print-bar { display: none !important; } body { padding-top: 20px; } }
  body { padding-top: 58px; }
</style>
</head>
<body>

<div class="print-bar no-print">
  <span>📄 Data Akun Nempo.id — Siap dicetak / simpan sebagai PDF</span>
  <button onclick="window.print()">🖨️ Cetak / Simpan PDF</button>
</div>

<div class="header">
  <div class="brand">
    <div class="brand-icon">NG</div>
    <div class="brand-text">
      <h1>Nempo.id</h1>
      <p>Laporan Data Akun Pengguna</p>
    </div>
  </div>
  <div class="export-meta">
    <p><strong>Tanggal ekspor</strong></p>
    <p>${v}</p>
    <p style="margin-top:4px"><strong>Email:</strong> ${i(n.email)}</p>
  </div>
</div>

<!-- Profil -->
<div class="section">
  <div class="section-header">
    <span class="icon">👤</span>
    <h2>Profil &amp; Akun</h2>
  </div>
  <table>
    <tbody>
      ${r.map(d).join("")}
    </tbody>
  </table>
</div>

<!-- Aktivitas -->
<div class="section">
  <div class="section-header">
    <span class="icon">📋</span>
    <h2>Riwayat Aktivitas (${Math.min(o.length,30)} terbaru)</h2>
  </div>
  <table>
    <thead>
      <tr>
        <th style="width:32%">Waktu</th>
        <th style="width:25%">Aktivitas</th>
        <th>Keterangan</th>
      </tr>
    </thead>
    <tbody>${c}</tbody>
  </table>
</div>

<!-- Sesi -->
<div class="section">
  <div class="section-header">
    <span class="icon">🔒</span>
    <h2>Riwayat Sesi Login (${Math.min(p.length,10)} terbaru)</h2>
  </div>
  <table>
    <thead>
      <tr>
        <th style="width:32%">Waktu</th>
        <th>Perangkat</th>
        <th style="width:22%">IP Address</th>
      </tr>
    </thead>
    <tbody>${f}</tbody>
  </table>
</div>

<!-- Preferensi Notifikasi -->
<div class="section">
  <div class="section-header">
    <span class="icon">🔔</span>
    <h2>Preferensi Notifikasi</h2>
  </div>
  <table><tbody>${b}</tbody></table>
</div>

<!-- Preferensi Tampilan -->
<div class="section">
  <div class="section-header">
    <span class="icon">⚙️</span>
    <h2>Preferensi Tampilan</h2>
  </div>
  <table><tbody>${u}</tbody></table>
</div>

<div class="footer">
  <p>Dokumen ini digenerate otomatis oleh sistem Nempo.id. Bersifat rahasia — jangan sebarkan ke pihak lain.</p>
  <span class="badge">nempo-export-v2</span>
</div>

</body>
</html>`}function oe(){const[,a]=_(),{user:v}=L(),[n,o]=j.useState("idle"),[p,m]=j.useState(""),g=async()=>{o("loading"),m("");try{const r=localStorage.getItem("nempo_user_token"),d=r?{Authorization:`Bearer ${r}`}:{},[c,f,x,b]=await Promise.allSettled([fetch(`${h}/auth/me`,{headers:d}),fetch(`${h}/user/activities?limit=100`,{headers:d}),fetch(`${h}/user/sessions`,{headers:d}),fetch(`${h}/user/notifications/prefs`,{headers:d})]),l=async y=>y.status==="rejected"||!y.value.ok?null:y.value.json().catch(()=>null),u=await l(c),s=await l(f),t=await l(x),N=await l(b),P=(()=>{try{return JSON.parse(localStorage.getItem("nempo_display_prefs")||"{}")}catch{return{}}})(),A={profile:u??null,activities:s?.activities??s??[],sessions:t?.sessions??t??[],notification_prefs:N??{},display_preferences:P},D=K(A),$=new Blob([D],{type:"text/html;charset=utf-8"}),w=URL.createObjectURL($);window.open(w,"_blank"),setTimeout(()=>URL.revokeObjectURL(w),6e4),o("done")}catch(r){m(r?.message??"Terjadi kesalahan saat mengunduh data"),o("error")}};return e.jsxs(R,{children:[e.jsx(T,{title:"Unduh Data Akun",noIndex:!0}),e.jsxs("div",{className:"min-h-screen bg-gray-50 pb-24",children:[e.jsxs("div",{className:"relative pt-safe",style:{background:"linear-gradient(135deg, #001E6E 0%, #0046B8 60%, #0194f3 100%)"},children:[e.jsx("div",{className:"absolute inset-0 opacity-10 pointer-events-none",style:{backgroundImage:"radial-gradient(circle at 80% 30%, #FFC300 0%, transparent 55%)"}}),e.jsxs("div",{className:"relative px-4 pt-5 pb-6",children:[e.jsx("button",{onClick:()=>a("/settings"),className:"w-9 h-9 rounded-xl bg-white/10 backdrop-blur-sm border border-white/15 flex items-center justify-center mb-4",children:e.jsx(B,{className:"w-4 h-4 text-white",strokeWidth:2})}),e.jsxs("div",{className:"flex items-end gap-4",children:[e.jsx("div",{className:"w-14 h-14 rounded-2xl bg-white/15 backdrop-blur-sm border border-white/20 flex items-center justify-center shrink-0",children:e.jsx(k,{className:"w-7 h-7 text-white",strokeWidth:1.5})}),e.jsxs("div",{children:[e.jsx("h1",{className:"text-white font-black text-xl leading-none",children:"Unduh Data Saya"}),e.jsx("p",{className:"text-white/50 text-xs mt-1",children:"Ekspor seluruh data akun Anda"}),e.jsxs("div",{className:"flex items-center gap-1.5 mt-2",children:[e.jsx(k,{className:"w-3.5 h-3.5 text-white/50",strokeWidth:2}),e.jsx("span",{className:"text-white/60 text-[11px]",children:"Format PDF · Mudah Dibaca · Gratis"})]})]})]})]})]}),e.jsxs("div",{className:"px-4 pt-5 space-y-4",children:[e.jsxs("div",{className:"bg-white rounded-2xl border border-gray-100 shadow-sm px-4 py-5",children:[e.jsx("h2",{className:"text-sm font-black text-gray-800 mb-1",children:"Unduh Laporan Data Akun"}),e.jsxs("p",{className:"text-xs text-gray-400 leading-relaxed mb-4",children:["Data akun Anda akan dibuka sebagai halaman laporan yang rapi. Gunakan tombol",e.jsx("strong",{className:"text-gray-600",children:" Cetak / Simpan PDF"})," untuk menyimpannya ke perangkat."]}),n==="done"?e.jsxs("div",{className:"flex items-center gap-3 bg-emerald-50 border border-emerald-100 rounded-2xl px-4 py-4",children:[e.jsx(E,{className:"w-6 h-6 text-emerald-500 shrink-0",strokeWidth:2}),e.jsxs("div",{children:[e.jsx("p",{className:"text-sm font-bold text-emerald-700",children:"Laporan dibuka di tab baru!"}),e.jsx("p",{className:"text-xs text-emerald-600 mt-0.5",children:'Gunakan tombol "Cetak / Simpan PDF" di bagian atas halaman'})]}),e.jsx("button",{onClick:()=>o("idle"),className:"ml-auto text-xs font-bold text-emerald-600 bg-emerald-100 px-3 py-1.5 rounded-xl hover:bg-emerald-200 transition-colors shrink-0",children:"Buka Lagi"})]}):n==="error"?e.jsxs("div",{className:"space-y-3",children:[e.jsxs("div",{className:"flex items-start gap-3 bg-red-50 border border-red-100 rounded-2xl px-4 py-3",children:[e.jsx(W,{className:"w-5 h-5 text-red-500 shrink-0 mt-0.5",strokeWidth:2}),e.jsxs("div",{children:[e.jsx("p",{className:"text-sm font-bold text-red-700",children:"Gagal mengunduh"}),e.jsx("p",{className:"text-xs text-red-500 mt-0.5",children:p})]})]}),e.jsx("button",{onClick:()=>o("idle"),className:"w-full py-3 rounded-2xl text-sm font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors",children:"Coba Lagi"})]}):e.jsx("button",{onClick:g,disabled:n==="loading",className:"w-full flex items-center justify-center gap-3 py-4 rounded-2xl text-white font-bold text-sm transition-all shadow-lg disabled:opacity-70",style:{background:n==="loading"?"#78b8f8":"linear-gradient(135deg, #0194f3, #0172B1)"},children:n==="loading"?e.jsxs(e.Fragment,{children:[e.jsx(I,{className:"w-5 h-5 animate-spin",strokeWidth:2}),"Menyiapkan laporan..."]}):e.jsxs(e.Fragment,{children:[e.jsx(k,{className:"w-5 h-5",strokeWidth:2.5}),"Buka Laporan PDF"]})})]}),e.jsxs("div",{children:[e.jsx("p",{className:"text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1",children:"Data yang Disertakan"}),e.jsx("div",{className:"space-y-2",children:H.map(r=>{const d=r.icon;return e.jsxs("div",{className:"bg-white rounded-2xl border border-gray-100 shadow-sm px-4 py-4",children:[e.jsxs("div",{className:"flex items-center gap-3 mb-3",children:[e.jsx("div",{className:`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${r.color}`,children:e.jsx(d,{className:"w-4 h-4",strokeWidth:2})}),e.jsx("p",{className:"text-sm font-black text-gray-800",children:r.title})]}),e.jsx("div",{className:"space-y-1.5 pl-11",children:r.items.map(c=>e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx(F,{className:"w-3 h-3 text-gray-300 shrink-0",strokeWidth:2.5}),e.jsx("p",{className:"text-xs text-gray-500",children:c})]},c))})]},r.title)})})]}),e.jsxs("div",{className:"flex items-start gap-3 bg-amber-50 border border-amber-100 rounded-2xl px-4 py-3",children:[e.jsx(C,{className:"w-4 h-4 text-amber-500 shrink-0 mt-0.5",strokeWidth:2}),e.jsx("p",{className:"text-xs text-amber-700 leading-relaxed",children:"Laporan berisi data real-time akun Anda. Simpan file di tempat yang aman karena berisi informasi pribadi."})]})]})]})]})}export{oe as default};
