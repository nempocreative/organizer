import "./_group.css";

const background =
  "/__mockup/images/nempo-feed-slide27/sangkuriang-background-27.png";
const illustration =
  "/__mockup/images/nempo-feed-slide27/sangkuriang-cutout-24.webp";

export function Refined() {
  return (
    <article
      className="nempo-slide27-preview relative mx-auto aspect-[4/5] w-full max-w-[540px] overflow-hidden text-[#fff4e5]"
      style={{
        backgroundImage:
          `linear-gradient(180deg,rgba(28,17,16,.5),rgba(28,17,16,.3) 42%,rgba(28,17,16,.5)),linear-gradient(90deg,rgba(28,17,16,.18),transparent 55%),url("${background}")`,
        backgroundPosition: "center",
        backgroundSize: "cover",
      }}
    >
      <header className="absolute left-[7.5%] right-[7.5%] top-[5.2%] z-20 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 overflow-hidden rounded-[14px] bg-white/95 p-1.5 shadow-[0_6px_18px_rgba(12,10,8,.24)]">
            <img
              src="/__mockup/images/nempo-feed-slide27/nempo-new.webp"
              alt="Logo Nempo"
              className="h-full w-full object-contain"
            />
          </div>
          <div className="border-l border-white/35 pl-3 leading-none">
            <p className="text-[12px] font-extrabold tracking-[0.1em]">
              NEMPO.ID
            </p>
            <p className="mt-1 text-[9px] tracking-[0.12em]">× Kala Muda</p>
          </div>
        </div>
        <span className="rounded-full border border-white/35 bg-[#271d19]/40 px-3 py-1.5 text-[11px] font-black tracking-[0.02em] backdrop-blur-sm">
          LEGENDA SUNDA
        </span>
      </header>

      <section
        aria-label="Kisah Perahu yang Terbalik"
        className="absolute inset-x-[1%] bottom-[10%] top-[16%] overflow-hidden text-left"
      >
        <div className="absolute inset-x-[5%] top-[2%] z-10 text-center">
          <h1
            className="mx-auto mt-[1.5%] max-w-[92%] text-[clamp(17px,4.7vw,23px)] font-black leading-[1.02] tracking-[-0.035em] text-[#fff7e8]"
            style={{ fontFamily: "'Bowlby One SC', 'DM Sans', sans-serif" }}
          >
            PERAHU YANG TERBALIK
          </h1>
          <p className="mx-auto mt-[2.2%] max-w-[90%] text-justify text-[clamp(9px,2.35vw,11px)] font-semibold leading-[1.5] text-[#fff4e5]">
            Sangkuriang murka dan menendang perahu besar hingga terbalik. Dalam
            legenda, perahu itu berubah menjadi Gunung Tangkuban Parahu. Nama
            Tangkuban Parahu berarti “perahu yang terbalik”—kisah ini
            mengabadikan kegagalan Sangkuriang dan kecerdikan Dayang Sumbi.
          </p>
        </div>

        <p className="absolute left-[6%] top-[29%] z-10 w-[84%] text-center text-[7px] font-extrabold leading-tight text-[#fff2dd] [text-shadow:0_1px_4px_rgba(37,20,27,.9)] sm:text-[8px]">
          Tangkuban Parahu berarti “perahu yang terbalik”.
        </p>

        <img
          src={illustration}
          alt="Sangkuriang, Gunung Tangkuban Parahu, dan perahu yang terbalik"
          className="pointer-events-none absolute bottom-[6.5%] right-[1%] z-[1] h-[56%] w-[62%] max-w-[355px] object-contain object-bottom"
          draggable={false}
        />

        <div className="absolute left-[6%] top-[39%] z-10 flex w-[40%] flex-col gap-4">
          <div className="flex flex-col items-start text-left">
            <span className="text-[6px] font-black tracking-[0.16em] text-[#f3d3a7] sm:text-[7px]">
              SANGKURIANG
            </span>
            <p className="mt-1 text-[clamp(9px,2.25vw,11px)] font-extrabold leading-[1.25] text-white">
              “Aku ditipu! Perahu ini kutendang!”
            </p>
          </div>
          <div className="flex flex-col items-start text-left">
            <span className="text-[6px] font-black tracking-[0.16em] text-[#f3d3a7] sm:text-[7px]">
              DAYANG SUMBI
            </span>
            <p className="mt-1 text-[clamp(9px,2.25vw,11px)] font-extrabold leading-[1.25] text-white">
              “Perahu itu akan menjadi tanda kisah kita.”
            </p>
          </div>
        </div>

        <div className="absolute bottom-[6.5%] left-[7%] right-[7%] z-[3] flex items-end justify-between border-t border-white/25 pt-2 text-white [text-shadow:0_1px_5px_rgba(20,12,10,.8)]">
          <span className="text-[6px] font-black tracking-[0.16em] sm:text-[7px]">
            LEGENDA SUNDA · JAWA BARAT
          </span>
          <span className="text-right text-[6px] font-extrabold tracking-[0.1em] sm:text-[7px]">
            TAMAT
          </span>
        </div>
      </section>

      <div className="absolute bottom-[3.2%] left-1/2 z-20 flex -translate-x-1/2 items-center gap-2 whitespace-nowrap">
        <span className="rounded-full border border-white/30 bg-[#201817]/90 px-2.5 py-1.5 text-[9px] font-bold shadow-[0_4px_14px_rgba(15,10,8,.3)]">
          WhatsApp · 0857 2498 1356
        </span>
        <span className="rounded-full bg-[#201817]/90 px-3 py-1.5 text-[9px] font-bold text-[#ffdd00] shadow-[0_4px_14px_rgba(15,10,8,.3)]">
          @nempo.id
        </span>
      </div>
    </article>
  );
}
