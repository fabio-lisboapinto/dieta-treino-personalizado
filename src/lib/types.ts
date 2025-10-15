export interface Food {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar: number;
  sodium: number;
  servingSize: string;
  // Micronutrientes
  vitamins: {
    vitaminA: number; // mcg
    vitaminC: number; // mg
    vitaminD: number; // mcg
    vitaminE: number; // mg
    vitaminK: number; // mcg
    vitaminB1: number; // mg
    vitaminB2: number; // mg
    vitaminB3: number; // mg
    vitaminB6: number; // mg
    vitaminB12: number; // mcg
    folate: number; // mcg
  };
  minerals: {
    calcium: number; // mg
    iron: number; // mg
    magnesium: number; // mg
    phosphorus: number; // mg
    potassium: number; // mg
    zinc: number; // mg
    selenium: number; // mcg
  };
  category: string;
}

export interface SelectedFood {
  id: string;
  food: Food;
  quantity: number;
  totalNutrients: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
  };
  addedAt: string;
}

export interface Workout {
  id: string;
  name: string;
  exercises: Exercise[];
  date: string;
  muscleGroup?: string;
  difficulty?: 'Iniciante' | 'Intermediário' | 'Avançado';
  duration?: number; // em minutos
}

export interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
  weight?: number;
  caloriesBurned?: number;
  instructions?: string;
  muscleGroup?: string;
}

export interface DailyProgress {
  date: string;
  caloriesConsumed: number;
  caloriesBurned: number;
  weight?: number;
}

export interface Market {
  id: string;
  name: string;
  address: string;
  distance: number;
  prices: { [foodId: string]: number };
}

// Perfil do usuário atualizado
export interface UserProfile {
  name: string;
  age: number;
  height: number; // cm
  weight: number; // kg
  gender: 'male' | 'female';
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
  goal: 'lose' | 'maintain' | 'gain';
  targetWeight?: number;
  targetDate?: string;
  tmb: number; // Taxa Metabólica Basal
  targetCalories: number;
  targetProtein: number;
  targetCarbs: number;
  targetFat: number;
  createdAt: string;
  updatedAt: string;
}

export interface WorkoutTemplate {
  id: string;
  name: string;
  description: string;
  muscleGroup: string;
  difficulty: 'Iniciante' | 'Intermediário' | 'Avançado';
  duration: number; // em minutos
  exercises: Exercise[];
  restBetweenSets?: number; // segundos
  restBetweenExercises?: number; // segundos
}

// Plano alimentar simplificado
export interface MealPlan {
  [day: string]: { // 'monday', 'tuesday', etc.
    [meal: string]: SelectedFood[]; // 'breakfast', 'lunch', etc.
  };
}

export interface DailyMealPlan {
  [meal: string]: SelectedFood[]; // 'breakfast', 'lunch', etc.
}

// Monitoramento integrado
export interface IntegratedProgress {
  date: string;
  userProfile: UserProfile;
  selectedFoods: SelectedFood[];
  completedWorkouts: Workout[];
  totalNutrients: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
  };
  caloriesBurned: number;
  weight?: number;
  notes?: string;
}