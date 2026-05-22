import React, { useState } from 'react';
import { Settings, Sparkles, CheckCircle2, Copy, Save, LayoutGrid, Sliders, ShieldCheck } from 'lucide-react';

export default function Templates() {
  const [activeTab, setActiveTab] = useState('Case');
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);

  // Pre-configured templates matching your Python prompt builder structure
  const [templates, setTemplates] = useState({
    Case: {
      greeting: "Hi [Customer Name],",
      opening: "Thank you for raising this security concern. Our SOC engineering team has acknowledged this incident and is actively investigating the telemetry logs.",
      action_heading: "To expedite our analysis, please provide the following details if available:\n1. Relevant raw event timestamps\n2. Affected asset identifiers / IP addresses\n3. Any corresponding firewall export exports",
      closing: "We treat security incidents with maximum urgency and will provide updates as our forensics progress.\n\nWarm regards,\nDNIF Support Team"
    },
    "Service Request": {
      greeting: "Hi [Customer Name],",
      opening: "Thank you for reaching out regarding this configuration/service request. We are happy to assist you with optimizing your deployment parameters.",
      action_heading: "To proceed with implementation, kindly share:\n1. Target component details\n2. Authorized window schedule for application\n3. Any specific integration variables required",
      closing: "We will keep you updated throughout the execution lifecycle.\n\nWarm regards,\nDNIF Support Team"
    },
    "Feature Request": {
      greeting: "Hi [Customer Name],",
      opening: "Thank you for submitting this feature integration request. We highly value your feedback to make the DNIF SIEM matrix plane more versatile.",
      action_heading: "To help our product roadmap team understand the objective scope, please elaborate on:\n1. Core business use case scenario\n2. Anticipated data sources or ingestion types\n3. Expected behavior mapping structure",
      closing: "This has been logged with our platform management team for engineering evaluation.\n\nWarm regards,\nDNIF Support Team"
    }
  });

  const handleFieldChange = (category, field, value) => {
    setTemplates(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: value
      }
    }));
  };

  const triggerCopy = () => {
    const rawStructure = JSON.stringify(templates[activeTab], null, 2);
    navigator.clipboard.writeText(rawStructure);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const triggerSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="p-8 w-full min-h-screen text-slate-100 flex flex-col font-sans" style={{ backgroundColor: '#090d16' }}>
      
      {/* Header Deck */}
      <div className="mb-8 bg-slate-900/40 p-6 rounded-2xl border border-slate-800/80 backdrop-blur-md flex justify-between items-center shadow-xl">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs uppercase tracking-widest mb-1.5">
            <LayoutGrid className="w-4 h-4" /> Prompt Matrix Architecture
          </div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            Manage Prompt Templates
            <Settings className="w-6 h-6 text-blue-500 animate-[spin_4s_linear_infinite]" />
          </h2>
          <p className="text-slate-400 mt-1 text-sm">Tune the structural framing weights used by the Mistral inference model during compilation.</p>
        </div>
        <div className="flex gap-2 text-xs font-mono text-slate-400 bg-slate-950/60 px-4 py-2.5 rounded-xl border border-slate-800">
          <ShieldCheck className="w-4 h-4 text-emerald-400" /> Active Configuration: Default
        </div>
      </div>

      {/* Main Dashboard Layout Splits */}
      <div className="flex gap-8 flex-1 h-[calc(100vh-220px)] min-h-[550px]">
        
        {/* PANEL LEFT: Category Selector Tabs & Structural Form fields */}
        <div className="w-7/12 flex flex-col gap-5 bg-slate-900/60 p-6 rounded-2xl shadow-2xl border border-slate-800/80 backdrop-blur-sm overflow-y-auto">
          
          {/* High Tech Category Tabs */}
          <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800/60" style={{ backgroundColor: '#040711' }}>
            {Object.keys(templates).map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveTab(cat)}
                className={`flex-1 py-2.5 px-3 rounded-lg text-xs font-bold tracking-wider uppercase transition-all duration-150 ${
                  activeTab === cat
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                {cat} Structure
              </button>
            ))}
          </div>

          {/* Form Parameters */}
          <form onSubmit={triggerSave} className="flex-1 flex flex-col gap-4">
            <div>
              <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Default Greeting Statement</label>
              <input 
                type="text"
                className="w-full bg-slate-950/80 text-white border border-slate-800 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all font-medium text-sm shadow-inner"
                style={{ backgroundColor: '#040711', borderColor: '#1e293b' }}
                value={templates[activeTab].greeting}
                onChange={(e) => handleFieldChange(activeTab, 'greeting', e.target.value)}
              />
            </div>

            <div>
              <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Opening Context (Acknowledgement Anchor)</label>
              <textarea 
                className="w-full bg-slate-950/80 text-slate-200 border border-slate-800 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none font-medium text-xs leading-relaxed shadow-inner h-20"
                style={{ backgroundColor: '#040711', borderColor: '#1e293b' }}
                value={templates[activeTab].opening}
                onChange={(e) => handleFieldChange(activeTab, 'opening', e.target.value)}
              />
            </div>

            <div className="flex-1 flex flex-col">
              <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Action Heading Items (Telemetry Discovery Requirements)</label>
              <textarea 
                className="w-full flex-1 bg-slate-950/80 text-slate-200 border border-slate-800 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none font-mono text-xs leading-relaxed shadow-inner min-h-[120px]"
                style={{ backgroundColor: '#040711', borderColor: '#1e293b' }}
                value={templates[activeTab].action_heading}
                onChange={(e) => handleFieldChange(activeTab, 'action_heading', e.target.value)}
              />
            </div>

            <div>
              <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Closing Guard Line</label>
              <textarea 
                className="w-full bg-slate-950/80 text-slate-200 border border-slate-800 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none font-medium text-xs leading-relaxed shadow-inner h-24"
                style={{ backgroundColor: '#040711', borderColor: '#1e293b' }}
                value={templates[activeTab].closing}
                onChange={(e) => handleFieldChange(activeTab, 'closing', e.target.value)}
              />
            </div>

            {/* Commit parameters button */}
            <button 
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2.5 transition-all shadow-lg active:translate-y-[1px] uppercase tracking-wider text-xs mt-2"
            >
              {saved ? (
                <><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Runtime Configurations Loaded</>
              ) : (
                <><Save className="w-4 h-4" /> Save Local Template State</>
              )}
            </button>
          </form>
        </div>

        {/* PANEL RIGHT: Live Code Payload Compilation Previewer */}
        <div className="w-5/12 flex flex-col bg-slate-900/40 rounded-2xl shadow-2xl border border-slate-800/80 overflow-hidden backdrop-blur-md relative">
          <div className="bg-slate-950/60 border-b border-slate-800/80 p-4 flex justify-between items-center" style={{ backgroundColor: '#060a12' }}>
            <h3 className="text-sm font-bold text-white flex items-center gap-2.5">
              <Sliders className="w-4 h-4 text-indigo-400" />
              Compiled Prompt Variable Tree
            </h3>
            <button 
              onClick={triggerCopy}
              className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider bg-slate-900 border border-slate-800 px-4 py-2 rounded-xl text-slate-300 hover:bg-slate-800 hover:text-blue-400 transition-all shadow-sm"
            >
              {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied Payload' : 'Export JSON Map'}
            </button>
          </div>
          
          <div className="p-5 flex-1 overflow-auto" style={{ backgroundColor: '#050810' }}>
            <div className="text-[11px] text-slate-500 font-bold uppercase tracking-widest mb-3 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Live template parameters parsed to engine:
            </div>
            <pre className="font-mono text-xs text-indigo-300/90 whitespace-pre-wrap leading-relaxed select-text p-4 rounded-xl bg-slate-950/40 border border-slate-900/40 h-[calc(100%-30px)] overflow-auto">
{`{
  "category": "${activeTab}",
  "greeting": "${templates[activeTab].greeting}",
  "opening": "${templates[activeTab].opening}",
  "action_items": "${templates[activeTab].action_heading.replace(/\n/g, '\\n')}",
  "closing": "${templates[activeTab].closing.replace(/\n/g, '\\n')}"
}`}
            </pre>
          </div>
        </div>

      </div>
    </div>
  );
}