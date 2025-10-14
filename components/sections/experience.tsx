"use client"

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'

const experienceBlocks = [
  {
    title: "The Modern Gentleman",
    description: "Your personal style is the foundation of your presence. Through comprehensive analysis and thoughtful curation, we build a wardrobe that reflects your ambitions and values. Every piece is selected with intention, every combination crafted to communicate confidence and sophistication.",
    subtext: "We go beyond trends to establish your signature aesthetic—timeless, refined, and distinctly yours.",
    imagePosition: "left" as const,
  },
  {
    title: "Refined Living",
    description: "Excellence in grooming is a daily commitment to yourself. From skincare rituals that enhance your natural features to fragrance selection that leaves a lasting impression, we elevate every aspect of your personal care routine.",
    subtext: "Attention to detail in the smallest moments creates the foundation for extraordinary presence.",
    imagePosition: "right" as const,
  },
  {
    title: "Command Presence",
    description: "True influence stems from confident, authentic communication and impeccable social grace. We refine your ability to navigate any setting—from boardrooms to exclusive events—with natural authority and refined etiquette.",
    subtext: "Master the subtle art of presence that opens doors and commands respect.",
    imagePosition: "left" as const,
  },
]

function ExperienceBlock({ 
  block, 
  index 
}: { 
  block: typeof experienceBlocks[0], 
  index: number 
}) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  })

  const imageY = useTransform(scrollYProgress, [0, 1], [100, -100])
  const imageScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.1, 1, 1.1])

  const isLeft = block.imagePosition === "left"

  return (
    <div 
      ref={ref}
      className={`grid grid-cols-1 lg:grid-cols-2 gap-0 ${
        index !== 0 ? 'mt-24 lg:mt-32' : ''
      }`}
    >
      {/* Image */}
      <motion.div
        initial={{ opacity: 0, x: isLeft ? -60 : 60 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className={`relative aspect-[4/3] lg:aspect-square overflow-hidden bg-zinc-900 ${
          isLeft ? 'lg:order-1' : 'lg:order-2'
        }`}
      >
        {/* Placeholder gradient */}
        <motion.div 
          style={{ y: imageY, scale: imageScale }}
          className="absolute inset-0 bg-gradient-to-br from-zinc-800 via-zinc-900 to-black"
        >
          {/* Subtle pattern overlay */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1)_1px,transparent_1px)] [background-size:24px_24px]" />
          </div>
          
          {/* Number overlay for visual interest */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-9xl font-heading text-white/5">
              {(index + 1).toString().padStart(2, '0')}
            </span>
          </div>
        </motion.div>

        {/* Vignette overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
      </motion.div>

      {/* Text Content */}
      <motion.div
        initial={{ opacity: 0, x: isLeft ? 60 : -60 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
        className={`flex flex-col justify-center p-8 lg:p-16 xl:p-20 bg-black ${
          isLeft ? 'lg:order-2' : 'lg:order-1'
        }`}
      >
        <div className="space-y-6">
          {/* Title */}
          <h3 className="text-3xl lg:text-4xl xl:text-5xl font-heading tracking-wide text-white leading-tight">
            {block.title}
          </h3>

          {/* Description */}
          <p className="text-lg text-white/80 leading-relaxed tracking-wide">
            {block.description}
          </p>

          {/* Subtext */}
          <p className="text-base text-white/60 leading-relaxed tracking-wide italic">
            {block.subtext}
          </p>

          {/* Decorative line */}
          <div className="pt-4">
            <div className="w-16 h-px bg-white/20" />
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export function Experience() {
  return (
    <section id="experience" className="relative py-24 lg:py-32 bg-black">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-20 lg:mb-24"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading tracking-widest text-white mb-6">
            The Experience
          </h2>
          <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto tracking-wide leading-relaxed">
            A comprehensive approach to personal excellence across every dimension of your lifestyle.
          </p>
        </motion.div>

        {/* Experience Blocks */}
        <div className="max-w-7xl mx-auto">
          {experienceBlocks.map((block, index) => (
            <ExperienceBlock key={block.title} block={block} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}
