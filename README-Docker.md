# Docker Setup for Restaurant App Backend

This document provides instructions for running the restaurant app backend using Docker.

## Prerequisites

- Docker installed on your machine
- Docker Compose installed on your machine

## Quick Start

### Option 1: Using Docker Compose (Recommended)

1. **Clone or download the project files**
   Make sure you have all the project files including:
   - `Dockerfile`
   - `docker-compose.yml`
   - `package.json`
   - `tsconfig.json`
   - `src/` directory
   - `prisma/` directory

2. **Run the application**
   ```bash
   docker-compose up --build
   ```

3. **Access the application**
   - Backend API: http://localhost:3000
   - Database: localhost:5432 (if needed for debugging)

### Option 2: Using Docker only

1. **Build the Docker image**
   ```bash
   docker build -t restaurant-backend .
   ```

2. **Run the container**
   ```bash
   docker run -p 3000:3000 \
     -e DATABASE_URL="postgresql://postgres:password@host.docker.internal:5432/restaurant_app" \
     -e APP_PORT=3000 \
     restaurant-backend
   ```

## Environment Variables

The application uses the following environment variables:

- `DATABASE_URL`: PostgreSQL connection string
- `APP_PORT`: Port for the application (default: 3000)
- `NODE_ENV`: Environment (production/development)

## Database Setup

The application uses PostgreSQL. When using Docker Compose, the database is automatically set up with:
- Database name: `restaurant_app`
- Username: `postgres`
- Password: `password`
- Port: `5432`

## API Endpoints

Once the application is running, you can access the API at:
- Base URL: `http://localhost:3000`
- Health check: `http://localhost:3000/health` (if implemented)

## Troubleshooting

### Port already in use
If port 3000 is already in use, you can change it in the `docker-compose.yml` file:
```yaml
ports:
  - "3001:3000"  # Change 3001 to any available port
```

### Database connection issues
Make sure the database is running and accessible. The application will automatically run migrations on startup.

### Build issues
If you encounter build issues, try:
```bash
docker-compose down
docker-compose up --build --force-recreate
```

## Stopping the Application

To stop the application:
```bash
docker-compose down
```

To stop and remove all data (including database):
```bash
docker-compose down -v
```

## Development Notes

- The application automatically runs database migrations on startup
- The Prisma client is generated during the build process
- The application is built using TypeScript and runs in production mode 