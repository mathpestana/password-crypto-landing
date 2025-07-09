'use client';

import { useState } from 'react';
import Header from '../components/Header';
import ApiTest from '../components/ApiTest';
import PasswordEncrypt from '../components/PasswordEncrypt';
import PasswordValidate from '../components/PasswordValidate';
import PasswordGenerate from '../components/PasswordGenerate';
import Hero from '../components/Hero'

export default function Home() {
  const [activeSection, setActiveSection] = useState('encrypt');

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <Header onNavigate={scrollToSection} activeSection={activeSection} />
      
      <main className="container mx-auto px-4 py-8">

      <Hero />

        {/* Teste da API */}
        <ApiTest />

        {/* Seção de Criptografia */}
        <section id="encrypt" className="mb-12">
          <PasswordEncrypt />
        </section>

        {/* Seção de Validação */}
        <section id="validate" className="mb-12">
          <PasswordValidate />
        </section>

        {/* Seção de Geração */}
        <section id="generate" className="mb-12">
          <PasswordGenerate />
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-black/20 backdrop-blur-md py-8">
        <div className="container mx-auto px-6 text-center">
          <p className="text-gray-400">
            ©2025 Matheus Pestana
          </p>
        </div>
      </footer>
    </div>
  );
}