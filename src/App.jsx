import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Terminal, 
  Shield, 
  Activity, 
  Zap, 
  Lock, 
  Unlock, 
  Volume2, 
  VolumeX, 
  Cpu, 
  Database, 
  Globe, 
  AlertTriangle 
} from 'lucide-react';

const MatrixBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', resize);
    resize();

    const columns = Math.floor(canvas.width / 20);
    const drops = new Array(columns).fill(1);
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZﾊﾐﾋｰｳｼﾅﾓﾆｻﾜﾂｵﾘｱﾎﾃﾏｹﾒｴｶｷﾑﾕﾗｾﾈｽﾀﾇﾍ';

    const draw = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.fillStyle = '#0f0';
      ctx.font = '15px monospace';

      for (let i = 0; i < drops.length; i++) {
        const text = chars.charAt(Math.floor(Math.random() * chars.length));
        ctx.fillText(text, i * 20, drops[i] * 20);

        if (drops[i] * 20 > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
      animationFrameId = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 z-0 opacity-20 pointer-events-none" />;
};

const App = () => {
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [terminalLines, setTerminalLines] = useState([
    { text: 'NEXUS_CORE v4.0.2 INITIALIZED...', type: 'info' },
    { text: 'SECURE NEURAL LINK ESTABLISHED.', type: 'info' },
    { text: 'TYPE "help" TO SEE AVAILABLE COMMANDS.', type: 'system' }
  ]);
  const [input, setInput] = useState('');
  const [metrics, setMetrics] = useState({ cpu: 12, mem: 45, net: 8, threat: 2 });
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [decryptProgress, setDecryptProgress] = useState(0);
  const terminalEndRef = useRef(null);
  const audioCtx = useRef(null);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [terminalLines]);

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        cpu: Math.min(100, Math.max(5, prev.cpu + (Math.random() * 10 - 5))),
        mem: Math.min(100, Math.max(20, prev.mem + (Math.random() * 4 - 2))),
        net: Math.min(100, Math.max(1, prev.net + (Math.random() * 20 - 10))),
        threat: Math.max(0, Math.min(100, prev.threat + (Math.random() > 0.9 ? 1 : -0.5)))
      }));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const playSound = (freq, type = 'sine', duration = 0.1) => {
    if (!audioEnabled) return;
    if (!audioCtx.current) audioCtx.current = new (window.AudioContext || window.webkitAudioContext)();
    
    const osc = audioCtx.current.createOscillator();
    const gain = audioCtx.current.createGain();
    
    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioCtx.current.currentTime);
    gain.gain.setValueAtTime(0.1, audioCtx.current.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.current.currentTime + duration);
    
    osc.connect(gain);
    gain.connect(audioCtx.current.destination);
    
    osc.start();
    osc.stop(audioCtx.current.currentTime + duration);
  };

  const handleCommand = (e) => {
    if (e.key === 'Enter') {
      const cmd = input.toLowerCase().trim();
      const newLines = [...terminalLines, { text: `> ${input}`, type: 'user' }];
      playSound(440, 'square', 0.05);

      switch (cmd) {
        case 'help':
          newLines.push({ text: 'AVAILABLE COMMANDS: scan, decrypt, status, overload, clear, help', type: 'system' });
          break;
        case 'scan':
          newLines.push({ text: 'SCANNING NETWORK FOR VULNERABILITIES...', type: 'info' });
          setTimeout(() => setTerminalLines(prev => [...prev, { text: 'SCAN COMPLETE: 0 NEW THREATS DETECTED.', type: 'success' }]), 1000);
          break;
        case 'decrypt':
          if (!isDecrypting) startDecryption();
          newLines.push({ text: 'INITIALIZING DECRYPTION PROTOCOL...', type: 'warning' });
          break;
        case 'status':
          newLines.push({ text: `CPU: ${metrics.cpu.toFixed(1)}% | MEM: ${metrics.mem.toFixed(1)}% | THREAT: ${metrics.threat.toFixed(1)}%`, type: 'info' });
          break;
        case 'overload':
          playSound(110, 'sawtooth', 0.5);
          newLines.push({ text: 'CRITICAL ERROR: SYSTEM OVERLOAD INITIATED', type: 'error' });
          break;
        case 'clear':
          setTerminalLines([]);
          setInput('');
          return;
        default:
          newLines.push({ text: `COMMAND NOT FOUND: ${cmd}`, type: 'error' });
      }

      setTerminalLines(newLines);
      setInput('');
    }
  };

  const startDecryption = () => {
    setIsDecrypting(true);
    setDecryptProgress(0);
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 15;
      if (progress >= 100) {
        progress = 100;
        setIsDecrypting(false);
        setTerminalLines(prev => [...prev, { text: 'DECRYPTION SUCCESSFUL. CORE UNLOCKED.', type: 'success' }]);
        playSound(880, 'sine', 0.3);
        clearInterval(interval);
      }
      setDecryptProgress(progress);
      playSound(200 + progress * 5, 'sine', 0.05);
    }, 200);
  };

  return (
    <div className="min-h-screen bg-black text-emerald-500 font-mono relative overflow-hidden selection:bg-emerald-900 selection:text-emerald-200">
      <MatrixBackground />
      
      {/* HUD Scanline Effect */}
      <div className="fixed inset-0 pointer-events-none z-50 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] bg-[length:100%_4px,3px_100%] opacity-30"></div>
      
      {/* Header */}
      <header className="relative z-10 p-6 flex justify-between items-center border-b border-emerald-900/50 backdrop-blur-md bg-black/40">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-emerald-500/10 rounded border border-emerald-500/50 flex items-center justify-center animate-pulse">
            <Zap className="w-6 h-6 shadow-[0_0_15px_rgba(16,185,129,0.5)]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-[0.2em] text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]">NEXUS_CORE</h1>
            <p className="text-[10px] opacity-60 tracking-[0.3em]">SECURE SECTOR 7G // NODE_ID: 0x8842</p>
          </div>
        </div>
        
        <button 
          onClick={() => setAudioEnabled(!audioEnabled)}
          className={`p-3 rounded-full transition-all border ${audioEnabled ? 'border-emerald-500 bg-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.3)]' : 'border-emerald-900 bg-black/40'}`}
        >
          {audioEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
        </button>
      </header>

      <main className="relative z-10 p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-[1600px] mx-auto">
        
        {/* Left Column - Metrics */}
        <div className="lg:col-span-3 space-y-6">
          <MetricCard icon={<Cpu />} label="PROCESSOR LOAD" value={metrics.cpu} color="emerald" />
          <MetricCard icon={<Database />} label="MEMORY USAGE" value={metrics.mem} color="blue" />
          <MetricCard icon={<Globe />} label="BANDWIDTH" value={metrics.net} color="purple" />
          <div className={`p-4 rounded-xl border transition-all duration-500 ${metrics.threat > 10 ? 'border-red-500/50 bg-red-500/10 shadow-[0_0_20px_rgba(239,68,68,0.2)]' : 'border-emerald-900/50 bg-black/40'}`}>
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs tracking-widest flex items-center gap-2">
                <AlertTriangle size={14} className={metrics.threat > 10 ? 'animate-bounce' : ''} />
                THREAT_LEVEL
              </span>
              <span className={`text-xl font-bold ${metrics.threat > 10 ? 'text-red-500' : 'text-emerald-500'}`}>
                {metrics.threat.toFixed(1)}%
              </span>
            </div>
            <div className="h-1 bg-black/60 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-500 ${metrics.threat > 10 ? 'bg-red-500' : 'bg-emerald-500'}`} 
                style={{ width: `${metrics.threat}%` }}
              />
            </div>
          </div>
        </div>

        {/* Center Column - Terminal */}
        <div className="lg:col-span-6 flex flex-col h-[600px]">
          <div className="flex-1 bg-black/60 backdrop-blur-xl border border-emerald-500/30 rounded-t-2xl p-6 overflow-y-auto terminal-scrollbar relative">
             <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500/20 animate-scan"></div>
             <div className="space-y-1">
               {terminalLines.map((line, i) => (
                 <div key={i} className={`text-sm ${getTypeStyles(line.type)}`}>
                   {line.text}
                 </div>
               ))}
               <div ref={terminalEndRef} />
             </div>
          </div>
          <div className="bg-emerald-500/5 border-x border-b border-emerald-500/30 rounded-b-2xl p-4 flex items-center gap-3">
            <span className="text-emerald-400 font-bold tracking-tighter">root@nexus:~$</span>
            <input 
              autoFocus
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleCommand}
              className="bg-transparent border-none outline-none text-emerald-400 w-full caret-emerald-400"
            />
          </div>
        </div>

        {/* Right Column - Interactions */}
        <div className="lg:col-span-3 space-y-6">
          <div className="glass-panel p-6 rounded-2xl border border-emerald-500/20 bg-black/40 backdrop-blur-md relative overflow-hidden">
             <h3 className="text-sm font-bold mb-4 tracking-widest flex items-center gap-2">
               <Lock className="w-4 h-4" /> SECURE_STORAGE
             </h3>
             <div className="space-y-4">
                <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-lg group hover:border-emerald-500/40 transition-all cursor-pointer">
                   <p className="text-[10px] opacity-40 mb-1">FILE_ID: 0x22F</p>
                   <p className="text-xs">ENCRYPTED_LOGS.DAT</p>
                </div>
                <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-lg group hover:border-emerald-500/40 transition-all cursor-pointer">
                   <p className="text-[10px] opacity-40 mb-1">FILE_ID: 0x98A</p>
                   <p className="text-xs">CORE_CONFIG_v2.JSON</p>
                </div>
             </div>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-emerald-500/20 bg-black/40 backdrop-blur-md">
            <h3 className="text-sm font-bold mb-4 tracking-widest flex items-center gap-2">
              <Shield className="w-4 h-4" /> FIREWALL_BYPASS
            </h3>
            <div className="relative h-2 bg-emerald-900/30 rounded-full mb-4 overflow-hidden">
              <div 
                className="absolute top-0 left-0 h-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)] transition-all duration-300"
                style={{ width: `${decryptProgress}%` }}
              />
            </div>
            <button 
              disabled={isDecrypting}
              onClick={startDecryption}
              className={`w-full py-3 rounded-xl border flex items-center justify-center gap-2 transition-all ${isDecrypting ? 'opacity-50 cursor-not-allowed border-emerald-900' : 'border-emerald-500/50 hover:bg-emerald-500/10 active:scale-95'}`}
            >
              {isDecrypting ? (
                <span className="flex items-center gap-2 animate-pulse">
                  <Activity size={16} /> DECRYPTING... {Math.round(decryptProgress)}%
                </span>
              ) : (
                <>
                  <Unlock size={16} /> INITIALIZE_BYPASS
                </>
              )}
            </button>
          </div>
        </div>
      </main>

      <footer className="relative z-10 p-6 text-center opacity-30 text-[10px] tracking-[0.5em] mt-12">
        ESTABLISHED 2026 // INTERACTION CO CA // NEURAL LINK STABLE
      </footer>

      <style>{`
        .glass-panel {
          box-shadow: inset 0 0 20px rgba(16, 185, 129, 0.05);
        }
        .terminal-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .terminal-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.1);
        }
        .terminal-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(16, 185, 129, 0.2);
          border-radius: 10px;
        }
        @keyframes scan {
          0% { top: 0; opacity: 0; }
          50% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        .animate-scan {
          animation: scan 4s linear infinite;
        }
      `}</style>
    </div>
  );
};

const MetricCard = ({ icon, label, value, color }) => {
  const colors = {
    emerald: 'text-emerald-500 border-emerald-500/30 bg-emerald-500/5',
    blue: 'text-blue-500 border-blue-500/30 bg-blue-500/5',
    purple: 'text-purple-500 border-purple-500/30 bg-purple-500/5',
  };
  
  return (
    <div className={`p-4 rounded-xl border backdrop-blur-md ${colors[color]}`}>
      <div className="flex items-center gap-3 mb-3">
        {React.cloneElement(icon, { size: 16, className: 'opacity-70' })}
        <span className="text-[10px] tracking-widest font-bold opacity-60 uppercase">{label}</span>
      </div>
      <div className="flex items-end justify-between">
        <span className="text-2xl font-bold tracking-tighter tabular-nums">{value.toFixed(1)}%</span>
        <div className="flex gap-1 h-8 items-end pb-1">
          {[...Array(5)].map((_, i) => (
            <div 
              key={i} 
              className={`w-1 rounded-sm transition-all duration-300 ${i/5 * 100 < value ? (color === 'emerald' ? 'bg-emerald-500' : color === 'blue' ? 'bg-blue-500' : 'bg-purple-500') : 'bg-white/5'}`}
              style={{ height: `${20 + Math.random() * 80}%` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const getTypeStyles = (type) => {
  switch (type) {
    case 'user': return 'text-emerald-300 font-bold';
    case 'info': return 'text-blue-400';
    case 'system': return 'text-emerald-500 italic opacity-80';
    case 'success': return 'text-emerald-400 font-bold brightness-125';
    case 'warning': return 'text-yellow-500';
    case 'error': return 'text-red-500 animate-pulse';
    default: return 'text-emerald-500';
  }
};

export default App;
