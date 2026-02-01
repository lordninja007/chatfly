
import { GoogleGenAI, Type } from "@google/genai";

const FINANCE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    type: { type: Type.STRING, description: 'Tipo da transação: "Receita" ou "Despesa"' },
    description: { type: Type.STRING, description: 'Descrição curta do gasto ou ganho' },
    amount: { type: Type.NUMBER, description: 'Valor numérico da transação' },
    category: { type: Type.STRING, description: 'Categoria (Ex: Alimentação, Salário, Moradia, Transporte, Compras, Lazer, etc)' },
    isPaid: { type: Type.BOOLEAN, description: 'Se o usuário usou termos como "paguei", "pago", "recebi" ou "lançar agora" deve ser true. Se for "pagar" no futuro ou "vencimento", false.' },
    date: { type: Type.STRING, description: 'Data da transação no formato YYYY-MM-DD. Se não mencionado, use a data atual.' },
    dueDate: { type: Type.STRING, description: 'Data de vencimento caso não esteja pago (YYYY-MM-DD). Se for pago, deixe vazio.' }
  },
  required: ['type', 'description', 'amount', 'category', 'isPaid', 'date']
};

const LINK_EXTRACTION_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING, description: 'O título do livro, vídeo ou podcast.' },
    authorOrChannel: { type: Type.STRING, description: 'O nome do autor do livro, o canal do YouTube ou o host do podcast.' },
    totalAmount: { type: Type.NUMBER, description: 'Total de PÁGINAS (se livro) ou DURAÇÃO TOTAL em HORAS decimais (se vídeo/podcast). Ex: 1h30min = 1.5.' },
    coverUrl: { type: Type.STRING, description: 'A URL da imagem da capa do livro ou thumbnail do vídeo/podcast.' },
  },
  required: ['title', 'authorOrChannel', 'totalAmount']
};

export const parseEntityFromInput = async (input: string, model: string, isImage: boolean = false): Promise<any> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const today = new Date().toISOString().split('T')[0];
  const prompt = `Aja como um assistente financeiro ultra-rápido.
  Extraia os dados da transação financeira da entrada do usuário.
  
  REGRAS DE CLASSIFICAÇÃO:
  - "Receita": Dinheiro que entrou (isPaid=true).
  - "Despesa": Dinheiro já gasto (isPaid=true).
  - "A Pagar": Conta futura ou pendente que ainda não chegar a data (isPaid=false).

  Identifique o valor (R$), a descrição, a categoria e a data sugerida baseada em hoje (${today}).
  Entrada: "${input}"`;

  const contents = isImage 
    ? { parts: [{ inlineData: { mimeType: 'image/jpeg', data: input } }, { text: prompt }] }
    : prompt;

  const response = await ai.models.generateContent({
    model: model,
    contents,
    config: {
      responseMimeType: "application/json",
      responseSchema: FINANCE_SCHEMA,
    }
  });

  try {
    return JSON.parse(response.text || '{}');
  } catch (e) {
    console.error("Erro no parser financeiro", e);
    return null;
  }
};

export const extractDataFromUrl = async (url: string): Promise<any> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `Analise detalhadamente este link: ${url}.

  SE FOR UM VÍDEO (YouTube) OU PODCAST (Spotify, etc):
  - Extraia o Título exato do conteúdo.
  - Extraia o Nome do Canal (YouTube) ou Host/Show (Spotify/Podcast). Seja preciso, procure pelo nome do criador ou canal.
  - Extraia a Duração Total convertida para HORAS decimais com precisão (ex: 15 min = 0.25; 1h = 1.0; 1h 30m = 1.5).
  - Extraia a URL da Thumbnail da melhor qualidade possível.

  SE FOR UM LIVRO (Amazon, Skoob, sites de livrarias):
  - Extraia o Título do Livro.
  - Extraia o Nome do Autor.
  - Extraia a Quantidade Total de PÁGINAS.
  - Extraia a URL da Capa do Livro.

  Retorne os dados estritamente no formato JSON solicitado.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: prompt,
    config: {
      tools: [{ googleSearch: {} }],
      responseMimeType: "application/json",
      responseSchema: LINK_EXTRACTION_SCHEMA,
    }
  });

  try {
    return JSON.parse(response.text || '{}');
  } catch (e) {
    console.error("Erro na extração de link", e);
    return null;
  }
};
