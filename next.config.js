/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: false,
  },
  async redirects() {
    return [
      { source: "/dashboard", destination: "/ecosystem", permanent: false },
      { source: "/dashboard/plan", destination: "/ecosystem", permanent: false },
      { source: "/dashboard/activity", destination: "/ecosystem/activity", permanent: false },
      { source: "/dashboard/rewards", destination: "/ecosystem/rewards", permanent: false },
      { source: "/dashboard/status", destination: "/ecosystem/goals", permanent: false },
      { source: "/architecture", destination: "/network", permanent: false },
    ];
  },
};

module.exports = nextConfig;
