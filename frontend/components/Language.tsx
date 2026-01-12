"use client";

import { useEffect } from "react";
import Script from "next/script";

interface GTranslateSettings {
  default_language: string;
  detect_browser_language: boolean;
  alt_flags?: Record<string, string>;
  wrapper_selector: string;
  flag_style?: string;
  flag_size?: number;
}

export default function Language() {
  useEffect(() => {
    // Strictly typed GTranslate settings
    (
      window as Window & { gtranslateSettings?: GTranslateSettings }
    ).gtranslateSettings = {
      default_language: "en",
      detect_browser_language: true,
      alt_flags: { en: "usa" },
      wrapper_selector: ".gtranslate_wrapper",
      flag_style: "3d",
    };
  }, []);

  return (
    <>
      {/* Wrapper div where the widget mounts */}
      <div className="gtranslate_wrapper fixed top-3 right-4 z-50" />

      {/* Load the GTranslate script */}
      <Script
        src="https://cdn.gtranslate.net/widgets/latest/float.js"
        strategy="afterInteractive"
      />
    </>
  );
}
