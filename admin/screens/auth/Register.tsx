"use client";

import { useState } from "react";
import Image from "next/image";
import { Eye, EyeOff, Lock, Mail, User, ShieldCheck, FileText } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
// import { toast } from "sonner";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();

  // Local state
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!termsAccepted) {
      // toast.error("You must agree to the Terms and Privacy Policy.");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      // toast.success("Account created successfully!");
      router.push("/auth/verify-email");
    }, 1500);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-10 bg-background relative">
      {/* Background watermark */}
      <div className="absolute opacity-10 top-0 right-0 w-40 h-40 rotate-12">
        <Image src="/logo.svg" alt="logo" width={160} height={160} />
      </div>

      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-bold">Create Your Account</h1>
          <p className="text-sm text-muted-foreground">
            Let’s get started by creating a free account
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* First Name */}
          <div className="space-y-2">
            <Label htmlFor="firstname">First Name</Label>
            <div className="relative">
              <User className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
              <Input
                id="firstname"
                name="firstname"
                placeholder="John"
                className="pl-10"
                required
              />
            </div>
          </div>

          {/* Last Name */}
          <div className="space-y-2">
            <Label htmlFor="lastname">Last Name</Label>
            <div className="relative">
              <User className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
              <Input
                id="lastname"
                name="lastname"
                placeholder="Doe"
                className="pl-10"
                required
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="john@example.com"
                className="pl-10"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="pl-10 pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-muted-foreground"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="space-y-2">
            <Label htmlFor="confirm">Confirm Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
              <Input
                id="confirm"
                name="confirm"
                type={showConfirm ? "text" : "password"}
                placeholder="••••••••"
                className="pl-10 pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-2.5 text-muted-foreground"
              >
                {showConfirm ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Terms */}
          <div className="flex items-start space-x-2">
            <Checkbox
              id="terms"
              checked={termsAccepted}
              onCheckedChange={(checked) => setTermsAccepted(!!checked)}
            />
            <Label
              htmlFor="terms"
              className="text-sm text-muted-foreground cursor-pointer"
            >
              I agree to the{" "}
              <Link
                href="#"
                className="text-primary underline underline-offset-4"
              >
                Terms
              </Link>{" "}
              and{" "}
              <Link
                href="#"
                className="text-primary underline underline-offset-4"
              >
                Privacy Policy
              </Link>
            </Label>
          </div>

          {/* Submit Button */}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Creating..." : "Create Account"}
          </Button>

          {/* Divider */}
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <FileText className="w-4 h-4" />
            or sign up with
            <ShieldCheck className="w-4 h-4" />
          </div>

          <Button variant="outline" className="w-full">
            Sign up with Google
          </Button>

          {/* Footer */}
          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-primary underline">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
