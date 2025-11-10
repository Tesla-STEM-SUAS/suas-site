"use client";

import React, { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";

/**
 * PageTransition
 * Shows a full-screen wipe animation whenever the pathname changes.
 * The drone remains centered on-screen while the wipe covers/reveals the page.
 */
export default function PageTransition(): React.ReactElement | null {
  const pathname = usePathname();
  const router = useRouter();
  const prev = useRef<string | null>(null);
  const animating = useRef(false);
  const [visible, setVisible] = useState(false);
  const [phase, setPhase] = useState<"idle" | "in" | "out">("idle");

  // animation timing (ms)
  const IN_DUR = 280;
  const HOLD_DUR = 0;
  const OUT_DUR = 380;
  const TOTAL = IN_DUR + HOLD_DUR + OUT_DUR;

  // initialize previous pathname once
  useEffect(() => {
    if (prev.current === null) prev.current = pathname;
  }, [pathname]);

  // intercept clicks on internal links and perform animated navigation
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      // only left click without modifier keys
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

      const target = e.target as HTMLElement | null;
      const anchor = target?.closest("a") as HTMLAnchorElement | null;
      if (!anchor) return;

      const hrefAttr = anchor.getAttribute("href");
      if (!hrefAttr) return;

      // ignore downloads, mailto, tel and external links
      if (anchor.hasAttribute("download") || hrefAttr.startsWith("mailto:") || hrefAttr.startsWith("tel:")) return;
      if (anchor.target && anchor.target !== "_self") return;

      // build absolute url and ensure same origin
      let url: URL;
      try {
        url = new URL(hrefAttr, window.location.href);
      } catch {
        return; // invalid URL
      }

      if (url.origin !== window.location.origin) return;

      // allow same-page hash navigations
      if (url.pathname === window.location.pathname && url.search === window.location.search) return;

      // intercept and animate
      e.preventDefault();
      const to = url.pathname + url.search + url.hash;
      navigateWithWipe(to).catch(() => {
        // swallow errors to avoid breaking click handlers
      });
    };

    window.addEventListener("click", onClick);
    return () => window.removeEventListener("click", onClick);
  }, []);

  // navigation flow: play 'in' (cover), then navigate, then 'out' (reveal)
  async function navigateWithWipe(href: string) {
    if (animating.current) return;
    animating.current = true;

    setVisible(true);
    setPhase("in");

    // wait for 'in' + hold
    await new Promise((res) => setTimeout(res, IN_DUR + HOLD_DUR));

    // perform client navigation
    try {
      await router.push(href);
    } catch (err) {
      // navigation failed; start reveal and bail
      setPhase("out");
      await new Promise((res) => setTimeout(res, OUT_DUR));
      setVisible(false);
      setPhase("idle");
      animating.current = false;
      throw err;
    }

    // reveal new page
    setPhase("out");
    await new Promise((res) => setTimeout(res, OUT_DUR));

    setVisible(false);
    setPhase("idle");
    animating.current = false;
    prev.current = pathname;
  }

  if (!visible) return null;

  return (
    // the wipe acts as a mask: the drone is placed inside it and will be cropped
    // by the wipe's bounds (overflow:hidden)
    <div
      aria-hidden
      className={`page-wipe ${phase === "in" ? "page-wipe--in" : "page-wipe--out"}`}
    >
      <motion.div
        className="drone rotate-12"
        // keep drone centered with a subtle float while visible
        animate={phase === "out" ? { opacity: 1 } : { y: [0, -8, 0] }}
        transition={phase === "out" ? { duration: 0.2 } : { duration: 1.8, repeat: Infinity }}
      >
        <img src="/drone.svg" alt="drone" />
      </motion.div>
    </div>
  );
}
