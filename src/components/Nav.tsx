"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type NavLink = { label: string; href: string };

const links: NavLink[] = [
  { label: "Capabilities", href: "/#capabilities" },
  { label: "Research", href: "/research" },
  { label: "Team", href: "/team" },
  { label: "Future", href: "/future" },
  { label: "Careers", href: "/careers" },
];

function isActive(pathname: string, href: string) {
  if (href.startsWith("/#")) return false;
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(href + "/");
}

export default function Nav({ careersStatus }: { careersStatus?: string }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 border-b transition-all duration-500 ${
        scrolled
          ? "backdrop-blur-md bg-cream-100/70 border-black/5"
          : "bg-transparent border-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-4 md:px-10">
        <Link href="/" className="flex items-center gap-2.5">
          <Image
            src="/logo.png"
            alt="IndiskaAI"
            width={36}
            height={36}
            priority
            className="h-9 w-9 object-contain"
          />
          <span className="font-display text-[1.05rem] font-medium tracking-tightest text-ink">
            IndiskaAI
          </span>
        </Link>

        <ul className="hidden items-center gap-9 lg:flex">
          {links.map((l) => {
            const active = isActive(pathname, l.href);
            const showBadge = l.label === "Careers" && !!careersStatus;
            return (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className={`group relative inline-flex items-center gap-2 text-[0.92rem] transition-colors ${
                    active ? "text-ink" : "text-ink-soft hover:text-ink"
                  }`}
                >
                  {l.label}
                  {showBadge && (
                    <span className="text-[0.62rem] tracking-[0.12em] uppercase rounded-full bg-gold/90 text-ink px-2 py-0.5 leading-none font-medium">
                      {careersStatus}
                    </span>
                  )}
                  <span
                    className={`absolute -bottom-1 left-0 h-px bg-ink transition-all duration-300 ${
                      active ? "w-full" : "w-0 group-hover:w-full"
                    }`}
                  />
                </Link>
              </li>
            );
          })}
        </ul>

        <Link
          href="/partner"
          className="hidden lg:inline-flex cta cta-ghost text-sm"
        >
          Get in touch
          <span className="cta-arrow">→</span>
        </Link>

        <button
          onClick={() => setOpen((v) => !v)}
          className="lg:hidden flex h-10 w-10 items-center justify-center rounded-full border border-black/10"
          aria-label="Menu"
        >
          <span className="relative block h-3 w-5">
            <span
              className={`absolute left-0 top-0 h-px w-5 bg-ink transition-transform ${
                open ? "translate-y-[6px] rotate-45" : ""
              }`}
            />
            <span
              className={`absolute left-0 bottom-0 h-px w-5 bg-ink transition-transform ${
                open ? "-translate-y-[6px] -rotate-45" : ""
              }`}
            />
          </span>
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lg:hidden border-t border-black/5 bg-cream-100/95 backdrop-blur-md origin-top"
          >
            <motion.ul 
              className="px-6 py-6 flex flex-col gap-4"
              initial="closed"
              animate="open"
              exit="closed"
              variants={{
                open: {
                  transition: { staggerChildren: 0.05, delayChildren: 0.1 }
                },
                closed: {
                  transition: { staggerChildren: 0.05, staggerDirection: -1 }
                }
              }}
            >
              {links.map((l) => {
                const showBadge = l.label === "Careers" && !!careersStatus;
                return (
                  <motion.li 
                    key={l.href}
                    variants={{
                      open: { opacity: 1, y: 0, transition: { ease: [0.16, 1, 0.3, 1], duration: 0.5 } },
                      closed: { opacity: 0, y: -10, transition: { ease: [0.16, 1, 0.3, 1], duration: 0.3 } }
                    }}
                  >
                    <Link
                      href={l.href}
                      className="text-lg font-display inline-flex items-center gap-3"
                      onClick={() => setOpen(false)}
                    >
                      {l.label}
                      {showBadge && (
                        <span className="text-[0.62rem] tracking-[0.12em] uppercase rounded-full bg-gold/90 text-ink px-2 py-0.5 leading-none font-medium">
                          {careersStatus}
                        </span>
                      )}
                    </Link>
                  </motion.li>
                );
              })}
              <motion.li 
                className="pt-3"
                variants={{
                  open: { opacity: 1, y: 0, transition: { ease: [0.16, 1, 0.3, 1], duration: 0.5 } },
                  closed: { opacity: 0, y: -10, transition: { ease: [0.16, 1, 0.3, 1], duration: 0.3 } }
                }}
              >
                <Link href="/partner" className="cta cta-ghost w-full justify-center text-sm" onClick={() => setOpen(false)}>
                  Get in touch
                </Link>
              </motion.li>
            </motion.ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
