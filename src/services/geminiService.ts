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

// 1. LÓGICA OFICIAL: SESC RN (Busca direta na API)
async function fetchSescRNOfficial(url: string, institutionName: string): Promise<Opportunity[]> {
  try {
    const anoAlvo = 2026;
    console.log(`📡 Acessando API Oficial SESC RN para ${anoAlvo}...`);

    const apiUrl = `http://transparencia.rn.sesc.com.br/transparencia/api/licitacoes?ano=${anoAlvo}`;
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(apiUrl)}`;

    const response = await fetch(proxyUrl);
    const data = await response.json();

    if (!data.contents) return [];

    const licitacoes = JSON.parse(data.contents);

    if (!Array.isArray(licitacoes) || licitacoes.length === 0) {
      return [];
    }

    return licitacoes.map((item: any, index: number) => ({
      id: `sesc-rn-${item.id || index}`,
      title: `Processo ${item.id} (${item.modalidade})`,
      description: item.objeto || "Objeto não informado",
      date: item.data_abertura || item.data_publicacao || new Date().toLocaleDateString(),
      link: item.anexos && item.anexos.length > 0 ? item.anexos[0].url : url,
      institution: institutionName,
      isNew: true
    }));

  } catch (error) {
    console.error("Erro na API SESC RN:", error);
    return [];
  }
}

// 2. LÓGICA GERAL: IA + GOOGLE SEARCH
async function fetchWithGeminiSearch(
  institutionName: string, 
  state: string, 
  url: string,
  timeRange: string
): Promise<Opportunity[]> {
  const ai = getAIClient();
  
  if (!ai) {
    console.warn("API Key não encontrada.");
    return [];
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-exp",
      contents: `Busque licitações a partir de ${timeRange} para ${institutionName} em ${state}. URL: ${url}.
      Se não houver nada, responda "Nenhuma oportunidade".
      Liste cada item em uma linha separada.`,
      config: { tools: [{ googleSearch: {} }] },
    });

    const text = response.text || "";

    if (text.toLowerCase().includes("nenhuma oportunidade") || text.length < 20) {
      return [];
    }

    const opportunities: Opportunity[] = [];
    const lines = text.split('\n').filter(line => line.trim().length > 20);

    lines.forEach((line, index) => {
      opportunities.push({
        id: Math.random().toString(36).substr(2, 9),
        title: `Oportunidade IA ${index + 1}`,
        date: new Date().toLocaleDateString(),
        description: line.trim(),
        link: url,
        institution: institutionName,
        isNew: true
      });
    });

    return opportunities;

  } catch (error) {
    console.error(`Erro IA ${institutionName}:`, error);
    return [];
  }
}

// 3. FUNÇÃO PRINCIPAL (ROTEADOR)
export async function checkInstitutionUpdates(
  institutionName: string, 
  state: string, 
  url: string,
  timeRange: string = "a partir de 2026"
): Promise<Opportunity[]> {

  // Se for SESC RN, usa a rota oficial
  if (institutionName.toUpperCase().includes("SESC") && 
     (state.toUpperCase() === "RN" || state.toUpperCase().includes("RIO GRANDE"))) {
       const dadosOficiais = await fetchSescRNOfficial(url, institutionName);
       if (dadosOficiais.length > 0) return dadosOficiais;
  }

  // Para todo o resto, usa a IA
  return await fetchWithGeminiSearch(institutionName, state, url, timeRange);
}
