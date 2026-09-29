/* Démos d'interaction des aperçus (souris, clic). Portées de l'ancienne page ; elles agissent
   sur le HTML statique des aperçus, donc directement sur le DOM. Appelé une fois par étape montée. */

const rel = (el: HTMLElement, e: MouseEvent) => {
  const r = el.getBoundingClientRect();
  return { x: e.clientX - r.left, y: e.clientY - r.top, w: r.width, h: r.height };
};
const $ = <T extends HTMLElement>(el: ParentNode, sel: string): T | null => el.querySelector<T>(sel);

type Init = (el: HTMLElement) => void;

const INIT: Record<string, Init> = {
  magnetic(el) {
    const b = $(el, ".mag");
    if (!b) return;
    el.addEventListener("mousemove", (e) => {
      const r = b.getBoundingClientRect();
      b.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.35}px,${(e.clientY - r.top - r.height / 2) * 0.35}px)`;
    });
    el.addEventListener("mouseleave", () => (b.style.transform = ""));
  },
  cursor(el) {
    const d = el.firstElementChild as HTMLElement | null;
    const c = d && $(d, ".cur");
    if (!d || !c) return;
    d.addEventListener("mousemove", (e) => {
      const p = rel(d, e);
      c.style.transform = `translate(${p.x}px,${p.y}px) translate(-50%,-50%)`;
      c.classList.toggle("big", !!(e.target as HTMLElement).closest(".lk"));
    });
    d.addEventListener("mouseenter", () => d.classList.add("in"));
    d.addEventListener("mouseleave", () => d.classList.remove("in"));
  },
  tilt(el) {
    const c = $(el, ".tc");
    if (!c) return;
    el.addEventListener("mousemove", (e) => {
      const p = rel(el, e);
      c.style.transform = `perspective(500px) rotateY(${(p.x / p.w - 0.5) * 28}deg) rotateX(${-(p.y / p.h - 0.5) * 28}deg)`;
    });
    el.addEventListener("mouseleave", () => (c.style.transform = ""));
  },
  parallax(el) {
    const ls = el.querySelectorAll<HTMLElement>("[data-d]");
    el.addEventListener("mousemove", (e) => {
      const p = rel(el, e);
      const x = p.x / p.w - 0.5, y = p.y / p.h - 0.5;
      ls.forEach((l) => {
        const d = Number(l.dataset.d);
        l.style.transform = `translate(${x * d}px,${y * d}px)`;
      });
    });
    el.addEventListener("mouseleave", () => ls.forEach((l) => (l.style.transform = "")));
  },
  hoverimg(el) {
    const d = el.firstElementChild as HTMLElement | null;
    const f = d && $(d, ".fl");
    if (!d || !f) return;
    d.querySelectorAll<HTMLElement>("li").forEach((li) =>
      li.addEventListener("mouseenter", () => {
        f.style.background = li.dataset.c ?? "";
        f.classList.add("on");
      }),
    );
    d.addEventListener("mousemove", (e) => {
      const p = rel(d, e);
      f.style.transform = `translate(${p.x + 14}px,${p.y - 25}px) rotate(-4deg)`;
    });
    d.addEventListener("mouseleave", () => f.classList.remove("on"));
  },
  scramble(el) {
    const s = $(el, ".scr");
    if (!s) return;
    const fin = s.dataset.t ?? "";
    const ch = "ABCDEFGHIJKLMNOPQRSTUVWXYZ#%&*/<>0123456789";
    let iv: ReturnType<typeof setInterval> | undefined;
    el.addEventListener("mouseenter", () => {
      let i = 0;
      clearInterval(iv);
      iv = setInterval(() => {
        s.textContent = fin
          .split("")
          .map((c, j) => (j < i || c === " " ? c : ch[Math.floor(Math.random() * ch.length)]))
          .join("");
        i += 0.4;
        if (i >= fin.length) {
          clearInterval(iv);
          s.textContent = fin;
        }
      }, 35);
    });
  },
  pagetr(el) {
    const b = $(el, ".go"), cu = $(el, ".curtain"), pg = $(el, ".pg");
    if (!b || !cu || !pg) return;
    b.addEventListener("click", () => {
      cu.classList.remove("run");
      void cu.offsetWidth;
      cu.classList.add("run");
      setTimeout(() => (pg.textContent = pg.textContent === "Accueil" ? "Projets" : "Accueil"), 400);
    });
  },
  micro(el) {
    const b = $(el, ".mb");
    if (!b) return;
    b.addEventListener("click", () => {
      if (b.dataset.s) return;
      b.dataset.s = "1";
      b.textContent = "";
      b.classList.add("load");
      setTimeout(() => {
        b.classList.remove("load");
        b.classList.add("ok");
        b.textContent = "Envoyé ✓";
        setTimeout(() => {
          b.classList.remove("ok");
          b.textContent = "Envoyer";
          delete b.dataset.s;
        }, 1600);
      }, 1000);
    });
  },
};

export function attachDemos(container: HTMLElement): void {
  container.querySelectorAll<HTMLElement>("[data-demo]").forEach((el) => INIT[el.dataset.demo ?? ""]?.(el));
  container.querySelectorAll<HTMLElement>("[data-replay]").forEach((d) =>
    d.addEventListener("mouseenter", () => {
      d.classList.remove("in");
      void d.offsetWidth;
      d.classList.add("in");
    }),
  );
}
