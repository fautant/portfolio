"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const followerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    const follower = followerRef.current;
    if (!cursor || !follower) return;

    // Only show on desktop
    const mm = gsap.matchMedia();

    mm.add("(min-width: 1024px) and (pointer: fine)", () => {
      cursor.style.display = "block";
      follower.style.display = "block";

      const xTo = gsap.quickTo(cursor, "x", { duration: 0.15, ease: "power2.out" });
      const yTo = gsap.quickTo(cursor, "y", { duration: 0.15, ease: "power2.out" });
      const fxTo = gsap.quickTo(follower, "x", { duration: 0.5, ease: "power2.out" });
      const fyTo = gsap.quickTo(follower, "y", { duration: 0.5, ease: "power2.out" });

      const onMove = (e: MouseEvent) => {
        xTo(e.clientX);
        yTo(e.clientY);
        fxTo(e.clientX);
        fyTo(e.clientY);
      };

      const onEnterInteractive = () => {
        gsap.to(cursor, { scale: 0.5, duration: 0.3 });
        gsap.to(follower, { scale: 1.8, duration: 0.3, opacity: 0.5 });
      };

      const onLeaveInteractive = () => {
        gsap.to(cursor, { scale: 1, duration: 0.3 });
        gsap.to(follower, { scale: 1, duration: 0.3, opacity: 0.3 });
      };

      window.addEventListener("mousemove", onMove);

      const interactiveEls = document.querySelectorAll("a, button, [data-cursor-hover]");
      interactiveEls.forEach((el) => {
        el.addEventListener("mouseenter", onEnterInteractive);
        el.addEventListener("mouseleave", onLeaveInteractive);
      });

      // Observer for dynamically added elements
      const observer = new MutationObserver(() => {
        const newEls = document.querySelectorAll("a, button, [data-cursor-hover]");
        newEls.forEach((el) => {
          el.addEventListener("mouseenter", onEnterInteractive);
          el.addEventListener("mouseleave", onLeaveInteractive);
        });
      });

      observer.observe(document.body, { childList: true, subtree: true });

      return () => {
        window.removeEventListener("mousemove", onMove);
        observer.disconnect();
        cursor.style.display = "none";
        follower.style.display = "none";
      };
    });

    return () => mm.revert();
  }, []);

  return (
    <>
      <div
        ref={cursorRef}
        className="pointer-events-none fixed top-0 left-0 z-[9999] hidden -translate-x-1/2 -translate-y-1/2"
        style={{ willChange: "transform" }}
      >
        <div className="h-3 w-3 rounded-full bg-primary" />
      </div>
      <div
        ref={followerRef}
        className="pointer-events-none fixed top-0 left-0 z-[9998] hidden -translate-x-1/2 -translate-y-1/2"
        style={{ willChange: "transform", opacity: 0.3 }}
      >
        <div className="h-8 w-8 rounded-full border-2 border-primary" />
      </div>
    </>
  );
}
