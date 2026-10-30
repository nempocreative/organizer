import './_group.css';

const assetBase = '/__mockup/images/nempo-cv-slide4/';
const red = '#a32348';

const experience = [
  {
    role: 'Staf Administrasi',
    date: '2023–2024',
    place: 'Toko Sinar Jaya · Garut',
    detail:
      'Mengelola arsip dan transaksi harian, memeriksa kelengkapan dokumen, serta membantu pelanggan mendapatkan informasi produk.',
  },
  {
    role: 'Asisten Administrasi',
    date: '2022',
    place: 'Praktik kerja lapangan · Garut',
    detail:
      'Menginput data, menata berkas, menyiapkan dokumen, dan membantu kebutuhan administrasi harian.',
  },
  {
    role: 'Relawan Administrasi',
    date: '2021',
    place: '',
    detail: 'Membantu pencatatan dan persiapan kegiatan warga di lingkungan setempat.',
  },
];

const technicalSkills = ['Microsoft Office', 'Administrasi', 'Input data', 'Pengarsipan', 'Layanan pelanggan'];
const softSkills = ['Komunikasi dan kerja tim', 'Teliti dan terorganisir', 'Manajemen waktu', 'Adaptif dan bertanggung jawab'];
const software = ['Word', 'Excel', 'Google Docs', 'Canva'];

function SectionTitle({ children }: { children: string }) {
  return (
    <div className="mb-[3px] flex items-center gap-1">
      <span className="h-[1px] w-[9px] shrink-0" style={{ backgroundColor: red }} />
      <h3 className="text-[5.2px] font-extrabold uppercase leading-none tracking-[0.12em] text-[#393835] sm:text-[6px]">
        {children}
      </h3>
    </div>
  );
}

export function Refined() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-[#c9c9c6] p-2">
      <main className="relative flex aspect-[4/5] w-full max-w-[620px] items-center justify-center overflow-hidden bg-[#dededb] shadow-xl">
        <div
          className="pointer-events-none absolute inset-0 opacity-25"
          style={{
            backgroundImage:
              'radial-gradient(circle at 18% 16%, rgba(45,43,40,0.18) 0 0.55px, transparent 0.9px), radial-gradient(circle at 82% 72%, rgba(45,43,40,0.12) 0 0.65px, transparent 1px), repeating-linear-gradient(0deg, rgba(80,76,69,0.045) 0 1px, transparent 1px 4px)',
            backgroundSize: '9px 11px, 15px 17px, auto',
          }}
        />
        <article
          aria-label="Contoh CV Rani Kurniawati, template Pemula-02"
          className="relative flex aspect-[0.75] w-[86%] max-h-[94%] overflow-hidden border border-[#bdbdb9] bg-[#e5e5e2] text-left text-[#302f2d] shadow-[0_12px_30px_rgba(0,0,0,0.22)]"
          style={{
            backgroundImage:
              'radial-gradient(circle at 18% 16%, rgba(45,43,40,0.06) 0 0.55px, transparent 0.9px), radial-gradient(circle at 82% 72%, rgba(45,43,40,0.05) 0 0.65px, transparent 1px), repeating-linear-gradient(0deg, rgba(80,76,69,0.012) 0 1px, transparent 1px 4px)',
            backgroundSize: '10px 12px, 16px 18px, auto',
          }}
        >
          <span className="pointer-events-none absolute left-[5%] top-[4%] h-2 w-2 border-l border-t border-dashed border-[#6e6d69]/60" />
          <span className="pointer-events-none absolute bottom-[4%] right-[5%] h-2 w-2 border-b border-r border-dashed border-[#6e6d69]/60" />

          <div className="relative grid h-full w-full grid-cols-[0.92fr_1.08fr] gap-2.5 p-2.5 sm:gap-3 sm:p-3">
            <div className="flex min-h-0 flex-col justify-between gap-1">
              <div className="flex shrink-0 flex-col">
                <div className="relative mx-auto aspect-[0.72] w-[74%] shrink-0">
                  <span className="absolute -right-[18%] top-[18%] z-0 text-[42px] font-black leading-none tracking-[-0.09em] text-transparent sm:text-[50px] [-webkit-text-stroke:0.7px_rgba(65,63,61,0.32)]">
                    RK
                  </span>
                  <div className="absolute inset-0 z-10 overflow-hidden bg-[#c7c7c3]">
                    <img
                      src={`${assetBase}nempo-karir-hero.jpg`}
                      alt="Foto profil Rani Kurniawati"
                      className="h-full w-full object-cover grayscale"
                      style={{ objectPosition: '72% 25%', transform: 'scale(1.62)', transformOrigin: '68% 25%' }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-white/10" />
                  </div>
                  <span className="absolute -left-1 -top-1 z-20 h-2 w-2 border-l border-t border-dashed border-[#6e6d69]/75" />
                  <span className="absolute bottom-0 right-0 z-20 h-2 w-2 border-b border-r border-dashed border-[#6e6d69]/75" />
                </div>

                <section className="mt-2 border-b border-[#77736f]/40 pb-[5px]">
                  <h1 className="whitespace-nowrap text-[12px] font-black leading-none tracking-[-0.045em] text-[#282826] sm:text-[15px]">
                    Rani Kurniawati
                  </h1>
                  <p className="mt-1 text-[5px] font-bold uppercase tracking-[0.15em] text-[#5c5b56] sm:text-[6px]">
                    Staf Administrasi
                  </p>
                </section>
              </div>

              <section>
                <SectionTitle>Tentang saya</SectionTitle>
                <p className="text-[4.7px] leading-[1.31] text-[#44433f] sm:text-[5.6px]">
                  Lulusan Administrasi Perkantoran yang teliti dan komunikatif. Terbiasa mengelola dokumen, mencatat data, dan membantu pelanggan. Mampu bekerja mandiri maupun bersama tim, cepat beradaptasi, serta siap belajar hal baru.
                </p>
              </section>

              <section className="border-t border-dashed border-[#77736f]/45 pt-[5px]">
                <SectionTitle>Kontak</SectionTitle>
                <div className="grid grid-cols-2 gap-x-1.5 gap-y-[3px]">
                  {[
                    ['T', '08xx-xxxx-xxxx'],
                    ['@', 'rani.kurniawati@example.com'],
                    ['L', 'Garut, Jawa Barat'],
                    ['↗', 'rani-kurniawati.example'],
                  ].map(([icon, value]) => (
                    <div key={icon} className="flex min-w-0 items-center gap-1.5">
                      <span className="flex h-[9px] w-[9px] shrink-0 items-center justify-center text-[4px] font-black text-white" style={{ backgroundColor: red }}>
                        {icon}
                      </span>
                      <span className="truncate text-[4.1px] leading-tight text-[#454440] sm:text-[4.8px]">{value}</span>
                    </div>
                  ))}
                </div>
              </section>

              <section className="border-t border-dashed border-[#77736f]/45 pt-[5px]">
                <SectionTitle>Pengalaman kerja</SectionTitle>
                <div className="space-y-[5px]">
                  {experience.map((item) => (
                    <div key={item.role} className="relative border-l border-[#a32348]/55 pl-[5px]">
                      <p className="text-[4.6px] font-extrabold leading-tight text-[#30302e] sm:text-[5.3px]">
                        {item.role} <span className="font-semibold text-[#a32348]">{item.date}</span>
                      </p>
                      {item.place && <p className="mt-[1px] text-[3.9px] leading-tight text-[#706e68] sm:text-[4.4px]">{item.place}</p>}
                      <p className="mt-[2px] text-[4.1px] leading-[1.2] text-[#55534f] sm:text-[4.7px]">{item.detail}</p>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            <div className="flex min-h-0 flex-col justify-between gap-1 border-l border-dashed border-[#77736f]/55 pl-2 sm:pl-2.5">
              <section>
                <SectionTitle>Keahlian teknis</SectionTitle>
                <div className="grid grid-cols-2 gap-x-1 gap-y-[2px] text-[4.5px] leading-[1.2] text-[#4c4a47] sm:text-[5.2px]">
                  {technicalSkills.map((skill) => (
                    <span key={skill}>{skill}</span>
                  ))}
                </div>
              </section>

              <section className="border-t border-dashed border-[#77736f]/45 pt-[5px]">
                <SectionTitle>Soft skills</SectionTitle>
                <ul className="space-y-[2px] text-[4.4px] leading-[1.2] text-[#44433f] sm:text-[5.1px]">
                  {softSkills.map((skill) => <li key={skill} className="flex gap-1"><span className="text-[#a32348]">○</span><span>{skill}</span></li>)}
                </ul>
              </section>

              <section className="border-t border-dashed border-[#77736f]/45 pt-[5px]">
                <SectionTitle>Bahasa & minat</SectionTitle>
                <ul className="space-y-[2px] text-[4.4px] leading-[1.2] text-[#44433f] sm:text-[5.1px]">
                  {['Indonesia', 'Sunda', 'Inggris dasar'].map((language) => (
                    <li key={language} className="flex gap-1">
                      <span className="text-[#a32348]">○</span>
                      <span>{language}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-[3px] text-[4.1px] leading-[1.25] text-[#66645f] sm:text-[4.8px]">
                  Minat: Membaca · desain · kegiatan sosial
                </p>
              </section>

              <section className="border-t border-dashed border-[#77736f]/45 pt-[5px]">
                <SectionTitle>Pendidikan</SectionTitle>
                <div className="flex items-start gap-1.5">
                  <span className="border-r border-[#a32348] pr-1 text-[4.8px] font-black leading-[1.05] text-[#a32348] sm:text-[5.5px]">20<br />23</span>
                  <div>
                    <p className="text-[4.8px] font-extrabold leading-tight text-[#30302e] sm:text-[5.5px]">SMK Negeri 1 Garut</p>
                    <p className="mt-[2px] text-[4.1px] leading-[1.2] text-[#55534f] sm:text-[4.8px]">Otomatisasi dan Tata Kelola Perkantoran · 2020–2023</p>
                    <p className="mt-[2px] text-[4px] leading-[1.2] text-[#696760] sm:text-[4.5px]">Prestasi: Siswa teladan · Lulus dengan baik</p>
                  </div>
                </div>
              </section>

              <section className="border-t border-dashed border-[#77736f]/45 pt-[5px]">
                <SectionTitle>Pelatihan</SectionTitle>
                <div className="space-y-[2px] text-[4.2px] leading-[1.2] text-[#55534f] sm:text-[4.9px]">
                  <p><span className="font-bold text-[#30302e]">Microsoft Excel Dasar</span> · 2023</p>
                  <p><span className="font-bold text-[#30302e]">Pelayanan Pelanggan</span> · 2022</p>
                </div>
              </section>

              <section className="border-t border-dashed border-[#77736f]/45 pt-[5px]">
                <SectionTitle>Proyek & organisasi</SectionTitle>
                <p className="text-[4.1px] leading-[1.22] text-[#55534f] sm:text-[4.8px]">
                  Membantu menyusun arsip kegiatan sekolah dan menjadi panitia administrasi acara kelas.
                </p>
              </section>

              <section className="border-t border-dashed border-[#77736f]/45 pt-[5px]">
                <SectionTitle>Software</SectionTitle>
                <div className="grid grid-cols-4 gap-1 text-center">
                  {software.map((tool) => (
                    <div key={tool}>
                      <p className="text-[10px] font-black leading-none text-[#41403e] sm:text-[12px]">{tool[0]}</p>
                      <p className="mt-[2px] text-[3.8px] leading-tight text-[#686560] sm:text-[4.4px]">{tool}</p>
                    </div>
                  ))}
                </div>
              </section>

              <footer className="flex items-center justify-between border-t border-[#77736f]/45 pt-[5px] text-[3.8px] font-bold uppercase tracking-[0.08em] text-[#77736f] sm:text-[4.4px]">
                <span>Template CV · PEMULA-02</span>
                <span className="text-[#a32348]">Nempo Karir</span>
              </footer>
            </div>
          </div>
        </article>
      </main>
    </div>
  );
}
