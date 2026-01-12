import Assets from "@/screens/walletDashboard/Assets";
import WalletBottomNavigation from "@/screens/walletDashboard/WalletBottomNavigation";

const AssetsPage = () => {
  return (
    <div className="relative">
      {/* Bottom Navigation on mobile */}
      <WalletBottomNavigation />
      <Assets />
    </div>
  );
};

export default AssetsPage;
