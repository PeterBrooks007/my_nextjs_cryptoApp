import React from "react";
import { Spinner } from "./ui/spinner";

const Loader = () => {
  return (
    <div className="flex w-full  px-4 justify-center mt-4">
      <Spinner  />
    </div>
  );
};

export default Loader;
