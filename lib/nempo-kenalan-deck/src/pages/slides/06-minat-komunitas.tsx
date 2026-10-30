import { SectionKicker, SlideCanvas, SlideFooter } from '../../components/slide-kit';
import eventPhoto from '../../assets/deck/karnaval.webp';

const eventFormats = [
  {
    title: 'Festival & konser',
    detail: 'Panggung, hiburan, dan pengalaman untuk audiens.',
    color: '#1d56c5',
    bg: '#e8f3ff',
  },
  {
    title: 'Sport event',
    detail: 'Pertandingan dan kegiatan olahraga untuk komunitas.',
    color: '#147cad',
    bg: '#e8f7ff',
  },
  {
    title: 'Touring & gathering',
    detail: 'Pengalaman bersama untuk komunitas atau perusahaan.',
    color: '#356fbd',
    bg: '#edf3ff',
  },
  {
    title: 'Pameran & expo',
    detail: 'Perkenalkan produk, layanan, dan brand kepada pengunjung.',
    color: '#1675a2',
    bg: '#eaf7fa',
  },
  {
    title: 'Corporate & community',
    detail: 'Acara perusahaan, komunitas, dan kolaborasi.',
    color: '#2265aa',
    bg: '#eef5ff',
  },
  {
    title: 'Brand activation',
    detail: 'Aktivasi brand yang mempertemukan produk dan audiens.',
    color: '#176a76',
    bg: '#e7f7f8',
  },
];

export default function MinatKomunitasSlide() {
  return (
    <SlideCanvas className="bg-[#f5f9ff] text-[#101322]">
      <div className="grid h-full grid-cols-[1.08fr_.92fr]">
        <div className="flex flex-col px-[86px] pb-[132px] pt-[78px]">
          <SectionKicker>Event Organizer</SectionKicker>
          <h1 className="mt-6 max-w-[900px] text-[75px] font-extrabold leading-[1.02] tracking-[-0.07em]">
            Ruang untuk
            <span className="block text-[#1d56c5]">acara apa pun.</span>
          </h1>
          <p className="mt-5 max-w-[700px] text-[23px] leading-[1.4] text-[#526476]">
            Dari pengalaman publik hingga pertemuan yang lebih intim.
          </p>
          <div className="mt-9">
            {eventFormats.map((interest, index) => (
              <article key={interest.title} className="flex items-center gap-5 border-t border-[#d9e5ee] py-[15px]">
                <span className="w-[43px] shrink-0 text-[15px] font-extrabold tracking-[0.12em]" style={{ color: interest.color }}>0{index + 1}</span>
                <h2 className="w-[300px] shrink-0 text-[24px] font-extrabold tracking-[-0.035em]" style={{ color: interest.color }}>{interest.title}</h2>
                <p className="text-[17px] leading-[1.3] text-[#526476]">{interest.detail}</p>
              </article>
            ))}
          </div>
          <p className="mt-auto pt-5 text-[17px] font-semibold text-[#526476]">
            Format dan detail pelaksanaan dibahas sesuai tujuan acara.
          </p>
        </div>
        <div className="relative m-[34px] overflow-hidden rounded-[38px] bg-[#0a3158]">
          <img src={eventPhoto} alt="Suasana festival dan perayaan di ruang publik" className="absolute inset-0 h-full w-full object-cover" style={{ objectPosition: 'center' }} />
          <div className="absolute inset-0 bg-gradient-to-t from-[#061e39]/90 via-[#061e39]/10 to-transparent" />
          <div className="absolute left-[38px] top-[38px] rounded-full border border-white/40 bg-[#082c50]/35 px-5 py-3 text-[15px] font-bold uppercase tracking-[0.16em] text-white backdrop-blur-sm">
            Festival · Pameran · Aktivasi
          </div>
          <div className="absolute bottom-[54px] left-[46px] right-[46px] text-white">
            <p className="text-[15px] font-bold uppercase tracking-[0.2em] text-[#a6e0ff]">Event Organizer Nempo</p>
            <p className="mt-4 text-[45px] font-extrabold leading-[1.06] tracking-[-0.05em]">
              Detail acara bergerak bersama.
            </p>
          </div>
        </div>
      </div>
      <SlideFooter number="06" />
    </SlideCanvas>
  );
}