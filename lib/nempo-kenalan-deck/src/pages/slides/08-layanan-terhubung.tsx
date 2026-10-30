import communityPhoto from '../../assets/deck/community.jpg';
import { SectionKicker, SlideCanvas, SlideFooter } from '../../components/slide-kit';

const sequence = [
  {
    number: '01',
    name: 'Kreatif usaha',
    role: 'Konten, visual, branding',
    detail: 'Bangun materi dan identitas yang sesuai kebutuhan bisnis.',
    color: '#8bd2ff',
  },
  {
    number: '02',
    name: 'Marketing Agency',
    role: 'Strategi, promosi, publikasi',
    detail: 'Susun arah kampanye dan cara berkomunikasi dengan audiens.',
    color: '#70c5ff',
  },
  {
    number: '03',
    name: 'Creator & talent',
    role: 'Konten, foto, video, panggung',
    detail: 'Pilih talent yang dibutuhkan untuk produksi atau acara.',
    color: '#a6e0ff',
  },
  {
    number: '04',
    name: 'Event Organizer',
    role: 'Pengalaman dan pelaksanaan',
    detail: 'Saat dibutuhkan, bawa kampanye ke ruang acara.',
    color: '#59b8ef',
  },
];

export default function LayananTerhubungSlide() {
  return (
    <SlideCanvas className="bg-[#082c50] text-white">
      <div className="absolute -right-[160px] -top-[225px] h-[650px] w-[650px] rounded-full border border-white/10" />
      <div className="absolute -right-[64px] -top-[130px] h-[460px] w-[460px] rounded-full border border-white/10" />
      <div className="relative z-10 grid h-full grid-cols-[1.16fr_.84fr] gap-[68px] px-[88px] pb-[128px] pt-[72px]">
        <div>
          <SectionKicker light>Kolaborasi lintas layanan</SectionKicker>
          <h1 className="mt-6 max-w-[990px] text-[76px] font-extrabold leading-[1.01] tracking-[-0.07em]">
            Satu kebutuhan,
            <span className="block text-[#8bd2ff]">tim yang saling menguatkan.</span>
          </h1>
          <p className="mt-5 max-w-[790px] text-[24px] leading-[1.4] text-white/70">
            Contoh alur untuk sebuah brand—layanan dipilih dan disusun sesuai brief, bukan paket yang harus diambil semua.
          </p>

          <div className="relative mt-[39px]">
            <div className="absolute bottom-[31px] left-[28px] top-[31px] w-[2px] bg-white/20" />
            <div className="space-y-[15px]">
              {sequence.map((step) => (
                <article key={step.number} className="relative flex min-h-[108px] items-start gap-6">
                  <span className="relative z-10 grid h-[58px] w-[58px] shrink-0 place-items-center rounded-full border-[5px] border-[#082c50] text-[16px] font-extrabold text-[#082c50]" style={{ backgroundColor: step.color }}>
                    {step.number}
                  </span>
                  <div className="flex-1 border-b border-white/15 pb-[14px]">
                    <div className="flex items-baseline justify-between gap-5">
                      <h2 className="text-[27px] font-extrabold tracking-[-0.04em]">{step.name}</h2>
                      <span className="text-[14px] font-bold uppercase tracking-[0.12em] text-[#a6e0ff]">{step.role}</span>
                    </div>
                    <p className="mt-2 max-w-[700px] text-[19px] leading-[1.35] text-white/65">{step.detail}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>

        <aside className="relative mt-[136px] mb-[32px] overflow-hidden rounded-[36px] border border-white/15 bg-[#17476e]">
          <img src={communityPhoto} alt="Tim kreatif berdiskusi dan merancang ide bersama" className="absolute inset-0 h-full w-full object-cover" style={{ objectPosition: 'center 48%' }} />
          <div className="absolute inset-0 bg-gradient-to-t from-[#061f39]/95 via-[#061f39]/15 to-[#061f39]/5" />
          <div className="absolute left-[30px] top-[30px] rounded-full border border-white/40 bg-[#082c50]/35 px-5 py-3 text-[14px] font-bold uppercase tracking-[0.15em] text-white backdrop-blur-sm">
            Satu ruang kolaborasi
          </div>
          <div className="absolute bottom-[36px] left-[36px] right-[36px]">
            <div className="mb-5 h-[4px] w-[58px] rounded-full bg-[#70c5ff]" />
            <p className="text-[34px] font-extrabold leading-[1.12] tracking-[-0.045em]">
              Dari identitas brand hingga pengalaman bersama audiens.
            </p>
            <p className="mt-4 text-[18px] leading-[1.4] text-white/70">
              Wedding Organizer dapat menjadi fokus tersendiri untuk kebutuhan hari pernikahan.
            </p>
          </div>
        </aside>
      </div>
      <SlideFooter number="14" dark />
    </SlideCanvas>
  );
}
