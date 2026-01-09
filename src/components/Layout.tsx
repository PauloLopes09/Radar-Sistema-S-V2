
import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900 leading-tight">Radar S-System</h1>
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Monitor de Oportunidades v1.0</p>
              </div>
            </div>
            
            <nav className="hidden md:flex space-x-8">
              <a href="#" className="text-blue-600 font-semibold border-b-2 border-blue-600 pb-1">Dashboard</a>
              <a href="#" className="text-slate-500 hover:text-slate-700 font-medium">Relatórios</a>
              <a href="#" className="text-slate-500 hover:text-slate-700 font-medium">Configurações</a>
            </nav>

            <div className="flex items-center gap-4">
              <span className="hidden sm:inline text-sm text-slate-500">Olá, Usuário</span>
              <div className="h-8 w-8 rounded-full bg-slate-200 border border-slate-300"></div>
            </div>
          </div>
        </div>
      </header>
      
      <main className="flex-grow">
        {children}
      </main>

      <footer className="bg-white border-t border-slate-200 py-6">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm text-slate-400">© 2024 Opportunity Radar Hub. Desenvolvido para agilizar sua busca por licitações.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
