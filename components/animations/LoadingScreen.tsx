"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { useTranslations } from "next-intl";

const SESSION_KEY = "portfolio-loaded";

export function LoadingScreen() {
  const t = useTranslations("loading");
  // Start visible — prevents flash of content underneath
  const [visible, setVisible] = useState(true);

  const overlayRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const nameRef = useRef<HTMLDivElement>(null);
  const messageRef = useRef<HTMLDivElement>(null);
  const topHalfRef = useRef<HTMLDivElement>(null);
  const bottomHalfRef = useRef<HTMLDivElement>(null);

  // On mount: decide whether to skip or animate
  useEffect(() => {
    // Already loaded this session — remove overlay immediately
    try {
      if (sessionStorage.getItem(SESSION_KEY) === "true") {
        setVisible(false);
        window.dispatchEvent(new Event("loading-complete"));
        return;
      }
    } catch {
      setVisible(false);
      window.dispatchEvent(new Event("loading-complete"));
      return;
    }

    // Prefers reduced motion — skip
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      try { sessionStorage.setItem(SESSION_KEY, "true"); } catch { /* ignore */ }
      setVisible(false);
      window.dispatchEvent(new Event("loading-complete"));
      return;
    }

    // --- Run the animation ---
    document.body.style.overflow = "hidden";

    const counter = counterRef.current;
    const name = nameRef.current;
    const message = messageRef.current;
    const topHalf = topHalfRef.current;
    const bottomHalf = bottomHalfRef.current;
    if (!counter || !name || !message || !topHalf || !bottomHalf) return;

    const heroNameEl = document.querySelector<HTMLElement>("[data-hero-name]");

    const obj = { val: 0 };

    const tl = gsap.timeline();

    // Make counter visible (hidden by default to avoid flash on reload)
    tl.set(counter, { opacity: 1 });

    // Phase 1: Counter 0 → 100%
    tl.to(obj, {
      val: 100,
      duration: 1.4,
      ease: "power2.inOut",
      onUpdate: () => {
        counter.textContent = `${Math.round(obj.val)}%`;
      },
    });

    // Pause after counter
    tl.to({}, { duration: 0.4 });

    // Fade out counter first
    tl.to(counter, { opacity: 0, duration: 0.4, ease: "power2.in" });

    // Phase 2: Name slides up into center (counter is already gone)
    tl.fromTo(
      name,
      { opacity: 0, y: 50, scale: 0.9 },
      { opacity: 1, y: 0, scale: 1, duration: 1.0, ease: "back.out(1.2)" }
    );

    // Phase 3: Welcome message slides up into center
    tl.fromTo(
      message,
      { opacity: 0, y: 40, scale: 0.95 },
      { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: "back.out(1.4)" },
      "-=0.2"
    );

    // Pause to let the message breathe
    tl.to({}, { duration: 0.8 });

    // Phase 4: Fade out message + counter, then fly name to hero position + split exit
    tl.to(message, { opacity: 0, duration: 0.3, ease: "power2.in" });

    // Tell hero to hide its elements before the split reveals content
    tl.add(() => {
      try { sessionStorage.setItem(SESSION_KEY, "true"); } catch { /* ignore */ }
      window.dispatchEvent(new Event("loading-prepare"));
    });

    if (heroNameEl) {
      // Capture both rects at animation time (fonts loaded, layout settled)
      // then build a mini-timeline for the fly + split
      tl.add(() => {
        const startRect = name.getBoundingClientRect();
        const targetRect = heroNameEl.getBoundingClientRect();

        // Lock name at its current screen position
        gsap.set(name, {
          position: "fixed",
          top: startRect.top,
          left: startRect.left,
          width: startRect.width,
          margin: 0,
          x: 0, y: 0, scale: 1,
        });

        // Fly name to hero position + split exit simultaneously
        const flyTl = gsap.timeline({
          onComplete: () => {
            // Show hero name first, then instantly hide loading name — seamless swap
            window.dispatchEvent(new Event("loading-complete"));
            gsap.set(name, { opacity: 0 });
            document.body.style.overflow = "";
            setVisible(false);
          },
        });

        flyTl.to(name, {
          top: targetRect.top,
          left: targetRect.left,
          width: targetRect.width,
          duration: 0.9,
          ease: "power3.inOut",
        });
        flyTl.to(topHalf, {
          yPercent: -100, duration: 0.8, ease: "power3.inOut",
        }, "<");
        flyTl.to(bottomHalf, {
          yPercent: 100, duration: 0.8, ease: "power3.inOut",
        }, "<");
      });

      // The rest is handled by flyTl — skip the main timeline's onComplete
      return () => {
        tl.kill();
        document.body.style.overflow = "";
      };
    } else {
      // Fallback: no hero name found, simple split exit
      tl.to(topHalf, {
        yPercent: -100, duration: 0.8, ease: "power3.inOut",
      });
      tl.to(bottomHalf, {
        yPercent: 100, duration: 0.8, ease: "power3.inOut",
      }, "<");
      tl.add(() => {
        window.dispatchEvent(new Event("loading-complete"));
        document.body.style.overflow = "";
        setVisible(false);
      });
    }

    return () => {
      tl.kill();
      document.body.style.overflow = "";
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[60] pointer-events-auto"
      aria-hidden="true"
    >
      {/* Top half */}
      <div
        ref={topHalfRef}
        className="absolute top-0 left-0 right-0 h-1/2 bg-background-light dark:bg-background-dark"
      />
      {/* Bottom half */}
      <div
        ref={bottomHalfRef}
        className="absolute bottom-0 left-0 right-0 h-1/2 bg-background-light dark:bg-background-dark"
      />

      {/* Counter — absolute so it doesn't affect flex layout of name/message */}
      <span
        ref={counterRef}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 font-display text-7xl sm:text-8xl font-bold bg-gradient-full bg-clip-text text-transparent select-none pointer-events-none"
        style={{ opacity: 0 }}
      >
        0%
      </span>

      {/* Name + message — centered together via flex */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none">
        <div
          ref={nameRef}
          className="text-hero font-display font-bold text-text-dark dark:text-text-light z-20 whitespace-nowrap"
          style={{ opacity: 0 }}
        >
          F&eacute;lix{" "}
          <span className="bg-gradient-full bg-clip-text text-transparent">
            AUTANT
          </span>
        </div>

        <div
          ref={messageRef}
          className="mt-4 text-lg sm:text-xl text-text-muted dark:text-text-muted-light font-medium"
          style={{ opacity: 0 }}
        >
          {t("welcome")}
        </div>
      </div>
    </div>
  );
}
