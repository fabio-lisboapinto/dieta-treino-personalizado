// Sistema de autenticação e gerenciamento de usuário
export interface User {
  id: string;
  email: string;
  name: string;
  isPremium: boolean;
  premiumExpiresAt?: string;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

// Simulação de usuário para demonstração
const DEMO_USER: User = {
  id: 'demo-user-1',
  email: 'usuario@exemplo.com',
  name: 'Usuário Demo',
  isPremium: false,
  createdAt: new Date().toISOString()
};

export class AuthService {
  private static instance: AuthService;
  private authState: AuthState = {
    user: null,
    isAuthenticated: false
  };

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  // Inicializar com usuário demo (em produção seria login real)
  initDemoUser(): User {
    const savedUser = localStorage.getItem('fittracker_user');
    if (savedUser) {
      this.authState.user = JSON.parse(savedUser);
    } else {
      this.authState.user = DEMO_USER;
      localStorage.setItem('fittracker_user', JSON.stringify(DEMO_USER));
    }
    this.authState.isAuthenticated = true;
    return this.authState.user;
  }

  getCurrentUser(): User | null {
    if (!this.authState.user && typeof window !== 'undefined') {
      this.initDemoUser();
    }
    return this.authState.user;
  }

  isPremiumUser(): boolean {
    const user = this.getCurrentUser();
    if (!user) return false;
    
    if (!user.isPremium) return false;
    
    // Verificar se o premium não expirou
    if (user.premiumExpiresAt) {
      const expirationDate = new Date(user.premiumExpiresAt);
      const now = new Date();
      return expirationDate > now;
    }
    
    return user.isPremium;
  }

  upgradeToPremium(): void {
    const user = this.getCurrentUser();
    if (!user) return;

    // Simular upgrade para premium (6 meses)
    const expirationDate = new Date();
    expirationDate.setMonth(expirationDate.getMonth() + 6);

    const updatedUser: User = {
      ...user,
      isPremium: true,
      premiumExpiresAt: expirationDate.toISOString()
    };

    this.authState.user = updatedUser;
    localStorage.setItem('fittracker_user', JSON.stringify(updatedUser));
  }

  getPremiumStatus(): { isPremium: boolean; daysRemaining?: number; expiresAt?: string } {
    const user = this.getCurrentUser();
    if (!user || !user.isPremium) {
      return { isPremium: false };
    }

    if (user.premiumExpiresAt) {
      const expirationDate = new Date(user.premiumExpiresAt);
      const now = new Date();
      const daysRemaining = Math.ceil((expirationDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      
      return {
        isPremium: daysRemaining > 0,
        daysRemaining: Math.max(0, daysRemaining),
        expiresAt: user.premiumExpiresAt
      };
    }

    return { isPremium: true };
  }

  // Simular logout (limpar dados)
  logout(): void {
    this.authState = {
      user: null,
      isAuthenticated: false
    };
    localStorage.removeItem('fittracker_user');
  }
}