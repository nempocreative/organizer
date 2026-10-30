import "./_group.css";
import {
  Archive,
  BookOpenText,
  BriefcaseBusiness,
  Check,
  Database,
  FileText,
  Headset,
  MapPin,
  MonitorCog,
  Palette,
  Phone,
  ScanEye,
  Table2,
  UsersRound,
} from "lucide-react";
import { FeedStage } from "./FeedStage";

const assetBase = "/__mockup/images/nempo-feed-slide7/";

const coreSkills = [
  { label: "Administrasi", Icon: BriefcaseBusiness },
  { label: "Microsoft Office", Icon: MonitorCog },
  { label: "Input data", Icon: Database },
  { label: "Pengarsipan", Icon: Archive },
  { label: "Layanan pelanggan", Icon: Headset },
];

const softSkills = ["Komunikasi", "Kerja tim", "Teliti"];

const software = [
  { label: "Word", Icon: FileText, color: "#2b579a" },
  { label: "Excel", Icon: Table2, color: "#217346" },
  { label: "Google Docs", Icon: BookOpenText, color: "#4285f4" },
  { label: "Canva", Icon: Palette, color: "#00a8cc" },
];

function SectionTitle({ title }: { title: string }) {
  return (
    <div className="mb-1.5 flex items-center gap-1.5 border-b border-[#d8cec2] pb-1">
      <span className="h-2 w-[2px] shrink-0 bg-[#d71920]" aria-hidden="true" />
      <h3 className="text-[5.8px] font-black uppercase leading-none tracking-[0.12em] text-[#211f1c] sm:text-[6.8px]">
        {title}
      </h3>
    </div>
  );
}

function EditorialCv() {
  return (
    <article
      aria-label="Contoh CV Rani Kurniawati"
      className="relative flex aspect-[0.75] w-[86%] max-w-[430px] overflow-hidden border border-[#d7c9ba] bg-[#f5efeb] text-left text-[#171717] shadow-[0_16px_40px_rgba(0,0,0,0.34)] max-[640px]:aspect-[0.82] max-[640px]:w-[94%]"
      style={{ fontFamily: "'DM Sans', Arial, sans-serif" }}
    >
      <div
        className="pointer-events-none absolute inset-[2.1%] z-20 border border-[#d9cfc4]"
        aria-hidden="true"
      />
      <div className="flex h-full w-full flex-col">
        <header className="relative grid min-h-[22%] shrink-0 grid-cols-[1fr_0.23fr] items-center gap-2 border-b-2 border-[#171717] bg-[#f5efeb] px-2.5 py-2.5 sm:gap-3 sm:px-3.5 sm:py-3">
          <div className="min-w-0">
            <div className="mb-1 flex items-center gap-1.5">
              <span className="h-[2px] w-3 bg-[#d71920]" aria-hidden="true" />
              <p className="text-[4px] font-black uppercase tracking-[0.2em] text-[#d71920] sm:text-[4.8px]">
                Curriculum Vitae
              </p>
            </div>
            <h2 className="font-['Bricolage_Grotesque',Arial,sans-serif] text-[14px] font-extrabold uppercase leading-[0.94] tracking-[-0.055em] sm:text-[18px]">
              Rani <span className="text-[#d71920]">Kurniawati</span>
            </h2>
            <p className="mt-1 w-fit border-l-2 border-[#d71920] bg-[#eae2d8] px-1.5 py-0.5 text-[4.6px] font-bold uppercase tracking-[0.08em] text-[#28231f] sm:text-[5.4px]">
              Staf Administrasi
            </p>
            <div className="mt-1.5 grid grid-cols-2 gap-x-2 gap-y-1 text-[4.3px] leading-tight text-[#38332e] sm:text-[5px]">
              <span className="flex min-w-0 items-center gap-0.5">
                <Phone className="h-1.5 w-1.5 shrink-0 text-[#d71920]" aria-hidden="true" />
                <span>08xx-xxxx-xxxx</span>
              </span>
              <span className="flex min-w-0 items-center gap-0.5">
                <FileText className="h-1.5 w-1.5 shrink-0 text-[#d71920]" aria-hidden="true" />
                <span className="truncate">rani.kurniawati@example.com</span>
              </span>
              <span className="flex min-w-0 items-center gap-0.5">
                <MapPin className="h-1.5 w-1.5 shrink-0 text-[#d71920]" aria-hidden="true" />
                <span>Garut, Jawa Barat</span>
              </span>
            </div>
          </div>
          <div className="relative aspect-[0.77] w-full overflow-hidden border border-[#171717] bg-[#eae2d8]">
            <img
              src={`${assetBase}nempo-karir-hero.jpg`}
              alt="Foto profil Rani Kurniawati"
              className="absolute inset-0 h-full w-full object-cover object-top"
              style={{
                objectPosition: "72% 25%",
                transform: "scale(1.5)",
                transformOrigin: "68% 25%",
              }}
            />
            <span className="absolute -right-1 -top-1 h-4 w-4 border-r-2 border-t-2 border-[#d71920]" aria-hidden="true" />
          </div>
        </header>

        <div className="grid min-h-0 flex-1 grid-cols-[1.04fr_0.96fr] gap-2 p-2 sm:gap-2.5 sm:p-2.5">
          <div className="grid min-h-0 grid-rows-[1.3fr_0.55fr_1.15fr] gap-1.5">
            <section className="flex min-h-0 flex-col rounded-[3px] border border-[#dfd5c8] bg-white/65 p-1.5">
              <SectionTitle title="Pengalaman kerja" />
              <div className="relative ml-1 flex min-h-0 flex-1 flex-col justify-between border-l border-[#d71920]/50 pl-2.5">
                <div className="relative">
                  <span className="absolute -left-[13px] top-0.5 h-1.5 w-1.5 rounded-full border border-white bg-[#d71920]" />
                  <div className="flex items-baseline justify-between gap-1">
                    <p className="text-[5.3px] font-black leading-tight text-[#171717] sm:text-[6.1px]">
                      Staf Administrasi
                    </p>
                    <span className="shrink-0 text-[4.6px] font-bold text-[#d71920] sm:text-[5.3px]">
                      2023–2024
                    </span>
                  </div>
                  <p className="mt-0.5 text-[4.6px] italic leading-tight text-[#6d655d] sm:text-[5.2px]">
                    Toko Sinar Jaya · Garut
                  </p>
                  <p className="mt-0.5 text-[4.8px] leading-[1.28] text-[#4a453f] sm:text-[5.5px]">
                    Mengelola arsip, transaksi, rekap, dan layanan pelanggan.
                  </p>
                </div>
                <div className="relative">
                  <span className="absolute -left-[13px] top-0.5 h-1.5 w-1.5 rounded-full border border-white bg-[#d71920]" />
                  <div className="flex items-baseline justify-between gap-1">
                    <p className="text-[5.3px] font-black leading-tight text-[#171717] sm:text-[6.1px]">
                      Asisten Administrasi
                    </p>
                    <span className="shrink-0 text-[4.6px] font-bold text-[#d71920] sm:text-[5.3px]">
                      2022
                    </span>
                  </div>
                  <p className="mt-0.5 text-[4.6px] italic leading-tight text-[#6d655d] sm:text-[5.2px]">
                    Praktik kerja lapangan · Garut
                  </p>
                  <p className="mt-0.5 text-[4.8px] leading-[1.28] text-[#4a453f] sm:text-[5.5px]">
                    Input data dan menyiapkan dokumen.
                  </p>
                </div>
                <div className="relative">
                  <span className="absolute -left-[13px] top-0.5 h-1.5 w-1.5 rounded-full border border-white bg-[#d71920]" />
                  <div className="flex items-baseline justify-between gap-1">
                    <p className="text-[5.3px] font-black leading-tight text-[#171717] sm:text-[6.1px]">
                      Relawan Administrasi
                    </p>
                    <span className="shrink-0 text-[4.6px] font-bold text-[#d71920] sm:text-[5.3px]">
                      2021
                    </span>
                  </div>
                  <p className="mt-0.5 text-[4.8px] leading-[1.28] text-[#4a453f] sm:text-[5.5px]">
                    Mencatat kebutuhan dan koordinasi warga.
                  </p>
                </div>
              </div>
            </section>

            <section className="min-h-0 rounded-[3px] border border-[#dfd5c8] bg-white/65 p-1.5">
              <SectionTitle title="Pendidikan" />
              <div className="flex items-baseline justify-between gap-1">
                <p className="text-[5.2px] font-black text-[#171717] sm:text-[6px]">
                  SMK Negeri 1 Garut
                </p>
                <span className="shrink-0 text-[4.5px] font-bold text-[#d71920] sm:text-[5.2px]">
                  2020—2023
                </span>
              </div>
              <p className="mt-0.5 text-[4.5px] leading-[1.25] text-[#4a453f] sm:text-[5.1px]">
                Otomatisasi dan Tata Kelola Perkantoran
              </p>
              <p className="mt-0.5 text-[4.4px] italic leading-tight text-[#746c63] sm:text-[5px]">
                Lulus dengan baik · Siswa teladan
              </p>
            </section>

            <section className="min-h-0 rounded-[3px] border border-[#dfd5c8] bg-white/65 p-1.5">
              <SectionTitle title="Pelatihan & organisasi" />
              <div className="grid grid-cols-2 gap-x-2 gap-y-1">
                <div className="border-l-2 border-[#d71920] pl-1.5">
                  <p className="text-[4.8px] font-black text-[#171717] sm:text-[5.5px]">
                    Microsoft Excel Dasar <span className="font-bold text-[#d71920]">· 2023</span>
                  </p>
                  <p className="mt-0.5 text-[4.4px] leading-tight text-[#5d574f] sm:text-[5px]">
                    Tabel, data, dan rekap sederhana.
                  </p>
                  <p className="mt-1 text-[4.8px] font-black text-[#171717] sm:text-[5.5px]">
                    Pelayanan Pelanggan <span className="font-bold text-[#d71920]">· 2022</span>
                  </p>
                  <p className="mt-0.5 text-[4.4px] leading-tight text-[#5d574f] sm:text-[5px]">
                    Komunikasi sopan dan responsif.
                  </p>
                </div>
                <div className="border-l-2 border-[#d71920] pl-1.5">
                  <p className="text-[4.8px] font-black text-[#171717] sm:text-[5.5px]">
                    Panitia administrasi <span className="font-bold text-[#d71920]">· 2022</span>
                  </p>
                  <p className="mt-0.5 text-[4.4px] leading-tight text-[#5d574f] sm:text-[5px]">
                    Kegiatan kelas · Menyiapkan kebutuhan dan dokumen acara.
                  </p>
                  <p className="mt-1 text-[4.8px] font-black text-[#171717] sm:text-[5.5px]">
                    Siswa teladan
                  </p>
                  <p className="mt-0.5 text-[4.4px] leading-tight text-[#5d574f] sm:text-[5px]">
                    Apresiasi prestasi sekolah.
                  </p>
                </div>
              </div>
            </section>
          </div>

          <aside className="grid min-h-0 grid-rows-[0.58fr_1.42fr_0.62fr_0.58fr] gap-1.5 rounded-[3px] bg-[#eae2d8] p-1.5">
            <section className="min-h-0 overflow-hidden rounded-[2px] border-l-2 border-[#d71920] bg-white/65 p-1.5">
              <SectionTitle title="Profil" />
              <p className="text-[4.8px] leading-[1.35] text-[#4a453f] sm:text-[5.5px]">
                Lulusan Administrasi Perkantoran yang teliti dan komunikatif.
                Terbiasa mengelola dokumen, data, dan kebutuhan pelanggan.
              </p>
            </section>

            <section className="min-h-0 overflow-hidden rounded-[2px] border-l-2 border-[#d71920] bg-white/65 p-1.5">
              <SectionTitle title="Keahlian" />
              <div className="grid grid-cols-2 gap-x-1.5 gap-y-1.5">
                {coreSkills.map(({ label, Icon }) => (
                  <span key={label} className="flex min-w-0 items-center gap-1 text-[4.5px] font-semibold leading-tight text-[#34302c] sm:text-[5.2px]">
                    <Icon className="h-2 w-2 shrink-0 text-[#d71920]" aria-hidden="true" />
                    <span>{label}</span>
                  </span>
                ))}
              </div>
              <div className="mt-2 border-t border-[#d8cec2] pt-1">
                <p className="mb-1 text-[4px] font-black uppercase tracking-[0.1em] text-[#d71920] sm:text-[4.6px]">
                  Soft skills
                </p>
                <div className="flex flex-wrap gap-1">
                  {softSkills.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center gap-0.5 rounded-full border border-[#c8b8a7] bg-[#f5efeb] px-1 py-0.5 text-[4.1px] font-semibold leading-none text-[#39332e] sm:text-[4.8px]"
                    >
                      <Check className="h-1.5 w-1.5 text-[#d71920]" aria-hidden="true" />
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </section>

            <section className="min-h-0 overflow-hidden rounded-[2px] border-l-2 border-[#d71920] bg-white/65 p-1.5">
              <SectionTitle title="Aplikasi" />
              <div className="grid grid-cols-2 gap-x-1.5 gap-y-1 text-[4.6px] text-[#38332e] sm:text-[5.3px]">
                {software.map(({ label, Icon, color }) => (
                  <span key={label} className="flex min-w-0 items-center gap-1 leading-none">
                    <Icon className="h-2 w-2 shrink-0" style={{ color }} aria-hidden="true" />
                    <span className="truncate">{label}</span>
                  </span>
                ))}
              </div>
            </section>

            <section className="min-h-0 overflow-hidden rounded-[2px] border-l-2 border-[#d71920] bg-white/65 p-1.5">
              <SectionTitle title="Bahasa & minat" />
              <p className="text-[4.5px] leading-[1.3] text-[#4a453f] sm:text-[5.2px]">
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

export function Editorial() {
  return (
    <FeedStage>
      <EditorialCv />
    </FeedStage>
  );
}
