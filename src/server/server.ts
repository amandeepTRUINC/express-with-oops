import express from 'express';
import dotenv from 'dotenv';
import RegisterRoutes from '../routes';
import { seedDefaultRoles } from '../seeding/roles';
import { seedDefaultUsers } from '../seeding/users';

dotenv.config();

const APP_PORT = parseInt(process.env.APP_PORT || '3000');
const app = express();

app.use(express.json());
RegisterRoutes(app);

const addDefaultDataAndStartServer = async () => {
  console.log("###### ADDING DEFAULT DATA #####",{
    'db': process.env.DATABASE_URL,
    'port': process.env.APP_PORT,
    'salt': process.env.SALT_ROUNDS,
    'jwt': process.env.JWT_SECRET
  })
  await seedDefaultRoles()
  await seedDefaultUsers()
  console.log("#### Default Data Added Successfully ####")
  app.listen(APP_PORT, () => {
    console.log(`Server is running at http://localhost:${APP_PORT}`);
  });
}
addDefaultDataAndStartServer()