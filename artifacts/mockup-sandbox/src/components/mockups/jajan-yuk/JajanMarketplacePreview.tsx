import { useState } from "react";
import {
  ArrowDownUp,
  Check,
  ChevronRight,
  Clock3,
  Flame,
  Heart,
  MapPin,
  Plus,
  Star,
  Truck,
  UtensilsCrossed,
} from "lucide-react";

export type JajanPreviewVariant = "current" | "refined";

type JajanItem = {
  id: number;
  name: string;
  category: string;
  image: string;
  location: string;
  description: string;
  featured: boolean;
  rating: number | string | null;
  computed_rating: number | null;
  price_range: string | null;
};

const categoryGroups = [
  { label: "Jajanan & Street Food", art: "street", color: "#f97316", labelShort: "Street food" },
  { label: "Pedas & Berkuah", art: "spicy", color: "#ef4444", labelShort: "Pedas & berkuah" },
  { label: "Gorengan & Cemilan", art: "fried", color: "#16a34a", labelShort: "Gorengan" },
  { label: "Makanan Berat Pinggir Jalan", art: "heavy", color: "#d97706", labelShort: "Makanan berat" },
  { label: "Jajanan Manis & Minuman", art: "sweet", color: "#ec4899", labelShort: "Manis & minuman" },
  { label: "Kategori Khas Garut", art: "garut", color: "#b45309", labelShort: "Khas Garut" },
];

const merchants: JajanItem[] = [
  {
    id: 61,
    name: "Mie Baso Yamin Sariwangi",
    category: "Makanan Berat",
    image: "/__mockup/images/jajan-merchant-1.jpg",
    location: "Jayaraga, Tarogong Kidul, Garut",
    description: "Mie yamin dan baso dengan cita rasa gurih di kawasan Jayaraga.",
    featured: true,
    rating: "5.0",
    computed_rating: null,
    price_range: null,
  },
  {
    id: 72,
    name: "Kabita Snack",
    category: "Snack",
    image: "/__mockup/images/jajan-merchant-2.jpg",
    location: "Jl. Ahmad Yani, Garut Kota",
    description: "Aneka camilan lokal untuk dinikmati kapan saja.",
    featured: false,
    rating: "5.0",
    computed_rating: null,
    price_range: null,
  },
  {
    id: 73,
    name: "Bcl_snack Cabang Citimall Garut",
    category: "Snack",
    image: "/__mockup/images/jajan-merchant-3.jpg",
    location: "Jl. Jendral Sudirman, Karangpawitan",
    description: "Pilihan camilan praktis di sekitar Citimall Garut.",
    featured: false,
    rating: "5.0",
    computed_rating: null,
    price_range: null,
  },
];

const categoryStyles: Record<string, { color: string; bg: string }> = {
  "Makanan Berat": { color: "#c2410c", bg: "#fff1e8" },
  Snack: { color: "#475569", bg: "#f1f5f9" },
  Minuman: { color: "#0369a1", bg: "#e0f2fe" },
  Dessert: { color: "#be185d", bg: "#fce7f3" },
  "Oleh-oleh": { color: "#0f766e", bg: "#ccfbf1" },
  "Makanan Ringan": { color: "#15803d", bg: "#dcfce7" },
  "Street Food": { color: "#c2410c", bg: "#fff1e8" },
};

function getCategoryStyle(category: string) {
  return categoryStyles[category] || { color: "#c2410c", bg: "#fff1e8" };
}

function getRating(item: JajanItem) {
  const rating = Number(item.rating);
  return Number.isFinite(rating) && rating > 0 ? rating : item.computed_rating;
}

function getDeliveryEstimate(index: number) {
  const start = 20 + (index % 4) * 5;
  return `${start}–${start + 10} mnt`;
}

function JajanCategoryIllustration({
  kind,
}: {
  kind: "street" | "spicy" | "fried" | "heavy" | "sweet" | "garut";
}) {
  const stroke = "#6d3925";

  return (
    <svg aria-hidden="true" viewBox="0 0 72 72" className="h-[62px] w-[62px] drop-shadow-[0_4px_2px_rgba(92,48,24,0.18)]">
      {kind === "street" && (
        <>
          <ellipse cx="36" cy="61" rx="22" ry="5" fill="#d76d28" opacity=".3" />
          <path d="M18 15 30 52M34 11l2 42M50 15 40 52" stroke="#8b4a26" strokeWidth="2.4" strokeLinecap="round" />
          <path d="M18 15 30 52M34 11l2 42M50 15 40 52" stroke="#f8c66b" strokeWidth="1.2" strokeLinecap="round" />
          <circle cx="20" cy="21" r="7" fill="#f8e3b7" stroke={stroke} strokeWidth="1.5" />
          <circle cx="23" cy="35" r="7.2" fill="#f29c45" stroke={stroke} strokeWidth="1.5" />
          <circle cx="35" cy="20" r="7" fill="#f6b84f" stroke={stroke} strokeWidth="1.5" />
          <circle cx="37" cy="35" r="7.2" fill="#e86c43" stroke={stroke} strokeWidth="1.5" />
          <circle cx="49" cy="21" r="7" fill="#f5dfae" stroke={stroke} strokeWidth="1.5" />
          <circle cx="48" cy="35" r="7.2" fill="#ef8b52" stroke={stroke} strokeWidth="1.5" />
          <path d="M14 49c5-5 39-5 44 0v6c-6 5-38 5-44 0Z" fill="#fff4dd" stroke={stroke} strokeWidth="1.5" />
          <path d="M18 51c10 4 26 4 36 0" fill="none" stroke="#f2a249" strokeWidth="2" strokeLinecap="round" />
          <circle cx="18" cy="19" r="1.7" fill="#fff" opacity=".8" />
          <circle cx="34" cy="18" r="1.7" fill="#fff" opacity=".8" />
        </>
      )}
      {kind === "spicy" && (
        <>
          <path d="M25 16c-3-5 2-8 1-12M39 16c-3-5 2-8 1-12" fill="none" stroke="#f59e72" strokeWidth="2.2" strokeLinecap="round" />
          <path d="M13 32c2 19 12 27 23 27s21-8 23-27Z" fill="#f5c06e" stroke={stroke} strokeWidth="1.8" />
          <ellipse cx="36" cy="31" rx="23" ry="8" fill="#d94b2b" stroke={stroke} strokeWidth="1.8" />
          <ellipse cx="36" cy="31" rx="18" ry="5" fill="#f26b32" />
          <path d="M19 29c4-3 7 4 11 0s7 3 11 0 7 2 11-1" fill="none" stroke="#ffd485" strokeWidth="2" strokeLinecap="round" />
          <path d="M48 20c5-7 12-5 10 2-1 4-5 7-10 8 2-4 2-7 0-10Z" fill="#48a447" stroke={stroke} strokeWidth="1.5" />
          <path d="M51 21c2 2 4 3 6 2" fill="none" stroke="#d9ef9a" strokeWidth="1.2" strokeLinecap="round" />
          <circle cx="27" cy="34" r="2" fill="#fff1bd" />
          <circle cx="42" cy="34" r="2" fill="#fff1bd" />
        </>
      )}
      {kind === "fried" && (
        <>
          <ellipse cx="36" cy="58" rx="25" ry="5" fill="#d38b3b" opacity=".25" />
          <path d="M12 43c4-5 44-5 48 0l-4 14c-9 5-31 5-40 0Z" fill="#fff3d9" stroke={stroke} strokeWidth="1.5" />
          <path d="M18 43c5-4 31-4 36 0" fill="none" stroke="#ed9f40" strokeWidth="2" />
          <path d="m19 39 7-17 9 19Z" fill="#e7a04c" stroke={stroke} strokeWidth="1.5" />
          <path d="m31 40 7-20 10 21Z" fill="#f1b25c" stroke={stroke} strokeWidth="1.5" />
          <path d="m42 41 4-15 10 17Z" fill="#dc793b" stroke={stroke} strokeWidth="1.5" />
          <path d="M23 28 28 36M35 28l7 10M48 31l4 8" stroke="#ffd27b" strokeWidth="1.7" strokeLinecap="round" />
          <circle cx="17" cy="37" r="4.5" fill="#d95d35" stroke={stroke} strokeWidth="1.4" />
          <circle cx="17" cy="37" r="1.3" fill="#f9bc6a" />
          <path d="M13 16c4-4 9-4 12 0" fill="none" stroke="#f3b56a" strokeWidth="2" strokeLinecap="round" />
        </>
      )}
      {kind === "heavy" && (
        <>
          <ellipse cx="36" cy="59" rx="26" ry="5" fill="#a96f39" opacity=".26" />
          <ellipse cx="36" cy="46" rx="26" ry="12" fill="#fff2d3" stroke={stroke} strokeWidth="1.8" />
          <ellipse cx="36" cy="43" rx="20" ry="9" fill="#e9b85f" />
          <path d="M19 43c4-8 10-13 16-13 4 0 9 3 14 9-5 5-10 7-15 7-6 0-10-1-15-3Z" fill="#f7f0c5" stroke="#bd762f" strokeWidth="1.2" />
          <ellipse cx="45" cy="39" rx="7" ry="5.3" fill="#fff8dc" stroke="#bd762f" strokeWidth="1.2" />
          <circle cx="45" cy="39" r="2.8" fill="#f6b841" />
          <path d="M15 29c7-6 13-8 20-6M44 22c5 1 9 4 12 9" fill="none" stroke="#68a755" strokeWidth="3" strokeLinecap="round" />
          <path d="M18 24c-2-7 4-10 8-5 2 3 1 6-2 9-1-3-3-4-6-4Z" fill="#62a853" stroke={stroke} strokeWidth="1.2" />
          <path d="M51 21c2-5 8-4 8 1 0 3-3 5-7 6 1-3 1-5-1-7Z" fill="#e66d42" stroke={stroke} strokeWidth="1.2" />
        </>
      )}
      {kind === "sweet" && (
        <>
          <path d="M22 18h28l-3 39H25Z" fill="#f7d4ba" stroke={stroke} strokeWidth="1.6" />
          <path d="M23 25h26" stroke="#fff0d6" strokeWidth="3" opacity=".8" />
          <path d="M24 18c2-4 5-5 7-1 2-5 6-4 7 0 3-4 7-2 8 1Z" fill="#f17894" stroke={stroke} strokeWidth="1.5" />
          <circle cx="29" cy="38" r="2.6" fill="#6c4a3c" />
          <circle cx="39" cy="44" r="2.6" fill="#6c4a3c" />
          <circle cx="46" cy="35" r="2.6" fill="#6c4a3c" />
          <path d="M20 11c5 3 9 4 14 3M50 12c-4 3-7 4-11 3" fill="none" stroke="#e1a049" strokeWidth="2.2" strokeLinecap="round" />
          <path d="M35 8v14" stroke="#8b4a26" strokeWidth="2.4" strokeLinecap="round" />
          <path d="M18 59h34" stroke="#8b4a26" strokeWidth="2" strokeLinecap="round" />
        </>
      )}
      {kind === "garut" && (
        <>
          <ellipse cx="36" cy="60" rx="25" ry="5" fill="#9d6c36" opacity=".28" />
          <path d="M13 39c4-6 42-6 46 0v14c-7 7-39 7-46 0Z" fill="#d79b4d" stroke={stroke} strokeWidth="1.8" />
          <path d="M14 42c12 5 32 5 44 0M15 49c11 4 31 4 42 0M18 56c8 2 27 2 36-1" fill="none" stroke="#f2c976" strokeWidth="1.6" />
          <path d="M12 39c6-7 42-7 48 0-6 7-42 7-48 0Z" fill="#edbd67" stroke={stroke} strokeWidth="1.8" />
          <path d="M22 37c0-8 8-12 14-7 5-5 14-1 13 7Z" fill="#d98238" stroke={stroke} strokeWidth="1.5" />
          <path d="M27 35c3-5 7-5 10 0M38 35c2-4 5-4 7 0" fill="none" stroke="#f5cf7a" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M19 27c-3-6 3-10 7-5 2 3 1 6-2 8-1-3-3-4-5-3ZM51 27c3-6-3-10-7-5-2 3-1 6 2 8 1-3 3-4 5-3Z" fill="#67a354" stroke={stroke} strokeWidth="1.3" />
        </>
      )}
    </svg>
  );
}

function MerchantCard({
  item,
  index,
  added,
  onAdd,
  variant,
}: {
  item: JajanItem;
  index: number;
  added: boolean;
  onAdd: () => void;
  variant: JajanPreviewVariant;
}) {
  const refined = variant === "refined";
  const category = getCategoryStyle(item.category);
  const rating = getRating(item);

  return (
    <article
      className={`group flex overflow-hidden border transition duration-200 ${
        refined
          ? "flex-row gap-3 rounded-[1.35rem] border-[#eadfd5] bg-white p-2.5 shadow-[0_8px_22px_rgba(74,46,29,0.07)] hover:-translate-y-0.5 hover:border-orange-200 hover:shadow-[0_14px_28px_rgba(74,46,29,0.11)] xl:flex-col xl:gap-0 xl:p-2"
          : "rounded-2xl border-[#ebe7e3] bg-white p-2 shadow-[0_4px_16px_rgba(48,32,20,0.04)] hover:border-orange-200 hover:shadow-[0_12px_24px_rgba(48,32,20,0.09)] sm:p-2.5"
      }`}
    >
      <a href="#" onClick={(event) => event.preventDefault()} className={`block shrink-0 ${refined ? "xl:w-full" : ""}`}>
        <div
          className={`relative overflow-hidden bg-[#f7e9de] ${
            refined
              ? "h-[7rem] w-[6.75rem] rounded-[1rem] sm:h-32 sm:w-32 xl:h-44 xl:w-full xl:rounded-[1.15rem]"
              : "h-[7.5rem] w-[7.5rem] rounded-xl sm:h-36 sm:w-36"
          }`}
        >
          <img
            src={item.image}
            alt={item.name}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/5" />
          <span
            className={`absolute bottom-2 left-2 rounded-md px-2 py-1 text-[9px] font-black text-white shadow-sm ${
              refined ? "max-w-[calc(100%-1rem)] truncate" : ""
            }`}
            style={{ backgroundColor: category.color }}
          >
            {item.category}
          </span>
          {item.featured && (
            <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-white/95 px-2 py-1 text-[8px] font-black text-orange-700 shadow-sm">
              <Flame className="h-2.5 w-2.5 fill-orange-500 text-orange-500" />
              Pilihan
            </span>
          )}
        </div>
      </a>

      <div className={`min-w-0 flex-1 px-3 py-1 ${refined ? "flex flex-col px-0 sm:px-1 xl:px-3 xl:py-3" : "sm:px-4"}`}>
        <div className="flex items-start justify-between gap-2">
          <a href="#" onClick={(event) => event.preventDefault()} className="min-w-0">
            <h3 className={`font-black tracking-[-0.02em] text-[#2e211b] transition-colors group-hover:text-orange-700 ${
              refined ? "line-clamp-2 text-sm leading-tight sm:text-base" : "line-clamp-1 text-[15px] sm:text-base"
            }`}>
              {item.name}
            </h3>
          </a>
          {!refined && <Heart className="mt-0.5 h-4 w-4 shrink-0 text-[#d4c5ba]" />}
        </div>
        <div className="mt-1.5 flex min-w-0 items-center gap-1.5 text-[11px] font-medium text-[#8c7a6d]">
          {rating != null ? (
            <span className="inline-flex shrink-0 items-center gap-1 font-black text-[#6d5135]">
              <Star className="h-3.5 w-3.5 fill-[#f5b33f] text-[#f5b33f]" />
              {Number(rating).toLocaleString("id-ID", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
            </span>
          ) : (
            <span className="inline-flex shrink-0 items-center gap-1 font-bold text-[#9b8b80]">
              <Star className="h-3.5 w-3.5 text-[#d7c8bc]" />
              Baru
            </span>
          )}
          <span>·</span>
          <span className="truncate">{item.price_range || "Harga bersahabat"}</span>
        </div>
        <div className="mt-1.5 flex min-w-0 items-center gap-1.5 text-[11px] font-medium text-[#8c7a6d]">
          <MapPin className="h-3.5 w-3.5 shrink-0 text-orange-500" />
          <span className="truncate">{item.location}</span>
        </div>
        <div className={`mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] font-bold text-[#8c7a6d] ${refined ? "text-[#7d8c73]" : ""}`}>
          <span className="inline-flex items-center gap-1">
            <Clock3 className="h-3 w-3 text-emerald-600" />
            {getDeliveryEstimate(index)}
          </span>
          <span className="inline-flex items-center gap-1 text-emerald-700">
            <Truck className="h-3 w-3" />
            Info antar di detail
          </span>
        </div>
        <div className={`mt-3 flex items-center gap-2 ${refined ? "xl:mt-auto xl:pt-3" : ""}`}>
          <a
            href="#"
            onClick={(event) => event.preventDefault()}
            className={`inline-flex min-w-0 flex-1 items-center gap-1 text-[10px] font-black text-orange-700 hover:text-orange-800 sm:text-[11px] ${
              refined ? "rounded-lg border border-[#f2e4d7] px-2.5 py-2 xl:justify-center" : ""
            }`}
          >
            {refined ? "Lihat menu" : "Lihat menu & info"}
            <ChevronRight className="h-3 w-3 shrink-0" />
          </a>
          <button
            type="button"
            onClick={onAdd}
            className={`inline-flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-2 text-[10px] font-black transition active:scale-95 ${
              added
                ? "bg-emerald-600 text-white shadow-sm shadow-emerald-200"
                : refined
                  ? "bg-[#ee7a26] text-white shadow-[0_4px_10px_rgba(238,122,38,0.2)] hover:bg-[#d96816]"
                  : "bg-orange-500 text-white shadow-sm shadow-orange-200 hover:bg-orange-600"
            }`}
          >
            {added ? <Check className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
            {added ? "Dipilih" : "Pilih"}
          </button>
        </div>
      </div>
    </article>
  );
}

export function JajanMarketplacePreview({ variant }: { variant: JajanPreviewVariant }) {
  const refined = variant === "refined";
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeSpot, setActiveSpot] = useState("Semua spot");
  const [added, setAdded] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState(false);

  return (
    <main className="jajan-yuk-preview min-h-screen px-4 py-7 sm:px-6">
      <div className="mx-auto max-w-6xl space-y-7">
        <section>
          <div className={`relative mb-3 flex items-center justify-between gap-3 overflow-hidden border ${
            refined
              ? "min-h-[138px] rounded-[1.5rem] border-[#f0ddc7] bg-gradient-to-br from-[#fff5e9] via-[#fffaf3] to-[#f7e6d4] px-4 py-4 pr-28 sm:min-h-[158px] sm:pr-40"
              : "min-h-[158px] rounded-[1.75rem] border-[#eadfd5] bg-[#fff8ef] px-4 py-5 pr-32 shadow-[0_10px_24px_rgba(107,61,30,0.06)] sm:min-h-[190px] sm:px-5 sm:pr-52"
          }`}>
            <div className="relative z-10">
              <p className={`mb-1 text-[9px] font-black uppercase tracking-[0.18em] text-orange-700 ${refined ? "block" : "hidden"}`}>
                Jajan YUK · Garut
              </p>
              <h1 className="text-lg font-black tracking-tight text-[#2e211b] sm:text-xl">
                Jelajahi kategori jajan
              </h1>
              <p className={`mt-1 max-w-sm text-[11px] leading-relaxed text-[#967d6d] ${refined ? "max-w-[16rem] sm:max-w-sm" : ""}`}>
                Dari jajanan pinggir jalan sampai rasa khas Garut, tinggal pilih yang bikin ngiler.
              </p>
              {refined && (
                <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-white/80 px-2.5 py-1 text-[10px] font-bold text-[#80624e] ring-1 ring-[#eddcc9]">
                  <UtensilsCrossed className="h-3 w-3 text-orange-600" />
                  6 kategori pilihan
                </span>
              )}
            </div>
            <div className={`pointer-events-none absolute top-0 ${refined ? "-right-3 h-[150px] w-[150px] sm:right-1 sm:h-[180px] sm:w-[180px]" : "-right-3 h-[178px] w-[178px] sm:right-1 sm:h-[224px] sm:w-[224px]"}`}>
              <img src="/__mockup/images/ai-driver-nempo.png" alt="" className="h-full w-full object-contain opacity-95" />
              <span className="absolute left-[39%] top-[41%] inline-flex items-center gap-1 rounded-md bg-white px-1.5 py-1 shadow-[0_2px_8px_rgba(23,102,176,0.2)]">
                <img src="/__mockup/images/nempo-new.webp" alt="" className="h-4 w-4 object-contain" />
                <span className="flex flex-col text-left leading-none">
                  <strong className="text-[8px] font-black tracking-[-0.04em] text-[#1766b0]">Nempo.</strong>
                  <small className="mt-0.5 text-[5px] font-bold uppercase tracking-[0.16em] text-[#6f879d]">ID</small>
                </span>
              </span>
            </div>
          </div>
          <div className={`grid grid-cols-3 gap-2.5 sm:grid-cols-6 sm:gap-3 ${refined ? "items-stretch" : ""}`}>
            {categoryGroups.map(({ label, art, color, labelShort }, index) => {
              const active = activeCategory === label;
              const special = label === "Kategori Khas Garut";
              return (
                <button
                  key={label}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setActiveCategory(active ? null : label)}
                  className={`group flex min-w-0 flex-col items-center text-center transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-2 active:scale-95 ${
                    refined
                      ? `relative gap-2 rounded-[1.15rem] border px-2 py-3 shadow-[0_4px_14px_rgba(73,47,31,0.045)] hover:-translate-y-0.5 hover:shadow-md ${
                          active
                            ? "border-orange-300 bg-[#fff2e5] shadow-[0_6px_18px_rgba(238,122,38,0.12)]"
                            : "border-[#eee5db] bg-white hover:border-orange-200"
                        }`
                      : "jajan-category-button gap-2 rounded-[1.35rem] px-1.5 py-3 hover:-translate-y-1 hover:bg-transparent"
                  }`}
                >
                  <span
                    className={`jajan-category-icon relative flex h-[74px] w-[74px] shrink-0 items-center justify-center overflow-hidden rounded-[22px] transition-shadow ${
                      refined ? "h-16 w-16 rounded-[19px]" : ""
                    } ${
                      active
                        ? "ring-2 ring-orange-500 ring-offset-2"
                        : special
                          ? "ring-2 ring-amber-300 ring-offset-2"
                          : ""
                    }`}
                    style={{
                      background: `linear-gradient(160deg, color-mix(in srgb, ${color} 20%, white), color-mix(in srgb, ${color} 6%, white))`,
                      animationDelay: `${index * 0.15}s`,
                    }}
                  >
                    <span className="pointer-events-none absolute inset-0 rounded-[22px] bg-[radial-gradient(ellipse_at_28%_18%,rgba(255,255,255,0.72)_0%,transparent_58%)]" />
                    <JajanCategoryIllustration kind={art as "street" | "spicy" | "fried" | "heavy" | "sweet" | "garut"} />
                  </span>
                  <span className={`w-full text-[10px] font-bold leading-tight ${
                    active
                      ? "text-orange-700"
                      : special
                        ? "text-amber-800"
                        : refined
                          ? "text-[#6e5748]"
                          : "text-gray-600"
                  }`}>
                    {refined ? labelShort : labelShort}
                  </span>
                  {refined && active && <Check className="absolute right-2 top-2 h-3.5 w-3.5 text-orange-600" />}
                </button>
              );
            })}
          </div>
        </section>

        <section>
          <div className={`mb-3 flex items-center justify-between gap-4 ${
            refined
              ? "rounded-[1.25rem] border border-[#f0e2d4] bg-[#fff8f1] p-3.5"
              : "rounded-2xl border border-[#eadfd5] bg-[#fff8f0] p-3.5 shadow-sm"
          }`}>
            <div className="flex min-w-0 items-center gap-3">
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${refined ? "bg-white text-orange-600 ring-1 ring-[#f0dfcc]" : "bg-orange-100 text-orange-600"}`}>
                <MapPin className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-[10px] font-bold text-[#967d6d]">Jajan di sekitar Garut</p>
                <h2 className="mt-0.5 text-base font-black tracking-tight text-[#2e211b]">Mau jajan di area mana?</h2>
              </div>
            </div>
            <span className="inline-flex shrink-0 rounded-full border border-[#f2d2b8] bg-[#fff1e5] px-2.5 py-1.5 text-[10px] font-bold text-[#b45309]">
              8 area
            </span>
          </div>
          <div className="scrollbar-hide -mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0">
            {["Semua spot", "Pasar Ceplak", "Kerkof", "Simpang Lima", "Pemda", "Pengkolan"].map((spot) => {
              const active = activeSpot === spot;
              return (
                <button
                  key={spot}
                  type="button"
                  onClick={() => setActiveSpot(spot)}
                  className={`inline-flex shrink-0 items-center gap-2 rounded-full border px-3.5 py-2.5 text-xs font-black transition active:scale-95 ${
                    active
                      ? "border-orange-500 bg-orange-500 text-white shadow-md shadow-orange-200"
                      : "border-[#e9e2dc] bg-white text-[#6f594b] hover:border-orange-300 hover:text-orange-700"
                  }`}
                >
                  <MapPin className={`h-3.5 w-3.5 ${active ? "text-orange-100" : "text-orange-500"}`} />
                  {spot}
                </button>
              );
            })}
          </div>
        </section>

        <section>
          <div className="mb-4 flex items-end justify-between gap-3">
            <div>
              <p className={`mb-1 text-[9px] font-black uppercase tracking-[0.18em] text-orange-700 ${refined ? "block" : "hidden"}`}>
                Pilihan warga Garut
              </p>
              <h2 className="text-xl font-black tracking-tight text-[#2e211b]">
                {activeCategory || "Semua pilihan di Garut"}
              </h2>
              <p className={`mt-1 text-[11px] text-[#9a877b] ${refined ? "block" : "hidden"}`}>
                {merchants.length} merchant siap kamu jelajahi
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <span className={`text-xs font-bold text-[#a08e82] ${refined ? "hidden sm:inline" : "hidden sm:inline"}`}>
                48 merchant
              </span>
              <button
                type="button"
                onClick={() => setSortBy((value) => !value)}
                className={`inline-flex items-center gap-1.5 rounded-full border border-[#e9e2dc] bg-white px-3 py-2 text-[10px] font-black text-[#806f63] transition hover:border-orange-300 hover:text-orange-700 ${
                  refined ? "rounded-xl bg-[#fffaf4] px-3.5 py-2.5" : ""
                }`}
              >
                <ArrowDownUp className="h-3.5 w-3.5 text-orange-500" />
                {sortBy ? "Rating tertinggi" : "Rekomendasi"}
              </button>
            </div>
          </div>
          <div className={refined ? "grid gap-3.5 md:grid-cols-2 xl:grid-cols-3" : "space-y-3"}>
            {merchants.map((item, index) => (
              <MerchantCard
                key={item.id}
                item={item}
                index={index}
                added={added === item.id}
                onAdd={() => setAdded(added === item.id ? null : item.id)}
                variant={variant}
              />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}