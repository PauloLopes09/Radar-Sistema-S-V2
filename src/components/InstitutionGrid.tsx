
import React, { useState } from 'react';
import { Institution } from '../types';

interface Props {
  institutions: Institution[];
  onReload: (inst: Institution) => Promise<void>;
  onEdit: (inst: Institution) => void;
  onDelete: (id: string) => void;
}

const InstitutionGrid: React.FC<Props> = ({ institutions, onReload, onEdit, onDelete }) => {
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleCheck = async (inst: Institution) => {
    setLoadingId(inst.id);
    try {
      await onReload(inst);
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {institutions.map((inst) => (
        <div key={inst.id} className="group bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden flex flex-col hover:border-blue-400 hover:shadow-xl transition-all duration-300">
          <div className="p-6 flex-grow relative">
            
            {/* Controles Flutuantes */}
            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button 
                onClick={() => onEdit(inst)}
                className="p-2 bg-slate-100 hover:bg-blue-100 text-slate-500 hover:text-blue-600 rounded-xl transition-colors"
                title="Editar Site"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
              </button>
              <button 
                onClick={() => onDelete(inst.id)}
                className="p-2 bg-slate-100 hover:bg-red-100 text-slate-500 hover:text-red-600 rounded-xl transition-colors"
                title="Excluir"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
              </button>
            </div>

            <div className="flex justify-between items-start mb-4 pr-16">
              <div>
                <h3 className="text-xl font-black text-slate-900">{inst.initials}</h3>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{inst.state}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 mb-6">
              <div className={`w-2 h-2 rounded-full ${inst.status === 'online' ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">
                {inst.lastChecked ? `Última Verificação: ${new Date(inst.lastChecked).toLocaleDateString()}` : 'Aguardando busca'}
              </span>
            </div>

            {inst.lastResults && inst.lastResults.length > 0 ? (
              <div className="mb-4 space-y-3">
                {inst.lastResults.map((res, i) => (
                  <div key={i} className="bg-blue-50/50 p-4 rounded-2xl border border-blue-100">
                    <p className="text-xs text-blue-900 font-medium leading-relaxed italic">
                      "{res.description.substring(0, 160)}..."
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 mb-4">
                <p className="text-xs text-slate-400 font-medium">Clique em Recarregar para a IA ler este site.</p>
              </div>
            )}
          </div>

          <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex gap-3">
            <a 
              href={inst.url} 
              target="_blank" 
              className="flex-grow py-3 text-center text-[11px] font-black uppercase tracking-widest text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-100 transition-colors shadow-sm"
            >
              Abrir Link
            </a>
            <button 
              onClick={() => handleCheck(inst)}
              disabled={loadingId === inst.id}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-blue-700 disabled:bg-blue-300 transition-all min-w-[120px] shadow-lg shadow-blue-100"
            >
              {loadingId === inst.id ? 'IA Lendo...' : 'Recarregar'}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default InstitutionGrid;
