import { Layout, SEO, NEMPO_INSTAGRAM_DM_URL } from "./PreviewShell";


import { useState, type FormEvent } from "react";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Check,
  Copy,
  Drum,
  Instagram,
  Music2,
  ShoppingBasket,
  Sparkles,
  UsersRound,
  Utensils,
} from "lucide-react";
import "./_group.css";
import "./nempo-cultural-tour.css";

const themes = [
  {
    number: "01",
    name: "Rasa Lokal",
    note: "Yang akrab di lidah, punya cerita di baliknya.",
    className: "rasa",
    icon: Utensils,
  },
  {
    number: "02",
    name: "Panggung Budaya",
    note: "Ruang bagi tradisi untuk bertemu hari ini.",
    className: "budaya",
    icon: Drum,
  },
  {
    number: "03",
    name: "Pasar Kreatif",
    note: "Temukan karya dan usaha dari sekitar kita.",
    className: "pasar",
    icon: ShoppingBasket,
  },
  {
    number: "04",
    name: "Culture & Music",
    note: "Nada, budaya, dan orang-orang yang menyukainya.",
    className: "musik",
    icon: Music2,
  },
];

const schedule = [
  {
    time: "08.00—10.00",
    title: "Persiapan tenant",
    detail: "Lapak ditata, bahan disiapkan, ruang temu mulai terbentuk.",
    kind: "setup",
  },
  {
    time: "10.00—12.00",
    title: "Pasar & aktivitas",
    detail: "Jelajahi produk UMKM, jajanan lokal, dan aktivitas untuk semua umur.",
    kind: "market",
  },
  {
    time: "13.00—15.00",
    title: "Workshop, demo & komunitas",
    detail: "Ikut mencoba, belajar hal baru, atau berkenalan dengan komunitas lokal.",
    kind: "workshop",
  },
  {
    time: "15.00—17.00",
    title: "Pertunjukan budaya & musik",
    detail: "Sajian budaya lokal dan musik akustik mengisi sore bersama.",
    kind: "culture",
  },
  {
    time: "17.00—20.00",
    title: "Kuliner & hiburan utama",
    detail: "Lanjut menikmati makanan, hiburan, dan panggung utama hingga malam.",
    kind: "evening",
  },
];

const reasons = [
  {
    number: "01",
    heading: "Ruang publik terasa hidup",
    body: "Sebuah tempat terasa dekat saat ada alasan untuk berhenti, duduk sebentar, dan bertemu.",
  },
  {
    number: "02",
    heading: "Usaha lokal punya ruang tumbuh",
    body: "Cerita di balik produk lebih mudah dikenal saat pembuatnya hadir dan bisa diajak ngobrol.",
  },
  {
    number: "03",
    heading: "Seniman lokal punya panggung",
    body: "Bakat sekitar layak didengar, dilihat, dan dirayakan bersama warga Garut.",
  },
];

export default function NempoCulturalTourPage() {
  const [tenantDraft, setTenantDraft] = useState("");
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied" | "manual">("idle");

  function prepareTenantApplication(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const usaha = String(formData.get("usaha") || "").trim();
    const penanggungJawab = String(formData.get("penanggung-jawab") || "").trim();
    const kategori = String(formData.get("kategori") || "").trim();
    const produk = String(formData.get("produk") || "").trim();
    const instagram = String(formData.get("instagram") || "").trim();

    setTenantDraft(
      [
        "Halo Nempo, saya ingin mendaftar sebagai tenant Nempo Cultural Tour.",
        "",
        `Nama usaha: ${usaha}`,
        `Nama penanggung jawab: ${penanggungJawab}`,
        `Kategori: ${kategori}`,
        `Produk yang ditawarkan: ${produk}`,
        `Instagram usaha: ${instagram || "Belum ada"}`,
      ].join("\n"),
    );
    setCopyStatus("idle");
    window.setTimeout(() => {
      document.getElementById("hasil-daftar-tenant")?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 50);
  }

  async function copyTenantApplication() {
    try {
      await navigator.clipboard.writeText(tenantDraft);
      setCopyStatus("copied");
    } catch {
      setCopyStatus("manual");
    }
  }

  return (
    <Layout>
      <SEO
        title="Nempo Cultural Tour — Titik Temu Warga Garut"
        description="Weekend Cultural & UMKM Experience: pasar lokal, budaya, musik, workshop, dan aktivitas keluarga dalam satu ruang temu di Garut."
        keywords="Nempo Cultural Tour, UMKM Garut, budaya Garut, pasar kreatif, event Garut"
        path="/cultural-tour"
      />

      <main className="nct-page">
        <div className="nct-topline">
          <a href="#awal" className="nct-wordmark" aria-label="Nempo Cultural Tour, ke awal halaman">
            NEMPO <span>/</span> CULTURAL TOUR
          </a>
          <a className="nct-toplink" href="#agenda">
            Kenali acaranya <ArrowDown size={14} aria-hidden="true" />
          </a>
        </div>

        <section id="awal" className="nct-hero" aria-labelledby="nct-title">
          <div className="nct-hero-copy">
            <p className="nct-eyebrow"><span className="nct-eyebrow-dot" /> TITIK TEMU AKHIR PEKAN · GARUT</p>
            <h1 id="nct-title">
              Kota ini
              <br />
              terasa lebih
              <br />
              <em>dekat</em> saat
              <br />
              <span>kita bertemu.</span>
            </h1>
            <p className="nct-hero-intro">
              Weekend Cultural &amp; UMKM Experience. Satu ruang untuk jajan,
              menikmati budaya, mendengar musik, dan menghabiskan waktu bersama.
            </p>
            <div className="nct-hero-actions">
              <a className="nct-button nct-button-dark" href="#daftar-tenant">
                Daftar sebagai Tenant <ArrowRight size={16} aria-hidden="true" />
              </a>
              <a className="nct-button nct-button-outline" href="#agenda">
                Lihat Agenda Weekend <ArrowDown size={16} aria-hidden="true" />
              </a>
              <p className="nct-no-date">Agenda dan lokasi berikutnya akan diumumkan.</p>
            </div>
          </div>

          <div className="nct-hero-art" role="img" aria-label="Ilustrasi grafis suasana pasar dan panggung budaya">
            <div className="nct-art-stamp">RUANG<br />UNTUK<br />SEMUA</div>
            <div className="nct-art-sun" />
            <div className="nct-art-orbit nct-art-orbit-one" />
            <div className="nct-art-orbit nct-art-orbit-two" />
            <div className="nct-art-sign">
              <span>GARUT</span>
              <b>NYAHA<br />NYAMAN<br />BAGJA</b>
              <small>rasa · budaya · urang</small>
            </div>
            <div className="nct-art-stage">
              <div className="nct-stage-roof"><i /><i /><i /><i /><i /></div>
              <div className="nct-stage-lights"><span /><span /><span /></div>
              <div className="nct-stage-curtain" />
              <div className="nct-stage-floor" />
              <div className="nct-stage-person person-one" />
              <div className="nct-stage-person person-two" />
              <div className="nct-stage-person person-three" />
              <div className="nct-stage-drum"><span /><i /></div>
            </div>
            <div className="nct-art-ticket"><span>DATANG</span><strong>BAWA<br />CERITA</strong></div>
            <div className="nct-art-caption"><span>ILUSTRASI SUASANA</span><span>01 / 04</span></div>
          </div>

          <div className="nct-hero-foot">
            <span>BUKAN CUMA LEWAT.</span>
            <span>BERHENTI, KENALAN, RAYAKAN YANG DEKAT.</span>
            <a href="#cerita" aria-label="Gulir ke cerita Nempo Cultural Tour"><ArrowDown size={16} /></a>
          </div>
        </section>

        <section id="cerita" className="nct-manifesto">
          <div className="nct-manifesto-label">
            <span className="nct-section-index">01 / MAKSUDNYA</span>
            <span className="nct-vertical-note">DIBUAT DEKAT DENGAN KITA</span>
          </div>
          <div className="nct-manifesto-main">
            <p className="nct-kicker">GARUT PUNYA BANYAK CERITA.</p>
            <h2>Yang paling seru,<br />kalau <span>dibagi bersama.</span></h2>
            <p className="nct-manifesto-body">
              Nempo Cultural Tour mengajak warga berkumpul di ruang publik lewat
              hal-hal yang tumbuh dari sekitar: makanan, karya, pertunjukan, dan
              obrolan yang mempertemukan kita.
            </p>
          </div>
          <div className="nct-manifesto-aside">
            <span className="nct-aside-mark">“</span>
            <p>Datang bareng teman. Pulang bawa kenalan baru dan cerita lokal.</p>
            <span className="nct-aside-rule" />
            <small>SEBUAH AJAKAN UNTUK WARGA GARUT</small>
          </div>
        </section>

        <section id="yang-ada" className="nct-program">
          <div className="nct-section-head">
            <div>
              <span className="nct-section-index">02 / EMPAT SUASANA</span>
              <h2>Setiap pekan,<br /><i>rasa yang berbeda.</i></h2>
            </div>
            <p>
              Tema berganti, semangatnya sama: membuka ruang untuk yang lokal
              dan membuat akhir pekan terasa lebih hidup.
            </p>
          </div>
          <div className="nct-theme-list">
            {themes.map((theme) => {
              const Icon = theme.icon;
              return (
                <article key={theme.name} className={`nct-theme nct-theme-${theme.className}`}>
                  <span className="nct-theme-number">{theme.number}</span>
                  <div className="nct-theme-icon"><Icon size={24} strokeWidth={1.5} /></div>
                  <div className="nct-theme-copy">
                    <h3>{theme.name}</h3>
                    <p>{theme.note}</p>
                  </div>
                  <span className="nct-theme-arrow" aria-hidden="true"><ArrowUpRight size={18} /></span>
                  <span className="nct-theme-decoration" aria-hidden="true" />
                </article>
              );
            })}
          </div>
          <div className="nct-program-note">
            <Sparkles size={16} aria-hidden="true" />
            <p>Format dan aktivitas menyesuaikan tema serta agenda yang diumumkan.</p>
          </div>
        </section>

        <section className="nct-activities" aria-labelledby="nct-activities-title">
          <div className="nct-activities-heading">
            <span className="nct-section-index">03 / DI AKHIR PEKAN</span>
            <h2 id="nct-activities-title">Banyak cara untuk<br /><em>ikut merayakan.</em></h2>
          </div>
          <div className="nct-activities-list">
            <article>
              <span>01</span>
              <div><h3>UMKM &amp; kuliner market</h3><p>Makanan, minuman, kopi, kerajinan, dan produk lokal. Tenant dapat berganti setiap pekan.</p></div>
              <ShoppingBasket size={20} aria-hidden="true" />
            </article>
            <article>
              <span>02</span>
              <div><h3>Panggung budaya</h3><p>Tari tradisional, musik etnik Sunda, pencak silat, kaulinan barudak, dan kesenian lokal.</p></div>
              <Drum size={20} aria-hidden="true" />
            </article>
            <article>
              <span>03</span>
              <div><h3>Hiburan akhir pekan</h3><p>Musik akustik, penampilan komunitas, dan kolaborasi seniman muda dengan tradisi.</p></div>
              <Music2 size={20} aria-hidden="true" />
            </article>
            <article>
              <span>04</span>
              <div><h3>Aktivitas pengunjung</h3><p>Workshop budaya, permainan tradisional, demo produk UMKM, dan kegiatan keluarga.</p></div>
              <UsersRound size={20} aria-hidden="true" />
            </article>
          </div>
        </section>

        <section className="nct-people">
          <div className="nct-people-visual" aria-hidden="true">
            <div className="nct-market-sun" />
            <div className="nct-market-label"><span>MADE<br />AROUND<br />HERE</span><i>GARUT</i></div>
            <div className="nct-market-table table-back">
              <div className="nct-awning"><b /><b /><b /><b /><b /></div>
              <div className="nct-shelf"><i /><i /><i /><i /></div>
            </div>
            <div className="nct-market-table table-front">
              <div className="nct-awning"><b /><b /><b /><b /><b /></div>
              <div className="nct-shelf"><i /><i /><i /><i /><i /></div>
            </div>
            <div className="nct-market-ground" />
            <span className="nct-market-caption">ILUSTRASI PASAR LOKAL</span>
          </div>
          <div className="nct-people-copy">
            <span className="nct-section-index">03 / ORANG-ORANGNYA</span>
            <h2>Yang bikin ramai<br />bukan dekorasi.<br /><em>Orang-orangnya.</em></h2>
            <p>
              Pelaku UMKM, seniman, komunitas, keluarga, dan siapa pun yang
              ingin menikmati Garut dari dekat. Semua punya alasan untuk datang—
              dan tempat untuk ikut jadi bagian.
            </p>
            <div className="nct-people-tags">
              <span><ShoppingBasket size={15} /> Usaha lokal</span>
              <span><Music2 size={15} /> Seniman &amp; komunitas</span>
              <span><UsersRound size={15} /> Teman &amp; keluarga</span>
            </div>
          </div>
        </section>

        <section className="nct-gallery" aria-labelledby="nct-gallery-title">
          <div>
            <span className="nct-section-index">CERITA YANG AKAN TUMBUH</span>
            <h2 id="nct-gallery-title">Galeri kegiatan</h2>
          </div>
          <div className="nct-gallery-empty">
            <span className="nct-gallery-mark" aria-hidden="true">N</span>
            <div>
              <strong>Dokumentasi Cultural Tour sedang disiapkan.</strong>
              <p>Galeri akan bertambah seiring berlangsungnya kegiatan dan cerita warga di dalamnya.</p>
            </div>
          </div>
        </section>

        <section className="nct-reasons" aria-label="Dampak yang ingin dibawa">
          <div className="nct-reasons-intro">
            <span className="nct-section-index">04 / KENAPA BERTEMU</span>
            <h2>Satu akhir pekan.<br /><span>Banyak yang bergerak.</span></h2>
          </div>
          <div className="nct-reasons-list">
            {reasons.map((reason) => (
              <article className="nct-reason" key={reason.number}>
                <span>{reason.number}</span>
                <div><h3>{reason.heading}</h3><p>{reason.body}</p></div>
                <ArrowUpRight size={18} aria-hidden="true" />
              </article>
            ))}
          </div>
        </section>

        <section id="agenda" className="nct-schedule">
          <div className="nct-schedule-top">
            <div>
              <span className="nct-section-index">05 / ALUR HARI</span>
              <h2>Contoh ritme<br /><i>satu hari.</i></h2>
            </div>
            <div className="nct-example-stamp">
              <span>CONTOH</span>
              <b>ALUR<br />KEGIATAN</b>
              <small>BUKAN JADWAL ACARA</small>
            </div>
          </div>
          <p className="nct-schedule-lead">
            Gambaran aktivitas dari pagi sampai malam. Susunan agenda sebenarnya
            akan mengikuti tema dan diumumkan kemudian.
          </p>
          <div className="nct-timeline">
            {schedule.map((item, index) => (
              <article className={`nct-time-row nct-time-${item.kind}`} key={item.time}>
                <time>{item.time}</time>
                <span className="nct-time-marker" aria-hidden="true"><i /></span>
                <div className="nct-time-copy">
                  <span className="nct-time-step">0{index + 1} / HARI ACARA</span>
                  <h3>{item.title}</h3>
                  <p>{item.detail}</p>
                </div>
              </article>
            ))}
          </div>
          <div className="nct-schedule-foot">
            <span>10.00—20.00</span>
            <p>Pasar dan aktivitas untuk pengunjung. Persiapan tenant dimulai lebih awal.</p>
            <span>GARUT, JAWA BARAT</span>
          </div>
        </section>

        <section className="nct-next">
          <div className="nct-next-orbit" aria-hidden="true"><span /><span /><i /></div>
          <div className="nct-next-copy">
            <span className="nct-section-index">06 / SAMPAI JUMPA</span>
            <h2>Belum ada tanggal.<br />Tapi <em>pasti ada kabar.</em></h2>
            <p>
              Agenda dan lokasi berikutnya akan diumumkan. Ikuti kabar Nempo
              supaya tahu kapan titik temu kita dibuka.
            </p>
            <a className="nct-button nct-button-paper" href={NEMPO_INSTAGRAM_DM_URL} target="_blank" rel="noopener noreferrer">
              <Instagram size={17} aria-hidden="true" /> Ikuti kabar di Instagram
            </a>
          </div>
          <div className="nct-next-wordmark" aria-hidden="true">SAMP<br />AI<br />JUMPA</div>
        </section>

        <section id="daftar-tenant" className="nct-tenant" aria-labelledby="nct-tenant-title">
          <div className="nct-tenant-intro">
            <span className="nct-section-index">UNTUK USAHA LOKAL</span>
            <h2 id="nct-tenant-title">Bawa produkmu<br /><em>ke titik temu.</em></h2>
            <p>
              Ceritakan usaha dan produk yang ingin kamu bawa. Kami siapkan
              pesan pendaftaran untuk ditinjau dan dikirim langsung ke tim Nempo.
            </p>
            <p className="nct-tenant-privacy">
              Data formulir tidak dikirim atau disimpan otomatis oleh website.
              Kamu akan meninjau pesannya sendiri sebelum mengirim lewat Instagram DM.
            </p>
          </div>
          <div className="nct-tenant-form-wrap">
            <form className="nct-tenant-form" onSubmit={prepareTenantApplication}>
              <label>
                Nama usaha
                <input name="usaha" required maxLength={90} autoComplete="organization" placeholder="Contoh: Dapur Nini" />
              </label>
              <label>
                Nama penanggung jawab
                <input name="penanggung-jawab" required maxLength={90} autoComplete="name" placeholder="Nama yang bisa dihubungi" />
              </label>
              <label>
                Kategori produk
                <select name="kategori" required defaultValue="">
                  <option value="" disabled>Pilih kategori</option>
                  <option>Makanan &amp; jajanan</option>
                  <option>Minuman &amp; kopi</option>
                  <option>Kerajinan</option>
                  <option>Fesyen &amp; produk kreatif</option>
                  <option>Lainnya</option>
                </select>
              </label>
              <label>
                Produk yang ditawarkan
                <textarea name="produk" required maxLength={500} rows={3} placeholder="Ceritakan singkat produk andalanmu" />
              </label>
              <label>
                Instagram usaha <span>(opsional)</span>
                <input name="instagram" maxLength={100} placeholder="@namausaha" />
              </label>
              <button className="nct-button nct-button-dark" type="submit">
                Siapkan pesan pendaftaran <ArrowRight size={16} aria-hidden="true" />
              </button>
            </form>
            {tenantDraft && (
              <div id="hasil-daftar-tenant" className="nct-tenant-result" aria-live="polite">
                <span className="nct-section-index">PESAN SIAP DITINJAU</span>
                <p>Periksa detailnya, lalu salin dan kirim melalui DM Instagram Nempo.</p>
                <textarea aria-label="Pesan pendaftaran tenant" readOnly value={tenantDraft} rows={8} />
                <div className="nct-tenant-result-actions">
                  <button className="nct-button nct-button-outline" type="button" onClick={copyTenantApplication}>
                    {copyStatus === "copied" ? <Check size={16} aria-hidden="true" /> : <Copy size={16} aria-hidden="true" />}
                    {copyStatus === "copied" ? "Pesan tersalin" : "Salin pesan"}
                  </button>
                  <a className="nct-button nct-button-dark" href={NEMPO_INSTAGRAM_DM_URL} target="_blank" rel="noopener noreferrer">
                    Buka Instagram DM <Instagram size={16} aria-hidden="true" />
                  </a>
                </div>
                {copyStatus === "manual" && <small className="nct-copy-help">Pesan belum tersalin otomatis. Tekan dan tahan teks untuk menyalinnya.</small>}
              </div>
            )}
          </div>
        </section>

        <section className="nct-partner">
          <div className="nct-partner-copy">
            <span className="nct-section-index">UNTUK PELAKU LOKAL &amp; PARTNER</span>
            <h2>Punya yang ingin<br /><i>dibawa ke ruang ini?</i></h2>
            <p>
              Kalau kamu pelaku UMKM, seniman, komunitas, atau calon partner,
              ceritakan ide dan minat kolaborasimu lewat DM.
            </p>
          </div>
          <a className="nct-partner-link" href={NEMPO_INSTAGRAM_DM_URL} target="_blank" rel="noopener noreferrer">
            <span>Ngobrol dengan tim Nempo</span><ArrowUpRight size={19} />
          </a>
        </section>

        <footer className="nct-footer">
          <a href="#awal" className="nct-footer-logo">NEMPO<span>®</span></a>
          <p>Ruang temu untuk cerita lokal.</p>
          <span>GARUT · JAWA BARAT</span>
          <a href={NEMPO_INSTAGRAM_DM_URL} target="_blank" rel="noopener noreferrer" aria-label="Hubungi Nempo melalui Instagram DM">
            <Instagram size={17} />
          </a>
        </footer>
        <a className="nct-mobile-contact" href={NEMPO_INSTAGRAM_DM_URL} target="_blank" rel="noopener noreferrer">
          Ikuti kabar <Instagram size={16} aria-hidden="true" />
        </a>
      </main>
    </Layout>
  );
}
