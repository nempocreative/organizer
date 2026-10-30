import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Instagram } from "lucide-react";
import { creatorProfiles } from "./profiles";
import "./_group.css";
import "./Banner.css";

export function AutoSlider() {
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const [visibleCount, setVisibleCount] = useState(4);
  const [maxSlide, setMaxSlide] = useState(creatorProfiles.length - 4);
  const [stepWidth, setStepWidth] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useLayoutEffect(() => {
    const viewport = viewportRef.current;
    const track = trackRef.current;
    const firstCard = track?.firstElementChild;
    if (!viewport || !track || !(firstCard instanceof HTMLElement)) return;

    const measure = () => {
      const cardWidth = firstCard.getBoundingClientRect().width;
      const gap = Number.parseFloat(window.getComputedStyle(track).columnGap) || 0;
      const count = Math.max(1, Math.floor((viewport.clientWidth + gap) / (cardWidth + gap)));
      setVisibleCount(count);
      setMaxSlide(Math.max(0, creatorProfiles.length - count));
      setStepWidth(cardWidth + gap);
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(viewport);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setPrefersReducedMotion(mediaQuery.matches);
    updatePreference();
    mediaQuery.addEventListener("change", updatePreference);
    return () => mediaQuery.removeEventListener("change", updatePreference);
  }, []);

  useEffect(() => {
    if (isPaused || prefersReducedMotion || maxSlide === 0) return;

    const interval = window.setInterval(() => {
      if (document.visibilityState === "visible") {
        setActiveSlide((current) => (current >= maxSlide ? 0 : current + 1));
      }
    }, 5200);

    return () => window.clearInterval(interval);
  }, [activeSlide, isPaused, maxSlide, prefersReducedMotion]);

  useEffect(() => {
    setActiveSlide((current) => Math.min(current, maxSlide));
  }, [maxSlide]);

  const showPrevious = () => {
    setActiveSlide((current) => (current <= 0 ? maxSlide : current - 1));
  };

  const showNext = () => {
    setActiveSlide((current) => (current >= maxSlide ? 0 : current + 1));
  };

  return (
    <main className="creator-team-page">
      <section
        className="creator-team"
        aria-label="Creator Team Nempo"
        aria-roledescription="carousel"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onFocusCapture={() => setIsPaused(true)}
        onBlurCapture={(event) => {
          const nextTarget = event.relatedTarget;
          if (!(nextTarget instanceof Node) || !event.currentTarget.contains(nextTarget)) {
            setIsPaused(false);
          }
        }}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
        onTouchCancel={() => setIsPaused(false)}
      >
        <header className="creator-team__header">
          <div className="creator-team__intro">
            <p className="creator-team__eyebrow">Nempo · Garut</p>
            <h2 className="creator-team__title">Creator Team</h2>
            <p className="creator-team__service">
              Kolaborator untuk wedding, event, dan konten.
            </p>
            <p className="creator-team__disclosure">Foto contoh AI</p>
          </div>

          <a
            className="creator-team__contact"
            href="https://ig.me/m/nempo.id"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Hubungi Nempo melalui Instagram"
          >
            <Instagram aria-hidden="true" />
            <span>Instagram</span>
          </a>
        </header>

        <div className="creator-team__carousel-row">
          <div className="creator-team__viewport" ref={viewportRef}>
            <div
              className="creator-team__track"
              ref={trackRef}
              style={{ transform: `translate3d(-${activeSlide * stepWidth}px, 0, 0)` }}
            >
              {creatorProfiles.map((creator, index) => {
                const isVisible = index >= activeSlide && index < activeSlide + visibleCount;
                return (
                  <article
                    className="creator-team__card"
                    key={creator.image}
                    role="group"
                    aria-roledescription="slide"
                    aria-label={`Potret contoh AI ${index + 1} dari ${creatorProfiles.length}`}
                    aria-hidden={!isVisible}
                  >
                    <div className="creator-team__portrait">
                      <img
                        src={creator.image}
                        alt="Potret contoh AI, bukan anggota tim Nempo"
                        loading={index < visibleCount ? "eager" : "lazy"}
                        draggable={false}
                      />
                      <span className="creator-team__index" aria-hidden="true">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>

          <nav className="creator-team__controls" aria-label="Navigasi foto creator">
            <span className="creator-team__count" aria-hidden="true">
              {String(activeSlide + 1).padStart(2, "0")}
              <span>/</span>
              {String(maxSlide + 1).padStart(2, "0")}
            </span>
            <button
              className="creator-team__arrow"
              type="button"
              aria-label="Tampilkan foto sebelumnya"
              onClick={showPrevious}
            >
              <ArrowLeft aria-hidden="true" />
            </button>
            <button
              className="creator-team__arrow"
              type="button"
              aria-label="Tampilkan foto berikutnya"
              onClick={showNext}
            >
              <ArrowRight aria-hidden="true" />
            </button>
          </nav>
        </div>
      </section>
    </main>
  );
}
