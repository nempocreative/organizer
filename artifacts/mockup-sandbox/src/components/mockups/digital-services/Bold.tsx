import "./bold.css";
import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronRight,
  Circle,
  Globe2,
  Mail,
  Menu,
  MonitorSmartphone,
  Palette,
  QrCode,
  ReceiptText,
  ShoppingBag,
  Sparkles,
  Store,
  Ticket,
  Users,
  Zap,
} from "lucide-react";
import { useState } from "react";

const NEMPO_INSTAGRAM_DM_URL = "https://ig.me/m/nempo.id";

// Keep the extracted page's standalone chrome stubs intact.
function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

function SEO(_props: Record<string, string>) {
  return null;
}

type PlatformId = "ticketing" | "kasir" | "invitation" | "company";

type Platform = {
  id: PlatformId;
  label: string;
  title: string;
  description: string;
  accent: string;
  accentSoft: string;
  icon: LucideIcon;
  features: string[];
  number: string;
};

const platforms: Platform[] = [
  {
    id: "ticketing",
    label: "EVENT TICKETING",
    title: "Platform ticketing event",
    description: "Jual tiket, atur kuota, dan pantau penjualan event dari satu dashboard yang rapi.",
    accent: "#ee6a4d",
    accentSoft: "#fbe0d7",
    icon: Ticket,
    features: ["Tiket online", "Check-in QR", "Dashboard penjualan"],
    number: "01",
  },
  {
    id: "kasir",
    label: "F&B POS",
    title: "Platform kasir F&B",
    description: "Bantu tim kasir bekerja lebih cepat dengan order, stok, dan laporan penjualan yang terhubung.",
    accent: "#c9972c",
    accentSoft: "#f7e9b9",
    icon: ReceiptText,
    features: ["Order & meja", "Stok bahan", "Laporan harian"],
    number: "02",
  },
  {
    id: "invitation",
    label: "DIGITAL INVITATION",
    title: "Invitation digital",
    description: "Undangan online yang personal, elegan, dan mudah dibagikan untuk momen yang paling penting.",
    accent: "#9b6b9f",
    accentSoft: "#eadcea",
    icon: Mail,
    features: ["RSVP online", "Galeri momen", "Ucapan tamu"],
    number: "03",
  },
  {
    id: "company",
    label: "COMPANY WEBSITE",
    title: "Website company",
    description: "Bangun kesan pertama yang kuat dengan website company yang cepat, jelas, dan siap berkembang.",
    accent: "#368579",
    accentSoft: "#d7ebe5",
    icon: Globe2,
    features: ["Profil perusahaan", "Portofolio", "Form kontak"],
    number: "04",
  },
];

const reasons = [
  { icon: Zap, title: "Cepat dipahami", text: "Alur sederhana untuk tim dan pelanggan." },
  { icon: MonitorSmartphone, title: "Siap di semua layar", text: "Nyaman dipakai dari ponsel hingga desktop." },
  { icon: Users, title: "Tumbuh bersama", text: "Bisa dikembangkan saat kebutuhan berubah." },
];

export function Bold() {
  const [selectedId, setSelectedId] = useState<PlatformId>("ticketing");
  const selected = platforms.find((platform) => platform.id === selectedId) ?? platforms[0];
  const SelectedIcon = selected.icon;

  return (
    <Layout>
      <SEO
        title="Digitalisasi Bisnis — Nempo.id"
        description="Demo platform digital Nempo.id: ticketing event, kasir F&B, invitation digital, dan website company."
        keywords="platform ticketing event, kasir F&B, invitation digital, website company, digitalisasi bisnis Garut"
        path="/digital-services"
      />

      <main className="nempo-bold min-h-screen overflow-hidden">
        <section className="paper-noise relative overflow-hidden border-b-2 border-[#172a3a]">
          <div className="mx-auto max-w-7xl px-5 pb-10 pt-5 sm:px-8 sm:pb-14 lg:px-12 lg:pb-16">
            <div className="flex items-center justify-between border-b-2 border-[#172a3a] pb-4">
              <a href="#top" className="group flex items-center gap-3" aria-label="Nempo digital">
                <span className="grid h-9 w-9 place-items-center bg-[#ee6a4d] text-[#f5efe4]">
                  <Circle className="h-4 w-4 fill-current" />
                </span>
                <span className="display text-base font-black tracking-[-0.04em]">NEMPO<span className="text-[#ee6a4d]">.</span></span>
              </a>
              <div className="hidden items-center gap-8 sm:flex">
                <a href="#platforms" className="mono text-[10px] font-bold uppercase tracking-[0.14em] hover:text-[#ee6a4d]">Platform</a>
                <a href="#why" className="mono text-[10px] font-bold uppercase tracking-[0.14em] hover:text-[#ee6a4d]">Cara kerja</a>
                <a href={NEMPO_INSTAGRAM_DM_URL} target="_blank" rel="noopener noreferrer" className="mono inline-flex items-center gap-2 bg-[#172a3a] px-4 py-2.5 text-[10px] font-bold uppercase tracking-[0.12em] text-[#f5efe4] hover:bg-[#ee6a4d]">
                  Mulai ngobrol <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
              </div>
              <a href={NEMPO_INSTAGRAM_DM_URL} target="_blank" rel="noopener noreferrer" className="sm:hidden" aria-label="Mulai ngobrol">
                <ArrowUpRight className="h-5 w-5" />
              </a>
            </div>

            <div id="top" className="grid gap-8 pt-8 lg:grid-cols-[.94fr_1.06fr] lg:items-center lg:gap-12 lg:pt-10">
              <div className="hero-rule max-w-2xl pl-8 sm:pl-10">
                <div className="rise-in">
                  <h1 className="display max-w-2xl text-[3.2rem] font-black leading-[0.9] tracking-[-0.07em] text-[#172a3a] sm:text-[4.7rem] lg:text-[5.2rem]">
                    Bikin yang
                    <br />
                    jalan<span className="text-[#ee6a4d]">.</span>
                    <br />
                    <span className="relative inline-block">
                      Bikin yang
                      <span className="absolute -bottom-2 left-1 h-3 w-[92%] -rotate-2 bg-[#f3c968] sm:-bottom-1 sm:h-4" />
                    </span>
                    <br />
                    <span className="relative z-10">diingat<span className="text-[#ee6a4d]">.</span></span>
                  </h1>
                  <p className="mt-6 max-w-md text-base leading-7 text-[#2e4657] sm:text-lg">
                    Kami membangun produk digital yang membantu event, bisnis F&B, momen personal, dan perusahaan tampil lebih siap.
                  </p>
                  <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                    <a href={NEMPO_INSTAGRAM_DM_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-3 bg-[#ee6a4d] px-5 py-3.5 text-sm font-black text-[#172a3a] shadow-[6px_6px_0_#172a3a] transition-transform hover:-translate-y-1 hover:shadow-[8px_8px_0_#172a3a]">
                      Konsultasikan ide <ArrowRight className="h-4 w-4" />
                    </a>
                    <a href="#platforms" className="inline-flex items-center justify-center gap-2 border-2 border-[#172a3a] px-5 py-3.5 text-sm font-black hover:bg-[#172a3a] hover:text-[#f5efe4]">
                      Lihat platform <ChevronRight className="h-4 w-4" />
                    </a>
                  </div>
                </div>
              </div>

              <RouteMap />
            </div>
          </div>
          <div className="mono flex items-center justify-between border-t-2 border-[#172a3a] px-5 py-3 text-[9px] font-bold uppercase tracking-[0.16em] sm:px-8 lg:px-12">
            <span>Digital product studio</span>
            <span className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-[#368579]" /> Open for good ideas</span>
          </div>
        </section>

        <section id="platforms" className="ruled border-b-2 border-[#172a3a] px-5 py-14 sm:px-8 sm:py-20 lg:px-12">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-8 lg:grid-cols-[.72fr_1.28fr] lg:items-end">
              <div>
                <p className="mono text-[10px] font-bold uppercase tracking-[0.22em] text-[#ee6a4d]">01 / Pilih kebutuhanmu</p>
                <h2 className="display mt-4 max-w-md text-4xl font-black leading-[0.94] tracking-[-0.06em] sm:text-6xl">
                  Satu studio.
                  <br />
                  <span className="text-[#368579]">Empat arah.</span>
                </h2>
              </div>
              <p className="max-w-lg text-sm leading-7 text-[#2e4657] sm:justify-self-end sm:text-base">
                Pilih salah satu platform untuk melihat contoh alur dan tampilan yang bisa kami kembangkan untuk bisnis Anda.
              </p>
            </div>

            <div className="mt-10 grid grid-cols-2 border-2 border-[#172a3a] sm:grid-cols-4">
              {platforms.map((platform, index) => {
                const Icon = platform.icon;
                const isSelected = platform.id === selected.id;
                return (
                  <button
                    key={platform.id}
                    type="button"
                    onClick={() => setSelectedId(platform.id)}
                    aria-pressed={isSelected}
                    className={`group relative min-h-[176px] border-b-2 border-r-2 border-[#172a3a] p-4 text-left transition-transform hover:-translate-y-1 sm:min-h-[210px] sm:p-6 ${index > 1 ? "border-b-0 sm:border-b-0" : ""} ${index === 1 || index === 3 ? "border-r-0 sm:border-r-2" : ""} ${index === 2 || index === 3 ? "sm:border-b-0" : ""} ${isSelected ? "text-[#172a3a]" : "bg-[#f5efe4]"}`}
                    style={isSelected ? { backgroundColor: platform.accentSoft } : undefined}
                  >
                    <div className="flex items-start justify-between">
                      <span className="mono text-[10px] font-bold">{platform.number}</span>
                      <Icon className="h-5 w-5" style={{ color: platform.accent }} />
                    </div>
                    <p className="mono mt-9 text-[9px] font-bold uppercase tracking-[0.12em]" style={{ color: platform.accent }}>{platform.label}</p>
                    <h3 className="display mt-2 max-w-[11rem] text-lg font-black leading-tight tracking-[-0.04em] sm:text-xl">{platform.title}</h3>
                    <span className="absolute bottom-4 right-4 opacity-0 transition-opacity group-hover:opacity-100 sm:bottom-6 sm:right-6">
                      <ArrowUpRight className="h-4 w-4" />
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="mt-10 grid border-2 border-[#172a3a] bg-[#f5efe4] lg:grid-cols-[.82fr_1.18fr]">
              <div className="platform-enter p-6 sm:p-9 lg:p-12" key={selected.id}>
                <div className="flex items-start justify-between">
                  <div className="grid h-14 w-14 place-items-center border-2 border-[#172a3a]" style={{ backgroundColor: selected.accentSoft, color: selected.accent }}>
                    <SelectedIcon className="h-6 w-6" />
                  </div>
                  <span className="mono border-2 border-[#172a3a] px-2.5 py-1.5 text-[9px] font-bold uppercase tracking-[0.14em]">Live preview</span>
                </div>
                <p className="mono mt-12 text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: selected.accent }}>{selected.label}</p>
                <h3 className="display mt-3 max-w-md text-4xl font-black leading-[0.92] tracking-[-0.06em] sm:text-5xl">{selected.title}</h3>
                <p className="mt-5 max-w-md text-sm leading-7 text-[#2e4657] sm:text-base">{selected.description}</p>
                <div className="mt-7 space-y-3">
                  {selected.features.map((feature) => (
                    <div key={feature} className="flex items-center gap-3 border-b border-[#172a3a]/20 pb-3 text-sm font-bold">
                      <span className="grid h-5 w-5 place-items-center" style={{ backgroundColor: selected.accent, color: "#f5efe4" }}><Check className="h-3.5 w-3.5" /></span>
                      {feature}
                    </div>
                  ))}
                </div>
                <a href={NEMPO_INSTAGRAM_DM_URL} target="_blank" rel="noopener noreferrer" className="mt-8 inline-flex items-center gap-3 border-2 border-[#172a3a] bg-[#172a3a] px-5 py-3.5 text-sm font-black text-[#f5efe4] hover:bg-[#ee6a4d] hover:text-[#172a3a]">
                  Minta demo untuk bisnis saya <ArrowRight className="h-4 w-4" />
                </a>
              </div>
              <div className="platform-enter border-t-2 border-[#172a3a] p-4 sm:p-8 lg:border-l-2 lg:border-t-0" style={{ backgroundColor: selected.accentSoft }} key={`preview-${selected.id}`}>
                <PlatformPreview platform={selected} />
              </div>
            </div>
          </div>
        </section>

        <section id="why" className="border-b-2 border-[#172a3a] bg-[#b9d8cf] px-5 py-14 sm:px-8 sm:py-20 lg:px-12">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[.8fr_1.2fr] lg:gap-20">
            <div>
              <p className="mono text-[10px] font-bold uppercase tracking-[0.22em] text-[#368579]">02 / Dibuat untuk bergerak</p>
              <h2 className="display mt-4 max-w-md text-4xl font-black leading-[0.93] tracking-[-0.06em] sm:text-6xl">
                Bukan sekadar tampil bagus<span className="text-[#ee6a4d]">.</span>
                <br />
                <span className="text-[#368579]">Harus bekerja.</span>
              </h2>
            </div>
            <div className="grid border-2 border-[#172a3a] bg-[#f5efe4] sm:grid-cols-3">
              {reasons.map(({ icon: Icon, title, text }, index) => (
                <div key={title} className={`p-5 sm:p-6 ${index < 2 ? "border-b-2 sm:border-b-0 sm:border-r-2" : ""}`}>
                  <Icon className="h-6 w-6 text-[#ee6a4d]" />
                  <h3 className="display mt-14 text-xl font-black tracking-[-0.04em]">{title}</h3>
                  <p className="mt-3 text-sm leading-6 text-[#2e4657]">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#172a3a] px-5 py-14 text-[#f5efe4] sm:px-8 sm:py-20 lg:px-12">
          <div className="mx-auto grid max-w-7xl gap-8 sm:grid-cols-[1fr_auto] sm:items-end">
            <div>
              <p className="mono text-[10px] font-bold uppercase tracking-[0.22em] text-[#f3c968]">03 / Punya kebutuhan lain?</p>
              <h2 className="display mt-4 max-w-3xl text-4xl font-black leading-[0.92] tracking-[-0.06em] sm:text-6xl">
                Ceritakan idemu<span className="text-[#ee6a4d]">,</span>
                <br />
                kami bantu bentuk digitalnya<span className="text-[#f3c968]">.</span>
              </h2>
            </div>
            <a href={NEMPO_INSTAGRAM_DM_URL} target="_blank" rel="noopener noreferrer" className="inline-flex w-fit items-center gap-3 bg-[#f3c968] px-5 py-3.5 text-sm font-black text-[#172a3a] shadow-[6px_6px_0_#ee6a4d] transition-transform hover:-translate-y-1">
              Mulai ngobrol <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>
          <div className="mx-auto mt-16 flex max-w-7xl items-center justify-between border-t border-[#f5efe4]/25 pt-4">
            <span className="display text-lg font-black tracking-[-0.04em]">NEMPO<span className="text-[#ee6a4d]">.</span></span>
            <span className="mono text-[9px] uppercase tracking-[0.16em] text-[#f5efe4]/55">Satu ide. Empat cara tumbuh.</span>
          </div>
        </section>
      </main>
    </Layout>
  );
}

function RouteMap() {
  const routeItems = [
    { icon: Ticket, label: "Ticketing", detail: "Event & check-in", accent: "coral" },
    { icon: ReceiptText, label: "F&B POS", detail: "Order & operasional", accent: "sun" },
    { icon: Mail, label: "Invitation", detail: "Momen & RSVP", accent: "sea" },
    { icon: Globe2, label: "Company", detail: "Brand & website", accent: "lilac" },
  ];

  return (
    <div className="route-card rise-in delay-2 mx-auto w-full max-w-[520px]">
      <div className="relative z-10 flex items-start justify-between border-b border-[#f5efe4]/25 px-5 py-4">
        <div>
          <p className="mono text-[9px] font-bold uppercase tracking-[0.18em] text-[#f3c968]">Nempo / digital map</p>
          <p className="display mt-1 text-xl font-black tracking-[-0.04em] text-[#f5efe4]">Empat arah. Satu sistem.</p>
        </div>
        <span className="mono border border-[#f5efe4]/25 px-2 py-1 text-[9px] font-bold text-[#f3c968]">04</span>
      </div>
      <div className="route-map-grid">
        {routeItems.map(({ icon: Icon, label, detail, accent }, index) => (
          <div key={label} className={`route-map-item ${accent}`}>
            <div className="flex items-start justify-between">
              <div className="route-map-icon"><Icon className="h-4 w-4" /></div>
              <span className="mono text-[8px] font-bold opacity-60">0{index + 1}</span>
            </div>
            <div className="mt-5">
              <p className="text-[11px] font-black tracking-[-0.02em]">{label}</p>
              <p className="mono mt-1 text-[8px] uppercase tracking-[0.08em] opacity-55">{detail}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="mono flex items-center justify-between border-t border-[#f5efe4]/25 px-5 py-3 text-[8px] font-bold uppercase tracking-[0.14em] text-[#f5efe4]/55">
        <span>One studio / four products</span>
        <span className="text-[#f3c968]">Built in Garut</span>
      </div>
    </div>
  );
}

function PreviewShell({ platform, children }: { platform: Platform; children: ReactNode }) {
  return (
    <div className="preview-frame mx-auto max-w-2xl overflow-hidden">
      <div className="preview-top flex items-center gap-2 px-4 py-3">
        <div className="preview-dots flex gap-1.5"><span /><span /><span /></div>
        <div className="mono ml-2 flex-1 border border-[#172a3a]/20 bg-[#fffaf2] px-3 py-1.5 text-[9px] text-[#2e4657]">demo.nempo.id/{platform.id}</div>
        <Menu className="h-4 w-4" />
      </div>
      {children}
    </div>
  );
}

function PlatformPreview({ platform }: { platform: Platform }) {
  switch (platform.id) {
    case "ticketing": return <TicketingPreview platform={platform} />;
    case "kasir": return <KasirPreview platform={platform} />;
    case "invitation": return <InvitationPreview platform={platform} />;
    case "company": return <CompanyPreview platform={platform} />;
  }
}

function TicketingPreview({ platform }: { platform: Platform }) {
  return (
    <PreviewShell platform={platform}>
      <div className="bg-[#fffaf2] p-5 sm:p-7">
        <div className="flex items-start justify-between">
          <div><p className="mono text-[9px] font-bold uppercase tracking-[0.18em] text-[#ee6a4d]">Dashboard event</p><h4 className="display mt-2 text-3xl font-black tracking-[-0.06em]">Riuh Rona</h4><p className="mt-1 text-[10px] text-[#2e4657]">Sabtu · Garut</p></div>
          <div className="grid h-10 w-10 place-items-center bg-[#ee6a4d]"><Ticket className="h-5 w-5 text-[#172a3a]" /></div>
        </div>
        <div className="mt-7 grid grid-cols-3 gap-2">
          {["Atur tiket", "Pantau check-in", "Kelola tamu"].map((item) => <div key={item} className="border-2 border-[#172a3a] bg-[#fbe0d7] p-3"><Check className="h-4 w-4 text-[#ee6a4d]" /><p className="mt-6 text-[9px] font-bold leading-4">{item}</p></div>)}
        </div>
        <div className="mt-3 border-2 border-[#172a3a] bg-white p-4">
          <div className="flex items-center justify-between"><p className="text-[10px] font-black">Alur event</p><span className="mono text-[9px] font-bold text-[#368579]">Terhubung</span></div>
          <div className="mt-4 space-y-2">{["Tiket online", "Check-in QR", "Laporan event"].map((item) => <div key={item} className="flex items-center justify-between border-b border-[#172a3a]/15 py-2 text-[9px] font-bold"><span>{item}</span><Check className="h-3.5 w-3.5 text-[#ee6a4d]" /></div>)}</div>
        </div>
        <div className="mt-3 flex items-center justify-between bg-[#172a3a] px-4 py-3 text-[#f5efe4]"><div className="flex items-center gap-2"><QrCode className="h-4 w-4 text-[#f3c968]" /><span className="text-[10px] font-bold">Scan untuk check-in</span></div><ArrowRight className="h-4 w-4 text-[#f3c968]" /></div>
      </div>
    </PreviewShell>
  );
}

function KasirPreview({ platform }: { platform: Platform }) {
  return (
    <PreviewShell platform={platform}>
      <div className="bg-[#fffaf2] p-5 sm:p-7">
        <div className="flex items-center justify-between"><div className="flex items-center gap-2"><div className="grid h-9 w-9 place-items-center bg-[#f7e9b9]"><Store className="h-4 w-4 text-[#c9972c]" /></div><div><p className="text-[11px] font-black">Kopi Nempo</p><p className="text-[9px] text-[#2e4657]">Kasir utama · Shift pagi</p></div></div><Menu className="h-5 w-5" /></div>
        <div className="mt-6 grid gap-3 sm:grid-cols-[1.15fr_.85fr]">
          <div className="border-2 border-[#172a3a] bg-[#f7e9b9] p-3"><div className="flex items-center justify-between"><p className="text-[10px] font-black">Menu favorit</p><span className="mono text-[8px] font-bold">Lihat semua</span></div><div className="mt-3 grid grid-cols-2 gap-2">{["Kopi Susu", "Croissant", "Nasi Ayam", "Matcha"].map((item) => <div key={item} className="border border-[#172a3a]/20 bg-[#fffaf2] p-2.5"><div className="h-7 w-7 bg-[#c9972c]" /><p className="mt-2 text-[9px] font-black">{item}</p><p className="mt-0.5 text-[8px] font-bold text-[#c9972c]">Tambah ke order</p></div>)}</div></div>
          <div className="bg-[#172a3a] p-4 text-[#f5efe4]"><div className="flex items-center justify-between"><p className="text-[10px] font-black">Pesanan aktif</p><ShoppingBag className="h-4 w-4 text-[#f3c968]" /></div><div className="mt-6 space-y-3 text-[9px] text-[#f5efe4]/70"><div className="flex justify-between"><span>Kopi Susu</span><Check className="h-3.5 w-3.5 text-[#f3c968]" /></div><div className="flex justify-between"><span>Croissant</span><Check className="h-3.5 w-3.5 text-[#f3c968]" /></div><div className="border-t border-[#f5efe4]/20 pt-3 text-[10px] font-black"><div className="flex justify-between"><span>Status order</span><span className="text-[#f3c968]">Siap dibayar</span></div></div></div><button type="button" className="mt-5 w-full bg-[#ee6a4d] py-2.5 text-[10px] font-black text-[#172a3a]">Bayar sekarang</button></div>
        </div>
        <div className="mt-3 flex items-center justify-between border-2 border-[#172a3a] bg-white px-4 py-3"><div className="flex items-center gap-2"><ReceiptText className="h-4 w-4 text-[#c9972c]" /><span className="text-[10px] font-bold">Operasional toko</span></div><span className="mono text-[9px] font-bold text-[#c9972c]">Terkelola</span></div>
      </div>
    </PreviewShell>
  );
}

function InvitationPreview({ platform }: { platform: Platform }) {
  return (
    <PreviewShell platform={platform}>
      <div className="bg-[#f8eff7] p-5 sm:p-7">
        <div className="border-2 border-[#172a3a] bg-[#fffaf2] px-5 py-8 text-center sm:px-10"><div className="mx-auto grid h-10 w-10 place-items-center bg-[#eadcea] text-[#9b6b9f]"><Mail className="h-5 w-5" /></div><p className="mono mt-5 text-[9px] font-bold uppercase tracking-[0.22em] text-[#9b6b9f]">The wedding of</p><h4 className="display mt-3 text-4xl font-black tracking-[-0.06em]">Alya &amp; Reza</h4><div className="mx-auto my-4 h-0.5 w-16 bg-[#ee6a4d]" /><p className="text-[10px] leading-5 text-[#2e4657]">Hari bahagia Alya &amp; Reza<br />The Papandayan · Garut</p><div className="mx-auto mt-6 grid max-w-xs grid-cols-3 gap-2">{["RSVP online", "Galeri momen", "Ucapan tamu"].map((item) => <div key={item} className="border border-[#172a3a]/15 bg-[#eadcea] px-2 py-2.5"><Check className="mx-auto h-3.5 w-3.5 text-[#9b6b9f]" /><p className="mt-1.5 text-[8px] font-bold leading-3 text-[#9b6b9f]">{item}</p></div>)}</div><button type="button" className="mt-6 bg-[#9b6b9f] px-5 py-2.5 text-[10px] font-black text-[#fffaf2]">Buka undangan</button></div>
      </div>
    </PreviewShell>
  );
}

function CompanyPreview({ platform }: { platform: Platform }) {
  return (
    <PreviewShell platform={platform}>
      <div className="bg-[#eff7f2] p-5 sm:p-7">
        <div className="flex items-center justify-between border-b-2 border-[#172a3a] pb-4"><div className="flex items-center gap-2"><div className="grid h-8 w-8 place-items-center bg-[#368579] text-[#f5efe4]"><Globe2 className="h-4 w-4" /></div><span className="text-xs font-black">ARUNA STUDIO</span></div><div className="hidden items-center gap-4 text-[9px] font-bold sm:flex"><span>About</span><span>Services</span><span>Work</span><span>Contact</span></div><Menu className="h-4 w-4 sm:hidden" /></div>
        <div className="grid items-center gap-5 py-7 sm:grid-cols-[1.1fr_.9fr]"><div><p className="mono text-[9px] font-bold uppercase tracking-[0.2em] text-[#368579]">Creative digital partner</p><h4 className="display mt-2 text-3xl font-black leading-tight tracking-[-0.06em]">Make your brand <span className="text-[#368579]">matter.</span></h4><p className="mt-3 max-w-xs text-[10px] leading-5 text-[#2e4657]">Strategi, desain, dan teknologi untuk bisnis yang ingin bergerak lebih jauh.</p><button type="button" className="mt-5 inline-flex items-center gap-1.5 bg-[#368579] px-3.5 py-2.5 text-[9px] font-black text-[#f5efe4]">Lihat portofolio <ArrowRight className="h-3 w-3" /></button></div><div className="relative h-36 overflow-hidden border-2 border-[#172a3a] bg-[#172a3a] p-4"><div className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full border border-[#b9d8cf]"><Palette className="h-4 w-4 text-[#b9d8cf]" /></div><p className="mono text-[9px] font-bold text-[#b9d8cf]">Selected work</p><p className="display absolute bottom-4 left-4 text-3xl font-black tracking-[-0.08em] text-[#f5efe4]">ARUNA</p></div></div>
        <div className="grid grid-cols-3 gap-2 border-t-2 border-[#172a3a] pt-4">{["Brand strategy", "Web development", "Digital campaign"].map((item) => <div key={item} className="bg-[#d7ebe5] p-2.5"><Check className="h-3.5 w-3.5 text-[#368579]" /><p className="mt-2 text-[9px] font-bold leading-4">{item}</p></div>)}</div>
      </div>
    </PreviewShell>
  );
}