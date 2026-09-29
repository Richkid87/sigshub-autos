/**
 * app/data/cars.js — DEPRECATED
 *
 * All car data is now managed through the Supabase database via the
 * admin dashboard at /admin/dashboard.
 *
 * This file is intentionally empty. Do NOT add hardcoded car data here.
 * Use app/lib/supabase.js helpers (getAllCars, getFeaturedCars, etc.) instead.
 */

export const featuredCars = []
export const latestArrivals = []
export const allCars = []
export const testimonials = [
  {
    id: 1,
    text: 'Bought my first car here. Process was seamless and the inspection report was very accurate. Highly recommend SigsHub!',
    name: 'Tunde',
    city: 'Lagos',
    stars: 5,
  },
  {
    id: 2,
    text: 'Excellent customer service. They handled the delivery to Abuja perfectly. The car was exactly as described.',
    name: 'Chidi',
    city: 'Abuja',
    stars: 5,
  },
  {
    id: 3,
    text: 'Great selection of cars at very fair prices. The booking process was super easy and the team was very professional.',
    name: 'Amaka',
    city: 'Port Harcourt',
    stars: 5,
  },
]
