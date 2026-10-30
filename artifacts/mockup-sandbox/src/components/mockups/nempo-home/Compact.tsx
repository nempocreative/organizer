import './_group.css';
import {
  ArrowRight,
  BedDouble,
  Bell,
  BusFront,
  CalendarDays,
  ChevronRight,
  Compass,
  Menu,
  MapPin,
  Mountain,
  Search,
  Ticket,
  Utensils,
  X,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useState } from 'react';

type Category = {
  label: string;
  icon: LucideIcon;
};

const categories: Category[] = [
  { label: 'Wisata', icon: Mountain },
  { label: 'Kuliner', icon: Utensils },
  { label: 'Event', icon: CalendarDays },
  { label: 'Tiket Wisata', icon: Ticket },
  { label: 'Transportasi', icon: BusFront },
  { label: 'Penginapan', icon: BedDouble },
];

const stories = [
  {
    tag: 'Alam',
    title: 'Pagi yang tenang di kaki Papandayan',
    meta: 'Garut · 4 menit baca',
    art: 'nempo-home__story-image--mountain',
  },
  {
    tag: 'Kuliner',
    title: 'Dodol Garut, legitnya cerita keluarga',
    meta: 'Garut · 3 menit baca',
    art: 'nempo-home__story-image--food',
  },
  {
    tag: 'Budaya',
    title: 'Mengenal Sunda dari bunyi dan rasa',
    meta: 'Jawa Barat · 5 menit baca',
    art: 'nempo-home__story-image--culture',
  },
];

export function Compact() {
  const [query, setQuery] = useState('');
  const [searchMessage, setSearchMessage] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Wisata');
  const [menuOpen, setMenuOpen] = useState(false);

  const runSearch = () => {
    const value = query.trim();
    if (!value) {
      setSearchMessage('Coba ketik nama tempat atau aktivitas.');
      return;
    }
    setSearchMessage(`Menampilkan pilihan untuk “${value}”`);
  };

  const selectCategory = (label: string) => {
    setSelectedCategory(label);
    setSearchMessage(`${label} pilihan untuk akhir pekan.`);
  };

  return (
    <div className="nempo-home">
      <header className="nempo-home__shell nempo-home__header">
        <a className="nempo-home__brand" href="#top" aria-label="Nempo.id, kembali ke atas">
          <span className="nempo-home__brand-mark">N</span>
          <span className="nempo-home__brand-copy">
            <span className="nempo-home__brand-name">
              Nempo<span>.</span>id
            </span>
            <span className="nempo-home__brand-tag">Cerita Jawa Barat</span>
          </span>
        </a>

        <nav className="nempo-home__nav" aria-label="Navigasi utama">
          <a className="nempo-home__nav-link" href="#jelajah">Jelajah</a>
          <a className="nempo-home__nav-link" href="#cerita">Cerita lokal</a>
          <a className="nempo-home__nav-link" href="#event">Event</a>
          <a className="nempo-home__account" href="#masuk">
            <Bell size={13} strokeWidth={2.3} aria-hidden="true" />
            Masuk
          </a>
          <button
            className="nempo-home__menu"
            type="button"
            aria-label={menuOpen ? 'Tutup menu' : 'Buka menu'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X size={17} /> : <Menu size={18} />}
          </button>
        </nav>
      </header>

      {menuOpen && (
        <div className="nempo-home__shell" style={{ paddingBottom: 12 }}>
          <nav aria-label="Menu mobile" style={{ display: 'grid', gap: 5, padding: '8px 0 4px' }}>
            {['Jelajah', 'Cerita lokal', 'Event', 'Masuk'].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(' ', '-')}`}
                className="nempo-home__nav-link"
                onClick={() => setMenuOpen(false)}
              >
                {item}
              </a>
            ))}
          </nav>
        </div>
      )}

      <main id="top" className="nempo-home__shell">
        <section className="nempo-home__hero" aria-labelledby="hero-title">
          <div className="nempo-home__hero-content">
            <div className="nempo-home__hero-copy">
              <p className="nempo-home__eyebrow">Teman jalan di Jawa Barat</p>
              <h1 id="hero-title" className="nempo-home__hero-title">
                Mau ke mana <em>hari ini?</em>
              </h1>
              <p className="nempo-home__hero-subtitle">
                Temukan tempat, rasa, dan cerita lokal yang layak masuk rencana akhir pekanmu.
              </p>
              <span className="nempo-home__hero-note">
                <Compass size={14} strokeWidth={1.8} aria-hidden="true" />
                Dikurasi dari sudut pandang orang lokal
              </span>
            </div>

            <div className="nempo-home__hero-art" aria-hidden="true">
              <span className="nempo-home__sun" />
              <span className="nempo-home__route" />
              <img
                className="nempo-home__mascot"
                src="/__mockup/images/nempo-mascot-cafe.webp"
                alt=""
              />
            </div>
          </div>
        </section>

        <div className="nempo-home__search-wrap">
          <form
            className="nempo-home__search"
            role="search"
            onSubmit={(event) => {
              event.preventDefault();
              runSearch();
            }}
          >
            <Search size={19} strokeWidth={2.2} aria-hidden="true" />
            <input
              aria-label="Cari di Jawa Barat"
              type="search"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                if (searchMessage) setSearchMessage('');
              }}
              placeholder="Cari destinasi, kuliner, atau event..."
            />
            <button type="submit">
              <Search size={15} strokeWidth={2.5} aria-hidden="true" />
              <span>Cari</span>
            </button>
          </form>
          {searchMessage && <div className="nempo-home__search-message" role="status">{searchMessage}</div>}
        </div>

        <section id="jelajah" className="nempo-home__discovery" aria-labelledby="discovery-title">
          <div>
            <p className="nempo-home__section-kicker">Mulai dari sini</p>
            <h2 id="discovery-title" className="nempo-home__section-title">
              Yang sedang<br />kamu cari?
            </h2>
            <p className="nempo-home__section-copy">
              Pilih satu, lalu biarkan Nempo mempersempit jalan menuju pengalaman yang pas.
            </p>
          </div>
          <div className="nempo-home__categories" role="list" aria-label="Kategori penemuan">
            {categories.map(({ label, icon: Icon }) => (
              <button
                key={label}
                className={`nempo-home__category ${selectedCategory === label ? 'is-selected' : ''}`}
                type="button"
                role="listitem"
                aria-pressed={selectedCategory === label}
                onClick={() => selectCategory(label)}
              >
                <span className="nempo-home__category-icon">
                  <Icon size={15} strokeWidth={2.1} aria-hidden="true" />
                </span>
                <span className="nempo-home__category-label">{label}</span>
              </button>
            ))}
          </div>
        </section>

        <section id="cerita" className="nempo-home__lower" aria-label="Cerita dan event pilihan">
          <div className="nempo-home__stories">
            <div className="nempo-home__section-head">
              <div>
                <p className="nempo-home__section-kicker">Dari warga sekitar</p>
                <h2 className="nempo-home__section-title">Cerita yang dekat</h2>
              </div>
              <a className="nempo-home__all" href="#semua-cerita">
                Lihat semua <ArrowRight size={13} strokeWidth={2.5} aria-hidden="true" />
              </a>
            </div>
            <div className="nempo-home__story-row">
              {stories.map((story) => (
                <a className="nempo-home__story" href="#cerita-lokal" key={story.title}>
                  <span className={`nempo-home__story-image ${story.art}`} aria-hidden="true" />
                  <span className="nempo-home__story-body">
                    <span className="nempo-home__story-tag">{story.tag}</span>
                    <strong className="nempo-home__story-title">{story.title}</strong>
                    <span className="nempo-home__story-meta">
                      <MapPin size={10} strokeWidth={2} aria-hidden="true" />
                      {story.meta}
                    </span>
                  </span>
                </a>
              ))}
            </div>
          </div>

          <a id="event" className="nempo-home__event" href="#event-detail">
            <img src="/__mockup/images/nempo-banner-card.jpg" alt="" />
            <span className="nempo-home__event-copy">
              <span className="nempo-home__event-label">Agenda pilihan</span>
              <strong className="nempo-home__event-title">JEOS Mobile Legend Championship Vol. 2</strong>
              <span className="nempo-home__event-date">
                <CalendarDays size={12} strokeWidth={2} aria-hidden="true" />
                Event komunitas · Garut
                <ChevronRight size={12} strokeWidth={2.5} aria-hidden="true" />
              </span>
            </span>
          </a>
        </section>
      </main>

      <footer className="nempo-home__footer">
        <div className="nempo-home__shell nempo-home__footer-inner">
          <span><strong>Nempo.id</strong> · jalan-jalan yang punya cerita.</span>
          <span>Jawa Barat, Indonesia</span>
        </div>
      </footer>
    </div>
  );
}