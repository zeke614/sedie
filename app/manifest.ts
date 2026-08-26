import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Currency Converter | exchango",
    short_name: "exchango",
    description:
      "Convert currencies with real-time rates and a clean, mobile-first interface.",
    start_url: "/",
    display: "standalone",
    background_color: "#fcfcfc",
    theme_color: "#256F5C",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
      {
        src: "/icons/icon-maskable.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
