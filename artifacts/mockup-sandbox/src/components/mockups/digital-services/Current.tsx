import "./_group.css";
import type { ReactNode } from "react";

// Standalone stubs: the extracted page keeps its real content without app chrome or head management.
const NEMPO_INSTAGRAM_DM_URL = "https://ig.me/m/nempo.id";
function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
function SEO(_props: Record<string, string>) {
  return null;
}
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  Check,
  ChevronRight,
  Globe2,
  LayoutDashboard,
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
};

const platforms: Platform[] = [
  {
    id: "ticketing",
    label: "EVENT TICKETING",
    title: "Platform ticketing event",
    description:
      "Jual tiket, atur kuota, dan pantau penjualan event dari satu dashboard yang rapi.",
    accent: "#7c3aed",
    accentSoft: "#f3e8ff",
    icon: Ticket,
    features: ["Tiket online", "Check-in QR", "Dashboard penjualan"],
  },
  {
    id: "kasir",
    label: "F&B POS",
    title: "Platform kasir F&B",
    description:
      "Bantu tim kasir bekerja lebih cepat dengan order, stok, dan laporan penjualan yang terhubung.",
    accent: "#ea580c",
    accentSoft: "#fff7ed",
    icon: ReceiptText,
    features: ["Order & meja", "Stok bahan", "Laporan harian"],
  },
  {
    id: "invitation",
    label: "DIGITAL INVITATION",
    title: "Invitation digital",
    description:
      "Undangan online yang personal, elegan, dan mudah dibagikan untuk momen yang paling penting.",
    accent: "#db2777",
    accentSoft: "#fdf2f8",
    icon: Mail,
    features: ["RSVP online", "Galeri momen", "Ucapan tamu"],
  },
  {
    id: "company",
    label: "COMPANY WEBSITE",
    title: "Website company",
    description:
      "Bangun kesan pertama yang kuat dengan website company yang cepat, jelas, dan siap berkembang.",
    accent: "#0891b2",
    accentSoft: "#ecfeff",
    icon: Globe2,
    features: ["Profil perusahaan", "Portofolio", "Form kontak"],
  },
];

const activeButtonClass =
  "inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3.5 text-sm font-black text-white shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl";

export function Current() {
  const [selectedId, setSelectedId] = useState<PlatformId>("ticketing");
  const selected = platforms.find((platform) => platform.id === selectedId) ?? platforms[0];

  return (
    <Layout>
      <SEO
        title="Digitalisasi Bisnis — Nempo.id"
        description="Demo platform digital Nempo.id: ticketing event, kasir F&B, invitation digital, dan website company."
        keywords="platform ticketing event, kasir F&B, invitation digital, website company, digitalisasi bisnis Garut"
        path="/digital-services"
      />

      <main className="overflow-hidden bg-[#f7f9fc]">
        <section className="relative overflow-hidden bg-[#07152f] text-white">
          <div className="absolute -right-40 -top-44 h-[34rem] w-[34rem] rounded-full bg-cyan-400/15 blur-3xl" />
          <div className="absolute -bottom-48 left-1/4 h-[30rem] w-[30rem] rounded-full bg-violet-500/15 blur-3xl" />
          <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(255,255,255,.35)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.35)_1px,transparent_1px)] [background-size:48px_48px]" />

          <div className="relative mx-auto max-w-7xl px-4 pb-10 pt-12 sm:px-6 sm:pb-14 sm:pt-16 lg:px-8 lg:pb-20 lg:pt-20">
            <div className="grid items-center gap-10 lg:grid-cols-[.95fr_1.05fr] lg:gap-16">
              <div>
                <h1 className="max-w-xl text-[2.7rem] font-black leading-[0.95] tracking-tight sm:text-6xl">
                  Satu ide.
                  <br />
                  <span className="bg-gradient-to-r from-cyan-200 via-white to-violet-200 bg-clip-text text-transparent">
                    Empat cara
                  </span>{" "}
                  tumbuh.
                </h1>
                <p className="mt-6 max-w-lg text-base leading-7 text-white/65 sm:text-lg">
                  Kami membangun produk digital yang membantu event, bisnis F&B,
                  momen personal, dan perusahaan tampil lebih siap.
                </p>
                <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                  <a
                    href={NEMPO_INSTAGRAM_DM_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={activeButtonClass}
                    style={{ background: "linear-gradient(135deg,#06b6d4,#2563eb)" }}
                  >
                    Konsultasikan ide
                    <ArrowRight className="h-4 w-4" />
                  </a>
                  <a
                    href="#platforms"
                    className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/10 px-5 py-3.5 text-sm font-black text-white transition-all hover:bg-white/15"
                  >
                    Lihat platform
                    <ChevronRight className="h-4 w-4" />
                  </a>
                </div>
              </div>

              <HeroCommandCenter />
            </div>
          </div>
        </section>

        <section id="platforms" className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
          <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="mb-2 text-[10px] font-black uppercase tracking-[0.22em] text-cyan-600">
                Pilih kebutuhanmu
              </p>
              <h2 className="text-3xl font-black tracking-tight text-[#101322] sm:text-4xl">
                Demo produk digital
              </h2>
            </div>
            <p className="max-w-md text-sm leading-6 text-gray-500">
              Pilih salah satu platform untuk melihat contoh alur dan tampilan
              yang bisa kami kembangkan untuk bisnis Anda.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {platforms.map((platform) => {
              const Icon = platform.icon;
              const isSelected = platform.id === selected.id;
              return (
                <button
                  key={platform.id}
                  type="button"
                  onClick={() => setSelectedId(platform.id)}
                  className={`group relative overflow-hidden rounded-3xl border p-4 text-left transition-all sm:p-5 ${
                    isSelected
                      ? "border-transparent bg-white shadow-xl shadow-slate-900/10"
                      : "border-gray-200 bg-white/70 hover:-translate-y-0.5 hover:bg-white hover:shadow-lg"
                  }`}
                  style={isSelected ? { boxShadow: `0 18px 45px ${platform.accent}20` } : {}}
                >
                  <div
                    className="absolute inset-x-0 top-0 h-1 transition-all"
                    style={{ backgroundColor: isSelected ? platform.accent : "transparent" }}
                  />
                  <div className="flex items-start justify-between gap-2">
                    <div
                      className="flex h-10 w-10 items-center justify-center rounded-2xl"
                      style={{ backgroundColor: platform.accentSoft, color: platform.accent }}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: platform.accent }} />
                  </div>
                  <p className="mt-5 text-[9px] font-black tracking-[0.14em]" style={{ color: platform.accent }}>
                    {platform.label}
                  </p>
                  <h3 className="mt-1 text-sm font-black leading-snug text-[#101322] sm:text-base">
                    {platform.title}
                  </h3>
                  <div className="mt-4 flex items-center gap-1 text-[11px] font-black text-gray-400 transition-colors group-hover:text-gray-700">
                    Lihat demo
                    <ArrowRight className="h-3 w-3" />
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-6 overflow-hidden rounded-[2rem] border border-gray-200 bg-white shadow-xl shadow-slate-900/[0.04]">
            <div className="grid lg:grid-cols-[.82fr_1.18fr]">
              <div className="p-6 sm:p-8 lg:p-10">
                <div className="flex items-center justify-between">
                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-2xl"
                    style={{ backgroundColor: selected.accentSoft, color: selected.accent }}
                  >
                    <selected.icon className="h-6 w-6" />
                  </div>
                  <span className="rounded-full px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.16em]" style={{ backgroundColor: selected.accentSoft, color: selected.accent }}>
                    Live preview
                  </span>
                </div>
                <p className="mt-8 text-[10px] font-black uppercase tracking-[0.2em]" style={{ color: selected.accent }}>
                  {selected.label}
                </p>
                <h3 className="mt-2 text-3xl font-black leading-tight tracking-tight text-[#101322] sm:text-4xl">
                  {selected.title}
                </h3>
                <p className="mt-4 text-sm leading-7 text-gray-500">
                  {selected.description}
                </p>

                <div className="mt-6 flex flex-wrap gap-2">
                  {selected.features.map((feature) => (
                    <span
                      key={feature}
                      className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold"
                      style={{ backgroundColor: selected.accentSoft, color: selected.accent }}
                    >
                      <Check className="h-3.5 w-3.5" />
                      {feature}
                    </span>
                  ))}
                </div>

                <a
                  href={NEMPO_INSTAGRAM_DM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-7 inline-flex items-center gap-2 rounded-2xl px-5 py-3 text-sm font-black text-white shadow-lg transition-all hover:-translate-y-0.5"
                  style={{ background: `linear-gradient(135deg,${selected.accent},#101322)` }}
                >
                  Minta demo untuk bisnis saya
                  <ArrowRight className="h-4 w-4" />
                </a>
              </div>

              <div className="min-h-[430px] p-4 sm:p-7 lg:p-8" style={{ backgroundColor: selected.accentSoft }}>
                <PlatformPreview platform={selected} />
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-gray-200 bg-white">
          <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-[.8fr_1.2fr] lg:px-8">
            <div>
              <p className="mb-2 text-[10px] font-black uppercase tracking-[0.22em] text-violet-600">
                Dibuat untuk bergerak
              </p>
              <h2 className="max-w-md text-3xl font-black leading-tight tracking-tight text-[#101322] sm:text-4xl">
                Bukan sekadar tampil bagus.{" "}
                <span className="text-cyan-600">Harus bekerja.</span>
              </h2>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                { icon: Zap, title: "Cepat dipahami", text: "Alur sederhana untuk tim dan pelanggan." },
                { icon: MonitorSmartphone, title: "Siap di semua layar", text: "Nyaman dipakai dari ponsel hingga desktop." },
                { icon: Users, title: "Tumbuh bersama", text: "Bisa dikembangkan saat kebutuhan berubah." },
              ].map(({ icon: Icon, title, text }) => (
                <div key={title} className="rounded-3xl border border-gray-200 bg-[#f8fafc] p-5">
                  <Icon className="h-5 w-5 text-cyan-600" />
                  <h3 className="mt-5 text-sm font-black text-[#101322]">{title}</h3>
                  <p className="mt-2 text-xs leading-6 text-gray-500">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#07152f] px-4 py-12 text-white sm:px-6 sm:py-16 lg:px-8">
          <div className="mx-auto flex max-w-7xl flex-col justify-between gap-6 sm:flex-row sm:items-center">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-cyan-300">
                Punya kebutuhan lain?
              </p>
              <h2 className="mt-2 text-2xl font-black tracking-tight sm:text-3xl">
                Ceritakan idemu, kami bantu bentuk digitalnya.
              </h2>
            </div>
            <a
              href={NEMPO_INSTAGRAM_DM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3.5 text-sm font-black text-[#07152f] transition-all hover:bg-cyan-50"
            >
              Mulai ngobrol
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </section>
      </main>
    </Layout>
  );
}

function HeroCommandCenter() {
  return (
    <div className="relative mx-auto h-[390px] w-full max-w-xl sm:h-[430px]">
      <div className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-300/15 blur-3xl" />
      <div className="absolute left-6 top-10 h-56 w-56 rounded-full border border-cyan-200/10" />
      <div className="absolute bottom-2 right-4 h-40 w-40 rounded-full border border-violet-200/10" />

      <div className="absolute left-0 top-12 z-10 w-56 -rotate-6 rounded-3xl border border-violet-200/20 bg-[#f4efff] p-3 text-slate-900 shadow-2xl shadow-black/20 sm:left-3 sm:w-64">
        <div className="flex items-center justify-between border-b border-violet-200/70 pb-2">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-600 text-white">
              <Ticket className="h-3.5 w-3.5" />
            </div>
            <p className="text-[10px] font-black">Event ticketing</p>
          </div>
          <span className="h-2 w-2 rounded-full bg-emerald-400" />
        </div>
        <div className="mt-3 rounded-2xl bg-white p-3 shadow-sm">
          <p className="text-[9px] font-black uppercase tracking-[0.16em] text-violet-500">Riuh Rona</p>
          <p className="mt-1 text-xs font-black">Tiket event lebih rapi</p>
          <div className="mt-3 flex gap-1.5">
            {["Tiket", "QR", "Tamu"].map((item) => (
              <span key={item} className="rounded-full bg-violet-50 px-2 py-1 text-[8px] font-bold text-violet-600">{item}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="absolute right-0 top-2 z-10 w-52 rotate-6 rounded-3xl border border-cyan-100/40 bg-[#e8fbff] p-3 text-slate-900 shadow-2xl shadow-black/20 sm:right-1 sm:w-60">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-cyan-600 text-white">
              <Globe2 className="h-3.5 w-3.5" />
            </div>
            <p className="text-[10px] font-black">Company website</p>
          </div>
          <Menu className="h-4 w-4 text-cyan-700" />
        </div>
        <div className="relative mt-3 h-24 overflow-hidden rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-900 p-3 text-white">
          <div className="absolute -right-5 -top-8 h-24 w-24 rounded-full border border-white/30" />
          <p className="relative text-[8px] font-bold text-white/70">ARUNA STUDIO</p>
          <p className="relative mt-5 max-w-[8rem] text-sm font-black leading-tight">Make your brand matter.</p>
        </div>
      </div>

      <div className="absolute inset-x-7 top-14 z-20 overflow-hidden rounded-[2rem] border border-white/20 bg-[#0c2344]/90 p-3 shadow-2xl shadow-black/35 backdrop-blur-md sm:inset-x-14 sm:top-16 sm:p-4">
        <div className="flex items-center justify-between border-b border-white/10 px-2 pb-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-cyan-300 text-[#07152f]">
              <LayoutDashboard className="h-4 w-4" />
            </div>
            <div>
              <p className="text-[11px] font-black">Nempo Digital</p>
              <p className="text-[9px] text-white/40">Satu ruang untuk semua alur</p>
            </div>
          </div>
          <Sparkles className="h-4 w-4 text-cyan-200" />
        </div>
        <div className="relative mt-3 overflow-hidden rounded-[1.4rem] bg-gradient-to-br from-[#173968] via-[#103055] to-[#0c2344] p-4 sm:p-5">
          <div className="absolute -right-10 -top-12 h-32 w-32 rounded-full bg-cyan-300/15 blur-2xl" />
          <div className="relative">
            <p className="text-[9px] font-black uppercase tracking-[0.22em] text-cyan-200/75">Digital product studio</p>
            <p className="mt-3 max-w-[15rem] text-2xl font-black leading-[0.95] tracking-tight text-white sm:text-3xl">
              Build something people remember.
            </p>
            <div className="mt-5 flex items-center gap-2">
              <span className="h-1.5 w-16 rounded-full bg-cyan-300" />
              <span className="h-1.5 w-7 rounded-full bg-violet-300" />
              <span className="h-1.5 w-2 rounded-full bg-pink-300" />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 p-1 pt-3 sm:grid-cols-4">
          {[
            { icon: Ticket, label: "Ticketing", color: "#c4b5fd" },
            { icon: Store, label: "F&B POS", color: "#fdba74" },
            { icon: Mail, label: "Invitation", color: "#f9a8d4" },
            { icon: Globe2, label: "Company", color: "#67e8f9" },
          ].map(({ icon: Icon, label, color }) => (
            <div key={label} className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.05] px-2.5 py-2">
              <Icon className="h-3.5 w-3.5" style={{ color }} />
              <span className="text-[8px] font-bold text-white/60">{label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-3 right-1 z-30 flex w-48 items-center gap-3 rounded-2xl border border-pink-100/40 bg-white p-3 text-slate-900 shadow-2xl shadow-black/25 sm:right-4 sm:w-56">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-pink-100 text-pink-600">
          <Mail className="h-4 w-4" />
        </div>
        <div>
          <p className="text-[10px] font-black">Invitation digital</p>
          <p className="mt-1 text-[9px] leading-4 text-gray-400">Buat momen terasa lebih dekat.</p>
        </div>
        <ArrowRight className="ml-auto h-4 w-4 text-pink-500" />
      </div>

      <div className="absolute bottom-0 left-8 z-30 flex items-center gap-2 rounded-full border border-orange-100/30 bg-orange-100 px-3 py-2 text-orange-700 shadow-xl shadow-black/20 sm:left-14">
        <Store className="h-3.5 w-3.5" />
        <span className="text-[9px] font-black">Kasir F&B</span>
      </div>
    </div>
  );
}

function PreviewShell({
  platform,
  children,
}: {
  platform: Platform;
  children: ReactNode;
}) {
  return (
    <div className="mx-auto h-full max-w-2xl overflow-hidden rounded-[1.5rem] border border-gray-200 bg-white shadow-2xl shadow-slate-900/10">
      <div className="flex items-center gap-1.5 border-b border-gray-100 px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-red-300" />
        <span className="h-2.5 w-2.5 rounded-full bg-amber-300" />
        <span className="h-2.5 w-2.5 rounded-full bg-emerald-300" />
        <div className="ml-3 flex-1 rounded-lg bg-gray-50 px-3 py-1.5 text-[9px] text-gray-400">
          demo.nempo.id/{platform.id}
        </div>
      </div>
      {children}
    </div>
  );
}

function PlatformPreview({ platform }: { platform: Platform }) {
  switch (platform.id) {
    case "ticketing":
      return <TicketingPreview platform={platform} />;
    case "kasir":
      return <KasirPreview platform={platform} />;
    case "invitation":
      return <InvitationPreview platform={platform} />;
    case "company":
      return <CompanyPreview platform={platform} />;
  }
}

function TicketingPreview({ platform }: { platform: Platform }) {
  return (
    <PreviewShell platform={platform}>
      <div className="bg-[#faf9ff] p-5 sm:p-7">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-violet-500">Dashboard event</p>
            <h4 className="mt-1 text-xl font-black text-slate-900">Riuh Rona</h4>
            <p className="mt-1 text-[10px] text-gray-400">Sabtu · Garut</p>
          </div>
          <button type="button" className="rounded-xl bg-violet-600 p-2.5 text-white">
            <Ticket className="h-4 w-4" />
          </button>
        </div>
        <div className="mt-5 grid grid-cols-3 gap-2">
          {["Atur tiket", "Pantau check-in", "Kelola tamu"].map((item) => (
            <div key={item} className="rounded-2xl border border-violet-100 bg-white p-3">
              <Check className="h-4 w-4 text-violet-600" />
              <p className="mt-3 text-[9px] font-bold leading-4 text-gray-500">{item}</p>
            </div>
          ))}
        </div>
        <div className="mt-3 rounded-2xl border border-violet-100 bg-white p-4">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-black text-slate-800">Alur event</p>
            <span className="text-[9px] font-bold text-emerald-600">Terhubung</span>
          </div>
          <div className="mt-4 space-y-2.5">
            {["Tiket online", "Check-in QR", "Laporan event"].map((item) => (
              <div key={item} className="flex items-center justify-between rounded-xl bg-violet-50 px-3 py-2.5">
                <span className="text-[9px] font-bold text-slate-700">{item}</span>
                <Check className="h-3.5 w-3.5 text-violet-600" />
              </div>
            ))}
          </div>
        </div>
        <div className="mt-3 flex items-center justify-between rounded-2xl bg-violet-600 px-4 py-3 text-white">
          <div className="flex items-center gap-2">
            <QrCode className="h-4 w-4" />
            <span className="text-[10px] font-bold">Scan untuk check-in</span>
          </div>
          <ArrowRight className="h-4 w-4" />
        </div>
      </div>
    </PreviewShell>
  );
}

function KasirPreview({ platform }: { platform: Platform }) {
  return (
    <PreviewShell platform={platform}>
      <div className="bg-[#fffaf5] p-5 sm:p-7">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
              <Store className="h-4 w-4" />
            </div>
            <div>
              <p className="text-[11px] font-black text-slate-900">Kopi Nempo</p>
              <p className="text-[9px] text-gray-400">Kasir utama · Shift pagi</p>
            </div>
          </div>
          <Menu className="h-5 w-5 text-gray-400" />
        </div>
        <div className="mt-5 grid grid-cols-[1.15fr_.85fr] gap-3">
          <div className="rounded-2xl border border-orange-100 bg-white p-3">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-black text-slate-800">Menu favorit</p>
              <span className="text-[9px] font-bold text-orange-600">Lihat semua</span>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {[
                { name: "Kopi Susu", icon: "☕" },
                { name: "Croissant", icon: "🥐" },
                { name: "Nasi Ayam", icon: "🍱" },
                { name: "Matcha", icon: "🍵" },
              ].map((item) => (
                <div key={item.name} className="rounded-xl bg-orange-50/70 p-2.5">
                  <span className="text-lg">{item.icon}</span>
                  <p className="mt-1 text-[9px] font-black text-slate-800">{item.name}</p>
                  <p className="mt-0.5 text-[9px] text-orange-600">Tambah ke order</p>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-2xl bg-slate-900 p-4 text-white">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-black">Pesanan aktif</p>
              <ShoppingBag className="h-4 w-4 text-orange-300" />
            </div>
            <div className="mt-5 space-y-3 text-[9px]">
              <div className="flex items-center justify-between text-white/65"><span>Kopi Susu</span><Check className="h-3.5 w-3.5 text-orange-300" /></div>
              <div className="flex items-center justify-between text-white/65"><span>Croissant</span><Check className="h-3.5 w-3.5 text-orange-300" /></div>
              <div className="border-t border-white/10 pt-3 text-xs font-black"><div className="flex justify-between"><span>Status order</span><span className="text-orange-300">Siap dibayar</span></div></div>
            </div>
            <button type="button" className="mt-5 w-full rounded-xl bg-orange-500 py-2.5 text-[10px] font-black text-white">
              Bayar sekarang
            </button>
          </div>
        </div>
        <div className="mt-3 flex items-center justify-between rounded-2xl border border-orange-100 bg-white px-4 py-3">
          <div className="flex items-center gap-2">
            <ReceiptText className="h-4 w-4 text-orange-500" />
            <span className="text-[10px] font-bold text-slate-700">Operasional toko</span>
          </div>
          <span className="text-[10px] font-black text-orange-600">Terkelola</span>
        </div>
      </div>
    </PreviewShell>
  );
}

function InvitationPreview({ platform }: { platform: Platform }) {
  return (
    <PreviewShell platform={platform}>
      <div className="relative overflow-hidden bg-[#fff9fb] p-5 sm:p-7">
        <div className="absolute -right-16 -top-16 h-44 w-44 rounded-full bg-pink-200/50 blur-2xl" />
        <div className="absolute -bottom-20 -left-10 h-48 w-48 rounded-full bg-rose-100 blur-2xl" />
        <div className="relative rounded-[1.25rem] border border-pink-100 bg-white px-5 py-7 text-center shadow-sm sm:px-10">
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-pink-50 text-pink-500">
            <HeartIcon />
          </div>
          <p className="mt-5 text-[9px] font-black uppercase tracking-[0.25em] text-pink-400">The wedding of</p>
          <h4 className="mt-3 font-serif text-3xl font-semibold text-slate-800">Alya & Reza</h4>
          <div className="mx-auto my-4 h-px w-16 bg-pink-200" />
          <p className="text-[10px] leading-5 text-gray-500">Hari bahagia Alya & Reza<br />The Papandayan · Garut</p>
          <div className="mx-auto mt-6 grid max-w-xs grid-cols-3 gap-2">
            {["RSVP online", "Galeri momen", "Ucapan tamu"].map((item) => (
              <div key={item} className="rounded-xl bg-pink-50/70 px-2 py-2.5">
                <Check className="mx-auto h-3.5 w-3.5 text-pink-500" />
                <p className="mt-1.5 text-[8px] font-bold leading-3 text-pink-400">{item}</p>
              </div>
            ))}
          </div>
          <button type="button" className="mt-6 rounded-full bg-pink-500 px-5 py-2.5 text-[10px] font-black text-white shadow-lg shadow-pink-500/20">
            Buka undangan
          </button>
        </div>
      </div>
    </PreviewShell>
  );
}

function CompanyPreview({ platform }: { platform: Platform }) {
  return (
    <PreviewShell platform={platform}>
      <div className="bg-[#f7fcfd] p-5 sm:p-7">
        <div className="flex items-center justify-between border-b border-cyan-100 pb-4">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-cyan-600 text-white">
              <Globe2 className="h-4 w-4" />
            </div>
            <span className="text-xs font-black text-slate-800">ARUNA STUDIO</span>
          </div>
          <div className="hidden items-center gap-4 text-[9px] font-bold text-gray-500 sm:flex">
            <span>About</span><span>Services</span><span>Work</span><span>Contact</span>
          </div>
          <Menu className="h-4 w-4 text-gray-500 sm:hidden" />
        </div>
        <div className="grid items-center gap-5 py-7 sm:grid-cols-[1.1fr_.9fr]">
          <div>
            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-cyan-600">Creative digital partner</p>
            <h4 className="mt-2 text-2xl font-black leading-tight tracking-tight text-slate-900">
              Make your brand
              <span className="text-cyan-600"> matter.</span>
            </h4>
            <p className="mt-3 max-w-xs text-[10px] leading-5 text-gray-500">
              Strategi, desain, dan teknologi untuk bisnis yang ingin bergerak lebih jauh.
            </p>
            <button type="button" className="mt-5 inline-flex items-center gap-1.5 rounded-xl bg-cyan-600 px-3.5 py-2.5 text-[9px] font-black text-white">
              Lihat portofolio <ArrowRight className="h-3 w-3" />
            </button>
          </div>
          <div className="relative h-36 overflow-hidden rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-900 p-4">
            <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full border border-white/30" />
            <div className="absolute bottom-3 right-4 h-14 w-14 rounded-full bg-cyan-200/40 blur-xl" />
            <p className="relative text-[9px] font-bold text-white/70">Selected work</p>
            <div className="relative mt-10 flex items-end justify-between">
              <p className="text-3xl font-black tracking-tighter text-white">ARUNA</p>
              <Palette className="h-7 w-7 text-cyan-200" />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2 border-t border-cyan-100 pt-4">
          {["Brand strategy", "Web development", "Digital campaign"].map((item) => (
            <div key={item} className="rounded-xl bg-white p-2.5">
              <Check className="h-3.5 w-3.5 text-cyan-600" />
              <p className="mt-2 text-[9px] font-bold leading-4 text-slate-700">{item}</p>
            </div>
          ))}
        </div>
      </div>
    </PreviewShell>
  );
}

function HeartIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" stroke="currentColor" strokeWidth="1.5">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78Z" />
    </svg>
  );
}