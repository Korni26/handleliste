import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "Handleliste",
    short_name: "Handleliste",
    description: "En enkel handleliste som holder oversikt over det du trenger.",
    lang: "nb",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#F6F8F5",
    theme_color: "#2F7A57",
    icons: [
      { src: "/icon1", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icon", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
