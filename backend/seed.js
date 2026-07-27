/**
 * seed.js — Populates the database with detailed Lovely Professional University (LPU Jalandhar) campus nodes and edges.
 *
 * Run with:  node seed.js
 *
 * ⚠️ WARNING: Clears ALL existing nodes, edges, and users before seeding.
 */

require('dotenv').config();

const mongoose = require('mongoose');
const bcrypt   = require('bcrypt');

const connectDB = require('./config/db');
const Node      = require('./models/Node');
const Edge      = require('./models/Edge');
const User      = require('./models/User');

// ── Complete LPU Jalandhar Campus Nodes (62 Locations) ──────────────────────
const NODES = [
  // --- Gates ---
  { id: 'g1',   name: 'Main Gate (NH-44 Entrance)', type: 'gate', lat: 31.2530, lng: 75.7025 },
  { id: 'g2',   name: 'Gate 2 (Bus Terminal & Visitor Entrance)', type: 'gate', lat: 31.2535, lng: 75.7035 },
  { id: 'g3',   name: 'Gate 3 (Auditorium & East Gate)', type: 'gate', lat: 31.2542, lng: 75.7055 },
  { id: 'g4',   name: 'Gate 4 (Back Gate / Hostel Gate)', type: 'gate', lat: 31.2595, lng: 75.7015 },

  // --- Core Admin & Central Facilities ---
  { id: 'b1',   name: 'Block 1 (Main Admin / VC Office)', type: 'admin', lat: 31.2535, lng: 75.7028 },
  { id: 'hosp', name: 'Uni Hospital & Medical Centre', type: 'medical', lat: 31.2525, lng: 75.7020 },
  { id: 'mall', name: 'Uni Mall & Food Court', type: 'canteen', lat: 31.2540, lng: 75.7018 },
  { id: 'oat',  name: 'Open Air Theatre (OAT)', type: 'recreation', lat: 31.2545, lng: 75.7015 },
  { id: 'b13',  name: 'Block 13 (Division of Student Affairs - DSA)', type: 'admin', lat: 31.2545, lng: 75.7025 },
  { id: 'b14',  name: 'Block 14 (Central Library)', type: 'library', lat: 31.2548, lng: 75.7028 },
  { id: 'uni',  name: 'Baldev Raj Mittal Unipolis', type: 'recreation', lat: 31.2552, lng: 75.7032 },
  { id: 'aud',  name: 'Shanti Devi Mittal Auditorium (SDMA)', type: 'facility', lat: 31.2548, lng: 75.7055 },

  // --- Academic Blocks (1 to 14 Ring) ---
  { id: 'b2',   name: 'Block 2 (School of Law)', type: 'academic', lat: 31.2537, lng: 75.7030 },
  { id: 'b3',   name: 'Block 3 (Social Sciences & Humanities)', type: 'academic', lat: 31.2539, lng: 75.7032 },
  { id: 'b4',   name: 'Block 4 (Education & Physical Ed)', type: 'academic', lat: 31.2541, lng: 75.7034 },
  { id: 'b5',   name: 'Block 5 (School of Design)', type: 'academic', lat: 31.2543, lng: 75.7036 },
  { id: 'b6',   name: 'Block 6 (Fine Arts & Performing Arts)', type: 'academic', lat: 31.2544, lng: 75.7038 },
  { id: 'b7',   name: 'Block 7 (Applied Medical Sciences)', type: 'academic', lat: 31.2545, lng: 75.7040 },
  { id: 'b8',   name: 'Block 8 (School of Chemical Engineering)', type: 'academic', lat: 31.2546, lng: 75.7042 },
  { id: 'b9',   name: 'Block 9 (School of Physics)', type: 'academic', lat: 31.2547, lng: 75.7044 },
  { id: 'b10',  name: 'Block 10 (School of Chemistry)', type: 'academic', lat: 31.2548, lng: 75.7046 },
  { id: 'b11',  name: 'Block 11 (School of Mathematics)', type: 'academic', lat: 31.2549, lng: 75.7048 },
  { id: 'b12',  name: 'Block 12 (School of Commerce)', type: 'academic', lat: 31.2550, lng: 75.7050 },

  // --- Architecture & Engineering Cluster (20s) ---
  { id: 'b20',  name: 'Block 20 (Engineering Workshop)', type: 'academic', lat: 31.2555, lng: 75.7020 },
  { id: 'b25',  name: 'Block 25 (School of Architecture & Design)', type: 'academic', lat: 31.2558, lng: 75.7028 },
  { id: 'b26',  name: 'Block 26 (Department of Civil Engineering)', type: 'academic', lat: 31.2560, lng: 75.7032 },
  { id: 'b27',  name: 'Block 27 (Electronics & Electrical Eng - ECE/EEE)', type: 'academic', lat: 31.2562, lng: 75.7036 },
  { id: 'b28',  name: 'Block 28 (Department of Mechanical Engineering)', type: 'academic', lat: 31.2564, lng: 75.7040 },
  { id: 'b29',  name: 'Block 29 (Aerospace & Robotics Labs)', type: 'academic', lat: 31.2566, lng: 75.7044 },

  // --- Business, Agriculture, CSE & Management (30s) ---
  { id: 'b30',  name: 'Block 30 (School of Agriculture)', type: 'academic', lat: 31.2570, lng: 75.7028 },
  { id: 'b31',  name: 'Block 31 (School of Bioengineering & Biosciences)', type: 'academic', lat: 31.2568, lng: 75.7035 },
  { id: 'b32',  name: 'Block 32 (Mittal School of Business - MSB)', type: 'academic', lat: 31.2566, lng: 75.7040 },
  { id: 'b33',  name: 'Block 33 (School of Fashion Design)', type: 'academic', lat: 31.2568, lng: 75.7044 },
  { id: 'b34',  name: 'Block 34 (School of Computer Science & Engineering - CSE)', type: 'academic', lat: 31.2570, lng: 75.7048 },
  { id: 'b35',  name: 'Block 35 (Computer Applications & IT)', type: 'academic', lat: 31.2572, lng: 75.7052 },
  { id: 'b36',  name: 'Block 36 (Polytechnic College)', type: 'academic', lat: 31.2574, lng: 75.7055 },
  { id: 'b37',  name: 'Block 37 (Journalism & Film Production)', type: 'academic', lat: 31.2576, lng: 75.7058 },
  { id: 'b38',  name: 'Block 38 (School of Hotel Management & Tourism)', type: 'academic', lat: 31.2578, lng: 75.7061 },

  // --- Mega Blocks & Distance Ed (40s & 50s) ---
  { id: 'b41',  name: 'Block 41 (Centre for Distance & Online Education)', type: 'academic', lat: 31.2580, lng: 75.7063 },
  { id: 'b44',  name: 'Block 44 (School of Pharmaceutical Sciences)', type: 'academic', lat: 31.2582, lng: 75.7065 },
  { id: 'b55',  name: 'Block 55 (New CSE & AI Mega Block)', type: 'academic', lat: 31.2575, lng: 75.7050 },
  { id: 'b56',  name: 'Block 56 (Innovation & Research Hub)', type: 'academic', lat: 31.2577, lng: 75.7053 },
  { id: 'b57',  name: 'Block 57 (Center for Space Research)', type: 'academic', lat: 31.2580, lng: 75.7057 },
  { id: 'b58',  name: 'Block 58 (Allied Health Sciences)', type: 'academic', lat: 31.2583, lng: 75.7060 },

  // --- Boys Hostels (BH Complex) ---
  { id: 'bh1',  name: 'Boys Hostel 1 (BH-1)', type: 'hostel', lat: 31.2560, lng: 75.7010 },
  { id: 'bh2',  name: 'Boys Hostel 2 (BH-2)', type: 'hostel', lat: 31.2565, lng: 75.7012 },
  { id: 'bh3',  name: 'Boys Hostel 3 (BH-3)', type: 'hostel', lat: 31.2570, lng: 75.7014 },
  { id: 'bh4',  name: 'Boys Hostel 4 (BH-4)', type: 'hostel', lat: 31.2575, lng: 75.7016 },
  { id: 'bh5',  name: 'Boys Hostel 5 (BH-5)', type: 'hostel', lat: 31.2580, lng: 75.7018 },
  { id: 'bh6',  name: 'Boys Hostel 6 (BH-6)', type: 'hostel', lat: 31.2585, lng: 75.7020 },
  { id: 'bh7',  name: 'Boys Hostel 7 (BH-7)', type: 'hostel', lat: 31.2590, lng: 75.7022 },
  { id: 'bh8',  name: 'Boys Hostel 8 (BH-8)', type: 'hostel', lat: 31.2593, lng: 75.7024 },

  // --- Girls Hostels (GH Complex) ---
  { id: 'gh1',  name: 'Girls Hostel 1 (GH-1)', type: 'hostel', lat: 31.2570, lng: 75.7068 },
  { id: 'gh2',  name: 'Girls Hostel 2 (GH-2)', type: 'hostel', lat: 31.2575, lng: 75.7066 },
  { id: 'gh3',  name: 'Girls Hostel 3 (GH-3)', type: 'hostel', lat: 31.2578, lng: 75.7065 },
  { id: 'gh4',  name: 'Girls Hostel 4 (GH-4)', type: 'hostel', lat: 31.2582, lng: 75.7066 },
  { id: 'gh5',  name: 'Girls Hostel 5 (GH-5)', type: 'hostel', lat: 31.2585, lng: 75.7067 },
  { id: 'gh6',  name: 'Girls Hostel 6 (GH-6)', type: 'hostel', lat: 31.2588, lng: 75.7068 },

  // --- Sports & Recreation ---
  { id: 'isc',  name: 'Indoor Sports Complex (Shanti Devi Mittal ISC)', type: 'sports', lat: 31.2585, lng: 75.7035 },
  { id: 'pool', name: 'Olympic Size Swimming Pool', type: 'sports', lat: 31.2588, lng: 75.7038 },
  { id: 'ff',   name: 'Football Field & Athletics Track', type: 'sports', lat: 31.2590, lng: 75.7042 },
  { id: 'mcg',  name: 'Main Cricket Ground (MCG)', type: 'sports', lat: 31.2592, lng: 75.7050 },
];

// ── Default admin credentials ─────────────────────────────────────────────────
const ADMIN = { username: 'admin', password: 'admin123' };

// ── Helper: distance in metres between two lat/lng points (Haversine) ─────────
function dist(a, b) {
  const R = 6_371_000;
  const toRad = (d) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const x =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return Math.round(R * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x)));
}

async function seed() {
  await connectDB();

  console.log('🗑️ Clearing existing data…');
  await Promise.all([Node.deleteMany(), Edge.deleteMany(), User.deleteMany()]);

  // Strip temporary `id` property before inserting to DB
  const cleanNodes = NODES.map(({ id, ...rest }) => rest);

  console.log(`📍 Inserting ${cleanNodes.length} LPU campus nodes…`);
  const insertedNodes = await Node.insertMany(cleanNodes);

  // Map original custom `id` to inserted MongoDB `_id` and document
  const nodeMapById = {};
  NODES.forEach((n, idx) => {
    nodeMapById[n.id] = insertedNodes[idx];
  });

  // ── Define realistic road connections (Edges) ─────────────────────────────
  const EDGE_CONNECTIONS = [
    // Main Entrances & Front Admin Pathway
    ['g1', 'hosp'], ['g1', 'b1'], ['g1', 'g2'], ['g2', 'b2'], ['g2', 'g3'], ['g3', 'aud'],
    ['b1', 'b2'], ['b1', 'mall'], ['b1', 'b14'], ['b13', 'b14'], ['b13', 'mall'],
    ['b14', 'uni'], ['uni', 'b25'], ['mall', 'oat'], ['oat', 'b20'], ['b20', 'bh1'],

    // Block 1 - 14 Chain
    ['b2', 'b3'], ['b3', 'b4'], ['b4', 'b5'], ['b5', 'b6'], ['b6', 'b7'], ['b7', 'b8'], ['b8', 'b9'],
    ['b9', 'b10'], ['b10', 'b11'], ['b11', 'b12'], ['b12', 'b14'],

    // Architecture & Engineering Cluster (20s)
    ['b20', 'b25'], ['b25', 'b26'], ['b26', 'b27'], ['b27', 'b28'], ['b28', 'b29'], ['b29', 'b31'],

    // Business, Agriculture, CSE Cluster (30s)
    ['b30', 'b31'], ['b31', 'b32'], ['b32', 'b33'], ['b33', 'b34'], ['b34', 'b35'],
    ['b35', 'b36'], ['b36', 'b37'], ['b37', 'b38'], ['b34', 'aud'], ['aud', 'b38'],

    // New Mega & Distance Ed Blocks (40s, 50s)
    ['b38', 'b41'], ['b41', 'b44'], ['b44', 'b58'], ['b34', 'b55'], ['b55', 'b56'],
    ['b56', 'b57'], ['b57', 'b58'], ['b58', 'gh1'],

    // Boys Hostel Chain (BH-1 to BH-8) & Gate 4
    ['bh1', 'bh2'], ['bh2', 'bh3'], ['bh3', 'bh4'], ['bh4', 'bh5'], ['bh5', 'bh6'],
    ['bh6', 'bh7'], ['bh7', 'bh8'], ['bh8', 'g4'], ['b30', 'bh4'], ['bh5', 'isc'],

    // Girls Hostel Chain (GH-1 to GH-6)
    ['gh1', 'gh2'], ['gh2', 'gh3'], ['gh3', 'gh4'], ['gh4', 'gh5'], ['gh5', 'gh6'],
    ['gh6', 'mcg'], ['gh3', 'b41'],

    // Sports & Recreation Hub
    ['isc', 'pool'], ['pool', 'ff'], ['ff', 'mcg'], ['isc', 'g4'], ['mcg', 'g4'],
    ['b34', 'isc'], ['b55', 'ff'], ['uni', 'b27'], ['b27', 'b34']
  ];

  // Build edge documents
  const edgeDocs = [];
  const addedPairs = new Set();

  EDGE_CONNECTIONS.forEach(([fromId, toId]) => {
    const fromNode = nodeMapById[fromId];
    const toNode   = nodeMapById[toId];

    if (fromNode && toNode) {
      const pairKey = [fromNode._id.toString(), toNode._id.toString()].sort().join('-');
      if (!addedPairs.has(pairKey)) {
        addedPairs.add(pairKey);
        edgeDocs.push({
          from:     fromNode._id,
          to:       toNode._id,
          weight:   dist(fromNode, toNode),
          directed: false,
        });
      }
    }
  });

  console.log(`🛣️ Inserting ${edgeDocs.length} connected road edges…`);
  await Edge.insertMany(edgeDocs);

  // ── Create default admin user ───────────────────────────────────────────────
  console.log('👤 Creating admin user…');
  const passwordHash = await bcrypt.hash(ADMIN.password, 10);
  await User.create({ username: ADMIN.username, passwordHash, role: 'admin' });

  console.log('\n✅ LPU Full Campus Seed Complete!');
  console.log(`   Nodes  : ${insertedNodes.length}`);
  console.log(`   Edges  : ${edgeDocs.length}`);
  console.log(`   Admin  : username="${ADMIN.username}"  password="${ADMIN.password}"\n`);

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
