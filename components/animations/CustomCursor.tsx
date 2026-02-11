"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const followerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    const follower = followerRef.current;
    const textEl = textRef.current;
    if (!cursor || !follower || !textEl) return;

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
        textEl.textContent = "";
        gsap.to(textEl, { opacity: 0, duration: 0.2 });
      };

      const onEnterCursorText = (e: Event) => {
        const el = e.currentTarget as HTMLElement;
        const text = el.getAttribute("data-cursor-text");
        if (text && textEl) {
          textEl.textContent = text;
          gsap.to(cursor, { scale: 0, duration: 0.2 });
          gsap.to(follower, { scale: 2.5, duration: 0.3, opacity: 0.9 });
          gsap.to(textEl, { opacity: 1, duration: 0.2 });
        }
      };

      const onLeaveCursorText = () => {
        gsap.to(cursor, { scale: 1, duration: 0.3 });
        gsap.to(follower, { scale: 1, duration: 0.3, opacity: 0.3 });
        gsap.to(textEl, { opacity: 0, duration: 0.2 });
      };

      window.addEventListener("mousemove", onMove);

      const bindListeners = () => {
        const interactiveEls = document.querySelectorAll("a, button, [data-cursor-hover]");
        interactiveEls.forEach((el) => {
          el.addEventListener("mouseenter", onEnterInteractive);
          el.addEventListener("mouseleave", onLeaveInteractive);
        });

        const cursorTextEls = document.querySelectorAll("[data-cursor-text]");
        cursorTextEls.forEach((el) => {
          el.addEventListener("mouseenter", onEnterCursorText);
          el.addEventListener("mouseleave", onLeaveCursorText);
        });
      };

      bindListeners();

      // Observer for dynamically added elements
      const observer = new MutationObserver(bindListeners);
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
        <div className="relative h-8 w-8 rounded-full border-2 border-primary flex items-center justify-center">
          <span
            ref={textRef}
            className="absolute text-[10px] font-bold text-primary whitespace-nowrap opacity-0"
          >
          </span>
        </div>
      </div>
    </>
  );
}
