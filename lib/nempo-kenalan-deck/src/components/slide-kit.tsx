import { useEffect, useState, type ReactNode } from 'react';
import blueMark from '../assets/deck/nempo-logo.webp';
import slideManifest from '../data/slides-manifest.json';

const DESIGN_WIDTH = 1920;
const DESIGN_HEIGHT = 1080;
const TOTAL_SLIDES = String(slideManifest.length).padStart(2, '0');

function getSlideScale() {
  if (window.location.pathname === '/allslides') return 1;
  return Math.min(
    window.innerWidth / DESIGN_WIDTH,
    window.innerHeight / DESIGN_HEIGHT,
  );
}

export function SlideCanvas({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  const [scale, setScale] = useState(getSlideScale);

  useEffect(() => {
    const updateScale = () => setScale(getSlideScale());
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, []);

  return (
    <section
      className={`relative overflow-hidden ${className}`}
      style={{
        width: DESIGN_WIDTH,
        height: DESIGN_HEIGHT,
        transform: `scale(${scale})`,
        transformOrigin: 'top left',
      }}
    >
      {children}
    </section>
  );
}

export function BrandLockup({ inverse = false }: { inverse?: boolean }) {
  if (inverse) {
    return (
      <div className="flex items-center gap-3">
        <img
          src={blueMark}
          alt=""
          className="h-[60px] w-[60px] rounded-[17px] bg-white p-[4px] object-contain"
        />
        <span className="text-[32px] font-extrabold tracking-[-0.06em] text-white">
          nempo.id
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <img src={blueMark} alt="" className="h-[60px] w-[60px] object-contain" />
      <span className="text-[32px] font-extrabold tracking-[-0.06em] text-[#1d56c5]">
        nempo.id
      </span>
    </div>
  );
}

export function SlideFooter({
  number,
  dark = false,
  leftInset = 92,
}: {
  number: string;
  dark?: boolean;
  leftInset?: number;
}) {
  return (
    <div
      className={`absolute bottom-[40px] right-[76px] flex items-center justify-between text-[16px] font-bold uppercase tracking-[0.16em] ${
        dark ? 'text-white/55' : 'text-[#687789]'
      }`}
      style={{ left: leftInset }}
    >
      <span>Nempo.id x Kala Muda</span>
      <span>{number} / {TOTAL_SLIDES}</span>
    </div>
  );
}

export function SectionKicker({
  children,
  light = false,
}: {
  children: ReactNode;
  light?: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-3 text-[18px] font-bold uppercase tracking-[0.2em] ${
        light ? 'text-[#8bd2ff]' : 'text-[#1d56c5]'
      }`}
    >
      <span
        className={`h-[3px] w-[34px] rounded-full bg-[#70c5ff]`}
      />
      {children}
    </div>
  );
}

export function RoundedPhoto({
  src,
  alt,
  className = '',
  position = 'center',
}: {
  src: string;
  alt: string;
  className?: string;
  position?: string;
}) {
  return (
    <img
      src={src}
      alt={alt}
      className={`h-full w-full object-cover ${className}`}
      style={{ objectPosition: position }}
    />
  );
}