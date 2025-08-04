import express, { Express } from 'express'
import dotenv from 'dotenv'
import RegisterRoutes from '../routes';

export class Server {
  private app: Express;
  private APP_PORT: number;

  constructor() {
    this.loadEnv();
    this.app = express();
    this.APP_PORT = parseInt(process.env.APP_PORT || '3000');
    this.configureApp();
    this.listen();
  }

  private loadEnv() {
    dotenv.config();
  }

  private configureApp() {
    this.app.use(express.json());
    RegisterRoutes(this.app);
  }

  private listen() {
    this.app.listen(this.APP_PORT, () =>
      console.log(`Server is running at http://localhost:${this.APP_PORT}`)
    );
  }

  public getApp(): Express {
    return this.app;
  }
}


const server = new Server();
export const app = server.getApp();
