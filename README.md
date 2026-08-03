```
  _____                      _   
 / ____|                    | |  
| (___  _ __ ___   __ _ _ __| |_ 
 \___ \| '_ ` _ \ / _` | '__| __|
 ____) | | | | | | (_| | |  | |_ 
|_____/|_| |_| |_|\__,_|_|   \__|

 ____             _         _____ _           _           
|  _ \ ___  _   _| |_ ___  |  ___(_)_ __   __| | ___ _ __ 
| |_) / _ \| | | | __/ _ \ | |_  | | '_ \ / _` |/ _ \ '__|
|  _ < (_) | |_| | ||  __/ |  _| | | | | | (_| |  __/ |   
|_| \_\___/ \__,_|\__\___| |_|   |_|_| |_|\__,_|\___|_|   
```

> *Because Google Maps doesn't show you the thinking.*

---

## What it does

Pick any two locations on a campus map. Watch the algorithm **think** in real time — exploring paths, hitting dead ends, backtracking — then see the shortest route light up in green.

It's a navigation tool and a live demonstration of how computers solve graph problems. Great for learning, great for getting around.

---

## Features

- 🗺️ **Interactive campus map** with all locations and roads
- ⚡ **Two algorithms** — Dijkstra and A* — watch them behave differently
- 🎬 **Step-by-step animation** showing exactly how the path was found
- 📏 **Route summary** — distance, estimated walk time, number of stops
- 🔐 **Admin panel** — add, edit, or delete locations and roads via JWT-secured login

---

## Tech stack

| Layer      | Tech                  |
|------------|-----------------------|
| Runtime    | Node.js               |
| Framework  | Express.js            |
| Database   | MongoDB + Mongoose    |
| Auth       | JWT + bcrypt          |
| Algorithms | Dijkstra & A*         |

---

## Getting started

**Prerequisites:** Node.js and a MongoDB instance (local or [Atlas](https://www.mongodb.com/atlas))

```bash
# 1. Enter the project folder
cd pep/backend

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env
# Edit .env and set your MONGO_URI, JWT_SECRET, and PORT

# 4. Seed sample data
npm run seed
# → Creates 12 locations, 16 roads, and 1 admin account

# 5. Start the server
npm run dev
```

Verify it's running:
```
GET http://localhost:5000/api/health
→ { "status": "ok", "message": "Smart Route Finder API is running" }
```

---

## How the algorithms work

### Dijkstra
Fans out in every direction equally — like ripples in a pond. Guaranteed to find the shortest path. Explores more nodes than necessary, but never wrong.

### A* (A-Star)
Same foundation as Dijkstra, but uses straight-line distance as a compass. Explores toward the destination first. Faster on large maps, identical result.

Both algorithms record every step they take. The frontend replays those steps as an animation — yellow for exploring, orange for edges being evaluated, green for the final path.

---

## API reference

### Public endpoints
```
GET  /api/nodes            All campus locations
GET  /api/edges            All roads between locations
POST /api/route            Find shortest path between two nodes
```

### Auth
```
POST /api/auth/register    Create admin account
POST /api/auth/login       Login → returns JWT token
```

### Admin endpoints *(require Authorization: Bearer <token>)*
```
POST   /api/nodes          Add a location
PUT    /api/nodes/:id      Update a location
DELETE /api/nodes/:id      Remove a location

POST   /api/edges          Add a road
PUT    /api/edges/:id      Update a road
DELETE /api/edges/:id      Remove a road
```

#### Example: find a route
```json
POST /api/route
{
  "sourceId":  "64abc123",
  "destId":    "64xyz789",
  "algorithm": "dijkstra"
}
```
```json
{
  "reachable": true,
  "path": ["64abc123", "64def456", "64xyz789"],
  "distance": 350,
  "estimatedTimeMinutes": 5,
  "stops": 3,
  "algorithm": "dijkstra"
}
```

---

## Default admin credentials

```
Username: admin
Password: admin123
```

> ⚠️ Change these before deploying anywhere public.

---

## Project structure

```
pep/backend/
├── server.js              Entry point
├── seed.js                Populates the database with sample data
├── .env                   Environment variables (never commit this)
├── config/
│   └── db.js              MongoDB connection
├── models/
│   ├── Node.js            Location schema
│   ├── Edge.js            Road schema
│   └── User.js            Admin user schema
├── middleware/
│   └── authMiddleware.js  JWT verification
├── algorithms/
│   ├── dijkstra.js        Dijkstra's algorithm
│   └── aStar.js           A* algorithm
├── controllers/
│   ├── authController.js
│   ├── nodeController.js
│   ├── edgeController.js
│   └── routeController.js
└── routes/
    ├── authRoutes.js
    ├── nodeRoutes.js
    ├── edgeRoutes.js
    └── routeRoutes.js
```

---
