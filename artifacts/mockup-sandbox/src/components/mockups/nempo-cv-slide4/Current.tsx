import './_group.css';

const assetBase = '/__mockup/images/nempo-cv-slide4/';

export function Current() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-[#d9dad7] p-4">
      <main className="relative flex aspect-[4/5] w-full max-w-[620px] items-center justify-center overflow-hidden bg-[#ecebe6] shadow-xl">
        <article
          aria-label="Contoh CV editorial monokrom, kode template Pemula-02"
          className="relative flex aspect-[0.75] w-[88%] max-h-[94%] overflow-hidden border border-[#d2d0ca] bg-[#efeee9] text-left text-[#252629] shadow-[0_12px_30px_rgba(0,0,0,0.2)]"
          style={{
            backgroundImage:
              'radial-gradient(circle at 18% 16%, rgba(45,43,40,0.08) 0 0.6px, transparent 0.9px), radial-gradient(circle at 82% 72%, rgba(45,43,40,0.06) 0 0.7px, transparent 1px), repeating-linear-gradient(0deg, rgba(80,76,69,0.018) 0 1px, transparent 1px 4px)',
            backgroundSize: '11px 13px, 17px 19px, auto',
          }}
        >
          <span className="pointer-events-none absolute left-[6%] top-[5%] h-2 w-2 border-l border-t border-dashed border-[#74716e]/50" />
          <span className="pointer-events-none absolute bottom-[5%] right-[6%] h-2 w-2 border-b border-r border-dashed border-[#74716e]/50" />

          <div className="relative grid h-full w-full grid-cols-[0.94fr_1.06fr] gap-3 p-3 sm:gap-3.5 sm:p-3.5">
            <div className="flex min-h-0 flex-col justify-between gap-1">
              <div className="relative mx-auto mt-1 aspect-[0.92] w-[74%] max-w-[118px]">
                <span className="absolute -right-2 top-[22%] z-0 text-[40px] font-black leading-none tracking-[-0.08em] text-transparent [-webkit-text-stroke:0.7px_rgba(65,63,61,0.28)]">
                  RK
                </span>
                <div className="absolute inset-0 overflow-hidden bg-[#d8d6d1]">
                  <img
                    src={`${assetBase}nempo-karir-hero.jpg`}
                    alt="Foto profil Rani Kurniawati dalam CV"
                    className="h-full w-full object-cover grayscale"
                    style={{
                      objectPosition: '72% 30%',
                      transform: 'scale(1.42)',
                      transformOrigin: '68% 30%',
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-white/10" />
                </div>
                <span className="absolute -left-1 -top-1 h-2 w-2 border-l border-t border-dashed border-[#77736f]/70" />
                <span className="absolute -bottom-1 -right-1 h-2 w-2 border-b border-r border-dashed border-[#77736f]/70" />
                <p className="absolute -bottom-2 left-1 z-10 whitespace-nowrap font-serif text-[13px] italic leading-none text-[#a32348]">
                  Rani Kurniawati
                </p>
              </div>

              <section className="pt-1">
                <h2 className="text-[12px] font-black leading-[0.98] tracking-[-0.045em] sm:text-[14px]">
                  Rani Kurniawati
                </h2>
                <p className="mt-1 text-[5px] font-medium italic tracking-[0.08em] text-[#5e5c59] sm:text-[5.5px]">
                  STAF ADMINISTRASI
                </p>
              </section>

              <section className="border-t border-[#77736f]/30 pt-1.5">
                <p className="text-[5px] leading-[1.32] text-[#444442] sm:text-[5.5px]">
                  Lulusan Administrasi Perkantoran yang teliti dan komunikatif.
                  Terbiasa mengelola dokumen, mencatat data, dan membantu
                  pelanggan. Mampu bekerja mandiri maupun bersama tim, cepat
                  beradaptasi, serta siap belajar hal baru.
                </p>
              </section>

              <section className="grid grid-cols-2 gap-x-1.5 gap-y-1 border-t border-[#77736f]/30 pt-1.5">
                {[
                  ['P', '08xx-xxxx-xxxx'],
                  ['@', 'rani.kurniawati@example.com'],
                  ['⌖', 'Garut, Jawa Barat'],
                  ['↗', 'rani-kurniawati.example'],
                ].map(([icon, value]) => (
                  <div key={icon} className="flex min-w-0 items-center gap-1">
                    <span className="flex h-3 w-3 shrink-0 items-center justify-center bg-[#a32348] text-[5px] font-black text-white">
                      {icon}
                    </span>
                    <span className="truncate text-[4.2px] leading-tight text-[#454442] sm:text-[4.7px]">
                      {value}
                    </span>
                  </div>
                ))}
              </section>

              <section className="border-t border-[#77736f]/35 pt-1.5">
                <h3 className="mb-1 text-[5.5px] font-black uppercase tracking-[0.09em]">
                  Pengalaman
                </h3>
                <div className="space-y-1.5">
                  <div>
                    <p className="text-[5px] font-bold leading-tight sm:text-[5.5px]">
                      Staf Administrasi{' '}
                      <span className="font-normal text-[#a32348]">(2023–2024)</span>
                    </p>
                    <p className="mt-0.5 text-[4.2px] leading-[1.25] text-[#555350] sm:text-[4.6px]">
                      Toko Sinar Jaya, Garut · Arsip, transaksi harian, dokumen,
                      dan layanan pelanggan.
                    </p>
                  </div>
                  <div>
                    <p className="text-[5px] font-bold leading-tight sm:text-[5.5px]">
                      Asisten Administrasi{' '}
                      <span className="font-normal text-[#a32348]">(2022)</span>
                    </p>
                    <p className="mt-0.5 text-[4.2px] leading-[1.25] text-[#555350] sm:text-[4.6px]">
                      Praktik kerja lapangan · Input data, penataan berkas, dan
                      dokumen harian.
                    </p>
                  </div>
                  <div>
                    <p className="text-[5px] font-bold leading-tight sm:text-[5.5px]">
                      Relawan Administrasi{' '}
                      <span className="font-normal text-[#a32348]">(2021)</span>
                    </p>
                    <p className="mt-0.5 text-[4.2px] leading-[1.25] text-[#555350] sm:text-[4.6px]">
                      Membantu pencatatan dan persiapan kegiatan warga.
                    </p>
                  </div>
                </div>
              </section>
            </div>

            <div className="flex min-h-0 flex-col justify-between gap-1">
              <section>
                <h3 className="mb-1 text-[5.5px] font-black uppercase tracking-[0.09em] sm:text-[6px]">
                  Keahlian Utama
                </h3>
                <p className="text-[4.7px] leading-[1.35] text-[#4c4a47] sm:text-[5.1px]">
                  Administrasi · Pengelolaan arsip · Input data · Layanan
                  pelanggan · Dokumentasi
                </p>
              </section>

              <section className="border-t border-[#77736f]/35 pt-1.5">
                <h3 className="mb-1 text-[5.5px] font-black uppercase tracking-[0.09em] sm:text-[6px]">
                  Core Skills
                </h3>
                <ul className="space-y-0.5 text-[4.7px] leading-[1.2] text-[#444442] sm:text-[5.1px]">
                  {[
                    'Komunikasi dan kerja tim',
                    'Teliti dan terorganisir',
                    'Manajemen waktu',
                    'Adaptif dan bertanggung jawab',
                  ].map((skill) => (
                    <li key={skill} className="flex gap-1">
                      <span className="text-[#a32348]">○</span>
                      <span>{skill}</span>
                    </li>
                  ))}
                </ul>
              </section>

              <section className="border-t border-[#77736f]/35 pt-1.5">
                <h3 className="mb-1 text-[5.5px] font-black uppercase tracking-[0.09em] sm:text-[6px]">
                  Bahasa
                </h3>
                <div className="space-y-0.5">
                  {[
                    ['Indonesia', 5],
                    ['Sunda', 4],
                    ['Inggris dasar', 2],
                  ].map(([language, level]) => (
                    <div key={language} className="flex items-center justify-between gap-1">
                      <span className="text-[4.7px] text-[#444442] sm:text-[5.1px]">
                        {language}
                      </span>
                      <span className="flex gap-[2px]" aria-hidden="true">
                        {Array.from({ length: 5 }, (_, index) => (
                          <span
                            key={index}
                            className={`h-1 w-1 rounded-full ${
                              index < Number(level) ? 'bg-[#a32348]' : 'bg-[#c7c3bd]'
                            }`}
                          />
                        ))}
                      </span>
                    </div>
                  ))}
                </div>
              </section>

              <section className="border-t border-[#77736f]/35 pt-1.5">
                <h3 className="mb-1 text-[5.5px] font-black uppercase tracking-[0.09em] sm:text-[6px]">
                  Pendidikan
                </h3>
                <div className="border-l border-dashed border-[#a32348]/60 pl-1.5">
                  <div className="flex items-start gap-1">
                    <span className="text-[5px] font-black leading-tight text-[#a32348]">
                      20<br />23
                    </span>
                    <div>
                      <p className="text-[4.8px] font-bold leading-tight sm:text-[5.2px]">
                        SMK Negeri 1 Garut
                      </p>
                      <p className="text-[4.2px] leading-[1.25] text-[#555350] sm:text-[4.6px]">
                        Otomatisasi dan Tata Kelola Perkantoran
                      </p>
                      <p className="mt-0.5 text-[4.2px] italic text-[#77736f] sm:text-[4.5px]">
                        Prestasi: siswa teladan
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              <section className="border-t border-[#77736f]/35 pt-1.5">
                <h3 className="mb-1 text-[5.5px] font-black uppercase tracking-[0.09em] sm:text-[6px]">
                  Software Skills
                </h3>
                <div className="grid grid-cols-4 gap-1 text-center">
                  {[
                    ['W', 'Word'],
                    ['X', 'Excel'],
                    ['G', 'Docs'],
                    ['C', 'Canva'],
                  ].map(([mark, tool]) => (
                    <div key={tool}>
                      <p className="text-[10px] font-black leading-none text-[#41403e]">
                        {mark}
                      </p>
                      <p className="mt-0.5 text-[3.8px] leading-tight text-[#686560] sm:text-[4.2px]">
                        {tool}
                      </p>
                    </div>
                  ))}
                </div>
              </section>

              <section className="border-t border-[#77736f]/35 pt-1.5">
                <h3 className="mb-1 text-[5.5px] font-black uppercase tracking-[0.09em] sm:text-[6px]">
                  Pernyataan
                </h3>
                <p className="text-[4.2px] leading-[1.3] text-[#555350] sm:text-[4.6px]">
                  Saya menyatakan informasi dalam CV ini benar dan dapat
                  dipertanggungjawabkan.
                </p>
                <p className="mt-2 text-right font-serif text-[7px] italic text-[#a32348]">
                  Rani Kurniawati
                </p>
              </section>

              <div className="flex items-center justify-between border-t border-[#77736f]/35 pt-1">
                <span className="text-[4px] font-medium uppercase tracking-[0.06em] text-[#74716d]">
                  CV PEMULA · 02
                </span>
                <span className="text-[4px] font-black tracking-[0.1em] text-[#a32348]">
                  NEMPO KARIR
                </span>
              </div>
            </div>
          </div>
        </article>
      </main>
    </div>
  );
}
