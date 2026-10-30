import "./_group.css";
import React from "react";
import {
  Building2,
  Globe,
  Heart,
  Instagram,
  Lightbulb,
  Mail,
} from "lucide-react";

const NavEventIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
    className={className}
  >
    <rect
      x="4"
      y="5.5"
      width="16"
      height="14.5"
      rx="2.2"
      fill="currentColor"
      opacity=".12"
      stroke="currentColor"
      strokeWidth="1.8"
    />
    <path
      d="M8 4v3M16 4v3M4.5 9.5h15"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
    <path
      d="m12 12 .7 1.6 1.8.2-1.3 1.2.4 1.8-1.6-.9-1.6.9.4-1.8-1.3-1.2 1.8-.2L12 12Z"
      fill="currentColor"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinejoin="round"
    />
  </svg>
);

const NavTalentIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
    className={className}
  >
    <circle
      cx="12"
      cy="8"
      r="3.5"
      fill="currentColor"
      opacity=".14"
      stroke="currentColor"
      strokeWidth="1.8"
    />
    <path
      d="M5 20c.5-3.7 2.9-5.7 7-5.7s6.5 2 7 5.7"
      fill="currentColor"
      opacity=".13"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
    <path
      d="m18.3 4.2.4 1 .9.4-.9.4-.4 1-.4-1-.9-.4.9-.4.4-1Z"
      fill="currentColor"
      stroke="currentColor"
      strokeWidth="1"
    />
  </svg>
);

const mainNavItems = [
  { id: "event-organizer", href: "/event-organizer", label: "Event Organizer", icon: NavEventIcon, color: "#6366F1", bg: "#E0E7FF" },
  { id: "wedding-organizer", href: "/price-list#layanan", label: "Wedding Organizer", icon: Heart, color: "#DB2777", bg: "#FCE7F3" },
  { id: "sosmed-management", href: "/price-list#paket-promosi", label: "Sosmed Management", icon: Instagram, color: "#E11D48", bg: "#FFE4E6" },
  { id: "wedding-invitation", href: "/digital-services#harga-satuan", label: "Wedding Invitation", icon: Mail, color: "#7C3AED", bg: "#F3E8FF" },
  { id: "web-development", href: "/digital-services#platforms", label: "Web Development", icon: Globe, color: "#0EA5E9", bg: "#E0F2FE" },
  { id: "design-creative", href: "/digital-services/marketing", label: "Design Creative", icon: Lightbulb, color: "#D97706", bg: "#FEF3C7" },
  { id: "talent-management", href: "/talent", label: "Talent Management", icon: NavTalentIcon, color: "#8B5CF6", bg: "#EDE9FE" },
  { id: "business-system", href: "/digital-services/super-app", label: "Business System", icon: Building2, color: "#0F766E", bg: "#CCFBF1" },
] as const;

function CategoryGrid() {
  return (
    <>
      <style>{`
        @keyframes serviceFloat {
          0%,100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
        .service-icon-card { animation: serviceFloat 3.5s ease-in-out infinite; }
        .service-icon-card:hover { animation: none; transform: translateY(-3px) scale(1.06); }
      `}</style>
      <div className="mx-auto grid w-full max-w-4xl grid-cols-4 gap-x-2 gap-y-5 sm:gap-x-5 sm:gap-y-7">
        {mainNavItems.map((item, idx) => {
          const Icon = item.icon;
          const [firstWord, ...remainingWords] = item.label.split(" ");
          return (
            <a
              key={item.id}
              href={item.href}
              onClick={(event) => event.preventDefault()}
              data-testid={`category-${item.id}`}
              className="group flex min-w-0 flex-col items-center gap-2.5"
            >
              <div
                className="service-icon-card relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-[16px] sm:h-14 sm:w-14"
                style={{
                  background: `linear-gradient(145deg, color-mix(in srgb, ${item.color} 72%, white) 0%, ${item.color} 58%, color-mix(in srgb, ${item.color} 76%, black) 100%)`,
                  boxShadow: `0 4px 0 ${item.color}90`,
                  animationDelay: `${idx * 0.12}s`,
                }}
              >
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 rounded-[inherit]"
                  style={{
                    background:
                      "radial-gradient(ellipse at 28% 18%, rgba(255,255,255,0.28) 0%, transparent 58%)",
                  }}
                />
                <Icon className="relative z-10 h-5 w-5 text-white sm:h-6 sm:w-6" />
              </div>
              <span className="w-full text-center text-[9px] font-bold leading-tight text-gray-700 sm:text-[11px]">
                <span className="block sm:inline">{firstWord}</span>{" "}
                <span className="block sm:inline">{remainingWords.join(" ")}</span>
              </span>
            </a>
          );
        })}
      </div>
    </>
  );
}

export function Current() {
  return (
    <main className="min-h-screen bg-[#f8fafc] px-5 pt-16">
      <CategoryGrid />
    </main>
  );
}
