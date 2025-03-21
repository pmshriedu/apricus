/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["utfs.io"],
  },
  experimental: {
    serverActions: {
      allowedOrigins: [
        "pluralcheckout.pinepg.in",
        "https://pluralcheckout.pinepg.in",
      ],
    },
  },
};

export default nextConfig;
