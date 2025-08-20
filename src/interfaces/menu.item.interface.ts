export interface IMenuItem {
  id?: number,
  restaurant_id: number ,
  name: string,
  category_id: number,
  description: string,
  price: number,
  is_available: boolean,
  is_veg: boolean,
  image_url: string,
  preparation_time: number,
  customizable: boolean,

}