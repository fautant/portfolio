// Le Lexique utilise ses propres polices (aperçus de typographies) et une mise en page pleine largeur.
const FONTS =
  "https://fonts.googleapis.com/css2?family=Archivo+Black&family=Bebas+Neue&family=Caveat:wght@500;700&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,700&family=Fraunces:opsz,wght@9..144,400;9..144,700;9..144,900&family=Instrument+Serif:ital@0;1&family=Inter:wght@400;600;800&family=JetBrains+Mono:wght@400;700&family=Playfair+Display:ital,wght@0,700;1,400;1,700&family=Space+Grotesk:wght@400;700&family=Syne:wght@700;800&display=swap";

export default function PleinLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="stylesheet" href={FONTS} precedence="default" />
      {children}
    </>
  );
}
