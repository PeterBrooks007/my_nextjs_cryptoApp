// "use client";

// import { memo, useEffect, useRef } from "react";

// const CoinGeckoMarquee = () => {
//   const widgetRef = useRef<HTMLDivElement | null>(null);

//   useEffect(() => {
//     // Prevent script from being injected multiple times
//     if (document.getElementById("coingecko-marquee-script")) return;

//     const script = document.createElement("script");
//     script.id = "coingecko-marquee-script";
//     script.src =
//       "https://widgets.coingecko.com/gecko-coin-price-marquee-widget.js";
//     script.async = true;

//     document.body.appendChild(script);
//   }, []);

//   return (
//     <div ref={widgetRef} className="w-full">
//       <gecko-coin-price-marquee-widget
//         locale="en"
//         transparent-background="true"
//         coin-ids=""
//         initial-currency="usd"
//         dark-mode="false"
//       />
//     </div>
//   );
// };

// export default memo(CoinGeckoMarquee);

import React from 'react'

const CoinGeckoMarquee  = () => {
  return (
    <div>CoinGeckoMarquee </div>
  )
}

export default CoinGeckoMarquee 
