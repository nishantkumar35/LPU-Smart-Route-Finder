# Smart Route Finder — Backend

Node.js / Express / MongoDB REST API for the Smart Route Finder application.

---

## Prerequisites

- **Node.js** v18+
- **MongoDB** — local instance _or_ a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster

---

## Setup

### 1. Install dependencies

```bash
cd pep/backend
npm install
```

### 2. Configure environment variables

Copy `.env` and fill in your values:

```bash
# MongoDB connection string
MONGO_URI=mongodb://localhost:27017/smart-route-finder

# Secret key for signing JWTs — use a long random string in production
JWT_SECRET=your_super_secret_key_here

# Port (default 5000)
PORT=5000
```

> **MongoDB Atlas**: replace `MONGO_URI` with your Atlas connection string, e.g.  
> `mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/smart-route-finder?retryWrites=true&w=majority`

### 3. Seed sample data

Populates the DB with 12 campus locations, 16 roads, and a default admin account.

```bash
npm run seed
# or: node seed.js
```

**Default admin credentials** (change in production!):
| Field    | Value      |
|----------|------------|
| username | `admin`    |
| password | `admin123` |

### 4. Start the development server

```bash
npm run dev      # uses nodemon (auto-restart on file changes)
# or
npm start        # plain node
```

Server starts on **http://localhost:5000**

---

## API Reference

### Health Check

```
GET /api/health
```

### Auth

| Method | Endpoint               | Auth | Body                         |
|--------|------------------------|------|------------------------------|
| POST   | `/api/auth/register`   | —    | `{ username, password }`     |
| POST   | `/api/auth/login`      | —    | `{ username, password }` → `{ token }` |

### Nodes (Locations)

| Method | Endpoint          | Auth  | Body / Params                        |
|--------|-------------------|-------|--------------------------------------|
| GET    | `/api/nodes`      | —     | —                                    |
| POST   | `/api/nodes`      | Admin | `{ name, type, lat, lng }`           |
| PUT    | `/api/nodes/:id`  | Admin | `{ name, type, lat, lng }`           |
| DELETE | `/api/nodes/:id`  | Admin | —  (also deletes connected edges)    |

### Edges (Roads)

| Method | Endpoint          | Auth  | Body                                    |
|--------|-------------------|-------|-----------------------------------------|
| GET    | `/api/edges`      | —     | —                                       |
| POST   | `/api/edges`      | Admin | `{ from, to, weight, directed? }`       |
| PUT    | `/api/edges/:id`  | Admin | `{ from, to, weight, directed? }`       |
| DELETE | `/api/edges/:id`  | Admin | —                                       |

### Route Finding

```
POST /api/route
Content-Type: application/json

{
  "sourceId":  "<node _id>",
  "destId":    "<node _id>",
  "algorithm": "dijkstra"    // or "astar"
}
```

**Response:**
```json
{
  "reachable": true,
  "path": ["<id1>", "<id2>", "..."],
  "distance": 412,
  "estimatedTimeMinutes": 6,
  "stops": 4,
  "steps": [
    { "type": "visit",      "nodeId": "<id>" },
    { "type": "relax",      "from": "<id>", "to": "<id>", "newDist": 120 },
    { "type": "final-path", "path": ["<id1>", "<id2>", "..."] }
  ],
  "algorithm": "dijkstra"
}
```

---

## Authentication

Admin endpoints require a Bearer token in the `Authorization` header:

```
Authorization: Bearer <token>
```

---

## Folder Structure

```
backend/
├── algorithms/
│   ├── dijkstra.js       # Dijkstra's shortest path with step recording
│   └── aStar.js          # A* search with haversine heuristic
├── config/
│   └── db.js             # Mongoose connection helper
├── controllers/
│   ├── authController.js
│   ├── nodeController.js
│   ├── edgeController.js
│   └── routeController.js
├── middleware/
│   └── authMiddleware.js  # JWT verification
├── models/
│   ├── Node.js
│   ├── Edge.js
│   └── User.js
├── routes/
│   ├── authRoutes.js
│   ├── nodeRoutes.js
│   ├── edgeRoutes.js
│   └── routeRoutes.js
├── seed.js               # Sample data seeder
├── server.js             # Express entry point
├── package.json
└── .env                  # Environment variables (not committed)
```

---

## Node Types

`academic` | `hostel` | `canteen` | `gate` | `sports` | `admin` | `library` | `other`

## Algorithm Details

| Algorithm | Heuristic        | Best for                       |
|-----------|-----------------|--------------------------------|
| Dijkstra  | None            | Guaranteed shortest path        |
| A\*       | Haversine dist  | Faster on large graphs          |

Both algorithms return a `steps[]` array of events the frontend uses to animate the path-finding process.
