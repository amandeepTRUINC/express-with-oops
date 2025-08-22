import { Express } from 'express';
import userRoutes from './user.routes'
import restaurantRoutes from './restaurants.route'
import buildingRoutes from './building.route'
import menuCategoryRoutes from './menuCategory.route'
import menuItemRoutes from './menuItem.route'
import floorRoutes from './floor.route'
function RegisterRoutes(appInstance: Express) {

  appInstance.use("/api/v1/users", userRoutes);
  appInstance.use("/api/v1/restaurants", restaurantRoutes);
  appInstance.use('/api/v1/buildings', buildingRoutes)
  appInstance.use('/api/v1/menu-categories', menuCategoryRoutes)
  appInstance.use('/api/v1/menu-items', menuItemRoutes)
  appInstance.use('/api/v1/floors', floorRoutes)

}

export default RegisterRoutes;


