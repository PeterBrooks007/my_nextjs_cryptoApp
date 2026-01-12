import Navbar from "@/components/Navbar";
import AppSidebar from "@/components/AppSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { cookies } from "next/headers";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Dashboard | Tradexs10",
  description: "Dashboard pages",
};

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();

  // --- Sidebar state ---
  const sidebarCookie = cookieStore.get("sidebar_state")?.value;
  const defaultOpen = sidebarCookie === "true" || sidebarCookie === undefined;

  // --- Authentication [ Protected Routes ] ---
  const token = cookieStore.get("token")?.value;

  if (!token) redirect("/auth/login"); // redirect immediately if no token

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <AppSidebar />
      <main className="w-full">
        <Navbar />
        <div className="px-3 sm:p-4 pt-4 pb-4">{children}</div>
      </main>
    </SidebarProvider>
  );
}
