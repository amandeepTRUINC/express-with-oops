import { Express } from 'express';
import userRoutes from './user.routes'
import restaurantRoutes from './restaurants.route'
function RegisterRoutes(appInstance: Express) {

  appInstance.use("/api/v1/users", userRoutes);
  appInstance.use("/api/v1/restaurants", restaurantRoutes);

  
  // ✅ Use the exported router directly
  // private registerRoutes(appInstance: Express) {
  // }
}

export default RegisterRoutes;


