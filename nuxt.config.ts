// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  modules: [
    "@nuxtjs/tailwindcss",
    "@pinia/nuxt",
    "nuxt-lucide-icons",
    "nuxt-gtag",
  ],
  vite: {
    worker: {
      format: "es",
    },
    optimizeDeps: {
      include: ["pako", "file-saver"],
    },
  },
  nitro: {
    experimental: {
      wasm: true,
    },
  },
  app: {
    head: {
      title: "Font Converter - Convert TTF OTF to WOFF WOFF2 Fonts Online",
      meta: [
        {
          name: "description",
          content:
            "Free online font converter tool. Convert TT, OTF to WOFF, WOFF2, and vice versa. Fast, secure, and easy to use font format conversion for web developers and designers.",
        },
        {
          name: "keywords",
          content:
            "font converter, TTF to WOFF, WOFF2 converter, font format, web fonts, typography, font optimization, online tool",
        },
        { name: "author", content: "Font Converter" },
        { name: "robots", content: "index, follow" },
        { name: "apple-mobile-web-app-title", content: "Font Converter" },

        // Open Graph / Facebook
        { property: "og:type", content: "website" },
        {
          property: "og:title",
          content: "Font Converter - Convert TT, OTF to WOFF, WOFF2 Fonts Online",
        },
        {
          property: "og:description",
          content:
            "Free online font converter tool. Convert TT, OTF to WOFF, WOFF2, and vice versa. Fast, secure, and easy to use.",
        },
        { property: "og:site_name", content: "Font Converter" },

        // Twitter
        { name: "twitter:card", content: "summary_large_image" },
        {
          name: "twitter:title",
          content: "Font Converter - Convert TTF, WOFF, WOFF2 Fonts Online",
        },
        {
          name: "twitter:description",
          content:
            "Free online font converter tool. Convert TTF to WOFF, WOFF2, and vice versa. Fast, secure, and easy to use.",
        },
      ],
      link: [
        {
          rel: "icon",
          type: "image/png",
          sizes: "96x96",
          href: "/favicon/favicon-96x96.png",
        },
        { rel: "icon", type: "image/svg+xml", href: "/favicon/favicon.svg" },
        { rel: "shortcut icon", href: "/favicon/favicon.ico" },
        {
          rel: "apple-touch-icon",
          sizes: "180x180",
          href: "/favicon/apple-touch-icon.png",
        },
        { rel: "manifest", href: "/favicon/site.webmanifest" },
        { rel: "canonical", href: "https://your-domain.com" }, // замените на ваш домен
      ],
      script: [
        {
          type: "application/ld+json",
          innerHTML: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "Font Converter",
            description:
              "Free online font converter tool. Convert TTF to WOFF, WOFF2, and vice versa.",
            url: "https://your-domain.com", // замените на ваш домен
            applicationCategory: "UtilitiesApplication",
            operatingSystem: "Any",
            offers: {
              "@type": "Offer",
              price: "0",
              priceCurrency: "USD",
            },
            featureList: [
              "Convert TTF to WOFF",
              "Convert TTF to WOFF2",
              "Convert WOFF to TTF",
              "Convert WOFF2 to TTF",
              "Batch font conversion",
              "Download as ZIP archive",
            ],
          }),
        },
      ],
    },
  },
  gtag: {
    tags: [{ id: "GTM-P6KD4G3M" }, { id: "G-DD2NBRKZWK" }],
  },
});
