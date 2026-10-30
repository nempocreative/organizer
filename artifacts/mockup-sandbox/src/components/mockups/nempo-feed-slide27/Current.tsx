import "./_group.css";

const background =
  "/__mockup/images/nempo-feed-slide27/sangkuriang-background-27.png";
const illustration =
  "/__mockup/images/nempo-feed-slide27/sangkuriang-cutout-24.webp";

export function Current() {
  return (
    <article
      className="nempo-slide27-preview relative mx-auto aspect-[4/5] w-full max-w-[540px] overflow-hidden text-[#fff4e5]"
      style={{
        backgroundImage:
          `linear-gradient(180deg,rgba(32,19,17,.48),rgba(32,19,17,.25) 42%,rgba(32,19,17,.42)),linear-gradient(90deg,rgba(32,19,17,.2),transparent 45%),url("${background}")`,
        backgroundPosition: "center",
        backgroundSize: "cover",
      }}
    >
      <header className="absolute left-[7.5%] right-[7.5%] top-[6%] z-10 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 overflow-hidden rounded-[14px] bg-white/95 p-1.5">
            <img
              src="/__mockup/images/nempo-feed-slide27/nempo-new.webp"
              alt="Logo Nempo"
              className="h-full w-full object-contain"
            />
          </div>
          <div className="border-l border-white/30 pl-3 leading-none">
            <p className="text-[12px] font-extrabold tracking-[0.1em]">
              NEMPO.ID
            </p>
            <p className="mt-1 text-[9px] tracking-[0.12em]">× Kala Muda</p>
          </div>
        </div>
        <span className="rounded-full border border-white/25 bg-[#062f4d]/25 px-3 py-1.5 text-[11px] font-black">
          LEGENDA SUNDA
        </span>
      </header>

      <section className="absolute inset-x-[1%] bottom-[7%] top-[18%] overflow-hidden text-left">
        <div className="absolute inset-x-[5%] top-[2%] z-[3] text-center">
          <h1
            className="mx-auto mt-[1.5%] max-w-[92%] text-[clamp(17px,4.7vw,23px)] font-black leading-[1.02] tracking-[-0.035em] text-[#fff7e8]"
            style={{ fontFamily: "'Bowlby One SC', 'DM Sans', sans-serif" }}
          >
            PERAHU YANG TERBALIK
          </h1>
          <p className="mx-auto mt-[2.2%] max-w-[90%] text-justify text-[clamp(9px,2.35vw,11px)] font-semibold leading-[1.55] text-[#fff4e5]">
            Sangkuriang murka dan menendang perahu besar hingga terbalik. Dalam
            legenda, perahu itu berubah menjadi Gunung Tangkuban Parahu. Nama
            Tangkuban Parahu berarti “perahu yang terbalik”—kisah ini
            mengabadikan kegagalan Sangkuriang dan kecerdikan Dayang Sumbi.
          </p>
        </div>

        <img
          src={illustration}
          alt="Sangkuriang, Gunung Tangkuban Parahu, dan perahu yang terbalik"
          className="pointer-events-none absolute bottom-[-3%] left-1/2 z-[1] h-[79%] w-[96%] max-w-[390px] -translate-x-1/2 object-contain object-bottom"
          draggable={false}
        />

        <div className="absolute inset-x-[6%] top-[34%] z-[2] flex flex-col gap-4">
          <div className="flex w-[72%] flex-col items-start text-left">
            <span className="text-[6px] font-black tracking-[0.16em] text-[#f6d9b4]">
              SANGKURIANG
            </span>
            <p className="mt-1 text-[clamp(9px,2.35vw,12px)] font-extrabold leading-[1.32] text-white">
              “Aku ditipu! Perahu ini kutendang!”
            </p>
          </div>
          <div className="ml-auto flex w-[72%] flex-col items-end text-right">
            <span className="text-[6px] font-black tracking-[0.16em] text-[#f6d9b4]">
              DAYANG SUMBI
            </span>
            <p className="mt-1 text-[clamp(9px,2.35vw,12px)] font-extrabold leading-[1.32] text-white">
              “Perahu itu akan menjadi tanda kisah kita.”
            </p>
          </div>
        </div>

        <p className="absolute left-1/2 top-[28%] z-[3] w-[84%] -translate-x-1/2 text-center text-[7px] font-extrabold leading-tight text-[#fff2dd] sm:text-[8px]">
          Tangkuban Parahu berarti “perahu yang terbalik”.
        </p>

        <div className="absolute bottom-2.5 left-3 right-3 z-[3] flex items-end justify-between gap-2 text-white">
          <span className="text-[6px] font-black tracking-[0.16em] sm:text-[7px]">
            LEGENDA SUNDA · JAWA BARAT
          </span>
          <span className="text-right text-[6px] font-extrabold tracking-[0.1em] sm:text-[7px]">
            TAMAT
          </span>
        </div>
      </section>

      <div className="absolute bottom-[4.5%] left-1/2 z-20 flex -translate-x-1/2 items-center gap-2.5 whitespace-nowrap">
        <span className="rounded-full border border-white/25 bg-[#062f4d]/80 px-2.5 py-1.5 text-[9px] font-bold">
          WhatsApp · 0857 2498 1356
        </span>
        <span className="rounded-full bg-[#062f4d]/75 px-3 py-1.5 text-[9px] font-bold text-[#ffdd00]">
          @nempo.id
        </span>
      </div>
    </article>
  );
}
