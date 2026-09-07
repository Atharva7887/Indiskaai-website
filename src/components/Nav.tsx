"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CORE_SERVICES, ENGAGEMENT_MODELS } from "@/lib/services-data";
import { PLATFORM } from "@/lib/platform-data";

type NavLink = {
  label: string;
  href: string;
  children?: { label: string; href: string }[];
  /** Rendered after a divider, below `children`, under `secondaryGroupLabel`. */
  secondaryChildren?: { label: string; href: string }[];
  secondaryGroupLabel?: string;
  /** Bottom "view all" link text in the dropdown. Defaults to `label`. */
  viewAllLabel?: string;
};

const links: NavLink[] = [
  {
    label: "Services",
    href: "/services",
    children: CORE_SERVICES.map((s) => ({ label: s.title, href: `/services/${s.slug}` })),
    secondaryChildren: ENGAGEMENT_MODELS.map((s) => ({ label: s.title, href: `/services/${s.slug}` })),
    secondaryGroupLabel: "Engagement model",
    viewAllLabel: "See all services",
  },
  {
    label: "Platform",
    href: "/platform",
    children: PLATFORM.map((p) => ({ label: p.title, href: `/platform/${p.slug}` })),
    viewAllLabel: "See all of platform",
  },
  {
    label: "About Us",
    href: "/#about",
    children: [
      { label: "Team", href: "/team" },
      { label: "Future", href: "/future" },
    ],
    viewAllLabel: "About IndiskaAI",
  },
  { label: "Research", href: "/research" },
  { label: "Careers", href: "/careers" },
];

function isActive(pathname: string, href: string) {
  if (href.startsWith("/#")) return false;
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(href + "/");
}

/** A parent nav item reads as active if the current page is one of its children too (e.g. /team under About Us). */
function isActiveGroup(pathname: string, link: NavLink) {
  if (isActive(pathname, link.href)) return true;
  const all = [...(link.children ?? []), ...(link.secondaryChildren ?? [])];
  return all.some((c) => isActive(pathname, c.href));
}

export default function Nav({ careersStatus }: { careersStatus?: string }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [openMobileSection, setOpenMobileSection] = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setOpen(false);
    setOpenMobileSection(null);
  }, [pathname]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 border-b transition-colors duration-500 ${
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
            const active = isActiveGroup(pathname, l);
            const showBadge = l.label === "Careers" && !!careersStatus;
            const hasChildren = !!l.children?.length;

            return (
              <li
                key={l.href}
                className="relative"
                onMouseEnter={() => hasChildren && setOpenDropdown(l.label)}
                onMouseLeave={() => hasChildren && setOpenDropdown(null)}
              >
                <Link
                  href={l.href}
                  className={`group relative inline-flex items-center gap-1.5 text-[0.92rem] transition-colors ${
                    active ? "text-ink" : "text-ink-soft hover:text-ink"
                  }`}
                >
                  {l.label}
                  {showBadge && (
                    <span className="text-[0.62rem] tracking-[0.12em] uppercase rounded-full bg-gold/90 text-ink px-2 py-0.5 leading-none font-medium">
                      {careersStatus}
                    </span>
                  )}
                  {hasChildren && (
                    <svg
                      width="9"
                      height="9"
                      viewBox="0 0 10 10"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className={`transition-transform duration-300 ${
                        openDropdown === l.label ? "rotate-180" : ""
                      }`}
                      aria-hidden
                    >
                      <path d="M2 3.5 L5 6.5 L8 3.5" />
                    </svg>
                  )}
                  <span
                    className={`absolute -bottom-1 left-0 h-px w-full origin-left bg-ink transition-transform duration-300 ${
                      active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                    }`}
                  />
                </Link>

                {hasChildren && (
                  <AnimatePresence>
                    {openDropdown === l.label && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                        className="absolute left-0 top-full pt-3"
                      >
                        <div className="w-64 rounded-2xl border border-black/5 bg-cream-50 p-2 shadow-[0_24px_60px_-30px_rgba(26,26,26,0.35)]">
                          {l.children!.map((c) => (
                            <Link
                              key={c.href}
                              href={c.href}
                              className="block rounded-xl px-4 py-2.5 text-[0.88rem] text-ink-soft transition-colors hover:bg-cream-200/70 hover:text-ink"
                            >
                              {c.label}
                            </Link>
                          ))}

                          {!!l.secondaryChildren?.length && (
                            <div className="mt-1 border-t border-black/5 pt-1">
                              <div className="px-4 pt-1.5 pb-1 text-[0.68rem] tracking-[0.1em] uppercase text-ink-muted">
                                {l.secondaryGroupLabel}
                              </div>
                              {l.secondaryChildren.map((c) => (
                                <Link
                                  key={c.href}
                                  href={c.href}
                                  className="block rounded-xl px-4 py-2.5 text-[0.88rem] text-ink-soft transition-colors hover:bg-cream-200/70 hover:text-ink"
                                >
                                  {c.label}
                                </Link>
                              ))}
                            </div>
                          )}

                          <div className="mt-1 border-t border-black/5 pt-1">
                            <Link
                              href={l.href}
                              className="block rounded-xl px-4 py-2.5 text-[0.82rem] text-navy transition-colors hover:bg-cream-200/70"
                            >
                              {l.viewAllLabel ?? l.label} →
                            </Link>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </li>
            );
          })}
        </ul>

        <Link
          href="/partner"
          className="hidden lg:inline-flex cta cta-ghost text-sm"
        >
          Partner with us
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
            className="lg:hidden border-t border-black/5 bg-cream-100/95 backdrop-blur-md origin-top max-h-[calc(100svh-4.5rem)] overflow-y-auto"
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
                const hasChildren = !!l.children?.length;
                const sectionOpen = openMobileSection === l.label;

                return (
                  <motion.li
                    key={l.href}
                    variants={{
                      open: { opacity: 1, y: 0, transition: { ease: [0.16, 1, 0.3, 1], duration: 0.5 } },
                      closed: { opacity: 0, y: -10, transition: { ease: [0.16, 1, 0.3, 1], duration: 0.3 } }
                    }}
                  >
                    <div className="flex items-center justify-between gap-3">
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
                      {hasChildren && (
                        <button
                          onClick={() =>
                            setOpenMobileSection(sectionOpen ? null : l.label)
                          }
                          aria-label={`Toggle ${l.label} submenu`}
                          className="flex h-8 w-8 items-center justify-center rounded-full border border-black/10 text-ink-muted"
                        >
                          <svg
                            width="11"
                            height="11"
                            viewBox="0 0 10 10"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.4"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className={`transition-transform duration-300 ${
                              sectionOpen ? "rotate-180" : ""
                            }`}
                          >
                            <path d="M2 3.5 L5 6.5 L8 3.5" />
                          </svg>
                        </button>
                      )}
                    </div>

                    {hasChildren && (
                      <AnimatePresence initial={false}>
                        {sectionOpen && (
                          <motion.ul
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                            className="overflow-hidden pl-4 mt-2 flex flex-col gap-3 border-l border-black/10"
                          >
                            {l.children!.map((c) => (
                              <li key={c.href}>
                                <Link
                                  href={c.href}
                                  className="text-[0.95rem] text-ink-soft"
                                  onClick={() => setOpen(false)}
                                >
                                  {c.label}
                                </Link>
                              </li>
                            ))}
                            {!!l.secondaryChildren?.length && (
                              <>
                                <li className="text-[0.68rem] tracking-[0.1em] uppercase text-ink-muted pt-1">
                                  {l.secondaryGroupLabel}
                                </li>
                                {l.secondaryChildren.map((c) => (
                                  <li key={c.href}>
                                    <Link
                                      href={c.href}
                                      className="text-[0.95rem] text-ink-soft"
                                      onClick={() => setOpen(false)}
                                    >
                                      {c.label}
                                    </Link>
                                  </li>
                                ))}
                              </>
                            )}
                          </motion.ul>
                        )}
                      </AnimatePresence>
                    )}
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
                  Partner with us
                </Link>
              </motion.li>
            </motion.ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
