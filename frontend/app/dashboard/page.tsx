import DashboardBottomNavigation from "@/screens/dashboard/DashboardBottomNavigation";
import DashboardHome from "@/screens/dashboard/DashboardHome";

const DashboardPage = () => {
  return (
    <div className="relative">
      {/* Bottom Navigation on mobile */}
      <DashboardBottomNavigation />

      <DashboardHome />
    </div>
  );
};

export default DashboardPage;
