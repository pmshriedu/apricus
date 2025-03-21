/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["utfs.io"],
  },
  experimental: {
    serverActions: {
      allowedOrigins: [
        "localhost:3000",
        "www.apricushotels.com",
        "apricushotels.com",
        "https://www.apricushotels.com/",
      ],
    },
  },
};

export default nextConfig;
