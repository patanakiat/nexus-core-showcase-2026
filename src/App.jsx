import React, { useState, useEffect } from 'react';
import { Terminal, Activity, Shield, Cpu, HardDrive, Globe, Zap, Github } from 'lucide-react';

const StatWidget = ({ label, value, progress, color }) => (
  <div className="glass p-5 rounded-2xl">
    <div className="flex justify-between text-xs mb-2">
      <span className="text-gray-400 uppercase tracking-wider">{label}</span>
      <span className="text-white font-mono">{value}</span>
    </div>
    <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
      <div 
        className={`h-full transition-all duration-1000 ease-out ${color}`} 
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  </div>
);

function App() {
  const [logs, setLogs] = useState([
    { type: 'cmd', text: 'nexus-core --init' },
    { type: 'info', text: 'Initializing neural bridge...' },
    { type: 'success', text: 'Bridge established at 440ms' }
  ]);
  const [metrics, setMetrics] = useState({ cpu: 24, ram: 42, net: 12 });

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics({
        cpu: Math.floor(Math.random() * (45 - 20) + 20),
        ram: Math.floor(Math.random() * (70 - 60) + 60),
        net: Math.floor(Math.random() * (30 - 5) + 5)
      });
      
      const newLogs = [
        '[info] Routing traffic via encrypted node-' + Math.floor(Math.random() * 999),
        '[warn] Minor latency spike in sector 7G',
        '[success] Data packet sync complete'
      ];
      setLogs(prev => [...prev.slice(-10), { type: 'info', text: newLogs[Math.floor(Math.random() * newLogs.length)] }]);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen p-4 md:p-8 relative">
      <div className="scanline"></div>
      
      <div className="fixed top-[-10%] left-[-10%] w-[50%] h-[50%] bg-cyan-500/10 blur-[120px] rounded-full -z-10"></div>
      <div className="fixed bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-500/10 blur-[120px] rounded-full -z-10"></div>

      <header className="max-w-7xl mx-auto mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tighter bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
            NEXUS_CORE
          </h1>
          <div className="flex items-center gap-2 mt-1">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            <p className="text-[10px] font-mono text-gray-500 uppercase tracking-[0.2em]">Operational // v2.4.0-Stable</p>
          </div>
        </div>
        
        <div className="flex gap-3">
          <div className="glass px-4 py-2 rounded-xl flex items-center gap-2 text-xs font-mono">
            <Zap size={14} className="text-yellow-400" />
            44ms
          </div>
          <div className="glass px-4 py-2 rounded-xl flex items-center gap-2 text-xs font-mono">
            <Github size={14} />
            v2.4.0
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-8 space-y-6">
          <div className="glass p-8 rounded-3xl relative overflow-hidden group">
            <div className="relative z-10">
              <h2 className="text-2xl font-semibold mb-2">System Status: Optimal</h2>
              <p className="text-gray-400 max-w-md text-sm leading-relaxed mb-6">
                Welcome to the Nexus Core management interface. All peripheral nodes are currently synchronized with the primary uplink.
              </p>
              <div className="flex gap-4">
                <button className="bg-cyan-500 hover:bg-cyan-400 text-black px-6 py-2.5 rounded-xl text-sm font-bold transition-all transform hover:scale-105">
                  Deploy Update
                </button>
                <button className="bg-white/5 hover:bg-white/10 border border-white/10 px-6 py-2.5 rounded-xl text-sm font-medium transition-all">
                  System Audit
                </button>
              </div>
            </div>
            <div className="absolute top-0 right-0 p-8 text-cyan-500/10 group-hover:text-cyan-500/20 transition-colors">
              <Activity size={120} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass p-6 rounded-2xl group hover:border-cyan-500/30 transition-all">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-400 mb-4">
                <Shield size={20} />
              </div>
              <h3 className="font-semibold mb-1 text-sm text-gray-200">Security Protocol</h3>
              <p className="text-xs text-gray-500 leading-relaxed">Layer 7 firewall active. No intrusions detected in the last 72 hours.</p>
            </div>
            <div className="glass p-6 rounded-2xl group hover:border-purple-500/30 transition-all">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400 mb-4">
                <Globe size={20} />
              </div>
              <h3 className="font-semibold mb-1 text-sm text-gray-200">Global CDN</h3>
              <p className="text-xs text-gray-500 leading-relaxed">Static assets cached across 14 edge locations. Global latency avg: 18ms.</p>
            </div>
          </div>

          {/* Terminal */}
          <div className="bg-black/40 rounded-2xl border border-white/5 overflow-hidden font-mono shadow-2xl">
            <div className="bg-white/5 px-4 py-2 border-b border-white/5 flex items-center justify-between">
              <div className="flex gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/40"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/40"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/40"></div>
              </div>
              <span className="text-[10px] text-gray-500 uppercase tracking-widest flex items-center gap-2">
                <Terminal size={12} /> nexus-cli
              </span>
            </div>
            <div className="p-6 text-xs space-y-2 h-48 overflow-y-auto scrollbar-hide">
              {logs.map((log, i) => (
                <div key={i} className="flex gap-3">
                  <span className="text-gray-600">[{new Date().toLocaleTimeString([], { hour12: false })}]</span>
                  <span className={
                    log.type === 'cmd' ? 'text-cyan-400' : 
                    log.type === 'success' ? 'text-green-400' : 
                    log.type === 'warn' ? 'text-yellow-400' : 'text-gray-300'
                  }>
                    {log.type === 'cmd' && '$ '}{log.text}
                  </span>
                </div>
              ))}
              <div className="flex gap-2 animate-pulse">
                <span className="text-gray-600">[{new Date().toLocaleTimeString([], { hour12: false })}]</span>
                <span className="text-white">_</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-4 space-y-6">
          <div className="glass p-6 rounded-3xl">
            <h3 className="text-sm font-semibold mb-6 flex items-center justify-between">
              System Telemetry
              <span className="px-2 py-0.5 bg-cyan-500/10 text-cyan-400 text-[10px] rounded uppercase">Live</span>
            </h3>
            <div className="space-y-6">
              <StatWidget label="CPU Load" value={`${metrics.cpu}%`} progress={metrics.cpu} color="bg-cyan-500" />
              <StatWidget label="Memory Usage" value={`${metrics.ram}%`} progress={metrics.ram} color="bg-purple-500" />
              <StatWidget label="Uplink Speed" value={`${metrics.net} GB/s`} progress={metrics.net * 2} color="bg-green-500" />
            </div>
          </div>

          <div className="glass p-6 rounded-3xl">
            <h3 className="text-sm font-semibold mb-4">Core Infrastructure</h3>
            <div className="space-y-4">
              {[
                { name: 'Primary DB', status: 'Online', icon: <HardDrive size={16}/>, color: 'text-green-500' },
                { name: 'Auth Service', status: 'Online', icon: <Shield size={16}/>, color: 'text-green-500' },
                { name: 'Legacy Node', status: 'Standby', icon: <Cpu size={16}/>, color: 'text-yellow-500' },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                  <div className="flex items-center gap-3">
                    <div className="text-gray-400">{item.icon}</div>
                    <span className="text-xs font-medium">{item.name}</span>
                  </div>
                  <span className={`text-[10px] uppercase font-bold ${item.color}`}>{item.status}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="glass p-6 rounded-3xl bg-gradient-to-br from-cyan-500/10 to-purple-500/10 border-cyan-500/20">
            <h3 className="text-xs font-bold uppercase tracking-widest text-cyan-400 mb-2">Neural Link</h3>
            <p className="text-[11px] text-gray-400 leading-relaxed">
              Your session is secured via quantum-resistant encryption. 
            </p>
          </div>
        </div>
      </main>

      <footer className="max-w-7xl mx-auto mt-12 py-8 border-t border-white/5 flex justify-between items-center text-[10px] font-mono text-gray-600">
        <span>© 2026 INTERACTION_CO_CA</span>
        <span className="hidden md:block text-gray-700">COORD: 37.7749° N, 122.4194° W</span>
        <span className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500/40"></span>
          ENCRYPTED_CONNECTION
        </span>
      </footer>
    </div>
  );
}

export default App;
