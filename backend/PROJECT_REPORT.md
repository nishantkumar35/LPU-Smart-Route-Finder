# 📘 Smart Route Finder — Complete Project Report
### *Written for someone who is completely new to software development*

---

> **How to use this report:** Read it top to bottom. Every section builds on the previous one.  
> Imagine you are explaining this to a friend who has never written a single line of code.

---

## 📌 Table of Contents

1. What is this project?
2. Real-world analogy
3. What does the app actually do?
4. User Flow — Step by Step
5. Tech Stack — What tools we used and WHY
6. How the Internet works (briefly)
7. What is a Backend?
8. Project Folder Structure — Every file explained
9. Database — How data is stored
10. API Endpoints — The doors to the backend
11. Authentication — How login/security works
12. The Algorithms — How the shortest path is found
13. How everything connects together
14. How to run the project
15. Glossary — Tech words explained

---

## 1. What is this project?

**Smart Route Finder using Graph Algorithms** is a web application that:

- Shows a **map of a campus** (like a college campus or a city)
- Lets you **pick two locations** (e.g., "Library" and "Sports Complex")
- Automatically **finds the shortest route** between them
- **Visually shows you step-by-step** how the computer calculated that route

Think of it like Google Maps — but instead of just showing you the final route, it also **shows you the thinking process** the algorithm used to find it.

This makes it perfect for:
- **Students** who want to learn how routing algorithms work
- **Campus visitors** who want to navigate
- **Teachers** who want to demonstrate computer science concepts visually

---

## 2. Real-world Analogy

Imagine you are standing in the middle of a city and want to go from **Point A** to **Point B**.

- Every **building** or **landmark** is a **Node** (a location)
- Every **road** between two buildings is an **Edge** (a connection)
- Every road has a **distance** (like 200 metres) — this is the **Weight**

```
[Library] ---200m--- [Canteen] ---150m--- [Hostel]
    |                                        |
   300m                                     100m
    |                                        |
[Main Gate] ----------450m---------- [Sports Complex]
```

To find the shortest path from **Library → Hostel**, the computer tries all possible paths:
- Library → Canteen → Hostel = 200 + 150 = **350m** ✅ Shorter!
- Library → Main Gate → Sports Complex → Hostel = 300 + 450 + 100 = **850m** ❌ Longer

The algorithm picks **350m** as the answer.

This network of nodes and edges is called a **Graph** — and that's why we use "Graph Algorithms."

---

## 3. What does the app actually do?

### For a Regular User (anyone visiting the site):
1. Opens the website and sees a **map** with all campus locations marked
2. Selects a **starting location** (e.g., Main Gate)
3. Selects an **ending location** (e.g., Library)
4. Chooses an **algorithm** (Dijkstra or A*)
5. Clicks **"Find Route"**
6. Watches an **animation** on the map showing the algorithm exploring paths
7. Sees the **final shortest path highlighted** in a different color
8. Gets a **summary**: total distance, estimated walking time, number of stops

### For an Admin (the person managing the campus map):
1. **Logs in** with a username and password
2. Can **add new locations** (nodes) by clicking on the map
3. Can **add roads** (edges) between two locations with a distance
4. Can **edit or delete** any location or road
5. All changes are **saved to the database** immediately

---

## 4. User Flow — Step by Step

### Regular User Flow

```
User opens the website
        │
        ▼
Website loads → Asks backend: "Give me all locations and roads"
        │
        ▼
Backend responds with all nodes and edges from MongoDB
        │
        ▼
Map renders with markers (nodes) and lines (edges)
        │
        ▼
User selects Source → Destination → Algorithm
        │
        ▼
User clicks "Find Route"
        │
        ▼
Frontend sends: POST /api/route
  { sourceId, destId, algorithm: "dijkstra" }
        │
        ▼
Backend loads graph from DB → Runs algorithm → Records every step
        │
        ▼
Backend responds:
  { path, distance, steps: [...animation data...] }
        │
        ▼
Frontend animates each step on the map
  (yellow = exploring, red = visited, green = final path)
        │
        ▼
Route summary panel shows: "350m | 5 min walk | 3 stops"
```

### Admin User Flow

```
Admin goes to /admin/login page
        │
        ▼
Enters username + password
        │
        ▼
Frontend sends: POST /api/auth/login
        │
        ▼
Backend checks password → Creates a JWT token (like a keycard)
        │
        ▼
Frontend stores the token in browser memory
        │
        ▼
Admin dashboard unlocks
        │
        ▼
Admin adds a new node → Frontend sends: POST /api/nodes
  (with token in header: Authorization: Bearer <token>)
        │
        ▼
Backend verifies token → Saves new node to MongoDB
        │
        ▼
Map updates with the new location
```

---

## 5. Tech Stack — What tools we used and WHY

Think of building this app like building a house. You need different tools for different parts.

| Tool | Role in our app | Real-world comparison |
|------|-----------------|-----------------------|
| **Node.js** | Runs JavaScript on the server | The engine of a car |
| **Express.js** | Organises our server code | The car's chassis/frame |
| **MongoDB** | Database that stores all data | A filing cabinet |
| **Mongoose** | Tool that talks to MongoDB cleanly | A filing assistant |
| **JWT** | Secure "key card" for admin login | Hotel room key card |
| **bcrypt** | Scrambles passwords so they can't be stolen | A safe for your password |
| **CORS** | Allows frontend to talk to our backend | Security guard at the door |
| **dotenv** | Loads secret settings from a file | A private notebook |
| **nodemon** | Auto-restarts server when you edit code | Auto-save in a game |

### Why Node.js?
Before Node.js, JavaScript only worked inside web browsers. Node.js allows JavaScript to run on a **server** — a computer that serves data. This means we can use ONE language (JavaScript) for both the frontend and backend.

### Why Express.js?
Without Express, you'd have to manually handle every tiny detail of incoming web requests. Express gives us clean **routes** and **middleware** to organise everything.

### Why MongoDB?
MongoDB stores data as **documents** (similar to JSON format — the same format JavaScript uses). Instead of strict rows and columns like Excel, MongoDB lets us store flexible, nested data.

### Why JWT for authentication?
JWT (JSON Web Token) is like a **stamp on your hand** at an event. Once verified at the entrance (login), you get a stamp. Every time you try to enter a restricted area (admin action), security checks your stamp — they don't need to check the entrance again.

---

## 6. How the Internet works (briefly)

When you type a website address and press Enter:

```
Your Browser (Chrome/Firefox)
        │
        │  "Hey server, give me the homepage!"   ← HTTP Request
        ▼
Web Server (our Express backend)
        │
        │  "Here's the data you asked for!"      ← HTTP Response
        ▼
Your Browser displays the result
```

Types of requests:
- **GET** — "Give me some data" (reading)
- **POST** — "Here's new data, save it" (creating)
- **PUT** — "Here's updated data" (editing)
- **DELETE** — "Remove this data" (deleting)

These are called **HTTP Methods**. Our API uses all four.

---

## 7. What is a Backend?

A **backend** is the hidden engine of a web application. Users never see it directly, but it does all the heavy lifting:

```
What users SEE (Frontend):        What runs BEHIND THE SCENES (Backend):
─────────────────────────         ────────────────────────────────────────
• The map on screen               • Stores all node/edge data in MongoDB
• The buttons they click          • Runs Dijkstra/A* algorithm
• The route animation             • Checks login credentials
• The summary panel               • Issues and verifies JWT tokens
```

Our backend is a **REST API** — a standard way of providing data to any frontend (web, mobile, or anything else).

---

## 8. Project Folder Structure — Every file explained

```
pep/backend/
│
├── server.js              ← THE MAIN FILE. Starts everything.
├── package.json           ← List of all tools/libraries the project needs
├── .env                   ← Secret settings (NEVER share this file)
├── seed.js                ← Script to fill the database with sample data
├── README.md              ← Instructions for other developers
│
├── config/
│   └── db.js              ← Connects our app to MongoDB
│
├── models/                ← BLUEPRINTS of what data looks like
│   ├── Node.js            ← Blueprint for a Location
│   ├── Edge.js            ← Blueprint for a Road
│   └── User.js            ← Blueprint for an Admin User
│
├── middleware/            ← CODE THAT RUNS BETWEEN request and response
│   └── authMiddleware.js  ← Checks if user has a valid login token
│
├── algorithms/            ← THE BRAIN — shortest path calculations
│   ├── dijkstra.js        ← Dijkstra's Algorithm
│   └── aStar.js           ← A* (A-Star) Algorithm
│
├── controllers/           ← LOGIC — what to do when a request arrives
│   ├── authController.js  ← Handles login and registration
│   ├── nodeController.js  ← Handles adding/editing/deleting locations
│   ├── edgeController.js  ← Handles adding/editing/deleting roads
│   └── routeController.js ← Handles "find the shortest path" requests
│
└── routes/                ← DIRECTIONS — which URL goes to which controller
    ├── authRoutes.js      ← /api/auth/login, /api/auth/register
    ├── nodeRoutes.js      ← /api/nodes
    ├── edgeRoutes.js      ← /api/edges
    └── routeRoutes.js     ← /api/route
```

### How a request travels through these folders:

```
1. Admin sends: POST /api/nodes  (add a new location)
        │
        ▼
2. server.js receives it → passes to routes/nodeRoutes.js
        │
        ▼
3. nodeRoutes.js sees it's a POST → runs authMiddleware.js first
        │
        ▼
4. authMiddleware.js verifies the JWT token → OK, continue
        │
        ▼
5. controllers/nodeController.js runs createNode()
        │
        ▼
6. createNode() uses models/Node.js to save data to MongoDB
        │
        ▼
7. MongoDB saves it → success response sent back
```

### server.js — The Main File

This is the **starting point** of the entire backend. When you run `npm run dev`, Node.js reads this file first. It:
1. **Loads settings** from `.env` file
2. **Sets up middleware** (CORS, JSON body parser)
3. **Registers all routes**
4. **Connects to MongoDB** and **starts listening** on port 5000

### .env — Secret Settings File

This file holds sensitive information that should **NEVER be committed to Git**:
- `MONGO_URI` — the address of your database
- `JWT_SECRET` — the key used to sign JWT tokens
- `PORT` — which port the server runs on

### package.json — The Dependency List

Lists every external library the project needs. Running `npm install` downloads all of them automatically.

---

## 9. Database — How data is stored

Our database is **MongoDB**. Unlike traditional databases (like Excel), MongoDB stores data as **documents** — similar to JavaScript objects.

### Node Collection (Locations)

```json
{
  "_id":       "64abc123",
  "name":      "Library",
  "type":      "library",
  "lat":       28.6152,
  "lng":       77.2105,
  "createdAt": "2024-01-15T10:30:00"
}
```

**What is lat/lng?**
Every point on Earth has a **latitude** (how far north/south) and **longitude** (how far east/west). These two numbers pinpoint an exact location on any map.

### Edge Collection (Roads)

```json
{
  "_id":      "64def456",
  "from":     "64abc123",
  "to":       "64xyz789",
  "weight":   200,
  "directed": false,
  "createdAt": "2024-01-15T10:35:00"
}
```

- `from` / `to` — IDs of the two connected locations
- `weight` — distance in metres
- `directed: false` = two-way road; `directed: true` = one-way only

### User Collection (Admins)

```json
{
  "_id":          "64uvw321",
  "username":     "admin",
  "passwordHash": "$2b$10$xyz...",
  "role":         "admin",
  "createdAt":    "2024-01-15T09:00:00"
}
```

> **Why is the password stored as `passwordHash`?**
> If someone hacks your database, you don't want them to see real passwords.
> **bcrypt** scrambles the password into an unreadable string. When logging in, bcrypt
> scrambles what you typed and checks if it matches — without ever knowing the original.

---

## 10. API Endpoints — The doors to the backend

An **API Endpoint** is a specific URL that does a specific job — like different counters at a bank.

### Auth Endpoints

| Method | URL | What it does | Who |
|--------|-----|-------------|-----|
| POST | `/api/auth/register` | Create admin account | Anyone |
| POST | `/api/auth/login` | Login, get JWT token | Anyone |

**Login request:**
```json
{ "username": "admin", "password": "admin123" }
```
**Login response:**
```json
{ "token": "eyJhbGci..." }
```

### Node Endpoints (Locations)

| Method | URL | What it does | Auth? |
|--------|-----|-------------|-------|
| GET | `/api/nodes` | Get all locations | No |
| POST | `/api/nodes` | Add a location | Yes (Admin) |
| PUT | `/api/nodes/:id` | Edit a location | Yes (Admin) |
| DELETE | `/api/nodes/:id` | Delete a location | Yes (Admin) |

### Edge Endpoints (Roads)

| Method | URL | What it does | Auth? |
|--------|-----|-------------|-------|
| GET | `/api/edges` | Get all roads | No |
| POST | `/api/edges` | Add a road | Yes (Admin) |
| PUT | `/api/edges/:id` | Edit a road | Yes (Admin) |
| DELETE | `/api/edges/:id` | Delete a road | Yes (Admin) |

### Route Endpoint (Shortest Path)

| Method | URL | What it does | Auth? |
|--------|-----|-------------|-------|
| POST | `/api/route` | Find shortest path | No |

**Request:**
```json
{
  "sourceId":  "64abc123",
  "destId":    "64xyz789",
  "algorithm": "dijkstra"
}
```

**Response:**
```json
{
  "reachable": true,
  "path": ["64abc123", "64def456", "64xyz789"],
  "distance": 350,
  "estimatedTimeMinutes": 5,
  "stops": 3,
  "steps": [
    { "type": "visit",      "nodeId": "64abc123" },
    { "type": "relax",      "from": "64abc123", "to": "64def456", "newDist": 200 },
    { "type": "final-path", "path": ["64abc123", "64def456", "64xyz789"] }
  ],
  "algorithm": "dijkstra"
}
```

---

## 11. Authentication — How login/security works

### The Problem:
Anyone can READ campus map data (see all nodes/edges) — this is public.
But only ADMINS can ADD, EDIT, or DELETE locations and roads.

How does the server know who is an admin?

### The Solution: JWT (JSON Web Token)

**Step 1 — Login:**
```
Admin sends: username + password
Backend checks password with bcrypt
If correct → creates JWT token → sends it back
```

**Step 2 — Using the token:**
```
Admin wants to add a node
Sends request WITH the token:
  Authorization: Bearer eyJhbGci...
Backend checks: "Is this token valid? Did WE create it?"
If YES → allow the action
If NO  → return 401 Unauthorized
```

**What a JWT looks like (3 parts separated by dots):**
```
eyJhbGciOiJIUzI1NiJ9  .  eyJ1c2VySWQiOiIxMjMifQ  .  SflKxwRJSMeKKF2QT4
     HEADER                     PAYLOAD                    SIGNATURE
 (algorithm used)        (who you are, expiry)       (proof it's genuine)
```

- **Signature** is created using our secret key — if anyone fakes a token, the signature won't match and it will be rejected

**Token expiry:** Our tokens expire after **7 days**. After that, the admin must log in again.

---

## 12. The Algorithms — How the shortest path is found

### Dijkstra's Algorithm

Named after Dutch computer scientist Edsger W. Dijkstra (invented in 1959).

**Core idea:** Always explore the closest unvisited node next.

**Step-by-step example:**
```
Campus: A-Gate --100m-- B-Canteen --150m-- C-Library
            |                                   |
           200m                               80m
            |                                   |
        D-Hostel ---------300m----------- E-Sports

Find: A-Gate → C-Library
```

| Step | Action | Distances known |
|------|--------|-----------------|
| Start | Visit A | A=0, B=∞, C=∞, D=∞, E=∞ |
| 1 | Explore A's roads | A=0, B=100, C=∞, D=200, E=∞ |
| 2 | Visit B (closest, 100m) | A=0, B=100, C=250, D=200, E=∞ |
| 3 | Visit D (closest, 200m) | A=0, B=100, C=250, D=200, E=500 |
| 4 | Visit C (closest, 250m) | **Done! C=250m** |

**Answer:** A → B → C = 250m  
**Dijkstra guarantees** the shortest path, but explores equally in all directions.

### A* (A-Star) Algorithm

**Same as Dijkstra, but smarter.** Uses a **heuristic** (smart guess) to explore towards the destination first.

**The heuristic:** Straight-line distance to destination (calculated using Haversine formula for GPS coordinates)

**Formula:** `f(n) = g(n) + h(n)`
- `g(n)` = actual distance travelled so far
- `h(n)` = estimated distance still to go (straight line)
- `f(n)` = total estimated cost — always explore the lowest `f` first

**Analogy:**
- **Dijkstra** = exploring every road equally, no sense of direction
- **A\*** = you have a compass pointing toward the destination — you explore roads going roughly the right way first

Both produce the **same correct answer**. A* is just faster on large graphs.

### Step Recording (How Animation Works)

Both algorithms record every action into a `steps[]` array:

```javascript
steps = [
  { "type": "visit",      "nodeId": "A" },              // Visiting node A
  { "type": "relax",      "from": "A", "to": "B", "newDist": 100 }, // Found B is 100m
  { "type": "visit",      "nodeId": "B" },              // Visiting B
  { "type": "final-path", "path": ["A", "B", "C"] }    // Answer found!
]
```

The frontend reads this array and:
- `"visit"` → colour that node **yellow** (being explored)
- `"relax"` → highlight that edge **orange** (being considered)
- `"final-path"` → draw the route in **green** (the answer)

This is exactly how the **step-by-step map animation** works.

---

## 13. How everything connects together

```
┌─────────────────────────────────────────────────┐
│                  FRONTEND                        │
│         (React app in user's browser)            │
│  Leaflet map, Route controls, Admin panel        │
└────────────────────┬────────────────────────────┘
                     │  HTTP Requests (Axios)
                     │  GET /api/nodes
                     │  POST /api/route  
                     │  POST /api/auth/login
                     ▼
┌─────────────────────────────────────────────────┐
│                  BACKEND                         │
│         Node.js + Express on port 5000           │
│                                                  │
│  server.js                                       │
│   ├─ /api/auth  → authRoutes → authController   │
│   ├─ /api/nodes → nodeRoutes → [auth?] → nodeCtrl│
│   ├─ /api/edges → edgeRoutes → [auth?] → edgeCtrl│
│   └─ /api/route → routeRoutes → routeController  │
│                           │                      │
│                    algorithms/                   │
│                dijkstra.js + aStar.js            │
└────────────────────┬────────────────────────────┘
                     │  Mongoose queries
                     ▼
┌─────────────────────────────────────────────────┐
│                  DATABASE                        │
│                  MongoDB                         │
│                                                  │
│  nodes collection   edges collection   users     │
│  [Library]          [Lib→Canteen:200]  [admin]   │
│  [Canteen]          [Canteen→Hostel]             │
│  [Hostel]           ...                          │
└─────────────────────────────────────────────────┘
```

---

## 14. How to run the project

### Step 1 — Install Node.js
Download from [nodejs.org](https://nodejs.org) — this also installs `npm`.

### Step 2 — Install MongoDB
Either install MongoDB locally OR create a free account at [MongoDB Atlas](https://www.mongodb.com/atlas) (cloud).

### Step 3 — Set up the project

```bash
# Go into the backend folder
cd pep/backend

# Install all required packages
npm install

# Edit .env and set your MongoDB address
# Change MONGO_URI= to your database address
```

### Step 4 — Seed the database

```bash
npm run seed
```

This creates:
- 12 campus locations (Library, Canteen, Hostel, etc.)
- 16 roads connecting them
- 1 admin user

**Default admin login:**
| Field | Value |
|-------|-------|
| Username | `admin` |
| Password | `admin123` |

### Step 5 — Start the server

```bash
npm run dev
```

You'll see:
```
✅ MongoDB connected: localhost
🚀 Server running on http://localhost:5000
```

### Step 6 — Test it works

Open browser → go to: `http://localhost:5000/api/health`

You should see: `{ "status": "ok", "message": "Smart Route Finder API is running" }`

---

## 15. Glossary — Tech words explained

| Term | Plain English explanation |
|------|--------------------------|
| **API** | A way for two programs to talk to each other. Like a waiter who takes your order to the kitchen. |
| **REST API** | A standard way to design APIs using HTTP methods (GET, POST, PUT, DELETE) |
| **Backend** | The server-side code users don't see — stores data, runs logic |
| **Frontend** | The part users see in their browser |
| **Database** | A structured place to store data permanently |
| **MongoDB** | A database that stores data as JSON-like documents (not rows/columns) |
| **Mongoose** | A helper library that makes working with MongoDB easier |
| **Node.js** | JavaScript running on a server (not just browsers) |
| **Express.js** | A framework that organises a Node.js server |
| **HTTP** | The language computers use to communicate over the internet |
| **GET/POST/PUT/DELETE** | Types of HTTP requests (read/create/update/delete) |
| **Endpoint** | A specific URL in an API that does a specific job |
| **Middleware** | Code that runs between receiving a request and sending a response |
| **JWT** | A secure token proving you're logged in — like a stamped ticket |
| **bcrypt** | A tool that encrypts passwords so they can't be stolen or read |
| **Token** | A long string acting as proof of login |
| **Authentication** | Proving you are who you say you are (login) |
| **Authorization** | Checking you have permission to do something |
| **Graph** | A mathematical structure with nodes (points) and edges (connections) |
| **Node (graph)** | A point/location in a graph (e.g., Library, Canteen) |
| **Edge (graph)** | A connection between two nodes (e.g., road between Library and Canteen) |
| **Weight** | A value on an edge — usually distance or time |
| **Dijkstra's Algorithm** | A method to find the shortest path in a weighted graph |
| **A* Algorithm** | A smarter Dijkstra that uses a heuristic to search faster |
| **Heuristic** | A smart guess that helps an algorithm make better decisions |
| **Haversine** | A formula to calculate straight-line distance between two GPS points |
| **Adjacency List** | A representation of a graph: each node lists its neighbours |
| **Seed** | Pre-filling a database with sample data for testing |
| **npm** | Node Package Manager — like an app store for Node.js libraries |
| **package.json** | A file listing all libraries your project depends on |
| **.env** | A file storing secret settings (never share or commit this) |
| **Port** | A numbered "door" on a server — port 5000 means "connect through door 5000" |
| **CORS** | Allows a frontend on one URL to access a backend on another URL |
| **JSON** | A text format for storing/sending structured data |
| **HTTP Status Codes** | Numbers telling you if a request succeeded: 200=OK, 201=Created, 400=Bad Request, 401=Unauthorized, 404=Not Found, 500=Server Error |
| **Schema** | A blueprint defining what shape data must be |
| **Model** | A Mongoose object that lets you interact with a MongoDB collection |
| **Controller** | A function handling what to do when a specific API endpoint is called |
| **Route** | The mapping between a URL + HTTP method and a controller function |
| **Populate** | In Mongoose, replacing an ID reference with the full document it points to |

---

## Summary — The Big Picture in One Paragraph

**Smart Route Finder** is a full-stack web application. The **frontend** (browser app) shows a campus map using Leaflet.js. When a user picks two locations and clicks "Find Route", the frontend sends an HTTP request to our **backend** — a Node.js/Express server running on port 5000. The backend loads all locations (nodes) and roads (edges) from our **MongoDB database**, then runs either **Dijkstra's** or **A\* algorithm** to find the shortest path. Both algorithms record every step they take into a `steps[]` array. The backend returns this data to the frontend, which **animates each step on the map** — showing exactly how the computer found the route. Admin users can **log in** using a username/password, and the backend issues them a **JWT token** (like a keycard). With this token, admins can add, edit, or delete locations and roads. Every admin action is verified by the **authMiddleware** before being allowed. The whole system follows the **MVC pattern**: Models define data, Controllers handle logic, and Routes direct traffic — making the code clean, organised, and easy to maintain.

---

*Smart Route Finder Backend — Project Report*
*Files: 20 | Language: JavaScript | Runtime: Node.js | Database: MongoDB*
