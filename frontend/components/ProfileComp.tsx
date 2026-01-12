"use client";

import Image from "next/image";
import {
  Camera,
  HandCoins,
  PiggyBank,
  ChevronRight,
  Bell,
  Languages,
  Lock,
  Moon,
  IdCard,
  Headphones,
  HelpCircle,
  Power,
  BookUser,
  Wallet,
  CircleDollarSign,
  Trophy,
  XCircle,
  CloudUpload,
  ShieldCheck,
} from "lucide-react";
import TopBar from "./TopBar";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import {
  use2faAuthentication,
  useCurrentUser,
  useLogout,
  useUpdatePhoto,
} from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "./ui/card";
import { useCoinpaprika } from "@/hooks/useCoinpaprika";
import { CoinpaprikaCoin, UserAsset } from "@/types";
import { useTheme } from "next-themes";
import { useConversionRateStore } from "@/store/conversionRateStore";
import { toast } from "sonner";
import { Spinner } from "./ui/spinner";
import { useRouter } from "next/navigation";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "./ui/sheet";
import { ScrollArea } from "./ui/scroll-area";
import ReferralSystem from "./ReferralSystem";
import EditProfile from "./EditProfile";
import SecuritySystem from "./SecuritySystem";
import AccountVerifications from "./AccountVerifications";
import ContactUs from "./ContactUs";
import PrivacyPolicyPage from "./PrivacyAndPolicy";
import FaqsPage from "./Faqs";
import Language from "./Language";

export default function ProfileComp() {
  const { data: user } = useCurrentUser();
  const { resolvedTheme } = useTheme();

  const router = useRouter();

  const { allCoins, isLoading: coinpaprikaLoading } = useCoinpaprika(
    user?.currency.code
  );

  const [openReferralDrawer, setOpenReferralDrawer] = useState(false);
  const [openEditProfileDrawer, setOpenEditProfileDrawer] = useState(false);
  const [openLanguageDrawer, setOpenLanguageDrawer] = useState(false);
  const [openChangePasswordDrawer, setopenChangePasswordDrawer] =
    useState(false);
  const [openVerificationDrawer, setOpenVerificationDrawer] = useState(false);
  const [openContactUs, setOpenContactUs] = useState(false);
  const [openPolicy, setOpenPolicyMenu] = useState(false);
  const [openFaqs, setOpenFaqs] = useState(false);

  const { conversionRate } = useConversionRateStore();

  const combinedAssets = user?.assets?.map((asset: UserAsset) => {
    const priceData = allCoins?.find(
      (price: CoinpaprikaCoin) => price?.symbol === asset?.symbol?.toUpperCase()
    );

    if (priceData) {
      const totalValue =
        asset.balance * priceData?.quotes?.[user?.currency?.code]?.price;
      return {
        ...asset,
        price: priceData?.quotes?.[user?.currency.code]?.price,
        totalValue,
      };
    }
    return { ...asset, price: 0, totalValue: 0 };
  });

  // console.log(combinedAssets);

  const totalWalletBalance = Array.isArray(combinedAssets)
    ? combinedAssets.reduce((acc, asset) => acc + asset.totalValue, 0)
    : 0;

  const totalWalletBalanceManual = Array.isArray(user?.assets)
    ? user?.assets.reduce(
        (total, asset) => total + (asset.ManualFiatbalance || 0),
        0
      )
    : 0;

  // ======== Start of change profile picture ============//
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  console.log(imagePreview);

  // useUpdatePhoto mutation
  const { mutate, isPending } = useUpdatePhoto(setImagePreview);

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null; // ✅ safe access
    if (!file) return;

    if (file) {
      setProfileImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const savePhoto = () => {
    if (!profileImage) {
      return toast.error("Please add a Profile image");
    }

    // ✅ File type validation
    const validImageTypes = ["image/jpeg", "image/jpg", "image/png"];
    if (!validImageTypes.includes(profileImage.type)) {
      toast.error("Invalid file type. Only JPEG and PNG are allowed.");
      return;
    }

    // ✅ File size validation
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

    if (profileImage.size > MAX_FILE_SIZE) {
      toast.error("File size exceeds the 5MB limit.");
      return;
    }

    // FormData for sending image + data
    const formData = new FormData();
    formData.append("image", profileImage);

    mutate(formData);
  };

  // =============== End of change profile picture ==============//

  // ============ Start of 2faAuthentication ==============//
  const { mutate: twofaAuthMutate, isPending: twofaAuthIsPending } =
    use2faAuthentication();

  const [checked, setChecked] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      if (user) {
        setChecked(user?.isTwoFactorEnabled);
      }
    }, 0);
  }, [user]);

  // Handle switch change
  const handleSwitchChange = (isChecked: boolean) => {
    setChecked(isChecked);

    setTimeout(() => {
      handleFormSubmit(isChecked);
    }, 600);
  };
  const handleFormSubmit = async (isChecked: boolean) => {
    const userData = {
      isTwoFactorEnabled: isChecked,
    };

    console.log(userData);

    await twofaAuthMutate(userData);
  };

  // ============= End of 2faAuthentication ============== //

  // =========== Start of Logout user ================//

  const { mutate: logoutMutate } = useLogout();

  const logoutUser = async () => {
    await logoutMutate();

    //use timer so it first remove token completely before navigation to avoid _layout redirect glitch seen in the url
    setTimeout(() => {
      router.replace("/auth/login");
    }, 300);
  };

  return (
    <div className="flex flex-col gap-4 p-2">
      <TopBar />

      {/* Profile Card  Section*/}
      <Card className="relative rounded-2xl overflow-hidden p-0 ">
        <div
          className="relative h-22.5 bg-cover bg-center"
          style={{
            backgroundImage: `linear-gradient(rgba(0,0,0,.4),rgba(0,0,0,.4)), url("/SL_022321_41020_08.jpg")`,
          }}
        >
          <div className="absolute rounded-full border left-1/2 top-full -translate-x-1/2 -translate-y-1/2">
            <Button
              variant={"default"}
              size={"icon-sm"}
              className="absolute bottom-0 right-0 rounded-full  cursor-pointer bg-muted text-gray-600 dark:text-white"
              onClick={handleButtonClick}
            >
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                hidden
                onChange={handleImageChange}
              />
              {isPending ? <Spinner /> : <Camera className="size-5!" />}
            </Button>

            <Image
              src={
                imagePreview ??
                (user?.photo ? user.photo : "/qrCode_placeholder.jpg")
              }
              alt="profile"
              width={300}
              height={300}
              sizes="(max-width: 640px) 250px, 250px"
              className="size-30 rounded-full border-2 border-border bg-background object-cover"
            />
          </div>
        </div>

        {imagePreview && (
          <div className="absolute top-0 w-full flex justify-center items-center gap-2">
            <Button
              size="sm"
              variant="default"
              disabled={isPending}
              onClick={savePhoto}
            >
              {isPending ? <Spinner /> : <CloudUpload />}
              Upload Photo
            </Button>
            <Button
              size="sm"
              variant="default"
              disabled={isPending}
              onClick={() => setImagePreview(null)}
            >
              <XCircle />
              Cancel upload
            </Button>
          </div>
        )}

        <div className="mt-10 mb-5 text-center">
          <h2 className="text-xl font-semibold">
            {user?.firstname} {user?.lastname}
          </h2>
          <p className="text-sm text-muted-foreground">
            {user?.email} | {user?.accounttype}
          </p>
        </div>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        {/* Trade Balance */}
        <Card className="flex flex-row items-center gap-3 rounded-xl py-3 px-3">
          <CircleDollarSign className="size-8" />
          <div>
            <p className="text-xs text-muted-foreground">Trade Balance</p>
            <p className="text-base xs:text-lg  2xl:text-xl font-semibold">
              {conversionRate?.rate
                ? Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: conversionRate.code,
                    ...((user?.balance ?? 0) * conversionRate.rate > 999999
                      ? { notation: "compact" }
                      : {}),
                  }).format((user?.balance ?? 0) * conversionRate.rate)
                : Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: user?.currency?.code || "USD", // Added fallback for currency code too
                    ...((user?.balance ?? 0) > 999999
                      ? { notation: "compact" }
                      : {}),
                  }).format(user?.balance ?? 0)}
            </p>
          </div>
        </Card>

        {/* Wallet Balance */}
        <Card className="flex flex-row items-center gap-3 rounded-xl py-3 px-3">
          <Wallet className="size-8" />
          <div>
            <p className="text-xs text-muted-foreground">Wallet Balance</p>
            <div className="text-base xs:text-lg 2xl:text-xl font-semibold">
              {coinpaprikaLoading ? (
                <Skeleton className="h-4 w-24 bg-gray-500/50" />
              ) : user?.isManualAssetMode ? (
                <p className=" font-semibold ">
                  {Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: user?.currency?.code || "USD",
                    ...(totalWalletBalanceManual > 999999
                      ? { notation: "compact" }
                      : {}),
                  }).format(totalWalletBalanceManual)}
                </p>
              ) : (
                <div className="font-semibold ">
                  {coinpaprikaLoading ? (
                    <Skeleton className="w-25 h-5 mt-2  bg-gray-500/30" />
                  ) : allCoins.length !== 0 ? (
                    Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: user?.currency?.code || "USD",
                      ...(totalWalletBalance > 999999
                        ? { notation: "compact" }
                        : {}),
                    }).format(totalWalletBalance)
                  ) : (
                    "UNAVAILABLE"
                  )}
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Total Deposit */}
        <Card className="flex flex-row items-center gap-3 rounded-xl py-3 px-3">
          <HandCoins className="size-8" />
          <div>
            <p className="text-xs text-muted-foreground">Total Deposit</p>
            <p className="text-base xs:text-lg 2xl:text-xl font-semibold">
              {conversionRate?.rate
                ? Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: conversionRate.code,
                    ...((user?.totalDeposit ?? 0) * conversionRate.rate > 999999
                      ? { notation: "compact" }
                      : {}),
                  }).format((user?.totalDeposit ?? 0) * conversionRate.rate)
                : Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: user?.currency?.code || "USD", // Added fallback for currency code too
                    ...((user?.totalDeposit ?? 0) > 999999
                      ? { notation: "compact" }
                      : {}),
                  }).format(user?.totalDeposit ?? 0)}
            </p>
          </div>
        </Card>

        {/* Profit Earned */}
        <Card className="flex flex-row items-center gap-3 rounded-xl py-3 px-3">
          <PiggyBank className="size-8" />
          <div>
            <p className="text-xs text-muted-foreground">Profit Earned</p>
            <p className="text-base xs:text-lg 2xl:text-xl font-semibold">
              {conversionRate?.rate
                ? Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: conversionRate.code,
                    ...((user?.earnedTotal ?? 0) * conversionRate.rate > 999999
                      ? { notation: "compact" }
                      : {}),
                  }).format((user?.earnedTotal ?? 0) * conversionRate.rate)
                : Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: user?.currency?.code || "USD", // Added fallback for currency code too
                    ...((user?.earnedTotal ?? 0) > 999999
                      ? { notation: "compact" }
                      : {}),
                  }).format(user?.earnedTotal ?? 0)}
            </p>
          </div>
        </Card>
      </div>

      {/* Demo balance referral bonus section */}
      <Card className="rounded-xl gap-1 py-2 ">
        <div className="flex justify-between p-2 px-4">
          <span className="flex items-center gap-2 text-sm xs:text-base">
            <CircleDollarSign /> Demo Balance
          </span>
          <span className="font-semibold">
            {conversionRate?.rate
              ? Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: conversionRate.code,
                  ...((user?.demoBalance ?? 0) * conversionRate.rate > 999999
                    ? { notation: "compact" }
                    : {}),
                }).format((user?.demoBalance ?? 0) * conversionRate.rate)
              : Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: user?.currency?.code || "USD", // Added fallback for currency code too
                  ...((user?.demoBalance ?? 0) > 999999
                    ? { notation: "compact" }
                    : {}),
                }).format(user?.demoBalance ?? 0)}
          </span>
        </div>

        <div className="flex justify-between p-2 px-4">
          <span className="flex items-center gap-2 text-sm xs:text-base">
            <CircleDollarSign /> Referral Bonus
          </span>
          <span className="font-semibold">
            {conversionRate?.rate
              ? Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: conversionRate.code,
                  ...((user?.referralBonus ?? 0) * conversionRate.rate > 999999
                    ? { notation: "compact" }
                    : {}),
                }).format((user?.referralBonus ?? 0) * conversionRate.rate)
              : Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: user?.currency?.code || "USD", // Added fallback for currency code too
                  ...((user?.referralBonus ?? 0) > 999999
                    ? { notation: "compact" }
                    : {}),
                }).format(user?.referralBonus ?? 0)}
          </span>
        </div>

        <div
          onClick={() => setOpenReferralDrawer(true)}
          className="flex justify-between cursor-pointer p-2 px-4"
        >
          <span className="flex items-center gap-2 text-sm xs:text-base">
            <Trophy /> Referral System
          </span>
          <ChevronRight />
        </div>
      </Card>

      {/* Edit Profile, notification section */}
      <Card className="rounded-xl gap-1 py-2 ">
        <div
          onClick={() => setOpenEditProfileDrawer(true)}
          className="flex justify-between cursor-pointer p-2 px-4 "
        >
          <span className="flex items-center gap-2 text-sm xs:text-base">
            <BookUser /> Edit Profile Information
          </span>
          <ChevronRight />
        </div>

        <div className="flex justify-between items-center cursor-not-allowed p-2 px-4 ">
          <span className="flex items-center gap-2 text-sm xs:text-base">
            <Bell /> Notification
          </span>
          <Switch
            checked
            className="h-6 w-10 [&>span]:h-5 [&>span]:w-5 rounded-full"
            disabled
          />
        </div>

        <div
          onClick={() => setOpenLanguageDrawer(true)}
          className="flex justify-between cursor-pointer text-sm xs:text-base p-2 px-4 "
        >
          <span className="flex items-center gap-2">
            <Languages /> Language
          </span>
          <span className="flex items-center gap-1">
            English <ChevronRight size={16} />
          </span>
        </div>
      </Card>

      {/* Change Password, 2fa Authentication section */}
      <Card className="rounded-xl gap-1 py-2 ">
        <div
          onClick={() => setopenChangePasswordDrawer(true)}
          className="flex justify-between cursor-pointer p-2 px-4 "
        >
          <span className="flex items-center gap-2 text-sm xs:text-base">
            <Lock /> Change Password
          </span>
          <ChevronRight />
        </div>

        <div className="flex justify-between items-center p-2 px-4 ">
          <span className="flex items-center gap-2 text-sm xs:text-base">
            <Lock /> 2FA Authentication
          </span>
          <div className="flex items-center gap-2">
            {twofaAuthIsPending && <Spinner />}

            <Switch
              className="h-6 w-10 [&>span]:h-5 [&>span]:w-5 rounded-full"
              checked={checked}
              onCheckedChange={handleSwitchChange}
              name="switch1"
            />
          </div>
        </div>

        <div className="flex justify-between items-center text-sm xs:text-base p-2 px-4 ">
          <span className="flex items-center gap-2 ">
            <Moon /> Theme
          </span>
          <span
            // onClick={colorMode.toggleColorMode}
            className="flex items-center gap-1 cursor-pointer capitalize"
          >
            {resolvedTheme} Mode
          </span>
        </div>

        <div
          onClick={() => setOpenVerificationDrawer(true)}
          className="flex justify-between cursor-pointer p-2 px-4"
        >
          <span className="flex items-center gap-2 text-sm xs:text-base">
            <IdCard /> Verifications
          </span>
          <ChevronRight />
        </div>
      </Card>

      {/* Help & support, privacy section */}
      <Card className="rounded-xl gap-1 py-2 ">
        <div
          onClick={() => setOpenContactUs(true)}
          className="flex justify-between cursor-pointer p-2 px-4"
        >
          <span className="flex items-center gap-2 text-sm xs:text-base">
            <Headphones /> Help & Support
          </span>
          <ChevronRight />
        </div>
        <div
          onClick={() => setOpenPolicyMenu(true)}
          className="flex justify-between cursor-pointer p-2 px-4"
        >
          <span className="flex items-center gap-2 text-sm xs:text-base">
            <ShieldCheck /> Privacy Policy
          </span>
          <ChevronRight />
        </div>

        <div
          onClick={() => setOpenFaqs(true)}
          className="flex justify-between cursor-pointer p-2 px-4"
        >
          <span className="flex items-center gap-2 text-sm xs:text-base">
            <HelpCircle /> FAQ
          </span>
          <ChevronRight />
        </div>
      </Card>

      {/* Logout */}
      <Card className="rounded-xl gap-1 py-2 " onClick={logoutUser}>
        <div className="flex justify-between cursor-pointer text-destructive  p-2 px-4 ">
          <span className="flex items-center gap-2 text-sm xs:text-base">
            <Power /> LOGOUT
          </span>
          <ChevronRight />
        </div>
      </Card>

      {/* REFFERAL SHEET  */}
      <Sheet open={openReferralDrawer} onOpenChange={setOpenReferralDrawer}>
        <SheetContent className="w-full! max-w-lg! sm:min-w-full! lg:min-w-4xl!  data-[state=closed]:duration-300 data-[state=open]:duration-300">
          <SheetHeader className="border-b">
            <SheetTitle className="flex gap-2">
              {" "}
              <Trophy /> Referral System
            </SheetTitle>
          </SheetHeader>

          <ScrollArea className="h-full overflow-y-auto">
            {openReferralDrawer && (
              <div className="mx-4">
                <ReferralSystem />
              </div>
            )}
          </ScrollArea>

          <SheetFooter className="border-t">
            <SheetClose asChild>
              <Button variant="outline">Close</Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* EDIT PROFILE SHEET  */}
      <Sheet
        open={openEditProfileDrawer}
        onOpenChange={setOpenEditProfileDrawer}
      >
        <SheetContent className="w-full! max-w-lg!  data-[state=closed]:duration-300 data-[state=open]:duration-300">
          <SheetHeader className="border-b">
            <SheetTitle className="flex gap-2">
              <BookUser /> Profile Information
            </SheetTitle>
          </SheetHeader>

          <ScrollArea className="h-full overflow-y-auto">
            {openEditProfileDrawer && (
              <Card className="mx-4 p-4">
                <EditProfile />
              </Card>
            )}
          </ScrollArea>

          <SheetFooter className="border-t">
            <SheetClose asChild>
              <Button variant="outline">Close</Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* LANGUAGE SHEET  */}
      <Sheet open={openLanguageDrawer} onOpenChange={setOpenLanguageDrawer}>
        <SheetContent className="w-full! max-w-lg!  data-[state=closed]:duration-300 data-[state=open]:duration-300">
          <SheetHeader className="border-b">
            <SheetTitle className="flex gap-2">
              <Languages /> Select Language
            </SheetTitle>
          </SheetHeader>

          <ScrollArea className="h-full overflow-y-auto">
            {openLanguageDrawer && <Language />}
          </ScrollArea>

          {/* <SheetFooter className="border-t">
            <SheetClose asChild>
              <Button variant="outline">Close</Button>
            </SheetClose>
          </SheetFooter> */}
        </SheetContent>
      </Sheet>

      {/* CHANGE PASSWORD SHEET  */}
      <Sheet
        open={openChangePasswordDrawer}
        onOpenChange={setopenChangePasswordDrawer}
      >
        <SheetContent className="w-full! max-w-lg! sm:min-w-full! lg:min-w-4xl!  data-[state=closed]:duration-300 data-[state=open]:duration-300">
          <SheetHeader className="border-b">
            <SheetTitle className="flex gap-2">
              {" "}
              <Lock /> Security System
            </SheetTitle>
          </SheetHeader>

          <ScrollArea className="h-full overflow-y-auto">
            {openChangePasswordDrawer && (
              <div className="mx-4">
                <SecuritySystem />
              </div>
            )}
          </ScrollArea>

          <SheetFooter className="border-t">
            <SheetClose asChild>
              <Button variant="outline">Close</Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* VERIFICATIONS PASSWORD SHEET  */}
      <Sheet
        open={openVerificationDrawer}
        onOpenChange={setOpenVerificationDrawer}
      >
        <SheetContent className="w-full! max-w-lg! sm:min-w-full! lg:min-w-4xl!   data-[state=closed]:duration-300 data-[state=open]:duration-300">
          <SheetHeader className="border-b">
            <SheetTitle className="flex gap-2">
              <IdCard /> Verifications System
            </SheetTitle>
          </SheetHeader>

          <ScrollArea className="h-full overflow-y-auto">
            {openVerificationDrawer && (
              <div className="mx-4">
                <AccountVerifications />
              </div>
            )}
          </ScrollArea>

          <SheetFooter className="border-t">
            <SheetClose asChild>
              <Button variant="outline">Close</Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* CONTACT SUPPORT SHEET  */}
      <Sheet open={openContactUs} onOpenChange={setOpenContactUs}>
        <SheetContent className="w-full! max-w-lg!  data-[state=closed]:duration-300 data-[state=open]:duration-300">
          <SheetHeader className="border-b">
            <SheetTitle className="flex gap-2">
              <Headphones /> Contact Us
            </SheetTitle>
          </SheetHeader>

          <ScrollArea className="h-full overflow-y-auto">
            {openContactUs && (
              <div className="mx-4">
                <ContactUs />
              </div>
            )}
          </ScrollArea>

          <SheetFooter className="border-t">
            <SheetClose asChild>
              <Button variant="outline">Close</Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* PRIVACY POLICY SUPPORT SHEET  */}
      <Sheet open={openPolicy} onOpenChange={setOpenPolicyMenu}>
        <SheetContent className="w-full! max-w-lg! sm:max-w-4xl!  data-[state=closed]:duration-300 data-[state=open]:duration-300">
          <SheetHeader className="border-b">
            <SheetTitle className="flex gap-2">
              <ShieldCheck /> Privacy Policy
            </SheetTitle>
          </SheetHeader>

          <ScrollArea className="h-full overflow-y-auto">
            {openPolicy && (
              <div className="mx-2">
                <PrivacyPolicyPage />
              </div>
            )}
          </ScrollArea>

          <SheetFooter className="border-t">
            <SheetClose asChild>
              <Button variant="outline">Close</Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* FAQ SHEET  */}
      <Sheet open={openFaqs} onOpenChange={setOpenFaqs}>
        <SheetContent className="w-full! max-w-lg! sm:max-w-4xl!  data-[state=closed]:duration-300 data-[state=open]:duration-300">
          <SheetHeader className="border-b">
            <SheetTitle className="flex gap-2">
              <HelpCircle /> FAQs
            </SheetTitle>
          </SheetHeader>

          <ScrollArea className="h-full overflow-y-auto">
            {openFaqs && (
              <div className="mx-2">
                <FaqsPage />
              </div>
            )}
          </ScrollArea>

          <SheetFooter className="border-t">
            <SheetClose asChild>
              <Button variant="outline">Close</Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
