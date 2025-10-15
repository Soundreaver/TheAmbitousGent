"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Navbar,
  NavBody,
  MobileNav,
  MobileNavHeader,
  MobileNavMenu,
  MobileNavToggle,
} from "@/components/ui/resizable-navbar";

const navLinks = [
  { name: "The Ambitious Journal", link: "/journal" },
  { name: "Services", link: "/services" },
  { name: "About", link: "/about" },
];

export function NavigationAceternity() {
  const [isOpen, setIsOpen] = useState(false);
  const [hovered, setHovered] = useState<number | null>(null);

  const handleNavClick = (href: string) => {
    setIsOpen(false);
  };

  return (
    <Navbar className="fixed top-0">
      {/* Desktop Navbar */}
      <NavBody className="glassmorphism-nav">
        {/* Logo */}
        <a
          href="/"
          className="relative z-20 flex items-center space-x-2 px-2 py-1 text-2xl font-heading tracking-widest text-gold-shine hover-gold-glow transition-all"
        >
          TAG
        </a>

        {/* Nav Items with Selector Animation */}
        <motion.div
          onMouseLeave={() => setHovered(null)}
          className="absolute inset-0 hidden flex-1 flex-row items-center justify-center space-x-2 lg:flex"
        >
          {navLinks.map((link, idx) => (
            <a
              key={link.name}
              href={link.link}
              onMouseEnter={() => setHovered(idx)}
              className={`relative px-4 py-2 text-base tracking-wide transition-colors ${
                link.name === "The Ambitious Journal"
                  ? "text-white font-semibold"
                  : "text-white/90"
              } hover:text-gold`}
            >
              {hovered === idx && (
                <motion.div
                  layoutId="hovered"
                  className="absolute inset-0 h-full w-full rounded-full bg-white/10"
                />
              )}
              {link.name === "The Ambitious Journal" && (
                <>
                  {/* Animated gradient background */}
                  <span className="absolute inset-0 -z-10 bg-gold-gradient opacity-20 blur-xl animate-pulse" />
                  {/* Gold shimmer effect */}
                  <span className="absolute inset-0 -z-10 bg-gradient-to-r from-transparent via-gold/30 to-transparent animate-shimmer" />
                </>
              )}
              <span className="relative z-20">{link.name}</span>
            </a>
          ))}
        </motion.div>

        {/* CTA Button */}
        <a
          href="/contact"
          className="group relative z-20 px-3 py-1.5 text-sm rounded-md border border-gold/40 text-gold hover:border-transparent hover:-translate-y-0.5 hover:shadow-gold-sm tracking-wide font-medium transition-all duration-300 cursor-pointer overflow-hidden"
        >
          <span className="absolute inset-0 bg-gold-gradient opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <span className="relative z-10 group-hover:text-black transition-colors duration-300">
            Book Consultation
          </span>
        </a>
      </NavBody>

      {/* Mobile Navbar */}
      <MobileNav className="glassmorphism-nav">
        <MobileNavHeader>
          {/* Logo */}
          <a
            href="/"
            className="text-2xl font-heading tracking-widest text-gold-shine"
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
              onClick={() => handleNavClick(link.link)}
              className={`relative text-2xl font-heading tracking-wide transition-colors ${
                link.name === "The Ambitious Journal"
                  ? "text-white hover:text-gold font-bold"
                  : "text-white/90 hover:text-gold"
              }`}
            >
              {link.name === "The Ambitious Journal" && (
                <>
                  {/* Animated gradient background for mobile */}
                  <span className="absolute inset-0 -z-10 bg-gold-gradient opacity-20 blur-xl animate-pulse" />
                  {/* Gold shimmer effect for mobile */}
                  <span className="absolute inset-0 -z-10 bg-gradient-to-r from-transparent via-gold/30 to-transparent animate-shimmer" />
                </>
              )}
              {link.name}
            </a>
          ))}
          <a
            href="/contact"
            className="group relative w-full border border-gold/40 text-gold hover:border-transparent hover:shadow-gold-sm tracking-wide py-4 text-base mt-4 font-medium transition-all duration-300 text-center rounded-md block overflow-hidden"
          >
            <span className="absolute inset-0 bg-gold-gradient opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <span className="relative z-10 group-hover:text-black transition-colors duration-300">
              Book Consultation
            </span>
          </a>
        </MobileNavMenu>
      </MobileNav>
    </Navbar>
  );
}
