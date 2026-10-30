import { useState, type ComponentType, type SVGProps } from 'react';
import { ChefHat, ChevronDown, Shield } from 'lucide-react';
import {
  NavAdventureIcon,
  NavBeritaIcon,
  NavCafeIcon,
  NavCeritaIcon,
  NavDigiIcon,
  NavEventIcon,
  NavHomeIcon,
  NavHotelIcon,
  NavInfluencerIcon,
  NavJajanIcon,
  NavKerjaSamaIcon,
  NavKulinerIcon,
  NavKomunitasIcon,
  NavMerchandiseIcon,
  NavSponsorshipIcon,
  NavTalentIcon,
  NavTravelIcon,
  NavWisataIcon,
} from './Glyphs';

type NavIcon = ComponentType<SVGProps<SVGSVGElement>>;
type NavItem = {
  href: string;
  label: string;
  icon: NavIcon;
  color?: string;
  bg?: string;
};

const mainNavItems: NavItem[] = [
  { href: '/wisata', label: 'Wisata', icon: NavWisataIcon, color: '#0EA5E9', bg: '#E0F2FE' },
  { href: '/kuliner', label: 'Kuliner', icon: NavKulinerIcon, color: '#EF4444', bg: '#FEE2E2' },
  { href: '/warung', label: 'Warung', icon: ChefHat, color: '#B45309', bg: '#FEF3C7' },
  { href: '/jajan-yuk', label: 'Jajan YUK', icon: NavJajanIcon, color: '#EA580C', bg: '#FFF7ED' },
  { href: '/cafe', label: 'Cafe', icon: NavCafeIcon, color: '#7c3aed', bg: '#EDE9FE' },
  { href: '/event', label: 'Event', icon: NavEventIcon, color: '#6366F1', bg: '#E0E7FF' },
  { href: '/berita', label: 'Berita', icon: NavBeritaIcon, color: '#F97316', bg: '#FFEDD5' },
  { href: '/cerita-rakyat', label: 'Cerita Rakyat', icon: NavCeritaIcon, color: '#92400E', bg: '#FEF3C7' },
];

const moreNavItems: NavItem[] = [
  { href: '/penginapan', label: 'Hotel', icon: NavHotelIcon },
  { href: '/adventure-gear', label: 'Adventure', icon: NavAdventureIcon },
  { href: '/komunitas', label: 'Komunitas', icon: NavKomunitasIcon },
  { href: '/merchandise', label: 'Merchandise', icon: NavMerchandiseIcon },
  { href: '/itinerary', label: 'Travel', icon: NavTravelIcon },
];

const businessNavItems: NavItem[] = [
  { href: '/digital-services', label: 'Digi Nempo', icon: NavDigiIcon },
  { href: '/price-list', label: 'Kerja Sama', icon: NavKerjaSamaIcon },
  { href: '/sponsorship', label: 'Sponsorship', icon: NavSponsorshipIcon },
  { href: '/talent', label: 'Talent', icon: NavTalentIcon },
  { href: '/influencer-hub', label: 'Influencer & Kreator', icon: NavInfluencerIcon },
];

const compactPrimaryHrefs = new Set(['/wisata', '/kuliner', '/jajan-yuk', '/event', '/berita']);
const movedToMore = mainNavItems.filter((item) => !compactPrimaryHrefs.has(item.href));

export function NavPreviewBase({ compact }: { compact: boolean }) {
  const [location, setLocation] = useState('/');
  const [moreOpen, setMoreOpen] = useState(false);
  const isActive = (href: string) =>
    href === '/' ? location === '/' : location.startsWith(href);
  const compactMoreItems = [...moreNavItems, ...movedToMore];
  const visibleMainItems = compact
    ? mainNavItems.filter((item) => compactPrimaryHrefs.has(item.href))
    : mainNavItems;
  const visibleMoreItems = compact ? compactMoreItems : moreNavItems;
  const isBusinessActive = businessNavItems.some((item) => isActive(item.href));
  const isMoreActive = isBusinessActive ||
    (compact && compactMoreItems.some((item) => isActive(item.href)));

  const followRoute = (event: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    event.preventDefault();
    setLocation(href);
  };

  return (
    <div className="nempo-navbar-preview min-h-screen">
      <div
        className="hidden md:block"
        style={{
          background: 'linear-gradient(to bottom, #f8faff 0%, #f0f4ff 100%)',
          borderTop: '1px solid rgba(0,100,210,0.08)',
        }}
      >
        <div className="max-w-7xl mx-auto px-3 lg:px-8">
          <div className="flex items-center h-12">
            <div
              className="flex items-center gap-0.5 lg:gap-1 flex-1 min-w-0 overflow-x-auto h-full"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              <a
                href="/"
                onClick={(event) => followRoute(event, '/')}
                className="shrink-0"
              >
                <div
                  className={`flex items-center gap-1.5 px-2.5 lg:px-3.5 py-1.5 rounded-xl text-[13px] font-semibold transition-all duration-200 cursor-pointer select-none whitespace-nowrap ${
                    isActive('/')
                      ? 'text-white shadow-md shadow-blue-500/30'
                      : 'text-gray-500 hover:text-[#0194f3] hover:bg-blue-50'
                  }`}
                  style={isActive('/') ? { background: 'linear-gradient(135deg,#0194f3,#0EA5E9)' } : {}}
                >
                  <NavHomeIcon className="h-3.5 w-3.5 shrink-0" />
                  Beranda
                </div>
              </a>

              <div className="h-5 w-px bg-gray-200 mx-0.5 shrink-0" />

              {visibleMainItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={(event) => followRoute(event, item.href)}
                    className="shrink-0"
                  >
                    <div
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[13px] font-semibold transition-all duration-200 cursor-pointer select-none whitespace-nowrap"
                      style={active
                        ? { background: item.color, color: '#fff', boxShadow: `0 3px 10px ${item.color}50` }
                        : { color: '#64748b' }}
                      onMouseEnter={(event) => {
                        if (!active) {
                          event.currentTarget.style.background = item.bg ?? '';
                          event.currentTarget.style.color = item.color ?? '#64748b';
                        }
                      }}
                      onMouseLeave={(event) => {
                        if (!active) {
                          event.currentTarget.style.background = '';
                          event.currentTarget.style.color = '#64748b';
                        }
                      }}
                    >
                      <div
                        className="h-5 w-5 rounded-md flex items-center justify-center shrink-0"
                        style={{ background: active ? 'rgba(255,255,255,0.25)' : item.bg }}
                      >
                        <Icon className="h-3.5 w-3.5" style={{ color: active ? '#fff' : item.color }} />
                      </div>
                      {item.label}
                    </div>
                  </a>
                );
              })}
            </div>

            <div className="relative shrink-0 ml-1">
              <button
                type="button"
                aria-expanded={moreOpen}
                aria-haspopup="true"
                onClick={() => setMoreOpen((open) => !open)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[13px] font-semibold transition-all duration-200 ${
                  isMoreActive
                    ? 'text-blue-700 bg-blue-50'
                    : 'text-gray-500 hover:text-gray-800 hover:bg-gray-100'
                }`}
              >
                <div className={`h-5 w-5 rounded-md flex items-center justify-center ${isMoreActive ? 'bg-blue-100' : 'bg-gray-100'}`}>
                  <ChevronDown className={`h-3 w-3 transition-transform duration-200 ${isMoreActive ? 'text-blue-600' : 'text-gray-500'} ${moreOpen ? 'rotate-180' : ''}`} />
                </div>
                Lainnya
              </button>
              {moreOpen && (
                <div className="absolute top-full right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl shadow-black/10 border border-gray-100 py-2 z-50 overflow-hidden animate-in fade-in zoom-in-95 slide-in-from-top-2 duration-150">
                  <div className="px-3 pb-1.5 pt-0.5">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Lebih Banyak</p>
                  </div>
                  {visibleMoreItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <a
                        key={item.href}
                        href={item.href}
                        onClick={(event) => {
                          followRoute(event, item.href);
                          setMoreOpen(false);
                        }}
                        className="flex items-center gap-3 px-3 py-2 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-700 transition-colors mx-1 rounded-xl"
                      >
                        <div className="h-7 w-7 rounded-xl flex items-center justify-center shrink-0" style={{ background: '#EFF6FF' }}>
                          <Icon className="h-3.5 w-3.5" style={{ color: '#3b82f6' }} />
                        </div>
                        <span className="font-medium">{item.label}</span>
                      </a>
                    );
                  })}
                  <div className="mx-1 my-1 border-t border-gray-100" />
                  <div className="px-3 pb-1.5 pt-1">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Bisnis &amp; Kolaborasi</p>
                  </div>
                  {businessNavItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <a
                        key={item.href}
                        href={item.href}
                        onClick={(event) => {
                          followRoute(event, item.href);
                          setMoreOpen(false);
                        }}
                        className="flex items-center gap-3 px-3 py-2 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-700 transition-colors mx-1 rounded-xl"
                      >
                        <div className="h-7 w-7 rounded-xl flex items-center justify-center shrink-0" style={{ background: '#F0FDFA' }}>
                          <Icon className="h-3.5 w-3.5" style={{ color: '#0F766E' }} />
                        </div>
                        <span className="font-medium">{item.label}</span>
                      </a>
                    );
                  })}
                  <div className="mx-1 my-1 border-t border-gray-100" />
                  <a
                    href="/crew"
                    onClick={(event) => {
                      followRoute(event, '/crew');
                      setMoreOpen(false);
                    }}
                    className="flex items-center gap-3 px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors mx-1 rounded-xl"
                  >
                    <div className="h-7 w-7 rounded-xl flex items-center justify-center shrink-0 bg-red-50">
                      <Shield className="h-3.5 w-3.5 text-red-500" />
                    </div>
                    <span className="font-semibold">LO Panitia Nempo.id</span>
                    <span className="ml-auto text-[9px] font-extrabold px-1.5 py-0.5 rounded-full bg-red-100 text-red-500 uppercase tracking-wide">Internal</span>
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
