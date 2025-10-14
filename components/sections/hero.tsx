"use client"

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import { TextGenerateEffect } from '@/components/ui/text-generate-effect'

export function Hero() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black"
    >
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-black to-zinc-950" />
      
      {/* Subtle spotlight effect */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_0%,transparent_70%)]" />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6">
        <div className="max-w-5xl mx-auto text-center">
          {/* Main headline with Aceternity Text Generate Effect */}
          <div className="mb-8">
            <TextGenerateEffect
              words="Elevate Your Presence"
              className="!text-5xl !md:text-6xl !lg:text-7xl !xl:text-8xl !font-heading !tracking-widest !text-white !mb-0"
              duration={1}
              filter={true}
            />
          </div>

          {/* ORIGINAL ANIMATION - Comment this out to use Text Generate Effect
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <motion.h1
              className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-heading tracking-widest text-white mb-8"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              Elevate Your
              <br />
              <span className="block mt-2">Presence</span>
            </motion.h1>
          </motion.div>
          */}

          {/* Subheadline */}
          <motion.p
            className="text-lg md:text-xl lg:text-2xl text-white/80 max-w-3xl mx-auto mb-12 leading-relaxed tracking-wide"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            Luxury image consulting for the modern professional. Discover timeless sophistication through personalized style, refined grooming, and confident presence.
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
              onClick={() => scrollToSection('contact')}
              className="bg-white text-black hover:bg-white/90 tracking-wide px-8 py-6 text-base group"
            >
              Start Your Transformation
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => scrollToSection('services')}
              className="border-white text-white hover:bg-white/10 tracking-wide px-8 py-6 text-base"
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
          className="flex flex-col items-center gap-2 text-white/50"
        >
          <span className="text-xs tracking-widest uppercase">Scroll</span>
          <div className="w-px h-12 bg-gradient-to-b from-white/50 to-transparent" />
        </motion.div>
      </motion.div>
    </section>
  )
}
