"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Moon, Sun, Monitor, ChevronDown, Laptop } from "lucide-react";
import { useTheme } from "next-themes";

interface Props {
  writeUp: string;
  buttonText: string;
  link: string;
  accountSetup?: boolean;
}

export default function AuthMobileHeader({
  writeUp,
  buttonText,
  link,
  accountSetup,
}: Props) {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Ensure theme hydration
  useState(() => {
    setMounted(true);
  });

  if (!mounted) return null;

  const logoutUser = () => {
    // You can add Redux dispatch or API logout here if needed
    router.push("/auth/login");
  };

  return (
    <div className="flex w-full items-center justify-between md:justify-end p-3">
      {/* Logo Section */}
      <div
        className="flex items-center gap-2 cursor-pointer md:hidden"
        onClick={() => router.push("/")}
      >
        <h1 className="text-lg font-semibold">TRADEXS10</h1>
        <Image
          src="/favicon_logo.png"
          alt="logo"
          width={36}
          height={36}
          className="object-contain"
        />
      </div>

      {/* Right Section */}
      {!accountSetup && (
        <div className="flex items-center gap-3">
          {/* THEME MENU */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Sun className="h-[1.3rem]! w-[1.3rem]! scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
                <Moon className="absolute h-[1.3rem]! w-[1.3rem]! scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
                <span className="sr-only">Toggle theme</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setTheme("light")}>
                <Sun /> Light
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("dark")}>
                <Moon /> Dark
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("system")}>
                <Laptop /> System
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Text */}
          <p className="hidden sm:flex text-sm text-muted-foreground">
            {writeUp}
          </p>

          {/* Action Button */}
          <Button
            onClick={() =>
              link === "logoutUser" ? logoutUser() : router.push(link)
            }
            className="rounded-xl bg-green-600 hover:bg-green-700 text-white px-4 py-2 font-medium"
          >
            {buttonText}
          </Button>
        </div>
      )}
    </div>
  );
}
