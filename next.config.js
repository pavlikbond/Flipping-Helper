module.exports = {
  reactStrictMode: true,
  images: {
    domains: ["picsum.photos"],
  },
  webpack: (config) => {
    config.resolve.fallback = { fs: false };

    return config;
  },
};
