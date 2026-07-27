/**
 * Dijkstra's Shortest Path Algorithm
 *
 * @param {Array}  nodes    - Array of node docs: [{ _id, name, lat, lng }, ...]
 * @param {Array}  edges    - Array of edge docs: [{ from, to, weight, directed }, ...]
 * @param {string} sourceId - _id (string) of the source node
 * @param {string} destId   - _id (string) of the destination node
 *
 * @returns {{ path: string[], distance: number, steps: object[] }}
 *   path     — ordered array of node IDs from source to dest (empty if no path)
 *   distance — total weight of the shortest path (Infinity if no path)
 *   steps    — ordered log of algorithm events for frontend animation
 */
function dijkstra(nodes, edges, sourceId, destId) {
  // ── Build adjacency list ──────────────────────────────────────────────────
  const adj = {}; // adj[nodeId] = [{ to, weight }, ...]
  nodes.forEach((n) => {
    adj[n._id.toString()] = [];
  });

  edges.forEach((e) => {
    const from = e.from.toString();
    const to   = e.to.toString();
    adj[from].push({ to, weight: e.weight });
    if (!e.directed) {
      // Two-way road
      adj[to].push({ to: from, weight: e.weight });
    }
  });

  // ── Initialise distances ──────────────────────────────────────────────────
  const dist    = {};
  const prev    = {};
  const visited = new Set();
  const steps   = [];

  nodes.forEach((n) => {
    dist[n._id.toString()] = Infinity;
    prev[n._id.toString()] = null;
  });
  dist[sourceId] = 0;

  // Simple min-priority queue (array-based; good enough for ≤ a few hundred nodes)
  // Each entry: { nodeId, priority }
  const pq = [{ nodeId: sourceId, priority: 0 }];

  const pqPop = () => {
    let minIdx = 0;
    for (let i = 1; i < pq.length; i++) {
      if (pq[i].priority < pq[minIdx].priority) minIdx = i;
    }
    return pq.splice(minIdx, 1)[0];
  };

  // ── Main loop ─────────────────────────────────────────────────────────────
  while (pq.length > 0) {
    const { nodeId } = pqPop();

    if (visited.has(nodeId)) continue;
    visited.add(nodeId);

    // Record visit event
    steps.push({ type: 'visit', nodeId });

    if (nodeId === destId) break; // Found the destination

    for (const { to, weight } of (adj[nodeId] || [])) {
      if (visited.has(to)) continue;

      const newDist = dist[nodeId] + weight;

      // Record relax attempt
      steps.push({ type: 'relax', from: nodeId, to, newDist });

      if (newDist < dist[to]) {
        dist[to] = newDist;
        prev[to] = nodeId;
        pq.push({ nodeId: to, priority: newDist });
      }
    }
  }

  // ── Reconstruct path ──────────────────────────────────────────────────────
  if (dist[destId] === Infinity) {
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

  return { path, distance: dist[destId], steps };
}

module.exports = dijkstra;
