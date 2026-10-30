import { SectionKicker, SlideCanvas, SlideFooter } from '../../components/slide-kit';

const options = [
  {
    label: 'Pilihan 01',
    title: 'Paket musik Sunda live',
    normal: 'Rp3.500.000',
    special: 'Rp2.800.000',
    detailLabel: 'Musik & pengiring',
    inclusions: 'Kendang · Kecapi · Suling · Sinden · Perkusi',
    performers: '4 penari · Lengser · Ambu · Baksa',
    accent: '#1d56c5',
    tint: '#e7f3fc',
  },
  {
    label: 'Pilihan 02',
    title: 'Tanpa musik live',
    normal: 'Rp2.500.000',
    special: 'Rp1.800.000',
    detailLabel: 'Unsur paket',
    inclusions: '4 penari',
    performers: 'Ambu · Lengser · Baksa',
    accent: '#147cad',
    tint: '#e9f6f7',
  },
];

export default function TarifAdatSundaSlide() {
  return (
    <SlideCanvas className="bg-[#f5f9ff] px-[88px] pt-[68px] text-[#101322]">
      <div className="flex items-end justify-between">
        <div>
          <SectionKicker>WO Nempo · Tarif khusus vendor rekanan</SectionKicker>
          <h1 className="mt-5 max-w-[1160px] text-[70px] font-extrabold leading-[1.02] tracking-[-0.07em]">
            Pilihan adat Sunda,
            <span className="block text-[#1d56c5]">tarif spesial untuk klien WO.</span>
          </h1>
        </div>
        <p className="mb-2 max-w-[380px] text-[21px] leading-[1.4] text-[#526476]">
          Pilih pertunjukan dengan musik live atau format tanpa musik live.
        </p>
      </div>

      <div className="mt-[48px] grid grid-cols-2 gap-7">
        {options.map((item) => (
          <article key={item.label} className="relative h-[520px] overflow-hidden rounded-[30px] border border-[#d2e3ee] bg-white px-[36px] py-[30px] shadow-[0_18px_50px_rgba(12,49,82,0.06)]">
            <div className="absolute right-0 top-0 h-[10px] w-[38%]" style={{ backgroundColor: item.accent }} />
            <div className="flex items-center gap-5">
              <span className="text-[15px] font-extrabold uppercase tracking-[0.16em]" style={{ color: item.accent }}>{item.label}</span>
              <span className="h-px flex-1 bg-[#d5e4ef]" />
              <span className="rounded-full px-4 py-2 text-[13px] font-extrabold uppercase tracking-[0.1em]" style={{ backgroundColor: item.tint, color: item.accent }}>Khusus klien WO</span>
            </div>
            <h2 className="mt-6 text-[42px] font-extrabold leading-[1.05] tracking-[-0.055em]">{item.title}</h2>
            <div className="mt-6 flex items-end gap-8 rounded-[22px] px-6 py-5" style={{ backgroundColor: item.tint }}>
              <div>
                <p className="text-[14px] font-extrabold uppercase tracking-[0.12em] text-[#526476]">Harga normal</p>
                <p className="mt-2 text-[26px] font-bold text-[#526476] line-through decoration-2">{item.normal}</p>
              </div>
              <div className="h-[54px] w-px bg-[#bfd4e2]" />
              <div>
                <p className="text-[14px] font-extrabold uppercase tracking-[0.12em]" style={{ color: item.accent }}>Tarif spesial WO</p>
                <p className="mt-1 text-[38px] font-extrabold tracking-[-0.05em] text-[#123a67]">{item.special}</p>
              </div>
              <span className="mb-1 ml-auto rounded-full bg-white px-4 py-2 text-[15px] font-extrabold text-[#147cad]">Hemat Rp700.000</span>
            </div>
            <div className="mt-6 grid grid-cols-[155px_1fr] gap-x-5 gap-y-4 border-t border-[#dce8f1] pt-5">
              <p className="text-[14px] font-extrabold uppercase tracking-[0.12em] text-[#526476]">{item.detailLabel}</p>
              <p className="text-[19px] font-semibold leading-[1.35] text-[#263f59]">{item.inclusions}</p>
              <p className="text-[14px] font-extrabold uppercase tracking-[0.12em] text-[#526476]">Penampilan</p>
              <p className="text-[19px] font-semibold leading-[1.35] text-[#263f59]">{item.performers}</p>
            </div>
          </article>
        ))}
      </div>

      <div className="absolute bottom-[112px] left-[88px] right-[88px] rounded-[18px] border border-[#c8dce9] bg-[#eaf4fb] px-6 py-[17px]">
        <p className="text-[16px] leading-[1.4] text-[#34485b]">
          Tarif spesial berlaku untuk klien WO yang memilih salah satu dari dua opsi adat. Harga, ketersediaan vendor, jadwal, durasi, transportasi, dan kebutuhan teknis perlu dikonfirmasi kembali dengan vendor rekanan.
        </p>
      </div>
      <SlideFooter number="12" />
    </SlideCanvas>
  );
}
