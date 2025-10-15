# FitTracker - Aplicativo de Dieta e Treino

Um aplicativo completo para dieta e treino focado em ganho de massa muscular e emagrecimento, permitindo que os usuários personalizem suas refeições e rotinas de exercícios.

## Funcionalidades

### 🍎 Alimentos
- Adição de alimentos com informações nutricionais completas (calorias, proteínas, carboidratos, gorduras)
- Busca e filtro de alimentos
- Armazenamento local dos dados

### 🏋️ Treinos
- Criação de planos de treino de musculação personalizados
- Adição de exercícios com séries, repetições e pesos
- Visualização organizada dos treinos criados

### 📊 Monitoramento
- Acompanhamento diário de calorias consumidas e queimadas
- Registro de peso corporal
- Histórico de progresso com estatísticas gerais

### 🛒 Mercados
- Localização de mercados próximos usando geolocalização
- Comparação de preços dos alimentos cadastrados
- Sugestões dos melhores preços

## Tecnologias Utilizadas

- **Next.js 15** - Framework React para aplicações web
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Framework CSS utilitário
- **Local Storage** - Persistência de dados local
- **Lucide React** - Ícones
- **Geolocalização** - API nativa do navegador

## Como Executar

1. Instale as dependências:
```bash
npm install
```

2. Execute o servidor de desenvolvimento:
```bash
npm run dev
```

3. Abra [http://localhost:3000](http://localhost:3000) no navegador

## Estrutura do Projeto

```
src/
├── app/
│   ├── alimentos/page.tsx      # Página de alimentos
│   ├── treinos/page.tsx        # Página de treinos
│   ├── monitoramento/page.tsx  # Página de monitoramento
│   ├── mercados/page.tsx       # Página de mercados
│   ├── layout.tsx              # Layout principal
│   └── page.tsx                # Página inicial
├── components/
│   └── Header.tsx              # Componente de cabeçalho
├── hooks/
│   └── useLocalStorage.ts      # Hook para Local Storage
└── lib/
    └── types.ts                # Definições de tipos TypeScript
```

## Design e UX

- **Interface Moderna**: Design limpo e intuitivo com Tailwind CSS
- **Cores Vibrantes**: Gradientes azul-roxo para elementos principais
- **Mobile-First**: Totalmente responsivo para todos os dispositivos
- **Tipografia Clara**: Uso de fontes Geist para melhor legibilidade

## Persistência de Dados

Todos os dados são armazenados localmente no navegador usando Local Storage:
- Preferências alimentares
- Planos de treino criados
- Histórico de progresso diário
- Configurações do usuário

## Navegação

O aplicativo possui navegação simples com header fixo contendo links para:
- Home
- Alimentos
- Treinos
- Monitoramento
- Mercados

## Funcionalidades Futuras

- Sincronização com nuvem
- Integração com wearables
- Receitas sugeridas baseadas nos alimentos
- Compartilhamento de treinos
- Gráficos avançados de progresso