import "./_group.css";
import { BookOpenText, FileText, Palette, Table2 } from "lucide-react";
import { FeedStage } from "./FeedStage";

const assetBase = "/__mockup/images/nempo-feed-slide7/";

const slideFourSoftware = [
  { label: "Word", Icon: FileText, color: "#2b579a" },
  { label: "Excel", Icon: Table2, color: "#217346" },
  { label: "Google Docs", Icon: BookOpenText, color: "#4285f4" },
  { label: "Canva", Icon: Palette, color: "#00a8cc" },
];

function SlideSevenCv() {
  return (
    <article
      aria-label="Contoh CV Rani Kurniawati"
      className="relative translate-y-2 flex aspect-[0.75] w-[86%] max-w-[430px] overflow-hidden border border-[#e5d8c8] bg-[#fffdf8] text-left text-[#273b3d] shadow-[0_12px_30px_rgba(0,0,0,0.3)] max-[640px]:aspect-[0.82] max-[640px]:w-[94%]"
    >
      <div className="flex h-full w-full flex-col">
        <header className="relative grid min-h-0 grid-cols-[1fr_0.25fr] items-center gap-2.5 overflow-hidden bg-[#294a49] px-3 py-3 text-white sm:gap-3 sm:px-4 sm:py-4">
          <span
            className="pointer-events-none absolute -right-3 -top-8 h-24 w-24 rounded-full border border-[#e8bd78]/20"
            aria-hidden="true"
          />
          <span
            className="pointer-events-none absolute -right-1 -top-6 h-16 w-16 rounded-full border border-[#e8bd78]/25"
            aria-hidden="true"
          />
          <div className="relative z-10 min-w-0">
            <p className="mb-1 text-[4px] font-bold uppercase tracking-[0.2em] text-[#e8bd78] sm:text-[4.8px]">
              Curriculum Vitae
            </p>
            <h2 className="text-[14px] font-black leading-none tracking-[-0.045em] sm:text-[17px]">
              Rani Kurniawati
            </h2>
            <p className="mt-1 text-[5px] font-semibold uppercase tracking-[0.16em] text-[#d9e5dd] sm:text-[6px]">
              Staf Administrasi
            </p>
            <div className="mt-2 grid grid-cols-2 items-center gap-x-2 gap-y-1 text-[5px] leading-none text-white/80 sm:text-[5.8px]">
              <span className="min-w-0">08xx-xxxx-xxxx</span>
              <span className="min-w-0 truncate">rani.kurniawati@example.com</span>
              <span className="min-w-0">Garut, Jawa Barat</span>
            </div>
          </div>
          <div className="relative z-10 aspect-square w-full overflow-hidden rounded-full border-2 border-[#e8bd78] bg-[#e7ddd0] p-[2px]">
            <img
              src={`${assetBase}nempo-karir-hero.jpg`}
              alt="Foto profil Rani Kurniawati"
              className="h-full w-full rounded-full object-cover"
              style={{
                objectPosition: "72% 25%",
                transform: "scale(1.5)",
                transformOrigin: "68% 25%",
              }}
            />
          </div>
        </header>

        <div className="grid min-h-0 flex-1 grid-cols-[1.18fr_0.82fr] gap-2.5 p-2.5 sm:gap-3 sm:p-3">
          <div className="grid min-h-0 grid-rows-[1.35fr_0.65fr_1fr] gap-2 max-[640px]:grid-rows-[1.2fr_0.72fr_1.18fr]">
            <section className="flex min-h-0 flex-col rounded-[5px] border border-[#e8dfd3] bg-white/80 p-2 max-[640px]:overflow-hidden">
              <div className="mb-2 flex min-h-2 items-center gap-1.5 border-b border-[#e8dfd3] pb-1.5">
                <span className="h-2 w-2 rounded-full bg-[#c47b4b]" />
                <h3 className="text-[6px] font-black uppercase leading-none tracking-[0.12em] text-[#294a49] sm:text-[7px]">
                  Pengalaman kerja
                </h3>
                <span className="ml-auto flex min-h-2 items-center text-[4.8px] font-bold leading-none text-[#a86b43] sm:text-[5.5px]">
                  2021—2024
                </span>
              </div>
              <div className="relative ml-[3px] flex min-h-0 flex-1 flex-col justify-between border-l border-[#d9c5ab] pl-3 max-[640px]:justify-start max-[640px]:gap-2">
                <div className="relative">
                  <span className="absolute -left-[15px] top-0.5 h-2 w-2 rounded-full border border-white bg-[#c47b4b]" />
                  <p className="text-[5.5px] font-bold leading-tight text-[#294a49] sm:text-[6.3px]">
                    Staf Administrasi <span className="text-[#a86b43]">· 2023–2024</span>
                  </p>
                  <p className="mt-0.5 text-[4.8px] italic text-[#7d7971] sm:text-[5.5px]">
                    Toko Sinar Jaya · Garut
                  </p>
                  <p className="mt-1 text-[5px] leading-[1.25] text-[#555a55] sm:text-[5.8px]">
                    Mengelola arsip, transaksi, rekap, dan layanan pelanggan.
                  </p>
                </div>
                <div className="relative">
                  <span className="absolute -left-[15px] top-0.5 h-2 w-2 rounded-full border border-white bg-[#c47b4b]" />
                  <p className="text-[5.5px] font-bold leading-tight text-[#294a49] sm:text-[6.3px]">
                    Asisten Administrasi <span className="text-[#a86b43]">· 2022</span>
                  </p>
                  <p className="mt-0.5 text-[4.8px] italic text-[#7d7971] sm:text-[5.5px]">
                    Praktik kerja lapangan · Garut
                  </p>
                  <p className="mt-1 text-[5px] leading-[1.25] text-[#555a55] sm:text-[5.8px]">
                    Input data dan menyiapkan dokumen.
                  </p>
                </div>
                <div className="relative">
                  <span className="absolute -left-[15px] top-0.5 h-2 w-2 rounded-full border border-white bg-[#c47b4b]" />
                  <p className="text-[5.5px] font-bold leading-tight text-[#294a49] sm:text-[6.3px]">
                    Relawan Administrasi <span className="text-[#a86b43]">· 2021</span>
                  </p>
                  <p className="mt-1 text-[5px] leading-[1.25] text-[#555a55] sm:text-[5.8px]">
                    Mencatat kebutuhan dan koordinasi warga.
                  </p>
                </div>
              </div>
            </section>

            <section className="min-h-0 rounded-[5px] border border-[#e8dfd3] bg-white/80 p-2 max-[640px]:overflow-hidden max-[640px]:p-1.5">
              <div className="mb-1 flex min-h-2 items-center gap-1.5 border-b border-[#e8dfd3] pb-1">
                <span className="h-2 w-2 rounded-full bg-[#c47b4b]" />
                <h3 className="text-[6px] font-black uppercase leading-none tracking-[0.12em] text-[#294a49] sm:text-[7px]">
                  Pendidikan
                </h3>
              </div>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-[5.7px] font-bold text-[#294a49] sm:text-[6.5px]">
                    SMK Negeri 1 Garut
                  </p>
                  <p className="mt-0.5 text-[4.8px] leading-[1.35] text-[#62645f] sm:text-[5.5px]">
                    Otomatisasi dan Tata Kelola Perkantoran
                  </p>
                </div>
                <span className="shrink-0 border-l border-[#c47b4b] pl-1.5 text-[4.8px] font-bold leading-tight text-[#a86b43] sm:text-[5.5px]">
                  2020—2023
                </span>
              </div>
              <p className="mt-1 border-t border-[#eee5da] pt-1 text-[4.8px] leading-tight text-[#62645f] sm:text-[5.5px]">
                Lulus dengan baik · Siswa teladan
              </p>
            </section>

            <section className="min-h-0 rounded-[5px] border border-[#e8dfd3] bg-white/80 p-2 max-[640px]:overflow-hidden max-[640px]:p-1.5">
              <div className="mb-1.5 flex min-h-2 items-center gap-1.5 border-b border-[#e8dfd3] pb-1">
                <span className="h-2 w-2 rounded-full bg-[#c47b4b]" />
                <h3 className="text-[6px] font-black uppercase leading-none tracking-[0.12em] text-[#294a49] sm:text-[7px]">
                  Pelatihan & pengalaman organisasi
                </h3>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="border-l-2 border-[#c47b4b] pl-1.5">
                  <p className="text-[5.2px] font-bold text-[#294a49] sm:text-[6px]">
                    Microsoft Excel Dasar <span className="font-medium text-[#a86b43]">· 2023</span>
                  </p>
                  <p className="mt-0.5 text-[4.6px] leading-tight text-[#62645f] sm:text-[5.2px]">
                    Tabel, data, dan rekap sederhana.
                  </p>
                  <p className="mt-1 text-[5.2px] font-bold text-[#294a49] sm:text-[6px]">
                    Pelayanan Pelanggan <span className="font-medium text-[#a86b43]">· 2022</span>
                  </p>
                  <p className="mt-0.5 text-[4.6px] leading-tight text-[#62645f] sm:text-[5.2px]">
                    Komunikasi sopan dan responsif.
                  </p>
                </div>
                <div className="border-l-2 border-[#c47b4b] pl-1.5">
                  <p className="text-[5.2px] font-bold text-[#294a49] sm:text-[6px]">
                    Panitia administrasi <span className="font-medium text-[#a86b43]">· 2022</span>
                  </p>
                  <p className="mt-0.5 text-[4.6px] text-[#62645f] sm:text-[5.2px]">
                    Kegiatan kelas
                  </p>
                  <p className="mt-0.5 text-[4.6px] leading-tight text-[#62645f] sm:text-[5.2px]">
                    Menyiapkan kebutuhan dan dokumen acara.
                  </p>
                  <p className="mt-1 text-[5.2px] font-bold text-[#294a49] sm:text-[6px]">
                    Siswa teladan
                  </p>
                  <p className="mt-0.5 text-[4.6px] leading-tight text-[#62645f] sm:text-[5.2px]">
                    Apresiasi prestasi sekolah.
                  </p>
                </div>
              </div>
            </section>
          </div>

          <aside className="grid min-h-0 grid-rows-[0.72fr_1.35fr_0.55fr_0.45fr] gap-2 rounded-[5px] bg-[#f3eee5] p-2 max-[640px]:grid-rows-[0.55fr_1.55fr_0.45fr_0.4fr]">
            <section className="min-h-0 overflow-hidden rounded-[4px] border border-[#e5dacb] bg-white/55 p-1.5">
              <h3 className="mb-1 flex min-h-2 items-center gap-1.5 text-[6px] font-black uppercase leading-none tracking-[0.12em] text-[#a86b43] sm:text-[7px]">
                <span className="h-2 w-2 shrink-0 rounded-full bg-[#c47b4b]" aria-hidden="true" />
                Profil
              </h3>
              <p className="text-[5px] leading-[1.4] text-[#555a55] sm:text-[5.8px]">
                Lulusan Administrasi Perkantoran yang teliti dan komunikatif.
                Terbiasa mengelola dokumen, data, dan kebutuhan pelanggan.
              </p>
            </section>
            <section className="min-h-0 overflow-hidden rounded-[4px] border border-[#e5dacb] bg-white/55 p-1.5">
              <h3 className="mb-1 flex min-h-2 items-center gap-1.5 text-[6px] font-black uppercase leading-none tracking-[0.12em] text-[#a86b43] sm:text-[7px]">
                <span className="h-2 w-2 shrink-0 rounded-full bg-[#c47b4b]" aria-hidden="true" />
                Keahlian
              </h3>
              <div className="flex flex-wrap gap-1">
                {["Administrasi", "Microsoft Office", "Input data", "Pengarsipan", "Layanan pelanggan", "Komunikasi", "Kerja tim", "Teliti"].map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex min-h-[9px] items-center justify-center rounded-full border border-[#d9c5ab] bg-white/80 px-1.5 py-0.5 text-center text-[4.5px] font-semibold leading-none text-[#405a54] sm:text-[5.2px]"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </section>
            <section className="min-h-0 overflow-hidden rounded-[4px] border border-[#e5dacb] bg-white/55 p-1.5">
              <h3 className="mb-1 flex min-h-2 items-center gap-1.5 text-[6px] font-black uppercase leading-none tracking-[0.12em] text-[#a86b43] sm:text-[7px]">
                <span className="h-2 w-2 shrink-0 rounded-full bg-[#c47b4b]" aria-hidden="true" />
                Aplikasi
              </h3>
              <div className="grid grid-cols-2 gap-x-1 gap-y-1.5 text-[4.8px] text-[#555a55] sm:text-[5.5px]">
                {slideFourSoftware.map(({ label, Icon, color }) => (
                  <span key={label} className="flex min-w-0 items-center gap-1 leading-none">
                    <Icon className="h-2 w-2 shrink-0" style={{ color }} aria-hidden="true" />
                    <span className="truncate">{label}</span>
                  </span>
                ))}
              </div>
            </section>
            <section className="min-h-0 overflow-hidden rounded-[4px] border border-[#e5dacb] bg-white/55 p-1.5">
              <h3 className="mb-1 flex min-h-2 items-center gap-1.5 text-[6px] font-black uppercase leading-none tracking-[0.12em] text-[#a86b43] sm:text-[7px]">
                <span className="h-2 w-2 shrink-0 rounded-full bg-[#c47b4b]" aria-hidden="true" />
                Bahasa & minat
              </h3>
              <p className="text-[4.8px] leading-[1.3] text-[#555a55] sm:text-[5.5px]">
                Indonesia · Sunda · Inggris dasar
                <br />
                Membaca · desain · kegiatan sosial
              </p>
            </section>
          </aside>
        </div>
      </div>
    </article>
  );
}

export function Current() {
  return (
    <FeedStage>
      <SlideSevenCv />
    </FeedStage>
  );
}
