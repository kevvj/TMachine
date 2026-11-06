/** @type {import('next').NextConfig} */
// Para la demo estática del portfolio: STATIC_EXPORT=1 BASE_PATH=/demos/tmachine npm run build
const nextConfig = process.env.STATIC_EXPORT
  ? { output: "export", basePath: process.env.BASE_PATH || "", images: { unoptimized: true } }
  : {};

export default nextConfig;
