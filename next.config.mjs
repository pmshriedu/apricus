/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["utfs.io"],
  },
  serverActions: {
    allowedOrigins: ["apricushotels.com"],
  },
};

export default nextConfig;
