import { Instagram, MessageCircle, Music2 } from "lucide-react";

const couplePhoto = "/__mockup/images/nempo-slide10-couple-likeness.webp";

function HandDrawnHeart({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 48 44"
      fill="none"
      className={className}
    >
      <path
        d="M24 39C18 33 4 24 4 14 4 6 14 2 20 9l4 5 4-5c6-7 16-3 16 5 0 10-14 19-20 25Z"
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10 13c1-3 4-4 7-3"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function SnapshotStrip() {
  const crops = [
    { position: "34% 22%", caption: "the first hello" },
    { position: "68% 38%", caption: "same old us" },
  ];

  return (
    <aside
      aria-label="Tiga potongan foto kenangan"
      className="absolute left-[5%] top-[20%] z-20 w-[16%] rotate-[-7deg] bg-[#fffdf7] p-[1.6%] pb-[2.2%] shadow-[2px_7px_13px_rgba(53,43,33,.22)]"
    >
      <div className="space-y-[3px]">
        {crops.map((crop) => (
          <div
            key={crop.caption}
            className="relative aspect-[.78] overflow-hidden bg-[#d5c7b4]"
          >
            <img
              src={couplePhoto}
              alt=""
              aria-hidden="true"
              className="h-full w-full object-cover"
              style={{ objectPosition: crop.position, transform: "scale(1.17)" }}
            />
          </div>
        ))}
      </div>
      <p className="pt-1 text-center font-serif text-[clamp(5px,1vw,8px)] italic leading-none text-[#5c5148]">
        our little days
      </p>
      <span
        aria-hidden="true"
        className="absolute -top-[2%] left-[28%] h-[5%] w-[48%] rotate-[-4deg] bg-[#dce7e8]/85"
      />
    </aside>
  );
}

export function Scrapbook() {
  return (
    <main
      aria-label="Kartu ucapan anniversary Nempo"
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
              <img src="/__mockup/images/nempo-new.webp" alt="Logo N resmi Nempo" className="h-full w-full object-contain" />
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

        <section className="relative z-10 flex min-h-0 flex-1 flex-col items-center justify-center px-[3%] pb-[7%]">
          <div
            className="absolute inset-0 overflow-hidden text-[#283c49]"
            style={{ fontFamily: "'DM Sans', 'Trebuchet MS', sans-serif" }}
          >
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 bottom-[6%] rounded-[16px]"
          style={{
            backgroundColor: "#efe8d9",
            backgroundImage:
              "radial-gradient(ellipse at 88% 17%, rgba(181,204,201,.45), transparent 34%), radial-gradient(ellipse at 7% 91%, rgba(220,156,133,.24), transparent 34%), repeating-linear-gradient(0deg, rgba(101,82,62,.025) 0px, rgba(101,82,62,.025) 1px, transparent 1px, transparent 4px)",
          }}
        />
        <div className="absolute left-[29%] top-[2.5%] z-20 -rotate-[3deg] font-serif text-[clamp(10px,2.3vw,16px)] italic text-[#596b67]">
          Happy anniversary, sayang
          <span className="absolute -bottom-1 left-0 h-px w-[80%] rotate-[-2deg] bg-[#c68469]" />
        </div>

        <div className="absolute left-[51%] top-[35%] z-10 w-[70%] -translate-x-1/2 -translate-y-1/2 rotate-[2.4deg]">
          <div className="relative bg-[#fffdf7] p-[2.5%] pb-[6%] shadow-[0_15px_28px_rgba(48,48,40,.26)]">
            <span
              aria-hidden="true"
              className="absolute -top-[2%] left-[41%] z-10 h-[5%] w-[21%] rotate-[-3deg] border border-[#d5c4a2]/70 bg-[#ead9b9]/90"
            />
            <img
              src={couplePhoto}
              alt="Potret hangat pasangan yang merayakan anniversary"
              className="block aspect-[1.2] w-full object-cover"
              style={{ objectPosition: "center 44%" }}
              loading="eager"
            />
            <div className="absolute bottom-[1.8%] left-[6%] font-serif text-[clamp(6px,1.2vw,9px)] italic tracking-wide text-[#746357]">
              another year, still us
            </div>
            <span className="absolute bottom-[1.4%] right-[7%] rotate-[-9deg] text-[clamp(8px,1.8vw,13px)] text-[#b86960]">
              ♥
            </span>
          </div>
        </div>

        <SnapshotStrip />

        <div className="absolute right-[6%] top-[27%] z-20 w-[26%] rotate-[6deg] border border-[#c9d6d1] bg-[#f8f6eb] px-[2.5%] py-[2%] text-center shadow-[2px_4px_9px_rgba(40,57,54,.13)]">
          <p className="font-serif text-[clamp(7px,1.45vw,10px)] italic leading-[1.25] text-[#46626a]">
            “you make
            <br />
            ordinary days
            <br />
            feel like home”
          </p>
          <span className="mt-1 block text-[clamp(5px,1vw,7px)] tracking-[.16em] text-[#c17a65]">
            — us
          </span>
        </div>

        <div className="absolute right-[6%] top-[48%] z-20 w-[31%] rotate-[3deg] rounded-[13px] border border-white/15 bg-[#292a31]/95 p-[2.4%] text-white shadow-[2px_7px_16px_rgba(28,32,37,.3)]">
          <div className="flex items-center gap-2">
            <div className="flex h-[clamp(22px,6vw,42px)] w-[clamp(22px,6vw,42px)] shrink-0 items-center justify-center overflow-hidden rounded-[5px] bg-[#d8b9a6]">
              <img
                src={couplePhoto}
                alt=""
                aria-hidden="true"
                className="h-full w-full object-cover"
                style={{ objectPosition: "center 31%" }}
              />
            </div>
            <div className="min-w-0">
              <p className="truncate text-[clamp(5px,1.25vw,9px)] font-bold leading-tight">
                Here With Me
              </p>
              <p className="mt-0.5 text-[clamp(4px,1vw,7px)] text-white/65">
                d4vd · our song
              </p>
            </div>
            <span className="ml-auto grid h-[clamp(15px,3.6vw,25px)] w-[clamp(15px,3.6vw,25px)] shrink-0 place-items-center rounded-full bg-white text-[#292a31]">
              <svg aria-hidden="true" viewBox="0 0 12 12" className="h-[45%] w-[45%] fill-current">
                <path d="M3 1.5v9L10 6 3 1.5Z" />
              </svg>
            </span>
          </div>
          <div className="mt-[5%] flex items-center gap-1.5">
            <span className="text-[clamp(4px,1vw,7px)] text-white/55">1:42</span>
            <span className="relative h-[2px] flex-1 rounded-full bg-white/25">
              <span className="absolute inset-y-0 left-0 w-[54%] rounded-full bg-[#f3d59b]" />
            </span>
            <span className="text-[clamp(4px,1vw,7px)] text-white/55">3:25</span>
          </div>
        </div>

        <div className="absolute left-[8%] top-[54%] z-20 -rotate-[7deg]">
          <HandDrawnHeart className="h-[clamp(22px,6vw,42px)] w-[clamp(22px,6vw,42px)] text-[#c47c68]" />
        </div>
        <span className="absolute right-[10%] top-[15%] z-20 rotate-[12deg] font-serif text-[clamp(17px,4vw,28px)] text-[#bb8665]">
          ✳
        </span>
        <span className="absolute left-[27%] top-[53%] z-20 -rotate-[9deg] font-serif text-[clamp(16px,3.7vw,25px)] text-[#66827c]">
          ✦
        </span>

        <section className="absolute left-[8%] right-[8%] top-[63%] z-10">
          <h1
            className="max-w-[94%] font-serif text-[clamp(22px,5vw,36px)] font-bold leading-[1] tracking-[-.045em] text-[#23495a]"
            style={{ textShadow: "1px 1px 0 rgba(255,255,255,.62)" }}
          >
            Nggak kerasa,
            <br />
            <span className="font-normal italic text-[#bd715f]">udah sejauh ini.</span>
          </h1>
          <p className="mt-[1.2%] max-w-full text-[clamp(9px,1.35vw,11px)] font-medium leading-[1.3] text-[#4c5d5d]">
            Makasih udah nemenin aku sampai sekarang. Mungkin aku nggak selalu
            pintar bilangnya, tapi aku senang banget bisa jalanin banyak hal sama
            kamu. Selamat anniversary, ya.
          </p>
          <div className="mt-[1%] flex items-center gap-2 font-serif text-[clamp(10px,1.7vw,13px)] italic text-[#6e7470]">
            <span>Sayang kamu,</span>
            <span className="font-bold text-[#b96e62]">aku.</span>
            <HandDrawnHeart className="h-[clamp(11px,2vw,14px)] w-[clamp(11px,2vw,14px)] text-[#bd715f]" />
          </div>
        </section>

          </div>
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
