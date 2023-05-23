module.exports = {
  reactStrictMode: true,
  images: {
    domains: ["images.unsplash.com", "hydeparkwinterwonderland.com", "wembleypark.com"],
  },
  webpack: (config) => {
    config.resolve.fallback = { fs: false };

    return config;
  },
};
