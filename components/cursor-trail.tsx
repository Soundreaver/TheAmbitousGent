"use client";

import { useEffect, useState } from "react";
import useCanvasCursor from "@/hooks/use-canvas-cursor";

export function CursorTrail() {
  const [isInHero, setIsInHero] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if device is mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024); // lg breakpoint
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    const handleMouseMove = (e: MouseEvent) => {
      const heroSection = document.getElementById("home");
      if (heroSection) {
        const rect = heroSection.getBoundingClientRect();
        const inHero = e.clientY >= rect.top && e.clientY <= rect.bottom;
        setIsInHero(inHero);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  useCanvasCursor();

  // Don't render cursor trail on mobile
  if (isMobile) {
    return null;
  }

  return (
    <canvas
      className="pointer-events-none fixed inset-0 z-50 transition-opacity duration-300"
      id="canvas"
      style={{ opacity: isInHero ? 0 : 1 }}
    />
  );
}
