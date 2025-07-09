import React from 'react';
import { motion } from 'framer-motion';
import { Lock, Eye, Key } from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <section className="py-20 px-6">
      <div className="container mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-5xl font-bold text-white mb-6">
            Segurança de Senhas
            <span className="block text-purple-400">Simplificada</span>
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            API completa para criptografia, validação e geração de senhas seguras. 
            Proteja seus dados com os melhores algoritmos disponíveis.
          </p>
          <div className="flex justify-center space-x-8">
            <div className="flex items-center space-x-2 text-purple-400">
              <Lock className="w-6 h-6" />
              <span>Criptografia Segura</span>
            </div>
            <div className="flex items-center space-x-2 text-purple-400">
              <Eye className="w-6 h-6" />
              <span>Validação Inteligente</span>
            </div>
            <div className="flex items-center space-x-2 text-purple-400">
              <Key className="w-6 h-6" />
              <span>Geração Aleatória</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;