import { Instagram, MessageCircle } from 'lucide-react';

export function CurrentFooter() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-[#f8edf1]">
      <main
        aria-label="GGS Beauty — footer saat ini"
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
          className="absolute left-[66%] top-[8.5%] z-10 w-[20%] -translate-x-1/2 object-contain"
        />
        <footer className="absolute inset-x-[7%] bottom-[4%] z-10 flex items-center justify-between border-t border-[#71274c]/30 pt-[2.4%] text-[#561535]">
          <span className="inline-flex items-center gap-2 whitespace-nowrap text-[clamp(10px,1.15vw,13px)] font-bold">
            <Instagram className="h-[1.2em] w-[1.2em] text-[#a42d67]" />
            @ggsbeauty.hair.co
          </span>
          <span className="inline-flex items-center gap-2 whitespace-nowrap text-[clamp(10px,1.15vw,13px)] font-bold">
            <MessageCircle className="h-[1.2em] w-[1.2em] text-[#25D366]" />
            0813 3335 9200
          </span>
        </footer>
      </main>
    </div>
  );
}
