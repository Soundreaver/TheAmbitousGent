"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import Image from "next/image";
import { useRef } from "react";

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);

  // Parallax effect: track scroll position
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  // Transform scroll to parallax movement (image moves slower than scroll)
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      ref={sectionRef}
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black"
    >
      {/* Parallax background image with reveal animation */}
      <motion.div
        className="absolute inset-0 z-0"
        style={{
          y: imageY,
          scale: imageScale,
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      >
        <Image
          src="/images/hero_bg.png"
          alt="Luxury menswear background"
          fill
          className="object-cover opacity-50"
          priority
          quality={90}
        />
        {/* <motion.div
          className="absolute inset-0 bg-gradient-to-b from-black via-black to-transparent"
        /> */}
      </motion.div>

      {/* Bottom fade gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black via-black/80 to-transparent z-[5]" />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6">
        <div className="max-w-5xl mx-auto text-center">
          {/* Main headline with Aceternity Text Generate Effect */}
          {/* <div className="mb-8">
            <TextGenerateEffect
              words="Elevate Your Presence"
              className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-heading tracking-widest text-white mb-0"
              duration={1}
              filter={true}
            />
          </div> */}

          {/* Main headline */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <motion.h1
              className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-heading tracking-widest mb-8"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.8,
                delay: 0.4,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <span className="text-white">Elevate Your</span>
              <br />
              <span className="block mt-2 text-gold-shine">Presence</span>
            </motion.h1>
          </motion.div>

          {/* Subheadline */}
          <motion.p
            className="text-lg md:text-xl lg:text-2xl text-white/90 max-w-3xl mx-auto mb-12 leading-relaxed tracking-wide"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="text-gold">Luxury image consulting</span> for the modern professional. Discover
            timeless sophistication through personalized style, refined
            grooming, and confident presence.
          </motion.p>

          {/* CTAs */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <Button
              size="lg"
              onClick={() => scrollToSection("contact")}
              className="bg-gold-gradient text-black hover:shadow-gold tracking-wide px-8 py-6 text-base font-semibold group transition-all duration-300"
            >
              Start Your Transformation
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => scrollToSection("services")}
              className="border-gold text-gold hover:bg-gold/10 hover-border-gold tracking-wide px-8 py-6 text-base transition-all duration-300"
            >
              Learn More
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator - positioned relative to section */}
      <motion.div
        className="absolute bottom-12 left-1/2 transform -translate-x-1/2 z-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.5 }}
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-2 text-gold/70"
        >
          <span className="text-xs tracking-widest uppercase">Scroll</span>
          <div className="w-px h-12 bg-gradient-to-b from-gold/70 to-transparent" />
        </motion.div>
      </motion.div>
    </section>
  );
}
