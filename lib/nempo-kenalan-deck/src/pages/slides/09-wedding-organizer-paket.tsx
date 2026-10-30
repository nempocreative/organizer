import { SectionKicker, SlideCanvas, SlideFooter } from '../../components/slide-kit';

const packages = [
  {
    name: 'Essential',
    price: 'Rp2.500.000',
    team: '4 anggota tim',
    intro: 'Koordinasi inti untuk hari yang tertata.',
    items: [
      'Konsultasi dan koordinasi persiapan',
      'Penyusunan rundown acara',
      'Koordinasi vendor dan briefing',
      'Koordinasi pada hari-H',
    ],
    note: 'Undangan digital dan alat sawer tidak termasuk.',
    featured: false,
  },
  {
    name: 'Signature',
    price: 'Rp4.000.000',
    team: '6 anggota tim',
    intro: 'Ruang koordinasi lebih luas untuk keluarga dan tamu.',
    items: [
      'Semua layanan Essential',
      'Koordinasi vendor lebih detail',
      'Koordinasi keluarga, tamu, dan alur acara',
      'PIC khusus lapangan',
      'Persiapan teknis dan evaluasi rundown',
    ],
    note: 'Termasuk undangan digital dan alat sawer gratis.',
    featured: true,
  },
  {
    name: 'Premium',
    price: 'Rp6.000.000',
    team: '8 anggota tim',
    intro: 'Pengawasan menyeluruh dari persiapan hingga acara selesai.',
    items: [
      'Semua layanan Signature',
      'Timeline persiapan menyeluruh',
      'Koordinasi vendor lintas divisi',
      'Koordinasi keluarga dan tamu VIP',
      'Pengawasan rundown dari awal hingga akhir',
      'PIC utama dan PIC lapangan',
    ],
    note: 'Termasuk undangan digital dan alat sawer gratis.',
    featured: false,
  },
];

export default function WeddingOrganizerPaketSlide() {
  return (
    <SlideCanvas className="bg-[#f5f9ff] px-[82px] pt-[66px] text-[#101322]">
      <div className="flex items-end justify-between">
        <div>
          <SectionKicker>Wedding Organizer · Pilihan paket</SectionKicker>
          <h1 className="mt-5 text-[68px] font-extrabold leading-[1.02] tracking-[-0.07em]">
            Pilih dukungan yang
            <span className="text-[#1d56c5]"> sesuai kebutuhan.</span>
          </h1>
        </div>
        <p className="mb-1 max-w-[390px] text-[21px] leading-[1.4] text-[#526476]">
          Semua paket berfokus pada manajemen dan koordinasi acara oleh tim WO Nempo.
        </p>
      </div>

      <div className="mt-[44px] grid grid-cols-3 gap-6">
        {packages.map((item) => (
          <article
            key={item.name}
            className={`relative flex h-[640px] flex-col rounded-[28px] border px-[30px] pb-[25px] pt-[27px] ${
              item.featured
                ? 'border-[#1d56c5] bg-[#0a3158] text-white shadow-[0_22px_55px_rgba(10,49,88,0.18)]'
                : 'border-[#d5e4ef] bg-white text-[#101322]'
            }`}
          >
            {item.featured && (
              <span className="absolute right-6 top-6 rounded-full bg-[#70c5ff] px-4 py-2 text-[13px] font-extrabold uppercase tracking-[0.13em] text-[#082c50]">
                Pilihan fleksibel
              </span>
            )}
            <p className={`text-[16px] font-extrabold uppercase tracking-[0.17em] ${item.featured ? 'text-[#8bd2ff]' : 'text-[#1d56c5]'}`}>
              Wedding Organizer
            </p>
            <h2 className="mt-4 text-[38px] font-extrabold leading-none tracking-[-0.055em]">{item.name}</h2>
            <p className={`mt-3 min-h-[52px] max-w-[480px] text-[18px] leading-[1.35] ${item.featured ? 'text-white/70' : 'text-[#526476]'}`}>
              {item.intro}
            </p>
            <div className={`mt-5 border-y py-4 ${item.featured ? 'border-white/15' : 'border-[#dce8f1]'}`}>
              <p className={`text-[31px] font-extrabold tracking-[-0.045em] ${item.featured ? 'text-white' : 'text-[#123a67]'}`}>{item.price}</p>
              <p className={`mt-1 text-[15px] font-bold uppercase tracking-[0.1em] ${item.featured ? 'text-[#a6e0ff]' : 'text-[#47708f]'}`}>
                {item.team}
              </p>
            </div>
            <ul className="mt-5 space-y-[11px]">
              {item.items.map((feature) => (
                <li key={feature} className="flex items-start gap-3 text-[17px] leading-[1.28]">
                  <span className={`mt-[7px] h-[7px] w-[7px] shrink-0 rounded-full ${item.featured ? 'bg-[#70c5ff]' : 'bg-[#28a4c5]'}`} />
                  <span className={item.featured ? 'text-white/85' : 'text-[#34485b]'}>{feature}</span>
                </li>
              ))}
            </ul>
            <p className={`mt-auto border-t pt-4 text-[15px] font-semibold leading-[1.35] ${item.featured ? 'border-white/15 text-[#a6e0ff]' : 'border-[#dce8f1] text-[#1d56c5]'}`}>
              {item.note}
            </p>
          </article>
        ))}
      </div>

      <div className="absolute bottom-[112px] left-[82px] right-[82px] flex items-start gap-4 rounded-[18px] border border-[#c8dce9] bg-[#eaf4fb] px-6 py-4">
        <span className="mt-[7px] h-[10px] w-[10px] shrink-0 rounded-full bg-[#1d56c5]" />
        <p className="text-[16px] leading-[1.35] text-[#34485b]">
          Harga WO mencakup layanan manajemen, bukan vendor independen seperti dekorasi, catering, MUA, dokumentasi, atau hiburan—kecuali disepakati terpisah.
        </p>
      </div>
      <SlideFooter number="11" />
    </SlideCanvas>
  );
}
