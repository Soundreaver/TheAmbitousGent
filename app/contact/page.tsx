"use client";

import { useState } from "react";
import { NavigationAceternity } from "@/components/navigation-aceternity";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Send,
  CheckCircle,
  AlertCircle,
  Calendar,
  Sparkles,
  Target,
} from "lucide-react";
import { motion } from "framer-motion";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    service: "",
    message: "",
  });
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          type: "client", // Distinguish from brand partnerships
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to submit form");
      }

      setStatus("success");
      setFormData({ name: "", email: "", phone: "", service: "", message: "" });

      setTimeout(() => setStatus("idle"), 5000);
    } catch (error) {
      setStatus("error");
      setErrorMessage(
        error instanceof Error ? error.message : "An error occurred"
      );
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <>
      <NavigationAceternity />
      <main className="min-h-screen bg-black pt-32">
        <section className="relative py-16 lg:py-24 bg-black">
          <div className="container mx-auto px-6">
            {/* Page Header */}
            <div className="max-w-4xl mx-auto text-center mb-16">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-heading tracking-widest mb-6">
                <span className="text-gold-gradient">
                  Book Your Consultation
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-white/70 leading-relaxed">
                Start your transformation journey with personalized style
                guidance
              </p>
            </div>

            {/* Two Column Layout */}
            <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
              {/* Left Column - Information */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="space-y-8"
              >
                <div>
                  <h2 className="text-3xl md:text-4xl font-heading text-white mb-4">
                    Why Work With Us?
                  </h2>
                  <p className="text-lg text-white/70 leading-relaxed">
                    At The Ambitious Gent, I believe true transformation happens
                    when there’s alignment. That’s why I don’t work with
                    everyone — I work with men who are serious about investing
                    in their growth and ready to refine their presence.
                  </p>
                </div>

                {/* Key Benefits */}
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center">
                      <Sparkles className="w-6 h-6 text-gold" />
                    </div>
                    <div>
                      <h3 className="text-xl font-heading text-white mb-2">
                        Personalized Style Analysis
                      </h3>
                      <p className="text-white/60">
                        Comprehensive assessment of your current style, body
                        type, lifestyle, and goals to create a tailored
                        transformation plan.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center">
                      <Target className="w-6 h-6 text-gold" />
                    </div>
                    <div>
                      <h3 className="text-xl font-heading text-white mb-2">
                        Expert Guidance
                      </h3>
                      <p className="text-white/60">
                        One-on-one consultations with experienced style experts
                        who understand the nuances of modern masculine elegance.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center">
                      <Calendar className="w-6 h-6 text-gold" />
                    </div>
                    <div>
                      <h3 className="text-xl font-heading text-white mb-2">
                        Flexible Sessions
                      </h3>
                      <p className="text-white/60">
                        Virtual or in-person consultations that fit your
                        schedule. We adapt to your needs and preferences.
                      </p>
                    </div>
                  </div>
                </div>

                {/* What to Expect */}
                <div className="border border-white/10 rounded-lg p-6 bg-zinc-950/50">
                  <h3 className="text-xl font-heading text-gold mb-4">
                    What to Expect
                  </h3>
                  <ul className="space-y-3 text-white/70">
                    <li className="flex items-start gap-2">
                      <span className="text-gold mt-1">•</span>
                      <span>
                        Initial consultation to understand your style goals
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-gold mt-1">•</span>
                      <span>
                        Personalized style profile and recommendations
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-gold mt-1">•</span>
                      <span>Wardrobe assessment and optimization strategy</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-gold mt-1">•</span>
                      <span>Shopping guidance and ongoing support</span>
                    </li>
                  </ul>
                </div>

                {/* Contact Info */}
                <div className="pt-6 border-t border-white/10">
                  <p className="text-white/50 text-sm">
                    Have questions before booking?
                    <br />
                    <span className="text-gold">
                      All consultations are treated with complete discretion
                    </span>
                  </p>
                </div>
              </motion.div>

              {/* Right Column - Form */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.8,
                  ease: [0.16, 1, 0.3, 1],
                  delay: 0.2,
                }}
                className="border border-white/10 rounded-lg p-8 lg:p-10 bg-zinc-950/50"
              >
                <h3 className="text-2xl font-heading text-white mb-6">
                  Book Your Consultation
                </h3>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name Field */}
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-white/90">
                      Full Name *
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="bg-white/5 border-white/20 text-white placeholder:text-white/40 focus:border-gold focus:ring-gold/20 h-12"
                      placeholder="John Doe"
                    />
                  </div>

                  {/* Email Field */}
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-white/90">
                      Email Address *
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="bg-white/5 border-white/20 text-white placeholder:text-white/40 focus:border-gold focus:ring-gold/20 h-12"
                      placeholder="john@example.com"
                    />
                  </div>

                  {/* Phone Field */}
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-white/90">
                      Phone Number
                    </Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      className="bg-white/5 border-white/20 text-white placeholder:text-white/40 focus:border-gold focus:ring-gold/20 h-12"
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>

                  {/* Service Interest */}
                  <div className="space-y-2">
                    <Label htmlFor="service" className="text-white/90">
                      Service Interest *
                    </Label>
                    <select
                      id="service"
                      name="service"
                      required
                      value={formData.service}
                      onChange={handleChange}
                      className="w-full bg-white/5 border border-white/20 text-white focus:border-gold focus:ring-1 focus:ring-gold/20 rounded-md px-4 h-12 outline-none transition-colors"
                    >
                      <option value="" className="bg-zinc-900">
                        Select a service...
                      </option>
                      <option value="personal-styling" className="bg-zinc-900">
                        Personal Styling
                      </option>
                      <option
                        value="wardrobe-consultation"
                        className="bg-zinc-900"
                      >
                        Wardrobe Consultation
                      </option>
                      <option
                        value="shopping-assistance"
                        className="bg-zinc-900"
                      >
                        Personal Shopping
                      </option>
                      <option value="special-event" className="bg-zinc-900">
                        Special Event Styling
                      </option>
                      <option
                        value="full-transformation"
                        className="bg-zinc-900"
                      >
                        Complete Transformation
                      </option>
                      <option value="other" className="bg-zinc-900">
                        Other / Not Sure
                      </option>
                    </select>
                  </div>

                  {/* Message Field */}
                  <div className="space-y-2">
                    <Label htmlFor="message" className="text-white/90">
                      Tell Us About Your Goals *
                    </Label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      value={formData.message}
                      onChange={handleChange}
                      rows={5}
                      className="w-full bg-white/5 border border-white/20 text-white placeholder:text-white/40 focus:border-gold focus:ring-1 focus:ring-gold/20 rounded-md px-4 py-3 resize-none outline-none transition-colors"
                      placeholder="What are you looking to achieve with your style transformation? Any specific events or goals in mind?"
                    />
                  </div>

                  {/* Status Messages */}
                  {status === "success" && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-2 text-green-400 bg-green-400/10 border border-green-400/20 rounded-md p-4"
                    >
                      <CheckCircle className="w-5 h-5 flex-shrink-0" />
                      <p className="text-sm">
                        Thank you! We'll contact you within 24 hours to schedule
                        your consultation.
                      </p>
                    </motion.div>
                  )}

                  {status === "error" && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-2 text-red-400 bg-red-400/10 border border-red-400/20 rounded-md p-4"
                    >
                      <AlertCircle className="w-5 h-5 flex-shrink-0" />
                      <p className="text-sm">
                        {errorMessage ||
                          "Something went wrong. Please try again."}
                      </p>
                    </motion.div>
                  )}

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={status === "loading"}
                    className="w-full bg-gold-gradient text-black hover:shadow-gold h-14 text-base font-semibold group transition-all duration-300"
                  >
                    {status === "loading" ? (
                      "Sending..."
                    ) : (
                      <>
                        Book Consultation
                        <Send className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </Button>
                </form>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
