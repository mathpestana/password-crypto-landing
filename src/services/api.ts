import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // Aumentado para 30 segundos
  headers: {
    'Content-Type': 'application/json',
  },
});

// Tipos para as respostas da API
export interface EncryptResponse {
  original: string;
  bcrypt: string;
  sha256: string;
  md5: string;
  aes: {
    encrypted: string;
    key: string;
  };
  note: string;
}

export interface ValidateResponse {
  password: string;
  score: number;
  strength: string;
  feedback: string[];
}

export interface GenerateResponse {
  password: string;
  validation: {
    score: number;
    strength: string;
    feedback: string[];
  };
}

// Função auxiliar para retry
const retryRequest = async <T>(
  requestFn: () => Promise<T>, 
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await requestFn();
    } catch (error) {
      console.log(`Tentativa ${i + 1} falhou:`, error);
      
      if (i === maxRetries - 1) {
        throw error;
      }
      
      // Aguardar antes de tentar novamente
      await new Promise(resolve => setTimeout(resolve, delay * (i + 1)));
    }
  }
  throw new Error('Todas as tentativas falharam');
};

// Funções para consumir a API
export const passwordApi = {
  // Criptografar senha
  encrypt: async (password: string): Promise<EncryptResponse> => {
    console.log('Tentando criptografar senha...');
    return retryRequest(async () => {
      const response = await api.get(`/api/password/encrypt?password=${encodeURIComponent(password)}`);
      console.log('Resposta da criptografia:', response.data);
      return response.data.data; // Extrair apenas o campo 'data'
    });
  },

  // Validar força da senha
  validate: async (password: string): Promise<ValidateResponse> => {
    console.log('Tentando validar senha...');
    return retryRequest(async () => {
      const response = await api.get(`/api/password/validate?password=${encodeURIComponent(password)}`);
      console.log('Resposta da validação:', response.data);
      return response.data.data; // Extrair apenas o campo 'data'
    });
  },

  // Gerar senha aleatória
  generate: async (options: {
    length?: number;
    numbers?: boolean;
    symbols?: boolean;
    uppercase?: boolean;
    lowercase?: boolean;
  } = {}): Promise<GenerateResponse> => {
    console.log('Tentando gerar senha...');
    return retryRequest(async () => {
      const params = new URLSearchParams();
      
      if (options.length) params.append('length', options.length.toString());
      if (options.numbers !== undefined) params.append('numbers', options.numbers.toString());
      if (options.symbols !== undefined) params.append('symbols', options.symbols.toString());
      if (options.uppercase !== undefined) params.append('uppercase', options.uppercase.toString());
      if (options.lowercase !== undefined) params.append('lowercase', options.lowercase.toString());

      const response = await api.get(`/api/password/generate?${params.toString()}`);
      console.log('Resposta da geração:', response.data);
      return response.data.data; // Extrair apenas o campo 'data'
    });
  }
};

export default api;