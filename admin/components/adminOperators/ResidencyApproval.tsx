import React, { useEffect, useState } from "react";
import { Spinner } from "../ui/spinner";
import { Card, CardContent } from "../ui/card";
import Image from "next/image";
import { Button } from "../ui/button";
import { CheckCircle, CircleAlert, IdCardLanyard, XCircle } from "lucide-react";
import { Switch } from "../ui/switch";
import { useParams } from "next/navigation";
import { useUser } from "@/hooks/useUser";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { useResidencyApproval } from "@/hooks/useAdminOperators";

type SwitchKey = "switch1" | "switch2" | "switch3" | "switch4";

const ResidencyApproval = () => {
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setPageLoading(false);
    }, 200);
  }, []);

  const params = useParams();
  const id = params?.userId as string;

  const { singleUser } = useUser(id);
  const { mutate, isPending } = useResidencyApproval(id);

  const [openUploadedId, setOpenUploadedId] = useState(false);

  const [checked, setChecked] = useState({
    switch1: singleUser?.isResidencyVerified === "VERIFIED" ? true : false,
    switch3: singleUser?.isResidencyVerified === "NOT VERIFIED" ? true : false,
    switch4: singleUser?.isResidencyVerified === "PENDING" ? true : false,
  });

  useEffect(() => {
    setTimeout(() => {
      setChecked({
        switch1: singleUser?.isResidencyVerified === "VERIFIED" ? true : false,
        switch3:
          singleUser?.isResidencyVerified === "NOT VERIFIED" ? true : false,
        switch4: singleUser?.isResidencyVerified === "PENDING" ? true : false,
      });
    }, 0);
  }, [singleUser?.isResidencyVerified]);

  // Handle switch change
  const handleSwitchChange = (switchName: SwitchKey, isChecked: boolean) => {
    setChecked((prev) => ({
      ...prev,
      [switchName]: isChecked,
    }));

    setTimeout(() => {
      handleFormSubmit(switchName);
    }, 400);
  };

  const handleFormSubmit = async (switchName: SwitchKey) => {
    let status;
    if (switchName === "switch1") {
      status = "VERIFIED";
    }
    if (switchName === "switch3") {
      status = "NOT VERIFIED";
    }

    if (switchName === "switch4") {
      status = "PENDING";
    }

    const userData = {
      status,
    };

    // console.log(id, userData);

    await mutate({ id, userData });
  };

  if (pageLoading || isPending) {
    return (
      <div className="flex w-full  px-4 justify-center">
        <Spinner className="size-8 mt-6" />
      </div>
    );
  }

  return (
    <div className="mx-3 sm:mx-4">
      <Card className="py-3">
        <CardContent className="grid gap-6">
          <div className="flex items-center gap-3 truncate">
            <div className="relative w-20 min-w-20 ">
              <Image
                src={singleUser?.photo || "/qrCode_placeholder.jpg"}
                alt="wallet-qrcode"
                width={50}
                height={50}
                className="size-20 object-cover border-2 border-gray-400 rounded-full"
              />
            </div>

            <div>
              <h3 className="text-lg font-semibold">
                {singleUser?.firstname + " " + singleUser?.lastname}
              </h3>
              <h3 className="text-sm font-semibold">{singleUser?.email}</h3>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* VIEW PROOF OF DEPOSIT SESSION*/}
      <Card className="p-4 mt-4 gap-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <IdCardLanyard className="text-green-500" />
            <p className="font-semibold">View Uploaded Residency</p>
          </div>
          <Button onClick={() => setOpenUploadedId(true)}>View Proof</Button>
        </div>
      </Card>

      {/* APPROVE USER RESIDENCY SESSION*/}
      <Card className="p-4 mt-4 gap-2">
        <div className="flex justify-between items-center">
          <div className="flex gap-2 items-center">
            <CheckCircle className="text-green-400" />
            <p className="font-semibold">Approve User Residency</p>
          </div>
          <Switch
            className="h-6 w-10 [&>span]:h-5 [&>span]:w-5 rounded-full"
            checked={checked.switch1}
            onCheckedChange={(checked) =>
              handleSwitchChange("switch1", checked)
            }
            name="switch1"
          />
        </div>

        <p className="mt-1">Please note this will approve the user residency</p>
      </Card>

      {/* DISSAPPROVE USER RESIDENCY SESSION*/}
      <Card className="p-4 mt-4 gap-2">
        <div className="flex justify-between items-center">
          <div className="flex gap-2 items-center">
            <XCircle className="text-red-500" />
            <p className="font-semibold">Dissapprove this Request</p>
          </div>
          <Switch
            className="h-6 w-10 [&>span]:h-5 [&>span]:w-5 rounded-full"
            checked={checked.switch3}
            onCheckedChange={(checked) =>
              handleSwitchChange("switch3", checked)
            }
            name="switch3"
          />
        </div>

        <p className="mt-1">
          Please note this will Dissapprove the user uploaded document and ask
          user to re-upload another document
        </p>
      </Card>

      {/* SET REQUEST TO PENDING*/}
      <Card className="p-4 mt-4 gap-2">
        <div className="flex justify-between items-center">
          <div className="flex gap-2 items-center">
            <CircleAlert className="text-orange-400" />
            <p className="font-semibold">Set Request to Pending</p>
          </div>
          <Switch
            className="h-6 w-10 [&>span]:h-5 [&>span]:w-5 rounded-full"
            checked={checked.switch4}
            onCheckedChange={(checked) =>
              handleSwitchChange("switch4", checked)
            }
            name="switch4"
          />
        </div>

        <p className="mt-1">Please note this request will be set to pending</p>
      </Card>

      {/* UPLOADED RESIDENCY IMAGES DIALOG */}
      <Dialog open={openUploadedId} onOpenChange={setOpenUploadedId}>
        <DialogContent className="sm:max-w-[425px] max-h-[90%] overflow-scroll">
          <DialogHeader>
            <DialogTitle>Uploaded Residency Document</DialogTitle>
          </DialogHeader>

          <div className="h-auto w-full">
            <Image
              src={
                (singleUser?.residencyVerificationPhoto &&
                  singleUser?.residencyVerificationPhoto !== "NOT UPLOADED" &&
                  singleUser?.residencyVerificationPhoto) ||
                "/qrCode_placeholder.jpg"
              }
              alt=""
              width={500}
              height={500}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ResidencyApproval;
