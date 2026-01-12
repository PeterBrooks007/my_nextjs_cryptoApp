"use client";

import * as React from "react";
import Autoplay from "embla-carousel-autoplay";

import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Image from "next/image";

export default function GiftSlider() {
  const plugin = React.useRef(
    Autoplay({ delay: 3000, stopOnInteraction: true })
  );

  const slides = [
    {
      titleTop: "Earn up to",
      titleMain: "$5,000 bonus",
      titleBottom: "on $2,000 deposit",
      image: "/happyClientImg.png",
      imageWidth: 100,
    },
    {
      titleTop: "Earn up to",
      titleMain: "10% reward",
      titleBottom: "on every successful refers",
      image: "/giftbox.png",
      imageWidth: 100,
    },
    {
      titleTop: "Trade at least",
      titleMain: "10 times a month",
      titleBottom: "to get an extra bonus",
      image: "/happyTraderimg.png",
      imageWidth: 130,
    },
  ];

  return (
    <Carousel
      plugins={[plugin.current]}
      className="w-full"
      onMouseEnter={plugin.current.stop}
      onMouseLeave={plugin.current.reset}
    >
      <CarouselContent>
        {slides.map((slide, index) => (
          <CarouselItem key={index}>
            <div className="pt-1">
              <Card>
                <CardContent className="flex aspect-square items-center justify-center py-6 px-4 h-5">
                  <div className="flex-[0_0_70%] space-y-1">
                    <p className="text-sm font-medium">{slide.titleTop}</p>
                    <p className="text-xl xs:text-2xl font-semibold">
                      {slide.titleMain}
                    </p>
                    <p className="text-sm font-medium">{slide.titleBottom}</p>
                  </div>

                  <div className="flex-[0_0_30%] flex justify-end">
                    <Image
                      src={slide.image}
                      alt=""
                      width={100}
                      height={100}
                      priority
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      {/* <CarouselPrevious />
      <CarouselNext /> */}
    </Carousel>
  );
}
