import { Express } from 'express';
import userRoutes from './user.routes'

function RegisterRoutes(appInstance: Express) {

  appInstance.use("/api/v1/users", userRoutes);
  
  // ✅ Use the exported router directly
  // private registerRoutes(appInstance: Express) {
  // }
}

export default RegisterRoutes;


