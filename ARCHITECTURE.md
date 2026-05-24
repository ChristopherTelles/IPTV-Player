# Arquitetura do IPTV Player

## 📐 Visão Geral

O IPTV Player é um aplicativo React Native construído com Expo, seguindo uma arquitetura modular e escalável. O projeto utiliza Context API para gerenciamento de estado global, AsyncStorage para persistência local e expo-video para reprodução de streams.

```
┌─────────────────────────────────────────────────────────────┐
│                     Camada de Apresentação                  │
│  (Telas: Home, Canais, Favoritos, Settings, Player, Busca)  │
└────────────────────┬────────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────────┐
│                   Camada de Componentes                      │
│  (ChannelCard, EmptyState, ScreenContainer, UI Components)  │
└────────────────────┬────────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────────┐
│                   Camada de Lógica                           │
│  (IPTVContext, Hooks, M3U Parser, Theme Provider)           │
└────────────────────┬────────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────────┐
│                   Camada de Dados                            │
│  (AsyncStorage, Tipos TypeScript)                           │
└─────────────────────────────────────────────────────────────┘
```

## 🗂️ Estrutura de Diretórios

### `app/` — Rotas e Telas
Utiliza Expo Router para navegação file-based. Cada arquivo `.tsx` é uma rota.

```
app/
├── (tabs)/                    # Grupo de abas (tab bar navigation)
│   ├── _layout.tsx           # Configuração das abas
│   ├── index.tsx             # Home screen
│   ├── channels.tsx          # Lista de canais
│   ├── favorites.tsx         # Canais favoritos
│   └── settings.tsx          # Configurações
├── player.tsx                # Player fullscreen (modal)
├── search.tsx                # Busca global (modal)
├── _layout.tsx               # Root layout com providers
└── +not-found.tsx            # Página 404
```

**Fluxo de Navegação:**
```
Root Layout
├── (tabs) — Tab Bar Navigation
│   ├── Home (index)
│   ├── Channels
│   ├── Favorites
│   └── Settings
├── Player (Modal fullscreen)
└── Search (Modal slide_from_bottom)
```

### `components/` — Componentes Reutilizáveis
Componentes React que não são telas, mas blocos de UI reutilizáveis.

```
components/
├── ChannelCard.tsx           # Card individual de canal
├── EmptyState.tsx            # Estado vazio com CTA
├── screen-container.tsx      # Wrapper com SafeArea
├── haptic-tab.tsx            # Tab bar com feedback tátil
├── ui/
│   ├── icon-symbol.tsx       # Mapeamento de ícones
│   └── collapsible.tsx       # Componente colapsável
```

### `context/` — Gerenciamento de Estado Global
Context API + useReducer para estado global imutável.

```
context/
└── IPTVContext.tsx           # Estado global IPTV
    ├── State
    │   ├── playlists: Playlist[]
    │   ├── channels: Channel[]
    │   ├── favorites: string[] (IDs)
    │   └── lastWatched: string (ID)
    ├── Actions
    │   ├── addPlaylist()
    │   ├── removePlaylist()
    │   ├── toggleFavorite()
    │   └── setLastWatched()
    └── Hooks
        └── useIPTV()
```

### `lib/` — Utilitários e Helpers
Funções puras e providers.

```
lib/
├── m3u-parser.ts             # Parser M3U
│   ├── parseM3U()            # Parsing de conteúdo
│   ├── getGroups()           # Extração de grupos
│   └── filterChannels()      # Filtro e busca
├── theme-provider.tsx        # Context de tema
├── utils.ts                  # Utilitários (cn, etc)
└── trpc.ts                   # Cliente tRPC (opcional)
```

### `types/` — Definições TypeScript
Tipos e interfaces do domínio.

```
types/
└── iptv.ts
    ├── Channel               # Dados de canal
    ├── Playlist              # Dados de playlist
    ├── EPGProgram            # (Futuro) Programa EPG
    └── IPTVContextType       # Tipo do contexto
```

## 🔄 Fluxos de Dados Principais

### 1. Adicionar Playlist
```
Settings Screen
    ↓
Modal "Adicionar Playlist"
    ↓
Input URL + Botão "Carregar"
    ↓
IPTVContext.addPlaylist(url)
    ↓
Fetch URL → Validação → parseM3U()
    ↓
Salvar em AsyncStorage
    ↓
Atualizar state → Re-render
    ↓
Exibir canais na tela Channels
```

### 2. Buscar Canal
```
Channels Screen
    ↓
Input de busca
    ↓
filterChannels(query, group)
    ↓
Retorna canais filtrados
    ↓
Re-render lista
```

### 3. Assistir Canal
```
Channels Screen
    ↓
Clique em canal
    ↓
router.push('/player?channelId=...')
    ↓
Player Screen
    ↓
getChannelById(channelId)
    ↓
VideoView com URL do stream
    ↓
Controles overlay
    ↓
setLastWatched(channelId)
```

## 🎨 Sistema de Temas

**Tema Dark-First:**
- Cores definidas em `theme.config.js`
- Sincronizadas com Tailwind CSS e runtime
- CSS variables para web, nativewind para mobile

```javascript
// theme.config.js
const themeColors = {
  primary: { light: '#0a7ea4', dark: '#0a7ea4' },
  background: { light: '#ffffff', dark: '#151718' },
  surface: { light: '#f5f5f5', dark: '#1e2022' },
  // ...
};
```

## 📦 Gerenciamento de Dependências

**Principais Pacotes:**
- `react-native@0.81` — Framework mobile
- `expo@54` — Plataforma de desenvolvimento
- `expo-router@6` — Navegação file-based
- `expo-video@3` — Reprodução de vídeo
- `nativewind@4` — Tailwind CSS
- `@react-native-async-storage/async-storage@2.2` — Persistência

## 🔐 Segurança e Performance

### Segurança
- ✅ Validação de URLs antes de carregar
- ✅ Sem armazenamento de senhas
- ✅ AsyncStorage local (sem servidor)
- ✅ HTTPS recomendado para playlists

### Performance
- ✅ Lazy loading de canais
- ✅ Memoização de componentes
- ✅ FlatList para listas grandes
- ✅ Parser M3U otimizado com regex compilado
- ✅ Cache de imagens com expo-image

## 🧪 Estratégia de Testes

**Cobertura:**
- Parser M3U: 17 testes (parseM3U, getGroups, filterChannels)
- Validação de tipos TypeScript
- Testes de integração (opcional)

---

**Última atualização:** Maio 2026
