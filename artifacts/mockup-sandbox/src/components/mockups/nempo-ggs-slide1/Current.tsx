export function Current() {
  return (
    <main
      aria-label="Kondisi slide GGS 1 saat ini"
      className="relative h-screen w-full overflow-hidden text-[#fff8e9]"
      style={{
        background: 'linear-gradient(145deg, #213b32 0%, #354f3e 52%, #8d6846 100%)',
        fontFamily: "'DM Sans', 'Inter', sans-serif",
      }}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-[16%] top-[13%] aspect-square w-[72%] rounded-full border border-white/20"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-[4%] top-[25%] aspect-square w-[44%] rounded-full opacity-80"
        style={{ background: 'radial-gradient(circle, #e7bf77 0%, transparent 70%)' }}
      />
      <div className="relative flex h-full flex-col justify-between p-[9%]">
        <header className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[clamp(10px,1.2vw,15px)] font-black uppercase tracking-[0.2em]">
              Kopi Kawan
            </p>
            <p className="mt-1 text-[clamp(7px,0.8vw,10px)] font-semibold uppercase tracking-[0.18em] text-white/70">
              GGS CONCEPT
            </p>
          </div>
          <span className="rounded-full border border-white/30 px-3 py-1.5 text-[clamp(7px,0.8vw,10px)] font-bold uppercase tracking-[0.12em]">
            COFFEE · DAILY RITUAL
          </span>
        </header>
        <section className="relative z-10 max-w-[88%]">
          <p className="mb-4 text-[clamp(8px,1vw,12px)] font-bold uppercase tracking-[0.22em] text-[#e7bf77]">
            Small brand, big story
          </p>
          <h1 className="whitespace-pre-line text-5xl font-black leading-[0.94] tracking-[-0.06em] sm:text-6xl lg:text-7xl">
            Pelan-pelan,
            <br />
            hari jadi lebih baik.
          </h1>
          <p className="mt-5 max-w-[26rem] text-sm leading-relaxed text-white/70 sm:text-base">
            Temukan jeda kecil di antara rutinitasmu.
          </p>
          <span className="mt-7 inline-flex rounded-full bg-[#e7bf77] px-5 py-3 text-xs font-black text-[#2b3024] sm:text-sm">
            Mampir hari ini
          </span>
        </section>
        <footer className="flex items-end justify-between border-t border-white/25 pt-4 text-[clamp(8px,0.9vw,11px)] font-semibold uppercase tracking-[0.14em] text-white/70">
          <span>Creative feed sample</span>
          <span>01 / 04</span>
        </footer>
      </div>
    </main>
  );
}
