import Link from 'next/link';
import { Dumbbell, Apple, BarChart3, MapPin, TrendingUp, Target, User, Calculator, Crown, Zap } from 'lucide-react';

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          Bem-vindo ao <span className="text-blue-600">FitTracker</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
          Seu aplicativo completo para dieta e treino, focado em ganho de massa muscular e emagrecimento.
          Agora com mais de 110 alimentos, calculadora de TMB e modelos profissionais de treino.
        </p>
        
        <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 p-4 rounded-lg max-w-2xl mx-auto mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Crown className="w-5 h-5 text-orange-500" />
            <span className="font-semibold text-orange-800">Experimente GRÁTIS todas as funcionalidades!</span>
          </div>
          <p className="text-orange-700 text-sm mb-3">
            Acesse tudo: TMB personalizada, 110+ alimentos, 15+ treinos profissionais e monitoramento integrado.
            <br />
            <strong>Para finalizar e salvar, assine Premium por apenas R$ 19,90/mês</strong>
          </p>
          <Link 
            href="/pagamento"
            className="inline-block bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition-colors font-medium"
          >
            Ver Plano Premium
          </Link>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        <Link href="/perfil" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border-l-4 border-purple-500">
          <div className="flex items-center gap-3 mb-4">
            <Calculator className="w-12 h-12 text-purple-500" />
            <div>
              <h3 className="text-xl font-semibold">Perfil & TMB</h3>
              <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">GRÁTIS</span>
            </div>
          </div>
          <p className="text-gray-600">Calcule sua Taxa Metabólica Basal e defina metas personalizadas baseadas em idade, peso e objetivo</p>
          <div className="mt-3 text-xs text-purple-600">
            ✨ Experimente grátis • Premium para salvar
          </div>
        </Link>

        <Link href="/alimentos" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border-l-4 border-green-500">
          <div className="flex items-center gap-3 mb-4">
            <Apple className="w-12 h-12 text-green-500" />
            <div>
              <h3 className="text-xl font-semibold">Base de Alimentos</h3>
              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">110+ ALIMENTOS</span>
            </div>
          </div>
          <p className="text-gray-600">Base completa com macros e micronutrientes detalhados para dietas de ganho de massa e emagrecimento</p>
          <div className="mt-3 text-xs text-green-600">
            ✨ Navegue grátis • Premium para adicionar ao plano
          </div>
        </Link>

        <Link href="/treinos" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border-l-4 border-blue-500">
          <div className="flex items-center gap-3 mb-4">
            <Dumbbell className="w-12 h-12 text-blue-500" />
            <div>
              <h3 className="text-xl font-semibold">Modelos de Treino</h3>
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">15+ MODELOS</span>
            </div>
          </div>
          <p className="text-gray-600">Treinos profissionais para todos os grupos musculares, do iniciante ao avançado</p>
          <div className="mt-3 text-xs text-blue-600">
            ✨ Veja todos grátis • Premium para salvar
          </div>
        </Link>

        <Link href="/monitoramento" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border-l-4 border-orange-500">
          <div className="flex items-center gap-3 mb-4">
            <BarChart3 className="w-12 h-12 text-orange-500" />
            <div>
              <h3 className="text-xl font-semibold">Monitoramento</h3>
              <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full">INTEGRADO</span>
            </div>
          </div>
          <p className="text-gray-600">Acompanhamento automático integrando alimentos, treinos e metas nutricionais</p>
          <div className="mt-3 text-xs text-orange-600">
            ✨ Funciona automaticamente com dados Premium
          </div>
        </Link>

        <Link href="/mercados" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border-l-4 border-red-500">
          <div className="flex items-center gap-3 mb-4">
            <MapPin className="w-12 h-12 text-red-500" />
            <div>
              <h3 className="text-xl font-semibold">Mercados</h3>
              <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full flex items-center gap-1">
                <Crown className="w-3 h-3" />
                PREMIUM
              </span>
            </div>
          </div>
          <p className="text-gray-600">Encontre mercados próximos com melhores preços dos produtos da sua dieta</p>
          <div className="mt-3 text-xs text-red-600">
            🔒 Recurso exclusivo Premium
          </div>
        </Link>

        <Link href="/pagamento" className="bg-gradient-to-r from-yellow-400 to-orange-500 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow text-white">
          <div className="flex items-center gap-3 mb-4">
            <Crown className="w-12 h-12 text-white" />
            <div>
              <h3 className="text-xl font-semibold">Premium</h3>
              <span className="text-xs bg-white text-orange-600 px-2 py-1 rounded-full font-medium">PROMOÇÃO</span>
            </div>
          </div>
          <p className="text-white/90 mb-3">Desbloqueie todas as funcionalidades por apenas R$ 19,90/mês</p>
          <div className="text-sm text-white/80">
            ✓ 110+ alimentos ✓ TMB personalizada ✓ 15+ treinos ✓ Monitoramento integrado
          </div>
        </Link>
      </div>

      {/* Como Funciona */}
      <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-8 mb-12">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4 text-gray-900">Como Funciona o FitTracker</h2>
          <p className="text-xl text-gray-700">
            Sistema inteligente que funciona em 3 passos simples
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-md">
              <span className="text-2xl font-bold text-blue-600">1</span>
            </div>
            <h3 className="text-xl font-semibold mb-3 text-gray-900">Experimente Grátis</h3>
            <p className="text-gray-600">
              Acesse todas as funcionalidades: calcule sua TMB, navegue pelos 110+ alimentos, 
              veja os 15+ modelos de treino profissionais
            </p>
          </div>

          <div className="text-center">
            <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-md">
              <span className="text-2xl font-bold text-green-600">2</span>
            </div>
            <h3 className="text-xl font-semibold mb-3 text-gray-900">Use Livremente</h3>
            <p className="text-gray-600">
              Teste o cálculo de TMB, explore a base de alimentos, veja treinos profissionais, 
              entenda como o monitoramento funciona
            </p>
          </div>

          <div className="text-center">
            <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-md">
              <span className="text-2xl font-bold text-orange-600">3</span>
            </div>
            <h3 className="text-xl font-semibold mb-3 text-gray-900">Assine para Finalizar</h3>
            <p className="text-gray-600">
              Quando quiser salvar seu plano alimentar, treinos e acompanhar progresso, 
              assine Premium por R$ 19,90/mês
            </p>
          </div>
        </div>
      </div>

      {/* Seção de Funcionalidades Premium */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg p-8 mb-12">
        <div className="text-center mb-8">
          <Zap className="w-16 h-16 mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-4">Funcionalidades Premium</h2>
          <p className="text-xl text-blue-100">
            Tudo que você precisa para alcançar seus objetivos de forma profissional
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="bg-white/10 rounded-lg p-4 mb-3">
              <Calculator className="w-8 h-8 mx-auto text-blue-200" />
            </div>
            <h3 className="font-semibold mb-2">TMB Personalizada</h3>
            <p className="text-sm text-blue-100">Cálculo preciso baseado em seus dados pessoais</p>
          </div>

          <div className="text-center">
            <div className="bg-white/10 rounded-lg p-4 mb-3">
              <Apple className="w-8 h-8 mx-auto text-green-200" />
            </div>
            <h3 className="font-semibold mb-2">110+ Alimentos</h3>
            <p className="text-sm text-blue-100">Base completa com micro e macronutrientes</p>
          </div>

          <div className="text-center">
            <div className="bg-white/10 rounded-lg p-4 mb-3">
              <Dumbbell className="w-8 h-8 mx-auto text-purple-200" />
            </div>
            <h3 className="font-semibold mb-2">15+ Treinos</h3>
            <p className="text-sm text-blue-100">Modelos profissionais para todos os níveis</p>
          </div>

          <div className="text-center">
            <div className="bg-white/10 rounded-lg p-4 mb-3">
              <BarChart3 className="w-8 h-8 mx-auto text-orange-200" />
            </div>
            <h3 className="font-semibold mb-2">Integração Total</h3>
            <p className="text-sm text-blue-100">Monitoramento automático e inteligente</p>
          </div>
        </div>
      </div>

      {/* Call to Action Final */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-8 text-center">
        <Target className="w-16 h-16 mx-auto mb-4 text-green-600" />
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Pronto para Transformar seu Corpo?</h2>
        <p className="text-xl mb-6 text-gray-700">
          Comece agora mesmo explorando todas as funcionalidades gratuitamente
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href="/perfil"
            className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Começar Grátis Agora
          </Link>
          <Link 
            href="/pagamento"
            className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-3 rounded-lg hover:from-orange-600 hover:to-red-600 transition-all font-medium"
          >
            Ver Plano Premium
          </Link>
        </div>
        
        <div className="mt-6 text-sm text-gray-600">
          ✨ <strong>Experimente tudo grátis</strong> • Assine Premium apenas quando quiser salvar seus dados
        </div>
      </div>
    </div>
  );
}