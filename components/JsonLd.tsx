export function JsonLd() {
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Félix AUTANT",
    jobTitle: "Développeur Web Fullstack",
    url: "https://felixautant.dev",
    email: "autantfelix@gmail.com",
    telephone: "+33602279283",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Anglet",
      postalCode: "64600",
      addressCountry: "FR",
    },
    sameAs: [
      "https://github.com/felixautant",
      "https://linkedin.com/in/felixautant",
    ],
    knowsAbout: [
      "Symfony",
      "Laravel",
      "Next.js",
      "React",
      "TypeScript",
      "PHP",
      "Docker",
    ],
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Portfolio Félix AUTANT",
    url: "https://felixautant.dev",
    author: {
      "@type": "Person",
      name: "Félix AUTANT",
    },
    description:
      "Portfolio de Félix AUTANT, développeur web fullstack spécialisé en Symfony et Laravel.",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
    </>
  );
}
