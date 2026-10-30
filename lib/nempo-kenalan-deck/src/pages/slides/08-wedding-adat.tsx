import { SectionKicker, SlideCanvas, SlideFooter } from '../../components/slide-kit';

export default function WeddingAdatSlide() {
  return (
    <SlideCanvas className="bg-[#f5f9ff] px-[88px] pt-[72px] text-[#101322]">
      <div className="flex items-end justify-between">
        <div>
          <SectionKicker>WO Nempo · Vendor rekanan</SectionKicker>
          <h1 className="mt-5 max-w-[1120px] text-[74px] font-extrabold leading-[1.02] tracking-[-0.07em]">
            Pilihan adat Sunda
            <span className="block text-[#1d56c5]">untuk hari istimewa.</span>
          </h1>
        </div>
        <p className="mb-2 max-w-[420px] text-[22px] leading-[1.4] text-[#526476]">
          Dua format pertunjukan adat dapat dibahas untuk klien Wedding Organizer Nempo.
        </p>
      </div>

      <div className="mt-[64px] grid grid-cols-2">
        <section className="pr-[58px]">
          <div className="flex items-center gap-5">
            <span className="text-[17px] font-extrabold uppercase tracking-[0.16em] text-[#1d56c5]">
              Pilihan 01
            </span>
            <span className="h-px flex-1 bg-[#c9dbe9]" />
          </div>
          <h2 className="mt-7 text-[48px] font-extrabold leading-[1.05] tracking-[-0.055em]">
            Dengan musik live
          </h2>
          <p className="mt-4 max-w-[720px] text-[23px] leading-[1.4] text-[#526476]">
            Iringan musik tradisional untuk menghadirkan suasana adat Sunda secara langsung.
          </p>
          <div className="mt-8 rounded-[24px] bg-[#e7f3fc] px-7 py-6">
            <p className="text-[17px] font-extrabold uppercase tracking-[0.14em] text-[#1d56c5]">
              Musik
            </p>
            <p className="mt-3 text-[24px] font-semibold leading-[1.45] text-[#263f59]">
              Kendang · Kecapi · Suling · Sinden · Perkusi
            </p>
          </div>
          <p className="mt-6 text-[21px] leading-[1.45] text-[#526476]">
            <span className="font-bold text-[#101322]">Penampilan:</span> 4 penari · Lengser · Ambu · Baksa
          </p>
        </section>

        <section className="border-l border-[#c9dbe9] pl-[58px]">
          <div className="flex items-center gap-5">
            <span className="text-[17px] font-extrabold uppercase tracking-[0.16em] text-[#147cad]">
              Pilihan 02
            </span>
            <span className="h-px flex-1 bg-[#c9dbe9]" />
          </div>
          <h2 className="mt-7 text-[48px] font-extrabold leading-[1.05] tracking-[-0.055em]">
            Tanpa musik live
          </h2>
          <p className="mt-4 max-w-[720px] text-[23px] leading-[1.4] text-[#526476]">
            Fokus pada prosesi dan pertunjukan adat tanpa kelompok musik live.
          </p>
          <div className="mt-8 rounded-[24px] bg-[#e9f6f7] px-7 py-6">
            <p className="text-[17px] font-extrabold uppercase tracking-[0.14em] text-[#147cad]">
              Penampilan
            </p>
            <p className="mt-3 text-[24px] font-semibold leading-[1.45] text-[#263f59]">
              4 penari · Lengser · Ambu · Baksa
            </p>
          </div>
          <p className="mt-6 text-[21px] leading-[1.45] text-[#526476]">
            Format dipilih sesuai suasana dan kebutuhan acara.
          </p>
        </section>
      </div>

      <div className="absolute bottom-[126px] left-[88px] right-[88px] flex items-center justify-between border-t border-[#c9dbe9] pt-5">
        <p className="max-w-[1280px] text-[18px] leading-[1.4] text-[#526476]">
          Layanan adat disediakan vendor rekanan. Jadwal, durasi, dan kebutuhan teknis dikonfirmasi sebelum pemesanan.
        </p>
        <span className="shrink-0 rounded-full bg-[#082c50] px-6 py-3 text-[15px] font-extrabold uppercase tracking-[0.12em] text-white">
          Detail dibahas saat konsultasi
        </span>
      </div>
      <SlideFooter number="10" />
    </SlideCanvas>
  );
}
