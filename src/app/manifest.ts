import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'KTLTC Admin Portal',
    short_name: 'KTLTC',
    description: 'Korat Thai Logistics Employee Management Hub',
    start_url: '/',
    display: 'standalone',
    background_color: '#09090b',
    theme_color: '#3b82f6',
    icons: [
      {
        src: '/images/favicon.ico',
        sizes: '192x192',
        type: 'image/x-icon',
      },
      {
        src: '/images/logo.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}
