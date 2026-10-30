import './_group.css';

const YEAR = 2027;

const months = [
  'Januari',
  'Februari',
  'Maret',
  'April',
  'Mei',
  'Juni',
  'Juli',
  'Agustus',
  'September',
  'Oktober',
  'November',
  'Desember',
];

const weekdays = ['MIN', 'SEN', 'SEL', 'RAB', 'KAM', 'JUM', 'SAB'];

function getMonthDates(monthIndex: number) {
  const firstWeekday = new Date(Date.UTC(YEAR, monthIndex, 1)).getUTCDay();
  const daysInMonth = new Date(
    Date.UTC(YEAR, monthIndex + 1, 0),
  ).getUTCDate();

  return Array.from({ length: 42 }, (_, cellIndex) => {
    const day = cellIndex - firstWeekday + 1;
    return day < 1 || day > daysInMonth ? null : day;
  });
}

export function PhotoDocumentation() {
  return (
    <div className="ggs-calendar-preview flex min-h-screen items-center justify-center bg-[#f8edf1] p-4">
      <main
        className="relative isolate aspect-[5/7] h-[min(92vh,900px)] w-auto max-w-full overflow-hidden bg-[#FC46AA] text-[#561535] shadow-[0_24px_70px_rgba(63,35,47,0.22)] max-[640px]:h-auto max-[640px]:w-full"
        style={{
          containerType: 'inline-size',
          fontFamily: "'DM Sans', 'Inter', sans-serif",
        }}
        aria-label="Kalender GGS Beauty tahun 2027 dengan dokumentasi karyawan dan layanan, seluruh dua belas bulan dalam satu lembar"
      >
        <div className="absolute inset-[2.1%] flex flex-col overflow-hidden rounded-[3cqi] border border-white/75 bg-[#fff9f7] p-[2.15%]">
          <header className="flex shrink-0 items-center justify-between gap-[2%] rounded-[2.2cqi] bg-[#561535] px-[3%] py-[2.1%] text-white">
            <div className="flex min-w-0 items-center gap-[2.5%]">
              <img
                src="/__mockup/images/ggs-2027-calendar/ggs-beauty-logo.png"
                alt="Logo GGS Beauty"
                className="aspect-square w-[9.5cqi] shrink-0 rounded-full border border-[#f3c85f]/80 bg-white object-contain"
                draggable={false}
              />
              <div className="min-w-0">
                <p className="text-[2.4cqi] font-black uppercase leading-tight tracking-[0.12em]">
                  GGS Beauty
                </p>
                <p className="mt-[1%] text-[1.8cqi] font-semibold leading-tight tracking-[0.04em] text-white/80">
                  GROOMING IS BETTER
                </p>
              </div>
            </div>
            <div className="shrink-0 text-right">
              <p className="text-[2.1cqi] font-bold uppercase leading-tight tracking-[0.16em] text-[#f5c96a]">
                Kalender Beauty
              </p>
              <p className="text-[7.5cqi] font-black leading-[0.9] tracking-[-0.06em]">
                {YEAR}
              </p>
            </div>
          </header>

          <section
            aria-label="Dokumentasi karyawan dan layanan GGS Beauty"
            className="mt-[1.45%] grid h-[13%] shrink-0 grid-cols-[0.8fr_1.2fr] gap-[1.2%]"
          >
            <figure className="relative min-h-0 overflow-hidden rounded-[1.8cqi] bg-[#561535]">
              <img
                src="/__mockup/images/ggs-2027-calendar/employee-documentation.webp"
                alt="Karyawan GGS Beauty sedang memberikan layanan spa"
                className="h-full w-full object-cover"
                draggable={false}
              />
              <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#260a19]/90 to-transparent px-[4%] pb-[3%] pt-[10%] text-white">
                <span className="block text-[1.55cqi] font-black uppercase tracking-[0.16em] text-[#ffd46c]">
                  Dokumentasi
                </span>
                <span className="mt-[1%] block text-[2.2cqi] font-black leading-tight">
                  Karyawan GGS
                </span>
              </figcaption>
            </figure>
            <figure className="relative min-h-0 overflow-hidden rounded-[1.8cqi] bg-[#561535]">
              <img
                src="/__mockup/images/ggs-2027-calendar/service-documentation.webp"
                alt="Proses perawatan spa untuk pelanggan GGS Beauty"
                className="h-full w-full object-cover"
                draggable={false}
              />
              <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#260a19]/90 to-transparent px-[4%] pb-[3%] pt-[10%] text-white">
                <span className="block text-[1.55cqi] font-black uppercase tracking-[0.16em] text-[#ffd46c]">
                  Momen Perawatan
                </span>
                <span className="mt-[1%] block text-[2.2cqi] font-black leading-tight">
                  Beauty &amp; Spa
                </span>
              </figcaption>
            </figure>
          </section>

          <div
            className="mt-[1.25%] grid min-h-0 flex-1 grid-cols-3 grid-rows-4 gap-[1%]"
            aria-label="Dua belas bulan kalender 2027"
          >
            {months.map((month, monthIndex) => (
              <section
                key={month}
                aria-label={`${month} ${YEAR}`}
                className="flex min-h-0 flex-col rounded-[1.8cqi] border border-[#efd8e0] bg-white px-[3.6%] pb-[2.2%] pt-[2.5%] shadow-[0_1px_3px_rgba(86,21,53,0.08)]"
              >
                <h2 className="mb-[1.8%] border-b border-[#f2dce5] pb-[1.8%] text-[2.55cqi] font-black uppercase leading-none tracking-[0.04em] text-[#a90e59]">
                  {month}
                </h2>
                <div className="mb-[1.5%] grid grid-cols-7">
                  {weekdays.map((weekday, weekdayIndex) => (
                    <span
                      key={`${month}-${weekday}`}
                      className={`text-center text-[1.55cqi] font-black leading-none tracking-[-0.04em] ${
                        weekdayIndex === 0
                          ? 'text-[#d92875]'
                          : 'text-[#8b6a78]'
                      }`}
                    >
                      {weekday}
                    </span>
                  ))}
                </div>
                <div className="grid min-h-0 flex-1 grid-cols-7 grid-rows-6">
                  {getMonthDates(monthIndex).map((day, cellIndex) => (
                    <span
                      key={`${month}-${cellIndex}`}
                      aria-hidden={day === null}
                      className={`grid place-items-center text-[1.8cqi] font-semibold leading-none tabular-nums ${
                        day === null
                          ? ''
                          : cellIndex % 7 === 0
                            ? 'font-extrabold text-[#d92875]'
                            : 'text-[#452e3a]'
                      }`}
                    >
                      {day}
                    </span>
                  ))}
                </div>
              </section>
            ))}
          </div>

          <figure className="relative mt-[1.35%] h-[10%] shrink-0 overflow-hidden rounded-[1.8cqi] bg-[#561535]">
            <img
              src="/__mockup/images/ggs-2027-calendar/storefront-documentation.webp"
              alt="Tampak depan GGS Beauty & Spa"
              className="h-full w-full object-cover"
              draggable={false}
            />
            <div
              aria-hidden="true"
              className="absolute inset-y-0 right-0 w-[48%] bg-gradient-to-l from-[#561535] via-[#561535]/95 to-[#561535]/10"
            />
            <figcaption className="absolute inset-y-0 right-0 flex w-[44%] flex-col justify-center px-[3%] text-white">
              <span className="text-[1.55cqi] font-black uppercase tracking-[0.16em] text-[#f5c96a]">
                Sampai jumpa
              </span>
              <span className="mt-[1.5%] text-[2.65cqi] font-black leading-tight">
                di GGS Beauty
              </span>
              <span className="mt-[1%] text-[1.65cqi] font-semibold tracking-[0.12em] text-white/75">
                GROOMING IS BETTER
              </span>
            </figcaption>
          </figure>

          <footer className="mt-[1.2%] flex shrink-0 items-center justify-between gap-2 px-[0.5%] text-[1.65cqi] font-bold leading-none text-[#765260]">
            <span className="inline-flex items-center gap-[1.2cqi]">
              <span
                aria-hidden="true"
                className="h-[1.8cqi] w-[1.8cqi] rounded-full bg-[#d92875]"
              />
              Minggu
            </span>
            <span className="tracking-[0.1em]">GGS BEAUTY · 50 × 70 CM</span>
          </footer>
        </div>
      </main>
    </div>
  );
}
