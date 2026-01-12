import WalletBottomNavigation from "@/screens/walletDashboard/WalletBottomNavigation";
import WalletHome from "@/screens/walletDashboard/WalletHome";

const DashboardPage = () => {
  return (
    <div className="relative">
      {/* Bottom Navigation on mobile */}
      <WalletBottomNavigation />
      <WalletHome />
    </div>
  );
};

export default DashboardPage;
