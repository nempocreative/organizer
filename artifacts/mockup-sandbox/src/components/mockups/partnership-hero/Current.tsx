import {
  Award,
  Calendar,
  Eye,
  MapPin,
  Users,
  Zap,
} from "lucide-react";
import "./_group.css";

const STATS = [
  { icon: Users, val: "47K+", label: "Pengguna Aktif" },
  { icon: Calendar, val: "120+", label: "Event per Tahun" },
  { icon: Eye, val: "2.3M", label: "Tayangan/Bulan" },
  { icon: MapPin, val: "38", label: "Kecamatan Covered" },
];

export function Current() {
  return (
    <main className="min-h-screen bg-[#f5f8fc] p-3 md:p-6">
      <section className="relative isolate overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#001e6e] via-[#0046b8] to-[#0194f3] p-6 text-white shadow-xl md:p-10">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "radial-gradient(circle at 70% 30%, #FFC300 0%, transparent 60%)",
          }}
        />
        <div className="absolute -mr-20 -mt-20 right-0 top-0 h-64 w-64 rounded-full bg-white/5" />

        <div className="relative z-10">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#FFC300] px-3 py-1.5 text-[11px] font-black uppercase tracking-wider text-[#001e6e]">
            <Zap className="h-3 w-3" /> Media Kit 2025
          </div>
          <h1 className="mb-2 text-3xl font-black leading-tight md:text-4xl">
            Jadikan Brand Anda
            <br />
            <span className="text-[#FFC300]">Bagian dari Garut</span>
          </h1>
          <p className="mb-6 max-w-lg text-sm leading-relaxed text-white/75 md:text-base">
            Sponsori event-event unggulan Nempo.id dan jangkau puluhan ribu
            warga serta wisatawan aktif secara langsung dan digital.
          </p>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {STATS.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-white/10 bg-white/10 p-3 text-center backdrop-blur-sm"
              >
                <div className="mx-auto mb-2 flex h-8 w-8 items-center justify-center rounded-xl border border-[#FFC300]/30 bg-[#FFC300]/20">
                  <stat.icon className="h-4 w-4 text-[#FFC300]" />
                </div>
                <p className="text-xl font-black leading-none">{stat.val}</p>
                <p className="mt-0.5 text-[9px] leading-tight text-white/55">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}