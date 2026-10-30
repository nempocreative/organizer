import eventPhoto from '../../assets/deck/karnaval.webp';
import { BrandLockup, SectionKicker, SlideCanvas, SlideFooter } from '../../components/slide-kit';

export default function CeritaLokalSlide() {
  return (
    <SlideCanvas className="bg-[#f7faff] text-[#101322]">
      <div className="grid h-full grid-cols-[1.08fr_.92fr]">
        <div className="flex flex-col px-[94px] pb-[138px] pt-[78px]">
          <BrandLockup />
          <div className="mt-[90px]">
            <SectionKicker>Layanan Nempo</SectionKicker>
            <h1 className="mt-8 max-w-[900px] text-[82px] font-extrabold leading-[1.02] tracking-[-0.07em]">
              Dari ide jadi
              <span className="block text-[#1d56c5]">pengalaman nyata.</span>
            </h1>
            <p className="mt-8 max-w-[780px] text-[34px] leading-[1.38] text-[#526476]">
              Tim kreatif Nempo membantu brand dan bisnis merancang konten,
              kampanye, dan acara untuk audiensnya.
            </p>
            <div className="mt-11 flex flex-wrap gap-3">
              {[
                'Creator Booking',
                'Marketing Agency',
                'Kreatif Usaha',
                'Event Organizer',
                'Wedding Organizer',
              ].map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-[#d6e6f1] bg-white px-7 py-4 text-[22px] font-bold text-[#16418e] shadow-[0_8px_24px_rgba(24,73,113,0.06)]"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="relative m-[36px] overflow-hidden rounded-[42px]">
          <img
            src={eventPhoto}
            alt="Festival dan kegiatan publik di Garut"
            className="h-full w-full object-cover"
            style={{ objectPosition: 'center' }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#071e35]/80 via-transparent to-transparent" />
          <div className="absolute bottom-[54px] left-[54px] right-[54px] text-white">
            <p className="text-[17px] font-bold uppercase tracking-[0.2em] text-white/70">
              Cerita dan pengalaman
            </p>
            <p className="mt-3 text-[39px] font-extrabold leading-tight tracking-[-0.04em]">
              Kampanye, event, dan momen spesial untuk audiens Anda.
            </p>
          </div>
        </div>
      </div>
      <SlideFooter number="02" />
    </SlideCanvas>
  );
}