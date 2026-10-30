import { SectionKicker, SlideCanvas, SlideFooter } from '../../components/slide-kit';

const rows = [
  { package: 'Essential', wo: 'Rp2.500.000', live: 'Rp5.300.000', noLive: 'Rp4.300.000' },
  { package: 'Signature', wo: 'Rp4.000.000', live: 'Rp6.800.000', noLive: 'Rp5.800.000' },
  { package: 'Premium', wo: 'Rp6.000.000', live: 'Rp8.800.000', noLive: 'Rp7.800.000' },
];

export default function ContohTotalKombinasiSlide() {
  return (
    <SlideCanvas className="bg-[#f5f9ff] px-[88px] pt-[68px] text-[#101322]">
      <div className="flex items-end justify-between">
        <div>
          <SectionKicker>Simulasi total biaya · WO + adat Sunda</SectionKicker>
          <h1 className="mt-5 text-[70px] font-extrabold leading-[1.02] tracking-[-0.07em]">
            WO dan pilihan adat,
            <span className="text-[#1d56c5]"> dalam satu simulasi.</span>
          </h1>
        </div>
        <p className="mb-2 max-w-[390px] text-[21px] leading-[1.4] text-[#526476]">
          Contoh total menggabungkan paket WO dengan tarif khusus vendor adat.
        </p>
      </div>

      <div className="mt-[52px] overflow-hidden rounded-[30px] border border-[#cddfe9] bg-white shadow-[0_20px_54px_rgba(12,49,82,0.07)]">
        <div className="grid grid-cols-[1.05fr_1fr_1.3fr_1.3fr] items-center bg-[#0a3158] px-8 py-6 text-white">
          <div className="text-[15px] font-extrabold uppercase tracking-[0.14em]">Paket WO</div>
          <div className="text-[15px] font-extrabold uppercase tracking-[0.14em]">Harga WO</div>
          <div className="border-l border-white/20 pl-8">
            <p className="text-[15px] font-extrabold uppercase tracking-[0.14em] text-[#a6e0ff]">Total dengan live</p>
            <p className="mt-1 text-[14px] text-white/60">Tarif adat Rp2.800.000</p>
          </div>
          <div className="border-l border-white/20 pl-8">
            <p className="text-[15px] font-extrabold uppercase tracking-[0.14em] text-[#a6e0ff]">Total tanpa live</p>
            <p className="mt-1 text-[14px] text-white/60">Tarif adat Rp1.800.000</p>
          </div>
        </div>
        {rows.map((row, index) => (
          <div key={row.package} className={`grid grid-cols-[1.05fr_1fr_1.3fr_1.3fr] items-center px-8 py-[27px] ${index < rows.length - 1 ? 'border-b border-[#dce8f1]' : ''} ${index === 1 ? 'bg-[#f2f8fc]' : 'bg-white'}`}>
            <div>
              <p className="text-[26px] font-extrabold tracking-[-0.04em]">{row.package}</p>
              <p className="mt-1 text-[14px] font-semibold text-[#687789]">Wedding Organizer</p>
            </div>
            <p className="text-[20px] font-bold text-[#526476]">{row.wo}</p>
            <p className="border-l border-[#dce8f1] pl-8 text-[34px] font-extrabold tracking-[-0.05em] text-[#1d56c5]">{row.live}</p>
            <p className="border-l border-[#dce8f1] pl-8 text-[34px] font-extrabold tracking-[-0.05em] text-[#147cad]">{row.noLive}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-[1fr_1fr] gap-5">
        <div className="flex items-center gap-4 rounded-[18px] bg-[#e7f3fc] px-6 py-5">
          <span className="grid h-[42px] w-[42px] shrink-0 place-items-center rounded-full bg-[#1d56c5] text-[15px] font-extrabold text-white">01</span>
          <p className="text-[17px] leading-[1.35] text-[#34485b]">Biaya WO mencakup manajemen; vendor independen seperti dekorasi, catering, MUA, dokumentasi, atau hiburan tidak termasuk kecuali disepakati terpisah.</p>
        </div>
        <div className="flex items-center gap-4 rounded-[18px] bg-[#e9f6f7] px-6 py-5">
          <span className="grid h-[42px] w-[42px] shrink-0 place-items-center rounded-full bg-[#147cad] text-[15px] font-extrabold text-white">02</span>
          <p className="text-[17px] leading-[1.35] text-[#34485b]">Tarif adat dan total akhir perlu dikonfirmasi kembali dengan vendor rekanan berdasarkan ketersediaan, jadwal, durasi, transportasi, serta kebutuhan teknis.</p>
        </div>
      </div>
      <SlideFooter number="13" />
    </SlideCanvas>
  );
}
