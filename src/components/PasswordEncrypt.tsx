'use client';

import { useState } from 'react';
import { passwordApi, EncryptResponse } from '../services/api';
import { Lock } from 'lucide-react';

export default function PasswordEncrypt() {
  const [password, setPassword] = useState('');
  const [result, setResult] = useState<EncryptResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleEncrypt = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!password.trim()) {
      setError('Por favor, digite uma senha');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      console.log('Iniciando criptografia...');
      const response = await passwordApi.encrypt(password);
      console.log('Criptografia concluída:', response);
      setResult(response);
    } catch (err: any) {
      console.error('Erro completo:', err);
      
      let errorMessage = 'Erro ao criptografar a senha. ';
      
      if (err.code === 'ECONNABORTED' || err.message?.includes('timeout')) {
        errorMessage += 'A API está demorando para responder. Tente novamente em alguns segundos.';
      } else if (err.response?.status === 500) {
        errorMessage += 'Erro interno do servidor. Tente novamente.';
      } else if (err.response?.status === 404) {
        errorMessage += 'Endpoint não encontrado. Verifique se a API está funcionando.';
      } else if (err.message?.includes('Network Error')) {
        errorMessage += 'Erro de rede. Verifique sua conexão.';
      } else {
        errorMessage += 'Tente novamente.';
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
      
      <div className="flex items-center space-x-3 mb-6">
        <Lock className="w-8 h-8 text-purple-400" />
      <h3 className="text-3xl font-bold text-white">Gerar Senha Segura</h3>
      </div>
      
      <form onSubmit={handleEncrypt} className="mb-6">
        <div className="mb-4">
      
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
           className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Digite uma senha para criptografar..."
          />
        </div>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
        
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Criptografando...' : 'Criptografar'}
        </button>
      </form>

      {result && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">Resultados:</h3>
          
          {/* Senha Original */}
          <div className="p-4 bg-gray-50 rounded-md">
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-medium text-gray-700">SENHA ORIGINAL</h4>
              <button
                onClick={() => copyToClipboard(result.original)}
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                Copiar
              </button>
            </div>
            <p className="text-sm text-gray-600 font-mono break-all">{result.original}</p>
          </div>

          {/* BCrypt */}
          <div className="p-4 bg-gray-50 rounded-md">
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-medium text-gray-700">BCRYPT (Recomendado)</h4>
              <button
                onClick={() => copyToClipboard(result.bcrypt)}
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                Copiar
              </button>
            </div>
            <p className="text-sm text-gray-600 font-mono break-all">{result.bcrypt}</p>
          </div>

          {/* SHA-256 */}
          <div className="p-4 bg-gray-50 rounded-md">
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-medium text-gray-700">SHA-256</h4>
              <button
                onClick={() => copyToClipboard(result.sha256)}
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                Copiar
              </button>
            </div>
            <p className="text-sm text-gray-600 font-mono break-all">{result.sha256}</p>
          </div>

          {/* MD5 */}
          <div className="p-4 bg-gray-50 rounded-md">
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-medium text-gray-700">MD5</h4>
              <button
                onClick={() => copyToClipboard(result.md5)}
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                Copiar
              </button>
            </div>
            <p className="text-sm text-gray-600 font-mono break-all">{result.md5}</p>
          </div>

          {/* AES */}
          <div className="p-4 bg-gray-50 rounded-md">
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-medium text-gray-700">AES</h4>
              <button
                onClick={() => copyToClipboard(result.aes.encrypted)}
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                Copiar Encrypted
              </button>
            </div>
            <div className="space-y-2">
              <div>
                <span className="text-xs text-gray-500">Encrypted:</span>
                <p className="text-sm text-gray-600 font-mono break-all">{result.aes.encrypted}</p>
              </div>
              <div>
                <span className="text-xs text-gray-500">Key:</span>
                <p className="text-sm text-gray-600 font-mono break-all">{result.aes.key}</p>
              </div>
            </div>
          </div>

          {/* Nota sobre MD5 */}
          {result.note && (
            <div className="p-3 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded">
              <p className="text-sm"><strong>Nota:</strong> {result.note}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}