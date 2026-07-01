import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // allowedDevOrigins: ['0.0.0.0'],
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: "**",
      },
    ],
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      exclude: /node_modules/,
      use: ["@svgr/webpack"],
    });
    return config;
  },

};

export default nextConfig;

// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   /* config options here */
//   webpack(config) {
//     config.module.rules.push({
//       test: /\.svg$/,
//       use: ["@svgr/webpack"],
//     });
//     return config;
//   },
    
//     turbopack: {
//       rules: {
//         '*.svg': {
//           loaders: ['@svgr/webpack'],
//           as: '*.js',
//         },
//       },
//     },
  
// };

// export default nextConfig;
