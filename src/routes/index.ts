import { Express } from 'express';
import userRoutes from './users/user.routes'
import restaurantRoutes from './restaurants/restaurants.route'
import buildingRoutes from './buildings/building.route'
import menuCategoryRoutes from './menuCategories/menuCategory.route'
import menuItemRoutes from './menuItems/menuItem.route'
import floorRoutes from './floors/floor.route'
import dailyMealsRoutes from './dailyMeals/dailyMeal.route'

function RegisterRoutes(appInstance: Express) {

  appInstance.use("/api/v1/users", userRoutes);
  appInstance.use("/api/v1/restaurants", restaurantRoutes);
  appInstance.use('/api/v1/buildings', buildingRoutes)
  appInstance.use('/api/v1/menu-categories', menuCategoryRoutes)
  appInstance.use('/api/v1/menu-items', menuItemRoutes)
  appInstance.use('/api/v1/floors', floorRoutes)
  appInstance.use('/api/v1/daily-meals', dailyMealsRoutes)
}

export default RegisterRoutes;


