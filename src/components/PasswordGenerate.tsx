'use client';

import { useState } from 'react';
import { passwordApi, GenerateResponse } from '../services/api';
import { Key } from 'lucide-react';

export default function PasswordGenerate() {
  const [options, setOptions] = useState({
    length: 12,
    numbers: true,
    symbols: true,
    uppercase: true,
    lowercase: true
  });
  const [result, setResult] = useState<GenerateResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setLoading(true);
    setError('');

    try {
      const response = await passwordApi.generate(options);
      setResult(response);
    } catch (err) {
      setError('Erro ao gerar a senha. Tente novamente.');
      console.error('Erro:', err);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const getScoreColor = (score: number) => {
    if (score < 3) return 'text-red-600';
    if (score < 6) return 'text-yellow-600';
    if (score < 8) return 'text-blue-600';
    return 'text-green-600';
  };

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
      
      <div className="flex items-center space-x-3 mb-6">
        <Key className="w-8 h-8 text-purple-400" />
      <h3 className="text-3xl font-bold text-white">Gerar Senha Segura</h3>
      </div>

      <form onSubmit={handleGenerate} className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {/* Comprimento */}
          <div>
            <label htmlFor="length" className="block text-sm font-medium text-gray-300 mb-2">
              Comprimento: {options.length}
            </label>
            <input
              type="range"
              id="length"
              min="4"
              max="128"
              value={options.length}
              onChange={(e) => setOptions({...options, length: parseInt(e.target.value)})}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-300 mt-1">
              <span>4</span>
              <span>128</span>
            </div>
          </div>

          {/* Opções */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">Incluir:</label>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="numbers"
                checked={options.numbers}
                onChange={(e) => setOptions({...options, numbers: e.target.checked})}
                className="mr-2"
              />
              <label htmlFor="numbers" className="text-sm text-gray-300">Números (0-9)</label>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="symbols"
                checked={options.symbols}
                onChange={(e) => setOptions({...options, symbols: e.target.checked})}
                className="mr-2"
              />
              <label htmlFor="symbols" className="text-sm text-gray-300">Símbolos (!@#$%)</label>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="uppercase"
                checked={options.uppercase}
                onChange={(e) => setOptions({...options, uppercase: e.target.checked})}
                className="mr-2"
              />
              <label htmlFor="uppercase" className="text-sm text-gray-300">Maiúsculas (A-Z)</label>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="lowercase"
                checked={options.lowercase}
                onChange={(e) => setOptions({...options, lowercase: e.target.checked})}
                className="mr-2"
              />
              <label htmlFor="lowercase" className="text-sm text-gray-300">Minúsculas (a-z)</label>
            </div>
          </div>
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
          {loading ? 'Gerando...' : 'Gerar Senha'}
        </button>
      </form>

      {result && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">Senha Gerada:</h3>
          
          {/* Senha Gerada */}
          <div className="p-4 bg-gray-50 rounded-md">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium text-gray-700">Senha:</span>
              <button
                onClick={() => copyToClipboard(result.password)}
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                Copiar
              </button>
            </div>
            <p className="text-lg font-mono bg-white p-2 rounded border break-all">
              {result.password}
            </p>
          </div>

          {/* Avaliação da Força */}
          <div className="p-4 bg-gray-50 rounded-md">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium text-gray-700">Força da Senha:</span>
              <span className={`font-bold ${getScoreColor(result.validation.score)}`}>
                {result.validation.score}/10 - {result.validation.strength}
              </span>
            </div>
            
            {/* Barra de Progresso */}
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-300 ${
                  result.validation.score < 3 ? 'bg-red-500' :
                  result.validation.score < 6 ? 'bg-yellow-500' :
                  result.validation.score < 8 ? 'bg-blue-500' : 'bg-green-500'
                }`}
                style={{ width: `${(result.validation.score / 10) * 100}%` }}
              />
            </div>

            {/* Feedback */}
            {result.validation.feedback && result.validation.feedback.length > 0 && (
              <div className="mt-3">
                <h5 className="text-sm font-medium text-gray-700 mb-1">Feedback:</h5>
                <ul className="list-disc pl-5 space-y-1">
                  {result.validation.feedback.map((feedback, index) => (
                    <li key={index} className="text-xs text-gray-600">{feedback}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}