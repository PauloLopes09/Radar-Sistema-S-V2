
import { GoogleGenAI } from "@google/genai";
import { Opportunity } from "../types";

// Função para obter o cliente da IA de forma segura
const getAIClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey || apiKey === "undefined") {
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export async function checkInstitutionUpdates(
  institutionName: string, 
  state: string, 
  url: string,
  timeRange: string = "últimos 15 dias"
): Promise<Opportunity[]> {
  const ai = getAIClient();
  
  if (!ai) {
    console.warn("API_KEY não configurada. A busca simulada será retornada.");
    return [];
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Verifique as licitações e oportunidades de negócio mais recentes para ${institutionName} em ${state}. 
      URL de referência: ${url}. 
      FOCO TEMPORAL: Liste apenas oportunidades publicadas no(s) ${timeRange}. 
      Se encontrar itens reais, retorne um resumo curtíssimo por item. 
      Se não houver nada no período de ${timeRange}, responda apenas "Nenhuma oportunidade encontrada".`,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const text = response.text || "";
    
    if (text.toLowerCase().includes("nenhuma") || text.length < 20) {
      return [];
    }

    return [{
      id: Math.random().toString(36).substr(2, 9),
      title: `Oportunidade em ${institutionName}`,
      date: new Date().toLocaleDateString(),
      description: text,
      link: url,
      institution: institutionName,
      isNew: true
    }];
  } catch (error) {
    console.error(`Erro na busca de ${institutionName}:`, error);
    return [];
  }
}
