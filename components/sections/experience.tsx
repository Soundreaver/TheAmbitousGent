"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";

const experienceBlocks = [
  {
    title: "Who is Sabab?",
    description:
      "With over 12 years of experience in the world of style and personal image, I specialize in helping men elevate their confidence through tailored wardrobe solutions. I've had the privilege of working with numerous clients, guiding them  to discover their unique style, build versatile capsule wardrobes,  and present their best selves in any situation. Whether it's dressing for success,  refining your everyday look, or mastering the art of personal grooming, I'm here to ensure you always look and feel your absolute best.",
    subtext:
      "We go beyond trends to establish your signature aesthetic—timeless, refined, and distinctly yours.",
    imagePosition: "left" as const,
    imageSrc: "/images/exp_05.jpg",
  },
  {
    title: "Isn't Image Consulting just for CEOs and celebrities?",
    description:
      "I launched this business because I was tired of seeing men bombarded with bad fashion advice from outdated sources and social media influencers.\n\nDo you really care what some influencer is wearing while sipping a $10 latte?\nDidn't think so.\n\nI help everyday men who want to look sharp without wasting hours in stores or online.\n\nMen who are done throwing money away on clothes that don't suit them.\nMen who want to know how to dress well, feel confident, and make an impression.\n\nI help Men like you.",
    subtext: "",
    imagePosition: "right" as const,
    imageSrc: "/images/exp_06.png",
  },
  {
    title: "",
    description:
      "At The Ambitious Gent, I believe style is more than appearance — it's a lifestyle.\nThat's why I provide personalized image consulting services to help you refine your wardrobe, grooming, and presence with confidence. Whether you need a full wardrobe revamp, outfit coordination, or guidance on personal grooming, my goal is to make style effortless and authentic for you.\n\nBut it doesn't stop there. Through The Ambitious Journal - my dedicated blog —\nI share insights, guides, and stories on men's fashion, lifestyle, mindset, and growth.\nThink of it as your go-to resource for elevating not just how you look, but how you live.\n\nSo whether you're ready to work with me one-on-one or simply want to learn and be inspired, The Ambitious Gent is here to keep you moving forward, one confident step at a time.",
    subtext: "",
    imagePosition: "left" as const,
    imageSrc: "/images/exp_07.png",
  },
];

function ExperienceBlock({
  block,
  index,
}: {
  block: (typeof experienceBlocks)[0];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const imageScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.1, 1, 1.1]);

  const isLeft = block.imagePosition === "left";

  return (
    <div
      ref={ref}
      className={`grid grid-cols-1 lg:grid-cols-2 gap-0 ${
        index !== 0 ? "mt-24 lg:mt-32" : ""
      }`}
    >
      {/* Image */}
      <motion.div
        initial={{ opacity: 0, x: isLeft ? -60 : 60 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-50px", amount: 0.2 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className={`relative aspect-[4/3] lg:aspect-square overflow-hidden bg-zinc-900 ${
          isLeft ? "lg:order-1" : "lg:order-2"
        }`}
      >
        {/* Actual Image with Parallax */}
        <motion.div
          style={{ y: imageY, scale: imageScale }}
          className="absolute inset-0"
        >
          <Image
            src={block.imageSrc}
            alt={block.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
            quality={90}
            priority={index === 0}
          />
        </motion.div>

        {/* Border fade overlays */}
        <div className="absolute inset-0 z-10 pointer-events-none">
          {/* Top fade */}
          <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-black to-transparent" />
          {/* Bottom fade */}
          <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black to-transparent" />
          {/* Left fade */}
          <div className="absolute top-0 left-0 bottom-0 w-20 bg-gradient-to-r from-black to-transparent" />
          {/* Right fade */}
          <div className="absolute top-0 right-0 bottom-0 w-20 bg-gradient-to-l from-black to-transparent" />
        </div>
      </motion.div>

      {/* Text Content */}
      <motion.div
        initial={{ opacity: 0, x: isLeft ? 60 : -60 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-50px", amount: 0.2 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
        className={`flex flex-col justify-center p-12 lg:p-20 xl:p-32 bg-black ${
          isLeft ? "lg:order-2" : "lg:order-1"
        }`}
      >
        <div className="space-y-6 max-w-2xl">
          {/* Title */}
          <h3 className="text-3xl lg:text-4xl xl:text-5xl font-heading tracking-wide text-white leading-tight">
            {block.title}
          </h3>

          {/* Description */}
          <div className="text-lg text-white/80 leading-relaxed tracking-wide space-y-4">
            {block.description.split('\n').map((paragraph, idx) => (
              paragraph.trim() && <p key={idx}>{paragraph}</p>
            ))}
          </div>

          {/* Subtext */}
          <p className="text-base text-white/60 leading-relaxed tracking-wide italic">
            {block.subtext}
          </p>

          {/* Decorative line */}
          <div className="pt-4">
            <div className="w-16 h-px bg-gold-gradient" />
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export function Experience() {
  return (
    <section id="experience" className="relative py-24 lg:py-32 bg-black overflow-hidden">
      {/* Section Header - Centered with padding */}
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px", amount: 0.3 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-20 lg:mb-24"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading tracking-widest mb-6">
            <span className="text-gold-gradient">The Experience</span>
          </h2>
          <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto tracking-wide leading-relaxed">
            A comprehensive approach to{" "}
            <span className="text-gold">personal excellence</span> across every
            dimension of your lifestyle.
          </p>
        </motion.div>
      </div>

      {/* Experience Blocks - Full Width */}
      <div className="w-full overflow-hidden">
        {experienceBlocks.map((block, index) => (
          <ExperienceBlock key={`exp-${index}`} block={block} index={index} />
        ))}
      </div>
    </section>
  );
}
