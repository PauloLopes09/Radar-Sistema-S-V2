// Define a estrutura de uma única Licitação ou Oportunidade encontrada
export interface Opportunity {
  id: string;
  title: string;       // Ex: "Pregão Eletrônico 05/2026"
  description: string; // Ex: "Aquisição de materiais..."
  date: string;        // Ex: "15/01/2026"
  link: string;        // Link direto para o edital ou site
  institution: string; // Nome da instituição (Ex: SESC RN)
  isNew?: boolean;     // Campo opcional para destacar se é novidade visualmente
}

// Define a estrutura do Cartão da Instituição
export interface Institution {
  id: string;
  name: string;        // Ex: SENAI
  state: string;       // Ex: São Paulo
  initials: string;    // Ex: SENAI SP
  url: string;         // Link do Portal da Transparência
  status: 'online' | 'offline';
  lastChecked?: string; // Data ISO da última varredura
  
  // A lista de resultados encontrados (agora usando a estrutura correta)
  lastResults?: Opportunity[]; 
}
