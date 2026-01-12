import { ScrollArea } from "@/components/ui/scroll-area";
import DashboardSidebar from "@/screens/dashboard/DashboardSidebar";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();

  // --- Authentication [ Protected Routes ] ---
  const token = cookieStore.get("token")?.value;

  if (!token) redirect("/auth/login"); // redirect immediately if no token

  return (
    <div className="flex h-screen md:overflow-hidden bg-card/50">
      <div className="hidden lg:block w-16 flex-none py-5">
        <DashboardSidebar />
      </div>
      <ScrollArea className="grow bg-background overflow-y-auto overflow-x-hidden m-0 lg:m-4 lg:ml-0 lg:border-2  rounded-none lg:rounded-xl shadow">
        {children}
      </ScrollArea>
    </div>
  );
}
