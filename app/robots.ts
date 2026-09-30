import type { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // proxy.ts sends signed-out visitors from these to /auth/login, so a
      // crawler only ever sees the login page there.
      disallow: ["/browse", "/account", "/auth/"],
    },
  }
}
