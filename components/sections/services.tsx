"use client"

import { motion } from 'framer-motion'
import { Shirt, Sparkles, Users, Crown } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

const services = [
  {
    icon: Shirt,
    title: 'Image Consulting',
    description: 'Comprehensive style analysis, wardrobe curation, and color consultation tailored to your lifestyle and aspirations.',
  },
  {
    icon: Sparkles,
    title: 'Grooming Excellence',
    description: 'Personalized skincare, haircare, and fragrance selection to elevate your daily grooming routine.',
  },
  {
    icon: Users,
    title: 'Social Refinement',
    description: 'Master the art of etiquette, communication, and commanding presence in any professional or social setting.',
  },
  {
    icon: Crown,
    title: 'Lifestyle Elevation',
    description: 'Complete transformation encompassing style, grooming, and personal development for the ambitious professional.',
  },
]

export function Services() {
  return (
    <section id="services" className="relative py-24 lg:py-32 bg-black">
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
            Tailored Excellence
          </h2>
          <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto tracking-wide leading-relaxed">
            Discretion, sophistication, and personalized attention define our approach to your transformation.
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-6xl mx-auto">
          {services.map((service, index) => {
            const Icon = service.icon
            return (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{
                  duration: 0.7,
                  delay: index * 0.1,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                <Card className="group h-full bg-zinc-950 border-white/10 hover:border-white/20 transition-all duration-500 hover:-translate-y-1">
                  <CardContent className="p-8 lg:p-10">
                    {/* Icon */}
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.3 }}
                      className="mb-6"
                    >
                      <div className="w-14 h-14 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors duration-500">
                        <Icon className="w-7 h-7 text-white" strokeWidth={1.5} />
                      </div>
                    </motion.div>

                    {/* Title */}
                    <h3 className="text-2xl lg:text-3xl font-heading tracking-wide text-white mb-4">
                      {service.title}
                    </h3>

                    {/* Description */}
                    <p className="text-white/70 leading-relaxed tracking-wide mb-6">
                      {service.description}
                    </p>

                    {/* Learn More Link */}
                    <a 
                      href="/contact"
                      className="text-white/90 hover:text-white text-sm tracking-widest uppercase inline-flex items-center gap-2 group/link transition-colors"
                    >
                      Book Consultation
                      <span className="inline-block transition-transform group-hover/link:translate-x-1">→</span>
                    </a>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
