import { ArrowUpRight, Camera, MessageCircle } from "lucide-react";
import { creatorProfiles } from "./profiles";
import "./_group.css";

export function Current() {
  return (
    <section
      aria-labelledby="creator-team-current-title"
      className="relative isolate overflow-hidden rounded-[1.75rem] border border-[#d4e9f4] bg-gradient-to-br from-white via-[#f3faff] to-[#e4f6fd] p-4 shadow-[0_12px_28px_rgba(11,50,83,0.1)] sm:rounded-[2rem] sm:p-7 lg:p-8"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-12 -top-16 h-56 w-56 rounded-full bg-cyan-200/35 blur-3xl"
      />
      <div className="relative">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-[#dff4ff] text-[#0172b1]">
                <Camera aria-hidden="true" className="h-4 w-4" />
              </span>
              <p className="text-[9px] font-black uppercase tracking-[0.18em] text-[#0172b1] sm:text-[10px]">
                Tim kreatif Nempo
              </p>
            </div>
            <h2
              id="creator-team-current-title"
              className="mt-2 text-2xl font-black leading-tight tracking-tight text-[#123d54] sm:text-3xl"
            >
              Creator Team
            </h2>
            <p className="mt-1.5 max-w-2xl text-xs leading-relaxed text-[#45677d] sm:text-sm">
              Untuk Wedding Content Creator, Event Content Creator, dan kebutuhan konten acara lainnya.
            </p>
          </div>
          <div className="flex flex-wrap gap-1.5 sm:max-w-[390px] sm:justify-end">
            {["Wedding Content Creator", "Event Content Creator", "Acara lainnya sesuai kebutuhan"].map((useCase) => (
              <span
                key={useCase}
                className="inline-flex items-center gap-1.5 rounded-full border border-[#c9e4f1] bg-white/85 px-2.5 py-1.5 text-[10px] font-bold text-[#155b80] shadow-sm sm:text-[11px]"
              >
                <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-[#0194f3]" />
                {useCase}
              </span>
            ))}
          </div>
        </div>
        <p className="mt-5 rounded-xl border border-[#b9e1f2] bg-[#eaf8ff]/90 px-3.5 py-2.5 text-[11px] leading-relaxed text-[#245b77] sm:mt-6 sm:px-4 sm:text-xs">
          <span className="font-extrabold text-[#155b80]">Contoh profil AI:</span>{" "}
          semua nama dan foto di bawah adalah contoh buatan AI, bukan anggota tim yang terkonfirmasi.
        </p>
        <ul
          aria-label="Sepuluh contoh profil AI creator"
          className="mt-4 grid grid-cols-2 gap-3 sm:mt-5 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-5"
        >
          {creatorProfiles.map((creator, index) => (
            <li key={creator.name} className="min-w-0">
              <article className="group h-full overflow-hidden rounded-2xl border border-[#d6e9f2] bg-white shadow-[0_5px_16px_rgba(12,65,95,0.07)] transition duration-200 hover:-translate-y-1 hover:shadow-[0_12px_24px_rgba(12,65,95,0.14)]">
                <div className="relative aspect-[4/4.25] overflow-hidden bg-[#e6f4fa]">
                  <img
                    src={creator.image}
                    alt={creator.alt}
                    loading={index < 4 ? "eager" : "lazy"}
                    className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-[1.035]"
                  />
                  <span className="absolute left-2.5 top-2.5 rounded-full border border-white/70 bg-white/90 px-2 py-1 text-[8px] font-extrabold uppercase tracking-[0.1em] text-[#176285] shadow-sm sm:text-[9px]">
                    Contoh AI
                  </span>
                </div>
                <div className="px-3 py-3 sm:px-3.5">
                  <p className="text-[12px] font-extrabold leading-snug text-[#123d54] sm:text-sm">
                    {creator.name}
                  </p>
                  <p className="mt-1 text-[9px] font-semibold tracking-wide text-[#668397] sm:text-[10px]">
                    Contoh profil creator
                  </p>
                </div>
              </article>
            </li>
          ))}
        </ul>
        <div className="mt-5 flex flex-col gap-3 border-t border-[#cfe5ef] pt-4 sm:mt-6 sm:flex-row sm:items-center sm:justify-between sm:pt-5">
          <p className="max-w-xl text-[11px] leading-relaxed text-[#45677d] sm:text-xs">
            Punya acara yang ingin didokumentasikan? Ceritakan kebutuhanmu, kami bantu diskusikan pilihan creator yang sesuai.
          </p>
          <a
            href="https://ig.me/m/nempo.id"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-10 w-fit shrink-0 items-center gap-2 rounded-full bg-[#0873b8] px-4 py-2.5 text-[11px] font-extrabold text-white shadow-md shadow-sky-900/15 transition hover:-translate-y-0.5 hover:bg-[#075f99] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0873b8] sm:text-xs"
          >
            <MessageCircle aria-hidden="true" className="h-3.5 w-3.5" />
            Konsultasi Creator Team
            <ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </section>
  );
}
