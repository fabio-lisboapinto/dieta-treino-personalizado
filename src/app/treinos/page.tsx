'use client';

import { useState, useEffect } from 'react';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { Workout, Exercise, WorkoutTemplate } from '../../lib/types';
import { workoutTemplates, muscleGroups, difficulties } from '../../lib/workoutTemplates';
import { Plus, Dumbbell, Clock, Target, Filter, Play, BookOpen, Trash2, Calendar, Save } from 'lucide-react';
import { PremiumButton } from '../../components/PremiumComponents';
import { PremiumButton } from '../../components/PremiumComponents';
import { PremiumButton } from '../../components/PremiumComponents';

interface WeeklyPlan {
  [key: string]: Workout | null;
}

const daysOfWeek = [
  { key: 'monday', label: 'Segunda-feira', short: 'SEG' },
  { key: 'tuesday', label: 'Terça-feira', short: 'TER' },
  { key: 'wednesday', label: 'Quarta-feira', short: 'QUA' },
  { key: 'thursday', label: 'Quinta-feira', short: 'QUI' },
  { key: 'friday', label: 'Sexta-feira', short: 'SEX' },
  { key: 'saturday', label: 'Sábado', short: 'SAB' },
  { key: 'sunday', label: 'Domingo', short: 'DOM' }
];

export default function TreinosPage() {
  const [workouts, setWorkouts] = useLocalStorage<Workout[]>('workouts', []);
  const [weeklyPlan, setWeeklyPlan] = useLocalStorage<WeeklyPlan>('weeklyPlan', {});
  const [showForm, setShowForm] = useState(false);
  const [showTemplates, setShowTemplates] = useState(true);
  const [showWeeklyPlan, setShowWeeklyPlan] = useState(false);
  const [workoutName, setWorkoutName] = useState('');
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState('Todos');
  const [selectedDifficulty, setSelectedDifficulty] = useState('Todos');
  const [selectedDay, setSelectedDay] = useState<string>('');
  const [isClient, setIsClient] = useState(false);

  // Evitar hydration mismatch
  useEffect(() => {
    setIsClient(true);
  }, []);

  const filteredTemplates = workoutTemplates.filter(template => {
    const matchesMuscle = selectedMuscleGroup === 'Todos' || template.muscleGroup === selectedMuscleGroup;
    const matchesDifficulty = selectedDifficulty === 'Todos' || template.difficulty === selectedDifficulty;
    return matchesMuscle && matchesDifficulty;
  });

  const handleAddExercise = () => {
    const newExercise: Exercise = {
      id: Date.now().toString(),
      name: '',
      sets: 3,
      reps: 10,
    };
    setExercises([...exercises, newExercise]);
  };

  const handleExerciseChange = (id: string, field: keyof Exercise, value: string | number) => {
    setExercises(exercises.map(ex =>
      ex.id === id ? { ...ex, [field]: value } : ex
    ));
  };

  const handleRemoveExercise = (id: string) => {
    setExercises(exercises.filter(ex => ex.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newWorkout: Workout = {
      id: Date.now().toString(),
      name: workoutName,
      exercises: exercises.filter(ex => ex.name.trim() !== ''),
      date: new Date().toISOString(),
    };
    setWorkouts([...workouts, newWorkout]);
    setWorkoutName('');
    setExercises([]);
    setShowForm(false);
    alert('✅ Treino salvo com sucesso!');
  };

  const useTemplate = (template: WorkoutTemplate) => {
    const newWorkout: Workout = {
      id: Date.now().toString(),
      name: template.name,
      exercises: template.exercises.map(ex => ({ ...ex, id: Date.now().toString() + Math.random() })),
      date: new Date().toISOString(),
      muscleGroup: template.muscleGroup,
      difficulty: template.difficulty,
      duration: template.duration
    };
    setWorkouts([...workouts, newWorkout]);
    alert('✅ Treino adicionado aos seus treinos salvos!');
  };

  const startCustomWorkout = (template: WorkoutTemplate) => {
    setWorkoutName(template.name + ' - Personalizado');
    setExercises(template.exercises.map(ex => ({ ...ex, id: Date.now().toString() + Math.random() })));
    setShowForm(true);
    setShowTemplates(false);
  };

  const deleteWorkout = (workoutId: string) => {
    if (!isClient) return;
    
    const workoutToDelete = workouts.find(w => w.id === workoutId);
    if (!workoutToDelete) {
      alert('❌ Treino não encontrado!');
      return;
    }
    
    const confirmMessage = `🗑️ Excluir Treino\n\nTem certeza que deseja excluir o treino "${workoutToDelete.name}"?\n\nEsta ação não pode ser desfeita.`;
    
    if (window.confirm(confirmMessage)) {
      try {
        // Remove o treino da lista de treinos salvos
        const updatedWorkouts = workouts.filter(w => w.id !== workoutId);
        setWorkouts(updatedWorkouts);
        
        // Remove o treino do plano semanal se estiver lá
        const newWeeklyPlan = { ...weeklyPlan };
        let removedFromPlan = false;
        
        Object.keys(newWeeklyPlan).forEach(day => {
          if (newWeeklyPlan[day]?.id === workoutId) {
            delete newWeeklyPlan[day];
            removedFromPlan = true;
          }
        });
        
        if (removedFromPlan) {
          setWeeklyPlan(newWeeklyPlan);
        }
        
        // Feedback visual
        alert(`✅ Treino "${workoutToDelete.name}" foi excluído com sucesso!`);
      } catch (error) {
        console.error('Erro ao excluir treino:', error);
        alert('❌ Erro ao excluir treino. Tente novamente.');
      }
    }
  };

  const addToWeeklyPlan = (workout: Workout, day: string) => {
    setWeeklyPlan({
      ...weeklyPlan,
      [day]: workout
    });
  };

  const removeFromWeeklyPlan = (day: string) => {
    if (window.confirm('Tem certeza que deseja remover o treino deste dia?')) {
      const newPlan = { ...weeklyPlan };
      delete newPlan[day];
      setWeeklyPlan(newPlan);
    }
  };

  const clearWeeklyPlan = () => {
    if (window.confirm('Tem certeza que deseja limpar todo o plano semanal?')) {
      setWeeklyPlan({});
      alert('✅ Plano semanal limpo com sucesso!');
    }
  };

  const clearAllWorkouts = () => {
    if (!isClient) return;
    
    if (workouts.length === 0) {
      alert('ℹ️ Não há treinos para excluir.');
      return;
    }

    const confirmMessage = `🗑️ Excluir TODOS os Treinos\n\nTem certeza que deseja excluir TODOS os ${workouts.length} treinos salvos?\n\nEsta ação irá:\n• Excluir todos os treinos salvos\n• Limpar o plano semanal\n• Não pode ser desfeita\n\nDeseja continuar?`;
    
    if (window.confirm(confirmMessage)) {
      setWorkouts([]);
      setWeeklyPlan({});
      alert('✅ Todos os treinos foram excluídos com sucesso!');
    }
  };

  const getTotalCaloriesBurned = (exercises: Exercise[]): number => {
    return exercises.reduce((total, ex) => total + (ex.caloriesBurned || 0), 0);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Iniciante': return 'text-green-600 bg-green-100';
      case 'Intermediário': return 'text-yellow-600 bg-yellow-100';
      case 'Avançado': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  // Evitar renderização até que o cliente esteja pronto
  if (!isClient) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Treinos</h1>
          <div className="flex gap-3">
            <div className="bg-gray-200 animate-pulse h-10 w-32 rounded-lg"></div>
            <div className="bg-gray-200 animate-pulse h-10 w-32 rounded-lg"></div>
            <div className="bg-gray-200 animate-pulse h-10 w-32 rounded-lg"></div>
          </div>
        </div>
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Dumbbell className="w-16 h-16 mx-auto opacity-30" />
          </div>
          <p className="text-gray-500 text-lg">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Treinos</h1>
        <div className="flex gap-3">
          <button
            onClick={() => setShowWeeklyPlan(!showWeeklyPlan)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
          >
            <Calendar className="w-5 h-5" />
            {showWeeklyPlan ? 'Ocultar' : 'Ver'} Plano Semanal
          </button>
          <button
            onClick={() => setShowTemplates(!showTemplates)}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
          >
            <BookOpen className="w-5 h-5" />
            {showTemplates ? 'Ocultar' : 'Ver'} Modelos
          </button>
          <button
            onClick={() => {setShowForm(!showForm); setShowTemplates(false); setShowWeeklyPlan(false);}}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Criar Treino
          </button>
        </div>
      </div>

      {/* Plano Semanal */}
      {showWeeklyPlan && (
        <div className="mb-8">
          <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg shadow-md mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold flex items-center gap-2">
                <Calendar className="w-6 h-6 text-green-600" />
                Meu Plano Semanal de Treinos
              </h2>
              <button
                onClick={clearWeeklyPlan}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2 text-sm"
              >
                <Trash2 className="w-4 h-4" />
                Limpar Plano
              </button>
            </div>
            <p className="text-gray-700">
              Organize seus treinos por dia da semana. Adicione treinos salvos aos dias desejados para criar seu plano completo.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
            {daysOfWeek.map((day) => (
              <div key={day.key} className="bg-white p-4 rounded-lg shadow-md border">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-semibold text-gray-900">{day.label}</h3>
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded">{day.short}</span>
                </div>

                {weeklyPlan[day.key] ? (
                  <div className="space-y-3">
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-blue-900 text-sm">{weeklyPlan[day.key]!.name}</h4>
                        <button
                          onClick={() => removeFromWeeklyPlan(day.key)}
                          className="text-red-500 hover:text-red-700 p-1"
                          title="Remover treino"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                      <div className="text-xs text-blue-700 space-y-1">
                        {weeklyPlan[day.key]!.muscleGroup && (
                          <div className="flex items-center gap-1">
                            <Target className="w-3 h-3" />
                            {weeklyPlan[day.key]!.muscleGroup}
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <Dumbbell className="w-3 h-3" />
                          {weeklyPlan[day.key]!.exercises.length} exercícios
                        </div>
                        {weeklyPlan[day.key]!.duration && (
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {weeklyPlan[day.key]!.duration} min
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <div className="text-gray-400 mb-2">
                      <Dumbbell className="w-8 h-8 mx-auto opacity-30" />
                    </div>
                    <p className="text-gray-500 text-sm mb-3">Nenhum treino</p>
                    <select
                      value={selectedDay === day.key ? selectedDay : ''}
                      onChange={(e) => {
                        const workoutId = e.target.value;
                        if (workoutId) {
                          const workout = workouts.find(w => w.id === workoutId);
                          if (workout) {
                            addToWeeklyPlan(workout, day.key);
                          }
                        }
                      }}
                      className="w-full text-xs border border-gray-300 rounded px-2 py-1"
                    >
                      <option value="">Adicionar treino</option>
                      {workouts.map(workout => (
                        <option key={workout.id} value={workout.id}>
                          {workout.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modelos de Treino */}
      {showTemplates && (
        <div className="mb-8">
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-purple-600" />
              Modelos de Treino para Iniciantes e Intermediários
            </h2>
            <p className="text-gray-700 mb-4">
              Escolha entre nossos treinos pré-definidos, criados especialmente para iniciantes e intermediários com exercícios seguros e eficazes.
            </p>

            {/* Filtros */}
            <div className="flex flex-wrap gap-4 mb-6">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-500" />
                <select
                  value={selectedMuscleGroup}
                  onChange={(e) => setSelectedMuscleGroup(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
                >
                  {muscleGroups.map(group => (
                    <option key={group} value={group}>{group}</option>
                  ))}
                </select>
              </div>
              <div>
                <select
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
                >
                  {difficulties.map(diff => (
                    <option key={diff} value={diff}>{diff}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Grid de Modelos */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {filteredTemplates.map((template) => (
              <div key={template.id} className="bg-white p-6 rounded-lg shadow-md border hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{template.name}</h3>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${getDifficultyColor(template.difficulty)}`}>
                      {template.difficulty}
                    </span>
                  </div>
                  <Target className="w-5 h-5 text-blue-500" />
                </div>

                <p className="text-sm text-gray-600 mb-4">{template.description}</p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <Dumbbell className="w-4 h-4" />
                    <span>{template.muscleGroup}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <Clock className="w-4 h-4" />
                    <span>{template.duration} minutos</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <Play className="w-4 h-4" />
                    <span>{template.exercises.length} exercícios</span>
                  </div>
                  <div className="text-sm text-orange-600 font-medium">
                    ~{getTotalCaloriesBurned(template.exercises)} calorias queimadas
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <h4 className="text-sm font-medium text-gray-800">Exercícios:</h4>
                  <div className="text-xs text-gray-600 space-y-1">
                    {template.exercises.slice(0, 3).map((exercise, index) => (
                      <div key={index}>
                        • {exercise.name} - {exercise.sets}x{exercise.reps}
                      </div>
                    ))}
                    {template.exercises.length > 3 && (
                      <div className="text-gray-500">+{template.exercises.length - 3} mais...</div>
                    )}
                  </div>
                </div>

                <div className="flex gap-2">
                  <PremiumButton
                    onClick={() => useTemplate(template)}
                    className="flex-1 bg-green-600 text-white py-2 px-3 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                    feature="Salvar Treino Profissional"
                    description="Salve modelos de treino profissionais em seus treinos pessoais"
                  >
                    Usar Agora
                  </PremiumButton>
                  <button
                    onClick={() => startCustomWorkout(template)}
                    className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                  >
                    Personalizar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Formulário de Criação */}
      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold mb-4">Criar Novo Treino</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Treino</label>
              <input
                type="text"
                value={workoutName}
                onChange={(e) => setWorkoutName(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>

            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-medium">Exercícios</h3>
                <button
                  type="button"
                  onClick={handleAddExercise}
                  className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                >
                  Adicionar Exercício
                </button>
              </div>

              {exercises.map((exercise) => (
                <div key={exercise.id} className="border border-gray-200 rounded p-4 mb-4">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Exercício</label>
                      <input
                        type="text"
                        value={exercise.name}
                        onChange={(e) => handleExerciseChange(exercise.id, 'name', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md"
                        placeholder="ex: Supino reto"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Séries</label>
                      <input
                        type="number"
                        value={exercise.sets}
                        onChange={(e) => handleExerciseChange(exercise.id, 'sets', parseInt(e.target.value))}
                        className="w-full p-2 border border-gray-300 rounded-md"
                        min="1"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Repetições</label>
                      <input
                        type="number"
                        value={exercise.reps}
                        onChange={(e) => handleExerciseChange(exercise.id, 'reps', parseInt(e.target.value))}
                        className="w-full p-2 border border-gray-300 rounded-md"
                        min="1"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Peso (kg)</label>
                      <input
                        type="number"
                        step="0.5"
                        value={exercise.weight || ''}
                        onChange={(e) => handleExerciseChange(exercise.id, 'weight', parseFloat(e.target.value) || undefined)}
                        className="w-full p-2 border border-gray-300 rounded-md"
                        placeholder="opcional"
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveExercise(exercise.id)}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    Remover
                  </button>
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <PremiumButton
                onClick={handleSubmit}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                feature="Salvar Treino Personalizado"
                description="Salve seus treinos personalizados para usar sempre que quiser"
              >
                Salvar Treino
              </PremiumButton>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Treinos Salvos */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Meus Treinos Salvos ({workouts.length})</h2>
          {workouts.length > 0 && (
            <button
              onClick={clearAllWorkouts}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2 text-sm font-medium shadow-md hover:shadow-lg"
            >
              <Trash2 className="w-4 h-4" />
              Excluir Todos ({workouts.length})
            </button>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {workouts.map((workout) => (
            <div key={workout.id} className="bg-white p-6 rounded-lg shadow-md border hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Dumbbell className="w-6 h-6 text-blue-500" />
                  <h3 className="text-xl font-semibold">{workout.name}</h3>
                </div>
                <button
                  onClick={() => deleteWorkout(workout.id)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-full transition-all duration-200 group shadow-sm hover:shadow-md"
                  title={`Excluir treino "${workout.name}" permanentemente`}
                >
                  <Trash2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </button>
              </div>
              
              <div className="space-y-2 mb-4">
                <p className="text-gray-600">
                  {workout.exercises.length} exercício{workout.exercises.length !== 1 ? 's' : ''}
                </p>
                {workout.duration && (
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <Clock className="w-4 h-4" />
                    <span>{workout.duration} minutos</span>
                  </div>
                )}
                {workout.difficulty && (
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${getDifficultyColor(workout.difficulty)}`}>
                    {workout.difficulty}
                  </span>
                )}
              </div>

              <div className="space-y-2 mb-4">
                {workout.exercises.slice(0, 3).map((exercise) => (
                  <div key={exercise.id} className="text-sm text-gray-700">
                    <span className="font-medium">{exercise.name}</span> - {exercise.sets}x{exercise.reps}
                    {exercise.weight && ` (${exercise.weight}kg)`}
                  </div>
                ))}
                {workout.exercises.length > 3 && (
                  <p className="text-sm text-gray-500">+{workout.exercises.length - 3} mais...</p>
                )}
              </div>

              <div className="text-xs text-gray-500 mb-4">
                Criado em {new Date(workout.date).toLocaleDateString('pt-BR')}
              </div>

              {/* Botão para adicionar ao plano semanal */}
              <div className="border-t pt-3">
                <p className="text-xs text-gray-600 mb-2">Adicionar ao plano semanal:</p>
                <select
                  onChange={(e) => {
                    if (e.target.value) {
                      addToWeeklyPlan(workout, e.target.value);
                      e.target.value = '';
                    }
                  }}
                  className="w-full text-xs border border-gray-300 rounded px-2 py-1"
                >
                  <option value="">Selecione o dia</option>
                  {daysOfWeek.map(day => (
                    <option key={day.key} value={day.key} disabled={!!weeklyPlan[day.key]}>
                      {day.label} {weeklyPlan[day.key] ? '(ocupado)' : ''}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ))}
        </div>

        {workouts.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Dumbbell className="w-16 h-16 mx-auto opacity-30" />
            </div>
            <p className="text-gray-500 text-lg mb-2">Nenhum treino criado ainda.</p>
            <p className="text-gray-400 text-sm">
              Use nossos modelos profissionais ou crie seu próprio treino personalizado.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}