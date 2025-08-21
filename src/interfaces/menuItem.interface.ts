export interface IMenuItem {
  id?: number,
  restaurant_id: number ,
  name: string,
  category_id: number,
  description: string,
  price: number,
  is_available: boolean,
  is_veg: boolean,
  image_url: string, // TODO- May need to be type buffer
  preparation_time: number,
  customizable: boolean,

}

export interface IMenuItemFilter {
  category_id: number
}