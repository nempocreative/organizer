import { SectionKicker, SlideCanvas, SlideFooter } from '../../components/slide-kit';

const works = [
  {
    title: 'Festival Gondang se-Kabupaten Garut',
    context: 'Dinas Ketahanan Pangan',
  },
  {
    title: 'Mapag Kolaborasi PPSI dan Upacara Adat Saduli Ragap',
    context: 'HUT RI ke-79',
  },
  {
    title: 'Tarawangsa Kreasi',
    context: 'HUT RI ke-80',
  },
  {
    title: 'Tari Persembahan dan Rampak Kendang',
    context: 'Family Gathering, Ciwidey',
  },
  {
    title: 'Tarawangsa Tradisional, Oratorium Kaulinan Barudak, dan Rampak Kendang',
    context: 'Tahun Baru 2026, Harmoni Garut',
  },
  {
    title: 'Drama Tari Nyi Endit',
    context: 'Nempo',
  },
  {
    title: 'Drama Tari Nyi Endit dan Tari Kreasi Wiradomba',
    context: 'Nempo',
  },
  {
    title: 'Ceremonial Tari Sampurasun dan Tari Kreasi',
    context: 'Temu Tarung',
  },
  {
    title: 'Ceremonial Tari Sampurasun dan Rampak Kendang',
    context: 'Maxi',
  },
];

export default function KaryaPertunjukanSlide() {
  return (
    <SlideCanvas className="bg-[#f5f9ff] px-[82px] pt-[68px] text-[#101322]">
      <header className="flex items-end justify-between border-b border-[#c9dbe9] pb-8">
        <div>
          <SectionKicker>Portofolio · Pertunjukan</SectionKicker>
          <h1 className="mt-5 text-[67px] font-extrabold leading-[1.02] tracking-[-0.07em]">
            Karya panggung,
            <span className="text-[#1d56c5]"> dalam beragam konteks.</span>
          </h1>
        </div>
        <p className="mb-2 max-w-[320px] text-[18px] leading-[1.4] text-[#526476]">
          Sembilan kreasi pertunjukan dan konteks acara.
        </p>
      </header>

      <div className="mt-7 grid grid-cols-3 gap-x-7 gap-y-4">
        {works.map((work, index) => (
          <article
            key={work.title}
            className="relative flex h-[202px] flex-col overflow-hidden rounded-[19px] border border-[#d6e4ed] bg-white px-6 pb-5 pt-5"
          >
            <div className="flex items-center gap-3">
              <span className="text-[14px] font-extrabold tracking-[0.12em] text-[#1d56c5]">
                {String(index + 1).padStart(2, '0')}
              </span>
              <span className="h-px flex-1 bg-[#dce8f1]" />
              <span className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#738599]">
                Karya
              </span>
            </div>
            <h2 className="mt-3 text-[24px] font-extrabold leading-[1.13] tracking-[-0.045em] text-[#153653]">
              {work.title}
            </h2>
            <div className="mt-auto border-t border-[#e2ebf1] pt-3">
              <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#147cad]">
                Konteks
              </p>
              <p className="mt-1 text-[16px] font-semibold leading-[1.2] text-[#526476]">
                {work.context}
              </p>
            </div>
          </article>
        ))}
      </div>
      <SlideFooter number="07" />
    </SlideCanvas>
  );
}
