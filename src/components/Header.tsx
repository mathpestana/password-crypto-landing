import React from 'react';
import { Shield } from 'lucide-react';

interface HeaderProps {
  onNavigate: (section: string) => void;
  activeSection: string;
}

export default function Header({ onNavigate, activeSection }: HeaderProps) {
  const navItems = [
    { id: 'encrypt', label: 'Criptografar' },
    { id: 'validate', label: 'Validar' },
    { id: 'generate', label: 'Gerar' }
  ];

  return (
    <header className="bg-black/20 backdrop-blur-md sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2"></div>
            <Shield className="w-8 h-8 text-purple-400" />
            <h1 className="text-2xl font-bold text-white">CryptoPass API</h1>
          
          <nav>
            <ul className="flex space-x-6">
              {navItems.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => onNavigate(item.id)}
                    className={`px-4 py-2 rounded-lg transition-all ${
                      activeSection === item.id
                        ? 'bg-purple-600 text-white' 
                        : 'text-gray-300 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}