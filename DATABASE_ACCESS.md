# 🗄️ MongoDB Database Access Guide

## Quick Reference

| Property | Value |
|----------|-------|
| **Host** | `mongodb` (Docker) or `localhost` (host machine) |
| **Port** | `27017` |
| **Username** | `root` |
| **Password** | `password123` |
| **Database** | `ekyc_db` |
| **Auth Source** | `admin` |

---

## 🔗 Connection String

```
mongodb://root:password123@localhost:27017/ekyc_db?authSource=admin
```

---

## Method 1: MongoDB Shell (mongosh) via Docker 🐳

### Quick Access
```bash
docker compose exec mongodb mongosh -u root -p password123
```

### Inside the shell
```javascript
// Connect to ekyc_db
use ekyc_db

// List all collections
show collections

// View all documents in a collection
db.collection_name.find()

// View documents with pretty print
db.collection_name.find().pretty()

// Count documents
db.collection_name.countDocuments()

// Get first document
db.collection_name.findOne()

// Query with filter
db.users.find({ email: "user@example.com" })

// Exit shell
exit
```

### Common Collection Queries
```javascript
// View all users (if exists)
db.users.find().pretty()

// View all KYC submissions
db.kyc.find().pretty()

// Count submissions
db.kyc.countDocuments()

// Get latest submission
db.kyc.findOne({}, { sort: { _id: -1 } })
```

---

## Method 2: MongoDB Compass (GUI) 🎨

### Installation & Setup

1. **Download**: [MongoDB Compass](https://www.mongodb.com/products/compass)
2. **Install**: Follow the installer
3. **Open Compass**: Launch the application
4. **New Connection**: Click "New Connection"
5. **Connection String**: Paste this:
   ```
   mongodb://root:password123@localhost:27017/ekyc_db?authSource=admin
   ```
6. **Connect**: Click "Connect"
7. **Browse**: Explore your data visually

### Features in Compass
- 👁️ View all collections and documents
- ✏️ Edit documents directly
- 📊 View statistics and performance data
- 🔍 Query builder for advanced searches
- 📈 Index management

---

## Method 3: Local mongosh CLI

### Prerequisites
```bash
# Install mongosh locally (macOS)
brew install mongosh

# Install mongosh locally (Windows)
# Download from https://www.mongodb.com/try/download/shell

# Install mongosh locally (Linux)
sudo apt-get install -y mongodb-mongosh
```

### Connect
```bash
mongosh "mongodb://root:password123@localhost:27017/ekyc_db?authSource=admin"
```

---

## Method 4: Backend API Queries

### Your Backend Endpoints
Access your MongoDB data through your backend API at `http://localhost:5000`

Example endpoints (if implemented):
```bash
# Get all KYC data (admin endpoint)
curl -X POST http://localhost:5000/api/kyc/getAllKyc \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@example.com"}'

# Login (creates/updates user)
curl -X POST http://localhost:5000/api/kyc/login \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "password123"}'
```

---

## Method 5: MongoDB Atlas (Cloud)

### For Production Use
1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Update connection string in `.env` files
3. Point your application to cloud database

---

## 📝 Useful Commands

### View Current Database
```javascript
db.getName()  // Shows: ekyc_db
```

### List All Collections
```javascript
show collections
// or
db.getCollectionNames()
```

### Get Database Stats
```javascript
db.stats()
```

### Collection Information
```javascript
db.collection_name.stats()
db.collection_name.getIndexes()
```

### Delete a Document
```javascript
db.collection_name.deleteOne({ _id: ObjectId("...") })
```

### Update a Document
```javascript
db.collection_name.updateOne(
  { _id: ObjectId("...") },
  { $set: { field: "new_value" } }
)
```

### Insert a Document
```javascript
db.collection_name.insertOne({ name: "John", email: "john@example.com" })
```

---

## 🔐 Data Persistence

Your MongoDB data is stored in a Docker volume:
- **Volume Name**: `ekyc_updated_mongodb_data`
- **Persists**: Across container restarts
- **Location**: `/var/lib/docker/volumes/ekyc_updated_mongodb_data/_data`

Data remains safe even if you stop/restart containers (unless you run `docker compose down -v`).

---

## ⚠️ Backup & Restore

### Backup Database
```bash
docker compose exec mongodb mongodump -u root -p password123 -d ekyc_db -o /tmp/backup
docker cp ekyc_mongodb:/tmp/backup ./backup
```

### Restore Database
```bash
docker cp ./backup ekyc_mongodb:/tmp/backup
docker compose exec mongodb mongorestore -u root -p password123 /tmp/backup
```

---

## 🆘 Troubleshooting

### Can't Connect
```bash
# Check if container is running
docker compose ps mongodb

# Check logs
docker compose logs mongodb

# Restart MongoDB
docker compose restart mongodb
```

### Port Already in Use
```bash
# Find what's using port 27017
lsof -i :27017

# Kill the process
kill -9 <PID>
```

### Forgot Credentials
- Username: `root`
- Password: `password123`
- Change in `ekyc_be_rmq/.env` and restart

---

## 📚 Quick Start Examples

### Example 1: Create a User Collection
```javascript
db.users.insertOne({
  email: "john@example.com",
  name: "John Doe",
  createdAt: new Date()
})
```

### Example 2: Find All Users
```javascript
db.users.find({})
```

### Example 3: Update a User
```javascript
db.users.updateOne(
  { email: "john@example.com" },
  { $set: { name: "John Smith" } }
)
```

### Example 4: Delete a User
```javascript
db.users.deleteOne({ email: "john@example.com" })
```

---

## 🎯 Next Steps

1. **Explore**: Browse your data using MongoDB Compass
2. **Backup**: Regularly backup important data
3. **Monitor**: Check database performance and indexes
4. **Optimize**: Add indexes for frequently queried fields
5. **Scale**: Plan for production deployment

---

**Last Updated**: December 2, 2025
**Status**: Ready for use
