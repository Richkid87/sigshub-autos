// CAR DATA
// Replace these with API calls to your backend CMS
// Each car object maps directly to the CarCard component props

export const featuredCars = [
  {
    id: 1,
    name: 'Toyota Corolla LE',
    year: '2018',
    price: '₦12,500,000',
    mileage: '45k Miles',
    fuel: 'Petrol',
    transmission: 'Automatic',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAgaQtsIoHxo6RHc2Nq17R4z61toN-5kgBjWwbf1m481X8inGTmS-vW9BBq5xNIh2N6DO7-wgJd1ZAGnqMfnWTNzDz4t6QUZTYwy97dUB8O5khqAwykj2AMLRDAR9k4nre1gWu1DUQI48nG06IyUZZ4ZO-XwY54EDcnJFjyHc28Icrc8r9u0wofaIcPX1bAkVVKqyVo8TYpiRJ7LBvLO8V4e6g3gDjx1rQ_Nw6thUGQu0gAQtjkkKv_6ssKziRMlmXlDfsEc7Hf5KYZ',
    badge: null,
    available: true,
  },
  {
    id: 2,
    name: 'Lexus RX 350',
    year: '2021',
    price: '₦45,000,000',
    mileage: '12k Miles',
    fuel: 'Petrol',
    transmission: 'Automatic',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDwcClkBvqtdSJKa0vGMKlWCrxJVvz6R5Scuz4A-uqkOLF3W6HLhYXEsTVLlolvXEiaZuQzAK-o4dYhoTjk0ZRiKy0IM992qHh04Mism8yOgOSX6dB8eEoE1yqssYocDb9sCwFvfhR4u34PwoNfZMTKq0Abj3RutDm6K2HLzquE54LHc8gfTNmVwyoKkbsWovkEBxSU5r7NxRMrcwMQzxHn5_EfnJY27WBOvYUkOZFZ3vFnyXzrsChsM7cLItOECLUKNw-jWlX4BPx8',
    badge: 'Just In',
    available: true,
  },
  {
    id: 3,
    name: 'Mercedes C300',
    year: '2019',
    price: '₦24,500,000',
    mileage: '38k Miles',
    fuel: 'Petrol',
    transmission: 'Automatic',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA-A8VnBpGvgj_Py78XLgOOML4TKTtK0_J5XtwVeUjyspgm2ifFFkBIhH0wcstwqvj3hA6_e_rHpsrwZfbM3h5zxHgE-Cyik7teBo1dAjqCnKCjsW9iVCc2VgrXeaGcHCWcNW0jLjgIdPdKhAcIq9P0_nMHKfhTDJ6iZxG6l3HzFcS5DdE8BaNFvf7yYcxNfYf6wrWSa--ccDcyuX6GwyuOSMuCRPFvP1CNTsUHtM458gMMQkBPwmpVi-7FCutSMzxTLG1Iqop9yXwI',
    badge: null,
    available: true,
  },
  // PLACEHOLDER SLOTS — replace with backend data
  {
    id: 4,
    name: 'Lexus RX350',
    year: '2010',
    price: '₦20,000,000',
    mileage: '—',
    fuel: 'Petrol',
    transmission: 'Automatic',
    body_type: 'SUV',
    description: 'Smooth and stylish Lexus RX350 with a V6 engine. Luxury SUV in great condition. DM now and drive away today!',
    image: null,
    badge: 'Just In',
    available: true,
    featured: true,
  },
  { id: 5, name: '[Car Name]', year: '20XX', price: '₦0,000,000', mileage: '—', fuel: 'Petrol', transmission: 'Automatic', image: null, badge: null, available: true },
  { id: 6, name: '[Car Name]', year: '20XX', price: '₦0,000,000', mileage: '—', fuel: 'Petrol', transmission: 'Automatic', image: null, badge: null, available: true },
]

export const latestArrivals = [
  {
    id: 7,
    name: 'Honda Accord',
    year: '2017',
    price: '₦8,500,000',
    mileage: '62k Miles',
    fuel: 'Petrol',
    transmission: 'Automatic',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDfaEqxAdPmN7FY0rIetjYVrzJdwGfJOIGtxZ_r7k1Zk2WRYmj60ZeuWKaXTL2UoWqk9W8WpTas-CNCM_ume_-3d4kGSv39TtfdQj_LBmqi3HKb0h1Xp6EHvDyVYt9iI2fNxmHc2HN_7Beq8LoPDzuo0erNCbc_yuUDK1aNN0BXlO0Oa1CgkN7FEK1-vM1KuGnjsr_NfV8-OwQ0I3FWnKKEd0vYtfmXqLJhLFNIMt8ctWWv8ly0soQjuMQ0RIOAkgCapVyMuGBuZJ-r',
    badge: 'Just In',
    available: true,
  },
  {
    id: 8,
    name: 'Range Rover Sport',
    year: '2020',
    price: '₦68,000,000',
    mileage: '21k Miles',
    fuel: 'Petrol',
    transmission: 'Automatic',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAhj6cvy-tMXrwlS-Y4OXCU8GPBeD56itR-9307ymuwek6tmwtDbAKckwwcPsXv89ABKqm3voLk86vtLtVdO1A-PJ341zDQ2Bxrq_4CO-RMwK6zMO4UiMpCxgbuFqrubTcUgHsnAd5Om8h-6YSDsJWqFaZy4-yPVYoOr-ACcYnCpX24K7zhlnx8lW8qIG9fkzGk4EJQcw06JVqmmWsjPj0GUhZCF5S638vXlvTYEX-KMbG7T4fxc-Hp5cB3AditNcAtr0aFQUYot_Vx',
    badge: 'Just In',
    available: true,
  },
  // PLACEHOLDER SLOTS
  { id: 9, name: '[Car Name]', year: '20XX', price: '₦0,000,000', mileage: '—', fuel: 'Petrol', transmission: 'Automatic', image: null, badge: 'Just In', available: true },
]

export const allCars = [...featuredCars, ...latestArrivals]

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
