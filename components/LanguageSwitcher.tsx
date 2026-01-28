"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import { locales, localeFlags, type Locale } from "@/i18n/config";
import { cn } from "@/lib/utils";

interface LanguageSwitcherProps {
  className?: string;
}

export function LanguageSwitcher({ className }: LanguageSwitcherProps) {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();

  const switchLocale = (newLocale: Locale) => {
    const segments = pathname.split("/");

    if (locales.includes(segments[1] as Locale)) {
      segments[1] = newLocale;
    } else {
      segments.splice(1, 0, newLocale);
    }

    router.push(segments.join("/") || "/");
  };

  return (
    <div className={cn("flex items-center gap-1", className)}>
      {locales.map((loc) => (
        <button
          key={loc}
          onClick={() => switchLocale(loc)}
          className={cn(
            "px-2 py-1 rounded-lg text-sm font-medium transition-all",
            locale === loc
              ? "bg-primary/20 text-primary"
              : "text-text-muted dark:text-text-muted-light hover:bg-primary/10"
          )}
          aria-label={`Switch to ${loc}`}
        >
          {localeFlags[loc]} {loc.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
