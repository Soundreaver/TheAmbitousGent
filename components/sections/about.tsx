"use client"

import { motion } from 'framer-motion'

export function About() {
  return (
    <section id="about" className="relative py-24 lg:py-32 bg-zinc-950">

      <div className="container mx-auto px-6"></div>
      {/* Top fade overlay */}
      {/* <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black to-transparent pointer-events-none z-10" /> */}
      
      {/* Bottom fade overlay */}
      {/* <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent pointer-events-none z-10" /> */}
      
      <div className="container mx-auto px-6 relative z-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left: Pull Quote */}
            <motion.div
              initial={{ opacity: 0, x: -60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="relative"
            >
              <div className="relative">
                {/* Quotation mark */}
                <span className="absolute -top-4 -left-2 text-8xl lg:text-9xl text-gold/20 font-heading leading-none">
                  "
                </span>
                
                <blockquote className="relative z-10 pt-8">
                  <p className="text-3xl lg:text-4xl xl:text-5xl font-heading italic text-white leading-tight tracking-wide">
                    Excellence is not a destination, but a standard we maintain in every detail.
                  </p>
                </blockquote>

                {/* Decorative line */}
                <div className="mt-8 w-24 h-px bg-gold-gradient" />
              </div>
            </motion.div>

            {/* Right: Description */}
            <motion.div
              initial={{ opacity: 0, x: 60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-6"
            >
              <h2 className="text-4xl lg:text-5xl font-heading tracking-wide mb-8">
                <span className="text-gold-gradient">Our Philosophy</span>
              </h2>

              <p className="text-lg text-white/80 leading-relaxed tracking-wide">
                At The Ambitious Gent, we understand that true sophistication cannot be purchased—it must be cultivated. Our approach transcends traditional image consulting to offer a comprehensive transformation grounded in discretion, authenticity, and timeless elegance.
              </p>

              <p className="text-lg text-white/80 leading-relaxed tracking-wide">
                We work exclusively with ambitious professionals who recognize that personal presentation is an investment in their success. Through personalized consultation and meticulous attention to detail, we help you discover and refine the distinctive presence that sets you apart.
              </p>

              <p className="text-lg text-white/80 leading-relaxed tracking-wide">
                Our methodology combines classical principles with contemporary sensibilities, ensuring your style remains both relevant and enduring. We believe in quality over quantity, substance over trends, and confidence through authenticity.
              </p>

              <div className="pt-6">
                <div className="inline-flex items-center gap-3 text-gold/80 text-sm tracking-widest uppercase">
                  <div className="w-12 h-px bg-gold-gradient" />
                  <span>Since 2024</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
