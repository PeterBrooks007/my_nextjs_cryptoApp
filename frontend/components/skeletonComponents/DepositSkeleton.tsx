import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { ChevronRight, History, X } from "lucide-react";
import { Card } from "../ui/card";
import { DrawerClose } from "../ui/drawer";

interface WalletSkeletonProps {
  type?: string;
}

export const DepositSkeleton = ({ type }: WalletSkeletonProps) => {
  return (
    <div className="flex flex-col gap-2 ">
      {/* Header */}
      <div className="sticky top-0  bg-background  rounded-3xl flex items-center justify-between px-4 py-3">
        <Button
          variant="ghost"
          size="icon"
          // onClick={() => setselectedView("history")}
        >
          <History className="size-5!" />
        </Button>

        <h2 className="font-semibold">{type}</h2>

        <DrawerClose asChild>
          <Button variant="ghost" size="icon">
            <X className="size-5!" />
          </Button>
        </DrawerClose>
      </div>

      <Separator />

      {/* Skeleton items */}
      <div className="flex flex-col gap-2 mt-2">
        {[1, 2].map((_, index) => (
          <Card
            key={index}
            className={`flex flex-row items-center justify-between px-4 py-4 mx-3 cursor-pointer bg-secondary/50 border-none
            }`}
          >
            <div className="flex items-center gap-2">
              <Skeleton className="w-11 h-11 rounded-full bg-gray-500/50" />
              <Skeleton className="w-36 h-4 rounded-md bg-gray-500/50" />
            </div>
            <ChevronRight className="size-6" />
          </Card>
        ))}
      </div>
    </div>
  );
};
