'use client';

import { useState, useEffect } from 'react';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { SelectedFood } from '../../lib/types';
import { MapPin, Search, Navigation, Phone, Clock, Star, ShoppingCart, Crown } from 'lucide-react';
import { PremiumFeature } from '../../components/PremiumComponents';

interface Market {
  id: string;
  name: string;
  address: string;
  distance: number;
  rating: number;
  phone: string;
  hours: string;
  priceLevel: 'low' | 'medium' | 'high';
  specialties: string[];
  coordinates: { lat: number; lng: number };
}

const mockMarkets: Market[] = [
  {
    id: '1',
    name: 'Supermercado Economia',
    address: 'Rua das Flores, 123 - Centro',
    distance: 0.8,
    rating: 4.2,
    phone: '(11) 3456-7890',
    hours: '07:00 - 22:00',
    priceLevel: 'low',
    specialties: ['Frutas', 'Verduras', 'Carnes'],
    coordinates: { lat: -23.5505, lng: -46.6333 }
  },
  {
    id: '2',
    name: 'Mercado Orgânico Verde',
    address: 'Av. Paulista, 456 - Bela Vista',
    distance: 1.2,
    rating: 4.7,
    phone: '(11) 2345-6789',
    hours: '08:00 - 20:00',
    priceLevel: 'high',
    specialties: ['Orgânicos', 'Integrais', 'Suplementos'],
    coordinates: { lat: -23.5618, lng: -46.6565 }
  },
  {
    id: '3',
    name: 'Atacadão do Bairro',
    address: 'Rua do Comércio, 789 - Vila Nova',
    distance: 2.1,
    rating: 4.0,
    phone: '(11) 4567-8901',
    hours: '06:00 - 23:00',
    priceLevel: 'low',
    specialties: ['Atacado', 'Grãos', 'Proteínas'],
    coordinates: { lat: -23.5489, lng: -46.6388 }
  },
  {
    id: '4',
    name: 'Empório Gourmet',
    address: 'Rua Augusta, 321 - Consolação',
    distance: 1.8,
    rating: 4.5,
    phone: '(11) 5678-9012',
    hours: '09:00 - 21:00',
    priceLevel: 'high',
    specialties: ['Importados', 'Gourmet', 'Vinhos'],
    coordinates: { lat: -23.5558, lng: -46.6396 }
  },
  {
    id: '5',
    name: 'Mercado da Esquina',
    address: 'Rua São João, 654 - República',
    distance: 0.5,
    rating: 3.8,
    phone: '(11) 6789-0123',
    hours: '07:00 - 21:00',
    priceLevel: 'medium',
    specialties: ['Conveniência', 'Básicos', 'Padaria'],
    coordinates: { lat: -23.5431, lng: -46.6291 }
  },
  {
    id: '6',
    name: 'Hiper Saúde',
    address: 'Av. Faria Lima, 987 - Itaim Bibi',
    distance: 3.2,
    rating: 4.6,
    phone: '(11) 7890-1234',
    hours: '08:00 - 22:00',
    priceLevel: 'medium',
    specialties: ['Fitness', 'Naturais', 'Suplementos'],
    coordinates: { lat: -23.5733, lng: -46.6892 }
  }
];

export default function MercadosPage() {
  const [selectedFoods] = useLocalStorage<SelectedFood[]>('selectedFoods', []);
  const [searchTerm, setSearchTerm] = useState('');
  const [priceFilter, setPriceFilter] = useState<'all' | 'low' | 'medium' | 'high'>('all');
  const [sortBy, setSortBy] = useState<'distance' | 'rating' | 'price'>('distance');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const filteredMarkets = mockMarkets
    .filter(market => {
      const matchesSearch = market.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           market.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           market.specialties.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesPrice = priceFilter === 'all' || market.priceLevel === priceFilter;
      return matchesSearch && matchesPrice;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'distance':
          return a.distance - b.distance;
        case 'rating':
          return b.rating - a.rating;
        case 'price':
          const priceOrder = { low: 1, medium: 2, high: 3 };
          return priceOrder[a.priceLevel] - priceOrder[b.priceLevel];
        default:
          return 0;
      }
    });

  const getPriceLevelLabel = (level: string) => {
    switch (level) {
      case 'low': return 'Econômico';
      case 'medium': return 'Médio';
      case 'high': return 'Premium';
      default: return level;
    }
  };

  const getPriceLevelColor = (level: string) => {
    switch (level) {
      case 'low': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'high': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const generateShoppingList = () => {
    if (selectedFoods.length === 0) {
      alert('ℹ️ Adicione alimentos à sua seleção primeiro para gerar uma lista de compras.');
      return;
    }

    const list = selectedFoods.map(sf => 
      `• ${sf.food.name} - ${sf.quantity}g`
    ).join('\n');

    const fullList = `🛒 LISTA DE COMPRAS - FitTracker\n\n${list}\n\nTotal de itens: ${selectedFoods.length}\nGerado em: ${new Date().toLocaleDateString('pt-BR')}`;

    // Copiar para clipboard
    navigator.clipboard.writeText(fullList).then(() => {
      alert('✅ Lista de compras copiada para a área de transferência!');
    }).catch(() => {
      // Fallback: mostrar em alert
      alert(`📋 Sua lista de compras:\n\n${fullList}`);
    });
  };

  if (!isClient) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <MapPin className="w-16 h-16 mx-auto opacity-30 text-gray-400" />
          <p className="text-gray-500 text-lg mt-4">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <PremiumFeature
      feature="Localizador de Mercados"
      description="Encontre os melhores mercados próximos com preços especiais para os alimentos da sua dieta"
    >
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Mercados Próximos</h1>
          <div className="flex items-center gap-2">
            <Crown className="w-5 h-5 text-orange-500" />
            <span className="text-sm text-orange-600 font-medium">Recurso Premium</span>
          </div>
        </div>

        {/* Lista de Compras */}
        {selectedFoods.length > 0 && (
          <div className="bg-gradient-to-r from-blue-50 to-green-50 p-6 rounded-lg shadow-md mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-blue-600" />
                Sua Lista de Compras ({selectedFoods.length} itens)
              </h2>
              <button
                onClick={generateShoppingList}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 text-sm"
              >
                <ShoppingCart className="w-4 h-4" />
                Gerar Lista
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {selectedFoods.slice(0, 6).map((sf) => (
                <div key={sf.id} className="bg-white p-3 rounded-lg flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 text-sm">{sf.food.name}</p>
                    <p className="text-xs text-gray-600">{sf.quantity}g</p>
                  </div>
                </div>
              ))}
              {selectedFoods.length > 6 && (
                <div className="bg-white p-3 rounded-lg flex items-center justify-center text-gray-500 text-sm">
                  +{selectedFoods.length - 6} mais...
                </div>
              )}
            </div>
          </div>
        )}

        {/* Filtros */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar mercados, endereços ou especialidades..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="flex gap-4">
              <select
                value={priceFilter}
                onChange={(e) => setPriceFilter(e.target.value as any)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Todos os preços</option>
                <option value="low">Econômico</option>
                <option value="medium">Médio</option>
                <option value="high">Premium</option>
              </select>
              
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="distance">Mais próximos</option>
                <option value="rating">Melhor avaliados</option>
                <option value="price">Menor preço</option>
              </select>
            </div>
          </div>
        </div>

        {/* Lista de Mercados */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredMarkets.map((market) => (
            <div key={market.id} className="bg-white p-6 rounded-lg shadow-md border hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{market.name}</h3>
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">{market.address}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Navigation className="w-4 h-4 text-blue-500" />
                    <span className="text-sm text-blue-600 font-medium">{market.distance} km</span>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="flex items-center gap-1 mb-2">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-medium">{market.rating}</span>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${getPriceLevelColor(market.priceLevel)}`}>
                    {getPriceLevelLabel(market.priceLevel)}
                  </span>
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Phone className="w-4 h-4" />
                  <span>{market.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span>{market.hours}</span>
                </div>
              </div>

              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Especialidades:</h4>
                <div className="flex flex-wrap gap-1">
                  {market.specialties.map((specialty, index) => (
                    <span key={index} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                      {specialty}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    const url = `https://www.google.com/maps/dir/?api=1&destination=${market.coordinates.lat},${market.coordinates.lng}`;
                    window.open(url, '_blank');
                  }}
                  className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center justify-center gap-2"
                >
                  <Navigation className="w-4 h-4" />
                  Como Chegar
                </button>
                
                <button
                  onClick={() => {
                    window.open(`tel:${market.phone}`, '_self');
                  }}
                  className="bg-green-600 text-white py-2 px-3 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium flex items-center justify-center gap-2"
                >
                  <Phone className="w-4 h-4" />
                  Ligar
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredMarkets.length === 0 && (
          <div className="text-center py-12">
            <MapPin className="w-16 h-16 mx-auto opacity-30 text-gray-400" />
            <p className="text-gray-500 text-lg mt-4">Nenhum mercado encontrado</p>
            <p className="text-gray-400 text-sm">Tente ajustar os filtros de busca</p>
          </div>
        )}

        {/* Dicas */}
        <div className="bg-gradient-to-r from-orange-50 to-yellow-50 p-6 rounded-lg shadow-md mt-8">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Crown className="w-5 h-5 text-orange-500" />
            Dicas para Economizar
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <span className="text-green-500">💡</span>
                <span>Compare preços entre mercados próximos antes de sair de casa</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-green-500">💡</span>
                <span>Mercados econômicos são ideais para compras em quantidade</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-green-500">💡</span>
                <span>Verifique os horários de funcionamento antes de se deslocar</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <span className="text-green-500">💡</span>
                <span>Mercados orgânicos têm produtos específicos para dietas fitness</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-green-500">💡</span>
                <span>Use a lista de compras gerada para não esquecer nenhum item</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-green-500">💡</span>
                <span>Ligue antes para confirmar disponibilidade de produtos específicos</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PremiumFeature>
  );
}