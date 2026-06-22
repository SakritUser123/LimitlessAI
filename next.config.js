const nextConfig = {
  reactStrictMode: true,

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
    ],
  },

  // 🔥 ADD THIS
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
