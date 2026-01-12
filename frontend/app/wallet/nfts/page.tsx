import Nfts from "@/screens/walletDashboard/Nfts";
import WalletBottomNavigation from "@/screens/walletDashboard/WalletBottomNavigation";

const NftsPage = () => {
  return (
    <div className="relative">
      {/* Bottom Navigation on mobile */}
      <WalletBottomNavigation />
      <Nfts />
    </div>
  );
};

export default NftsPage;
