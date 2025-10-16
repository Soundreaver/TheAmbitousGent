"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import Image from "next/image";

interface Brand {
  name: string;
  logo: string; // Path to logo image
  width: number;
  height: number;
}

const brands: Brand[] = [
  {
    name: "Meta",
    logo: "/images/brands/meta.png",
    width: 120,
    height: 40,
  },
  {
    name: "AWS",
    logo: "/images/brands/aws.png",
    width: 80,
    height: 40,
  },
  {
    name: "Nasdaq",
    logo: "/images/brands/nasdaq.png",
    width: 140,
    height: 40,
  },
  {
    name: "Apple",
    logo: "/images/brands/apple.png",
    width: 40,
    height: 40,
  },
  {
    name: "Google",
    logo: "/images/brands/google.png",
    width: 120,
    height: 40,
  },
  {
    name: "Ray-Ban",
    logo: "/images/brands/rayban.png",
    width: 120,
    height: 40,
  },
  {
    name: "SuitSupply",
    logo: "/images/brands/suitsupply.png",
    width: 140,
    height: 40,
  },
  {
    name: "Deloitte",
    logo: "/images/brands/deloitte.png",
    width: 120,
    height: 40,
  },
  {
    name: "American Express",
    logo: "/images/brands/amex.png",
    width: 140,
    height: 40,
  },
  {
    name: "Barbour",
    logo: "/images/brands/barbour.png",
    width: 120,
    height: 40,
  },
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
            Whether they're executives, entrepreneurs, or professionals looking
            to refine their image, I've helped them all look their best and
            project confidence in every aspect of their careers.
          </p>
        </motion.div>
      </div>

      {/* Infinite Scroll Animation - Row 1 */}
      <div className="relative mb-12">
        {/* Gradient fade on edges */}
        <div className="absolute left-0 top-0 bottom-0 w-40 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-40 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none" />

        {/* Scrolling container with proper loop */}
        <div className="flex gap-16 will-change-transform">
          <div className="flex gap-16 animate-scroll-left">
            {/* Triple the content for seamless infinite scroll */}
            {[...brandsRow1, ...brandsRow1, ...brandsRow1].map(
              (brand, index) => (
                <div
                  key={`brand-row1-${index}`}
                  className="flex-shrink-0 group flex items-center justify-center"
                >
                  <div className="relative px-6 py-4 rounded-lg transition-all duration-500 hover:bg-white">
                    {/* Brand name text - visible by default, hidden on hover */}
                    <span className="text-2xl md:text-3xl font-heading tracking-widest text-white/40 group-hover:opacity-0 transition-opacity duration-500 whitespace-nowrap">
                      {brand.name}
                    </span>
                    {/* Brand logo - hidden by default, visible on hover */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <Image
                        src={brand.logo}
                        alt={`${brand.name} logo`}
                        width={brand.width}
                        height={brand.height}
                        className="object-contain"
                        loading="lazy"
                      />
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </div>

      {/* Separator line */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-12" />

      {/* Infinite Scroll Animation - Row 2 (Reverse) */}
      <div className="relative mb-12">
        {/* Gradient fade on edges */}
        <div className="absolute left-0 top-0 bottom-0 w-40 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-40 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none" />

        {/* Scrolling container (reverse) with proper loop */}
        <div className="flex gap-16 will-change-transform">
          <div className="flex gap-16 animate-scroll-right">
            {/* Triple the content for seamless infinite scroll */}
            {[...brandsRow2, ...brandsRow2, ...brandsRow2].map(
              (brand, index) => (
                <div
                  key={`brand-row2-${index}`}
                  className="flex-shrink-0 group flex items-center justify-center"
                >
                  <div className="relative px-6 py-4 rounded-lg transition-all duration-500 hover:bg-white">
                    {/* Brand name text - visible by default, hidden on hover */}
                    <span className="text-2xl md:text-3xl font-heading tracking-widest text-white/40 group-hover:opacity-0 transition-opacity duration-500 whitespace-nowrap">
                      {brand.name}
                    </span>
                    {/* Brand logo - hidden by default, visible on hover */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <Image
                        src={brand.logo}
                        alt={`${brand.name} logo`}
                        width={brand.width}
                        height={brand.height}
                        className="object-contain"
                        loading="lazy"
                      />
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </div>

      {/* Separator line */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-12" />

      {/* Infinite Scroll Animation - Row 3 (Forward) */}
      <div className="relative">
        {/* Gradient fade on edges */}
        <div className="absolute left-0 top-0 bottom-0 w-40 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-40 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none" />

        {/* Scrolling container with proper loop */}
        <div className="flex gap-16 will-change-transform">
          <div className="flex gap-16 animate-scroll-left-slow">
            {/* Triple the content for seamless infinite scroll */}
            {[...brandsRow3, ...brandsRow3, ...brandsRow3].map(
              (brand, index) => (
                <div
                  key={`brand-row3-${index}`}
                  className="flex-shrink-0 group flex items-center justify-center"
                >
                  <div className="relative px-6 py-4 rounded-lg transition-all duration-500 hover:bg-white">
                    {/* Brand name text - visible by default, hidden on hover */}
                    <span className="text-2xl md:text-3xl font-heading tracking-widest text-white/40 group-hover:opacity-0 transition-opacity duration-500 whitespace-nowrap">
                      {brand.name}
                    </span>
                    {/* Brand logo - hidden by default, visible on hover */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <Image
                        src={brand.logo}
                        alt={`${brand.name} logo`}
                        width={brand.width}
                        height={brand.height}
                        className="object-contain"
                        loading="lazy"
                      />
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
