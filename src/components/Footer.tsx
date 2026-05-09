"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function Footer() {
  return (
    <footer
      id="contact"
      className="relative overflow-hidden bg-ink text-cream-100 mt-12"
    >
      {/* Decorative gradient blob */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 -right-40 h-[28rem] w-[28rem] rounded-full opacity-20 blur-3xl"
        style={{ background: "radial-gradient(closest-side, #F4C430, transparent 70%)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-40 -left-40 h-[28rem] w-[28rem] rounded-full opacity-25 blur-3xl"
        style={{ background: "radial-gradient(closest-side, #1E5BA8, transparent 70%)" }}
      />

      <div className="relative mx-auto max-w-[1400px] px-6 md:px-10 py-24 md:py-32">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-[20ch]"
        >
          <div className="kicker text-cream-300 mb-5">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-gold mr-2 align-middle" />
            Get in touch
          </div>
          <h2 className="font-display text-[clamp(2.4rem,6vw,5.4rem)] leading-[0.96] tracking-tightest">
            Let&apos;s build the next molecule{" "}
            <span className="italic text-gold">together.</span>
          </h2>
        </motion.div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-6">
          <div className="md:col-span-5">
            <div className="kicker text-cream-300 mb-3">Email</div>
            <a
              href="mailto:hello@indiskaai.com"
              className="font-display text-2xl md:text-4xl tracking-tightest hover:text-gold transition-colors"
            >
              hello@indiskaai.com
            </a>
          </div>

          <div className="md:col-span-3">
            <div className="kicker text-cream-300 mb-3">Office</div>
            <p className="text-cream-100/85 leading-[1.6]">
              Pune,
              <br />
              Maharashtra, India
            </p>
          </div>

          <div className="md:col-span-4">
            <div className="kicker text-cream-300 mb-3">Connect</div>
            <ul className="space-y-2 text-cream-100/85">
              <li>
                <a
                  href="#"
                  className="hover:text-gold transition-colors inline-flex items-center gap-2"
                >
                  LinkedIn <span aria-hidden>→</span>
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-gold transition-colors inline-flex items-center gap-2"
                >
                  X / Twitter <span aria-hidden>→</span>
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-gold transition-colors inline-flex items-center gap-2"
                >
                  Careers <span aria-hidden>→</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-24 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-t border-cream-100/10 pt-8 text-sm text-cream-100/55">
          <div className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="IndiskaAI"
              width={28}
              height={28}
              className="h-7 w-7 object-contain"
            />
            <span>&copy; {new Date().getFullYear()} IndiskaAI. All rights reserved.</span>
          </div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-cream-100">Privacy</a>
            <a href="#" className="hover:text-cream-100">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
