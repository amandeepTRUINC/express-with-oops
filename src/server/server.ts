import express from 'express';
import dotenv from 'dotenv';
import RegisterRoutes from '../routes';

dotenv.config();

const APP_PORT = parseInt(process.env.APP_PORT || '3000');
const app = express();

app.use(express.json());
RegisterRoutes(app);

app.listen(APP_PORT, () => {
  console.log(`Server is running at http://localhost:${APP_PORT}`);
});
