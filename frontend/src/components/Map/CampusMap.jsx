import { MapContainer, TileLayer, CircleMarker, Polyline, Popup, useMap } from 'react-leaflet';
import { useEffect, useMemo } from 'react';
import { TYPE_STYLES } from '../ui/Badge';
import 'leaflet/dist/leaflet.css';

function FitBounds({ nodes, path }) {
  const map = useMap();

  useEffect(() => {
    if (path && path.length > 1) {
      const pathNodes = path
        .map((id) => nodes.find((n) => String(n._id) === String(id)))
        .filter(Boolean);
      if (pathNodes.length > 0) {
        const bounds = pathNodes.map((n) => [n.lat, n.lng]);
        try {
          map.fitBounds(bounds, { padding: [70, 70], maxZoom: 18 });
        } catch {
          // Ignore Leaflet timing errors
        }
        return;
      }
    }
    if (nodes.length > 0) {
      const bounds = nodes.map((n) => [n.lat, n.lng]);
      try {
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 18 });
      } catch {
        // Ignore initialization timing
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nodes.length, path, map]);

  return null;
}

export default function CampusMap({ nodes = [], edges = [], path = [], onSelectNode }) {
  const pathStringArray = useMemo(() => (path || []).map((id) => String(id)), [path]);
  const pathSet = useMemo(() => new Set(pathStringArray), [pathStringArray]);

  const pathCoordinates = useMemo(() => {
    if (pathStringArray.length < 2) return [];
    return pathStringArray
      .map((id) => nodes.find((n) => String(n._id) === id))
      .filter(Boolean)
      .map((n) => [n.lat, n.lng]);
  }, [pathStringArray, nodes]);

  const edgeLines = useMemo(() => {
    return edges
      .map((edge) => {
        const fromId = String(edge.from?._id || edge.from);
        const toId   = String(edge.to?._id   || edge.to);
        const from   = nodes.find((n) => String(n._id) === fromId);
        const to     = nodes.find((n) => String(n._id) === toId);
        if (!from || !to) return null;

        const isUndirected = edge.directed !== true;
        const isOnPath =
          pathStringArray.length > 1 &&
          pathStringArray.some((_, i) => {
            if (i === pathStringArray.length - 1) return false;
            const a = pathStringArray[i];
            const b = pathStringArray[i + 1];
            return (
              (a === fromId && b === toId) ||
              (isUndirected && a === toId && b === fromId)
            );
          });

        return {
          key: `${fromId}-${toId}`,
          positions: [[from.lat, from.lng], [to.lat, to.lng]],
          isOnPath,
        };
      })
      .filter(Boolean);
  }, [edges, nodes, pathStringArray]);

  if (nodes.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-dark-950 text-slate-500 text-xs">
        No graph nodes loaded
      </div>
    );
  }

  const defaultCenter = [nodes[0].lat, nodes[0].lng];

  return (
    <MapContainer
      center={defaultCenter}
      zoom={16}
      className="w-full h-full"
      style={{ background: '#06080e' }}
      scrollWheelZoom={true}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap"
      />
      <FitBounds nodes={nodes} path={path} />

      {/* Draw default graph road edges */}
      {edgeLines.map((edge) => (
        <Polyline
          key={edge.key}
          positions={edge.positions}
          pathOptions={{
            color:     edge.isOnPath ? '#10b981' : 'rgba(51, 65, 85, 0.5)',
            weight:    edge.isOnPath ? 5 : 1.5,
            opacity:   edge.isOnPath ? 0.9 : 0.4,
            dashArray: edge.isOnPath ? undefined : '4,4',
          }}
        />
      ))}

      {/* Highlighted path direct polyline overlay */}
      {pathCoordinates.length > 1 && (
        <>
          {/* Outer Glowing Stroke */}
          <Polyline
            positions={pathCoordinates}
            pathOptions={{
              color: '#10b981',
              weight: 9,
              opacity: 0.35,
              lineCap: 'round',
              lineJoin: 'round',
            }}
          />
          {/* Inner Sharp Stroke */}
          <Polyline
            positions={pathCoordinates}
            pathOptions={{
              color: '#34d399',
              weight: 4.5,
              opacity: 1,
              lineCap: 'round',
              lineJoin: 'round',
            }}
          />
        </>
      )}

      {/* Draw campus location nodes */}
      {nodes.map((node) => {
        const nodeId   = String(node._id);
        const isOnPath = pathSet.has(nodeId);
        const isSource = pathStringArray.length > 0 && pathStringArray[0] === nodeId;
        const isDest   = pathStringArray.length > 0 && pathStringArray[pathStringArray.length - 1] === nodeId;
        const style    = TYPE_STYLES[node.type] || TYPE_STYLES.other;

        return (
          <CircleMarker
            key={node._id}
            center={[node.lat, node.lng]}
            radius={isSource || isDest ? 11 : isOnPath ? 8 : 5}
            pathOptions={{
              color:       isSource ? '#10b981' : isDest ? '#f43f5e' : isOnPath ? '#8b5cf6' : style.color,
              fillColor:   isSource ? '#10b981' : isDest ? '#f43f5e' : isOnPath ? '#7c3aed' : style.color,
              fillOpacity: isOnPath || isSource || isDest ? 1 : 0.75,
              weight:      isOnPath || isSource || isDest ? 3 : 1,
            }}
            eventHandlers={{
              click: () => {
                if (onSelectNode) onSelectNode(node);
              },
            }}
          >
            <Popup>
              <div className="space-y-1">
                <div className="font-semibold text-xs text-slate-100">{node.name}</div>
                <div className="text-[10px] text-slate-400 capitalize">{node.type}</div>
                {isSource && <div className="text-[10px] font-semibold text-emerald-400">📍 Route Origin</div>}
                {isDest   && <div className="text-[10px] font-semibold text-rose-400">🏁 Route Destination</div>}
                {isOnPath && !isSource && !isDest && (
                  <div className="text-[10px] font-semibold text-violet-400">🛣️ Intermediate Stop</div>
                )}
              </div>
            </Popup>
          </CircleMarker>
        );
      })}
    </MapContainer>
  );
}
