export function getAbsoluteUrl(path: string): string {
  if (typeof window === "undefined") return path;

  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  // Normalize path to prevent double prefixes.
  let finalPath = path;
  if (finalPath.startsWith("/chat/chat")) finalPath = finalPath.replace("/chat/chat", "/chat");
  if (finalPath.startsWith("/map/map")) finalPath = finalPath.replace("/map/map", "/map");
  if (finalPath.startsWith("/xakcode/xakcode")) finalPath = finalPath.replace("/xakcode/xakcode", "/xakcode");

  return finalPath;
}

// These routes are deliberately hosted on separate subdomains by middleware.
// Next's client router cannot render a route that is redirected to another
// origin, so use a real navigation for them instead of changing only the URL.
const CROSS_ORIGIN_ROUTES = [
  "/xakcode",
  "/chat",
  "/map",
  "/weather",
  "/dev-centre",
  "/drive",
  "/meet",
  "/profile",
  "/microdimension",
  "/everyworld",
  "/labs",
  "/suite",
  "/notes",
  "/about",
  "/classroom",
];

function isCrossOriginRoute(pathname: string): boolean {
  return CROSS_ORIGIN_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );
}

export function navigateTo(path: string, router: any, replace = false) {
  if (typeof window === "undefined") return;

  const targetUrl = getAbsoluteUrl(path);

  try {
    const targetObj = new URL(targetUrl, window.location.href);
    const currentObj = new URL(window.location.href);
    const relativePath = targetObj.pathname + targetObj.search + targetObj.hash;

    // Middleware sends these paths to another subdomain in production. A
    // client-side router push updates the address bar before that redirect and
    // can leave the old tree mounted, which is the hard-refresh glitch.
    if (
      targetObj.origin !== currentObj.origin ||
      (currentObj.hostname === "xakteir.com" || currentObj.hostname === "www.xakteir.com") &&
        isCrossOriginRoute(targetObj.pathname)
    ) {
      if (replace) window.location.replace(targetObj.href);
      else window.location.assign(targetObj.href);
      return;
    }

    if (replace) router.replace(relativePath);
    else router.push(relativePath);
  } catch {
    if (replace) window.location.replace(targetUrl);
    else window.location.assign(targetUrl);
  }
}
