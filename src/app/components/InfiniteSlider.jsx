"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import educafe1 from "@/assets/educafe1.png";
import educafe2 from "@/assets/educafe2.png";
import educafe3 from "@/assets/educafe3.png";
import educafe4 from "@/assets/educafe4.png";
import educafe5 from "@/assets/educafe5.png";
import educafe6 from "@/assets/educafe6.png";
import educafe7 from "@/assets/educafe7.png";
import educafe8 from "@/assets/educafe8.png";
import educafe9 from "@/assets/educafe9.png";
import educafe10 from "@/assets/educafe10.png";
import educafe11 from "@/assets/educafe11.png";
import educafe12 from "@/assets/educafe12.png";
import educafe13 from "@/assets/educafe13.png";
import educafe14 from "@/assets/educafe14.png";
import educafe15 from "@/assets/educafe15.png";
import educafe16 from "@/assets/educafe16.png";
import educafe17 from "@/assets/educafe17.png";
import educafe18 from "@/assets/educafe18.png";
import educafe19 from "@/assets/educafe19.png";
import educafe20 from "@/assets/educafe20.png";
import educafe21 from "@/assets/educafe21.png";
import educafe22 from "@/assets/educafe22.png";
import educafe23 from "@/assets/educafe23.png";

const VISIBLE = 3;
const SLIDE_INTERVAL = 3000;
const TRANSITION_MS = 400;

export default function InfiniteSlider() {
  const images = [
    educafe1,
    educafe2,
    educafe3,
    educafe4,
    educafe5,
    educafe6,
    educafe7,
    educafe8,
    educafe9,
    educafe10,
    educafe11,
    educafe12,
    educafe13,
    educafe14,
    educafe15,
    educafe16,
    educafe18,
    educafe19,
    educafe20,
    educafe21,
    educafe22,
    educafe23,
  ];

  // Clone slides for infinite effect
  const slides = [
    ...images.slice(-VISIBLE),
    ...images,
    ...images.slice(0, VISIBLE),
  ];

  const [index, setIndex] = useState(VISIBLE);
  const [isTransitioning, setIsTransitioning] = useState(true);

  // Auto slide
  useEffect(() => {
    const id = setInterval(() => {
      next();
    }, SLIDE_INTERVAL);

    return () => clearInterval(id);
  }, []);

  // Handle infinite looping WITHOUT visual jump
  useEffect(() => {
    if (!isTransitioning) return;

    // After sliding past the last real slide
    if (index === slides.length - VISIBLE) {
      setTimeout(() => {
        setIsTransitioning(false);
        setIndex(VISIBLE);
      }, TRANSITION_MS);
    }

    // Sliding backwards past first real slide
    if (index === 0) {
      setTimeout(() => {
        setIsTransitioning(false);
        setIndex(slides.length - VISIBLE * 2);
      }, TRANSITION_MS);
    }
  }, [index, isTransitioning, slides.length]);

  // Re-enable transition after silent reset
  useEffect(() => {
    if (!isTransitioning) {
      requestAnimationFrame(() => {
        setIsTransitioning(true);
      });
    }
  }, [isTransitioning]);

  const next = () => setIndex((i) => i + 1);
  const prev = () => setIndex((i) => i - 1);

  return (
    <div className="relative w-full overflow-hidden">
      {/* Slider Track */}
      <div
        className="flex"
        style={{
          transform: `translateX(-${(100 / VISIBLE) * index}%)`,
          transition: isTransitioning
            ? `transform ${TRANSITION_MS}ms ease`
            : "none",
        }}
      >
        {slides.map((src, i) => (
          <div
            key={i}
            className="w-1/3 px-1 md:pl-3 flex-shrink-0 min-h-auto md:min-h-130"
          >
            <Image
              src={src}
              alt="slide"
              sizes="33vw"
              className="w-full h-full rounded-sm object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
