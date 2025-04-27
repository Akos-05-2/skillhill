/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  
  // Statikus fájlok kezelése
  images: {
    domains: ['lh3.googleusercontent.com', 'cdn.discordapp.com'],
    // Képek és fájlok helyi kiszolgálása
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '/**',
      },
    ],
    // Képoptimalizálás beállításai a teljesítmény javításához
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
  },
  
  // Engedélyezzük a nagy méretű statikus fájlokat 
  experimental: {
    largePageDataBytes: 128 * 1000 * 10, // 1.28MB (10x az alapértelmezett 128KB)
    // Teljesítményoptimalizálás
    optimizeCss: true,       // CSS optimalizálás
    scrollRestoration: true, // Lapozási pozíció megőrzése navigációkor
    serverActions: true,
  },
  
  // Teljesítményoptimalizálás
  poweredByHeader: false,      // X-Powered-By fejléc eltávolítása
  compress: true,              // Gzip tömörítés engedélyezése
  reactStrictMode: true,       // Szigorú React mód a hibakereséshez
  swcMinify: true,             // SWC minifikáció használata
  
  // Statikus fájlok jobb kezelése
  async headers() {
    return [
      {
        source: '/files/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable', // 1 év cache
          },
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, OPTIONS',
          },
        ],
      },
      {
        source: '/uploads/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable', // 1 év cache
          },
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, OPTIONS',
          },
        ],
      },
      {
        // Általános statikus eszközök cache-beállításai
        source: '/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          }
        ]
      },
      {
        // Fontok cache-elése
        source: '/fonts/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          }
        ]
      },
      {
        // API útvonalak CORS beállításai
        source: '/api/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization',
          },
        ],
      }
    ];
  },
  
  // Statikus fájlok kiszolgálása - A public könyvtár eleve közvetlenül elérhető a gyökérből,
  // nem kell átirányítás, ami problémát okozhat a fájlok elérésében
  async rewrites() {
    return [
      {
        source: '/static/:path*',
        destination: '/public/:path*',
      },
      // Az uploads könyvtár közvetlenül elérhető, nincs szükség átirányításra
    ];
  },
};

module.exports = nextConfig; 