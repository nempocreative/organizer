import "./_group.css";

const base = import.meta.env.BASE_URL;

function FoodDoodles() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 700 900"
      preserveAspectRatio="xMidYMid slice"
      className="pointer-events-none absolute inset-0 h-full w-full opacity-[.15]"
    >
      <g
        fill="none"
        stroke="#ffd34f"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M32 110c25-24 60-13 62 13s-30 45-55 28-13-41 9-40 21 23 4 29" />
        <path d="M185 40c14 12 13 29 0 39s-27 2-23-12 20-10 20 3m13 23c10-9 20-7 24 2" />
        <path d="M572 115c9-21 38-23 49-4 10 18-1 41-19 43-16 2-26-11-20-23 5-9 17-8 19 1" />
        <path d="M66 280c-7-31 9-55 29-53 21 2 26 29 9 42-11 8-25 1-21-10 3-8 13-6 14 0" />
        <path d="M574 340c-24 7-42 29-43 56 29 1 48-15 52-43m-48 42 42-37" />
        <path d="M110 488c-14-24-2-52 19-54 22-2 34 23 21 42-9 12-25 8-24-3 1-8 10-11 15-5" />
        <path d="M590 570c-26-16-29-47-7-58 23-12 47 7 37 30-6 13-24 14-27 2-2-8 7-14 14-10" />
        <path d="M66 705c-6-20 5-40 22-40 19 0 27 21 15 34-9 10-23 4-20-6 2-7 11-8 14-3" />
        <path d="M520 760c17-22 47-24 60-5 13 20-2 45-22 43-16-2-22-18-12-27 7-6 17-2 16 5" />
        <circle cx="314" cy="96" r="20" />
        <circle cx="624" cy="227" r="12" />
        <circle cx="256" cy="404" r="15" />
        <circle cx="130" cy="605" r="17" />
        <circle cx="390" cy="744" r="22" />
        <path d="m369 65 8 18 20 2-15 13 5 19-18-10-17 10 4-20-15-12 20-3 8-17Z" />
        <path d="m201 592 6 13 14 2-11 9 3 14-12-7-12 7 3-14-10-9 14-2 5-13Z" />
      </g>
    </svg>
  );
}

function PosterArt() {
  return (
    <section
      role="group"
      aria-label="Contoh poster promosi seblak"
      className="absolute inset-x-[1%] top-[5%] bottom-[9%] overflow-hidden bg-[#f5a000] text-white shadow-[0_12px_32px_rgba(0,0,0,.28)]"
      style={{ fontFamily: "'DM Sans', 'Trebuchet MS', sans-serif" }}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 52% 39%, rgba(255,206,47,.55), transparent 46%), linear-gradient(135deg,#ffad00 0%,#f18b00 100%)",
        }}
      />
      <FoodDoodles />

      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[#286c00]"
        style={{
          clipPath: "polygon(0 72%, 100% 44%, 100% 100%, 0 100%)",
        }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[#164700]"
        style={{
          clipPath: "polygon(0 91%, 100% 65%, 100% 77%, 0 100%)",
        }}
      />

      <p className="absolute left-0 right-0 top-[5%] text-center text-[clamp(6px,1.35vw,10px)] font-black tracking-[.16em] text-white/90">
        NEMPO × JAJAN LOKAL
      </p>
      <h1
        aria-label="Seblak Pedas Bikin Nagih"
        className="absolute left-[3%] right-[3%] top-[9%] z-[2] text-center text-[clamp(14px,4.5vw,34px)] font-black leading-[.9] tracking-[-.035em] text-white"
        style={{
          fontFamily: "'Bricolage Grotesque', 'Arial Black', sans-serif",
          fontWeight: 800,
          transform: "perspective(850px) rotateX(-6deg) rotateZ(-1deg)",
          transformOrigin: "center center",
        }}
      >
        <span
          aria-hidden="true"
          className="absolute inset-0 text-transparent"
          style={{
            WebkitTextStroke: "1.6px rgba(255,248,228,.9)",
            transform: "translate(-1px,-1px) rotate(-.35deg)",
          }}
        >
          SEBLAK PEDAS
          <br />
          BIKIN NAGIH
        </span>
        <span
          aria-hidden="true"
          className="absolute inset-0 text-transparent"
          style={{
            WebkitTextStroke: "1px #df8817",
            transform: "translate(2px,3px) rotate(.3deg)",
          }}
        >
          SEBLAK PEDAS
          <br />
          BIKIN NAGIH
        </span>
        <span className="relative text-[#fffef8] [text-shadow:0_1px_0_#fff7e5,1px_2px_0_#e5aa39,2px_3px_0_#d47b0a,3px_4px_0_rgba(91,43,0,.2)]">
          SEBLAK PEDAS
          <br />
          BIKIN NAGIH
        </span>
      </h1>

      <div
        className="absolute left-[19%] top-[24%] z-[6] flex aspect-[1.24] w-[23%] items-center justify-center rounded-[14px] rounded-br-[3px] border border-[#65a83b]/70 bg-[#286c00] px-[3%] py-[3%] text-center text-[clamp(6px,1.35vw,10px)] font-bold leading-[1.05] text-white"
        style={{
          transform:
            "perspective(680px) rotateX(14deg) rotateY(16deg) rotateZ(-6deg)",
          transformOrigin: "left center",
          transformStyle: "preserve-3d",
          boxShadow:
            "0 2px 0 rgba(25,78,0,.24), 0 7px 13px rgba(22,37,0,.23), inset 0 1px 2px rgba(255,255,255,.12)",
        }}
      >
        Lagi
        <br />
        pengen yang
        <br />
        pedas?
        <span
          className="absolute -bottom-[20%] right-[11%] h-[31%] w-[26%] bg-[#286c00] [clip-path:polygon(0_0,100%_0,100%_100%)]"
          style={{ filter: "drop-shadow(1px 2px 2px rgba(22,37,0,.22))" }}
        />
      </div>
      <div
        className="absolute right-[18%] top-[25%] z-[6] flex aspect-[1.24] w-[23%] items-center justify-center rounded-[14px] rounded-bl-[3px] border border-white/90 bg-[#fffdf4] px-[3%] py-[3%] text-center text-[clamp(6px,1.35vw,10px)] font-bold leading-[1.05] text-[#286c00]"
        style={{
          transform:
            "perspective(680px) rotateX(13deg) rotateY(-16deg) rotateZ(4deg)",
          transformOrigin: "right center",
          transformStyle: "preserve-3d",
          boxShadow:
            "0 2px 0 rgba(222,217,196,.45), 0 7px 13px rgba(22,37,0,.18), inset 0 1px 2px rgba(255,255,255,.9)",
        }}
      >
        Seporsi
        <br />
        hangat,
        <br />
        langsung happy!
        <span
          className="absolute -bottom-[20%] left-[11%] h-[31%] w-[26%] bg-[#fffdf4] [clip-path:polygon(0_0,100%_0,0_100%)]"
          style={{ filter: "drop-shadow(-1px 2px 2px rgba(22,37,0,.18))" }}
        />
      </div>

      <img
        src={`${base}assets/seblak-poster-cutout.png`}
        alt="Semangkuk seblak kuah pedas dengan kerupuk, mi, bakso, sosis, dan daun bawang"
        className="absolute left-1/2 top-[37%] z-[5] w-[68%] max-w-none -translate-x-1/2 object-contain drop-shadow-[0_14px_15px_rgba(48,30,5,.4)]"
        draggable={false}
      />

      <div className="absolute left-[5%] top-[73%] z-[6] -rotate-[9deg] text-[clamp(15px,4.4vw,32px)] font-black leading-[.82] tracking-[-.04em] text-[#9cff19] drop-shadow-[0_3px_3px_rgba(23,54,0,.4)]">
        PESAN
        <br />
        SEKARANG
      </div>
      <p className="absolute right-[3%] top-[60%] z-[6] w-[30%] rotate-[-13deg] text-right text-[clamp(7px,1.7vw,12px)] font-black italic leading-[1.05] text-[#c4ff42] drop-shadow-[0_2px_3px_rgba(20,43,0,.65)]">
        Pedasnya pas!
        <br />
        Nagih terus!
      </p>

      <div className="absolute bottom-[3%] left-[4%] right-[4%] z-[7] flex items-end justify-between gap-2">
        <p className="max-w-[58%] rotate-[-4deg] text-[clamp(7px,1.7vw,12px)] font-semibold italic leading-[1.12] text-white drop-shadow-[0_2px_3px_rgba(0,0,0,.5)]">
          Seblak kuah
          <br />
          pedas gurih khas lokal
        </p>
        <div className="rounded-full border border-white/60 bg-[#f08c00] px-[3%] py-[1.5%] text-[clamp(6px,1.35vw,10px)] font-black tracking-[.1em] text-white shadow-md">
          COBA SEKARANG
        </div>
      </div>
    </section>
  );
}

export function Current() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#211f1c]">
      <div className="relative aspect-[4/5] w-full max-w-[560px] overflow-hidden bg-[#f5a000]">
        <PosterArt />
      </div>
    </div>
  );
}
