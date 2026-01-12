import DashboardBottomNavigation from "@/screens/dashboard/DashboardBottomNavigation";
import Profile from "@/screens/dashboard/Profile";

const ProfilePage = () => {
  return (
    <div className="relative">
      {/* Bottom Navigation on mobile */}
      <DashboardBottomNavigation />

      <Profile />
    </div>
  );
};

export default ProfilePage;
