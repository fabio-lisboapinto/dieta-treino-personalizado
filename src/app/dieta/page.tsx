'use client';

import { useState, useEffect } from 'react';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { Food, SelectedFood } from '../../lib/types';
import { foodDatabase, foodCategories } from '../../lib/foodDatabase';
import { Plus, Minus, Search, Filter, ShoppingCart, Utensils, Eye, EyeOff, Sparkles, Coffee, Clock } from 'lucide-react';

export default function DietaPage() {
  const [selectedFoods, setSelectedFoods] = useLocalStorage<SelectedFood[]>('selectedFoods', []);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [showMicronutrients, setShowMicronutrients] = useState(false);
  const [customFood, setCustomFood] = useState({
    name: '',
    calories: '',
    protein: '',
    carbs: '',
    fat: ''
  });
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [isGeneratingNutrients, setIsGeneratingNutrients] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState('cafe_da_manha');
  const [mealPlan, setMealPlan] = useLocalStorage<{[key: string]: SelectedFood[]}>('mealPlan', {});

  const mealOptions = [
    { id: 'cafe_da_manha', name: 'Café da Manhã', icon: Coffee },
    { id: 'lanche_manha', name: 'Lanche da Manhã', icon: Clock },
    { id: 'almoco', name: 'Almoço', icon: Utensils },
    { id: 'lanche_tarde', name: 'Lanche da Tarde', icon: Clock },
    { id: 'jantar', name: 'Jantar', icon: Utensils },
    { id: 'ceia', name: 'Ceia', icon: Clock },
    { id: 'refeicao_7', name: 'Refeição 7', icon: Utensils },
    { id: 'refeicao_8', name: 'Refeição 8', icon: Utensils },
    { id: 'refeicao_9', name: 'Refeição 9', icon: Utensils },
    { id: 'refeicao_10', name: 'Refeição 10', icon: Utensils }
  ];

  const filteredFoods = foodDatabase.filter(food => {
    const matchesSearch = food.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'Todos' || food.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const addFoodToMeal = (food: Food, quantity: number = 100) => {
    const currentMealFoods = mealPlan[selectedMeal] || [];
    const existingIndex = currentMealFoods.findIndex(sf => sf.food.id === food.id);
    
    if (existingIndex >= 0) {
      const updated = [...currentMealFoods];
      updated[existingIndex].quantity = quantity;
      updated[existingIndex].totalNutrients = calculateNutrients(food, quantity);
      setMealPlan({
        ...mealPlan,
        [selectedMeal]: updated
      });
    } else {
      const newSelectedFood: SelectedFood = {
        food,
        quantity,
        totalNutrients: calculateNutrients(food, quantity)
      };
      setMealPlan({
        ...mealPlan,
        [selectedMeal]: [...currentMealFoods, newSelectedFood]
      });
    }

    // Também atualiza a lista geral para compatibilidade com monitoramento
    updateGeneralSelectedFoods();
  };

  const removeFoodFromMeal = (foodId: string) => {
    const currentMealFoods = mealPlan[selectedMeal] || [];
    setMealPlan({
      ...mealPlan,
      [selectedMeal]: currentMealFoods.filter(sf => sf.food.id !== foodId)
    });
    updateGeneralSelectedFoods();
  };

  const updateMealQuantity = (foodId: string, quantity: number) => {
    const currentMealFoods = mealPlan[selectedMeal] || [];
    const updated = currentMealFoods.map(sf => {
      if (sf.food.id === foodId) {
        return {
          ...sf,
          quantity,
          totalNutrients: calculateNutrients(sf.food, quantity)
        };
      }
      return sf;
    });
    setMealPlan({
      ...mealPlan,
      [selectedMeal]: updated
    });
    updateGeneralSelectedFoods();
  };

  const updateGeneralSelectedFoods = () => {
    // Combina todos os alimentos de todas as refeições para o monitoramento
    const allFoods: SelectedFood[] = [];
    Object.values(mealPlan).forEach(mealFoods => {
      allFoods.push(...mealFoods);
    });
    setSelectedFoods(allFoods);
  };

  useEffect(() => {
    updateGeneralSelectedFoods();
  }, [mealPlan]);

  const calculateNutrients = (food: Food, quantity: number) => {
    const factor = quantity / 100;
    return {
      calories: Math.round(food.calories * factor),
      protein: Math.round(food.protein * factor * 10) / 10,
      carbs: Math.round(food.carbs * factor * 10) / 10,
      fat: Math.round(food.fat * factor * 10) / 10,
      fiber: Math.round(food.fiber * factor * 10) / 10,
    };
  };

  const getTotalNutrients = () => {
    const allFoods: SelectedFood[] = [];
    Object.values(mealPlan).forEach(mealFoods => {
      allFoods.push(...mealFoods);
    });
    
    return allFoods.reduce((total, sf) => ({
      calories: total.calories + sf.totalNutrients.calories,
      protein: total.protein + sf.totalNutrients.protein,
      carbs: total.carbs + sf.totalNutrients.carbs,
      fat: total.fat + sf.totalNutrients.fat,
      fiber: total.fiber + sf.totalNutrients.fiber,
    }), { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 });
  };

  const generateNutrients = async () => {
    if (!customFood.name.trim()) return;
    
    setIsGeneratingNutrients(true);
    
    // Simulação de API que calcula nutrientes baseado no nome do alimento
    setTimeout(() => {
      const commonFoods: { [key: string]: any } = {
        'açúcar': { calories: 387, protein: 0, carbs: 99.8, fat: 0 },
        'mel': { calories: 304, protein: 0.3, carbs: 82.4, fat: 0 },
        'chocolate': { calories: 546, protein: 4.9, carbs: 61, fat: 31 },
        'pão de açúcar': { calories: 265, protein: 8, carbs: 49, fat: 4.2 },
        'biscoito': { calories: 435, protein: 6.5, carbs: 68, fat: 15 },
        'refrigerante': { calories: 42, protein: 0, carbs: 10.6, fat: 0 },
        'suco de laranja': { calories: 45, protein: 0.7, carbs: 10.4, fat: 0.2 },
        'pizza': { calories: 266, protein: 11, carbs: 33, fat: 10 },
        'hambúrguer': { calories: 295, protein: 17, carbs: 23, fat: 15 },
        'batata frita': { calories: 365, protein: 4, carbs: 63, fat: 17 },
        'sorvete': { calories: 207, protein: 3.5, carbs: 24, fat: 11 },
        'café': { calories: 2, protein: 0.3, carbs: 0, fat: 0 },
        'chá': { calories: 1, protein: 0, carbs: 0.3, fat: 0 },
        'água': { calories: 0, protein: 0, carbs: 0, fat: 0 }
      };

      const foodName = customFood.name.toLowerCase();
      let nutrients = { calories: 200, protein: 5, carbs: 30, fat: 8 }; // valores padrão

      // Busca por palavras-chave
      for (const [key, value] of Object.entries(commonFoods)) {
        if (foodName.includes(key)) {
          nutrients = value;
          break;
        }
      }

      // Estimativas baseadas em categorias
      if (foodName.includes('fruta') || foodName.includes('maçã') || foodName.includes('banana')) {
        nutrients = { calories: 60, protein: 0.5, carbs: 15, fat: 0.2 };
      } else if (foodName.includes('verdura') || foodName.includes('salada')) {
        nutrients = { calories: 20, protein: 2, carbs: 4, fat: 0.1 };
      } else if (foodName.includes('carne') || foodName.includes('frango')) {
        nutrients = { calories: 200, protein: 25, carbs: 0, fat: 10 };
      } else if (foodName.includes('peixe')) {
        nutrients = { calories: 150, protein: 22, carbs: 0, fat: 6 };
      }

      setCustomFood(prev => ({
        ...prev,
        calories: nutrients.calories.toString(),
        protein: nutrients.protein.toString(),
        carbs: nutrients.carbs.toString(),
        fat: nutrients.fat.toString()
      }));
      
      setIsGeneratingNutrients(false);
    }, 2000);
  };

  const addCustomFood = () => {
    if (!customFood.name.trim() || !customFood.calories) return;

    const newFood: Food = {
      id: `custom-${Date.now()}`,
      name: customFood.name,
      calories: parseFloat(customFood.calories),
      protein: parseFloat(customFood.protein) || 0,
      carbs: parseFloat(customFood.carbs) || 0,
      fat: parseFloat(customFood.fat) || 0,
      fiber: 0,
      sugar: 0,
      sodium: 0,
      servingSize: '100g',
      category: 'Personalizado',
      vitamins: {
        vitaminA: 0, vitaminC: 0, vitaminD: 0, vitaminE: 0, vitaminK: 0,
        vitaminB1: 0, vitaminB2: 0, vitaminB3: 0, vitaminB6: 0, vitaminB12: 0, folate: 0
      },
      minerals: {
        calcium: 0, iron: 0, magnesium: 0, phosphorus: 0, potassium: 0, zinc: 0, selenium: 0
      }
    };

    addFoodToMeal(newFood, 100);
    setCustomFood({ name: '', calories: '', protein: '', carbs: '', fat: '' });
    setShowCustomForm(false);
  };

  const currentMealFoods = mealPlan[selectedMeal] || [];
  const totalNutrients = getTotalNutrients();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Meu Plano Alimentar</h1>
        <button
          onClick={() => setShowCustomForm(!showCustomForm)}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Adicionar Alimento
        </button>
      </div>

      {/* Seletor de Refeições */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">Selecione a Refeição</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {mealOptions.map((meal) => {
            const Icon = meal.icon;
            const mealFoodCount = (mealPlan[meal.id] || []).length;
            return (
              <button
                key={meal.id}
                onClick={() => setSelectedMeal(meal.id)}
                className={`p-3 rounded-lg border-2 transition-all flex flex-col items-center gap-2 ${
                  selectedMeal === meal.id
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-sm font-medium">{meal.name}</span>
                {mealFoodCount > 0 && (
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                    {mealFoodCount} alimentos
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Formulário de Alimento Personalizado */}
      {showCustomForm && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-8 border-2 border-purple-200">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-600" />
            Adicionar Alimento Personalizado
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nome do Alimento
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customFood.name}
                  onChange={(e) => setCustomFood({...customFood, name: e.target.value})}
                  className="flex-1 p-2 border border-gray-300 rounded-md"
                  placeholder="Ex: Pizza margherita, Bolo de chocolate..."
                />
                <button
                  onClick={generateNutrients}
                  disabled={!customFood.name.trim() || isGeneratingNutrients}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {isGeneratingNutrients ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Calculando...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Calcular
                    </>
                  )}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Digite o nome do alimento e clique em "Calcular" para obter os valores nutricionais automaticamente
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Calorias (por 100g)
              </label>
              <input
                type="number"
                value={customFood.calories}
                onChange={(e) => setCustomFood({...customFood, calories: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="Ex: 250"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Proteína (g)
              </label>
              <input
                type="number"
                step="0.1"
                value={customFood.protein}
                onChange={(e) => setCustomFood({...customFood, protein: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="Ex: 12.5"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Carboidratos (g)
              </label>
              <input
                type="number"
                step="0.1"
                value={customFood.carbs}
                onChange={(e) => setCustomFood({...customFood, carbs: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="Ex: 30.2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Gordura (g)
              </label>
              <input
                type="number"
                step="0.1"
                value={customFood.fat}
                onChange={(e) => setCustomFood({...customFood, fat: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="Ex: 8.5"
              />
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button
              onClick={addCustomFood}
              disabled={!customFood.name.trim() || !customFood.calories}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              Adicionar à {mealOptions.find(m => m.id === selectedMeal)?.name}
            </button>
            <button
              onClick={() => setShowCustomForm(false)}
              className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Lista de Alimentos */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Buscar alimentos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-gray-500" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {foodCategories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mb-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800 font-medium">
                Adicionando alimentos para: {mealOptions.find(m => m.id === selectedMeal)?.name}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
              {filteredFoods.map((food) => {
                const isSelected = currentMealFoods.some(sf => sf.food.id === food.id);
                const selectedFood = currentMealFoods.find(sf => sf.food.id === food.id);
                
                return (
                  <div
                    key={food.id}
                    className={`border rounded-lg p-4 transition-all ${
                      isSelected 
                        ? 'border-green-500 bg-green-50 shadow-md' 
                        : 'border-gray-200 hover:border-blue-300 hover:shadow-sm'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold text-gray-900">{food.name}</h3>
                        <p className="text-sm text-gray-600">{food.servingSize}</p>
                        <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mt-1">
                          {food.category}
                        </span>
                      </div>
                      {isSelected && (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => updateMealQuantity(food.id, Math.max(10, (selectedFood?.quantity || 100) - 10))}
                            className="w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-sm font-medium w-12 text-center">
                            {selectedFood?.quantity}g
                          </span>
                          <button
                            onClick={() => updateMealQuantity(food.id, (selectedFood?.quantity || 100) + 10)}
                            className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center hover:bg-green-600"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                      <div>
                        <span className="text-gray-600">Calorias:</span>
                        <span className="font-medium ml-1">{food.calories}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Proteína:</span>
                        <span className="font-medium ml-1">{food.protein}g</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Carbs:</span>
                        <span className="font-medium ml-1">{food.carbs}g</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Gordura:</span>
                        <span className="font-medium ml-1">{food.fat}g</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      {isSelected ? (
                        <button
                          onClick={() => removeFoodFromMeal(food.id)}
                          className="flex-1 bg-red-500 text-white py-2 px-3 rounded-lg hover:bg-red-600 transition-colors text-sm"
                        >
                          Remover
                        </button>
                      ) : (
                        <button
                          onClick={() => addFoodToMeal(food)}
                          className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                        >
                          Adicionar
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {filteredFoods.length === 0 && (
              <div className="text-center py-12">
                <Utensils className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">Nenhum alimento encontrado</p>
                <p className="text-gray-400 text-sm mt-2">
                  Tente ajustar sua busca ou filtro
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Painel Lateral - Resumo Nutricional */}
        <div className="space-y-6">
          {/* Resumo Total */}
          <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Resumo Total do Dia</h2>
              <ShoppingCart className="w-6 h-6 text-green-600" />
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Total de Calorias:</span>
                <span className="text-2xl font-bold text-green-600">{totalNutrients.calories}</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-sm">
                <div className="text-center">
                  <p className="text-gray-600">Proteína</p>
                  <p className="font-semibold text-blue-600">{totalNutrients.protein.toFixed(1)}g</p>
                </div>
                <div className="text-center">
                  <p className="text-gray-600">Carbs</p>
                  <p className="font-semibold text-orange-600">{totalNutrients.carbs.toFixed(1)}g</p>
                </div>
                <div className="text-center">
                  <p className="text-gray-600">Gordura</p>
                  <p className="font-semibold text-red-600">{totalNutrients.fat.toFixed(1)}g</p>
                </div>
              </div>
              <div className="text-center pt-2 border-t border-gray-200">
                <p className="text-gray-600 text-sm">Fibra Total</p>
                <p className="font-semibold text-purple-600">{totalNutrients.fiber.toFixed(1)}g</p>
              </div>
            </div>
          </div>

          {/* Controle de Micronutrientes */}
          <div className="bg-white p-4 rounded-lg shadow-md">
            <button
              onClick={() => setShowMicronutrients(!showMicronutrients)}
              className="w-full flex items-center justify-between text-left"
            >
              <span className="font-medium text-gray-900">Micronutrientes</span>
              {showMicronutrients ? (
                <EyeOff className="w-5 h-5 text-gray-500" />
              ) : (
                <Eye className="w-5 h-5 text-gray-500" />
              )}
            </button>
          </div>

          {/* Alimentos da Refeição Atual */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">
              {mealOptions.find(m => m.id === selectedMeal)?.name} ({currentMealFoods.length})
            </h3>
            
            {currentMealFoods.length === 0 ? (
              <div className="text-center py-8">
                <Utensils className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">Nenhum alimento nesta refeição</p>
                <p className="text-gray-400 text-sm mt-1">
                  Adicione alimentos para esta refeição
                </p>
              </div>
            ) : (
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {currentMealFoods.map((sf) => (
                  <div key={sf.food.id} className="border border-gray-200 rounded-lg p-3">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-medium text-gray-900 text-sm">{sf.food.name}</h4>
                        <p className="text-xs text-gray-600">{sf.quantity}g</p>
                      </div>
                      <button
                        onClick={() => removeFoodFromMeal(sf.food.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-1 text-xs">
                      <div>
                        <span className="text-gray-600">Cal:</span>
                        <span className="font-medium ml-1">{sf.totalNutrients.calories}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Prot:</span>
                        <span className="font-medium ml-1">{sf.totalNutrients.protein.toFixed(1)}g</span>
                      </div>
                    </div>

                    {showMicronutrients && (
                      <div className="mt-2 pt-2 border-t border-gray-100">
                        <div className="grid grid-cols-2 gap-1 text-xs">
                          <div>
                            <span className="text-gray-600">Vit C:</span>
                            <span className="ml-1">{(sf.food.vitamins.vitaminC * sf.quantity / 100).toFixed(1)}mg</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Ferro:</span>
                            <span className="ml-1">{(sf.food.minerals.iron * sf.quantity / 100).toFixed(1)}mg</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Cálcio:</span>
                            <span className="ml-1">{(sf.food.minerals.calcium * sf.quantity / 100).toFixed(0)}mg</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Potássio:</span>
                            <span className="ml-1">{(sf.food.minerals.potassium * sf.quantity / 100).toFixed(0)}mg</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}