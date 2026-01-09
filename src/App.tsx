import React, { useState, useMemo, useEffect } from 'react';
import Layout from './components/Layout';
import InstitutionGrid from './components/InstitutionGrid';
import VisualDashboard from './components/VisualDashboard';
import { INITIAL_INSTITUTIONS } from './constants';
import { Institution } from './types';
import { checkInstitutionUpdates } from './services/geminiService';

// IMPORTAÇÕES DO FIREBASE
import { db } from './services/firebaseConfig';
import { doc, setDoc, getDoc } from "firebase/firestore";

const App: React.FC = () => {
  const [institutions, setInstitutions] = useState<Institution[]>(INITIAL_INSTITUTIONS);
  
  const [filterState, setFilterState] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [scanRange, setScanRange] = useState<string>('últimos 15 dias');
  const [isScanningAll, setIsScanningAll] = useState(false);
  const [showGuide, setShowGuide] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: 'SENAI', state: 'São Paulo', initials: '', url: '' });

  // 1. CARREGAR DADOS DO FIREBASE AO ABRIR O SITE
  useEffect(() => {
    const loadFirebaseData = async () => {
      try {
        const docRef = doc(db, "usuarios", "meu_radar_id"); // "meu_radar_id" é o nome da sua gaveta no banco
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setInstitutions(docSnap.data().institutions);
        }
      } catch (error) {
        console.error("Erro ao carregar do Firebase:", error);
      }
    };
    loadFirebaseData();
  }, []);

  // 2. SALVAR NO FIREBASE SEMPRE QUE MUDAR ALGO
  useEffect(() => {
    const saveFirebaseData = async () => {
      try {
        await setDoc(doc(db, "usuarios", "meu_radar_id"), { 
          institutions,
          lastUpdated: new Date().toISOString()
        });
      } catch (error) {
        console.error("Erro ao salvar no Firebase:", error);
      }
    };
    if (institutions !== INITIAL_INSTITUTIONS) {
      saveFirebaseData();
    }
  }, [institutions]);

  const isApiKeyMissing = !import.meta.env.VITE_GEMINI_API_KEY;

  const filteredInstitutions = useMemo(() => {
    return institutions.filter(inst => {
      const matchState = filterState === 'All' || inst.state === filterState;
      const matchSearch = inst.initials.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          inst.state.toLowerCase().includes(searchTerm.toLowerCase());
      return matchState && matchSearch;
    });
  }, [filterState, searchTerm, institutions]);

  const handleSingleCheck = async (inst: Institution) => {
    if (isApiKeyMissing) {
      alert("Configuração de API pendente na Vercel.");
      return;
    }
    try {
      const results = await checkInstitutionUpdates(inst.name, inst.state, inst.url, scanRange);
      setInstitutions(prev => prev.map(item => 
        item.id === inst.id 
          ? { ...item, lastChecked: new Date().toISOString(), lastResults: results }
          : item
      ));
    } catch (e) {
      console.error(e);
    }
  };

  const runGlobalScan = async () => {
    if (isApiKeyMissing) return;
    setIsScanningAll(true);
    setShowGuide(false);
    
    for (let i = 0; i < filteredInstitutions.length; i++) {
      const inst = filteredInstitutions[i];
      try {
        const results = await checkInstitutionUpdates(inst.name, inst.state, inst.url, scanRange);
        setInstitutions(prev => prev.map(item => 
          item.id === inst.id 
            ? { ...item, lastChecked: new Date().toISOString(), lastResults: results }
            : item
        ));
      } catch (e) {
        console.error(e);
      }
    }
    setIsScanningAll(false);
  };

  const openAddModal = () => {
    setEditingId(null);
    setFormData({ name: 'SENAI', state: 'São Paulo', initials: '', url: '' });
    setIsModalOpen(true);
  };

  const openEditModal = (inst: Institution) => {
    setEditingId(inst.id);
    setFormData({ name: inst.name, state: inst.state, initials: inst.initials, url: inst.url });
    setIsModalOpen(true);
  };

  const handleDeletePortal = (id: string) => {
    if (window.confirm('Remover este portal do radar?')) {
      setInstitutions(prev => prev.filter(inst => inst.id !== id));
    }
  };

  const savePortal = () => {
    if (!formData.initials || !formData.url) return;
    if (editingId) {
      setInstitutions(prev => prev.map(inst => 
        inst.id === editingId ? { ...inst, ...formData } : inst
      ));
    } else {
      const newPortal: Institution = {
        id: Math.random().toString(36).substr(2, 9),
        ...formData,
        status: 'online'
      };
      setInstitutions([newPortal, ...institutions]);
    }
    setIsModalOpen(false);
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {isApiKeyMissing && (
          <div className="mb-8 bg-amber-50 border-2 border-amber-200 rounded-3xl p-6 text-amber-800">
             Chave de IA não configurada.
          </div>
        )}

        <div className="mb-10 flex flex-col md:flex-row justify-between gap-6">
          <div>
            <h2 className="text-4xl font-black text-slate-900">Radar QZ</h2>
            <p className="text-slate-500 font-medium">Sincronizado na Nuvem com Firebase.</p>
          </div>
          
          <div className="flex gap-3">
            <button onClick={openAddModal} className="px-6 py-3 bg-slate-100 rounded-2xl font-bold">
              + Adicionar Site
            </button>
            <button 
              onClick={runGlobalScan} 
              disabled={isScanningAll || isApiKeyMissing}
              className="px-8 py-3 bg-blue-600 text-white rounded-2xl font-black shadow-xl"
            >
              {isScanningAll ? 'Buscando...' : 'Varredura Geral'}
            </button>
          </div>
        </div>

        <VisualDashboard 
          institutions={institutions} 
          activeState={filterState}
          onStateClick={(state) => setFilterState(state === filterState ? 'All' : state)}
        />

        <div className="my-8">
          <input 
            type="text" 
            placeholder="Filtrar sites..." 
            className="w-full p-4 bg-white border rounded-2xl outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <InstitutionGrid 
          institutions={filteredInstitutions} 
          onReload={handleSingleCheck}
          onEdit={openEditModal}
          onDelete={handleDeletePortal}
        />

        {isModalOpen && (
          <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-[40px] p-10 max-w-md w-full shadow-2xl">
              <h3 className="text-3xl font-black mb-8">{editingId ? 'Editar' : 'Novo Portal'}</h3>
              <div className="space-y-5">
                <input 
                  className="w-full p-4 bg-slate-50 rounded-2xl outline-none"
                  placeholder="Sigla (Ex: SENAI RN)"
                  value={formData.initials}
                  onChange={(e) => setFormData({...formData, initials: e.target.value})}
                />
                <input 
                  className="w-full p-4 bg-slate-50 rounded-2xl outline-none"
                  placeholder="Link das Licitações"
                  value={formData.url}
                  onChange={(e) => setFormData({...formData, url: e.target.value})}
                />
              </div>
              <div className="mt-10 flex gap-4">
                <button onClick={() => setIsModalOpen(false)} className="flex-grow font-bold text-slate-400">Cancelar</button>
                <button onClick={savePortal} className="flex-grow py-4 bg-blue-600 text-white rounded-2xl font-black">Salvar</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default App;