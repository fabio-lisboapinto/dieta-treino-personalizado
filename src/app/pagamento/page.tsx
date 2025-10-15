'use client';

import { useState } from 'react';
import { Crown, Check, Zap, Star, Shield, Smartphone, CreditCard, ArrowRight } from 'lucide-react';
import { AuthService } from '../lib/auth';

export default function PagamentoPage() {
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'annual'>('monthly');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'pix'>('card');
  
  const authService = AuthService.getInstance();
  const user = authService.getCurrentUser();
  const premiumStatus = authService.getPremiumStatus();

  const plans = {
    monthly: {
      price: 19.90,
      originalPrice: 29.90,
      period: 'mês',
      discount: '33% OFF',
      total: 19.90,
      description: 'Primeiros 6 meses com desconto'
    },
    annual: {
      price: 199.90,
      originalPrice: 358.80,
      period: 'ano',
      discount: '44% OFF',
      total: 199.90,
      description: 'Melhor oferta - Economia de R$ 158,90'
    }
  };

  const features = [
    {
      icon: <Check className="w-5 h-5" />,
      title: "110+ Alimentos Completos",
      description: "Base nutricional com macros e micronutrientes detalhados"
    },
    {
      icon: <Check className="w-5 h-5" />,
      title: "15+ Modelos de Treino",
      description: "Treinos profissionais para todos os níveis"
    },
    {
      icon: <Check className="w-5 h-5" />,
      title: "Cálculo TMB Personalizado",
      description: "Taxa metabólica baseada no seu perfil único"
    },
    {
      icon: <Check className="w-5 h-5" />,
      title: "Monitoramento Automático",
      description: "Integração completa entre dieta, treino e metas"
    },
    {
      icon: <Check className="w-5 h-5" />,
      title: "Plano Alimentar Organizado",
      description: "Organize refeições por dias e horários"
    },
    {
      icon: <Check className="w-5 h-5" />,
      title: "Plano Semanal de Treinos",
      description: "Organize seus treinos por dia da semana"
    },
    {
      icon: <Check className="w-5 h-5" />,
      title: "Suporte Prioritário",
      description: "Atendimento exclusivo para usuários Premium"
    },
    {
      icon: <Check className="w-5 h-5" />,
      title: "Atualizações Exclusivas",
      description: "Acesso antecipado a novas funcionalidades"
    }
  ];

  const handlePayment = async () => {
    setIsProcessing(true);
    
    // Simular processamento de pagamento
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Simular sucesso do pagamento
    authService.upgradeToPremium();
    
    setIsProcessing(false);
    
    // Mostrar sucesso e redirecionar
    alert('🎉 Pagamento realizado com sucesso! Bem-vindo ao FitTracker Premium!');
    window.location.href = '/';
  };

  if (premiumStatus.isPremium) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
            <Crown className="w-10 h-10 text-white" />
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Você já é Premium! 🎉
          </h1>
          
          <p className="text-xl text-gray-600 mb-8">
            Aproveite todas as funcionalidades exclusivas do FitTracker
          </p>

          <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Shield className="w-6 h-6 text-green-600" />
              <span className="text-lg font-semibold text-green-800">Status Premium Ativo</span>
            </div>
            
            {premiumStatus.daysRemaining && (
              <p className="text-green-700">
                Seu plano expira em <strong>{premiumStatus.daysRemaining} dias</strong>
              </p>
            )}
            
            {premiumStatus.expiresAt && (
              <p className="text-sm text-green-600 mt-2">
                Renovação automática em {new Date(premiumStatus.expiresAt).toLocaleDateString('pt-BR')}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {features.slice(0, 4).map((feature, index) => (
              <div key={index} className="flex items-center gap-3 p-4 bg-white rounded-lg shadow-sm">
                <div className="text-green-500">{feature.icon}</div>
                <div className="text-left">
                  <p className="font-medium text-gray-900">{feature.title}</p>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => window.location.href = '/'}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Voltar ao App
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="bg-gradient-to-r from-orange-400 to-red-500 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
            <Crown className="w-10 h-10 text-white" />
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Desbloqueie o FitTracker Premium
          </h1>
          
          <p className="text-xl text-gray-600 mb-6">
            Transforme seu corpo com as ferramentas mais avançadas de dieta e treino
          </p>

          <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 p-4 rounded-lg max-w-md mx-auto">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Star className="w-5 h-5 text-orange-500" />
              <span className="font-semibold text-orange-800">Oferta Limitada!</span>
            </div>
            <p className="text-orange-700 text-sm">
              <strong>33% OFF</strong> nos primeiros 6 meses • Depois R$ 29,90/mês
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Planos */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Escolha seu plano</h2>
            
            {/* Plano Mensal */}
            <div 
              className={`border-2 rounded-lg p-6 cursor-pointer transition-all ${
                selectedPlan === 'monthly' 
                  ? 'border-orange-500 bg-orange-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setSelectedPlan('monthly')}
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Plano Mensal</h3>
                  <p className="text-sm text-gray-600">{plans.monthly.description}</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500 line-through">
                      R$ {plans.monthly.originalPrice.toFixed(2)}
                    </span>
                    <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
                      {plans.monthly.discount}
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-orange-600">
                    R$ {plans.monthly.price.toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-600">por mês</p>
                </div>
              </div>
            </div>

            {/* Plano Anual */}
            <div 
              className={`border-2 rounded-lg p-6 cursor-pointer transition-all relative ${
                selectedPlan === 'annual' 
                  ? 'border-green-500 bg-green-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setSelectedPlan('annual')}
            >
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-green-500 text-white text-xs px-3 py-1 rounded-full font-medium">
                  MAIS POPULAR
                </span>
              </div>
              
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Plano Anual</h3>
                  <p className="text-sm text-gray-600">{plans.annual.description}</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500 line-through">
                      R$ {plans.annual.originalPrice.toFixed(2)}
                    </span>
                    <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                      {plans.annual.discount}
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-green-600">
                    R$ {plans.annual.price.toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-600">por ano</p>
                </div>
              </div>
            </div>

            {/* Método de Pagamento */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Método de Pagamento</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setPaymentMethod('card')}
                  className={`p-4 border-2 rounded-lg flex items-center justify-center gap-2 transition-all ${
                    paymentMethod === 'card'
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <CreditCard className="w-5 h-5" />
                  Cartão
                </button>
                
                <button
                  onClick={() => setPaymentMethod('pix')}
                  className={`p-4 border-2 rounded-lg flex items-center justify-center gap-2 transition-all ${
                    paymentMethod === 'pix'
                      ? 'border-green-500 bg-green-50 text-green-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Smartphone className="w-5 h-5" />
                  PIX
                </button>
              </div>
            </div>

            {/* Botão de Pagamento */}
            <button
              onClick={handlePayment}
              disabled={isProcessing}
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-4 px-6 rounded-lg hover:from-orange-600 hover:to-red-600 transition-all font-medium text-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Processando...
                </>
              ) : (
                <>
                  <Crown className="w-5 h-5" />
                  Assinar Premium - R$ {plans[selectedPlan].total.toFixed(2)}
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>

            <p className="text-xs text-gray-500 text-center">
              Pagamento seguro • Cancele a qualquer momento • Sem compromisso
            </p>
          </div>

          {/* Funcionalidades */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              O que você ganha com o Premium
            </h2>
            
            <div className="space-y-4">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start gap-4 p-4 bg-white rounded-lg shadow-sm border">
                  <div className="text-green-500 mt-0.5">{feature.icon}</div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">{feature.title}</h4>
                    <p className="text-sm text-gray-600">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Garantia */}
            <div className="bg-gradient-to-r from-blue-50 to-green-50 p-6 rounded-lg border border-blue-200">
              <div className="flex items-center gap-3 mb-3">
                <Shield className="w-6 h-6 text-blue-600" />
                <h3 className="text-lg font-semibold text-blue-900">Garantia de 7 dias</h3>
              </div>
              <p className="text-blue-800 text-sm">
                Não ficou satisfeito? Devolvemos 100% do seu dinheiro nos primeiros 7 dias, 
                sem perguntas e sem burocracia.
              </p>
            </div>

            {/* Depoimentos */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="flex items-center gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
                <span className="ml-2 text-sm text-gray-600">4.9/5 (2.847 avaliações)</span>
              </div>
              <blockquote className="text-gray-700 italic mb-3">
                "O FitTracker Premium mudou completamente minha relação com a dieta e treino. 
                Em 3 meses perdi 8kg de forma saudável e sustentável!"
              </blockquote>
              <cite className="text-sm text-gray-600">— Maria Silva, usuária Premium</cite>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}