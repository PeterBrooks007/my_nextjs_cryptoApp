import React, { useEffect, useState } from "react";
import { currencies } from "@/lib/dummyData";
import Image from "next/image";
import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useCurrentUser } from "@/hooks/useAuth";

import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { usePathname } from "next/navigation";
import { Skeleton } from "./ui/skeleton";
import { ScrollArea } from "./ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import useChangeCurrency from "@/hooks/useChangeCurrency";
import { Currency } from "@/types";
import { Spinner } from "./ui/spinner";
import { useConversionRateStore } from "@/store/conversionRateStore";

const ChangeCurrency = () => {
  const { data: user } = useCurrentUser();
  const pathname = usePathname();
  const { conversionRate } = useConversionRateStore();

  const [visible, setVisible] = useState(false);

  const { changeCurrency, isLoading } = useChangeCurrency(setVisible);

  const [selectedCurrency, setSelectedCurrency] = useState(user?.currency);

  const handleSelectCurrency = () => {
    if (!selectedCurrency) return;
    // console.log(selectedCurrency);
    changeCurrency({
      code: selectedCurrency?.code,
      flag: selectedCurrency?.flag,
    });
  };

  const cancelChangeCurrency = () => {
    if (conversionRate) {
      setSelectedCurrency(conversionRate);
    } else {
      setSelectedCurrency(user?.currency);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      if (conversionRate) {
        setSelectedCurrency(conversionRate);
      } else {
        setSelectedCurrency(user?.currency);
      }
    }, 0);
  }, [conversionRate, user?.currency]);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div
            className={`z-10 flex cursor-pointer gap-1 justify-center rounded-full border border-gray-500 dark:border-gray-400  px-1.5 py-1  ${
              pathname === "/dashboard" && "border-gray-300! sm:border-none"
            } `}
          >
            <Avatar className="size-5">
              <AvatarImage
                src={`https://flagcdn.com/w80/${
                  conversionRate ? conversionRate.flag : user?.currency?.flag
                }.png`}
                className="rounded-full size-5"
              />
              <AvatarFallback>{"C"}</AvatarFallback>
            </Avatar>

            <div className="flex items-center justify-center">
              <span className="text-sm">
                {conversionRate ? conversionRate.code : user?.currency?.code}
              </span>
              <ChevronDown className="h-4 w-4" />
            </div>
          </div>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="min-w-0 max-h-100">
          <Currencies
            setVisible={setVisible}
            setSelectedCurrency={setSelectedCurrency}
          />
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Conversion Notice Dialog */}
      <Dialog open={visible} onOpenChange={setVisible}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="items-start">
            <DialogTitle>Conversion Notice</DialogTitle>
          </DialogHeader>

          <div className="space-y-5 text-sm leading-relaxed">
            <p>
              Please note this is a Temporary{" "}
              <span className="font-semibold text-orange-400">
                Balance Conversion Display Only,
              </span>{" "}
              and it won&apos;t change your{" "}
              <span className="font-semibold text-orange-400">
                Base Currency Balance in {user?.currency?.code}.
              </span>
            </p>

            <p>
              All Transactions will still be carried out in{" "}
              <span className="font-semibold text-orange-400">
                {user?.currency?.code}
              </span>
            </p>

            <p>
              Contact our support team if you wish to permanently change your
              base currency.
            </p>
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => {
                cancelChangeCurrency();
                setVisible(false);
              }}
            >
              Cancel
            </Button>
            <Button disabled={isLoading} onClick={handleSelectCurrency}>
              {isLoading && <Spinner />}
              Continue
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ChangeCurrency;

const Currencies = ({
  setVisible,
  setSelectedCurrency,
}: {
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedCurrency: React.Dispatch<
    React.SetStateAction<Currency | undefined>
  >;
}) => {
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setPageLoading(false);
    }, 200);
  }, []);

  if (pageLoading) {
    return (
      <ScrollArea className="h-95 overflow-y-auto">
        <div className="flex flex-col min-h-100 w-20 gap-4 p-1.5">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((i) => (
            <div key={i} className="flex items-center gap-1.5">
              <Skeleton className="size-6.5 rounded-full bg-gray-500/30" />
              <Skeleton className="w-8 h-5 bg-gray-500/30" />
            </div>
          ))}
        </div>
      </ScrollArea>
    );
  }

  return (
    <ScrollArea className="h-95 overflow-y-auto">
      <div className="space-y-2">
        {currencies?.map((currency) => (
          <DropdownMenuItem
            key={currency.code}
            onSelect={() => {
              setVisible(true);
              setSelectedCurrency(currency);
            }}
            className="flex items-center gap-2"
          >
            <Image
              src={`https://flagcdn.com/w80/${currency.flag}.png`}
              alt={currency.code}
              width={50}
              height={50}
              sizes="24px" 
              priority={false} // lazy-load
              className="size-6 rounded-full"
            />
            <span>{currency.code}</span>
          </DropdownMenuItem>
        ))}
      </div>
    </ScrollArea>
  );
};
