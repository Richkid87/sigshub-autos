import './globals.css'

export const metadata = {
  metadataBase: new URL('https://sigshubautos.com'),
  title: {
    default: "SigsHub Autos | Nigeria's Trusted Car Dealer",
    template: '%s | SigsHub Autos',
  },
  description: 'Quality verified pre-owned cars at the best prices in Lagos & across Nigeria. Free vehicle inspections, flexible payment options, and nationwide delivery.',
  keywords: [
    'used cars Nigeria',
    'buy cars Lagos',
    'SigsHub Autos',
    'pre-owned cars Nigeria',
    'tokunbo cars Lagos',
    'car dealership Nigeria',
    'inspected used cars',
    'Lexus for sale Nigeria',
    'Toyota for sale Lagos'
  ],
  authors: [{ name: 'SigsHub Autos' }],
  creator: 'SigsHub Autos',
  publisher: 'SigsHub Autos',
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: 'website',
    locale: 'en_NG',
    url: 'https://sigshubautos.com',
    siteName: 'SigsHub Autos',
    title: "SigsHub Autos | Nigeria's Trusted Car Dealer",
    description: 'Quality verified pre-owned cars at the best prices in Lagos & across Nigeria. Free vehicle inspections, flexible payment options, and nationwide delivery.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'SigsHub Autos - Trusted Car Dealer in Nigeria',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "SigsHub Autos | Nigeria's Trusted Car Dealer",
    description: 'Quality verified pre-owned cars at the best prices in Lagos & across Nigeria. Free vehicle inspections, flexible payment options, and nationwide delivery.',
    images: ['/og-image.png'],
  },
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
}

const autoDealerSchema = {
  '@context': 'https://schema.org',
  '@type': 'AutoDealer',
  name: 'SigsHub Autos',
  image: 'https://sigshubautos.com/og-image.png',
  url: 'https://sigshubautos.com',
  telephone: '+2348000000000',
  description: "Nigeria's trusted car dealership providing verified pre-owned cars, free vehicle inspections, flexible financing, and nationwide delivery.",
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Lagos',
    addressCountry: 'NG',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: '6.5244',
    longitude: '3.3792',
  },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      opens: '08:00',
      closes: '18:00',
    },
  ],
  priceRange: '₦₦₦',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Inter:wght@400;500;600&family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(autoDealerSchema) }}
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
