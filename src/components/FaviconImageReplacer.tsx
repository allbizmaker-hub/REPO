"use client";

import { useEffect } from "react";

const FAVICON_PATH = "/favicon.ico";

/** Replaces rendered image content with the app favicon when enabled globally. */
export function FaviconImageReplacer() {
  useEffect(() => {
    const replaceImages = (root: ParentNode = document) => {
      root.querySelectorAll("img").forEach((image) => {
        if (image.getAttribute("src") !== FAVICON_PATH) {
          image.setAttribute("src", FAVICON_PATH);
        }
        image.removeAttribute("srcset");
      });
    };

    replaceImages();
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const element = node as Element;
            if (element.matches("img")) replaceImages(element.parentNode || document);
            else replaceImages(element);
          }
        });
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);

  return null;
}
