import {
  ArrowRight,
  ChevronRight,
  Compass,
  MapPin,
  Mountain,
  Users,
} from "lucide-react";
import "./_group.css";

function DemoLink({
  children,
  className,
}: {
  children: React.ReactNode;
  className: string;
}) {
  return (
    <a href="#" onClick={(event) => event.preventDefault()} className={className}>
      {children}
    </a>
  );
}

export function Current() {
  return (
    <div className="min-h-screen bg-[#f3f7fa] p-3 md:p-5">
      <section
        id="tentang-nempo"
        className="relative isolate overflow-hidden rounded-[2rem] bg-[#062c49] text-white shadow-xl shadow-sky-100"
      >
        <div className="pointer-events-none absolute -right-24 -top-32 h-80 w-80 rounded-full bg-[#0194f3]/30 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 left-1/3 h-72 w-72 rounded-full bg-emerald-400/10 blur-3xl" />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.7) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.7) 1px, transparent 1px)",
            backgroundSize: "34px 34px",
          }}
        />

        <div className="relative grid gap-8 p-5 md:grid-cols-[1.08fr_0.92fr] md:items-center md:p-10">
          <div>
            <div className="mb-5 flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/15">
                <MapPin className="h-3.5 w-3.5 text-sky-300" />
              </span>
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-sky-300">
                Tentang Nempo.id
              </p>
            </div>
            <h2 className="max-w-xl text-3xl font-black leading-[1.05] tracking-[-0.04em] md:text-5xl">
              Setiap sudut punya cerita.
              <span className="mt-1 block text-sky-300">
                Kami bantu membuatnya terdengar.
              </span>
            </h2>
            <p className="mt-5 max-w-lg text-sm leading-relaxed text-white/65 md:text-base">
              Nempo.id adalah tim kreatif yang mengemas keindahan Jawa Barat
              menjadi pengalaman, karya, dan kolaborasi yang dekat dengan
              masyarakat—dari talenta lokal hingga event yang mempertemukan
              banyak cerita.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {["Wisata", "Budaya", "Talenta", "Event"].map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-white/15 bg-white/[0.07] px-3 py-1.5 text-[10px] font-bold text-white/75"
                >
                  {item}
                </span>
              ))}
            </div>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <DemoLink
                className="inline-flex items-center gap-1.5 rounded-xl bg-white px-4 py-2.5 text-xs font-black text-[#062c49] shadow-lg shadow-black/10 transition hover:bg-sky-50"
              >
                Jelajahi Cerita Lokal <ChevronRight className="h-3.5 w-3.5" />
              </DemoLink>
              <DemoLink className="inline-flex items-center gap-1.5 rounded-xl px-3 py-2.5 text-xs font-bold text-white/75 transition hover:text-white">
                Ajak Kami Berkolaborasi <ArrowRight className="h-3.5 w-3.5" />
              </DemoLink>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[390px]">
            <div className="relative aspect-[1.08/1] rotate-2 overflow-hidden rounded-[1.75rem] border border-white/15 bg-gradient-to-br from-[#0d6fa5] via-[#0194f3] to-[#0a4168] p-4 shadow-2xl shadow-black/25">
              <div className="absolute -right-10 -top-10 h-36 w-36 rounded-full border-[18px] border-white/10" />
              <div className="absolute -bottom-16 -left-12 h-48 w-48 rounded-full border-[26px] border-emerald-300/10" />
              <div className="relative flex h-full flex-col justify-between">
                <div className="flex items-start justify-between">
                  <span className="rounded-full bg-white/15 px-3 py-1 text-[9px] font-black uppercase tracking-[0.18em] text-white/80">
                    Field notes / 01
                  </span>
                  <Compass className="h-5 w-5 text-white/60" />
                </div>
                <div className="px-1">
                  <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-sky-100/70">
                    Jawa Barat
                  </p>
                  <p className="mt-1 text-4xl font-black leading-none tracking-[-0.06em] text-white md:text-5xl">
                    Rasa yang
                    <br />
                    tak terlupa.
                  </p>
                </div>
                <div className="flex items-end justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/15">
                      <Mountain className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-[10px] font-bold leading-tight text-white/70">
                      Alam
                      <br />& manusia
                    </span>
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-[0.16em] text-white/50">
                    nempo.id
                  </span>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-3 -left-2 flex items-center gap-2 rounded-2xl border border-white/10 bg-[#0a4168]/95 px-3 py-2 shadow-xl backdrop-blur-md md:-left-5">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-400/20">
                <Users className="h-3.5 w-3.5 text-emerald-300" />
              </div>
              <div>
                <p className="text-[9px] font-bold uppercase tracking-wider text-white/45">
                  Digerakkan oleh
                </p>
                <p className="text-[11px] font-extrabold text-white">
                  Karya & kolaborasi
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}