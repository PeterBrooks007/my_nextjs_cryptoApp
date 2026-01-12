// app/auth/layout.tsx
import type { Metadata } from "next";
import AuthSideBar from "@/screens/auth/AuthSidebar";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Auth | Tradexs10",
  description: "Authentication pages",
};

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (token) redirect("/dashboard"); // redirect immediately if no token

  return (
    <div className="w-full flex flex-col md:flex-row h-auto md:h-screen overflow-hidden">
      {/* Left Side (Sidebar) */}
      <AuthSideBar />

      {/* Right Side (Main Content) */}
      <div className="flex-1  xl:flex-[0_0_60%] 2xl:flex-[0_0_65%] w-full h-full overflow-auto">
        {children}
      </div>
    </div>
  );
}
