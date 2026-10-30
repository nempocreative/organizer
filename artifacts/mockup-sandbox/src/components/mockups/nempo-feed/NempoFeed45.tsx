import { ArrowUpRight, MapPin } from "lucide-react";

export function NempoFeed45() {
  return (
    <main
      className="relative h-screen w-full overflow-hidden bg-[#dcecf1] text-[#062f4d]"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      <img
        src="/__mockup/images/nempo-garut-feed-hero.jpg"
        alt="Perkebunan teh berkabut di Garut"
        className="absolute inset-0 h-full w-full object-cover"
      />

      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(1,42,67,0.72)_0%,rgba(1,42,67,0.08)_39%,rgba(3,27,43,0.12)_57%,rgba(1,24,40,0.9)_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_30%,rgba(255,226,155,0.28),transparent_28%)]" />

      <div className="relative flex h-full flex-col justify-between p-[7.5%]">
        <header className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-[14px] bg-white/95 p-1.5 shadow-[0_8px_18px_rgba(0,0,0,0.2)]">
              <img
                src="/__mockup/images/nempo-new.webp"
                alt="Logo N resmi Nempo"
                className="h-full w-full object-contain"
              />
            </div>
            <div className="border-l border-white/30 pl-3 leading-none text-white">
              <p className="text-[12px] font-extrabold tracking-[0.1em]">NEMPO.ID</p>
              <p className="mt-1 text-[9px] font-medium uppercase tracking-[0.24em] text-white/70">
                Explore Jawa Barat
              </p>
            </div>
          </div>
          <div className="rounded-full border border-white/35 bg-white/10 px-3 py-2 text-[9px] font-bold uppercase tracking-[0.2em] text-white backdrop-blur-md">
            Garut / 01
          </div>
        </header>

        <section className="max-w-[88%] pb-[2%]">
          <div className="mb-5 flex items-center gap-3 text-[#f9c74f]">
            <span className="h-px w-10 bg-[#f9c74f]" />
            <p className="text-[10px] font-bold uppercase tracking-[0.27em]">
              Tempat untuk pulang
            </p>
          </div>
          <h1
            className="max-w-[94%] text-[clamp(34px,7.9vw,62px)] font-bold leading-[0.98] tracking-[-0.065em] text-white"
            style={{ fontFamily: "'Bricolage Grotesque', 'DM Sans', sans-serif" }}
          >
            Kabut, kebun teh,
            <br />
            <span className="text-[#f9c74f]">dan tenang</span> yang
            <br />
            nggak dibuat-buat.
          </h1>
        </section>

        <footer className="flex items-end justify-between gap-4">
          <div className="max-w-[72%]">
            <div className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-[#0b5880]">
              <MapPin size={11} strokeWidth={2.7} />
              <span className="text-[9px] font-extrabold uppercase tracking-[0.18em]">
                Sukawening, Garut
              </span>
            </div>
            <p className="text-[12px] font-medium leading-[1.45] text-white/85">
              Kalau akhir pekanmu butuh jeda, mulai dari sini.
            </p>
          </div>
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/35 bg-[#0194f3] text-white shadow-[0_10px_22px_rgba(1,148,243,0.28)]">
            <ArrowUpRight size={18} strokeWidth={2.2} />
          </div>
        </footer>
      </div>

      <div className="pointer-events-none absolute bottom-[5.7%] left-[7.5%] h-px w-[35%] bg-white/35" />
      <div className="pointer-events-none absolute right-[7.5%] top-[15%] h-16 w-16 rounded-full border border-white/20" />
      <div className="pointer-events-none absolute right-[10.8%] top-[17.8%] h-1.5 w-1.5 rounded-full bg-[#f9c74f]" />
    </main>
  );
}