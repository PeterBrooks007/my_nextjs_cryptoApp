import { TradeSettingsType } from "@/types";
import React, { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { XCircle } from "lucide-react";
import { useTradeSettings } from "@/hooks/useTradeSettings";
import { Spinner } from "./ui/spinner";

type UpdateTradeSettingsProps = {
  selectedTradeSetting: TradeSettingsType | null;
};

const isValidPair = (value: string) => {
  // Prevent HTML, scripts, tags
  const hasTags = /<\/?[^>]+>/gi.test(value);
  if (hasTags) return false;

  // Allow only safe characters: letters, numbers, dash, slash
  const allowedPattern = /^[A-Z0-9\-\/]+$/i;
  if (!allowedPattern.test(value)) return false;

  // Optional: prevent extremely long input
  if (value.length > 20) return false;

  return true;
};

const AddTradingPairs = ({
  selectedTradeSetting,
}: UpdateTradeSettingsProps) => {
  const { addArrayOfTradingPairs, isAddingArrayTradingPairs } =
    useTradeSettings();

  const [selectedAddPairs, setSelectedAddPairs] = useState<Set<string>>(
    new Set()
  );

  const [inputValue, setInputValue] = useState<string>("");
  const [notification, setNotification] = useState<string>("");
  const MAX_LIMIT = 50;

  const handleAddPair = () => {
    if (selectedAddPairs.size >= MAX_LIMIT) {
      setNotification(
        "Maximum limit reached. You can only add 50 pairs at a time."
      );
      setTimeout(() => setNotification(""), 10000);
      return;
    }

    if (inputValue.trim()) {
      const trimmedInput = inputValue.trim().toUpperCase();

      // 🔒 Validate input
      if (!isValidPair(trimmedInput)) {
        setNotification(
          "Invalid pair format. Only letters, numbers, '-', '/' are allowed."
        );
        setTimeout(() => setNotification(""), 10000);
        return;
      }

      // FIX: tradingPairs must be string[]
      if (selectedTradeSetting?.tradingPairs?.includes(trimmedInput)) {
        setNotification(
          `The pair "${trimmedInput}" already exists in the trading pairs database.`
        );
        setTimeout(() => setNotification(""), 10000);
        return;
      }

      if (selectedAddPairs.has(trimmedInput)) {
        setNotification(
          `The pair "${trimmedInput}" is already added to the list.`
        );
        setTimeout(() => setNotification(""), 10000);
        return;
      }

      const updated = new Set(selectedAddPairs);
      updated.add(trimmedInput);
      setSelectedAddPairs(updated);
      setInputValue("");
    }
  };

  const handleClearAll = () => {
    setSelectedAddPairs(new Set());
  };

  // 👇 FIX: add type for pair
  const handleRemovePair = (pair: string) => {
    const updated = new Set(selectedAddPairs);
    updated.delete(pair);
    setSelectedAddPairs(updated);
  };

  // 👇 FIX: correct input event type
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleUploadPairs = async () => {
    const id = selectedTradeSetting?._id;
    const tradingPairsArray = [...selectedAddPairs];

    // console.log({ id, tradingPairsArray: [...tradingPairsArray] });

    await addArrayOfTradingPairs({
      id,
      tradingPairsArray: [...tradingPairsArray],
    });

    setSelectedAddPairs(new Set());
    // handleClosePairs();
  };

  return (
    <div className="p- rounded-xl shadow-md w-full max-w-lg">
      {notification && (
        <p className="text-red-500 mb-2 text-sm">{notification}</p>
      )}

      {/* Display selected pairs */}
      <div className="flex flex-wrap gap-2">
        {Array.from(selectedAddPairs).map((pair) => (
          <div
            key={pair}
            className="flex items-center gap-1 border border-gray-400 px-2 py-1 rounded-lg"
          >
            <span>{pair}</span>
            <XCircle
              className="w-5 h-5 cursor-pointer text-red-500 hover:text-red-600"
              onClick={() => handleRemovePair(pair)}
            />
          </div>
        ))}
      </div>

      {/* Input + Add/Clear */}
      <div className="flex items-center gap-2 mt-4">
        <Input
          type="text"
          placeholder="Exchange Type"
          maxLength={101}
          value={inputValue}
          onChange={handleInputChange}
          className="rounded-lg"
        />

        <Button variant="secondary" onClick={handleAddPair}>
          ADD
        </Button>

        <Button variant="default" onClick={handleClearAll}>
          Clear
        </Button>
      </div>

      {/* Upload Button */}
      <div className="mt-8">
        <Button
          className="w-full"
          onClick={handleUploadPairs}
          disabled={selectedAddPairs.size === 0}
        >
          {isAddingArrayTradingPairs && <Spinner />}
          Upload Pairs
        </Button>
      </div>
    </div>
  );
};

export default AddTradingPairs;
