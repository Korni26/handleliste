"use client";

import { useEffect } from "react";

export function PwaRegister() {
  useEffect(() => {
    // Service workers require HTTPS (or localhost); avoid registering in development.
    if (process.env.NODE_ENV !== "production" || !("serviceWorker" in navigator)) {
      return;
    }

    const register = () => {
      void navigator.serviceWorker.register("/sw.js").catch((error: unknown) => {
        console.warn("Kunne ikke registrere PWA:", error);
      });
    };

    if (document.readyState === "complete") {
      register();
    } else {
      window.addEventListener("load", register);
      return () => window.removeEventListener("load", register);
    }
  }, []);

  return null;
}
