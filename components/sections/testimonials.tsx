"use client"

import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Quote } from 'lucide-react'

const testimonials = [
  {
    quote: "Working with TAG transformed not just my wardrobe, but my entire approach to professional presence. The attention to detail and personalized guidance exceeded every expectation.",
    name: "Michael R.",
    profession: "Investment Director",
  },
  {
    quote: "The level of sophistication and discretion is unparalleled. TAG doesn't follow trends—they help you establish a timeless personal brand that commands respect.",
    name: "James K.",
    profession: "Corporate Executive",
  },
  {
    quote: "From style consultation to social refinement, every aspect of the experience reflects true luxury. An investment that continues to yield returns in every professional interaction.",
    name: "David M.",
    profession: "Entrepreneur",
  },
]

export function Testimonials() {
  return (
    <section id="testimonials" className="relative py-24 lg:py-32 bg-zinc-950">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16 lg:mb-20"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading tracking-widest text-white mb-6">
            Client Distinction
          </h2>
          <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto tracking-wide leading-relaxed">
            The confidence and results our clients achieve speak to our commitment to excellence.
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-7xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{
                duration: 0.7,
                delay: index * 0.1,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <Card className="h-full bg-black border-white/10 hover:border-white/20 transition-all duration-500">
                <CardContent className="p-8 lg:p-10 flex flex-col h-full">
                  {/* Quote Icon */}
                  <div className="mb-6">
                    <Quote className="w-8 h-8 text-white/20" strokeWidth={1.5} />
                  </div>

                  {/* Quote */}
                  <blockquote className="text-white/80 leading-relaxed tracking-wide mb-8 flex-grow italic">
                    {testimonial.quote}
                  </blockquote>

                  {/* Divider */}
                  <div className="w-12 h-px bg-white/20 mb-6" />

                  {/* Author */}
                  <div>
                    <p className="text-white font-medium tracking-wide mb-1">
                      {testimonial.name}
                    </p>
                    <p className="text-white/60 text-sm tracking-wide">
                      {testimonial.profession}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Trust Badge / Note */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-center mt-16"
        >
          <p className="text-white/50 text-sm tracking-widest uppercase">
            Testimonials reflect genuine client experiences. Names abbreviated for discretion.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
