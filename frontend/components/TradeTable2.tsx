import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { useTheme } from "next-themes";
import { TradeHistoryType } from "@/types";

const TradeTable2 = ({
  allUserTradeHistories,
}: {
  allUserTradeHistories: TradeHistoryType[];
}) => {
  const { resolvedTheme } = useTheme();

  return (
    <div className="w-full overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-left">SYMBOLS</TableHead>
            <TableHead className="text-center">PRICE</TableHead>
            <TableHead className="text-center">DATE</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {allUserTradeHistories && allUserTradeHistories.length > 0 ? (
            allUserTradeHistories.map((trade) => {
              const isBuy = trade.buyOrSell === "Buy";

              const symbolColor = isBuy
                ? resolvedTheme === "light"
                  ? "text-green-600"
                  : "text-emerald-400"
                : "text-red-500";

              return (
                <TableRow key={trade._id} className="last:border-0">
                  <TableCell className={`font-bold ${symbolColor}`}>
                    {trade.symbols}
                  </TableCell>

                  <TableCell className="text-center">{trade.price}</TableCell>

                  <TableCell className="text-center">
                    {trade.createdAt
                      ? new Intl.DateTimeFormat("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        }).format(new Date(trade.createdAt))
                      : "-"}
                  </TableCell>
                </TableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell
                colSpan={3}
                className="text-center text-muted-foreground py-6"
              >
                No Trade Available
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default TradeTable2;
