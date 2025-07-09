'use client';

import { useState } from 'react';
import { passwordApi, ValidateResponse } from '../services/api';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';

export default function PasswordValidate() {
  const [password, setPassword] = useState('');
  const [result, setResult] = useState<ValidateResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleValidate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!password.trim()) {
      setError('Por favor, digite uma senha');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await passwordApi.validate(password);
      setResult(response);
    } catch (err) {
      setError('Erro ao validar a senha. Tente novamente.');
      console.error('Erro:', err);
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score < 3) return 'text-red-600';
    if (score < 6) return 'text-yellow-600';
    if (score < 8) return 'text-blue-600';
    return 'text-green-600';
  };

  const getScoreBackground = (score: number) => {
    if (score < 3) return 'bg-red-100';
    if (score < 6) return 'bg-yellow-100';
    if (score < 8) return 'bg-blue-100';
    return 'bg-green-100';
  };

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
       <Eye className="w-8 h-8 text-purple-400" />
        <h3 className="text-3xl font-bold text-white mb-6">Validar Força da Senha</h3>
      
      <form onSubmit={handleValidate} className="mb-6">
        <div className="mb-4">
        
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Digite uma senha para validar"
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
          {loading ? 'Validando...' : 'Validar'}
        </button>
      </form>

      {result && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">Resultado da Validação:</h3>
          
          {/* Score e Classificação */}
          <div className={`p-4 rounded-md ${getScoreBackground(result.score)}`}>
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium text-gray-700">Pontuação:</span>
              <span className={`font-bold text-lg ${getScoreColor(result.score)}`}>
                {result.score}/10
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium text-gray-700">Classificação:</span>
              <span className={`font-semibold ${getScoreColor(result.score)}`}>
                {result.strength}
              </span>
            </div>
          </div>

          {/* Feedback */}
          {result.feedback && result.feedback.length > 0 && (
            <div className="p-4 bg-gray-50 rounded-md">
              <h4 className="font-medium text-gray-700 mb-2">Sugestões de Melhoria:</h4>
              <ul className="list-disc pl-5 space-y-1">
                {result.feedback.map((feedback, index) => (
                  <li key={index} className="text-sm text-gray-600">{feedback}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Barra de Progresso */}
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${
                result.score < 3 ? 'bg-red-500' :
                result.score < 6 ? 'bg-yellow-500' :
                result.score < 8 ? 'bg-blue-500' : 'bg-green-500'
              }`}
              style={{ width: `${(result.score / 10) * 100}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}