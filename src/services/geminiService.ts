import { GoogleGenAI } from "@google/genai";
import { Opportunity } from "../types";

// Função para obter o cliente da IA de forma segura
const getAIClient = () => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey || apiKey === "undefined") {
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export async function checkInstitutionUpdates(
  institutionName: string, 
  state: string, 
  url: string,
  timeRange: string = "a partir de 2026"
): Promise<Opportunity[]> {
  const ai = getAIClient();
  
  if (!ai) {
    console.warn("API_KEY não configurada. A busca simulada será retornada.");
    return [];
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-exp",
      contents: `Busque TODAS as licitações e oportunidades de negócio publicadas a partir de 2026 (incluindo anos futuros) para ${institutionName} no estado ${state}.

URL OFICIAL para consulta: ${url}

INSTRUÇÕES CRÍTICAS:
1. Acesse o site oficial usando a URL fornecida
2. Busque licitações publicadas a partir de 2026 em diante (2026, 2027, 2028...)
3. IGNORE completamente licitações de 2025, 2024 ou anos anteriores
4. Liste TODAS as oportunidades encontradas, não apenas as mais recentes
5. Para cada licitação, inclua:
   - Número do edital ou processo
   - Título/objeto da licitação
   - Data de publicação (formato: DD/MM/AAAA)
   - Prazo de entrega/validade (se disponível)
   - Valor estimado (se disponível)

6. Se NÃO encontrar nenhuma licitação a partir de 2026, responda EXATAMENTE: "Nenhuma oportunidade encontrada a partir de 2026"

FORMATO DE RESPOSTA:
Liste cada licitação em um parágrafo separado, começando com a data e número do processo.

Exemplo:
"15/01/2026 - Edital 001/2026: Fornecimento de equipamentos industriais. Valor: R$ 150.000,00. Prazo: 30/01/2026."
"05/03/2027 - Pregão 023/2027: Serviços de manutenção predial. Valor: R$ 80.000,00. Prazo: 20/03/2027."`,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const text = response.text || "";
    
    // Verifica se não encontrou nada a partir de 2026
    if (text.toLowerCase().includes("nenhuma oportunidade encontrada a partir de 2026") || 
        text.toLowerCase().includes("nenhuma oportunidade") || 
        text.length < 20) {
      return [];
    }

    // Divide o texto em múltiplas oportunidades (por linha ou parágrafo)
    const opportunities: Opportunity[] = [];
    const lines = text.split('\n').filter(line => line.trim().length > 0);

    // Se houver múltiplas linhas, cria uma oportunidade para cada
    if (lines.length > 1) {
      lines.forEach((line, index) => {
        if (line.trim().length > 20) {
          opportunities.push({
            id: Math.random().toString(36).substr(2, 9),
            title: `Licitação ${index + 1} - ${institutionName}`,
            date: new Date().toLocaleDateString(),
            description: line.trim(),
            link: url,
            institution: institutionName,
            isNew: true
          });
        }
      });
    } else {
      // Se for uma única resposta, retorna como antes
      opportunities.push({
        id: Math.random().toString(36).substr(2, 9),
                    title: `Oportunidades a partir de 2026 - ${institutionName}`,
        date: new Date().toLocaleDateString(),
        description: text,
        link: url,
        institution: institutionName,
        isNew: true
      });
    }

    return opportunities;

  } catch (error) {
    console.error(`Erro na busca de ${institutionName}:`, error);
    return [];
  }
}
