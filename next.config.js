/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true
  },

  serverRuntimeConfig: {
    maxFileSize: 10 * 1024 * 1024 // 10MB
  },

  env: {
    NEXT_PUBLIC_MAX_FILE_SIZE_MB: '10'
  },

  compress: true,
  poweredByHeader: false,

  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false
      };
    }
    return config;
  }
};

module.exports = nextConfig;
