import { getAllCars } from './lib/supabase'

export const dynamic = 'force-dynamic'

export default async function sitemap() {
  const baseUrl = 'https://sigshubautos.com'

  const staticRoutes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/car-gallery`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/bookings`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ]

  let carRoutes = []
  try {
    const cars = await getAllCars()
    if (Array.isArray(cars)) {
      carRoutes = cars.map(car => ({
        url: `${baseUrl}/car-gallery/${car.id}`,
        lastModified: car.created_at ? new Date(car.created_at) : new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
      }))
    }
  } catch (e) {
    console.error('[sitemap.js] Error fetching cars for sitemap:', e)
  }

  return [...staticRoutes, ...carRoutes]
}
