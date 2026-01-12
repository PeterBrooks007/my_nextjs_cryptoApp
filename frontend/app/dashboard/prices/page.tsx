import DashboardBottomNavigation from "@/screens/dashboard/DashboardBottomNavigation";
import Prices from "../../../screens/dashboard/Prices";

const PricePage = () => {
  return (
    <div className="relative">
      {/* Bottom Navigation on mobile */}
      <DashboardBottomNavigation />

      <Prices />
    </div>
  );
};

export default PricePage;
