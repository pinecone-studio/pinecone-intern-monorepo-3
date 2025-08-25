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
  images: {
    remotePatterns: [
      {
        hostname: '*',
      },
    ],
  },
  env: { BACKEND_URI: process.env.BACKEND_URI, VERCEL_TOKEN: process.env.VERCEL_TOKEN, LOCAL_BACKEND_URI: process.env.LOCAL_BACKEND_URI },
};

const plugins = [withNx];

module.exports = composePlugins(...plugins)(nextConfig);
