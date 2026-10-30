import { Switch, Route, Router as WouterRouter } from "wouter";
import { useState } from "react";
import { Sidebar } from "@/components/sidebar";
import LoginPage from "@/pages/login";
import Dashboard from "@/pages/dashboard";
import WisataPage from "@/pages/wisata";
import KulinerPage from "@/pages/kuliner";
import CafePage from "@/pages/cafe";
import PenginapanPage from "@/pages/penginapan";
import EventsPage from "@/pages/events";
import BeritaPage from "@/pages/berita";
import SiteSettingsPage from "@/pages/site-settings";
import VouchersPage from "@/pages/vouchers";
import KamusSundaPage from "@/pages/kamus-sunda";
import TransportasiPage from "@/pages/transportasi";
import PriceListPage from "@/pages/price-list";
import PartnershipPage from "@/pages/partnership";
import DigitalServicesPage from "@/pages/digital-services";
import BannersPage from "@/pages/banners";
import PromoBannersPage from "@/pages/promo-banners";
import PartnersPage from "@/pages/partners";
import NotificationsPage from "@/pages/notifications";
import UsersPage from "@/pages/users";
import MitraPage from "@/pages/mitra";
import PasswordResetRequestsPage from "@/pages/password-reset-requests";
import DeleteAccountRequestsPage from "@/pages/delete-account-requests";
import UserActivitiesPage from "@/pages/user-activities";
import ReviewsPage from "@/pages/reviews";
import DonationsPage from "@/pages/donations";
import UserRewardsPage from "@/pages/user-rewards";
import EventOrdersPage from "@/pages/event-orders";
import JajanYukPage from "@/pages/jajan-yuk";
import TicketScannerPage from "@/pages/ticket-scanner";
import BpjsRegistrationsPage from "@/pages/bpjs-registrations";
import WithdrawalsPage from "@/pages/withdrawals";
import InfluencersPage from "@/pages/influencers";
import TalentAdminPage from "@/pages/talent";
import TalentPortfolioPage from "@/pages/talent-portfolio";
import TalentBannerPage from "@/pages/talent-banner";
import InfluencerBannerPhotosPage from "@/pages/influencer-banner-photos";
import EmailFailuresPage from "@/pages/email-failures";
import BackupPage from "@/pages/backup";

function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-64 text-gray-400">
      <p className="text-lg font-medium">Halaman tidak ditemukan</p>
    </div>
  );
}

function AdminLayout({ onLogout }: { onLogout: () => void }) {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar onLogout={onLogout} />
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-4 pt-20 pb-7 sm:px-6 sm:pt-20 lg:px-6 lg:py-7">
          <Switch>
            <Route path="/" component={Dashboard} />
            <Route path="/wisata" component={WisataPage} />
            <Route path="/kuliner" component={KulinerPage} />
            <Route path="/cafe" component={CafePage} />
            <Route path="/penginapan" component={PenginapanPage} />
            <Route path="/events" component={EventsPage} />
            <Route path="/event-orders" component={EventOrdersPage} />
            <Route path="/jajan-yuk" component={JajanYukPage} />
            <Route path="/ticket-scanner" component={TicketScannerPage} />
            <Route path="/berita" component={BeritaPage} />
            <Route path="/vouchers" component={VouchersPage} />
            <Route path="/kamus-sunda" component={KamusSundaPage} />
            <Route path="/transportasi" component={TransportasiPage} />
            <Route path="/price-list" component={PriceListPage} />
            <Route path="/partnership" component={PartnershipPage} />
            <Route path="/digital-services" component={DigitalServicesPage} />
            <Route path="/banners" component={BannersPage} />
            <Route path="/promo-banners" component={PromoBannersPage} />
            <Route path="/partners" component={PartnersPage} />
            <Route path="/notifications" component={NotificationsPage} />
            <Route path="/users" component={UsersPage} />
            <Route path="/mitra" component={MitraPage} />
            <Route path="/password-reset-requests" component={PasswordResetRequestsPage} />
            <Route path="/delete-account-requests" component={DeleteAccountRequestsPage} />
            <Route path="/user-activities" component={UserActivitiesPage} />
            <Route path="/reviews" component={ReviewsPage} />
            <Route path="/donations" component={DonationsPage} />
            <Route path="/user-rewards" component={UserRewardsPage} />
            <Route path="/bpjs-registrations" component={BpjsRegistrationsPage} />
            <Route path="/withdrawals" component={WithdrawalsPage} />
            <Route path="/influencers" component={InfluencersPage} />
            <Route path="/talent" component={TalentAdminPage} />
            <Route path="/talent-portfolio" component={TalentPortfolioPage} />
            <Route path="/talent-banner" component={TalentBannerPage} />
            <Route path="/influencer-banner-photos" component={InfluencerBannerPhotosPage} />
            <Route path="/email-failures" component={EmailFailuresPage} />
            <Route path="/backup" component={BackupPage} />
            <Route path="/settings" component={SiteSettingsPage} />
            <Route component={NotFound} />
          </Switch>
        </div>
      </main>
    </div>
  );
}

export default function App() {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("nempo_admin_token"));

  function handleLogout() {
    localStorage.removeItem("nempo_admin_token");
    localStorage.removeItem("nempo_admin_user");
    setToken(null);
  }

  if (!token) {
    return <LoginPage onLogin={setToken} />;
  }

  return (
    <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
      <AdminLayout onLogout={handleLogout} />
    </WouterRouter>
  );
}
