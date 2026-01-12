"use client";

import { ArrowUpRight } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

const images = [
  {
    name: "Bitcoin",
    url: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png",
  },
  {
    name: "Tether",
    url: "https://assets.coingecko.com/coins/images/325/large/Tether-logo.png",
  },
  {
    name: "USD Coin",
    url: "https://assets.coingecko.com/coins/images/6319/large/USD_Coin_icon.png",
  },
  {
    name: "Binance Coin",
    url: "https://assets.coingecko.com/coins/images/825/large/binance-coin-logo.png",
  },
];

export default function AuthFooter() {
  return (
    <div className="mt-2 rounded-2xl border border-green-500 p-2">
      <div className="flex items-center justify-between">
        {/* Left section */}
        <div className="flex items-center gap-4">
          {/* Avatar group */}
          <div className="flex -space-x-2">
            {images.map((image, index) => (
              <Avatar key={index} className="border-none size-10">
                <AvatarImage src={image.url} alt={image.name} />
                <AvatarFallback>
                  {image.name.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            ))}
          </div>

          {/* Text */}
          <div className="text-white">
            <p className="text-base font-medium">Join with 1M+ users</p>
            <p className="text-sm text-muted-foreground">
              Lets see our happy customer
            </p>
          </div>
        </div>

        {/* Right icon */}
        <div className="hidden sm:flex">
          <Button
            size="icon"
            variant="outline"
            className="border-green-500 text-white hover:bg-green-500/10"
          >
            <ArrowUpRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
