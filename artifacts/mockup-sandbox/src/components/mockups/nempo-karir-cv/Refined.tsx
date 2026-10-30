import './_group.css';

export function Refined() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-[#e7eaeb]">
      <main className="relative aspect-[4/5] h-full max-h-screen overflow-hidden bg-[#062f4d] text-white">
        <img
          src="/__mockup/images/nempo-karir-cv/hero.jpg"
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(4,39,67,0.82)_0%,rgba(4,39,67,0.55)_48%,rgba(4,39,67,0.08)_100%),linear-gradient(180deg,rgba(4,39,67,0.22)_0%,rgba(4,39,67,0.02)_35%,rgba(4,39,67,0.68)_100%)]" />
        <img
          src="/__mockup/images/nempo-karir-cv/footer.png"
          alt=""
          className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-[30%] w-full object-cover object-[center_60%] opacity-[0.82]"
          style={{
            filter: 'saturate(0.82) brightness(0.94)',
            WebkitMaskImage:
              'linear-gradient(to bottom, transparent 0%, black 24%, black 100%)',
            maskImage:
              'linear-gradient(to bottom, transparent 0%, black 24%, black 100%)',
          }}
        />

        <div className="relative z-10 flex h-full flex-col p-[7.5%]">
          <header className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-[14px] bg-white/95 p-1.5 shadow-[0_8px_18px_rgba(0,0,0,0.2)]">
                <img
                  src="/__mockup/images/nempo-karir-cv/logo.webp"
                  alt="Logo Nempo"
                  className="h-full w-full object-contain"
                />
              </div>
              <div className="border-l border-white/30 pl-3 leading-none">
                <p className="text-[12px] font-extrabold tracking-[0.1em]">
                  NEMPO.ID
                </p>
                <p className="mt-1 text-[9px] font-medium tracking-[0.12em]">
                  <span className="text-[11px] italic">Explore</span> Jawa Barat
                </p>
              </div>
            </div>
            <span className="rounded-full border border-white/25 bg-[#062f4d]/25 px-3 py-1.5 text-[11px] font-black">
              NEMPO KARIR
            </span>
          </header>

          <section className="relative z-10 flex flex-1 flex-col items-center justify-center px-[3%] pb-[7%] text-center">
            <p className="text-[8px] font-black tracking-[0.28em] text-[#ffdd00] sm:text-[10px]">
              PERSIAPAN KARIER
            </p>
            <h1 className="mt-2 max-w-[90%] text-[29px] font-black leading-[0.98] tracking-[-0.04em] drop-shadow-[0_3px_12px_rgba(0,0,0,0.45)] sm:text-[38px]">
              Buat CV
              <br />
              <span className="text-[#ffdd00]">Profesional</span>
            </h1>
            <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-white/25 bg-[#062f4d]/80 px-4 py-2 text-[#062f4d] shadow-[0_8px_24px_rgba(0,0,0,0.2)]">
              <span className="text-[8px] font-black uppercase tracking-[0.12em] text-white sm:text-[9px]">
                Cuma
              </span>
              <span className="text-[20px] font-black leading-none tracking-[-0.04em] text-[#ffdd00] sm:text-[25px]">
                Rp5.000
              </span>
            </div>
            <p className="mt-3 max-w-[76%] text-[9px] font-medium leading-[1.35] text-white/90 drop-shadow-[0_2px_8px_rgba(0,0,0,0.4)] sm:text-[11px]">
              Tampil lebih siap untuk peluang kerja berikutnya.
            </p>

            <div className="mt-3 w-[70%] max-w-[330px] rounded-[3px] bg-[#fffefa] p-3 text-left text-[#263b45] shadow-[0_10px_28px_rgba(0,0,0,0.3)] sm:p-3.5">
              <div className="border-b border-[#d9dfdf] pb-2">
                <h2 className="text-[11px] font-bold leading-tight tracking-[-0.02em] sm:text-[13px]">
                  Rani Kurniawati
                </h2>
                <p className="mt-0.5 text-[6px] font-semibold tracking-[0.04em] text-[#49636b] sm:text-[7px]">
                  ADMINISTRASI &amp; CUSTOMER SERVICE
                </p>
                <p className="mt-1 text-[5.5px] leading-[1.35] text-[#5a6b70] sm:text-[6px]">
                  Garut, Jawa Barat&nbsp; · &nbsp;08xx-xxxx-xxxx&nbsp; ·
                  &nbsp;rani.kurniawati@example.com
                </p>
              </div>

              <div className="mt-2.5 space-y-2">
                <section>
                  <h3 className="mb-0.5 text-[5.5px] font-bold uppercase tracking-[0.1em] text-[#315a63] sm:text-[6px]">
                    Profil
                  </h3>
                  <p className="text-[6px] leading-[1.35] text-[#3e5055] sm:text-[6.5px]">
                    Lulusan Administrasi Perkantoran yang teliti dan terbiasa
                    melayani pelanggan. Mampu mengelola dokumen, mencatat data,
                    serta berkomunikasi dengan sopan melalui tatap muka maupun
                    telepon.
                  </p>
                </section>

                <section>
                  <h3 className="mb-0.5 text-[5.5px] font-bold uppercase tracking-[0.1em] text-[#315a63] sm:text-[6px]">
                    Pengalaman Kerja
                  </h3>
                  <div className="flex items-baseline justify-between gap-2">
                    <p className="text-[6px] font-semibold leading-tight sm:text-[6.5px]">
                      Staf Administrasi — Toko Sinar Jaya, Garut
                    </p>
                    <p className="shrink-0 text-[5px] text-[#65777b] sm:text-[5.5px]">
                      2023–2024
                    </p>
                  </div>
                  <p className="mt-0.5 text-[5.7px] leading-[1.35] text-[#3e5055] sm:text-[6px]">
                    Mencatat transaksi harian, merapikan arsip nota dan
                    membantu menjawab pertanyaan pelanggan di toko.
                  </p>
                </section>

                <section>
                  <h3 className="mb-0.5 text-[5.5px] font-bold uppercase tracking-[0.1em] text-[#315a63] sm:text-[6px]">
                    Pendidikan
                  </h3>
                  <div className="flex items-baseline justify-between gap-2">
                    <p className="text-[6px] font-semibold leading-tight sm:text-[6.5px]">
                      SMK Negeri 1 Garut
                    </p>
                    <p className="shrink-0 text-[5px] text-[#65777b] sm:text-[5.5px]">
                      2020–2023
                    </p>
                  </div>
                  <p className="text-[5.7px] leading-[1.35] text-[#3e5055] sm:text-[6px]">
                    Otomatisasi dan Tata Kelola Perkantoran
                  </p>
                </section>

                <section>
                  <h3 className="mb-0.5 text-[5.5px] font-bold uppercase tracking-[0.1em] text-[#315a63] sm:text-[6px]">
                    Keahlian
                  </h3>
                  <p className="text-[5.7px] leading-[1.35] text-[#3e5055] sm:text-[6px]">
                    Microsoft Word &amp; Excel · Pengarsipan · Layanan pelanggan
                    · Komunikasi · Teliti
                  </p>
                </section>
              </div>
            </div>
          </section>

          <footer className="absolute bottom-[12%] right-[7.5%] z-20 flex items-center gap-2.5">
            <div className="rounded-full border border-white/25 bg-[#062f4d]/80 px-2.5 py-1.5 text-[8px] font-bold text-white">
              WA · 0857 2498 1356
            </div>
            <div className="rounded-full bg-[#062f4d]/75 px-3 py-1.5 text-[9px] font-bold text-[#ffdd00]">
              @nempo.id
            </div>
          </footer>
        </div>
      </main>
    </div>
  );
}
