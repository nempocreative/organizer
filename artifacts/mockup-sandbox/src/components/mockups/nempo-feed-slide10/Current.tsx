import { Instagram, MessageCircle, Music2 } from "lucide-react";
import "./_group.css";

const coupleCaricature =
  "/__mockup/images/nempo-slide10-couple-likeness.webp";
const nempoLogo = "/__mockup/images/nempo-new.webp";

function SlideTenLove() {
  const snapshotCrops = [
    { position: "48% 24%", scale: 1.35 },
    { position: "55% 69%", scale: 1.6 },
  ];

  return (
    <article
      aria-label="Kartu pop-up romantis untuk pasangan"
      className="relative w-full max-w-[460px] overflow-visible px-1 py-1 text-white"
    >
      <div
        className="pointer-events-none absolute -right-8 top-[8%] h-32 w-32 rounded-full bg-[#f6a9c0]/10 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-8 -left-10 h-36 w-36 rounded-full bg-[#f6d7d6]/10 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative flex flex-col items-start text-left">
        <div className="flex -rotate-[2deg] items-center gap-2 self-start text-[#f3d7cb]">
          <span className="h-px w-3 bg-[#e7bc91]/75" />
          <span
            className="font-serif text-[12px] italic tracking-normal sm:text-[15px]"
            style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
          >
            Happy anniversary, sayang
          </span>
          <span className="text-[10px] text-[#f3d7a8]">✦</span>
        </div>

        <div
          className="couple-photo-scene relative mt-1 h-[196px] w-full sm:mt-2 sm:h-[258px]"
          style={{ perspective: "900px", transformStyle: "preserve-3d" }}
        >
          <div className="absolute bottom-[9%] left-1/2 h-8 w-[58%] -translate-x-1/2 rounded-[50%] bg-[#d886a0]/20 blur-2xl" />
          <aside
            className="absolute left-[1%] top-[17%] z-20 w-[49px] -rotate-[9deg] border-[3px] border-white bg-[#fffdf8] p-[2px] shadow-[0_8px_18px_rgba(17,5,15,0.32)] sm:left-[4%] sm:w-[58px]"
            aria-label="Potongan foto kenangan"
          >
            <div className="space-y-[2px]">
              {snapshotCrops.map((crop) => (
                <div
                  key={crop.position}
                  className="aspect-[0.82] overflow-hidden bg-[#d4b9ad]"
                >
                  <img
                    src={coupleCaricature}
                    alt=""
                    className="h-full w-full object-cover"
                    style={{
                      objectPosition: crop.position,
                      transform: `scale(${crop.scale})`,
                    }}
                    aria-hidden="true"
                  />
                </div>
              ))}
            </div>
            <p className="pt-1 text-center font-serif text-[5px] italic leading-none text-[#76525a] sm:text-[6px]">
              little moments
            </p>
          </aside>

          <figure
            className="couple-art-pop absolute left-1/2 top-[50%] z-10 w-[158px] sm:w-[205px]"
            style={{ transformStyle: "preserve-3d", backfaceVisibility: "hidden" }}
          >
            <div className="relative border-[5px] border-white bg-[#fffdf8] px-1 pb-2 pt-1 shadow-[0_15px_26px_rgba(17,5,15,0.38)]">
              <img
                src={coupleCaricature}
                alt="Karikatur 3D pasangan muda berpelukan dengan pakaian kasual warna krem dan merah muda"
                className="block aspect-[0.88] w-full object-cover"
                style={{ objectPosition: "center 36%" }}
                loading="eager"
              />
              <figcaption className="flex items-center justify-between px-1 pt-1.5 text-[5px] font-bold uppercase tracking-[0.13em] text-[#75515a] sm:text-[6px]">
                <span>us, still</span>
                <span className="font-serif text-[8px] text-[#b55470]">♥</span>
              </figcaption>
              <span className="absolute -left-2 -top-2 h-5 w-14 -rotate-[9deg] border border-[#e4c49d]/45 bg-[#f4dfbc]/85 shadow-sm" />
            </div>
          </figure>

          <span
            className="absolute left-[77%] top-[15%] z-30 rotate-[12deg] text-[19px] text-[#ffb1c4] drop-shadow-[0_4px_8px_rgba(127,36,67,0.7)] sm:text-[25px]"
            aria-label="Hati"
          >
            ♥
          </span>
          <div className="absolute bottom-[9%] right-[0%] z-30 w-[88px] rotate-[4deg] rounded-[3px_13px_12px_13px] bg-[#fffaf1] px-2 py-2 text-left text-[#503844] shadow-[0_8px_18px_rgba(17,5,15,0.28)] sm:right-[2%] sm:w-[112px] sm:px-2.5 sm:py-2.5">
            <p className="font-serif text-[7px] italic leading-[1.2] sm:text-[9px]">
              Aku masih mau lanjut—sama kamu.
            </p>
          </div>
          <span className="absolute right-[8%] top-[4%] rotate-[12deg] text-[11px] text-[#f3d7a8] sm:text-[14px]">
            ✧
          </span>
          <span className="absolute bottom-[15%] left-[18%] -rotate-[10deg] text-[9px] text-[#f3d7a8]/85">
            ✦
          </span>
        </div>

        <h1
          className="mt-1 w-full text-[24px] font-bold leading-[1.04] tracking-[-0.035em] text-[#fff5ed] sm:mt-2 sm:text-[34px]"
          style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
        >
          Nggak kerasa,
          <br />
          <span className="font-normal italic text-[#f4aabd]">udah sejauh ini.</span>
        </h1>

        <p className="mt-2 max-w-[94%] text-[9px] font-medium leading-[1.5] text-[#f7e8ec]/90 sm:mt-3 sm:text-[11px]">
          Makasih udah nemenin aku sampai sekarang. Mungkin aku nggak selalu
          pintar bilangnya, tapi aku senang banget bisa jalanin banyak hal sama
          kamu. Selamat anniversary, ya.
        </p>

        <div className="mt-3 ml-auto flex items-center gap-2 px-2 py-1 sm:mt-4">
          <span className="font-serif text-[11px] italic text-white/70 sm:text-[12px]">
            Sayang kamu,
          </span>
          <span
            className="font-serif text-[14px] font-bold italic text-[#f4b6c4] sm:text-[16px]"
            style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
          >
            aku.
          </span>
          <span className="text-[9px] text-[#f4b6c4]" aria-hidden="true">
            ♥
          </span>
        </div>
      </div>
    </article>
  );
}

export function Current() {
  return (
    <main
      className="relative mx-auto aspect-[4/5] h-screen max-h-[900px] w-auto max-w-full overflow-hidden bg-[#30172f] text-[#062f4d]"
      style={{
        fontFamily: "'DM Sans', 'Inter', sans-serif",
        background:
          "radial-gradient(ellipse at 18% 16%, rgba(221,139,153,0.26), transparent 34%), radial-gradient(ellipse at 82% 78%, rgba(216,173,124,0.14), transparent 38%), linear-gradient(145deg, #281529 0%, #54243f 52%, #30172f 100%)",
      }}
    >
      <div
        className="pointer-events-none absolute inset-0 z-[1] overflow-hidden"
        aria-hidden="true"
      >
        <div className="absolute -left-[18%] top-[28%] h-[34%] w-[55%] rounded-full border border-[#f4d6c9]/[0.09]" />
        <div className="absolute -left-[11%] top-[32%] h-[24%] w-[40%] rounded-full border border-[#e5bb9b]/[0.12]" />
        <div className="absolute -right-[17%] bottom-[17%] h-[36%] w-[58%] rounded-full border border-[#f4d6c9]/[0.09]" />
        <div className="absolute right-[15%] top-[28%] h-1 w-1 rounded-full bg-[#f2d1a2]/70" />
        <div className="absolute bottom-[27%] left-[13%] h-1 w-1 rounded-full bg-[#f2d1a2]/55" />
        <span className="absolute right-[9%] top-[22%] text-[11px] text-[#f2d1a2]/70">✦</span>
        <span className="absolute bottom-[31%] right-[13%] text-[8px] text-[#f2d1a2]/55">✦</span>
      </div>

      <div className="relative z-10 flex h-full flex-col p-[7.5%]">
        <header className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-[14px] bg-white/95 p-1.5 shadow-[0_8px_18px_rgba(0,0,0,0.2)]">
              <img
                src={nempoLogo}
                alt="Logo Nempo"
                className="h-full w-full object-contain"
              />
            </div>
            <div className="border-l border-white/30 pl-3 leading-none text-white">
              <p className="text-[12px] font-extrabold tracking-[0.1em]">NEMPO.ID</p>
              <p className="mt-1 text-[9px] font-medium tracking-[0.12em]">
                <span className="text-[11px] italic">Explore</span> Jawa Barat
              </p>
            </div>
          </div>
          <span className="whitespace-nowrap rounded-full border border-white/25 bg-[#062f4d]/25 px-2.5 py-1.5 text-[9px] font-black tracking-[0.02em] text-white">
            UNTUK KAMU
          </span>
        </header>

        <section className="relative z-10 flex flex-1 flex-col items-center justify-center px-[3%] pb-[7%] text-center text-white">
          <SlideTenLove />
        </section>
      </div>

      <div className="absolute bottom-[5%] left-1/2 z-20 flex w-max -translate-x-1/2 items-center gap-2.5">
        <a
          href="https://wa.me/6285724981356"
          aria-label="Hubungi Nempo melalui WhatsApp"
          className="inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-[#062f4d]/80 px-2.5 py-1.5 text-white shadow-[0_4px_12px_rgba(0,0,0,0.18)]"
        >
          <MessageCircle className="h-3.5 w-3.5 text-[#25D366]" aria-hidden="true" />
          <span className="text-[9px] font-bold">0857 2498 1356</span>
        </a>
        <div className="pointer-events-none flex items-center gap-2.5 rounded-full bg-[#062f4d]/75 px-3 py-1.5 text-white backdrop-blur-sm">
          <Instagram className="h-3.5 w-3.5" aria-hidden="true" />
          <Music2 className="h-3.5 w-3.5" aria-hidden="true" />
          <span className="text-[11px] font-bold tracking-[0.04em] text-[#ffdd00]">
            @nempo.id
          </span>
        </div>
      </div>
    </main>
  );
}
