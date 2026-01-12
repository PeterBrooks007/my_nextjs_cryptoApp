"use client";

import { useRef, useState } from "react";
import { Camera, CheckCircle, XCircle } from "lucide-react";

import {
  useCurrentUser,
  useIdVerificationUpload,
  useResidencyVerification,
} from "@/hooks/useAuth";
import { toast } from "sonner";
import Image from "next/image";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Spinner } from "./ui/spinner";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

// Validate Images Function
const validateImage = async (file: File) => {
  const validTypes = ["image/jpeg", "image/jpg", "image/png"];
  if (!validTypes.includes(file.type))
    throw new Error("Invalid file type. Only JPEG and PNG allowed.");
  if (file.size > MAX_FILE_SIZE) throw new Error("File exceeds 5MB limit.");
};

const AccountVerifications = ({
  verificationDrawer,
}: {
  verificationDrawer?: boolean;
}) => {
  const { data: user } = useCurrentUser();

  // ========================================= //
  //   handle Request Ids Verification  //
  // ======================================= //

  const [profileImages, setProfileImages] = useState<{
    front: File | null;
    back: File | null;
  }>({
    front: null,
    back: null,
  });

  const [imagePreviews, setImagePreviews] = useState<{
    front: string | null;
    back: string | null;
  }>({
    front: null,
    back: null,
  });

  const fileInputRefs = {
    front: useRef<HTMLInputElement | null>(null),
    back: useRef<HTMLInputElement | null>(null),
  };

  const handleImageChangeID = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "front" | "back"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setProfileImages((prev) => ({ ...prev, [type]: file }));
    setImagePreviews((prev) => ({
      ...prev,
      [type]: URL.createObjectURL(file),
    }));
  };

  const handleButtonClickID = (type: "front" | "back") =>
    fileInputRefs[type].current?.click();

  // useIdVerificationUpload Mutation
  const { mutate, isPending: idVerificationUploadIsPending } =
    useIdVerificationUpload(setImagePreviews);

  const handleRequestIdVerification = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await Promise.all(
        Object.entries(profileImages).map(async ([type, file]) => {
          if (!file) throw new Error(`No ${type} image selected.`);
          await validateImage(file);
        })
      );

      const formData = new FormData();
      if (profileImages.front)
        formData.append("frontImage", profileImages.front);
      if (profileImages.back) formData.append("backImage", profileImages.back);

      mutate(formData);
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message);
      }
    } finally {
    }
  };

  // ========================================= //
  //   handle Request Residency Verification  //
  // ======================================= //

  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleButtonClickResidency = () => fileInputRef.current?.click();

  // useIdVerificationUpload Mutation
  const {
    mutate: ResidencyVerificationMutate,
    isPending: ResidencyVerificationUploadIsPending,
  } = useResidencyVerification(setImagePreview);

  const handleImageChangeResidency = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setProfileImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleRequestResidencyVerification = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!profileImage) {
      toast.error("No image selected.");
      return;
    }

    try {
      await validateImage(profileImage);

      const formData = new FormData();
      formData.append("image", profileImage);

      await ResidencyVerificationMutate(formData);

      // setProfileImage(null);
      // setImagePreview(null);
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message);
      }
    } finally {
    }
  };

  return (
    <div className="flex flex-col gap-8">
      {/* ======================== ID VERIFICATION ======================= */}
      <Card className="relative p-5 md:p-10 rounded-3xl flex flex-col gap-8">
        <div className="flex justify-between items-start">
          <div className="flex flex-col gap-1">
            <h2 className="text-lg md:text-xl font-semibold">
              Identity Verification
            </h2>
            <p className="text-sm text-muted-foreground">
              Upload a valid government-issued ID
            </p>
          </div>

          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur ${
              user?.isIdVerified === "VERIFIED"
                ? "bg-green-500/10 text-green-700 dark:text-green-300 ring-1 ring-green-300/40"
                : user?.isIdVerified === "PENDING"
                ? "bg-orange-500/10 text-orange-700 dark:text-orange-300 ring-1 ring-orange-300/40"
                : "bg-red-500/10 text-red-700 ring-1 dark:text-red-300 ring-red-300/40"
            }`}
          >
            {user?.isIdVerified === "VERIFIED" ? (
              <CheckCircle size={14} />
            ) : (
              <XCircle size={14} />
            )}
            {user?.isIdVerified}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {(["front", "back"] as const).map((type) => (
            <div key={type} className="flex flex-col gap-4">
              <span className="text-base font-medium text-muted-foreground">
                {type === "front" ? "Front of ID" : "Back of ID"}
              </span>

              <div className="relative group rounded-2xl overflow-hidden">
                <Image
                  src={
                    imagePreviews[type] ??
                    (type === "front"
                      ? user?.idVerificationPhoto.front !== "NOT UPLOADED"
                        ? user?.idVerificationPhoto.front
                        : "/front-id.jpg"
                      : user?.idVerificationPhoto.back !== "NOT UPLOADED"
                      ? user?.idVerificationPhoto.back
                      : "/back-id.jpg") ??
                    "/front-id.jpg"
                  }
                  alt={`${type} ID`}
                  width={500}
                  height={500}
                  className="w-full h-auto object-contain transition-transform duration-300 group-hover:scale-[1.02]"
                />

                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition" />
              </div>

              <Button
                variant={"outline"}
                onClick={() => handleButtonClickID(type)}
                disabled={
                  user?.isIdVerified === "PENDING" ||
                  user?.isIdVerified === "VERIFIED" ||
                  idVerificationUploadIsPending
                }
                className="inline-flex items-center justify-center gap-2 h-11 rounded-xl text-sm font-semibold hover:opacity-90"
              >
                <Camera size={18} />
                Upload {type.charAt(0).toUpperCase() + type.slice(1)}
              </Button>

              <input
                type="file"
                accept="image/*"
                ref={fileInputRefs[type]}
                className="hidden"
                onChange={(e) => handleImageChangeID(e, type)}
              />
            </div>
          ))}
        </div>

        <Button
          onClick={handleRequestIdVerification}
          disabled={
            user?.isIdVerified === "PENDING" ||
            user?.isIdVerified === "VERIFIED" ||
            idVerificationUploadIsPending
          }
          className="h-14 rounded-2xl text-sm font-semibold hover:opacity-95"
        >
          {idVerificationUploadIsPending && <Spinner />}
          Request Verification
        </Button>
      </Card>

      {/* ======================== RESIDENCY VERIFICATION ======================= */}
      <Card className="p-5 md:p-10 rounded-3xl flex flex-col gap-8">
        <div className="flex justify-between items-start">
          <div className="flex flex-col gap-1">
            <h2 className="text-lg md:text-xl font-semibold ">
              Residency Verification
            </h2>
            <p className="text-sm text-muted-foreground">
              Upload a utility bill or official document
            </p>
          </div>

          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur ${
              user?.isResidencyVerified === "VERIFIED"
                ? "bg-green-500/10 text-green-700 dark:text-green-300 ring-1 ring-green-300/40"
                : user?.isResidencyVerified === "PENDING"
                ? "bg-orange-500/10 text-orange-700 dark:text-orange-300 ring-1 ring-orange-300/40"
                : "bg-red-500/10 text-red-700 ring-1 dark:text-red-300 ring-red-300/40"
            }`}
          >
            {user?.isResidencyVerified === "VERIFIED" ? (
              <CheckCircle size={14} />
            ) : (
              <XCircle size={14} />
            )}
            {user?.isResidencyVerified === "VERIFIED"
              ? "VERIFIED"
              : user?.isResidencyVerified === "PENDING"
              ? "PENDING"
              : "NOT VERIFIED"}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-87.5 sm:h-62.5">
          <div
            className={`md:${
              verificationDrawer ? "col-span-1" : "col-span-1"
            } rounded-2xl overflow-hidden`}
          >
            <Image
              src={imagePreview ?? "/proof_of_residency1.png"}
              alt="proof of residency"
              width={600}
              height={600}
              className="w-full h-full object-contain"
            />
          </div>

          <div
            onClick={handleButtonClickResidency}
            className={`md:${
              verificationDrawer ? "col-span-2" : "col-span-2"
            } rounded-2xl border border-dashed border-gray-500 hover:border-gray-400 transition flex items-center justify-center cursor-pointer `}
          >
            <div className="flex flex-col items-center gap-2 text-muted-foreground">
              <Camera size={22} />
              <span className="text-sm font-medium">
                Click to upload document
              </span>

              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                className="hidden"
                disabled={
                  user?.isResidencyVerified === "PENDING" ||
                  user?.isResidencyVerified === "VERIFIED" ||
                  ResidencyVerificationUploadIsPending
                }
                onChange={handleImageChangeResidency}
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            disabled={
              user?.isResidencyVerified === "PENDING" ||
              user?.isResidencyVerified === "VERIFIED" ||
              ResidencyVerificationUploadIsPending
            }
            onClick={handleRequestResidencyVerification}
            className="flex-1 h-14 rounded-2xl text-sm font-semibold hover:opacity-90"
          >
            {ResidencyVerificationUploadIsPending && <Spinner />}
            Request Verification
          </Button>

          {imagePreview && (
            <Button
              disabled={
                user?.isResidencyVerified === "PENDING" ||
                user?.isResidencyVerified === "VERIFIED" ||
                ResidencyVerificationUploadIsPending
              }
              onClick={() => {
                setImagePreview(null);
                setProfileImage(null);
              }}
              className="flex-1 h-14 rounded-2xl bg-secondary-foreground text-sm font-semibold hover:bg-gray-200"
            >
              Cancel
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
};

export default AccountVerifications;
