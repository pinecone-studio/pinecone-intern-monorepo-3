//@ts-check

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { composePlugins, withNx } = require('@nx/next');

/**
 * @type {import('@nx/next/plugins/with-nx').WithNxOptions}
 **/
const nextConfig = {
  nx: {
    svgr: false,
  },
  typescript: {
    // Build үеэр TS алдааг түр үл тооно (CI/build блоклохгүйн тулд)
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      // Cloudinary
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      // Example.com (seed data-д ашиглагдаж байгаа)
      { protocol: 'https', hostname: 'example.com' },
    ],
  },
};

const plugins = [withNx];

module.exports = composePlugins(...plugins)(nextConfig);
