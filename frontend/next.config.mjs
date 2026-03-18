/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  async rewrites() {
    return [
      {
        source: '/api',
        destination: '/',
      },
      {
        source: '/api/:path*',
        destination: '/',
      },
    ]
  },
}

export default nextConfig
