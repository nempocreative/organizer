import {
  Heart,
  MessageCircle,
  Scissors,
} from 'lucide-react';
import { FaInstagram, FaLocationDot, FaWhatsapp } from 'react-icons/fa6';
import './_group.css';

const reasons = [
  {
    icon: Scissors,
    title: 'Keahlian cukur khas Garut',
    description: 'Ketelitian barber Garut terasa pada detail setiap potongan.',
  },
  {
    icon: MessageCircle,
    title: 'Pilih gaya bersama barber',
    description:
      'Sampaikan pilihanmu, lalu sepakati model dan detail potongan sebelum dimulai.',
  },
  {
    icon: Heart,
    title: 'Nyaman selama berkunjung',
    description:
      'Nikmati pelayanan ramah dan suasana nyaman selama perawatan di GGS.',
  },
];

export function SlideFrame({ withIcons = false }: { withIcons?: boolean }) {
  const textSizes = withIcons
    ? {
        headline: 'text-[clamp(22px,4.3cqw,40px)]',
        intro: 'text-[clamp(12px,2cqw,16px)]',
        benefitTitle: 'text-[clamp(16px,2.6cqw,23px)]',
        benefitDescription: 'text-[clamp(12px,1.7cqw,14px)]',
        actions: 'text-[clamp(11px,1.6cqw,13px)]',
        icon: 'h-[clamp(16px,2.2cqw,24px)] w-[clamp(16px,2.2cqw,24px)]',
      }
    : {
        headline: 'text-[clamp(20px,4.3cqw,36px)]',
        intro: 'text-[clamp(9px,1.55cqw,12px)]',
        benefitTitle: 'text-[clamp(12px,2.2cqw,17px)]',
        benefitDescription: 'text-[clamp(8px,1.25cqw,10px)]',
        actions: 'text-[clamp(8px,1.3cqw,10px)]',
        icon: 'h-[clamp(13px,1.8cqw,19px)] w-[clamp(13px,1.8cqw,19px)]',
      };

  return (
    <main
      aria-label="GGS Beauty — Mengapa memilih GGS?"
      className="relative isolate h-screen w-full overflow-hidden text-[#472b38]"
      style={{
        backgroundColor: '#FC46AA',
        containerType: 'inline-size',
        fontFamily: "'Poppins', Arial, sans-serif",
      }}
    >
      <img
        src="/__mockup/images/ggs-slide2-background.png"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 h-full w-full object-cover"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{
          backgroundColor: '#FC46AA',
          mixBlendMode: 'color',
          opacity: 0.86,
        }}
      />
      <img
        src="/__mockup/images/ggs-slide2-portrait.png"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute right-[-10%] top-[18%] z-[5] h-[70%] w-auto max-w-[90%]"
        style={{
          filter:
            'saturate(1.08) hue-rotate(-10deg) drop-shadow(0 0 20px rgba(252, 70, 170, 0.34))',
        }}
        draggable={false}
      />
      <div className="pointer-events-none absolute left-[68%] top-[2.5%] z-10 aspect-square w-[16%] -translate-x-1/2">
        <img
          src="/__mockup/images/ggs-beauty-logo.png"
          alt="Logo GGS Beauty — Grooming is Better"
          className="h-full w-full object-contain drop-shadow-[0_10px_25px_rgba(66,37,49,0.22)]"
        />
      </div>

      <section className="absolute left-[11%] right-[50%] top-[37%] z-10 flex flex-col">
        <h1 className={`whitespace-pre-line ${textSizes.headline} font-semibold leading-[0.99] tracking-[-0.055em] text-[#42162f] [text-shadow:0_1px_8px_rgba(255,220,235,0.28)]`}>
          {'Potongan rapi,\nsesuai gayamu.'}
        </h1>
        <p className={`mt-[3%] max-w-[98%] ${textSizes.intro} leading-[1.55] text-[#501a38] [text-shadow:0_1px_7px_rgba(255,220,235,0.3)]`}>
          Barber GGS membantu menemukan potongan yang cocok melalui konsultasi
          dan layanan yang nyaman.
        </p>
        <div
          aria-label="Alasan memilih GGS"
          className="mt-[5%] flex flex-col gap-[2.5cqw]"
        >
          {reasons.map(({ icon: Icon, title, description }) => (
            <article
              key={title}
              className={
                withIcons
                  ? 'flex items-start gap-[1.8cqw]'
                  : 'flex flex-col'
              }
            >
              {withIcons && (
                <Icon
                  aria-hidden="true"
                  className={`mt-[0.08em] ${textSizes.icon} shrink-0 text-[#d91070]`}
                  strokeWidth={1.8}
                />
              )}
              <div className={withIcons ? 'min-w-0' : ''}>
                <h2 className={`${textSizes.benefitTitle} font-semibold leading-[1.16] tracking-[-0.035em] text-[#42162f] [text-shadow:0_1px_7px_rgba(255,220,235,0.28)]`}>
                  {title}
                </h2>
                <p className={`mt-[0.4em] max-w-[98%] ${textSizes.benefitDescription} leading-[1.45] text-[#501a38] [text-shadow:0_1px_6px_rgba(255,220,235,0.32)]`}>
                  {description}
                </p>
              </div>
            </article>
          ))}
        </div>
        <p className={`mt-[5%] flex flex-wrap gap-x-[1.3em] ${textSizes.actions} font-semibold text-[#42162f] [text-shadow:0_1px_6px_rgba(255,220,235,0.3)]`}>
          <span>Lihat layanan →</span>
          <span>Atur jadwal →</span>
        </p>
      </section>

      <footer
        aria-label="Kontak GGS Beauty"
        className="absolute inset-x-[4%] bottom-[4.2%] z-10 flex items-center gap-[2.5%] text-[#561535]"
      >
        <div className="min-w-0 flex-1">
          <p className="whitespace-nowrap text-[clamp(14px,1.8vw,21px)] font-semibold leading-none tracking-[-0.035em]">
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
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-[0.45em] whitespace-nowrap text-[clamp(10px,0.96vw,12px)] font-semibold tracking-[-0.02em]"
          >
            <FaInstagram aria-hidden="true" className="h-[1.15em] w-[1.15em] shrink-0 text-[#561535]" />
            @ggsbeauty.hair.co
          </a>
          <a
            href="https://wa.me/6282342777723"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-[0.45em] whitespace-nowrap text-[clamp(10px,0.96vw,12px)] font-semibold tracking-[-0.02em]"
          >
            <FaWhatsapp aria-hidden="true" className="h-[1.15em] w-[1.15em] shrink-0 text-[#561535]" />
            0823 4277 7723
          </a>
          <span className="inline-flex items-center gap-[0.45em] whitespace-nowrap text-[clamp(8px,0.82vw,10px)] font-medium leading-tight">
            <FaLocationDot aria-hidden="true" className="h-[1.1em] w-[1.1em] shrink-0 text-[#561535]" />
            <span>Jl. Cimanuk No. 309, Sukagalih, Garut</span>
          </span>
        </div>
        <a
          href="https://wa.me/6282342777723"
          target="_blank"
          rel="noreferrer"
          aria-label="Booking Now via WhatsApp"
          className="shrink-0 whitespace-nowrap rounded-full bg-[#561535] px-[0.8em] py-[0.65em] text-[clamp(12px,1.15vw,14px)] font-bold leading-none text-[#fff8f6] transition-colors hover:bg-[#71274c]"
        >
          Booking Now
        </a>
      </footer>
    </main>
  );
}
