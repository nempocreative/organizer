import { SectionKicker, SlideCanvas, SlideFooter } from '../../components/slide-kit';

const weddingSteps = [
  {
    number: '01',
    title: 'Persiapan',
    detail: 'Konsultasi, timeline, dan koordinasi kebutuhan acara.',
    color: '#1d56c5',
  },
  {
    number: '02',
    title: 'Rundown',
    detail: 'Penyusunan alur acara dan briefing tim.',
    color: '#246bb6',
  },
  {
    number: '03',
    title: 'Koordinasi',
    detail: 'Vendor, keluarga, dan tamu sesuai ruang lingkup.',
    color: '#167cad',
  },
  {
    number: '04',
    title: 'Hari-H',
    detail: 'Mengatur alur dan mengawasi jalannya acara.',
    color: '#155187',
  },
];

export default function CaraKerjaSlide() {
  return (
    <SlideCanvas className="bg-[#0a3158] px-[86px] pt-[76px] text-white">
      <div className="flex items-end justify-between">
        <div>
          <SectionKicker light>Wedding Organizer Management</SectionKicker>
          <h1 className="mt-6 max-w-[1200px] text-[76px] font-extrabold leading-[1.02] tracking-[-0.07em]">
            Hari pernikahan,
            <span className="text-[#8bd2ff]"> dikelola dengan terarah.</span>
          </h1>
        </div>
        <p className="mb-2 max-w-[360px] text-[22px] leading-[1.4] text-white/65">
          Manajemen acara dan koordinasi dari persiapan hingga hari pelaksanaan.
        </p>
      </div>

      <div className="relative mt-[82px] grid grid-cols-4 gap-6">
        <div className="absolute left-[10%] right-[10%] top-[39px] h-[2px] bg-white/20" />
        {weddingSteps.map((item) => (
          <article key={item.number} className="relative">
            <div
              className="relative z-10 grid h-[80px] w-[80px] place-items-center rounded-full border-[7px] border-[#0a3158] text-[22px] font-extrabold text-white"
              style={{ backgroundColor: item.color }}
            >
              {item.number}
            </div>
            <h2 className="mt-8 text-[36px] font-extrabold leading-tight tracking-[-0.05em]">
              {item.title}
            </h2>
            <p className="mt-4 max-w-[350px] text-[24px] leading-[1.4] text-white/70">
              {item.detail}
            </p>
          </article>
        ))}
      </div>

      <div className="absolute bottom-[138px] left-[86px] right-[86px] flex items-center justify-between rounded-[26px] border border-white/15 bg-white/[0.06] px-8 py-6">
        <p className="text-[23px] font-semibold text-white/80">
          Vendor spesialis dipilih terpisah; tim WO membantu koordinasinya.
        </p>
        <span className="rounded-full bg-[#70c5ff] px-6 py-3 text-[17px] font-extrabold uppercase tracking-[0.12em] text-[#082c50]">
          Diskusikan kebutuhan
        </span>
      </div>
      <SlideFooter number="09" dark />
    </SlideCanvas>
  );
}