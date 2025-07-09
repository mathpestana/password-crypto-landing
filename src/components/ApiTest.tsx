// src/components/ApiTest.tsx
'use client';

import { useState } from 'react';
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function ApiTest() {
  const [status, setStatus] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const testConnection = async () => {
    setLoading(true);
    setStatus('Testando conexão...');

    try {
      // Teste simples com uma senha
      const response = await axios.get(
        `${API_BASE_URL}/api/password/encrypt?password=test123`,
        { timeout: 30000 }
      );
      
      setStatus('✅ API funcionando! Resposta: ' + JSON.stringify(response.data).substring(0, 100) + '...');
    } catch (error: any) {
      console.error('Erro no teste:', error);
      
      if (error.code === 'ECONNABORTED') {
        setStatus('❌ Timeout - API está demorando muito para responder');
      } else if (error.response?.status) {
        setStatus(`❌ Erro ${error.response.status}: ${error.response.data || error.message}`);
      } else {
        setStatus(`❌ Erro de conexão: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const wakeUpAPI = async () => {
    setLoading(true);
    setStatus('Acordando API (pode demorar até 1 minuto)...');

    try {
      // Tentativa de "acordar" a API
      await axios.get(`${API_BASE_URL}`, { timeout: 60000 });
      setStatus('✅ API acordada! Tente usar as funcionalidades agora.');
    } catch (error: any) {
      setStatus('⚠️ Tentativa de acordar a API concluída. Tente as funcionalidades agora.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
      <h3 className="text-lg font-semibold text-yellow-800 mb-3">
        Teste da API
      </h3>
      
      <div className="space-y-3">
        <div className="flex gap-2">
          <button
            onClick={testConnection}
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Testando...' : 'Testar Conexão'}
          </button>
          
          <button
            onClick={wakeUpAPI}
            disabled={loading}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? 'Acordando...' : 'Acordar API'}
          </button>
        </div>
        
        {status && (
          <div className="p-3 bg-white rounded border">
            <p className="text-sm">{status}</p>
          </div>
        )}
      </div>
      
      <div className="mt-3 text-sm text-yellow-700">
        <p><strong>Dica:</strong> Se a API estiver "dormindo" no Render, clique em "Acordar API" primeiro.</p>
      </div>
    </div>
  );
}