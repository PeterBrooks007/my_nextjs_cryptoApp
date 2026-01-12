import React from "react";
import { Spinner } from "../ui/spinner";

const WithdrawFormLoaderOverlay = () => {
  return (
    <div className="z-1 absolute w-full h-full flex justify-center pt-50 bg-black/70">
      <Spinner className="size-8" />
    </div>
  );
};

export default WithdrawFormLoaderOverlay;
