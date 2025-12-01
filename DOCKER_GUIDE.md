# Docker Deployment Guide - eKYC RMQ

This project uses Docker and Docker Compose to orchestrate multiple services: Frontend, Backend, MongoDB, and RabbitMQ.

## 📋 Prerequisites

- Docker (v20.10+)
- Docker Compose (v2.0+)
- Git

## 🚀 Quick Start

### 1. Build and Start All Services

```bash
docker-compose up -d
```

This will:
- Build the Frontend (React app) and Backend (Node.js)
- Pull MongoDB and RabbitMQ images
- Start all 4 services
- Create volumes for persistent data

### 2. Verify Services Are Running

```bash
docker-compose ps
```

You should see all 4 containers running:
- `ekyc_frontend` - Running on http://localhost
- `ekyc_backend` - Running on http://localhost:5000
- `ekyc_mongodb` - Running on localhost:27017
- `ekyc_rabbitmq` - Running on localhost:5672

### 3. Access Services

- **Frontend**: http://localhost
- **Backend API**: http://localhost:5000
- **RabbitMQ Management UI**: http://localhost:15672 (credentials: guest/guest)
- **MongoDB**: localhost:27017 (credentials: root/password123)

## 📝 Configuration

### Environment Variables

Edit these files to customize credentials and settings:

**Backend** (`ekyc_be_rmq/.env`):
```
MONGO_URL=mongodb://root:password123@mongodb:27017/ekyc_db?authSource=admin
RABBITMQ_URL=amqp://guest:guest@rabbitmq:5672
JWT_SECRET=your-secret-key-change-in-production
OPENROUTER_API_KEY=your-api-key-here
PORT=5000
NODE_ENV=production
```

**Frontend** (`ekyc_fe_rmq/.env`):
```
REACT_APP_API_URL=http://localhost:5000
```

## 🛑 Stop Services

```bash
# Stop all services (keep data)
docker-compose stop

# Stop and remove containers (keep volumes/data)
docker-compose down

# Stop, remove containers, and delete volumes
docker-compose down -v
```

## 📊 View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mongodb
docker-compose logs -f rabbitmq
```

## 🔄 Rebuild Services

```bash
# Rebuild only backend
docker-compose up -d --build backend

# Rebuild only frontend
docker-compose up -d --build frontend

# Rebuild everything
docker-compose up -d --build
```

## 💾 Data Persistence

The following volumes are created for persistent data:
- `mongodb_data` - MongoDB database files
- `mongodb_config` - MongoDB configuration
- `rabbitmq_data` - RabbitMQ data

## 🔌 Network

All services communicate via the `ekyc_network` bridge network:
- Backend connects to MongoDB at `mongodb:27017`
- Backend connects to RabbitMQ at `rabbitmq:5672`
- Frontend makes API calls to `backend:5000` (or `localhost:5000` from browser)

## ⚠️ Common Issues

**Port Already in Use**
```bash
# Find what's using the port
lsof -i :80  # Frontend
lsof -i :5000  # Backend
lsof -i :27017  # MongoDB
lsof -i :5672  # RabbitMQ
```

**MongoDB Connection Issues**
- Ensure MongoDB is healthy: `docker-compose ps`
- Check logs: `docker-compose logs mongodb`

**RabbitMQ Connection Issues**
- Check RabbitMQ logs: `docker-compose logs rabbitmq`
- Access management UI to verify: http://localhost:15672

## 🧹 Cleanup

```bash
# Remove all containers, volumes, and networks
docker-compose down -v

# Remove unused Docker resources
docker system prune -a
```

## 📚 Additional Commands

```bash
# Execute command in running container
docker-compose exec backend npm test
docker-compose exec frontend npm test

# View container resource usage
docker stats

# Pull latest images
docker-compose pull

# Push custom images to registry (if configured)
docker-compose push
```

---

**Note**: Change sensitive credentials (JWT_SECRET, OPENROUTER_API_KEY) before deploying to production.
