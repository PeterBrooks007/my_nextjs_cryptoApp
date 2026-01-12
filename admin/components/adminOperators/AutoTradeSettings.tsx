import React, { useEffect, useState } from "react";
import { Spinner } from "../ui/spinner";
import { Card, CardContent } from "../ui/card";
import Image from "next/image";
import { CheckCircle, XCircle } from "lucide-react";
import { Switch } from "../ui/switch";
import { useParams } from "next/navigation";
import { useUser } from "@/hooks/useUser";
import { useAutoTradeSettings } from "@/hooks/useAdminOperators";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { toast } from "sonner";

const AutoTradeSettings = () => {
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setPageLoading(false);
    }, 200);
  }, []);

  const params = useParams();
  const id = params?.userId as string;

  const { singleUser } = useUser(id);
  const { mutate, isPending } = useAutoTradeSettings(id);

  const [winLoseValue, setWinLoseValue] = useState(
    singleUser?.autoTradeSettings?.winLoseValue
  );

  const [checked, setChecked] = useState({
    switch1: singleUser?.autoTradeSettings?.isAutoTradeActivated,
    switch2: singleUser?.autoTradeSettings?.type === "Random" ? true : false,
    switch3:
      singleUser?.autoTradeSettings?.type === "Always_Win" ? true : false,
    switch4:
      singleUser?.autoTradeSettings?.type === "Always_Lose" ? true : false,
  });

  useEffect(() => {
    setTimeout(() => {
      setChecked({
        switch1: singleUser?.autoTradeSettings?.isAutoTradeActivated,
        switch2:
          singleUser?.autoTradeSettings?.type === "Random" ? true : false,
        switch3:
          singleUser?.autoTradeSettings?.type === "Always_Win" ? true : false,
        switch4:
          singleUser?.autoTradeSettings?.type === "Always_Lose" ? true : false,
      });
    }, 0);
  }, [singleUser?.autoTradeSettings, singleUser?.autoTradeSettings?.type]);

  // Handle switch change
  const handleSwitchChange = (switchName: string, isChecked: boolean) => {
    setChecked((prevState) => {
      let updatedState;

      if (switchName === "switch1") {
        // Only toggle switch1 without affecting others
        updatedState = {
          ...prevState,
          switch1: isChecked,
        };
      } else {
        // Mutually exclusive switches for switch2, switch3, switch4
        updatedState = {
          switch1: prevState.switch1,
          switch2: switchName === "switch2" ? isChecked : false,
          switch3: switchName === "switch3" ? isChecked : false,
          switch4: switchName === "switch4" ? isChecked : false,
        };

        // If all are off → default to switch2 = true
        if (
          !updatedState.switch2 &&
          !updatedState.switch3 &&
          !updatedState.switch4
        ) {
          updatedState.switch2 = true;
        }
      }

      return updatedState;
    });

    // Delay submit
    // setTimeout(() => {
    //   handleFormSubmit(switchName);
    // }, 400);
  };

  // handleFormSubmit
  const handleFormSubmit = async () => {
    if (!winLoseValue) {
      return toast.error("Please Enter a win or Lose Value");
    }

    let type;
    if (checked.switch2) {
      type = "Random";
    }
    if (checked.switch3) {
      type = "Always_Win";
    }
    if (checked.switch4) {
      type = "Always_Lose";
    }

    const userData = {
      isAutoTradeActivated: checked.switch1,
      type,
      winLoseValue,
    };

    // console.log(userData);

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

      {/* ACTIVATE OR DEACTIVATE AUTOTRADE SESSION*/}
      <Card className="p-4 mt-4 gap-2">
        <div className="flex justify-between items-center">
          <div className="flex gap-2 items-center">
            {singleUser?.autoTradeSettings?.isAutoTradeActivated ? (
              <CheckCircle className="text-green-400" />
            ) : (
              <XCircle color="red" />
            )}
            <p className="font-semibold">
              {singleUser?.autoTradeSettings?.isAutoTradeActivated
                ? "Auto Trading is Activated"
                : "Activate Auto Trade"}
            </p>
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

        <p className="mt-1">Click to Activate or deactivate Autotrade</p>
      </Card>

      {/*ACTIVATE RANDOM WIN OR LOSE SESSION*/}
      <Card className="p-4 mt-4 gap-2">
        <div className="flex justify-between items-center">
          <div className="flex gap-2 items-center">
            {singleUser?.autoTradeSettings?.type === "Random" ? (
              <CheckCircle className="text-green-400" />
            ) : (
              <XCircle color="red" />
            )}
            <p className="font-semibold">
              {singleUser?.autoTradeSettings?.type === "Random"
                ? "Random Win or Lose is activated"
                : "Activate Random Win or Lose"}
            </p>
          </div>
          <Switch
            className="h-6 w-10 [&>span]:h-5 [&>span]:w-5 rounded-full"
            checked={checked.switch2}
            onCheckedChange={(checked) =>
              handleSwitchChange("switch2", checked)
            }
            name="switch2"
          />
        </div>

        <p className="mt-1">
          Check this if you want user to have random win or lose
        </p>
      </Card>

      {/* ACTIVATE ALWAYS WIN SESSION*/}
      <Card className="p-4 mt-4 gap-2">
        <div className="flex justify-between items-center">
          <div className="flex gap-2 items-center">
            {singleUser?.autoTradeSettings?.type === "Always_Win" ? (
              <CheckCircle className="text-green-400" />
            ) : (
              <XCircle color="red" />
            )}
            <p className="font-semibold">
              {" "}
              {singleUser?.autoTradeSettings?.type === "Always_Win"
                ? "Always Win is activated"
                : "Activate always Win"}
            </p>
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
          Check this if you want user to always win the trade
        </p>
      </Card>

      {/* ACTIAVTE ALWAYS LOSE SESSION*/}
      <Card className="p-4 mt-4 gap-2">
        <div className="flex justify-between items-center">
          <div className="flex gap-2 items-center">
            {singleUser?.autoTradeSettings?.type === "Always_Lose" ? (
              <CheckCircle className="text-green-400" />
            ) : (
              <XCircle color="red" />
            )}
            <p className="font-semibold">
              {singleUser?.autoTradeSettings?.type === "Always_Lose"
                ? "Always Lose is activated"
                : "Activate always Lose"}
            </p>
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

        <p className="mt-1">
          Check this if you want user to always lose the trade
        </p>
      </Card>

      {/* SET THE RATE YOU WANT USER TO WIN OR LOSE */}
      <Card className="p-4 mt-4 gap-2">
        <p>Set the rate you want user to win or lose</p>
        <Select value={winLoseValue} onValueChange={setWinLoseValue}>
          <SelectTrigger className="w-full h-12!">
            <SelectValue placeholder="Select a fruit" />
          </SelectTrigger>
          <SelectContent className="w-full">
            <SelectGroup className="w-full">
              <SelectLabel>Fruits</SelectLabel>
              <SelectItem value="Ten">Ten {"[ e.g, 10, 20, 30 ]"}</SelectItem>
              <SelectItem value="Hundred">
                Hundred {" [ e.g, 100, 200, 300 ]"}
              </SelectItem>
              <SelectItem value="Thousand">
                Thousand {"[ e.g, 1000, 2000, 10,000 ]"}
              </SelectItem>
              <SelectItem value="Million">
                Million {" [ e.g, 1,000,000, 2,000,000, 3,000,000 ]"}
              </SelectItem>
              <SelectItem value="Random">
                Random {" [ e.g, 10, 1000, 20,000, 1,000,000 ]"}
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>

        <Button className="mt-4 w-full" onClick={handleFormSubmit}>
          INITITATE CHANGES
        </Button>
      </Card>
    </div>
  );
};

export default AutoTradeSettings;
