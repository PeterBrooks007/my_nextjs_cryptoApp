"use client";

import { useEffect, useState } from "react";
import {
  Zap,
  HandCoins,
  ShoppingCart,
  Lock,
  ShieldCheck,
  DollarSign,
  CreditCard,
  CheckCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
// import CardComponent from "../cardComponent/CardComponent";
import useWindowSize from "@/hooks/useWindowSize";
import { useCurrentUser, useRequestCard } from "@/hooks/useAuth";
import CardComponent from "./cardComponent/CardComponent";
import { Spinner } from "./ui/spinner";

export default function CardComponentDrawer() {
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setPageLoading(false);
    }, 300);
  }, []);

  const size = useWindowSize();

  const { data: user } = useCurrentUser();

  const [tab, setTab] = useState<"virtual" | "physical">("virtual");
  const [openSide, setOpenSide] = useState(true);

  const { mutate, isPending } = useRequestCard();

  const requestCardNow = async () => {
    const payload = {
      firstname: user?.firstname,
      lastname: user?.lastname,
      email: user?.email,
      phone: user?.phone,
      country: user?.address?.country,
      cardType: tab === "virtual" ? "Virtual Card" : "Physical Card",
    };

    // console.log(payload);

    await mutate(payload);
  };

  if (pageLoading) {
    return (
      <div className="flex w-full  px-4 justify-center">
        <Spinner className="size-8 mt-6" />
      </div>
    );
  }

  return (
    <div className=" w-full md:w-105 h-full rounded-none">
      {/* ================= CONFIRM VIEW ================= */}
      <div
        className={`w-full absolute inset-0 transition-opacity duration-300 ${
          openSide ? "opacity-0 invisible" : "opacity-100 visible"
        }`}
      >
        <div className="h-full p-4 pt-0 flex flex-col">
          <div className="rounded-xl bg-muted/70 p-4 space-y-2">
            <h3 className="font-semibold">Personal Information</h3>
            <div className="flex justify-between text-sm">
              <span>First Name</span>
              <span className="font-medium">{user?.firstname}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Last Name</span>
              <span className="font-medium">{user?.lastname}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Email</span>
              <span className="font-medium">{user?.email}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Phone</span>
              <span className="font-medium">{user?.phone}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Country</span>
              <span className="font-medium">{user?.address?.country}</span>
            </div>
          </div>

          <div className="rounded-xl bg-muted/70 p-4 space-y-2 mt-3">
            <h3 className="font-semibold">Account Details</h3>
            <div className="flex justify-between items-center">
              <span className="text-sm">Wallet Balance</span>
              <CheckCircle className="text-green-600 h-5 w-5" />
            </div>
          </div>

          <div className="rounded-xl bg-muted/70 p-4 space-y-2 mt-3">
            <h3 className="font-semibold">Transaction Limit</h3>
            <div className="rounded-lg bg-green-600 text-white px-3 py-1 text-sm">
              You can customise the limit after card has been issued
            </div>
            <div className="flex justify-between text-sm">
              <span>Daily Limit</span>
              <span className="font-medium">NO LIMIT</span>
            </div>
          </div>

          <div className="flex gap-2 pt-4 mr-2">
            <Button
              variant="outline"
              className="w-1/2"
              onClick={() => setOpenSide(true)}
            >
              Cancel
            </Button>
            <Button
              variant={"default"}
              className="w-1/2 bg-green-600 hover:bg-green-700 text-white"
              disabled={isPending}
              onClick={requestCardNow}
            >
              {isPending && <Spinner />}
              {isPending ? "Processing..." : "Send Request"}
            </Button>
          </div>
        </div>
      </div>

      {/* ================= SELECT VIEW ================= */}
      <div
        className={`transition-opacity duration-300 ${
          openSide ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      >
        <Tabs
          value={tab}
          onValueChange={(v) => setTab(v as "virtual" | "physical")}
          className="mt-0.5 px-2"
        >
          <TabsList className="grid grid-cols-2 bg-muted w-full">
            <TabsTrigger value="virtual">Virtual Card</TabsTrigger>
            <TabsTrigger value="physical">Physical Card</TabsTrigger>
          </TabsList>

          {/* VIRTUAL CARD */}
          <TabsContent value="virtual">
            <ScrollArea
              className="mt-4"
              style={{ height: size.height && size.height - 150 }}
            >
              <div className="flex justify-center">
                <CardComponent card="Virtual Card" color="#03552c" />
              </div>

              <div className="flex gap-3 mt-4">
                <Zap className="text-green-600" />
                <div>
                  <h4 className="font-semibold">Instant Access</h4>
                  <p className="text-sm text-muted-foreground">
                    Apply and activate instantly
                  </p>
                </div>
              </div>

              <div className="flex gap-3 mt-4">
                <HandCoins className="text-green-600" />
                <div>
                  <h4 className="font-semibold">Safety</h4>
                  <p className="text-sm text-muted-foreground">
                    No physical handling, no loss
                  </p>
                </div>
              </div>

              <div className="flex gap-3 mt-4">
                <ShoppingCart className="text-green-600" />
                <div>
                  <h4 className="font-semibold">Online Merchants</h4>
                  <p className="text-sm text-muted-foreground">
                    Accepted worldwide
                  </p>
                </div>
              </div>

              <div className="flex gap-3 mt-4">
                <Lock className="text-green-600" />
                <div>
                  <h4 className="font-semibold">Security</h4>
                  <p className="text-sm text-muted-foreground">
                    World Bank Licensed
                  </p>
                </div>
              </div>

              <Button
                className="mt-6 w-full bg-green-600"
                onClick={() => setOpenSide(false)}
              >
                Apply Now
              </Button>
            </ScrollArea>
          </TabsContent>

          {/* PHYSICAL CARD */}
          <TabsContent value="physical">
            <ScrollArea
              className="mt-4"
              style={{ height: size.height && size.height - 150 }}
            >
              <div className="flex justify-center">
                <CardComponent card="Physical Card" color="#181818" />
              </div>

              <div className="flex gap-3 mt-4">
                <CreditCard className="text-green-600" />
                <div>
                  <h4 className="font-semibold">Free Application & Usage</h4>
                  <p className="text-sm text-muted-foreground">
                    Zero ATM & maintenance fees
                  </p>
                </div>
              </div>

              <div className="flex gap-3 mt-4">
                <HandCoins className="text-green-600" />
                <div>
                  <h4 className="font-semibold">Daily Discounts</h4>
                  <p className="text-sm text-muted-foreground">
                    Enjoy exciting offers
                  </p>
                </div>
              </div>

              <div className="flex gap-3 mt-4">
                <DollarSign className="text-green-600" />
                <div>
                  <h4 className="font-semibold">Earn</h4>
                  <p className="text-sm text-muted-foreground">
                    15% annual interest
                  </p>
                </div>
              </div>

              <div className="flex gap-3 mt-4">
                <ShieldCheck className="text-green-600" />
                <div>
                  <h4 className="font-semibold">Security</h4>
                  <p className="text-sm text-muted-foreground">
                    World Bank Licensed
                  </p>
                </div>
              </div>

              <Button
                className="mt-6 w-full bg-green-600"
                onClick={() => setOpenSide(false)}
              >
                Apply Now
              </Button>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
