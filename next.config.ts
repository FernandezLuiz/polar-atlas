/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export' as const,
  // Zorgt dat CSS en JS in de juiste submap zoeken op GitHub Pages:
  basePath: '/polar-atlas', 
  images: {
    unoptimized: true,
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

