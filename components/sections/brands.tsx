"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const brands = [
  "Meta",
  "AWS",
  "Nasdaq",
  "Apple",
  "Google",
  "Ray-Ban",
  "SuitSupply",
  "Deloitte",
  "American Express",
  "Barbour",
];

// Fisher-Yates shuffle algorithm
const shuffleArray = <T,>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

export function Brands() {
  // Initialize with original order, shuffle on client after mount
  const [brandsRow1, setBrandsRow1] = useState(brands);
  const [brandsRow2, setBrandsRow2] = useState(brands);
  const [brandsRow3, setBrandsRow3] = useState(brands);

  // Shuffle only on client side after mount to prevent hydration mismatch
  useEffect(() => {
    setBrandsRow1(shuffleArray(brands));
    setBrandsRow2(shuffleArray(brands));
    setBrandsRow3(shuffleArray(brands));
  }, []);

  return (
    <section
      id="brands"
      className="relative py-32 bg-black border-t border-white/10 overflow-hidden"
    >
      <div className="container mx-auto px-6 mb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading tracking-wider text-white mb-4">
            Trusted By Leaders
          </h2>
          <p className="text-lg text-white/70 max-w-2xl mx-auto tracking-wide">
            My clients come from diverse industries and hold positions at top
            companies and organizations. They work in fields such as finance,
            tech, law, and corporate leadership, representing respected brands
            like Fortune 500 companies, start-ups, and global enterprises.
            Whether they’re executives, entrepreneurs, or professionals looking
            to refine their image, I’ve helped them all look their best and
            project confidence in every aspect of their careers.
            {/* Collaborating with world-class organizations to elevate professional presence */}
          </p>
        </motion.div>
      </div>

      {/* Infinite Scroll Animation - Row 1 */}
      <div className="relative mb-12">
        {/* Gradient fade on edges */}
        <div className="absolute left-0 top-0 bottom-0 w-40 bg-gradient-to-r from-black to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-40 bg-gradient-to-l from-black to-transparent z-10" />

        {/* Scrolling container */}
        <div className="flex gap-20 animate-infinite-scroll">
          {/* First set */}
          {brandsRow1.map((brand, index) => (
            <div key={`brand-1-${index}`} className="flex-shrink-0 group">
              <span className="text-2xl md:text-3xl font-heading tracking-widest text-white/40 group-hover:text-white/90 transition-all duration-500 whitespace-nowrap">
                {brand}
              </span>
            </div>
          ))}
          {/* Duplicate set for seamless loop */}
          {brandsRow1.map((brand, index) => (
            <div key={`brand-2-${index}`} className="flex-shrink-0 group">
              <span className="text-2xl md:text-3xl font-heading tracking-widest text-white/40 group-hover:text-white/90 transition-all duration-500 whitespace-nowrap">
                {brand}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Separator line */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-12" />

      {/* Infinite Scroll Animation - Row 2 (Reverse) */}
      <div className="relative mb-12">
        {/* Gradient fade on edges */}
        <div className="absolute left-0 top-0 bottom-0 w-40 bg-gradient-to-r from-black to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-40 bg-gradient-to-l from-black to-transparent z-10" />

        {/* Scrolling container (reverse) */}
        <div className="flex gap-20 animate-infinite-scroll-reverse">
          {/* First set */}
          {brandsRow2.map((brand, index) => (
            <div
              key={`brand-reverse-1-${index}`}
              className="flex-shrink-0 group"
            >
              <span className="text-2xl md:text-3xl font-heading tracking-widest text-white/40 group-hover:text-white/90 transition-all duration-500 whitespace-nowrap">
                {brand}
              </span>
            </div>
          ))}
          {/* Duplicate set for seamless loop */}
          {brandsRow2.map((brand, index) => (
            <div
              key={`brand-reverse-2-${index}`}
              className="flex-shrink-0 group"
            >
              <span className="text-2xl md:text-3xl font-heading tracking-widest text-white/40 group-hover:text-white/90 transition-all duration-500 whitespace-nowrap">
                {brand}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Separator line */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-12" />

      {/* Infinite Scroll Animation - Row 3 (Forward) */}
      <div className="relative">
        {/* Gradient fade on edges */}
        <div className="absolute left-0 top-0 bottom-0 w-40 bg-gradient-to-r from-black to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-40 bg-gradient-to-l from-black to-transparent z-10" />

        {/* Scrolling container */}
        <div className="flex gap-20 animate-infinite-scroll">
          {/* First set */}
          {brandsRow3.map((brand, index) => (
            <div key={`brand-3-${index}`} className="flex-shrink-0 group">
              <span className="text-2xl md:text-3xl font-heading tracking-widest text-white/40 group-hover:text-white/90 transition-all duration-500 whitespace-nowrap">
                {brand}
              </span>
            </div>
          ))}
          {/* Duplicate set for seamless loop */}
          {brandsRow3.map((brand, index) => (
            <div key={`brand-4-${index}`} className="flex-shrink-0 group">
              <span className="text-2xl md:text-3xl font-heading tracking-widest text-white/40 group-hover:text-white/90 transition-all duration-500 whitespace-nowrap">
                {brand}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
