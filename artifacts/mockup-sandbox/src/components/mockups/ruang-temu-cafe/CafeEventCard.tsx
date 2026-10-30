import { Coffee, Music, Tv, Mic, BookOpen, Users, MapPin, CalendarDays, Star } from "lucide-react";

type CafeBadge = { label: string; color: string; Icon: any };

function detectCafeBadge(title: string): CafeBadge {
  const t = (title || "").toLowerCase();
  if (t.includes("nobar"))                                       return { label: "Nobar",      color: "#c2410c", Icon: Tv };
  if (t.includes("live") || t.includes("musik") || t.includes("acoustic")) return { label: "Live Music", color: "#7c3aed", Icon: Music };
  if (t.includes("workshop"))                                    return { label: "Workshop",   color: "#0172B1", Icon: BookOpen };
  if (t.includes("arisan"))                                      return { label: "Arisan",     color: "#b45309", Icon: Users };
  if (t.includes("talkshow") || t.includes("talk show"))         return { label: "Talkshow",   color: "#16a34a", Icon: Mic };
  if (t.includes("komunitas"))                                   return { label: "Komunitas",  color: "#0ea5e9", Icon: Users };
  return { label: "Event Cafe", color: "#92400e", Icon: Coffee };
}

function CafeEventCard({ ev }: { ev: Record<string, any> }) {
  const { label: badgeLabel, color: badgeColor, Icon: BadgeIcon } = detectCafeBadge(ev.title || ev.name || "");
  const dateStr = ev.date
    ? new Date(ev.date).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })
    : "";

  return (
    <a
      href="#"
      onClick={(e) => e.preventDefault()}
      className="shrink-0 snap-center block group"
      style={{ width: "min(82vw, 300px)", minWidth: 240 }}
    >
      <div
        className="relative rounded-3xl overflow-hidden transition-all duration-300 group-hover:-translate-y-1"
        style={{ aspectRatio: "3 / 4", boxShadow: "0 8px 24px rgba(0,0,0,0.16)" }}
      >
        {/* Full-bleed photo */}
        {ev.image
          ? <img src={ev.image} alt={ev.title || ev.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
          : (
            <div className="absolute inset-0" style={{ background: "linear-gradient(145deg, #78350f 0%, #92400e 35%, #b45309 65%, #d97706 100%)" }}>
              <div className="absolute inset-0 flex items-center justify-center opacity-10">
                <Coffee className="w-20 h-20 text-white" strokeWidth={1} />
              </div>
            </div>
          )
        }
        {/* Gradient overlay bottom */}
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.35) 38%, rgba(0,0,0,0.05) 62%, rgba(0,0,0,0) 100%)" }} />

        {/* Badge pill — top left */}
        <div
          className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold text-white leading-none"
          style={{ background: badgeColor, boxShadow: "0 2px 8px rgba(0,0,0,0.28)" }}
        >
          <BadgeIcon className="w-3 h-3 shrink-0" strokeWidth={2.5} />
          {badgeLabel}
        </div>

        {/* Unggulan badge — top right */}
        {ev.featured && (
          <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-400 text-amber-900 leading-none">
            <Star className="w-2.5 h-2.5 shrink-0 fill-amber-900" strokeWidth={0} />
            Unggulan
          </div>
        )}

        {/* Text block over image bottom */}
        <div className="absolute bottom-0 left-0 right-0 px-4 pb-4">
          <h3 className="font-extrabold text-white text-[16px] leading-snug line-clamp-2 mb-2">
            {ev.title || ev.name}
          </h3>
          <div className="flex items-center gap-1.5 min-w-0 mb-1">
            <MapPin className="h-3 w-3 shrink-0 text-white/75" strokeWidth={2} />
            <span className="text-[11px] text-white/85 font-medium truncate">{ev.location}</span>
          </div>
          <div className="flex items-center gap-1.5 min-w-0 mb-2">
            <CalendarDays className="h-3 w-3 shrink-0 text-white/75" strokeWidth={2} />
            <span className="text-[11px] text-white/85 font-medium truncate">{dateStr}</span>
          </div>
          <p className="font-black text-base leading-none" style={{ color: "#fbbf24" }}>
            {ev.price === 0 ? "Gratis" : `Rp ${Number(ev.price).toLocaleString("id")}`}
          </p>
        </div>
      </div>
    </a>
  );
}

const MOCK_EVENTS = [
  {
    id: 1,
    title: "Live Acoustic Malam Jumat",
    location: "Kopi Ranggon, Jl. Ciledug",
    date: "2026-07-18",
    price: 25000,
    featured: true,
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: 2,
    title: "Nobar Persib vs Bali United",
    location: "Warkop Rasa Sayang",
    date: "2026-07-20",
    price: 0,
    featured: false,
    image: "https://images.unsplash.com/photo-1518091043644-c1d4457512c6?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: 3,
    title: "Workshop Kopi Susu Kekinian",
    location: "Nempo Coffee Space",
    date: "2026-07-25",
    price: 50000,
    featured: false,
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=800&auto=format&fit=crop",
  },
];

export default function CafeEventCardPreview() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-8">
      <div className="flex gap-4 overflow-x-auto snap-x pb-2 max-w-full">
        {MOCK_EVENTS.map((ev) => (
          <CafeEventCard key={ev.id} ev={ev} />
        ))}
      </div>
    </div>
  );
}
