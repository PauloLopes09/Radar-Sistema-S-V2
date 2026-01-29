import React, { useState, useMemo, useEffect } from 'react';
import Layout from './components/Layout';
import InstitutionGrid from './components/InstitutionGrid';
import VisualDashboard from './components/VisualDashboard';
import { INITIAL_INSTITUTIONS, STATES } from './constants';
import { Institution } from './types';
import { checkInstitutionUpdates } from './services/geminiService';
import { db } from './services/firebaseConfig';
import { doc, setDoc, getDoc } from "firebase/firestore";

const App: React.FC = () => {
  const [institutions, setInstitutions] = useState<Institution[]>(INITIAL_INSTITUTIONS);
  const [filterState, setFilterState] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [scanRange, setScanRange] = useState<string>('a partir de 2026');
  const [isScanningAll, setIsScanningAll] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', state: 'São Paulo', initials: '', url: '' });

  // Carregar do Firebase
  useEffect(() => {
    const loadData = async () => {
      try {
        const docSnap = await getDoc(doc(db, "usuarios", "meu_radar_id"));
        if (docSnap.exists()) setInstitutions(docSnap.data().institutions);
      } catch (e) { console.error("Erro Firebase", e); }
    };
    loadData();
  }, []);

  // Salvar no Firebase
  useEffect(() => {
    if (institutions !== INITIAL_INSTITUTIONS) {
      setDoc(doc(db, "usuarios", "meu_radar_id"), { 
        institutions, lastUpdated: new Date().toISOString() 
      }).catch(e => console.error(e));
    }
  }, [institutions]);

  const handleSingleCheck = async (inst: Institution) => {
    if (!import.meta.env.VITE_GEMINI_API_KEY) return alert("Sem chave API");
    
    try {
      const results = await checkInstitutionUpdates(inst.name, inst.state, inst.url, scanRange);
      setInstitutions(prev => prev.map(item => 
        item.id === inst.id 
          ? { ...item, lastChecked: new Date().toISOString(), lastResults: results }
          : item
      ));
    } catch (e) { console.error(e); }
  };

  const runGlobalScan = async () => {
    setIsScanningAll(true);
    const targets = institutions.filter(inst => 
      (filterState === 'All' || inst.state === filterState) &&
      (inst.name.toLowerCase().includes(searchTerm.toLowerCase()) || inst.initials.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    for (const inst of targets) {
      await handleSingleCheck(inst);
    }
    setIsScanningAll(false);
  };

  const savePortal = () => {
    if (editingId) {
      setInstitutions(prev => prev.map(i => i.id === editingId ? { ...i, ...formData } : i));
    } else {
      setInstitutions([...institutions, { ...formData, id: Math.random().toString(36).substr(2, 9), status: 'online' }]);
    }
    setIsModalOpen(false);
  };

  // Filtragem visual
  const filteredInstitutions = useMemo(() => institutions.filter(inst => {
    const matchState = filterState === 'All' || inst.state === filterState;
    const matchSearch = inst.initials.toLowerCase().includes(searchTerm.toLowerCase()) || inst.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchState && matchSearch;
  }), [institutions, filterState, searchTerm]);

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-black">Radar de Licitações</h2>
          <div className="flex gap-2">
            <button onClick={() => { setEditingId(null); setIsModalOpen(true); }} className="px-4 py-2 bg-slate-200 rounded-lg font-bold">+ Novo</button>
            <button onClick={runGlobalScan} disabled={isScanningAll} className="px-4 py-2 bg-blue-600 text-white rounded-lg font-bold">
              {isScanningAll ? 'Varrendo...' : 'Varredura Geral'}
            </button>
          </div>
        </div>

        <VisualDashboard institutions={institutions} activeState={filterState} onStateClick={s => setFilterState(s === filterState ? 'All' : s)} />

        <div className="flex gap-4 my-6">
          <input className="flex-1 p-3 border rounded-xl" placeholder="Buscar..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
          <select className="p-3 border rounded-xl" value={filterState} onChange={e => setFilterState(e.target.value)}>
            <option value="All">Todos os Estados</option>
            {STATES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        <InstitutionGrid 
          institutions={filteredInstitutions} 
          onReload={handleSingleCheck} 
          onEdit={(inst) => { setEditingId(inst.id); setFormData(inst); setIsModalOpen(true); }}
          onDelete={(id) => setInstitutions(prev => prev.filter(i => i.id !== id))}
        />

        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white p-8 rounded-3xl w-full max-w-md space-y-4">
              <h3 className="text-2xl font-bold">{editingId ? 'Editar' : 'Adicionar'} Portal</h3>
              <input className="w-full p-3 border rounded-xl" placeholder="Nome (Ex: SENAI)" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              <input className="w-full p-3 border rounded-xl" placeholder="Sigla (Ex: SENAI SP)" value={formData.initials} onChange={e => setFormData({...formData, initials: e.target.value})} />
              <select className="w-full p-3 border rounded-xl" value={formData.state} onChange={e => setFormData({...formData, state: e.target.value})}>{STATES.map(s => <option key={s} value={s}>{s}</option>)}</select>
              <input className="w-full p-3 border rounded-xl" placeholder="URL" value={formData.url} onChange={e => setFormData({...formData, url: e.target.value})} />
              <div className="flex gap-2 pt-4">
                <button onClick={() => setIsModalOpen(false)} className="flex-1 py-3 text-slate-500 font-bold">Cancelar</button>
                <button onClick={savePortal} className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-bold">Salvar</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default App;
