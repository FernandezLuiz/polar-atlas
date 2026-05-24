/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export' as const,
  basePath: '/polar-atlas',
  assetPrefix: '/polar-atlas',
  // VOEG DIT TOE: Zorgt dat deBasePath ook beschikbaar is in uw JS-bestanden
  env: {
    NEXT_PUBLIC_BASE_PATH: '/polar-atlas',
  },
  images: {
    unoptimized: true,
    // VOEG DIT TOE: Helpt Next.js images de juiste paden te vinden
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'fernandezluiz.github.io',
      },
    ],
  },
  trailingSlash: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;