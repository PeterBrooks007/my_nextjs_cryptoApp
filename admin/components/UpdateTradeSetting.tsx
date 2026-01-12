"use client";

import {
  Camera,
  PlusCircle,
  SearchIcon,
  Trash,
  UploadCloud,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

import { ChangeEvent, useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  Field,
  // FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Controller, Resolver, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { InputGroup, InputGroupAddon, InputGroupInput } from "./ui/input-group";
import { toast } from "sonner";
import { Spinner } from "./ui/spinner";
import { sanitizedString } from "@/lib/zodSanitizeUtil";
import { TradeSettingsType } from "@/types";
import { useTradeSettings } from "@/hooks/useTradeSettings";
import { Checkbox } from "./ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { SmartPagination } from "./SmartPagination";
import AddTradingPairs from "./AddTradingPairs";

type UpdateTradeSettingsProps = {
  selectedTradeSetting: TradeSettingsType | null;
};

// formSchema
export const formSchema = z.object({
  exchangeType: sanitizedString("TradingPair Name contains invalid characters")
    .trim()
    .min(1, "Bot Name is required.")
    .max(50, "Bot Name cannot exceed 50 characters"),
});

const UpdateTradeSetting = ({
  selectedTradeSetting,
}: UpdateTradeSettingsProps) => {
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setPageLoading(false);
    }, 300);
  }, []);

  const {
    updateTradeSetting,
    isUpdatingTradeSetting,
    updateTradeSettingPhoto,
    isUpdatingTradeSettingPhoto,

    deleteArrayTradingPairs,
    isDeletingArrayTradingPairs,
  } = useTradeSettings();

  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

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

  type FormValues = z.infer<typeof formSchema>;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema) as unknown as Resolver<FormValues>,
    defaultValues: {
      exchangeType: selectedTradeSetting?.exchangeType ?? "",
    },
    mode: "onChange",
  });
  // updateExpert Trader
  async function onSubmit(data: z.infer<typeof formSchema>) {
    // Build payload object
    const userData = data;

    const id = selectedTradeSetting?._id;

    await updateTradeSetting(id, userData);

    // form.reset(); // clear input
  }

  // update TradingSetting Photo
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

    const id = selectedTradeSetting?._id;

    updateTradeSettingPhoto(id, formData);
  };

  /*--------------------   TRADING PAIRS SECTION CODES  ----------------------- */

  const [pairList, setTradingPairsList] = useState<string[] | undefined>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage] = useState(24);

  const filteredExchangePairs =
    selectedTradeSetting?.tradingPairs && Array.isArray(pairList)
      ? selectedTradeSetting?.tradingPairs?.filter((exchange) =>
          exchange?.toLowerCase().includes(searchTerm.toLowerCase().trim())
        )
      : [];

  const paginatedExchangePairs = filteredExchangePairs.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  useEffect(() => {
    setTimeout(() => {
      if (selectedTradeSetting?.tradingPairs.length !== 0) {
        setTradingPairsList(selectedTradeSetting?.tradingPairs);
      }
    }, 0);
  }, [selectedTradeSetting]);

  //START OF PART TO MULTIPLE SELECT TRADING PAIRS AND DELETE WALLETS

  const [selectedTradingPairsChecked, setSelectedTradingPairsChecked] =
    useState<Set<string>>(new Set());

  const isAllSelected =
    selectedTradingPairsChecked.size ===
    selectedTradeSetting?.tradingPairs.length;

  const [
    openDeleteSelectedTradingPairChecked,
    setDeleteSelectedTradingPairChecked,
  ] = useState(false);

  const [openAddTradingPairs, setOpenAddTradingPairs] = useState(false);

  // Function to handle master checkbox change
  const handleSelectAllTradingPair = (checked: boolean) => {
    if (checked) {
      // Map all wallet IDs into a Set<string>
      const allTradingPairIds: Set<string> = new Set(
        selectedTradeSetting?.tradingPairs.map((pair) => pair)
      );
      setSelectedTradingPairsChecked(allTradingPairIds);
    } else {
      setSelectedTradingPairsChecked(new Set());
    }
  };

  // Function to handle single checkbox change
  const handleSelectSingleTradingPairChecked = (pair: string) => {
    const updatedSelection = new Set(selectedTradingPairsChecked);
    if (updatedSelection.has(pair)) {
      updatedSelection.delete(pair);
    } else {
      updatedSelection.add(pair);
    }
    setSelectedTradingPairsChecked(updatedSelection);
  };

  // Function to handle delete arrays of pairs
  const handleMasterDelete = async () => {
    setDeleteSelectedTradingPairChecked(false);

    if (!selectedTradeSetting?._id) return;

    await deleteArrayTradingPairs({
      id: selectedTradeSetting._id,
      tradingPairsArray: [...selectedTradingPairsChecked],
    });

    setSelectedTradingPairsChecked(new Set());
  };

  //END OF PART TO MULTIPLE SELECT AND DELETE WALLETS

  if (pageLoading || isDeletingArrayTradingPairs) {
    return (
      <div className="flex w-full max-w-lg  px-4 justify-center">
        <Spinner className="size-8 mt-6" />
      </div>
    );
  }

  return (
    <>
      {/* UPADTE EXCHANGE SECTION */}
      <form id="form-rhf-demo" onSubmit={form.handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            {/* <CardTitle>Password</CardTitle> */}
            <CardDescription>
              Use this form to update this connect wallet details
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6">
            {/* WALLET ICON */}
            <div className="flex items-center gap-3">
              <div className="relative w-28 min-w-28 h-28">
                <Image
                  src={
                    imagePreview ??
                    (selectedTradeSetting?.photo &&
                    selectedTradeSetting.photo !== "No Photo"
                      ? selectedTradeSetting.photo
                      : "/qrCode_placeholder.jpg")
                  }
                  alt="wallet-qrcode"
                  width={100}
                  height={100}
                  className="size-28 object-cover border-2 border-gray-400 rounded-full"
                  onClick={handleButtonClick}
                />

                {/* Badge Camera Button */}
                <div
                  className="absolute bottom-1 right-1 p-1"
                  onClick={handleButtonClick}
                >
                  <Camera className="size-7" color="gray" />
                </div>

                {/* Hidden File Input */}
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  className="hidden"
                  onChange={handleImageChange}
                />
              </div>

              <div>
                <h3 className="text-lg font-semibold">
                  {selectedTradeSetting?.exchangeType.toUpperCase()}
                </h3>
                <p className="text-sm text-muted-foreground">
                  Click the camera icon to change the exchange Icon
                </p>
              </div>
            </div>

            {imagePreview && (
              <div className="w-full space-x-2 mb-3 flex items-center">
                <Button
                  type="button"
                  size="sm"
                  onClick={savePhoto}
                  disabled={isUpdatingTradeSettingPhoto}
                  className="disabled:bg-gray-400 disabled:text-white"
                >
                  {isUpdatingTradeSettingPhoto ? (
                    <Spinner />
                  ) : (
                    <UploadCloud className="w-4 h-4 " />
                  )}
                  UPLOAD PHOTO
                </Button>

                <Button
                  type="button"
                  size="sm"
                  variant="destructive"
                  disabled={isUpdatingTradeSettingPhoto}
                  onClick={() => {
                    setProfileImage(null);
                    setImagePreview(null);
                    if (fileInputRef.current) fileInputRef.current.value = "";
                  }}
                >
                  <X className="w-4 h-4 " /> CANCEL UPLOAD
                </Button>
              </div>
            )}

            <FieldGroup className="gap-5 ">
              <Controller
                name="exchangeType"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>
                      TradingPair Name
                    </FieldLabel>
                    <InputGroup>
                      <InputGroupInput
                        {...field}
                        id={field.name}
                        type="text"
                        aria-invalid={fieldState.invalid}
                        placeholder="Enter TradingPair Name"
                        className="text-base!"
                      />
                    </InputGroup>

                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>
          </CardContent>
          <CardFooter>
            <Button
              disabled={isUpdatingTradeSetting}
              className="w-full"
              type="submit"
            >
              {isUpdatingTradeSetting && <Spinner />}
              UPDATE EXCHANGE
            </Button>
          </CardFooter>
        </Card>
      </form>

      {/* TRADING PAIRS SECTIONS */}

      <Card className="p-4 mt-4 gap-2">
        {/* Header Row */}
        <div className="flex items-start justify-between py-2">
          <h2 className="text-lg font-semibold">
            {selectedTradeSetting?.exchangeType.toUpperCase()} PAIRS
          </h2>

          <div className="flex items-center space-x-2">
            <Checkbox
              className="border-white"
              checked={isAllSelected}
              onCheckedChange={handleSelectAllTradingPair}
            />

            <Button
              size={"icon-sm"}
              variant={"ghost"}
              disabled={selectedTradingPairsChecked.size === 0}
              onClick={() => {
                setDeleteSelectedTradingPairChecked(true);
              }}
            >
              <Trash className="size-5!" />
            </Button>

            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
              onClick={() => setOpenAddTradingPairs(true)}
            >
              <PlusCircle className="w-5 h-5" />
              Add
            </Button>
          </div>
        </div>

        {/* Search Box */}

        <div className="w-full">
          <InputGroup className="rounded-full">
            <InputGroupInput
              placeholder={`Search ${selectedTradeSetting?.exchangeType}`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <InputGroupAddon>
              <SearchIcon />
            </InputGroupAddon>
          </InputGroup>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 py-4">
          {selectedTradeSetting &&
            paginatedExchangePairs?.map((pair) => (
              <div
                key={pair}
                className="bg-muted p-2 rounded-lg shadow-sm flex items-center space-x-2"
              >
                <Checkbox
                  checked={selectedTradingPairsChecked.has(pair)}
                  onCheckedChange={() =>
                    handleSelectSingleTradingPairChecked(pair)
                  }
                />

                <p className="font-medium `wrap-break-word">{pair}</p>
              </div>
            ))}
        </div>

        {/* PAGINATION */}
        <SmartPagination
          page={page}
          totalItems={filteredExchangePairs.length}
          rowsPerPage={rowsPerPage}
          onPageChange={setPage}
        />
      </Card>

      {/* ADD TRADING PAIR  */}
      <Dialog open={openAddTradingPairs} onOpenChange={setOpenAddTradingPairs}>
        <form>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                Add Pairs for {selectedTradeSetting?.exchangeType} Exchange
              </DialogTitle>
              <DialogDescription>
                You can add up to 50 per request
              </DialogDescription>
            </DialogHeader>

            <AddTradingPairs selectedTradeSetting={selectedTradeSetting} />
          </DialogContent>
        </form>
      </Dialog>

      {/* DELETE SELECTED CHECK TRADING PAIRS DIALOG */}
      <Dialog
        open={openDeleteSelectedTradingPairChecked}
        onOpenChange={setDeleteSelectedTradingPairChecked}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {`Are you sure you want to delete ${selectedTradingPairsChecked.size} selected pair(s)?`}
            </DialogTitle>
            <p className="text-sm text-muted-foreground mt-1">
              This action cannot be undone. Are you sure you want to permanently
              delete all this selected pair&apos;s data?
            </p>
          </DialogHeader>

          <div className="flex justify-end gap-2 mt-4">
            <Button
              variant="outline"
              onClick={() => setDeleteSelectedTradingPairChecked(false)}
            >
              Cancel
            </Button>

            <Button
              variant="destructive"
              onClick={() => {
                handleMasterDelete();
              }}
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default UpdateTradeSetting;
