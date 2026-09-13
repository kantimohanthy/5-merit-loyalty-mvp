/** @type {import('next').NextConfig} */
const isGithubPages = process.env.GITHUB_ACTIONS === "true" || process.env.NEXT_PUBLIC_STATIC_DEMO === "true";
const repo = "5-merit-loyalty-mvp";

const nextConfig = {
  output: isGithubPages ? "export" : undefined,
  basePath: isGithubPages ? `/${repo}` : "",
  assetPrefix: isGithubPages ? `/${repo}/` : undefined,
  trailingSlash: true,
  images: { unoptimized: true },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  ...(isGithubPages
    ? {}
    : {
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
      }),
};

module.exports = nextConfig;
