'use client';

import React, { useState, useEffect } from 'react';
import { Crown, Lock, Zap, Check, X } from 'lucide-react';
import { AuthService } from '../lib/auth';

interface PremiumBlockerProps {
  feature: string;
  description: string;
  onUpgrade?: () => void;
  children?: React.ReactNode;
}

export const PremiumBlocker: React.FC<PremiumBlockerProps> = ({
  feature,
  description,
  onUpgrade,
  children
}) => {
  const [isPremium, setIsPremium] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    if (typeof window !== 'undefined') {
      try {
        const authService = AuthService.getInstance();
        setIsPremium(authService.isPremiumUser());
      } catch (error) {
        console.warn('Erro ao verificar status premium:', error);
      }
    }
  }, []);

  if (!isClient) {
    return <>{children}</>;
  }

  if (isPremium) {
    return <>{children}</>;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="text-center mb-6">
          <div className="bg-gradient-to-r from-orange-100 to-red-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <Crown className="w-8 h-8 text-orange-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Recurso Premium
          </h3>
          <p className="text-gray-600">
            Para {feature.toLowerCase()}, você precisa do plano Premium
          </p>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <Lock className="w-5 h-5 text-gray-400 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-gray-900 mb-1">
                {feature}
              </p>
              <p className="text-sm text-gray-600">
                {description}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-3 mb-6">
          <div className="flex items-center gap-3">
            <Check className="w-5 h-5 text-green-500" />
            <span className="text-sm text-gray-700">110+ alimentos com macros completos</span>
          </div>
          <div className="flex items-center gap-3">
            <Check className="w-5 h-5 text-green-500" />
            <span className="text-sm text-gray-700">15+ modelos de treino profissionais</span>
          </div>
          <div className="flex items-center gap-3">
            <Check className="w-5 h-5 text-green-500" />
            <span className="text-sm text-gray-700">Monitoramento automático integrado</span>
          </div>
          <div className="flex items-center gap-3">
            <Check className="w-5 h-5 text-green-500" />
            <span className="text-sm text-gray-700">Cálculo de TMB personalizado</span>
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 p-4 rounded-lg mb-6">
          <div className="text-center">
            <p className="text-orange-800 font-semibold mb-1">
              Oferta Especial!
            </p>
            <p className="text-2xl font-bold text-orange-600 mb-1">
              R$ 19,90/mês
            </p>
            <p className="text-sm text-orange-700">
              Primeiros 6 meses • Depois R$ 29,90/mês
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => {
              if (onUpgrade) onUpgrade();
              // Simular upgrade para demonstração
              try {
                const authService = AuthService.getInstance();
                authService.upgradeToPremium();
                window.location.reload();
              } catch (error) {
                console.warn('Erro ao fazer upgrade:', error);
              }
            }}
            className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 px-4 rounded-lg hover:from-orange-600 hover:to-red-600 transition-all font-medium flex items-center justify-center gap-2"
          >
            <Crown className="w-5 h-5" />
            Assinar Premium
          </button>
          <button
            onClick={() => window.history.back()}
            className="px-4 py-3 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-gray-500 text-center mt-4">
          Cancele a qualquer momento • Sem compromisso
        </p>
      </div>
    </div>
  );
};

interface PremiumFeatureProps {
  children: React.ReactNode;
  feature: string;
  description: string;
  requiresPremium?: boolean;
}

export const PremiumFeature: React.FC<PremiumFeatureProps> = ({
  children,
  feature,
  description,
  requiresPremium = true
}) => {
  const [isPremium, setIsPremium] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    if (typeof window !== 'undefined') {
      try {
        const authService = AuthService.getInstance();
        setIsPremium(authService.isPremiumUser());
      } catch (error) {
        console.warn('Erro ao verificar status premium:', error);
      }
    }
  }, []);

  if (!isClient) {
    return <>{children}</>;
  }

  if (!requiresPremium || isPremium) {
    return <>{children}</>;
  }

  return (
    <PremiumBlocker
      feature={feature}
      description={description}
    >
      {children}
    </PremiumBlocker>
  );
};

export const PremiumBadge: React.FC = () => {
  const [premiumStatus, setPremiumStatus] = useState({ isPremium: false });
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    if (typeof window !== 'undefined') {
      try {
        const authService = AuthService.getInstance();
        setPremiumStatus(authService.getPremiumStatus());
      } catch (error) {
        console.warn('Erro ao verificar status premium:', error);
      }
    }
  }, []);

  if (!isClient || !premiumStatus.isPremium) {
    return null;
  }

  return (
    <div className="inline-flex items-center gap-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium">
      <Crown className="w-4 h-4" />
      Premium
      {premiumStatus.daysRemaining && premiumStatus.daysRemaining <= 30 && (
        <span className="ml-1 text-xs">
          ({premiumStatus.daysRemaining}d)
        </span>
      )}
    </div>
  );
};

interface PremiumButtonProps {
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
  className?: string;
  feature: string;
  description: string;
}

export const PremiumButton: React.FC<PremiumButtonProps> = ({
  onClick,
  disabled = false,
  children,
  className = '',
  feature,
  description
}) => {
  const [isPremium, setIsPremium] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [showBlocker, setShowBlocker] = useState(false);

  useEffect(() => {
    setIsClient(true);
    if (typeof window !== 'undefined') {
      try {
        const authService = AuthService.getInstance();
        setIsPremium(authService.isPremiumUser());
      } catch (error) {
        console.warn('Erro ao verificar status premium:', error);
      }
    }
  }, []);

  const handleClick = () => {
    if (!isPremium) {
      setShowBlocker(true);
      return;
    }
    onClick();
  };

  if (!isClient) {
    return (
      <button
        onClick={onClick}
        disabled={disabled}
        className={className}
      >
        {children}
      </button>
    );
  }

  return (
    <>
      <button
        onClick={handleClick}
        disabled={disabled}
        className={`${className} ${!isPremium ? 'relative' : ''}`}
      >
        {children}
        {!isPremium && (
          <Crown className="w-4 h-4 absolute -top-1 -right-1 text-orange-500" />
        )}
      </button>

      {showBlocker && (
        <PremiumBlocker
          feature={feature}
          description={description}
          onUpgrade={() => setShowBlocker(false)}
        />
      )}
    </>
  );
};