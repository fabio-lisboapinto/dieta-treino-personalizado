'use client';

import { useState, useEffect } from 'react';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { Food, SelectedFood, MealPlan, DailyMealPlan } from '../../lib/types';
import { foodDatabase } from '../../lib/foodDatabase';
import { Apple, Plus, Search, Filter, Trash2, Calendar, Clock, Target, Crown } from 'lucide-react';
import { PremiumButton, PremiumFeature } from '../../components/PremiumComponents';

const mealTimes = [
  { key: 'breakfast', label: 'Café da Manhã', time: '07:00', icon: '🌅' },
  { key: 'morning_snack', label: 'Lanche da Manhã', time: '10:00', icon: '🍎' },
  { key: 'lunch', label: 'Almoço', time: '12:30', icon: '🍽️' },
  { key: 'afternoon_snack', label: 'Lanche da Tarde', time: '15:30', icon: '🥤' },
  { key: 'dinner', label: 'Jantar', time: '19:00', icon: '🌙' },
  { key: 'supper', label: 'Ceia', time: '22:00', icon: '🌃' }
];

const daysOfWeek = [
  { key: 'monday', label: 'Segunda-feira', short: 'SEG' },
  { key: 'tuesday', label: 'Terça-feira', short: 'TER' },
  { key: 'wednesday', label: 'Quarta-feira', short: 'QUA' },
  { key: 'thursday', label: 'Quinta-feira', short: 'QUI' },
  { key: 'friday', label: 'Sexta-feira', short: 'SEX' },
  { key: 'saturday', label: 'Sábado', short: 'SAB' },
  { key: 'sunday', label: 'Domingo', short: 'DOM' }
];

export default function AlimentosPage() {
  const [selectedFoods, setSelectedFoods] = useLocalStorage<SelectedFood[]>('selectedFoods', []);
  const [mealPlan, setMealPlan] = useLocalStorage<MealPlan>('mealPlan', {});
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [showMealPlan, setShowMealPlan] = useState(false);
  const [selectedDay, setSelectedDay] = useState('monday');
  const [selectedMeal, setSelectedMeal] = useState('breakfast');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const categories = ['Todos', ...Array.from(new Set(foodDatabase.map(food => food.category)))];

  const filteredFoods = foodDatabase.filter(food => {
    const matchesSearch = food.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'Todos' || food.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const addToSelection = (food: Food, quantity: number) => {
    const totalNutrients = {
      calories: (food.calories * quantity) / 100,
      protein: (food.protein * quantity) / 100,
      carbs: (food.carbs * quantity) / 100,
      fat: (food.fat * quantity) / 100,
      fiber: (food.fiber * quantity) / 100,
    };

    const selectedFood: SelectedFood = {
      id: Date.now().toString(),
      food,
      quantity,
      totalNutrients,
      addedAt: new Date().toISOString(),
    };

    setSelectedFoods([...selectedFoods, selectedFood]);
  };

  const addToMealPlan = (food: Food, quantity: number, day: string, meal: string) => {
    const totalNutrients = {
      calories: (food.calories * quantity) / 100,
      protein: (food.protein * quantity) / 100,
      carbs: (food.carbs * quantity) / 100,
      fat: (food.fat * quantity) / 100,
      fiber: (food.fiber * quantity) / 100,
    };

    const selectedFood: SelectedFood = {
      id: Date.now().toString(),
      food,
      quantity,
      totalNutrients,
      addedAt: new Date().toISOString(),
    };

    const newMealPlan = { ...mealPlan };
    if (!newMealPlan[day]) {
      newMealPlan[day] = {};
    }
    if (!newMealPlan[day][meal]) {
      newMealPlan[day][meal] = [];
    }
    newMealPlan[day][meal].push(selectedFood);
    setMealPlan(newMealPlan);
  };

  const removeFromSelection = (id: string) => {
    setSelectedFoods(selectedFoods.filter(sf => sf.id !== id));
  };

  const removeFromMealPlan = (day: string, meal: string, id: string) => {
    const newMealPlan = { ...mealPlan };
    if (newMealPlan[day] && newMealPlan[day][meal]) {
      newMealPlan[day][meal] = newMealPlan[day][meal].filter(sf => sf.id !== id);
      if (newMealPlan[day][meal].length === 0) {
        delete newMealPlan[day][meal];
      }
      if (Object.keys(newMealPlan[day]).length === 0) {
        delete newMealPlan[day];
      }
    }
    setMealPlan(newMealPlan);
  };

  const clearSelection = () => {
    if (window.confirm('Tem certeza que deseja limpar toda a seleção de alimentos?')) {
      setSelectedFoods([]);
    }
  };

  const clearMealPlan = () => {
    if (window.confirm('Tem certeza que deseja limpar todo o plano alimentar?')) {
      setMealPlan({});
    }
  };

  const getTotalNutrients = (foods: SelectedFood[]) => {
    return foods.reduce((total, sf) => ({
      calories: total.calories + sf.totalNutrients.calories,
      protein: total.protein + sf.totalNutrients.protein,
      carbs: total.carbs + sf.totalNutrients.carbs,
      fat: total.fat + sf.totalNutrients.fat,
      fiber: total.fiber + sf.totalNutrients.fiber,
    }), { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 });
  };

  const getDayTotalNutrients = (day: string) => {
    if (!mealPlan[day]) return { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 };
    
    const allFoods = Object.values(mealPlan[day]).flat();
    return getTotalNutrients(allFoods);
  };

  if (!isClient) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <Apple className="w-16 h-16 mx-auto opacity-30 text-gray-400" />
          <p className="text-gray-500 text-lg mt-4">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Base de Alimentos</h1>
        <div className="flex gap-3">
          <button
            onClick={() => setShowMealPlan(!showMealPlan)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
          >
            <Calendar className="w-5 h-5" />
            {showMealPlan ? 'Base de Alimentos' : 'Plano Alimentar'}
          </button>
        </div>
      </div>

      {showMealPlan ? (
        <PremiumFeature
          feature="Plano Alimentar Organizado"
          description="Organize suas refeições por dias da semana e horários específicos para um controle nutricional completo"
        >
          {/* Plano Alimentar */}
          <div className="space-y-8">
            <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg shadow-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold flex items-center gap-2">
                  <Calendar className="w-6 h-6 text-green-600" />
                  Meu Plano Alimentar Semanal
                </h2>
                <button
                  onClick={clearMealPlan}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2 text-sm"
                >
                  <Trash2 className="w-4 h-4" />
                  Limpar Plano
                </button>
              </div>
              <p className="text-gray-700">
                Organize suas refeições por dia da semana e horário. Adicione alimentos diretamente ao plano ou da sua seleção temporária.
              </p>
            </div>

            {/* Seletor de Dia */}
            <div className="flex flex-wrap gap-2 mb-6">
              {daysOfWeek.map((day) => (
                <button
                  key={day.key}
                  onClick={() => setSelectedDay(day.key)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedDay === day.key
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {day.short}
                </button>
              ))}
            </div>

            {/* Plano do Dia Selecionado */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold">
                  {daysOfWeek.find(d => d.key === selectedDay)?.label}
                </h3>
                <div className="text-sm text-gray-600">
                  Total do dia: <strong>{getDayTotalNutrients(selectedDay).calories.toFixed(0)} kcal</strong>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mealTimes.map((mealTime) => (
                  <div key={mealTime.key} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{mealTime.icon}</span>
                        <div>
                          <h4 className="font-medium text-gray-900">{mealTime.label}</h4>
                          <p className="text-xs text-gray-500">{mealTime.time}</p>
                        </div>
                      </div>
                      <Clock className="w-4 h-4 text-gray-400" />
                    </div>

                    <div className="space-y-2 mb-4 min-h-[120px]">
                      {mealPlan[selectedDay]?.[mealTime.key]?.map((selectedFood) => (
                        <div key={selectedFood.id} className="bg-gray-50 p-2 rounded text-sm">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <p className="font-medium text-gray-900">{selectedFood.food.name}</p>
                              <p className="text-xs text-gray-600">{selectedFood.quantity}g</p>
                              <p className="text-xs text-blue-600">
                                {selectedFood.totalNutrients.calories.toFixed(0)} kcal
                              </p>
                            </div>
                            <button
                              onClick={() => removeFromMealPlan(selectedDay, mealTime.key, selectedFood.id)}
                              className="text-red-500 hover:text-red-700 p-1"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      )) || (
                        <div className="text-center py-8 text-gray-400">
                          <Apple className="w-8 h-8 mx-auto mb-2 opacity-30" />
                          <p className="text-xs">Nenhum alimento</p>
                        </div>
                      )}
                    </div>

                    <div className="text-xs text-gray-600 mb-2">
                      Total: {mealPlan[selectedDay]?.[mealTime.key] 
                        ? getTotalNutrients(mealPlan[selectedDay][mealTime.key]).calories.toFixed(0) 
                        : 0} kcal
                    </div>

                    <button
                      onClick={() => {
                        setSelectedMeal(mealTime.key);
                        setShowMealPlan(false);
                      }}
                      className="w-full bg-blue-600 text-white py-2 px-3 rounded text-xs hover:bg-blue-700 transition-colors"
                    >
                      Adicionar Alimentos
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </PremiumFeature>
      ) : (
        /* Base de Alimentos */
        <div className="space-y-8">
          {/* Filtros */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Buscar alimentos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-gray-400" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Seleção Temporária */}
          {selectedFoods.length > 0 && (
            <div className="bg-gradient-to-r from-blue-50 to-green-50 p-6 rounded-lg shadow-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <Target className="w-5 h-5 text-blue-600" />
                  Seleção Temporária ({selectedFoods.length} alimentos)
                </h2>
                <button
                  onClick={clearSelection}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2 text-sm"
                >
                  <Trash2 className="w-4 h-4" />
                  Limpar Seleção
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                {['calories', 'protein', 'carbs', 'fat'].map((nutrient) => {
                  const total = getTotalNutrients(selectedFoods);
                  const labels = {
                    calories: { label: 'Calorias', unit: 'kcal', color: 'text-blue-600' },
                    protein: { label: 'Proteína', unit: 'g', color: 'text-green-600' },
                    carbs: { label: 'Carboidratos', unit: 'g', color: 'text-yellow-600' },
                    fat: { label: 'Gordura', unit: 'g', color: 'text-red-600' }
                  };
                  
                  return (
                    <div key={nutrient} className="bg-white p-3 rounded-lg text-center">
                      <p className="text-sm text-gray-600">{labels[nutrient].label}</p>
                      <p className={`text-lg font-bold ${labels[nutrient].color}`}>
                        {total[nutrient].toFixed(1)} {labels[nutrient].unit}
                      </p>
                    </div>
                  );
                })}
              </div>

              <div className="flex flex-wrap gap-2">
                {selectedFoods.map((selectedFood) => (
                  <div key={selectedFood.id} className="bg-white p-2 rounded-lg flex items-center gap-2 text-sm">
                    <span className="font-medium">{selectedFood.food.name}</span>
                    <span className="text-gray-600">({selectedFood.quantity}g)</span>
                    <button
                      onClick={() => removeFromSelection(selectedFood.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Lista de Alimentos */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFoods.map((food) => (
              <FoodCard
                key={food.id}
                food={food}
                onAddToSelection={addToSelection}
                onAddToMealPlan={addToMealPlan}
                selectedDay={selectedDay}
                selectedMeal={selectedMeal}
                showMealPlanOption={!showMealPlan}
              />
            ))}
          </div>

          {filteredFoods.length === 0 && (
            <div className="text-center py-12">
              <Apple className="w-16 h-16 mx-auto opacity-30 text-gray-400" />
              <p className="text-gray-500 text-lg mt-4">Nenhum alimento encontrado</p>
              <p className="text-gray-400 text-sm">Tente ajustar os filtros de busca</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

interface FoodCardProps {
  food: Food;
  onAddToSelection: (food: Food, quantity: number) => void;
  onAddToMealPlan: (food: Food, quantity: number, day: string, meal: string) => void;
  selectedDay: string;
  selectedMeal: string;
  showMealPlanOption: boolean;
}

const FoodCard: React.FC<FoodCardProps> = ({
  food,
  onAddToSelection,
  onAddToMealPlan,
  selectedDay,
  selectedMeal,
  showMealPlanOption
}) => {
  const [quantity, setQuantity] = useState(100);

  const calculateNutrients = (baseValue: number) => {
    return (baseValue * quantity) / 100;
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">{food.name}</h3>
          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
            {food.category}
          </span>
        </div>
        <Apple className="w-5 h-5 text-green-500" />
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
        <div>
          <span className="text-gray-600">Calorias:</span>
          <span className="font-medium text-blue-600 ml-1">
            {calculateNutrients(food.calories).toFixed(0)} kcal
          </span>
        </div>
        <div>
          <span className="text-gray-600">Proteína:</span>
          <span className="font-medium text-green-600 ml-1">
            {calculateNutrients(food.protein).toFixed(1)}g
          </span>
        </div>
        <div>
          <span className="text-gray-600">Carboidratos:</span>
          <span className="font-medium text-yellow-600 ml-1">
            {calculateNutrients(food.carbs).toFixed(1)}g
          </span>
        </div>
        <div>
          <span className="text-gray-600">Gordura:</span>
          <span className="font-medium text-red-600 ml-1">
            {calculateNutrients(food.fat).toFixed(1)}g
          </span>
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Quantidade (g)
        </label>
        <input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
          className="w-full p-2 border border-gray-300 rounded-md text-sm"
          min="1"
        />
      </div>

      <div className="space-y-2">
        <PremiumButton
          onClick={() => onAddToSelection(food, quantity)}
          className="w-full bg-blue-600 text-white py-2 px-3 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          feature="Adicionar à Seleção"
          description="Adicione alimentos à sua seleção temporária para monitoramento nutricional"
        >
          Adicionar à Seleção
        </PremiumButton>
        
        {showMealPlanOption && (
          <PremiumButton
            onClick={() => onAddToMealPlan(food, quantity, selectedDay, selectedMeal)}
            className="w-full bg-green-600 text-white py-2 px-3 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium flex items-center justify-center gap-1"
            feature="Adicionar ao Plano"
            description="Adicione alimentos diretamente ao seu plano alimentar organizado por dias e refeições"
          >
            <Crown className="w-4 h-4" />
            Adicionar ao Plano
          </PremiumButton>
        )}
      </div>
    </div>
  );
};