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
  }
}