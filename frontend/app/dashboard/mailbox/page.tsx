import DashboardBottomNavigation from "@/screens/dashboard/DashboardBottomNavigation";
import Mailbox from "@/screens/dashboard/Mailbox";

const MailboxPage = () => {
  return (
    <div className="relative">
      {/* Bottom Navigation on mobile */}
      <DashboardBottomNavigation />

      <Mailbox />
    </div>
  );
};

export default MailboxPage;
