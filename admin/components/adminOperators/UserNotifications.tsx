import React, { useEffect, useState } from "react";
import { Spinner } from "../ui/spinner";
import AllUserNotifications from "../AllUserNotifications";

const UserNotifications = () => {
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setPageLoading(false);
    }, 300);
  }, []);

  if (pageLoading) {
    return (
      <div className="flex w-full  px-4 justify-center">
        <Spinner className="size-8 mt-6" />
      </div>
    );
  }
  return <AllUserNotifications showAllNotification={true} />;
};

export default UserNotifications;
