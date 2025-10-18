"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useState, useMemo } from "react";

interface AnimatedGalleryBackgroundProps {
  images: string[];
}

export function AnimatedGalleryBackground({ images }: AnimatedGalleryBackgroundProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // 🎨 CUSTOMIZE: Simply change this number to add or remove images
  const IMAGE_COUNT = 16;

  // Dynamically generate positions for all images - memoized to prevent recalculation on re-renders
  const gridPositions = useMemo(() => {
    return Array.from({ length: IMAGE_COUNT }, (_, i) => {
      // Better distribution algorithm - divide space evenly then add randomization
      const cols = 4; // Number of columns
      const rows = Math.ceil(IMAGE_COUNT / cols);
      
      const row = Math.floor(i / cols);
      const col = i % cols;
      
      // Calculate even vertical distribution (5% to 85% for safety)
      const verticalSpace = 85; // Total vertical space to use
      const verticalStep = verticalSpace / rows;
      const baseTop = 5 + (row * verticalStep) + (Math.random() * (verticalStep * 0.5));
      
      // Calculate horizontal distribution with randomization
      const horizontalStep = 90 / cols; // Distribute across 90% width
      const baseLeft = 5 + (col * horizontalStep) + (Math.random() * 10);
      
      return {
        top: `${Math.min(90, baseTop)}%`,
        left: `${Math.min(85, baseLeft)}%`,
        delay: Math.random() * 6, // Random delay between 0-6 seconds
        duration: 20 + Math.random() * 8, // Duration between 20-28 seconds
      };
    });
  }, [IMAGE_COUNT]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Dark overlay to keep it subtle */}
      <div className="absolute inset-0 bg-black/80 z-10" />

      {/* Animated gallery images */}
      {gridPositions.map((position, index) => {
        const image = images[index % images.length]; // Repeat images if needed
        
        return (
          <motion.div
            key={index}
            className="absolute w-48 h-48 md:w-64 md:h-64 pointer-events-auto z-20"
            style={{
              top: position.top,
              left: position.left,
            }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{
              opacity: hoveredIndex === index ? 0.8 : 0.15,
              scale: hoveredIndex === index ? 1.08 : 1,
              y: [0, -20, 0],
            }}
            transition={{
              opacity: { duration: 0.5 },
              scale: { duration: 0.5 },
              y: {
                duration: position.duration,
                repeat: Infinity,
                ease: "easeInOut",
                delay: position.delay,
              },
            }}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <div className="relative w-full h-full">
              <Image
                src={image}
                alt={`Gallery image ${index + 1}`}
                fill
                className={`object-cover rounded-lg transition-all duration-500 ${
                  hoveredIndex === index
                    ? "blur-0 grayscale-0 brightness-110"
                    : "blur-[8px] grayscale brightness-75"
                }`}
                style={{
                  transform: `rotate(${index % 2 === 0 ? -5 : 5}deg)`,
                }}
              />
              
              {/* Subtle border */}
              <div className="absolute inset-0 border border-white/10 rounded-lg" />
            </div>
          </motion.div>
        );
      })}

      {/* Gradient vignette for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/60 z-30 pointer-events-none" />
    </div>
  );
}
