"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  MobileNavHeader,
  MobileNavMenu,
  MobileNavToggle,
  NavbarButton,
} from '@/components/ui/resizable-navbar'

const navLinks = [
  { name: 'Home', link: '#home' },
  { name: 'Services', link: '#services' },
  { name: 'Experience', link: '#experience' },
  { name: 'About', link: '#about' },
  { name: 'Testimonials', link: '#testimonials' },
  { name: 'Contact', link: '#contact' },
]

export function NavigationAceternity() {
  const [isOpen, setIsOpen] = useState(false)

  const scrollToSection = (href: string) => {
    const element = document.getElementById(href.substring(1))
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
      setIsOpen(false)
    }
  }

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    scrollToSection(href)
  }

  return (
    <Navbar className="fixed top-0">
      {/* Desktop Navbar */}
      <NavBody className="glassmorphism-nav">
        {/* Logo */}
        <a
          href="#home"
          onClick={(e) => handleNavClick(e, '#home')}
          className="relative z-20 flex items-center space-x-2 px-2 py-1 text-2xl font-heading tracking-widest text-white hover:opacity-80 transition-opacity"
        >
          TAG
        </a>

        {/* Nav Items */}
        <NavItems
          items={navLinks}
          onItemClick={() => {}}
          className="!text-white/70 hover:!text-white"
        />

        {/* CTA Button */}
        <NavbarButton
          variant="dark"
          as="button"
          onClick={() => scrollToSection('#contact')}
          className="!bg-white !text-black hover:!bg-white/90 !tracking-wide !font-normal"
        >
          Book Consultation
        </NavbarButton>
      </NavBody>

      {/* Mobile Navbar */}
      <MobileNav className="glassmorphism-nav">
        <MobileNavHeader>
          {/* Logo */}
          <a
            href="#home"
            onClick={(e) => handleNavClick(e, '#home')}
            className="text-2xl font-heading tracking-widest text-white"
          >
            TAG
          </a>

          {/* Toggle */}
          <MobileNavToggle isOpen={isOpen} onClick={() => setIsOpen(!isOpen)} />
        </MobileNavHeader>

        {/* Mobile Menu */}
        <MobileNavMenu
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          className="!bg-black/95 backdrop-blur-xl border border-white/10"
        >
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.link}
              onClick={(e) => handleNavClick(e, link.link)}
              className="text-2xl font-heading tracking-wide text-white/90 hover:text-white transition-colors"
            >
              {link.name}
            </a>
          ))}
          <Button
            onClick={() => scrollToSection('#contact')}
            className="w-full bg-white text-black hover:bg-white/90 tracking-wide py-6 text-lg mt-4"
          >
            Book Consultation
          </Button>
        </MobileNavMenu>
      </MobileNav>
    </Navbar>
  )
}
