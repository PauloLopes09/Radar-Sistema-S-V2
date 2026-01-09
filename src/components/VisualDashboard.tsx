
import React from 'react';
import { Institution } from '../types';

interface Props {
  institutions: Institution[];
  activeState: string;
  onStateClick: (state: string) => void;
}

const VisualDashboard: React.FC<Props> = ({ institutions, activeState, onStateClick }) => {
  const statsByState = institutions.reduce((acc, inst) => {
    const count = inst.lastResults?.length || 0;
    acc[inst.state] = (acc[inst.state] || 0) + count;
    return acc;
  }, {} as Record<string, number>);

  const statsByType = institutions.reduce((acc, inst) => {
    const count = inst.lastResults?.length || 0;
    const type = inst.name;
    acc[type] = (acc[type] || 0) + count;
    return acc;
  }, {} as Record<string, number>);

  const totalOpps = (Object.values(statsByState) as number[]).reduce((a: number, b: number): number => a + b, 0);

  // Mapa do Brasil com caminhos mais detalhados e estéticos
  const brazilStates = [
    { id: 'AC', name: 'Acre', d: 'M40,165 L65,165 L70,185 L50,195 L35,185 Z', cx: 50, cy: 175 },
    { id: 'AM', name: 'Amazonas', d: 'M40,110 L130,100 L145,170 L65,160 Z', cx: 90, cy: 135 },
    { id: 'RR', name: 'Roraima', d: 'M110,65 L145,75 L135,100 L105,95 Z', cx: 125, cy: 80 },
    { id: 'PA', name: 'Pará', d: 'M135,100 L230,100 L220,175 L150,170 Z', cx: 185, cy: 135 },
    { id: 'AP', name: 'Amapá', d: 'M195,75 L225,90 L215,100 L190,100 Z', cx: 210, cy: 88 },
    { id: 'RO', name: 'Rondônia', d: 'M75,165 L125,170 L120,205 L85,200 Z', cx: 100, cy: 185 },
    { id: 'TO', name: 'Tocantins', d: 'M195,160 L225,160 L230,215 L205,215 Z', cx: 215, cy: 188 },
    { id: 'MA', name: 'Maranhão', d: 'M230,105 L265,105 L260,165 L230,165 Z', cx: 248, cy: 135 },
    { id: 'PI', name: 'Piauí', d: 'M270,115 L295,125 L280,185 L265,170 Z', cx: 280, cy: 150 },
    { id: 'CE', name: 'Ceará', d: 'M300,115 L335,115 L335,145 L300,145 Z', cx: 318, cy: 130 },
    { id: 'RN', name: 'Rio Grande do Norte', d: 'M340,115 L370,115 L370,135 L340,135 Z', cx: 355, cy: 125 },
    { id: 'PB', name: 'Paraíba', d: 'M340,140 L375,140 L375,160 L340,160 Z', cx: 358, cy: 150 },
    { id: 'PE', name: 'Pernambuco', d: 'M290,155 L375,165 L370,185 L295,180 Z', cx: 333, cy: 170 },
    { id: 'AL', name: 'Alagoas', d: 'M355,188 L375,188 L375,200 L355,200 Z', cx: 365, cy: 194 },
    { id: 'SE', name: 'Sergipe', d: 'M350,205 L365,205 L365,215 L350,215 Z', cx: 358, cy: 210 },
    { id: 'BA', name: 'Bahia', d: 'M235,175 L305,175 L340,235 L260,255 Z', cx: 290, cy: 215 },
    { id: 'MG', name: 'Minas Gerais', d: 'M230,230 L295,230 L295,285 L230,285 Z', cx: 263, cy: 258 },
    { id: 'ES', name: 'Espírito Santo', d: 'M300,240 L325,240 L325,265 L300,265 Z', cx: 313, cy: 253 },
    { id: 'RJ', name: 'Rio de Janeiro', d: 'M285,285 L320,285 L315,305 L280,305 Z', cx: 300, cy: 295 },
    { id: 'SP', name: 'São Paulo', d: 'M195,265 L260,265 L255,310 L190,305 Z', cx: 228, cy: 288 },
    { id: 'PR', name: 'Paraná', d: 'M170,300 L225,300 L220,335 L165,335 Z', cx: 195, cy: 318 },
    { id: 'SC', name: 'Santa Catarina', d: 'M175,340 L225,340 L220,365 L170,365 Z', cx: 198, cy: 353 },
    { id: 'RS', name: 'Rio Grande do Sul', d: 'M160,370 L220,370 L210,420 L150,410 Z', cx: 185, cy: 395 },
    { id: 'MS', name: 'Mato Grosso do Sul', d: 'M140,245 L195,245 L190,295 L135,290 Z', cx: 165, cy: 270 },
    { id: 'MT', name: 'Mato Grosso', d: 'M130,175 L215,175 L200,240 L125,240 Z', cx: 170, cy: 208 },
    { id: 'GO', name: 'Goiás', d: 'M205,210 L255,210 L250,265 L200,265 Z', cx: 228, cy: 238 },
    { id: 'DF', name: 'Distrito Federal', d: 'M230,230 L245,230 L245,245 L230,245 Z', cx: 238, cy: 238 },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
      {/* Mapa do Brasil Moderno */}
      <div className="lg:col-span-8 bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100 flex flex-col relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
          <svg className="w-64 h-64 text-slate-900" fill="currentColor" viewBox="0 0 24 24">
             <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
        </div>

        <div className="flex justify-between items-start mb-8 z-10">
          <div>
            <h3 className="text-2xl font-black text-slate-900 leading-none">Radar Geográfico</h3>
            <p className="text-sm text-slate-400 mt-2 font-medium">Interação dinâmica por estados brasileiros.</p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-2xl border border-blue-100">
             <div className="w-2 h-2 rounded-full bg-blue-500 animate-ping"></div>
             <span className="text-[10px] font-black text-blue-700 uppercase tracking-widest">Tempo Real</span>
          </div>
        </div>
        
        <div className="relative flex-grow flex items-center justify-center bg-gradient-to-br from-slate-50 to-white rounded-[2rem] border border-slate-100 shadow-inner p-4 min-h-[450px]">
          <svg viewBox="0 0 420 450" className="w-full h-full max-w-lg drop-shadow-2xl">
            <defs>
              <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur in="SourceAlpha" stdDeviation="3" />
                <feOffset dx="2" dy="2" result="offsetblur" />
                <feComponentTransfer>
                  <feFuncA type="linear" slope="0.2" />
                </feComponentTransfer>
                <feMerge>
                  <feMergeNode />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {brazilStates.map(state => {
              const hasOpps = (statsByState[state.name] || 0) > 0;
              const isActive = activeState === state.name;

              return (
                <g key={state.id} className="transition-all duration-500 group/state">
                  <path 
                    onClick={() => onStateClick(state.name)}
                    d={state.d} 
                    className={`cursor-pointer transition-all duration-300 stroke-[1.5] filter hover:brightness-105 ${
                      isActive 
                        ? 'fill-blue-600 stroke-blue-800' 
                        : 'fill-slate-100 stroke-slate-200 hover:fill-blue-50 hover:stroke-blue-200'
                    }`}
                  />
                  {hasOpps && (
                    <g className="pointer-events-none">
                      <circle 
                        cx={state.cx} 
                        cy={state.cy} 
                        r="5" 
                        className="fill-green-500 shadow-lg"
                      />
                      <circle 
                        cx={state.cx} 
                        cy={state.cy} 
                        r="12" 
                        className="fill-green-400 opacity-20 animate-ping"
                      />
                    </g>
                  )}
                  {/* Tooltip fake on hover em estados com dados */}
                  {isActive && (
                    <text 
                      x={state.cx} 
                      y={state.cy - 15} 
                      className="fill-blue-900 text-[10px] font-black pointer-events-none uppercase text-center"
                      textAnchor="middle"
                    >
                      {state.id}: {statsByState[state.name] || 0}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>

          {/* Legenda Flutuante Premium */}
          <div className="absolute bottom-6 left-6 bg-white/70 backdrop-blur-md p-5 rounded-3xl border border-white shadow-xl shadow-slate-200/50 text-[10px]">
            <p className="font-black text-slate-900 mb-3 uppercase tracking-widest border-b border-slate-100 pb-2">Legenda</p>
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-blue-600 shadow-sm"></div>
                <span className="font-bold text-slate-600 uppercase tracking-tighter">Selecionado</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-green-500 shadow-sm animate-pulse"></div>
                <span className="font-bold text-slate-600 uppercase tracking-tighter">Novos Itens</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-slate-100 border border-slate-200"></div>
                <span className="font-bold text-slate-600 uppercase tracking-tighter">Sem Dados</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Analytics Lateral Moderno */}
      <div className="lg:col-span-4 flex flex-col gap-6">
        <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100 flex-grow">
          <div className="flex items-center justify-between mb-8">
             <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Top Órgãos</h3>
             <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
          </div>
          
          <div className="space-y-6">
            {(Object.entries(statsByType) as [string, number][]).sort((a, b) => b[1] - a[1]).slice(0, 6).map(([type, count]) => (
              <div key={type} className="group">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-black text-slate-700">{type}</span>
                  <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">{count} Ativos</span>
                </div>
                <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full transition-all duration-1000 group-hover:from-blue-500 group-hover:to-blue-700" 
                    style={{ width: `${totalOpps > 0 ? (count / totalOpps) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>
            ))}
            {totalOpps === 0 && (
               <div className="py-12 text-center flex flex-col items-center">
                  <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                     <svg className="w-6 h-6 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  </div>
                  <p className="text-xs text-slate-400 font-bold max-w-[160px]">Nenhuma oportunidade carregada no momento.</p>
               </div>
            )}
          </div>
        </div>

        {/* Card de Métricas Globais */}
        <div className="bg-slate-900 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl"></div>
          
          <div className="relative z-10">
            <div className="flex justify-between items-center mb-6">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Total Nacional</span>
              <div className="bg-green-500/20 text-green-400 text-[9px] font-black px-2 py-1 rounded-lg border border-green-500/30 uppercase tracking-tighter">Atualizado</div>
            </div>
            
            <div className="flex items-baseline gap-2">
               <h4 className="text-6xl font-black text-white tracking-tighter">{totalOpps}</h4>
               <span className="text-slate-500 font-bold text-sm">Oportunidades</span>
            </div>

            <div className="mt-10 pt-8 border-t border-slate-800 grid grid-cols-2 gap-8">
               <div>
                  <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Portais</p>
                  <p className="text-xl font-bold text-white leading-none">{institutions.length}</p>
               </div>
               <div>
                  <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Estados</p>
                  <p className="text-xl font-bold text-blue-400 leading-none">{Object.keys(statsByState).length}</p>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisualDashboard;
