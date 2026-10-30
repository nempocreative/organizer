import communityPhoto from '../../assets/deck/community.jpg';
import { BrandLockup, SlideCanvas, SlideFooter } from '../../components/slide-kit';

export default function HaloNempoSlide() {
  return (
    <SlideCanvas className="bg-[#082c50] text-white">
      <div className="absolute inset-y-0 right-0 w-[48%]">
        <img
          src={communityPhoto}
          alt="Anak muda duduk bersama dan bertukar ide"
          className="h-full w-full object-cover"
          style={{ objectPosition: 'center 45%' }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#082c50] via-[#082c50]/35 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#061f39]/35 to-transparent" />
      </div>

      <div className="absolute -left-[140px] -top-[225px] h-[570px] w-[570px] rounded-full border border-white/10" />
      <div className="absolute -left-[55px] -top-[138px] h-[400px] w-[400px] rounded-full border border-white/10" />

      <div className="relative z-10 flex h-full w-[60%] flex-col justify-between px-[92px] pt-[72px] pb-[112px]">
        <div className="flex items-center gap-7">
          <BrandLockup inverse />
          <span className="rounded-full border border-white/25 px-5 py-2 text-[15px] font-bold uppercase tracking-[0.15em] text-white/75">
            Layanan Kreatif & Event
          </span>
        </div>

        <div className="max-w-[960px] pb-[32px]">
          <p className="mb-5 text-[25px] font-semibold text-white/65">
            CREATIVE · MARKETING · EVENT
          </p>
          <h1 className="text-[116px] font-extrabold leading-[0.96] tracking-[-0.075em]">
            Ide besar,
            <span className="mt-3 block text-[#8bd2ff]">eksekusi bareng Nempo.</span>
          </h1>
          <p className="mt-9 max-w-[740px] text-[31px] leading-[1.35] text-white/80">
            Tim kreatif, kampanye brand, dan produksi acara—dari kebutuhan
            usaha sampai momen spesial.
          </p>
          <div className="mt-10 flex items-center gap-4 text-[18px] font-bold uppercase tracking-[0.16em] text-white/55">
            <span className="h-[2px] w-[50px] bg-[#70c5ff]" />
            Nempo · Layanan kreatif & event
          </div>
        </div>

        <p className="text-[16px] font-bold uppercase tracking-[0.2em] text-white/45">
          Untuk bisnis, brand, dan momen spesial
        </p>
      </div>
      <SlideFooter number="01" dark leftInset={92} />
    </SlideCanvas>
  );
}