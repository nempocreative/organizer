import { Instagram, MapPin, MessageCircle } from 'lucide-react';

export function FooterUpgrade() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-[#f8edf1]">
      <main
        aria-label="GGS Beauty — footer tipografi baru"
        className="relative aspect-[4/5] h-auto w-[min(100%,80vh)] overflow-hidden text-[#472b38]"
        style={{ backgroundColor: '#e995b1', fontFamily: "'DM Sans', sans-serif" }}
      >
        <img
          src="/__mockup/images/ggs-beauty-double-braid-edge-connected-4x5-20261012.png"
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
        <img
          src="/__mockup/images/ggs-beauty-logo.png"
          alt="Logo GGS Beauty — Grooming is Better"
          className="absolute left-[66%] top-[7.5%] z-10 w-[20%] -translate-x-1/2 object-contain"
        />
        <footer
          aria-label="Kontak GGS Beauty"
          className="absolute inset-x-[4%] bottom-[4.2%] z-10 flex items-center gap-[2.5%] text-[#561535]"
        >
          <div className="min-w-0 flex-1">
            <p
              className="whitespace-nowrap text-[clamp(14px,1.8vw,21px)] font-semibold italic leading-none tracking-[-0.035em]"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Grooming is better
            </p>
            <p className="mt-[0.35em] whitespace-nowrap text-[clamp(8px,0.82vw,10px)] font-semibold uppercase tracking-[0.12em] text-[#71274c]">
              Your style · your crown
            </p>
          </div>
          <span aria-hidden="true" className="h-11 w-px shrink-0 bg-[#561535]/40" />
          <div className="flex min-w-0 flex-[1.2] flex-col items-start gap-[0.3em]">
            <a
              href="https://www.instagram.com/ggsbeauty.hair.co/"
              className="inline-flex items-center gap-[0.45em] whitespace-nowrap text-[clamp(10px,0.96vw,12px)] font-semibold tracking-[-0.02em]"
            >
              <Instagram aria-hidden="true" className="h-[1.15em] w-[1.15em] shrink-0 text-[#561535]" />
              @ggsbeauty.hair.co
            </a>
            <a
              href="https://wa.me/6281333359200"
              className="inline-flex items-center gap-[0.45em] whitespace-nowrap text-[clamp(10px,0.96vw,12px)] font-semibold tracking-[-0.02em]"
            >
              <MessageCircle aria-hidden="true" className="h-[1.15em] w-[1.15em] shrink-0 text-[#561535]" />
              0813 3335 9200
            </a>
            <span className="inline-flex items-center gap-[0.45em] whitespace-nowrap text-[clamp(8px,0.82vw,10px)] font-medium leading-tight">
              <MapPin aria-hidden="true" className="h-[1.1em] w-[1.1em] shrink-0 text-[#561535]" />
              Jl. Cimanuk No. 309, Sukagalih, Garut
            </span>
          </div>
          <a
            href="https://wa.me/6281333359200"
            aria-label="Booking Now via WhatsApp"
            className="shrink-0 whitespace-nowrap rounded-full bg-[#561535] px-[0.8em] py-[0.65em] text-[clamp(12px,1.15vw,14px)] font-bold leading-none text-[#fff8f6]"
          >
            Booking Now
          </a>
        </footer>
      </main>
    </div>
  );
}
