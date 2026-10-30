export function GgsSlide1() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-[#f8edf1]">
      <main
        aria-label="GGS Beauty — Grooming is better"
        className="relative mx-auto aspect-[4/5] h-auto w-[min(100%,80vh)] overflow-hidden text-white"
        style={{
          background:
            'radial-gradient(ellipse at 50% 44%, rgba(225,37,105,0.32) 0%, rgba(225,37,105,0.14) 24%, transparent 55%), radial-gradient(ellipse at 50% 100%, rgba(197,139,51,0.16) 0%, transparent 32%), linear-gradient(150deg, #1b1016 0%, #09080b 52%, #170d13 100%)',
          fontFamily: "'DM Sans', 'Inter', sans-serif",
        }}
      >
        <div aria-hidden="true" className="pointer-events-none absolute inset-[4.5%] rounded-[22px] border border-[#d8b466]/55" />

        <div className="relative flex h-full flex-col items-center justify-between px-[10%] py-[9%]">
        <header className="flex w-full items-center justify-between">
          <p className="text-[clamp(7px,0.8vw,10px)] font-semibold uppercase tracking-[0.24em] text-[#e7a0b9]">Grooming studio</p>
          <span className="text-[clamp(7px,0.8vw,10px)] font-bold tracking-[0.18em] text-[#f1d79b]">01 / 04</span>
        </header>

        <div className="relative mx-auto flex aspect-square w-[60%] items-center justify-center">
          <div className="relative aspect-square w-full">
            <img src="/__mockup/images/ggs-beauty-logo.png" alt="Logo GGS Beauty — Grooming is Better" className="h-full w-full object-contain drop-shadow-[0_8px_24px_rgba(0,0,0,0.28)]" />
          </div>
        </div>

        <footer className="mx-auto w-full max-w-full pb-[2%] text-center">
          <span className="mx-auto mb-[4%] block h-px w-[24%] bg-[#d8b466]/80" />
          <p className="text-[clamp(7px,0.85vw,10px)] font-bold uppercase tracking-[0.24em] text-[#e7a0b9]">Your style · your crown</p>
          <h1 className="mt-[3%] whitespace-nowrap text-[clamp(16px,4.8vw,52px)] font-semibold leading-[1.02] tracking-[-0.04em] text-[#fff8f6]" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
            Tampil percaya diri.
          </h1>
        </footer>
        </div>
      </main>
    </div>
  );
}
