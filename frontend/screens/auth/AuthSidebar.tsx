"use client";

import Image from "next/image";
import AuthFooter from "./AuthFooter";

const AuthSideBar = () => {
  // useEffect(() => {
  //   dispatch(getLoginStatus());
  // }, [dispatch, isLoggedIn]);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     if (!isLoading && isLoggedIn && user === null) {
  //       await dispatch(getUser());
  //     }
  //   };
  //   fetchData();
  // }, [dispatch, isLoggedIn, user, isLoading]);

  return (
    <div className="relative hidden xl:block flex-1 xl:flex-[0_0_40%] 2xl:flex-[0_0_35%] h-screen">
      {/* Background Image */}
      <Image
        src={"/HdCrypto.jpg"}
        alt="Background"
        fill
        className="object-cover object-center"
        priority
      />

      {/* Overlay Header */}
      <div className="relative z-10 flex items-center gap-2 p-4">
        <h1 className="text-white text-lg font-bold tracking-wide">
          TRADEXS10
        </h1>
        <Image src={"/favicon_logo.png"} alt="logo" width={40} height={40} />
      </div>

      {/* Footer */}
      <div className="absolute bottom-5 left-0 right-0 z-10 px-6">
        <AuthFooter />
      </div>

      {/* Optional Dark Overlay (if you want contrast) */}
      {/* <div className="absolute inset-0 bg-black/30 z-[1]" /> */}
    </div>
  );
};

export default AuthSideBar;
