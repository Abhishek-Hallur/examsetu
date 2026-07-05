/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  serverExternalPackages: ["pino", "pino-pretty"],
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      // Avatar images from Google OAuth
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      // GitHub user avatars (for future GitHub OAuth)
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
    ],
  },
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
};

export default nextConfig;
