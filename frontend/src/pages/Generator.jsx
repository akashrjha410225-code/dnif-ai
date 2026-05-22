import React, { useState } from 'react';
import { Send, Copy, CheckCircle2, Loader2, Sparkles, AlertCircle, Shield, Terminal, Clock } from 'lucide-react';

export default function Generator() {
  const [ticket, setTicket] = useState({
    ticket_type: 'Service Request',
    priority: 'P3 - Medium',
    customer_name: '',
    title: '',
    description: ''
  });
  
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(null);

  const handleGenerate = async () => {
    setIsLoading(true);
    setResponse('');
    setError(null);
    setCopied(false);
    
    try {
      const res = await fetch('http://localhost:8000/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ticket)
      });
      
      if (!res.ok) throw new Error("Connection failed. Check your Python terminal backend status.");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        setResponse((prev) => prev + decoder.decode(value));
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(response);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-8 w-full min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans" style={{ backgroundColor: '#090d16' }}>
      
      {/* Fixed Header Label */}
      <div className="mb-8 bg-slate-900/40 p-6 rounded-2xl border border-slate-800/80 backdrop-blur-md flex justify-between items-center shadow-xl">
        <div>
          <div className="flex items-center gap-2 text-blue-400 font-bold text-xs uppercase tracking-widest mb-1.5">
            <Shield className="w-4 h-4" /> Security Operations Center (SOC) Co-Pilot
          </div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            DNIF Response Generator
            <Sparkles className="w-6 h-6 text-indigo-400 animate-pulse" />
          </h2>
          <p className="text-slate-400 mt-1 text-sm">Automate context-aware client engagement responses via offline localized Mistral LLM.</p>
        </div>
        <div className="flex gap-3 text-xs font-mono text-slate-400 bg-slate-950/60 px-4 py-2.5 rounded-xl border border-slate-800">
          <span className="flex items-center gap-1.5"><Terminal className="w-3.5 h-3.5 text-emerald-400" /> API: Stable</span>
          <span className="text-slate-700">|</span>
          <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-blue-400" /> Mode: Real-time Stream</span>
        </div>
      </div>

      {/* Main Container Dashboard */}
      <div className="flex gap-8 flex-1 h-[calc(100vh-220px)] min-h-[550px]">
        
        {/* PANEL LEFT: Context Entry Form */}
        <div className="w-1/2 flex flex-col gap-5 bg-slate-900/60 p-6 rounded-2xl shadow-2xl border border-slate-800/80 backdrop-blur-sm overflow-y-auto">
          <div className="border-b border-slate-800/60 pb-3">
            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">Ticket Metadata</h3>
          </div>
          
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Classification</label>
              <select 
                className="w-full bg-slate-950/80 text-slate-200 border border-slate-800 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all cursor-pointer font-medium text-sm shadow-inner"
                style={{ backgroundColor: '#040711', borderColor: '#1e293b' }}
                value={ticket.ticket_type}
                onChange={(e) => setTicket({...ticket, ticket_type: e.target.value})}
              >
                <option value="Case">Case / Security Incident</option>
                <option value="Service Request">Service Request (SR)</option>
                <option value="Feature Request">Feature Integration Request</option>
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">SLA Priority Tier</label>
              <select 
                className={`w-full bg-slate-950/80 border p-3 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all cursor-pointer font-bold text-sm shadow-inner ${
                  ticket.priority.includes('P1') ? 'text-rose-400 border-rose-900/50' : ticket.priority.includes('P2') ? 'text-amber-400 border-amber-900/50' : 'text-sky-400 border-slate-800'
                }`}
                style={{ backgroundColor: '#040711' }}
                value={ticket.priority}
                onChange={(e) => setTicket({...ticket, priority: e.target.value})}
              >
                <option value="P1 - Critical">P1 - Critical Priority</option>
                <option value="P2 - High">P2 - High Priority</option>
                <option value="P3 - Medium">P3 - Medium Priority</option>
                <option value="P4 - Low">P4 - Low Priority</option>
              </select>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Client Identifier</label>
              <input 
                type="text" 
                placeholder="Client engineering name..."
                className="w-full bg-slate-950/80 text-white border border-slate-800 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder-slate-600 font-medium text-sm shadow-inner"
                style={{ backgroundColor: '#040711', borderColor: '#1e293b' }}
                value={ticket.customer_name}
                onChange={(e) => setTicket({...ticket, customer_name: e.target.value})}
              />
            </div>
            <div className="w-2/3">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Jira Summary Title</label>
              <input 
                type="text" 
                placeholder="Enter core objective context..."
                className="w-full bg-slate-950/80 text-white border border-slate-800 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder-slate-600 font-medium text-sm shadow-inner"
                style={{ backgroundColor: '#040711', borderColor: '#1e293b' }}
                value={ticket.title}
                onChange={(e) => setTicket({...ticket, title: e.target.value})}
              />
            </div>
          </div>

          {/* Fixed Input Textarea Label */}
          <div className="flex-1 flex flex-col min-h-[180px]">
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Response By Client</label>
            <textarea 
              placeholder="Paste telemetry errors, tracking parameters or descriptions reported by customer..."
              className="w-full flex-1 bg-slate-950/80 text-slate-200 border border-slate-800 p-4 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder-slate-600 resize-none font-mono text-xs leading-relaxed shadow-inner"
              style={{ backgroundColor: '#040711', borderColor: '#1e293b' }}
              value={ticket.description}
              onChange={(e) => setTicket({...ticket, description: e.target.value})}
            />
          </div>

          <button 
            onClick={handleGenerate}
            disabled={isLoading || !ticket.description}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:from-slate-800 disabled:to-slate-800 text-white font-bold py-4 px-4 rounded-xl flex items-center justify-center gap-2.5 transition-all shadow-lg active:translate-y-[1px] disabled:cursor-not-allowed disabled:opacity-40 uppercase tracking-wider text-xs"
          >
            {isLoading ? (
              <><Loader2 className="w-4 h-4 animate-spin text-white" /> Synthesizing Response Context...</>
            ) : (
              <><Send className="w-4 h-4" /> Run Inference Engine</>
            )}
          </button>
        </div>

        {/* PANEL RIGHT: Fixed Output Panel Label */}
        <div className="w-1/2 flex flex-col bg-slate-900/40 rounded-2xl shadow-2xl border border-slate-800/80 overflow-hidden backdrop-blur-md relative">
          <div className="bg-slate-950/60 border-b border-slate-800/80 p-4 flex justify-between items-center" style={{ backgroundColor: '#060a12' }}>
            <h3 className="text-sm font-bold text-white flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping"></span>
              <Sparkles className="w-4 h-4 text-amber-400" />
              Your Generated First Response
            </h3>
            <button 
              onClick={copyToClipboard}
              disabled={!response}
              className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider bg-slate-900 border border-slate-800 px-4 py-2 rounded-xl text-slate-300 hover:bg-slate-800 hover:text-blue-400 disabled:opacity-20 disabled:cursor-not-allowed transition-all shadow-sm"
            >
              {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied System Clipboard' : 'Copy Output'}
            </button>
          </div>
          
          <div className="p-6 flex-1 overflow-auto bg-slate-950/40 border border-slate-900/50 rounded-b-2xl" style={{ backgroundColor: '#050810' }}>
            {error ? (
               <div className="bg-rose-950/30 border border-rose-900/50 text-rose-300 p-4 rounded-xl flex items-start gap-3 shadow-md">
                 <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-rose-400" />
                 <div>
                   <p className="font-bold text-sm">Execution Interrupted</p>
                   <p className="text-xs mt-0.5 text-rose-400/80">{error}</p>
                 </div>
               </div>
            ) : !response && !isLoading ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-600 gap-3">
                <Terminal className="w-12 h-12 text-slate-800" />
                <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Awaiting prompt submission input</p>
              </div>
            ) : (
              <div className="font-sans text-sm leading-relaxed text-slate-300 whitespace-pre-wrap select-text selection:bg-blue-500/30">
                {response}
              </div>
            )}
            
            {isLoading && (
              <span className="inline-block w-2 h-4 bg-indigo-500 ml-1 animate-pulse align-middle rounded-sm"></span>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}