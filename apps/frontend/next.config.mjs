import { NextConfig } from 'next';
import { withNextI18Next } from 'next-i18next/plugin';

const config = /** @type {NextConfig} */ ({
  reactStrictMode: true,
  experimental: {
    appDir: true
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**'
      }
    ]
  },
  i18n: {
    locales: ['pt', 'en'],
    defaultLocale: 'pt'
  },
  transpilePackages: ['lucide-react']
});

export default withNextI18Next()(config);
