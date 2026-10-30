import communityPhoto from '../../assets/deck/community.jpg';
import { BrandLockup, SlideCanvas, SlideFooter } from '../../components/slide-kit';

export default function KenalanYukSlide() {
  return (
    <SlideCanvas className="bg-[#082c50] text-white">
      <div className="absolute inset-y-0 right-0 w-[42%]">
        <img
          src={communityPhoto}
          alt="Tim berdiskusi bersama di meja kerja"
          className="h-full w-full object-cover"
          style={{ objectPosition: 'center 45%' }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#082c50] via-[#082c50]/40 to-[#082c50]/10" />
      </div>

      <div className="relative z-10 flex h-full w-[70%] flex-col px-[92px] pb-[128px] pt-[74px]">
        <BrandLockup inverse />
        <div className="mt-[72px]">
          <p className="text-[19px] font-bold uppercase tracking-[0.2em] text-[#8bd2ff]">
            Konsultasi Nempo
          </p>
          <h1 className="mt-5 max-w-[1140px] text-[88px] font-extrabold leading-[0.98] tracking-[-0.07em]">
            Bawa ide Anda.
            <span className="block text-[#8bd2ff]">Kita wujudkan bersama.</span>
          </h1>
          <p className="mt-7 max-w-[900px] text-[28px] leading-[1.35] text-white/75">
            Ceritakan kebutuhan brand, konten, atau acara Anda. Tim Nempo siap
            membahas layanan yang sesuai.
          </p>
        </div>

        <div className="mt-9 flex flex-col items-start">
          <a
            href="https://wa.me/6285724981356"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-4 rounded-full bg-[#70c5ff] px-8 py-5 text-[22px] font-extrabold text-[#082c50] shadow-lg transition-transform hover:-translate-y-1"
            aria-label="Hubungi Nempo melalui WhatsApp di 0857 2498 1356"
          >
            <span className="text-[16px] font-bold uppercase tracking-[0.14em]">WhatsApp</span>
            <span aria-hidden="true" className="h-8 w-px bg-[#082c50]/25" />
            <span>0857 2498 1356</span>
          </a>
          <p className="mt-3 text-[19px] font-semibold text-white/70">
            Ceritakan brief dan kebutuhan Anda
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <a
              href="https://www.instagram.com/nempo.id/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Kunjungi Instagram Nempo, @nempo.id"
              className="inline-flex items-center gap-3 rounded-full border border-white/35 px-6 py-3 text-[18px] font-bold text-white transition-colors hover:bg-white/10"
            >
              <span className="text-[13px] uppercase tracking-[0.14em] text-[#8bd2ff]">Instagram</span>
              <span>@nempo.id</span>
            </a>
            <a
              href="https://www.tiktok.com/@nempo.id"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Kunjungi TikTok Nempo, @nempo.id"
              className="inline-flex items-center gap-3 rounded-full border border-white/35 px-6 py-3 text-[18px] font-bold text-white transition-colors hover:bg-white/10"
            >
              <span className="text-[13px] uppercase tracking-[0.14em] text-[#8bd2ff]">TikTok</span>
              <span>@nempo.id</span>
            </a>
          </div>
        </div>
      </div>

      <SlideFooter number="16" dark />
    </SlideCanvas>
  );
}