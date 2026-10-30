import "./_group.css";

export function Current() {
  return (
    <main className="slide8-stage">
      <article
        aria-label="Slide 8 foto kafe vintage di Garut."
        className="slide8-poster"
        style={{
          backgroundImage:
            'linear-gradient(180deg, rgba(18, 12, 8, 0.42) 0%, rgba(18, 12, 8, 0.24) 30%, rgba(18, 12, 8, 0.04) 56%, transparent 70%), url("/__mockup/images/tion-feed-slide8/cafe.webp")',
        }}
      >
        <img
          src="/__mockup/images/tion-feed-slide8/wordmark.png"
          alt="Nasution Boy"
          className="slide8-wordmark"
          draggable={false}
        />
        <div
          role="note"
          aria-label="Tempat singgah saat hari terasa dingin."
          className="slide8-note"
        >
          <p>
            Tempat singgah
            <br />
            saat hari terasa dingin.
          </p>
        </div>
      </article>
    </main>
  );
}
