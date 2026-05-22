import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Server, Settings, BookOpen, MessageSquare, ShieldAlert } from 'lucide-react';
import Generator from './pages/Generator';
import Templates from './pages/Templates';
import Examples from './pages/Examples';

const NavLink = ({ to, icon: Icon, children }) => {
  const location = useLocation();
  const isActive = location.pathname === to || (to === '/' && location.pathname === '/');
  
  return (
    <Link 
      to={to} 
      className={`flex items-center gap-3 p-3 rounded-xl transition-all font-semibold text-sm ${
        isActive 
          ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/10 border-l-4 border-blue-400' 
          : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200 border-l-4 border-transparent'
      }`}
    >
      <Icon className="w-4 h-4" />
      {children}
    </Link>
  );
};

function AppContent() {
  const [health, setHealth] = useState('offline');

  useEffect(() => {
    const checkHealth = () => {
      fetch('http://localhost:8000/health')
        .then(res => res.json())
        .then(data => setHealth(data.ollama))
        .catch(() => setHealth('offline'));
    };
    checkHealth();
    const interval = setInterval(checkHealth, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex h-screen overflow-hidden text-slate-200" style={{ backgroundColor: '#090d16', fontFamily: 'system-ui, sans-serif' }}>
      
      {/* High-Tech Operational Sidebar Container */}
      <div className="w-72 bg-slate-950 flex flex-col z-10 border-r border-slate-900 shadow-2xl" style={{ backgroundColor: '#05070f' }}>
        
        {/* Core Header Identity branding */}
        <div className="p-6 flex items-center gap-3 border-b border-slate-900/60">
          <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-2.5 rounded-xl shadow-lg border border-blue-500/20">
            <ShieldAlert className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-md font-black tracking-wider text-white uppercase">DNIF Matrix-AI</h1>
            <p className="text-[10px] text-blue-500 font-bold uppercase tracking-widest mt-0.5">Automated Support Plane</p>
          </div>
        </div>
        
        {/* Nav list map section structural blocks */}
        <nav className="flex-1 p-4 space-y-1.5 mt-4">
          <NavLink to="/" icon={MessageSquare}>Core Generator Engine</NavLink>
          <NavLink to="/templates" icon={Settings}>Prompt Templates</NavLink>
          <NavLink to="/examples" icon={BookOpen}>Knowledge Base Records</NavLink>
        </nav>

        {/* Real-time status hardware engine monitoring matrix */}
        <div className="p-4 m-4 bg-slate-900/30 border border-slate-900/80 rounded-xl" style={{ backgroundColor: '#070a14' }}>
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${health === 'connected' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
              <Server className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest mb-0.5">Core Matrix State</p>
              <div className="flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${health === 'connected' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)] animate-pulse' : 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.6)]'}`}></span>
                <span className="text-xs font-bold tracking-wide capitalize text-slate-300">{health === 'connected' ? 'Engine Sync Active' : 'Engine Link Severed'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Primary viewport content context delivery */}
      <div className="flex-1 overflow-auto relative">
        <Routes>
          <Route path="/" element={<Generator />} />
          <Route path="/templates" element={<Templates />} />
          <Route path="/examples" element={<Examples />} />
        </Routes>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}