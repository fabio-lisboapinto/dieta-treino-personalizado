'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Dumbbell, Apple, BarChart3, MapPin, User, CreditCard, Crown, Menu, X } from 'lucide-react';
import { AuthService } from '../lib/auth';
import { PremiumBadge } from './PremiumComponents';

export default function Header() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [user, setUser] = useState(null);
  const [isPremium, setIsPremium] = useState(false);

  useEffect(() => {
    setIsClient(true);
    
    // Só acessar AuthService após hidratação
    if (typeof window !== 'undefined') {
      try {
        const authService = AuthService.getInstance();
        const currentUser = authService.getCurrentUser();
        const premiumStatus = authService.isPremiumUser();
        
        setUser(currentUser);
        setIsPremium(premiumStatus);
      } catch (error) {
        console.warn('Erro ao carregar dados do usuário:', error);
      }
    }
  }, []);

  const navItems = [
    { href: '/', label: 'Início', icon: Dumbbell },
    { href: '/perfil', label: 'Perfil', icon: User },
    { href: '/alimentos', label: 'Alimentos', icon: Apple },
    { href: '/treinos', label: 'Treinos', icon: Dumbbell },
    { href: '/monitoramento', label: 'Monitoramento', icon: BarChart3 },
    { href: '/mercados', label: 'Mercados', icon: MapPin },
    { href: '/pagamento', label: 'Premium', icon: CreditCard },
  ];

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <Dumbbell className="w-8 h-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">FitTracker</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              const isPremiumPage = item.href === '/pagamento';
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors relative ${
                    isActive
                      ? 'bg-blue-100 text-blue-700'
                      : isPremiumPage
                      ? 'text-orange-600 hover:text-orange-700 hover:bg-orange-50'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                  {isPremiumPage && !isPremium && (
                    <Crown className="w-4 h-4 text-orange-500" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* User Status & Mobile Menu Button */}
          <div className="flex items-center gap-3">
            {isClient && user && (
              <div className="hidden md:flex items-center gap-3">
                <span className="text-sm text-gray-600">
                  Olá, {user.name.split(' ')[0]}
                </span>
                <PremiumBadge />
              </div>
            )}
            
            {/* Mobile menu button */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            {/* User Status Mobile */}
            {isClient && user && (
              <div className="flex items-center justify-between px-3 py-2 mb-4 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-700">
                  Olá, {user.name.split(' ')[0]}
                </span>
                <PremiumBadge />
              </div>
            )}
            
            <nav className="flex flex-col gap-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                const isPremiumPage = item.href === '/pagamento';
                
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors relative ${
                      isActive
                        ? 'bg-blue-100 text-blue-700'
                        : isPremiumPage
                        ? 'text-orange-600 hover:text-orange-700 hover:bg-orange-50'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                    {isPremiumPage && !isPremium && (
                      <Crown className="w-4 h-4 text-orange-500 ml-auto" />
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}