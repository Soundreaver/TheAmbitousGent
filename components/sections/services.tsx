"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { AnimatedGalleryBackground } from "@/components/ui/animated-gallery-background";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";

const services = [
  {
    title: "Style Blueprint",
    subtitle: "Foundational Consultation",
    description:
      "I’ll help you discover your unique style identity and give you the direction you need to start dressing with confidence and clarity. This is the foundation of looking and feeling like the best version of yourself.",
    image: "/images/service_01.png",
    features: [
      "Body Type Analysis",
      "Color Consultation",
      "Style Profile Creation",
      "Wardrobe Assessment",
    ],
  },
  {
    title: "Wardrobe Revamp",
    subtitle: "Complete Transformation",
    description:
      "I’ll guide you through a complete reset of your closet — removing the noise, filling in the gaps, and building a wardrobe that’s versatile, timeless, and effortless. You’ll finally have outfits that work for you, not against you.",
    image: "/images/service_02.png",
    features: [
      "Closet Organization",
      "Personal Shopping",
      "Outfit Curation",
      "Accessory Selection",
    ],
  },
  {
    title: "Signature Styling",
    subtitle: "Ongoing Excellence",
    description:
      "I’ll make sure you’re covered for everything from your day-to-day presence to those special occasions where your image matters most. With ongoing guidance, seasonal refreshes, and event styling, you’ll always show up at your absolute best.",
    image: "/images/service_03.png",
    features: [
      "Event Styling",
      "Seasonal Updates",
      "Trend Guidance",
      "Unlimited Consultation",
    ],
  },
];

export function Services() {
  const [galleryImages, setGalleryImages] = useState<string[]>([]);

  useEffect(() => {
    async function fetchFeaturedImages() {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("gallery_images")
          .select("url")
          .eq("is_featured", true)
          .order("display_order", { ascending: true });

        if (error) {
          console.error("Error fetching gallery images:", error);
          setGalleryImages([
            "/images/exp_01.jpeg",
            "/images/exp_02.jpeg",
            "/images/exp_03.jpeg",
            "/images/exp_04.jpg",
            "/images/exp_05.jpg",
            "/images/exp_06.png",
            "/images/exp_07.png",
          ]);
          return;
        }

        if (data && data.length > 0) {
          setGalleryImages(data.map((img) => img.url));
        } else {
          setGalleryImages([
            "/images/exp_01.jpeg",
            "/images/exp_02.jpeg",
            "/images/exp_03.jpeg",
            "/images/exp_04.jpg",
            "/images/exp_05.jpg",
            "/images/exp_06.png",
            "/images/exp_07.png",
          ]);
        }
      } catch (err) {
        console.error("Error in fetchFeaturedImages:", err);
        setGalleryImages([
          "/images/exp_01.jpeg",
          "/images/exp_02.jpeg",
          "/images/exp_03.jpeg",
          "/images/exp_04.jpg",
          "/images/exp_05.jpg",
          "/images/exp_06.png",
          "/images/exp_07.png",
        ]);
      }
    }

    fetchFeaturedImages();
  }, []);

  return (
    <section id="services" className="relative py-24 lg:py-32 bg-black">
      {/* Animated Gallery Background - Only render if images are loaded */}
      {galleryImages.length > 0 && <AnimatedGalleryBackground images={galleryImages} />}
      
      <div className="container mx-auto px-6 relative z-30">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-20 lg:mb-28"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading tracking-widest text-white mb-6 text-gold">
            Signature Services
          </h2>
          <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto tracking-wide leading-relaxed">
            At The Ambitious Gent, I don’t believe in cookie-cutter style
            solutions. Every man has his own story, and your wardrobe should
            reflect that. My services are designed to give you clarity,
            confidence, and the presence to walk into any room knowing you look
            the part.
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10 max-w-7xl mx-auto">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{
                duration: 0.8,
                delay: index * 0.15,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="group relative"
            >
              {/* Card Container */}
              <div className="relative h-full bg-zinc-950 border border-white/10 overflow-hidden transition-all duration-700 hover:border-white/30 hover:shadow-2xl hover:shadow-white/5 flex flex-col">
                {/* Image Section */}
                <div className="relative h-64 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent z-10" />
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />

                  {/* Subtitle Badge */}
                  <div className="absolute top-6 left-6 z-20">
                    <div className="bg-black/40 backdrop-blur-sm border border-white/10 px-4 py-2">
                      <p className="text-white/80 text-xs tracking-[0.3em] uppercase font-light">
                        {service.subtitle}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-8 lg:p-10 flex flex-col flex-grow">
                  {/* Title - Now has consistent space */}
                  <h3 className="text-2xl lg:text-3xl font-heading tracking-wider text-white mb-6 min-h-[3.5rem] flex items-center text-gold-shine">
                    {service.title}
                  </h3>

                  {/* Description */}
                  <p className="text-white/70 leading-relaxed tracking-wide mb-6 text-sm lg:text-base">
                    {service.description}
                  </p>

                  {/* Features List */}
                  <div className="space-y-2.5 mb-8 flex-grow">
                    {service.features.map((feature, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{
                          duration: 0.5,
                          delay: index * 0.15 + idx * 0.1,
                        }}
                        className="flex items-center gap-3 text-white/60 text-sm"
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-white/40" />
                        <span className="tracking-wide">{feature}</span>
                      </motion.div>
                    ))}
                  </div>

                  {/* Divider */}
                  <div className="h-px bg-white/10 mb-6" />

                  {/* CTA */}
                  <div className="mt-auto">
                    <a
                      href="/contact"
                      className="group/link inline-flex items-center gap-3 text-white/90 hover:text-white text-sm tracking-widest uppercase transition-all duration-300"
                    >
                      <span>Begin Your Journey</span>
                      <ArrowRight
                        className="w-4 h-4 transition-transform duration-300 group-hover/link:translate-x-2"
                        strokeWidth={1.5}
                      />
                    </a>
                  </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-16 h-16 border-t border-r border-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                <div className="absolute bottom-0 left-0 w-16 h-16 border-b border-l border-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-center mt-20 lg:mt-24"
        >
          <p className="text-white/60 tracking-wide mb-6 text-sm lg:text-base">
            Not sure which service suits you best?
          </p>
          <a
            href="/contact"
            className="inline-block px-8 lg:px-12 py-4 lg:py-5 bg-white text-black font-heading tracking-widest text-sm lg:text-base uppercase hover:bg-white/90 transition-all duration-300 hover:shadow-lg hover:shadow-white/20"
          >
            Schedule Discovery Call
          </a>
        </motion.div>
      </div>
    </section>
  );
}
