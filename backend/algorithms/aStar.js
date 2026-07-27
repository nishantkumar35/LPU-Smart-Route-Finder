/**
 * Haversine formula — straight-line distance in metres between two lat/lng points.
 * Used as the A* heuristic (admissible because road distance ≥ straight-line distance).
 */
function haversine(lat1, lng1, lat2, lng2) {
  const R = 6_371_000; // Earth radius in metres
  const toRad = (deg) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/**
 * A* Search Algorithm
 *
 * @param {Array}  nodes    - Array of node docs: [{ _id, name, lat, lng }, ...]
 * @param {Array}  edges    - Array of edge docs: [{ from, to, weight, directed }, ...]
 * @param {string} sourceId - _id (string) of the source node
 * @param {string} destId   - _id (string) of the destination node
 *
 * @returns {{ path: string[], distance: number, steps: object[] }}
 */
function aStar(nodes, edges, sourceId, destId) {
  // ── Build helpers ─────────────────────────────────────────────────────────
  const nodeMap = {}; // nodeId → { lat, lng }
  nodes.forEach((n) => {
    nodeMap[n._id.toString()] = { lat: n.lat, lng: n.lng };
  });

  const dest = nodeMap[destId];

  const h = (nodeId) => {
    const n = nodeMap[nodeId];
    if (!n || !dest) return 0;
    return haversine(n.lat, n.lng, dest.lat, dest.lng);
  };

  // ── Build adjacency list ──────────────────────────────────────────────────
  const adj = {};
  nodes.forEach((n) => {
    adj[n._id.toString()] = [];
  });

  edges.forEach((e) => {
    const from = e.from.toString();
    const to   = e.to.toString();
    adj[from].push({ to, weight: e.weight });
    if (!e.directed) {
      adj[to].push({ to: from, weight: e.weight });
    }
  });

  // ── Initialise ────────────────────────────────────────────────────────────
  const gScore = {}; // cost from source
  const fScore = {}; // gScore + heuristic
  const prev   = {};
  const visited = new Set();
  const steps  = [];

  nodes.forEach((n) => {
    const id = n._id.toString();
    gScore[id] = Infinity;
    fScore[id] = Infinity;
    prev[id]   = null;
  });

  gScore[sourceId] = 0;
  fScore[sourceId] = h(sourceId);

  // Open set as a simple array (same as Dijkstra's PQ but keyed on fScore)
  const openSet = [{ nodeId: sourceId, priority: fScore[sourceId] }];

  const pqPop = () => {
    let minIdx = 0;
    for (let i = 1; i < openSet.length; i++) {
      if (openSet[i].priority < openSet[minIdx].priority) minIdx = i;
    }
    return openSet.splice(minIdx, 1)[0];
  };

  // ── Main loop ─────────────────────────────────────────────────────────────
  while (openSet.length > 0) {
    const { nodeId } = pqPop();

    if (visited.has(nodeId)) continue;
    visited.add(nodeId);

    steps.push({ type: 'visit', nodeId });

    if (nodeId === destId) break;

    for (const { to, weight } of (adj[nodeId] || [])) {
      if (visited.has(to)) continue;

      const tentativeG = gScore[nodeId] + weight;

      steps.push({ type: 'relax', from: nodeId, to, newDist: tentativeG });

      if (tentativeG < gScore[to]) {
        gScore[to] = tentativeG;
        fScore[to] = tentativeG + h(to);
        prev[to]   = nodeId;
        openSet.push({ nodeId: to, priority: fScore[to] });
      }
    }
  }

  // ── Reconstruct path ──────────────────────────────────────────────────────
  if (gScore[destId] === Infinity) {
    steps.push({ type: 'no-path' });
    return { path: [], distance: Infinity, steps };
  }

  const path = [];
  let cur = destId;
  while (cur !== null) {
    path.unshift(cur);
    cur = prev[cur];
  }

  steps.push({ type: 'final-path', path });

  return { path, distance: gScore[destId], steps };
}

module.exports = aStar;
