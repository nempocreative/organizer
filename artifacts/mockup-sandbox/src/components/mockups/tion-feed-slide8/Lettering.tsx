import "./_group.css";

export function Lettering() {
  return (
    <main className="slide8-stage">
      <article
        aria-label="Pembuka seri empat rekomendasi font untuk membuat konten."
        className="slide8-poster"
        style={{
          backgroundImage:
            'linear-gradient(180deg, rgba(16, 20, 16, 0.3) 0%, rgba(14, 20, 16, 0.12) 34%, rgba(10, 16, 13, 0.68) 100%), url("/__mockup/images/tion-feed-slide8/cafe.webp")',
        }}
      >
        <img
          src="/__mockup/images/tion-feed-slide8/wordmark.png"
          alt="Nasution Boy"
          className="slide8-wordmark"
          draggable={false}
        />
        <div className="slide8-cover">
          <div className="slide8-cover__content">
            <h1>
              <span>Font seru</span>
              <span className="slide8-cover__accent">buat ngonten</span>
            </h1>
          </div>
          <p className="slide8-cover__swipe">SWIPE UNTUK LIHAT CONTOH →</p>
        </div>
      </article>
    </main>
  );
}
