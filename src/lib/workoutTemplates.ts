import { WorkoutTemplate, Exercise } from './types';

export const workoutTemplates: WorkoutTemplate[] = [
  // TREINOS PARA INICIANTES - 3 EXERCÍCIOS POR DIVISÃO
  {
    id: 'beginner-chest',
    name: 'Peito - Iniciante',
    description: 'Treino básico para desenvolvimento do peitoral com 3 exercícios fundamentais',
    muscleGroup: 'Peito',
    difficulty: 'Iniciante',
    duration: 30,
    restBetweenSets: 60,
    restBetweenExercises: 90,
    exercises: [
      {
        id: 'push-up-knee',
        name: 'Flexão de Braço (Joelhos)',
        sets: 3,
        reps: 8,
        instructions: 'Apoie os joelhos no chão, mantenha o corpo reto e desça o peito',
        muscleGroup: 'Peito',
        caloriesBurned: 6
      },
      {
        id: 'incline-push-up',
        name: 'Flexão Inclinada',
        sets: 3,
        reps: 10,
        instructions: 'Mãos elevadas em banco ou escada, facilita o movimento',
        muscleGroup: 'Peito',
        caloriesBurned: 5
      },
      {
        id: 'chest-squeeze',
        name: 'Compressão Peitoral',
        sets: 3,
        reps: 15,
        instructions: 'Junte as palmas das mãos na frente do peito e pressione por 3 segundos',
        muscleGroup: 'Peito',
        caloriesBurned: 4
      }
    ]
  },
  {
    id: 'beginner-back',
    name: 'Costas - Iniciante',
    description: 'Fortalecimento básico das costas com exercícios simples',
    muscleGroup: 'Costas',
    difficulty: 'Iniciante',
    duration: 30,
    restBetweenSets: 60,
    restBetweenExercises: 90,
    exercises: [
      {
        id: 'superman',
        name: 'Superman',
        sets: 3,
        reps: 12,
        instructions: 'Deitado de bruços, eleve braços e pernas simultaneamente',
        muscleGroup: 'Lombar',
        caloriesBurned: 4
      },
      {
        id: 'reverse-fly',
        name: 'Crucifixo Inverso',
        sets: 3,
        reps: 12,
        instructions: 'Deitado de bruços, abra os braços lateralmente',
        muscleGroup: 'Costas',
        caloriesBurned: 6
      },
      {
        id: 'prone-y-raise',
        name: 'Elevação Y Pronada',
        sets: 3,
        reps: 10,
        instructions: 'Braços em Y, eleve mantendo polegares para cima',
        muscleGroup: 'Costas',
        caloriesBurned: 5
      }
    ]
  },
  {
    id: 'beginner-legs',
    name: 'Pernas - Iniciante',
    description: 'Exercícios básicos para fortalecimento das pernas',
    muscleGroup: 'Pernas',
    difficulty: 'Iniciante',
    duration: 35,
    restBetweenSets: 60,
    restBetweenExercises: 90,
    exercises: [
      {
        id: 'squat-bodyweight',
        name: 'Agachamento Livre',
        sets: 3,
        reps: 12,
        instructions: 'Pés na largura dos ombros, desça até 90° e suba controladamente',
        muscleGroup: 'Pernas',
        caloriesBurned: 8
      },
      {
        id: 'lunge-static',
        name: 'Afundo Estático',
        sets: 3,
        reps: 10,
        instructions: 'Alterne as pernas, desça o joelho até quase tocar o chão',
        muscleGroup: 'Pernas',
        caloriesBurned: 7
      },
      {
        id: 'glute-bridge',
        name: 'Elevação de Quadril',
        sets: 3,
        reps: 15,
        instructions: 'Deitado, eleve o quadril contraindo os glúteos',
        muscleGroup: 'Glúteos',
        caloriesBurned: 5
      }
    ]
  },
  {
    id: 'beginner-shoulders',
    name: 'Ombros - Iniciante',
    description: 'Desenvolvimento básico dos ombros para iniciantes',
    muscleGroup: 'Ombros',
    difficulty: 'Iniciante',
    duration: 25,
    restBetweenSets: 60,
    restBetweenExercises: 90,
    exercises: [
      {
        id: 'arm-circles',
        name: 'Círculos com os Braços',
        sets: 3,
        reps: 15,
        instructions: 'Braços estendidos, faça círculos pequenos para frente e para trás',
        muscleGroup: 'Ombros',
        caloriesBurned: 3
      },
      {
        id: 'wall-push',
        name: 'Empurrar Parede',
        sets: 3,
        reps: 12,
        instructions: 'De pé, empurre a parede com as mãos na altura dos ombros',
        muscleGroup: 'Ombros',
        caloriesBurned: 4
      },
      {
        id: 'shoulder-shrugs',
        name: 'Elevação de Ombros',
        sets: 3,
        reps: 15,
        instructions: 'Eleve os ombros em direção às orelhas e mantenha por 2 segundos',
        muscleGroup: 'Ombros',
        caloriesBurned: 3
      }
    ]
  },
  {
    id: 'beginner-arms',
    name: 'Braços - Iniciante',
    description: 'Exercícios básicos para bíceps e tríceps',
    muscleGroup: 'Braços',
    difficulty: 'Iniciante',
    duration: 25,
    restBetweenSets: 60,
    restBetweenExercises: 90,
    exercises: [
      {
        id: 'tricep-dips-chair',
        name: 'Mergulho na Cadeira',
        sets: 3,
        reps: 8,
        instructions: 'Use cadeira, desça flexionando apenas os cotovelos',
        muscleGroup: 'Tríceps',
        caloriesBurned: 6
      },
      {
        id: 'wall-push-up',
        name: 'Flexão na Parede',
        sets: 3,
        reps: 12,
        instructions: 'De pé, flexão contra a parede para trabalhar tríceps',
        muscleGroup: 'Tríceps',
        caloriesBurned: 4
      },
      {
        id: 'arm-pulses',
        name: 'Pulsos com Braços',
        sets: 3,
        reps: 20,
        instructions: 'Braços estendidos lateralmente, faça pequenos pulsos para cima',
        muscleGroup: 'Bíceps',
        caloriesBurned: 3
      }
    ]
  },
  {
    id: 'beginner-abs',
    name: 'Abdômen - Iniciante',
    description: 'Exercícios básicos para fortalecimento do core',
    muscleGroup: 'Abdômen',
    difficulty: 'Iniciante',
    duration: 20,
    restBetweenSets: 45,
    restBetweenExercises: 60,
    exercises: [
      {
        id: 'plank',
        name: 'Prancha',
        sets: 3,
        reps: 20,
        instructions: 'Mantenha o corpo reto, apoiado nos antebraços por 20 segundos',
        muscleGroup: 'Core',
        caloriesBurned: 4
      },
      {
        id: 'dead-bug',
        name: 'Dead Bug',
        sets: 3,
        reps: 10,
        instructions: 'Deitado, alterne braço e perna opostos mantendo core ativo',
        muscleGroup: 'Core',
        caloriesBurned: 4
      },
      {
        id: 'knee-to-chest',
        name: 'Joelho ao Peito',
        sets: 3,
        reps: 12,
        instructions: 'Deitado, traga alternadamente os joelhos ao peito',
        muscleGroup: 'Abdômen',
        caloriesBurned: 5
      }
    ]
  },

  // TREINOS INTERMEDIÁRIOS - 3 EXERCÍCIOS POR DIVISÃO
  {
    id: 'intermediate-chest',
    name: 'Peito - Intermediário',
    description: 'Treino intermediário para desenvolvimento avançado do peitoral',
    muscleGroup: 'Peito',
    difficulty: 'Intermediário',
    duration: 40,
    restBetweenSets: 45,
    restBetweenExercises: 75,
    exercises: [
      {
        id: 'push-up-standard',
        name: 'Flexão de Braço Padrão',
        sets: 4,
        reps: 12,
        instructions: 'Corpo reto, desça até o peito quase tocar o chão',
        muscleGroup: 'Peito',
        caloriesBurned: 8
      },
      {
        id: 'push-up-wide',
        name: 'Flexão Abertura Ampla',
        sets: 4,
        reps: 10,
        instructions: 'Mãos mais afastadas, enfatiza peitoral externo',
        muscleGroup: 'Peito',
        caloriesBurned: 9
      },
      {
        id: 'push-up-decline',
        name: 'Flexão Declinada',
        sets: 3,
        reps: 8,
        instructions: 'Pés elevados, maior dificuldade e foco no peitoral superior',
        muscleGroup: 'Peito',
        caloriesBurned: 10
      }
    ]
  },
  {
    id: 'intermediate-back',
    name: 'Costas - Intermediário',
    description: 'Fortalecimento intermediário da musculatura das costas',
    muscleGroup: 'Costas',
    difficulty: 'Intermediário',
    duration: 40,
    restBetweenSets: 45,
    restBetweenExercises: 75,
    exercises: [
      {
        id: 'superman-extended',
        name: 'Superman Estendido',
        sets: 4,
        reps: 15,
        instructions: 'Mantenha a posição por 3 segundos no topo',
        muscleGroup: 'Lombar',
        caloriesBurned: 7
      },
      {
        id: 'reverse-fly-advanced',
        name: 'Crucifixo Inverso Avançado',
        sets: 4,
        reps: 12,
        instructions: 'Movimento mais lento e controlado, foque na contração',
        muscleGroup: 'Costas',
        caloriesBurned: 8
      },
      {
        id: 'prone-t-raise',
        name: 'Elevação T Pronada',
        sets: 3,
        reps: 12,
        instructions: 'Braços em T, eleve lateralmente com controle',
        muscleGroup: 'Costas',
        caloriesBurned: 6
      }
    ]
  },
  {
    id: 'intermediate-legs',
    name: 'Pernas - Intermediário',
    description: 'Treino intermediário para fortalecimento intenso das pernas',
    muscleGroup: 'Pernas',
    difficulty: 'Intermediário',
    duration: 45,
    restBetweenSets: 45,
    restBetweenExercises: 75,
    exercises: [
      {
        id: 'squat-jump',
        name: 'Agachamento com Salto',
        sets: 4,
        reps: 12,
        instructions: 'Agachamento explosivo com salto no final',
        muscleGroup: 'Pernas',
        caloriesBurned: 12
      },
      {
        id: 'lunge-walking',
        name: 'Afundo Caminhando',
        sets: 3,
        reps: 16,
        instructions: 'Afundos alternados caminhando para frente',
        muscleGroup: 'Pernas',
        caloriesBurned: 10
      },
      {
        id: 'single-leg-glute-bridge',
        name: 'Elevação Unilateral de Quadril',
        sets: 3,
        reps: 12,
        instructions: 'Uma perna por vez, maior ativação dos glúteos',
        muscleGroup: 'Glúteos',
        caloriesBurned: 8
      }
    ]
  },
  {
    id: 'intermediate-shoulders',
    name: 'Ombros - Intermediário',
    description: 'Desenvolvimento intermediário dos ombros',
    muscleGroup: 'Ombros',
    difficulty: 'Intermediário',
    duration: 35,
    restBetweenSets: 45,
    restBetweenExercises: 75,
    exercises: [
      {
        id: 'pike-push-up',
        name: 'Flexão Pike',
        sets: 4,
        reps: 8,
        instructions: 'Posição de V invertido, trabalha ombros intensamente',
        muscleGroup: 'Ombros',
        caloriesBurned: 7
      },
      {
        id: 'lateral-raises',
        name: 'Elevação Lateral',
        sets: 4,
        reps: 12,
        instructions: 'Braços estendidos, eleve lateralmente até a altura dos ombros',
        muscleGroup: 'Ombros',
        caloriesBurned: 6
      },
      {
        id: 'front-raises',
        name: 'Elevação Frontal',
        sets: 3,
        reps: 12,
        instructions: 'Eleve os braços à frente até a altura dos ombros',
        muscleGroup: 'Ombros',
        caloriesBurned: 5
      }
    ]
  },
  {
    id: 'intermediate-arms',
    name: 'Braços - Intermediário',
    description: 'Treino intermediário para bíceps e tríceps',
    muscleGroup: 'Braços',
    difficulty: 'Intermediário',
    duration: 35,
    restBetweenSets: 45,
    restBetweenExercises: 75,
    exercises: [
      {
        id: 'tricep-dips',
        name: 'Mergulho para Tríceps',
        sets: 4,
        reps: 10,
        instructions: 'Use cadeira ou banco, desça flexionando apenas os cotovelos',
        muscleGroup: 'Tríceps',
        caloriesBurned: 8
      },
      {
        id: 'push-up-close',
        name: 'Flexão Pegada Fechada',
        sets: 4,
        reps: 8,
        instructions: 'Mãos próximas, trabalha tríceps intensamente',
        muscleGroup: 'Tríceps',
        caloriesBurned: 7
      },
      {
        id: 'isometric-bicep',
        name: 'Bíceps Isométrico',
        sets: 3,
        reps: 30,
        instructions: 'Flexione os braços e mantenha por 30 segundos',
        muscleGroup: 'Bíceps',
        caloriesBurned: 5
      }
    ]
  },
  {
    id: 'intermediate-abs',
    name: 'Abdômen - Intermediário',
    description: 'Treino intermediário para fortalecimento do core',
    muscleGroup: 'Abdômen',
    difficulty: 'Intermediário',
    duration: 30,
    restBetweenSets: 30,
    restBetweenExercises: 45,
    exercises: [
      {
        id: 'bicycle-crunch',
        name: 'Bicicleta',
        sets: 4,
        reps: 20,
        instructions: 'Alterne cotovelo com joelho oposto',
        muscleGroup: 'Abdômen',
        caloriesBurned: 8
      },
      {
        id: 'russian-twist',
        name: 'Rotação Russa',
        sets: 4,
        reps: 20,
        instructions: 'Sentado, gire o tronco de um lado para outro',
        muscleGroup: 'Oblíquos',
        caloriesBurned: 7
      },
      {
        id: 'plank-side',
        name: 'Prancha Lateral',
        sets: 3,
        reps: 30,
        instructions: 'Cada lado por 30 segundos, trabalha oblíquos',
        muscleGroup: 'Oblíquos',
        caloriesBurned: 6
      }
    ]
  },

  // TREINOS FULL BODY
  {
    id: 'beginner-full-body',
    name: 'Corpo Todo - Iniciante',
    description: 'Treino completo para iniciantes com exercícios básicos',
    muscleGroup: 'Corpo Todo',
    difficulty: 'Iniciante',
    duration: 45,
    restBetweenSets: 60,
    restBetweenExercises: 90,
    exercises: [
      {
        id: 'squat-bodyweight',
        name: 'Agachamento Livre',
        sets: 3,
        reps: 12,
        instructions: 'Pés na largura dos ombros, desça até 90° e suba controladamente',
        muscleGroup: 'Pernas',
        caloriesBurned: 8
      },
      {
        id: 'push-up-knee',
        name: 'Flexão de Braço (Joelhos)',
        sets: 3,
        reps: 8,
        instructions: 'Apoie os joelhos no chão, mantenha o corpo reto e desça o peito',
        muscleGroup: 'Peito',
        caloriesBurned: 6
      },
      {
        id: 'plank',
        name: 'Prancha',
        sets: 3,
        reps: 30,
        instructions: 'Mantenha o corpo reto, apoiado nos antebraços por 30 segundos',
        muscleGroup: 'Core',
        caloriesBurned: 4
      }
    ]
  },
  {
    id: 'intermediate-full-body',
    name: 'Corpo Todo - Intermediário',
    description: 'Treino completo intermediário com maior intensidade',
    muscleGroup: 'Corpo Todo',
    difficulty: 'Intermediário',
    duration: 50,
    restBetweenSets: 45,
    restBetweenExercises: 75,
    exercises: [
      {
        id: 'squat-jump',
        name: 'Agachamento com Salto',
        sets: 4,
        reps: 12,
        instructions: 'Agachamento explosivo com salto no final',
        muscleGroup: 'Pernas',
        caloriesBurned: 12
      },
      {
        id: 'push-up-standard',
        name: 'Flexão de Braço Padrão',
        sets: 4,
        reps: 10,
        instructions: 'Corpo reto, desça até o peito quase tocar o chão',
        muscleGroup: 'Peito',
        caloriesBurned: 8
      },
      {
        id: 'mountain-climber',
        name: 'Escalador',
        sets: 4,
        reps: 20,
        instructions: 'Posição de prancha, alterne joelhos ao peito rapidamente',
        muscleGroup: 'Core',
        caloriesBurned: 10
      }
    ]
  }
];

export const muscleGroups = [
  'Todos',
  'Corpo Todo',
  'Peito',
  'Costas',
  'Pernas',
  'Ombros',
  'Braços',
  'Abdômen'
];

export const difficulties = ['Todos', 'Iniciante', 'Intermediário'];