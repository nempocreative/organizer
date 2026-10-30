import type { ReactNode } from "react";
import { Instagram, MessageCircle, Music2 } from "lucide-react";

export function FeedStage({ children }: { children: ReactNode }) {
  return (
    <main
      className="relative mx-auto flex aspect-[4/5] w-full max-w-[620px] flex-col overflow-hidden bg-[#0194f3] text-[#062f4d] shadow-[0_24px_80px_rgba(0,0,0,0.34)]"
      style={{ fontFamily: "'DM Sans', 'Inter', sans-serif" }}
    >
      <img
        src="/__mockup/images/nempo-feed-slide7/nempo-karir-hero.jpg"
        alt=""
        className="pointer-events-none absolute inset-0 z-0 h-full w-full object-cover"
      />
      <div className="pointer-events-none absolute inset-0 z-[1] bg-[linear-gradient(90deg,rgba(4,39,67,0.82)_0%,rgba(4,39,67,0.55)_48%,rgba(4,39,67,0.08)_100%),linear-gradient(180deg,rgba(4,39,67,0.22)_0%,rgba(4,39,67,0.02)_35%,rgba(4,39,67,0.68)_100%)]" />
      <div
        className="pointer-events-none absolute inset-0 z-[1] opacity-35 mix-blend-soft-light"
        aria-hidden="true"
        style={{
          backgroundImage:
            "radial-gradient(circle at 16% 24%, rgba(255,255,255,0.72) 0 0.7px, transparent 0.9px), radial-gradient(circle at 72% 68%, rgba(0,45,90,0.7) 0 0.8px, transparent 1px), repeating-linear-gradient(118deg, rgba(255,255,255,0.14) 0 1px, transparent 1px 7px)",
          backgroundSize: "11px 13px, 17px 19px, auto",
        }}
      />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-[30%] overflow-hidden opacity-[0.82]">
        <img
          src="/__mockup/images/nempo-feed-slide7/nempo-footer-user-transparent.png"
          alt=""
          className="absolute bottom-0 left-0 h-auto w-full max-w-none"
          style={{
            filter: "saturate(0.82) brightness(0.94)",
            WebkitMaskImage:
              "linear-gradient(to bottom, transparent 0%, black 24%, black 100%)",
            maskImage:
              "linear-gradient(to bottom, transparent 0%, black 24%, black 100%)",
          }}
        />
      </div>

      <div className="relative z-10 flex h-full min-h-0 flex-col p-[7.5%]">
        <header className="flex shrink-0 items-start justify-between">
          <div className="flex min-w-0 items-center gap-2 sm:gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-[10px] bg-white/95 p-1 shadow-[0_8px_18px_rgba(0,0,0,0.2)] sm:h-11 sm:w-11 sm:rounded-[14px] sm:p-1.5">
              <img
                src="/__mockup/images/nempo-new.webp"
                alt="Logo N resmi Nempo"
                className="h-full w-full object-contain"
              />
            </div>
            <div className="border-l border-white/30 pl-2 leading-none text-white sm:pl-3">
              <p className="text-[9px] font-extrabold tracking-[0.1em] sm:text-[12px]">
                NEMPO.ID
              </p>
              <p
                className="mt-1 text-[7px] font-medium tracking-[0.12em] sm:text-[9px]"
                style={{ fontFamily: "'Nunito', 'DM Sans', sans-serif" }}
              >
                <span className="italic">Explore</span> Jawa Barat
              </p>
            </div>
            <span
              role="note"
              aria-label="Kode template CV: Pemula-05"
              className="ml-0.5 flex h-6 w-[48px] shrink-0 flex-col items-center justify-center bg-[#ed1c24] pb-1 text-white shadow-[0_3px_8px_rgba(0,0,0,0.35)] sm:ml-1 sm:h-7 sm:w-[62px]"
              style={{
                clipPath: "polygon(0 0, 100% 0, 100% 100%, 50% 82%, 0 100%)",
              }}
            >
              <span className="text-[3px] font-bold uppercase tracking-[0.16em] text-white/75 sm:text-[4px]">
                KODE CV
              </span>
              <span className="text-[4px] font-black tracking-[0.04em] sm:text-[4.8px]">
                PEMULA-05
              </span>
            </span>
          </div>
          <span className="ml-2 shrink-0 rounded-full border border-white/25 bg-[#062f4d]/25 px-2 py-1 text-[6px] font-black tracking-[0.02em] text-white sm:px-3 sm:py-1.5 sm:text-[11px]">
            NEMPO KARIR
          </span>
        </header>

        <section className="relative z-10 flex min-h-0 flex-1 flex-col items-center justify-center px-[3%] pb-[7%] pt-[2%]">
          {children}
        </section>

        <footer className="pointer-events-none absolute bottom-[5%] right-[7.5%] z-20 flex items-center gap-2 rounded-full bg-[#062f4d]/75 px-2 py-1 text-white sm:gap-2.5 sm:px-3 sm:py-1.5">
          <MessageCircle className="h-2.5 w-2.5 text-[#25D366] sm:h-3.5 sm:w-3.5" aria-hidden="true" />
          <span className="text-[6px] font-bold leading-none sm:text-[9px]">
            0857 2498 1356
          </span>
          <Instagram className="h-2.5 w-2.5 sm:h-3.5 sm:w-3.5" aria-hidden="true" />
          <Music2 className="h-2.5 w-2.5 sm:h-3.5 sm:w-3.5" aria-hidden="true" />
          <span className="text-[7px] font-bold tracking-[0.04em] text-[#ffdd00] sm:text-[11px]">
            @nempo.id
          </span>
        </footer>
      </div>
    </main>
  );
}
