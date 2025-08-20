export const userPublicFields = {
  id: true,
  full_name: true,
  email: true,
  phone_number: true,
  role_id: true,
  status: true,
  created_at: true,
  updated_at: true,
  roles: {
    select: {
      name: true
    }
  },
  restaurants: true,
  cart_items: true,
  address_book: true,
  orders: true,
  loyalty_points: true,
  building: true,
  floor: true
}

export const restaurantPubliFields = {
  id: true,
  name: true,
  address: true,
  contact_number: true,
  users: true,
  is_active: true,
  approval_status: true,
  commission_rate: true,
  estimated_prep_time: true,
  menu_categories: true,
  menu_items: true,
  ratings: true,
  offers: true,
  loyalty_rates: true,
  restaurant_buildings: true,
  restaurant_shifts: true
}

export const buildingPublicFields = {
  id: true,
  name: true,
  address: true,
  latitude: true,
  longitude: true
}