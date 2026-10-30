import type { ReactNode } from "react";

type SEOProps = { title: string; description: string; keywords: string; path: string };
export function SEO(_props: SEOProps) { return null; }
export const NEMPO_INSTAGRAM_DM_URL = "https://www.instagram.com/";

export function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <div className="ct-preview-shell">
        <div className="ct-preview-top"><strong>Nempo.<small>ID</small></strong><span>LOKASI KAMU · Garut</span><b>Masuk</b></div>
        <nav aria-label="Navigasi Nempo"><span>Beranda</span><span>Wisata</span><span>Kuliner</span><span>Jajan YUK</span><span>Event</span><span>Berita</span><span>Lainnya</span></nav>
      </div>
      {children}
    </>
  );
}
