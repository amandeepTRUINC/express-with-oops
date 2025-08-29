import express from 'express';
import dotenv from 'dotenv';
import RegisterRoutes from '../routes';
import { seedDefaultRoles } from '../seeding/roles';
import { seedDefaultUsers } from '../seeding/users';
import { seedDefaultOrderStatus } from '../seeding/orderStatus';

dotenv.config();

const APP_PORT = parseInt(process.env.APP_PORT || '3000');
const app = express();

app.use(express.json());
RegisterRoutes(app);

const addDefaultDataAndStartServer = async () => {
  console.log("###### ADDING DEFAULT DATA #####")
  await seedDefaultRoles()
  await seedDefaultUsers()
  await seedDefaultOrderStatus()
  console.log("#### Default Data Added Successfully ####")
  app.listen(APP_PORT, () => {
    console.log(`Server is running at http://localhost:${APP_PORT}`);
  });
}
addDefaultDataAndStartServer()