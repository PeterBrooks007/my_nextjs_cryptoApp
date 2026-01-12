import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import TradeForm from "./TradeForm";
import { ExchangeItemType } from "@/types";

type TradeSectionProps = {
  type: string | undefined;
  selectedExchange: ExchangeItemType | null;
  selectedSymbol: string | null;
};

const TradeSection = ({
  type,
  selectedExchange,
  selectedSymbol,
}: TradeSectionProps) => {
  return (
    <div className="flex w-full max-w-lg flex-col px-0">
      <Tabs defaultValue="automatic">
        <TabsList className="w-full bg-transparent border">
          <TabsTrigger value="automatic">Market</TabsTrigger>
          <TabsTrigger value="manual">Limit</TabsTrigger>
          <TabsTrigger value="manual2">Stop</TabsTrigger>
        </TabsList>

        {/* Market Trade */}
        <TabsContent value="automatic" className="mt-2">
          <TradeForm
            type={type}
            tradeType="Market"
            selectedExchange={selectedExchange}
            selectedSymbol={selectedSymbol}
          />
        </TabsContent>

        {/* LMT Trade */}
        <TabsContent value="manual" className="mt-2">
          <TradeForm
            type={type}
            tradeType="LMT"
            selectedExchange={selectedExchange}
            selectedSymbol={selectedSymbol}
          />
        </TabsContent>

        {/* STP Trade */}
        <TabsContent value="manual2" className="mt-2">
          <TradeForm
            type={type}
            tradeType="STP"
            selectedExchange={selectedExchange}
            selectedSymbol={selectedSymbol}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TradeSection;
