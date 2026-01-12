import { useCurrentUser } from "@/hooks/useAuth";
import { useCoingeckoCoins } from "@/hooks/useCoingeckoCoins";
import Image from "next/image";
import React from "react";
import TinyLineChart from "@/components/charts/TinyLineChart";

const CryptoTrending = () => {
  const { allCoins } = useCoingeckoCoins();
  const { data: user } = useCurrentUser();

  const firstSix = Array.isArray(allCoins) ? allCoins.slice(0, 5) : [];

  return (
    <>
      <h1 className="text-lg font-medium mb-2">Top Cryptocurrencies</h1>

      <div className="grid gap-1">
        {allCoins &&
          allCoins.length > 0 &&
          firstSix.map((data, index) => (
            <div
              key={index}
              className="flex items-center justify-between space-x-2 cursor-pointer py-1"
            >
              {/* LEFT: icon + symbol + name */}
              <div className="flex items-center space-x-3">
                <Image
                  src={data?.image}
                  alt={data?.name}
                  width={48}
                  height={48}
                  sizes="38px"
                  priority={false}
                  className="size-9.5 rounded-full bg-white border"
                />

                <div className="flex flex-col">
                  <span className="text-lg font-medium">
                    {data?.symbol.toUpperCase()}
                  </span>

                  <span className="-mt-1 text-base text-muted-foreground">
                    {data?.name}
                  </span>
                </div>
              </div>

              {/* TINY LINE CHART */}
              <div className="w-[100px] h-[50px]">
                <TinyLineChart
                  data={data?.sparkline_in_7d.price.map(
                    (price: number, i: number) => ({
                      name: i,
                      value: price,
                    })
                  )}
                  dataPricePercentage={data?.price_change_percentage_24h}
                />
              </div>

              {/* PRICE */}
              <span className="whitespace-nowrap text-lg">
                {Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: user?.currency?.code,
                  ...(data?.current_price > 9999
                    ? { notation: "compact" }
                    : {}),
                }).format(data?.current_price)}
              </span>

              {/* 24H CHANGE */}
              <span
                className={`
        ${
          data?.price_change_percentage_24h < 0
            ? "text-red-500"
            : "text-green-600"
        }
      `}
              >
                {Number(data?.price_change_percentage_24h).toFixed(2)}%
              </span>
            </div>
          ))}
      </div>
    </>
  );
};

export default CryptoTrending;
