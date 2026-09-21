/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_BACKEND_URL || process.env.BACKEND_URL || 'https://devinlink.onrender.com'}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;

