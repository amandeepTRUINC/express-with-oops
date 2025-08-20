export interface IBuilding {
  id?: number
  name: string
  address: string
  latitude: number
  longitude: number
  restaurant_id?: number
}

export interface IBuildingRestaurantPayload {
  id?: number
  restaurant_id: number
  building_id: number
}