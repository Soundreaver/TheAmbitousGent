"use client"

import { motion } from 'framer-motion'
import { Instagram, Linkedin, Mail } from 'lucide-react'

const footerLinks = {
  services: [
    { name: 'Image Consulting', href: '#services' },
    { name: 'Grooming Excellence', href: '#services' },
    { name: 'Social Refinement', href: '#services' },
    { name: 'Lifestyle Elevation', href: '#services' },
  ],
  company: [
    { name: 'About', href: '#about' },
    { name: 'Experience', href: '#experience' },
    { name: 'Testimonials', href: '#testimonials' },
    { name: 'Contact', href: '#contact' },
  ],
}

const socialLinks = [
  { name: 'Instagram', icon: Instagram, href: '#' },
  { name: 'LinkedIn', icon: Linkedin, href: '#' },
  { name: 'Email', icon: Mail, href: '#contact' },
]

export function Footer() {
  const scrollToSection = (href: string) => {
    if (href.startsWith('#')) {
      const element = document.getElementById(href.substring(1))
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }

  return (
    <footer className="relative bg-black border-t border-white/10">
      <div className="container mx-auto px-6 py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h3 className="text-3xl font-heading tracking-widest mb-4">
                <span className="text-gold-shine">TAG</span>
              </h3>
              <p className="text-white/70 tracking-wide leading-relaxed max-w-md">
                The Ambitious Gent — Where sophistication meets ambition. Elevating the modern professional through timeless elegance and refined presence.
              </p>
            </motion.div>
          </div>

          {/* Services Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h4 className="text-gold font-medium tracking-widest uppercase text-sm mb-6">
              Services
            </h4>
            <ul className="space-y-3">
              {footerLinks.services.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    onClick={(e) => {
                      e.preventDefault()
                      scrollToSection(link.href)
                    }}
                    className="text-white/60 hover:text-gold transition-colors tracking-wide text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Company Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h4 className="text-gold font-medium tracking-widest uppercase text-sm mb-6">
              Company
            </h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    onClick={(e) => {
                      e.preventDefault()
                      scrollToSection(link.href)
                    }}
                    className="text-white/60 hover:text-gold transition-colors tracking-wide text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Separator */}
        <div className="border-t border-white/10 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            {/* Copyright */}
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-white/50 text-sm tracking-wide"
            >
              © {new Date().getFullYear()} The Ambitious Gent. All rights reserved.
            </motion.p>

            {/* Social Links */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="flex items-center gap-4"
            >
              {socialLinks.map((social) => {
                const Icon = social.icon
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    onClick={(e) => {
                      if (social.href.startsWith('#')) {
                        e.preventDefault()
                        scrollToSection(social.href)
                      }
                    }}
                    aria-label={social.name}
                    className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-gold/10 hover:border-gold transition-all group border border-transparent"
                  >
                    <Icon className="w-4 h-4 text-white/60 group-hover:text-gold transition-colors" />
                  </a>
                )
              })}
            </motion.div>

            {/* Legal Links */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex items-center gap-6"
            >
              <a
                href="#"
                className="text-white/50 hover:text-gold text-sm tracking-wide transition-colors"
              >
                Privacy
              </a>
              <a
                href="#"
                className="text-white/50 hover:text-gold text-sm tracking-wide transition-colors"
              >
                Terms
              </a>
            </motion.div>
          </div>
        </div>
      </div>
    </footer>
  )
}
