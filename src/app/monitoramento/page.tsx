'use client';

import { useState, useEffect } from 'react';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { DailyProgress, UserProfile, SelectedFood, Workout, IntegratedProgress } from '../../lib/types';
import { BarChart3, TrendingUp, Calendar, Target, Activity, Zap, AlertCircle, CheckCircle, Trophy } from 'lucide-react';

export default function MonitoramentoPage() {
  const [progress, setProgress] = useLocalStorage<DailyProgress[]>('progress', []);
  const [integratedProgress, setIntegratedProgress] = useLocalStorage<IntegratedProgress[]>('integratedProgress', []);
  const [userProfile] = useLocalStorage<UserProfile | null>('userProfile', null);
  const [selectedFoods] = useLocalStorage<SelectedFood[]>('selectedFoods', []);
  const [workouts] = useLocalStorage<Workout[]>('workouts', []);
  const [isClient, setIsClient] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    weight: '',
    notes: ''
  });

  // Evitar hydration mismatch
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Cálculo automático dos nutrientes dos alimentos selecionados
  const calculateTotalNutrients = () => {
    if (!isClient) return { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 };
    
    return selectedFoods.reduce((total, sf) => ({
      calories: total.calories + sf.totalNutrients.calories,
      protein: total.protein + sf.totalNutrients.protein,
      carbs: total.carbs + sf.totalNutrients.carbs,
      fat: total.fat + sf.totalNutrients.fat,
      fiber: total.fiber + sf.totalNutrients.fiber,
    }), { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 });
  };

  // Cálculo automático das calorias queimadas dos treinos
  const calculateWorkoutCalories = () => {
    if (!isClient) return 0;
    
    const todayWorkouts = workouts.filter(w => 
      new Date(w.date).toDateString() === new Date().toDateString()
    );
    return todayWorkouts.reduce((total, workout) => 
      total + workout.exercises.reduce((sum, ex) => sum + (ex.caloriesBurned || 0), 0), 0
    );
  };

  // Cálculo do progresso da meta
  const calculateGoalProgress = () => {
    if (!isClient || !userProfile?.targetWeight || !userProfile?.targetDate) return null;
    
    const currentWeight = userProfile.weight;
    const targetWeight = userProfile.targetWeight;
    const startWeight = userProfile.weight;
    
    const totalWeightChange = Math.abs(targetWeight - startWeight);
    const currentWeightChange = Math.abs(currentWeight - startWeight);
    const progressPercent = totalWeightChange > 0 ? (currentWeightChange / totalWeightChange) * 100 : 0;
    
    const targetDate = new Date(userProfile.targetDate);
    const startDate = new Date(userProfile.createdAt);
    const currentDate = new Date();
    
    const totalDays = Math.ceil((targetDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    const daysPassed = Math.ceil((currentDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    const daysRemaining = Math.max(0, totalDays - daysPassed);
    
    const timeProgressPercent = totalDays > 0 ? (daysPassed / totalDays) * 100 : 0;
    
    return {
      currentWeight,
      targetWeight,
      startWeight,
      weightProgress: Math.min(progressPercent, 100),
      timeProgress: Math.min(timeProgressPercent, 100),
      daysRemaining,
      totalDays,
      isOnTrack: progressPercent >= timeProgressPercent * 0.8,
      isGoalAchieved: Math.abs(currentWeight - targetWeight) <= 0.5
    };
  };

  // Atualização automática do progresso integrado
  useEffect(() => {
    if (!isClient) return;
    
    const totalNutrients = calculateTotalNutrients();
    const workoutCalories = calculateWorkoutCalories();
    
    if ((totalNutrients.calories > 0 || workoutCalories > 0 || selectedFoods.length > 0) && userProfile) {
      const today = new Date().toISOString().split('T')[0];
      
      const newIntegratedProgress: IntegratedProgress = {
        date: today,
        userProfile: userProfile,
        selectedFoods: [...selectedFoods],
        completedWorkouts: workouts.filter(w => 
          new Date(w.date).toDateString() === new Date().toDateString()
        ),
        totalNutrients,
        caloriesBurned: workoutCalories,
        notes: ''
      };

      const existingIndex = integratedProgress.findIndex(p => p.date === today);
      if (existingIndex >= 0) {
        const updated = [...integratedProgress];
        updated[existingIndex] = newIntegratedProgress;
        setIntegratedProgress(updated);
      } else {
        setIntegratedProgress([...integratedProgress, newIntegratedProgress]);
      }

      // Também atualiza o progresso básico
      const newProgress: DailyProgress = {
        date: today,
        caloriesConsumed: totalNutrients.calories,
        caloriesBurned: workoutCalories,
      };

      const existingProgressIndex = progress.findIndex(p => p.date === today);
      if (existingProgressIndex >= 0) {
        const updated = [...progress];
        updated[existingProgressIndex] = newProgress;
        setProgress(updated);
      } else {
        setProgress([...progress, newProgress]);
      }
    }
  }, [selectedFoods, workouts, userProfile, isClient]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const totalNutrients = calculateTotalNutrients();
    const workoutCalories = calculateWorkoutCalories();
    
    const newProgress: DailyProgress = {
      date: formData.date,
      caloriesConsumed: totalNutrients.calories,
      caloriesBurned: workoutCalories,
      weight: formData.weight ? parseFloat(formData.weight) : undefined,
    };

    // Progresso integrado com mais detalhes
    const newIntegratedProgress: IntegratedProgress = {
      date: formData.date,
      userProfile: userProfile!,
      selectedFoods: [...selectedFoods],
      completedWorkouts: workouts.filter(w => 
        new Date(w.date).toDateString() === new Date(formData.date).toDateString()
      ),
      totalNutrients,
      caloriesBurned: workoutCalories,
      weight: formData.weight ? parseFloat(formData.weight) : undefined,
      notes: formData.notes
    };

    const existingIndex = progress.findIndex(p => p.date === formData.date);
    if (existingIndex >= 0) {
      const updated = [...progress];
      updated[existingIndex] = newProgress;
      setProgress(updated);
    } else {
      setProgress([...progress, newProgress]);
    }

    const existingIntegratedIndex = integratedProgress.findIndex(p => p.date === formData.date);
    if (existingIntegratedIndex >= 0) {
      const updated = [...integratedProgress];
      updated[existingIntegratedIndex] = newIntegratedProgress;
      setIntegratedProgress(updated);
    } else {
      setIntegratedProgress([...integratedProgress, newIntegratedProgress]);
    }

    setFormData({
      date: new Date().toISOString().split('T')[0],
      weight: '',
      notes: ''
    });
    setShowForm(false);
  };

  // Evitar renderização até que o cliente esteja pronto
  if (!isClient) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Monitoramento Automático</h1>
          <div className="bg-gray-200 animate-pulse h-10 w-48 rounded-lg"></div>
        </div>
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <BarChart3 className="w-16 h-16 mx-auto opacity-30" />
          </div>
          <p className="text-gray-500 text-lg">Carregando...</p>
        </div>
      </div>
    );
  }

  const sortedProgress = progress.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const latestProgress = sortedProgress[0];

  const totalCaloriesConsumed = sortedProgress.reduce((sum, p) => sum + p.caloriesConsumed, 0);
  const totalCaloriesBurned = sortedProgress.reduce((sum, p) => sum + p.caloriesBurned, 0);
  const averageWeight = sortedProgress.filter(p => p.weight).reduce((sum, p, _, arr) => sum + (p.weight! / arr.length), 0);

  // Cálculos baseados no perfil do usuário
  const todayNutrients = calculateTotalNutrients();
  const todayWorkoutCalories = calculateWorkoutCalories();
  
  const calorieBalance = todayNutrients.calories - todayWorkoutCalories;
  const targetCalories = userProfile?.targetCalories || 2000;
  const calorieProgress = (todayNutrients.calories / targetCalories) * 100;

  const proteinProgress = userProfile ? (todayNutrients.protein / userProfile.targetProtein) * 100 : 0;
  const carbProgress = userProfile ? (todayNutrients.carbs / userProfile.targetCarbs) * 100 : 0;
  const fatProgress = userProfile ? (todayNutrients.fat / userProfile.targetFat) * 100 : 0;

  const isDataComplete = userProfile && (selectedFoods.length > 0 || workouts.length > 0);
  const goalProgress = calculateGoalProgress();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Monitoramento Automático</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Calendar className="w-5 h-5" />
          Adicionar Observações
        </button>
      </div>

      {!userProfile && (
        <div className="bg-orange-50 border border-orange-200 p-4 rounded-lg mb-8 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-orange-500" />
          <div>
            <p className="text-orange-800 font-medium">Configure seu perfil primeiro!</p>
            <p className="text-orange-700 text-sm">
              Acesse a página de Perfil para calcular sua TMB e definir suas metas nutricionais.
            </p>
          </div>
        </div>
      )}

      {userProfile && !isDataComplete && (
        <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg mb-8 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-blue-500" />
          <div>
            <p className="text-blue-800 font-medium">Comece seu monitoramento!</p>
            <p className="text-blue-700 text-sm">
              Selecione alimentos na página de Dieta e crie treinos para ver o monitoramento automático funcionando.
            </p>
          </div>
        </div>
      )}

      {isDataComplete && (
        <div className="bg-green-50 border border-green-200 p-4 rounded-lg mb-8 flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-green-500" />
          <div>
            <p className="text-green-800 font-medium">Monitoramento ativo!</p>
            <p className="text-green-700 text-sm">
              Seus dados estão sendo calculados automaticamente com base na sua TMB, dieta e treinos.
            </p>
          </div>
        </div>
      )}

      {/* Progresso da Meta Integrado */}
      {goalProgress && (
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-purple-600" />
            Progresso da Meta - Integrado com Monitoramento
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Peso Atual</span>
                <Trophy className={`w-5 h-5 ${goalProgress.isGoalAchieved ? 'text-yellow-500' : 'text-gray-400'}`} />
              </div>
              <p className="text-2xl font-bold text-purple-600">{goalProgress.currentWeight}kg</p>
              <p className="text-xs text-gray-500">Meta: {goalProgress.targetWeight}kg</p>
            </div>
            
            <div className="bg-white p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Progresso</span>
                <span className="text-sm font-medium">{goalProgress.weightProgress.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                <div 
                  className="bg-purple-600 h-3 rounded-full transition-all duration-500" 
                  style={{ width: `${goalProgress.weightProgress}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500">da meta de peso</p>
            </div>
            
            <div className="bg-white p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Tempo</span>
                <span className="text-sm font-medium">{goalProgress.daysRemaining} dias</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                <div 
                  className="bg-blue-600 h-3 rounded-full transition-all duration-500" 
                  style={{ width: `${goalProgress.timeProgress}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500">restantes</p>
            </div>
            
            <div className="bg-white p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Status</span>
                <TrendingUp className={`w-5 h-5 ${goalProgress.isOnTrack ? 'text-green-500' : 'text-orange-500'}`} />
              </div>
              <p className={`text-lg font-bold ${goalProgress.isGoalAchieved ? 'text-yellow-600' : goalProgress.isOnTrack ? 'text-green-600' : 'text-orange-600'}`}>
                {goalProgress.isGoalAchieved ? 'Meta atingida!' : goalProgress.isOnTrack ? 'No caminho!' : 'Acelerar'}
              </p>
              <p className="text-xs text-gray-500">
                {goalProgress.isGoalAchieved 
                  ? 'Parabéns! Você atingiu sua meta!'
                  : goalProgress.isOnTrack 
                    ? 'Progresso consistente'
                    : 'Ajuste necessário'
                }
              </p>
            </div>
          </div>
          
          {goalProgress.isGoalAchieved && (
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center gap-2">
                <Trophy className="w-6 h-6 text-yellow-500" />
                <p className="text-yellow-800 font-medium">
                  🎉 Parabéns! Você atingiu sua meta de peso! Continue mantendo seus hábitos saudáveis.
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Monitoramento de Hoje */}
      <div className="bg-gradient-to-r from-blue-50 to-green-50 p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Zap className="w-5 h-5 text-blue-600" />
          Progresso de Hoje (Automático)
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg text-center">
            <p className="text-sm text-gray-600">Calorias Consumidas</p>
            <p className="text-2xl font-bold text-blue-600">{todayNutrients.calories}</p>
            {userProfile && (
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full" 
                  style={{ width: `${Math.min(calorieProgress, 100)}%` }}
                ></div>
              </div>
            )}
            <p className="text-xs text-gray-500 mt-1">
              {selectedFoods.length} alimentos selecionados
            </p>
          </div>
          
          <div className="bg-white p-4 rounded-lg text-center">
            <p className="text-sm text-gray-600">Calorias Queimadas</p>
            <p className="text-2xl font-bold text-green-600">{todayWorkoutCalories}</p>
            <p className="text-xs text-gray-500 mt-1">
              {workouts.filter(w => new Date(w.date).toDateString() === new Date().toDateString()).length} treinos hoje
            </p>
          </div>
          
          <div className="bg-white p-4 rounded-lg text-center">
            <p className="text-sm text-gray-600">Saldo Calórico</p>
            <p className={`text-2xl font-bold ${calorieBalance > 0 ? 'text-orange-600' : 'text-green-600'}`}>
              {calorieBalance > 0 ? '+' : ''}{calorieBalance}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {calorieBalance > 0 ? 'Superávit' : 'Déficit'}
            </p>
          </div>
          
          <div className="bg-white p-4 rounded-lg text-center">
            <p className="text-sm text-gray-600">Meta TMB</p>
            <p className="text-2xl font-bold text-purple-600">
              {userProfile ? Math.round((todayNutrients.calories / userProfile.targetCalories) * 100) : 0}%
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Meta: {userProfile?.targetCalories || 0} kcal
            </p>
          </div>
        </div>

        {userProfile && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">Proteína</span>
                <span className="text-sm font-medium">{todayNutrients.protein.toFixed(1)}g / {userProfile.targetProtein}g</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-600 h-2 rounded-full" 
                  style={{ width: `${Math.min(proteinProgress, 100)}%` }}
                ></div>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">Carboidratos</span>
                <span className="text-sm font-medium">{todayNutrients.carbs.toFixed(1)}g / {userProfile.targetCarbs}g</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full" 
                  style={{ width: `${Math.min(carbProgress, 100)}%` }}
                ></div>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">Gordura</span>
                <span className="text-sm font-medium">{todayNutrients.fat.toFixed(1)}g / {userProfile.targetFat}g</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-red-600 h-2 rounded-full" 
                  style={{ width: `${Math.min(fatProgress, 100)}%` }}
                ></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold mb-4">Adicionar Observações</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Data</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Peso (kg)</label>
              <input
                type="number"
                step="0.1"
                value={formData.weight}
                onChange={(e) => setFormData({...formData, weight: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="opcional"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Observações</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-md"
                rows={3}
                placeholder="Como você se sentiu hoje? Alguma observação sobre treino ou dieta?"
              />
            </div>
            <div className="md:col-span-2">
              <button
                type="submit"
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                Salvar Observações
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Estatísticas Gerais */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <BarChart3 className="w-8 h-8 text-blue-500 mb-2" />
          <h3 className="text-lg font-semibold mb-2">Total Consumido</h3>
          <p className="text-2xl font-bold text-blue-600">{totalCaloriesConsumed} kcal</p>
          <p className="text-sm text-gray-500">Últimos {sortedProgress.length} registros</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <TrendingUp className="w-8 h-8 text-green-500 mb-2" />
          <h3 className="text-lg font-semibold mb-2">Total Queimado</h3>
          <p className="text-2xl font-bold text-green-600">{totalCaloriesBurned} kcal</p>
          <p className="text-sm text-gray-500">Em exercícios</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <Activity className="w-8 h-8 text-purple-500 mb-2" />
          <h3 className="text-lg font-semibold mb-2">Peso Médio</h3>
          <p className="text-2xl font-bold text-purple-600">
            {averageWeight ? `${averageWeight.toFixed(1)} kg` : 'N/A'}
          </p>
          <p className="text-sm text-gray-500">Baseado nos registros</p>
        </div>
      </div>

      {/* Histórico Detalhado */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold">Histórico Automático</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Consumido</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Queimado</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Saldo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Peso</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedProgress.map((p) => {
                const balance = p.caloriesConsumed - p.caloriesBurned;
                const targetMet = userProfile ? Math.abs(p.caloriesConsumed - userProfile.targetCalories) <= 100 : false;
                
                return (
                  <tr key={p.date}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {new Date(p.date).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {p.caloriesConsumed} kcal
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {p.caloriesBurned} kcal
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className={balance > 0 ? 'text-orange-600' : 'text-green-600'}>
                        {balance > 0 ? '+' : ''}{balance} kcal
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {p.weight ? `${p.weight} kg` : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {targetMet ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Meta atingida
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          Ajustar dieta
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {sortedProgress.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">Nenhum progresso registrado ainda.</p>
            <p className="text-gray-400 text-sm mt-2">
              Configure seu perfil, selecione alimentos e faça treinos para ver o monitoramento automático.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}