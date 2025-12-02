# 🚀 eKYC Docker Setup - Quick Reference

## ✅ All Services Running Successfully!

### Current Status
All 4 services are up and healthy:
- ✅ **Frontend** - React app (Nginx) on port 80
- ✅ **Backend** - Node.js API on port 5000  
- ✅ **MongoDB** - Database on port 27017
- ✅ **RabbitMQ** - Message queue on port 5672

---

## 🌐 Service URLs

| Service | URL |
|---------|-----|
| Frontend | http://localhost |
| Backend API | http://localhost:5000 |
| RabbitMQ Management | http://localhost:15672 |
| MongoDB | localhost:27017 |
| RabbitMQ AMQP | localhost:5672 |

**RabbitMQ Credentials**: `guest` / `guest`

---

## 📝 Useful Commands

### Using the management script
```bash
./docker-manage.sh status      # Show all services status
./docker-manage.sh logs        # View all logs
./docker-manage.sh logs backend # View backend logs only
./docker-manage.sh restart     # Restart all services
./docker-manage.sh stop        # Stop all services
./docker-manage.sh start       # Start all services
./docker-manage.sh rebuild     # Rebuild and restart
./docker-manage.sh clean       # Remove everything
./docker-manage.sh test        # Test backend
```

### Using docker compose directly
```bash
docker compose up -d           # Start services
docker compose down            # Stop services
docker compose ps              # Show status
docker compose logs -f         # View logs
docker compose logs -f backend # View backend logs
docker compose restart         # Restart services
```

---

## 🔍 Debugging

### Check if services are healthy
```bash
./docker-manage.sh status
```

### View service logs
```bash
./docker-manage.sh logs backend
./docker-manage.sh logs mongodb
./docker-manage.sh logs rabbitmq
```

### Test backend connectivity
```bash
./docker-manage.sh test
curl http://localhost:5000
```

### Access MongoDB
```bash
docker compose exec mongodb mongosh -u root -p password123
```

### Access RabbitMQ Management UI
Visit: http://localhost:15672
Login: guest / guest

---

## 📊 Architecture

```
┌─────────────────────────────────────────┐
│          Browser                        │
│      http://localhost                   │
└────────────┬────────────────────────────┘
             │
    ┌────────▼─────────┐
    │    Frontend      │
    │   (Nginx/React)  │
    │    Port 80       │
    └────────┬─────────┘
             │ API calls
    ┌────────▼──────────────┐
    │      Backend          │
    │   (Node.js/Express)   │
    │     Port 5000         │
    └────────┬──────────────┘
             │
    ┌────────┴──────────────┬────────────┐
    │                       │            │
┌───▼────────────┐  ┌──────▼──────┐   ┌─▼──────────┐
│    MongoDB     │  │  RabbitMQ   │   │ RabbitMQ   │
│   Port 27017   │  │  Port 5672  │   │ Port 15672 │
│   Database     │  │   Message   │   │ Management │
└────────────────┘  │   Queue     │   │     UI     │
                    └─────────────┘   └────────────┘
```

---

## ✨ Features Enabled

- ✅ MongoDB with persistent volume
- ✅ RabbitMQ with management UI
- ✅ Backend auto-restart with nodemon
- ✅ Health checks for all services
- ✅ Shared network for inter-service communication
- ✅ Automatic startup dependencies

---

## 🛠️ Environment Variables

The following are configured in docker-compose.yml:

**MongoDB**:
- User: `root`
- Password: `password123`
- Database: `ekyc_db`

**Backend**:
- `MONGO_URL`: mongodb://root:password123@mongodb:27017/ekyc_db?authSource=admin
- `RABBITMQ_URL`: amqp://guest:guest@rabbitmq:5672
- `PORT`: 5000

**RabbitMQ**:
- User: `guest`
- Password: `guest`

---

## ⚠️ Troubleshooting

**Port already in use?**
```bash
lsof -i :80    # Find what's using port 80
lsof -i :5000  # Find what's using port 5000
```

**Services not starting?**
```bash
./docker-manage.sh logs         # Check logs for errors
docker compose restart          # Restart all services
./docker-manage.sh rebuild      # Rebuild from scratch
```

**Need to clean everything?**
```bash
./docker-manage.sh clean        # Remove all containers/volumes
docker compose up -d            # Start fresh
```

---

**Last Updated**: December 2, 2025
