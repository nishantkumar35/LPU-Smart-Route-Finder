import { useState, useEffect, useCallback } from 'react';
import { Navigation, Activity, Database, ChevronLeft, ChevronRight } from 'lucide-react';
import Header from '../components/Layout/Header';
import CommandPalette from '../components/Layout/CommandPalette';
import CampusMap from '../components/Map/CampusMap';
import RoutePanel from '../components/Workspace/RoutePanel';
import AnalyticsPanel from '../components/Workspace/AnalyticsPanel';
import DataStudioPanel from '../components/Workspace/DataStudioPanel';
import Tabs from '../components/ui/Tabs';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import toast from 'react-hot-toast';

export default function WorkspacePage() {
  const { isAdmin } = useAuth();

  // Graph Data
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [loading, setLoading] = useState(true);

  // Active Tab: 'route' | 'analytics' | 'datastudio'
  const [activeTab, setActiveTab] = useState('route');

  // Sidebar toggle
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Selected origin & destination IDs
  const [selectedSource, setSelectedSource] = useState('');
  const [selectedDest, setSelectedDest] = useState('');

  // Active calculated route path
  const [path, setPath] = useState([]);

  // Command Palette
  const [cmdOpen, setCmdOpen] = useState(false);

  // Load Graph Data
  const loadGraph = useCallback(async () => {
    try {
      const [n, e] = await Promise.all([api.get('/nodes'), api.get('/edges')]);
      setNodes(n.data);
      setEdges(e.data);
    } catch {
      toast.error('Failed to load campus graph data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadGraph();
  }, [loadGraph]);

  // Command Palette Keyboard Shortcut (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCmdOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Handle map or command palette node selection
  const handleSelectNode = (node) => {
    setPath([]);
    if (!selectedSource || (selectedSource && selectedDest)) {
      setSelectedSource(node._id);
      setSelectedDest('');
      setActiveTab('route');
      toast.success(`Set ${node.name} as Origin`);
    } else {
      setSelectedDest(node._id);
      setActiveTab('route');
      toast.success(`Set ${node.name} as Destination`);
    }
  };

  const mainTabs = [
    { id: 'route',      label: 'Route Finder', icon: Navigation },
    { id: 'analytics',  label: 'Analytics',    icon: Activity },
    ...(isAdmin ? [{ id: 'datastudio', label: 'Data Studio', icon: Database }] : []),
  ];

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-dark-950 text-slate-100 font-sans">
      {/* Top Header */}
      <Header onOpenSearch={() => setCmdOpen(true)} />

      {/* Main Workspace Layout */}
      <div className="flex-1 flex relative overflow-hidden">
        {/* Collapsible Sidebar Controls */}
        <aside
          className={`relative z-10 flex flex-col bg-dark-900 border-r border-dark-700/80 transition-all duration-200 ease-in-out ${
            sidebarOpen ? 'w-full sm:w-[360px]' : 'w-0'
          }`}
        >
          {sidebarOpen && (
            <div className="flex-1 flex flex-col overflow-hidden p-4 space-y-4">
              {/* Primary Navigation Tabs */}
              <Tabs
                tabs={mainTabs}
                activeTab={activeTab}
                onChange={setActiveTab}
              />

              {/* Tab Panel Content */}
              <div className="flex-1 overflow-y-auto pr-0.5">
                {loading ? (
                  <div className="flex flex-col items-center justify-center py-20 gap-3">
                    <div className="w-6 h-6 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
                    <span className="text-xs text-slate-600">Loading campus data...</span>
                  </div>
                ) : (
                  <>
                    {activeTab === 'route' && (
                      <RoutePanel
                        nodes={nodes}
                        selectedSource={selectedSource}
                        selectedDest={selectedDest}
                        onSelectSource={setSelectedSource}
                        onSelectDest={setSelectedDest}
                        onPathCalculated={setPath}
                      />
                    )}
                    {activeTab === 'analytics' && (
                      <AnalyticsPanel
                        nodes={nodes}
                        edges={edges}
                      />
                    )}
                    {activeTab === 'datastudio' && isAdmin && (
                      <DataStudioPanel
                        nodes={nodes}
                        edges={edges}
                        onRefresh={loadGraph}
                        isAdmin={isAdmin}
                      />
                    )}
                  </>
                )}
              </div>
            </div>
          )}

          {/* Toggle Sidebar Collapse Button */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="absolute -right-3 top-5 z-20 w-6 h-6 rounded-full bg-dark-800 border border-dark-600 flex items-center justify-center text-slate-500 hover:text-slate-200 hover:border-dark-500 shadow-panel transition-all duration-150"
            title={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
          >
            {sidebarOpen ? <ChevronLeft className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
          </button>
        </aside>

        {/* Map Canvas */}
        <main className="flex-1 relative h-full w-full overflow-hidden bg-dark-950">
          <CampusMap
            nodes={nodes}
            edges={edges}
            path={path}
            onSelectNode={handleSelectNode}
          />

          {/* Floating Map Instruction Pill */}
          <div className="absolute bottom-4 left-4 z-10 hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-xl bg-dark-900/90 border border-dark-700/80 backdrop-blur-sm text-[11px] text-slate-500 shadow-panel select-none">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse" />
            <span>Click any map node to set origin or destination</span>
          </div>
        </main>
      </div>

      {/* Command Palette */}
      <CommandPalette
        isOpen={cmdOpen}
        onClose={() => setCmdOpen(false)}
        nodes={nodes}
        onSelectNode={handleSelectNode}
      />
    </div>
  );
}
