# 🔗 MongoDB Connection Examples

## Database Credentials

```
Host:       localhost
Port:       27017
Username:   root
Password:   password123
Database:   ekyc_db
Auth:       admin
```

## Connection URI

```
mongodb://root:password123@localhost:27017/ekyc_db?authSource=admin
```

---

## 🐍 Python (PyMongo)

### Installation
```bash
pip install pymongo
```

### Connect and Query
```python
from pymongo import MongoClient

# Connect
client = MongoClient('mongodb://root:password123@localhost:27017/ekyc_db?authSource=admin')
db = client['ekyc_db']

# Insert a document
db.users.insert_one({
    'email': 'john@example.com',
    'name': 'John Doe'
})

# Find documents
for user in db.users.find():
    print(user)

# Count documents
print(db.users.count_documents({}))

# Close connection
client.close()
```

---

## 🟩 Node.js (Mongoose)

### Installation
```bash
npm install mongoose
```

### Connect and Query
```javascript
const mongoose = require('mongoose');

// Connection URI
const mongoURI = 'mongodb://root:password123@localhost:27017/ekyc_db?authSource=admin';

// Connect
mongoose.connect(mongoURI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Connection error:', err));

// Define schema
const userSchema = new mongoose.Schema({
  email: String,
  name: String,
  createdAt: { type: Date, default: Date.now }
});

// Create model
const User = mongoose.model('User', userSchema);

// Insert
const newUser = new User({ email: 'john@example.com', name: 'John Doe' });
newUser.save();

// Find
User.find().then(users => console.log(users));
```

---

## 🔵 Node.js (Native MongoDB Driver)

### Installation
```bash
npm install mongodb
```

### Connect and Query
```javascript
const { MongoClient } = require('mongodb');

const uri = 'mongodb://root:password123@localhost:27017/ekyc_db?authSource=admin';
const client = new MongoClient(uri);

async function connect() {
  try {
    await client.connect();
    const db = client.db('ekyc_db');
    const collection = db.collection('users');
    
    // Insert
    await collection.insertOne({
      email: 'john@example.com',
      name: 'John Doe'
    });
    
    // Find
    const users = await collection.find({}).toArray();
    console.log(users);
    
  } finally {
    await client.close();
  }
}

connect();
```

---

## 🐞 Debugging Tools

### Check Connection
```bash
# From your project directory
docker compose exec mongodb mongosh -u root -p password123 --eval "db.version()"
```

### View Current Logs
```bash
docker compose logs mongodb
```

### Check Database Size
```bash
docker compose exec mongodb mongosh -u root -p password123 --eval "use ekyc_db; db.stats()"
```

---

## 🔐 Security Notes

### Change Default Password (Recommended)

1. Edit `ekyc_be_rmq/.env`:
```
MONGO_URL="mongodb://root:NEW_PASSWORD@mongodb:27017/ekyc_db?authSource=admin"
```

2. Update docker-compose.yml:
```yaml
environment:
  MONGO_INITDB_ROOT_PASSWORD: NEW_PASSWORD
```

3. Restart:
```bash
docker compose restart
```

---

## 📊 Monitoring & Stats

### Database Statistics
```javascript
db.stats()
```

### Collection Statistics
```javascript
db.users.stats()
```

### Disk Usage
```bash
docker exec ekyc_mongodb du -sh /data/db
```

---

## 🚀 Advanced Topics

### Create Index
```javascript
db.users.createIndex({ email: 1 })
```

### Export Data
```bash
docker compose exec mongodb mongodump -u root -p password123 -d ekyc_db -o /tmp/dump
docker cp ekyc_mongodb:/tmp/dump ./backup
```

### Import Data
```bash
docker cp ./backup ekyc_mongodb:/tmp/dump
docker compose exec mongodb mongorestore -u root -p password123 /tmp/dump
```

### Aggregate Pipeline
```javascript
db.users.aggregate([
  { $match: { status: 'active' } },
  { $group: { _id: null, count: { $sum: 1 } } }
])
```

---

## ✅ Verification Steps

After connecting, verify with these queries:

```javascript
// 1. Check database
db.getName()
// Output: ekyc_db

// 2. List collections
show collections
// Output: lists all collections

// 3. Count users (if exists)
db.users.countDocuments()
// Output: number of documents

// 4. Get database stats
db.stats()
// Output: database statistics
```

---

## 🎯 Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| Connection refused | Ensure Docker containers are running: `docker compose ps` |
| Authentication failed | Check username/password in connection string |
| Port already in use | Stop conflicting service: `docker compose down` |
| Slow queries | Create indexes: `db.collection.createIndex({field: 1})` |
| Out of disk space | Check volume size: `docker volume ls` |

---

## 📚 Resources

- [MongoDB Documentation](https://docs.mongodb.com/)
- [PyMongo Documentation](https://pymongo.readthedocs.io/)
- [MongoDB Compass](https://www.mongodb.com/products/compass)
- [MongoDB Shell](https://www.mongodb.com/try/download/shell)

---

**Last Updated**: December 2, 2025
