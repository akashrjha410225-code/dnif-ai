import React, { useState, useEffect } from 'react';
import { Trash2, Plus, BookOpen } from 'lucide-react';

export default function Examples() {
  const [examples, setExamples] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    ticket_type: 'Case',
    priority: 'P2 - High',
    description: '',
    response: ''
  });

  const fetchExamples = async () => {
    try {
      const res = await fetch('http://localhost:8000/examples');
      const data = await res.json();
      setExamples(data);
    } catch (error) {
      console.error("Failed to fetch examples:", error);
    }
  };

  useEffect(() => {
    fetchExamples();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await fetch('http://localhost:8000/examples', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      setFormData({ ticket_type: 'Case', priority: 'P2 - High', description: '', response: '' });
      setIsFormOpen(false);
      fetchExamples();
    } catch (error) {
      console.error("Failed to save example:", error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this training example?")) return;
    try {
      await fetch(`http://localhost:8000/examples/${id}`, { method: 'DELETE' });
      fetchExamples();
    } catch (error) {
      console.error("Failed to delete example:", error);
    }
  };

  return (
    <div className="p-6 h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Training Examples</h2>
        <button 
          onClick={() => setIsFormOpen(!isFormOpen)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2 font-medium"
        >
          <Plus className="w-5 h-5" /> Add Example
        </button>
      </div>

      {isFormOpen && (
        <div className="bg-white p-6 rounded-lg shadow-sm border mb-6">
          <h3 className="text-lg font-bold mb-4">Add New Training Example</h3>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="flex gap-4">
              <div className="w-1/2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Ticket Type</label>
                <select className="border p-2 rounded w-full bg-gray-50" value={formData.ticket_type} onChange={e => setFormData({...formData, ticket_type: e.target.value})}>
                  <option>Case</option><option>Service Request</option><option>Feature Request</option>
                </select>
              </div>
              <div className="w-1/2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                <select className="border p-2 rounded w-full bg-gray-50" value={formData.priority} onChange={e => setFormData({...formData, priority: e.target.value})}>
                  <option>P1 - Critical</option><option>P2 - High</option><option>P3 - Medium</option><option>P4 - Low</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Input Description (What the customer wrote)</label>
              <textarea required className="border p-2 rounded w-full h-24 bg-gray-50" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ideal Response (Your perfect reply)</label>
              <textarea required className="border p-2 rounded w-full h-32 bg-gray-50" value={formData.response} onChange={e => setFormData({...formData, response: e.target.value})} />
            </div>
            <div className="flex gap-3 justify-end pt-2">
              <button type="button" onClick={() => setIsFormOpen(false)} className="px-4 py-2 border rounded hover:bg-gray-50 font-medium">Cancel</button>
              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 font-medium">Save Example</button>
            </div>
          </form>
        </div>
      )}

      <div className="flex-1 overflow-auto">
        <div className="grid gap-4">
          {examples.map((ex) => (
            <div key={ex.id} className="bg-white p-4 rounded-lg shadow-sm border flex flex-col gap-3">
              <div className="flex justify-between items-start">
                <div className="flex gap-2">
                  <span className="bg-slate-100 text-slate-800 text-xs font-bold px-2 py-1 rounded border">{ex.ticket_type}</span>
                  <span className="bg-slate-100 text-slate-800 text-xs font-bold px-2 py-1 rounded border">{ex.priority}</span>
                </div>
                <button onClick={() => handleDelete(ex.id)} className="text-red-500 hover:text-red-700 p-1.5 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4" /></button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-3 rounded border text-sm"><strong className="text-gray-500 block mb-1 uppercase text-xs">Customer Input:</strong>{ex.description}</div>
                <div className="bg-blue-50 p-3 rounded border text-sm"><strong className="text-blue-600 block mb-1 uppercase text-xs">Ideal Response:</strong>{ex.response}</div>
              </div>
            </div>
          ))}
          {examples.length === 0 && !isFormOpen && (
            <div className="text-center p-12 bg-white border rounded-lg shadow-sm text-gray-500">
              <BookOpen className="w-12 h-12 mx-auto text-gray-300 mb-3" />
              <p className="text-lg font-medium text-gray-700">No training examples found</p>
              <p className="text-sm">Add some past Jira responses so the AI can learn your writing style!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}