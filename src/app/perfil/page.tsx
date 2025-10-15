'use client';

import { useState, useEffect } from 'react';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { UserProfile } from '../../lib/types';
import { User, Calculator, Target, TrendingUp, Save, Crown } from 'lucide-react';
import { PremiumButton, PremiumFeature } from '../../components/PremiumComponents';

export default function PerfilPage() {
  const [profile, setProfile] = useLocalStorage<UserProfile | null>('userProfile', null);
  const [isClient, setIsClient] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: 'male' as 'male' | 'female',
    weight: '',
    height: '',
    activityLevel: 'moderate' as 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active',
    goal: 'maintain' as 'lose' | 'maintain' | 'gain',
    targetWeight: '',
    targetDate: ''
  });

  useEffect(() => {
    setIsClient(true);
    if (profile) {
      setFormData({
        name: profile.name,
        age: profile.age.toString(),
        gender: profile.gender,
        weight: profile.weight.toString(),
        height: profile.height.toString(),
        activityLevel: profile.activityLevel,
        goal: profile.goal,
        targetWeight: profile.targetWeight?.toString() || '',
        targetDate: profile.targetDate || ''
      });
    }
  }, [profile]);

  const calculateTMB = () => {
    const weight = parseFloat(formData.weight);
    const height = parseFloat(formData.height);
    const age = parseInt(formData.age);

    if (!weight || !height || !age) return 0;

    // Fórmula de Harris-Benedict revisada
    let tmb;
    if (formData.gender === 'male') {
      tmb = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
    } else {
      tmb = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
    }

    // Fator de atividade
    const activityFactors = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      very_active: 1.9
    };

    return Math.round(tmb * activityFactors[formData.activityLevel]);
  };

  const calculateMacros = (calories: number) => {
    let proteinRatio, carbRatio, fatRatio;

    switch (formData.goal) {
      case 'lose':
        proteinRatio = 0.35; // 35% proteína para preservar massa muscular
        carbRatio = 0.35;    // 35% carboidratos
        fatRatio = 0.30;     // 30% gordura
        break;
      case 'gain':
        proteinRatio = 0.25; // 25% proteína
        carbRatio = 0.50;    // 50% carboidratos para energia
        fatRatio = 0.25;     // 25% gordura
        break;
      default: // maintain
        proteinRatio = 0.30; // 30% proteína
        carbRatio = 0.40;    // 40% carboidratos
        fatRatio = 0.30;     // 30% gordura
    }

    return {
      protein: Math.round((calories * proteinRatio) / 4), // 4 kcal por grama
      carbs: Math.round((calories * carbRatio) / 4),      // 4 kcal por grama
      fat: Math.round((calories * fatRatio) / 9)          // 9 kcal por grama
    };
  };

  const adjustCaloriesForGoal = (tmb: number) => {
    switch (formData.goal) {
      case 'lose':
        return Math.round(tmb * 0.85); // Déficit de 15%
      case 'gain':
        return Math.round(tmb * 1.15); // Superávit de 15%
      default:
        return tmb; // Manutenção
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const tmb = calculateTMB();
    const targetCalories = adjustCaloriesForGoal(tmb);
    const macros = calculateMacros(targetCalories);

    const newProfile: UserProfile = {
      name: formData.name,
      age: parseInt(formData.age),
      gender: formData.gender,
      weight: parseFloat(formData.weight),
      height: parseFloat(formData.height),
      activityLevel: formData.activityLevel,
      goal: formData.goal,
      targetWeight: formData.targetWeight ? parseFloat(formData.targetWeight) : undefined,
      targetDate: formData.targetDate || undefined,
      tmb,
      targetCalories,
      targetProtein: macros.protein,
      targetCarbs: macros.carbs,
      targetFat: macros.fat,
      createdAt: profile?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setProfile(newProfile);
    alert('✅ Perfil salvo com sucesso! Sua TMB foi calculada automaticamente.');
  };

  if (!isClient) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <User className="w-16 h-16 mx-auto opacity-30 text-gray-400" />
          <p className="text-gray-500 text-lg mt-4">Carregando...</p>
        </div>
      </div>
    );
  }

  const tmb = calculateTMB();
  const targetCalories = adjustCaloriesForGoal(tmb);
  const macros = calculateMacros(targetCalories);

  const activityLabels = {
    sedentary: 'Sedentário (pouco ou nenhum exercício)',
    light: 'Levemente ativo (exercício leve 1-3 dias/semana)',
    moderate: 'Moderadamente ativo (exercício moderado 3-5 dias/semana)',
    active: 'Muito ativo (exercício intenso 6-7 dias/semana)',
    very_active: 'Extremamente ativo (exercício muito intenso, trabalho físico)'
  };

  const goalLabels = {
    lose: 'Perder peso (emagrecimento)',
    maintain: 'Manter peso atual',
    gain: 'Ganhar peso (ganho de massa)'
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Meu Perfil</h1>
        {profile && (
          <div className="text-sm text-gray-600">
            Última atualização: {new Date(profile.updatedAt).toLocaleDateString('pt-BR')}
          </div>
        )}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Formulário */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <User className="w-5 h-5 text-blue-600" />
            Informações Pessoais
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nome completo
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Idade
                </label>
                <input
                  type="number"
                  value={formData.age}
                  onChange={(e) => setFormData({...formData, age: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="15"
                  max="100"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sexo
                </label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({...formData, gender: e.target.value as 'male' | 'female'})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="male">Masculino</option>
                  <option value="female">Feminino</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Peso atual (kg)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.weight}
                  onChange={(e) => setFormData({...formData, weight: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="30"
                  max="300"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Altura (cm)
                </label>
                <input
                  type="number"
                  value={formData.height}
                  onChange={(e) => setFormData({...formData, height: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="100"
                  max="250"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nível de atividade física
              </label>
              <select
                value={formData.activityLevel}
                onChange={(e) => setFormData({...formData, activityLevel: e.target.value as any})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {Object.entries(activityLabels).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Objetivo principal
              </label>
              <select
                value={formData.goal}
                onChange={(e) => setFormData({...formData, goal: e.target.value as any})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {Object.entries(goalLabels).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>

            <PremiumFeature
              feature="Metas Personalizadas"
              description="Defina peso alvo e prazo para acompanhar seu progresso de forma inteligente"
            >
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Peso alvo (kg) - opcional
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.targetWeight}
                    onChange={(e) => setFormData({...formData, targetWeight: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="30"
                    max="300"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Data alvo - opcional
                  </label>
                  <input
                    type="date"
                    value={formData.targetDate}
                    onChange={(e) => setFormData({...formData, targetDate: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
              </div>
            </PremiumFeature>

            <PremiumButton
              onClick={handleSubmit}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2"
              feature="Salvar Perfil e Calcular TMB"
              description="Salve seu perfil completo e tenha acesso ao cálculo personalizado da sua Taxa Metabólica Basal"
            >
              <Save className="w-5 h-5" />
              Salvar Perfil e Calcular TMB
            </PremiumButton>
          </form>
        </div>

        {/* Resultados TMB */}
        <div className="space-y-6">
          <PremiumFeature
            feature="Cálculo TMB Personalizado"
            description="Tenha acesso ao cálculo preciso da sua Taxa Metabólica Basal baseado no seu perfil único"
          >
            <div className="bg-gradient-to-r from-blue-50 to-green-50 p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <Calculator className="w-5 h-5 text-blue-600" />
                Sua TMB Personalizada
              </h2>

              {tmb > 0 ? (
                <div className="space-y-4">
                  <div className="bg-white p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Taxa Metabólica Basal (TMB)</span>
                      <TrendingUp className="w-4 h-4 text-blue-500" />
                    </div>
                    <p className="text-2xl font-bold text-blue-600">{tmb} kcal/dia</p>
                    <p className="text-xs text-gray-500">Calorias que seu corpo queima em repouso</p>
                  </div>

                  <div className="bg-white p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Meta Calórica Diária</span>
                      <Target className="w-4 h-4 text-green-500" />
                    </div>
                    <p className="text-2xl font-bold text-green-600">{targetCalories} kcal/dia</p>
                    <p className="text-xs text-gray-500">
                      Baseado no seu objetivo: {goalLabels[formData.goal]}
                    </p>
                  </div>

                  <div className="bg-white p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-700 mb-3">Distribuição de Macronutrientes</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Proteína</span>
                        <span className="font-medium text-green-600">{macros.protein}g/dia</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Carboidratos</span>
                        <span className="font-medium text-yellow-600">{macros.carbs}g/dia</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Gordura</span>
                        <span className="font-medium text-red-600">{macros.fat}g/dia</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Calculator className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-500">Preencha seus dados para calcular sua TMB</p>
                </div>
              )}
            </div>
          </PremiumFeature>

          {/* Dicas baseadas no objetivo */}
          {formData.goal && (
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Crown className="w-5 h-5 text-orange-500" />
                Dicas para seu Objetivo
              </h3>
              
              {formData.goal === 'lose' && (
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-2">
                    <span className="text-green-500">✓</span>
                    <span>Mantenha um déficit calórico moderado de 15% para preservar massa muscular</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-green-500">✓</span>
                    <span>Priorize proteínas (35% das calorias) para manter a saciedade</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-green-500">✓</span>
                    <span>Combine exercícios de força com cardio moderado</span>
                  </div>
                </div>
              )}

              {formData.goal === 'gain' && (
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-2">
                    <span className="text-green-500">✓</span>
                    <span>Mantenha um superávit calórico de 15% para ganho de massa limpa</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-green-500">✓</span>
                    <span>Consuma carboidratos suficientes (50%) para energia nos treinos</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-green-500">✓</span>
                    <span>Foque em treinos de força com progressão de carga</span>
                  </div>
                </div>
              )}

              {formData.goal === 'maintain' && (
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-2">
                    <span className="text-green-500">✓</span>
                    <span>Mantenha o equilíbrio calórico consumindo sua TMB ajustada</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-green-500">✓</span>
                    <span>Distribua os macros de forma equilibrada (30/40/30)</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-green-500">✓</span>
                    <span>Mantenha consistência nos exercícios e alimentação</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}