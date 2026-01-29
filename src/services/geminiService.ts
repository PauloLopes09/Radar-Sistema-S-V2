import { Opportunity } from "../types";

/**
 * 1. CONECTOR OFICIAL: SESC RIO GRANDE DO NORTE
 * Endpoint Oficial: http://transparencia.rn.sesc.com.br/transparencia/api/licitacoes
 * Nota: Usa Proxy para evitar bloqueio de Misto de Conteúdo (HTTP vs HTTPS)
 */
async function fetchSescRNOfficial(url: string, institutionName: string): Promise<Opportunity[]> {
  try {
    // Forçamos o ano atual do sistema (2026)
    const anoAlvo = 2026;
    console.log(`📡 Acessando API Oficial SESC RN para ${anoAlvo}...`);

    const apiUrl = `http://transparencia.rn.sesc.com.br/transparencia/api/licitacoes?ano=${anoAlvo}`;
    // Proxy AllOrigins para permitir que o front (HTTPS) leia a API (HTTP)
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(apiUrl)}`;

    const response = await fetch(proxyUrl);
    const data = await response.json();

    if (!data.contents) return [];

    const licitacoes = JSON.parse(data.contents);

    // Validação de segurança
    if (!Array.isArray(licitacoes) || licitacoes.length === 0) {
      return [{
        id: "msg-empty",
        title: "Nenhuma licitação encontrada",
        description: `A API oficial do SESC RN não retornou registros para o ano de ${anoAlvo} até o momento.`,
        date: new Date().toLocaleDateString(),
        link: url,
        institution: institutionName,
        isNew: false
      }];
    }

    // Mapeamento: Transforma o JSON do SESC no formato do nosso App
    return licitacoes.map((item: any, index: number) => ({
      id: `sesc-rn-${item.id || index}`,
      title: `Processo ${item.id} (${item.modalidade || 'Licitação'})`,
      description: item.objeto || "Objeto não detalhado na API.",
      date: item.data_abertura || item.data_publicacao || "Data n/a",
      // Tenta pegar o link do primeiro anexo, senão usa o link do portal
      link: item.anexos && item.anexos.length > 0 ? item.anexos[0].url : url,
      institution: institutionName,
      isNew: true // Destaca como novo
    }));

  } catch (error) {
    console.error("Erro no conector SESC RN:", error);
    return [{
      id: "err-sesc",
      title: "Erro de Conexão",
      description: "Não foi possível conectar ao servidor de Transparência do SESC RN. O site pode estar fora do ar.",
      date: new Date().toLocaleDateString(),
      link: url,
      institution: institutionName,
      isNew: false
    }];
  }
}

/**
 * 🚧 PLACEHOLDER: MENSAGEM PADRÃO
 * Retornada quando tentamos buscar uma instituição que ainda não tem API configurada.
 */
async function apiNotConfigured(institutionName: string): Promise<Opportunity[]> {
  return [{
    id: "sys-msg",
    title: "Integração via API Pendente",
    description: `Ainda não configuramos o endpoint oficial para ${institutionName}. Por favor, adicione o conector no código (geminiService.ts).`,
    date: new Date().toLocaleDateString(),
    link: "#",
    institution: institutionName,
    isNew: false
  }];
}

/**
 * 🔀 ROTEADOR CENTRAL (HUB DE APIs)
 * Direciona o pedido para a função correta baseada no nome da instituição.
 */
export async function checkInstitutionUpdates(
  institutionName: string, 
  state: string, 
  url: string,
  timeRange: string // Mantido para compatibilidade, mas ignorado nas APIs fixas
): Promise<Opportunity[]> {

  const nameUpper = institutionName.toUpperCase();
  const stateUpper = state.toUpperCase();

  // --- ROTA 1: SESC RN ---
  if (nameUpper.includes("SESC") && (stateUpper === "RN" || stateUpper.includes("RIO GRANDE"))) {
    return await fetchSescRNOfficial(url, institutionName);
  }

  // --- ROTA 2: Futuro SENAC PE ---
  // if (nameUpper.includes("SENAC") && stateUpper.includes("PE")) {
  //   return await fetchSenacPEOfficial(url);
  // }

  // --- ROTA PADRÃO (Sem API definida) ---
  return await apiNotConfigured(institutionName);
}
