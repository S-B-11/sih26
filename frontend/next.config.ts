import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,

  // react-leaflet v5 does not survive React 19's StrictMode double-mount:
  // Leaflet stamps an id on the container div, and the remount throws
  // "Map container is being reused by another instance". It is a race —
  // sometimes the second mount recovers, sometimes the map never renders
  // at all, which is not something to discover during a demo.
  //
  // StrictMode is a development-only aid and affects nothing in a
  // production build. Revert this if react-leaflet fixes the incompat.
  reactStrictMode: false,
};

export default nextConfig;
