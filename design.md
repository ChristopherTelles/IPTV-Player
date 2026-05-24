# Design — IPTV Player (TiviMate-inspired)

## Brand Identity

- **Nome:** IPTV Player
- **Paleta principal:** Fundo escuro (#0D0D0D), Azul elétrico (#1A73E8), Cinza escuro (#1C1C1E), Branco (#FFFFFF), Cinza claro (#9E9E9E)
- **Estilo:** Dark-first, minimalista, inspirado em apps de streaming premium (TiviMate, Plex, Netflix)
- **Tipografia:** System font (SF Pro no iOS, Roboto no Android)

---

## Screen List

| # | Tela | Descrição |
|---|------|-----------|
| 1 | **Splash / Onboarding** | Tela inicial com logo, animação de entrada |
| 2 | **Home (Dashboard)** | Canais recentes, favoritos, categorias em destaque |
| 3 | **Canais (Channel List)** | Lista de todos os canais com busca e filtro por grupo |
| 4 | **Player** | Player de vídeo fullscreen com controles, info do canal |
| 5 | **Favoritos** | Canais marcados como favorito |
| 6 | **Configurações** | Gerenciar listas M3U, tema, EPG URL |
| 7 | **Adicionar Playlist** | Modal/tela para adicionar URL M3U ou arquivo local |
| 8 | **EPG / Guia** | Guia de programação eletrônica por canal e horário |

---

## Primary Content & Functionality

### 1. Home (Dashboard)
- Header com logo e botão de busca global
- Seção "Assistindo Agora" — último canal assistido
- Seção "Favoritos" — scroll horizontal com cards de canais
- Seção "Categorias" — chips horizontais (Esportes, Filmes, Notícias, etc.)
- Seção "Todos os Canais" — grid 2 colunas com logo + nome

### 2. Canais (Channel List)
- Barra de busca no topo
- Filtro por grupo/categoria (chips horizontais)
- FlatList com item: logo do canal, nome, grupo, botão favorito
- Tap no canal → abre Player

### 3. Player
- Video fullscreen com expo-video
- Overlay com controles (play/pause, volume, fullscreen, back)
- Info bar inferior: nome do canal, programa atual (EPG)
- Botão de favorito no overlay
- Suporte a orientação landscape automática

### 4. Favoritos
- Grid ou lista de canais favoritados
- Mesmo layout de Canais, mas filtrado
- Estado vazio com CTA para adicionar

### 5. Configurações
- Seção "Playlists": lista de M3U adicionadas, botão adicionar/remover
- Seção "EPG": URL do guia eletrônico
- Seção "Aparência": tema claro/escuro
- Seção "Sobre": versão do app

### 6. Adicionar Playlist
- Input de URL M3U (texto)
- Botão de carregar arquivo local (document picker)
- Nome personalizado para a playlist
- Botão "Adicionar" com loading state

### 7. EPG / Guia
- Timeline horizontal por hora
- Lista vertical de canais
- Programa atual destacado em azul
- Tap no programa → detalhes

---

## Key User Flows

### Fluxo 1: Adicionar lista M3U e assistir canal
1. Usuário abre app → tela Home vazia
2. Tap em "Adicionar Playlist" → tela de configuração
3. Cola URL M3U → tap "Carregar"
4. App faz parse da lista → canais aparecem no Home
5. Tap em canal → Player abre em fullscreen
6. Usuário assiste ao canal

### Fluxo 2: Favoritar canal
1. Na lista de canais, tap no ícone de coração
2. Canal adicionado aos favoritos
3. Aba "Favoritos" mostra o canal

### Fluxo 3: Buscar canal
1. Tap na lupa no header
2. Digita nome do canal
3. Lista filtra em tempo real
4. Tap no resultado → Player

---

## Color Choices

```js
// theme.config.js — dark-first IPTV theme
primary:    { light: '#1A73E8', dark: '#4A9EFF' }  // Azul elétrico
background: { light: '#F5F5F5', dark: '#0D0D0D' }  // Quase preto
surface:    { light: '#FFFFFF', dark: '#1C1C1E' }  // Card escuro
foreground: { light: '#111111', dark: '#FFFFFF' }  // Texto principal
muted:      { light: '#6B7280', dark: '#9E9E9E' }  // Texto secundário
border:     { light: '#E5E7EB', dark: '#2C2C2E' }  // Bordas sutis
success:    { light: '#22C55E', dark: '#4ADE80' }  // Verde
warning:    { light: '#F59E0B', dark: '#FBBF24' }  // Amarelo
error:      { light: '#EF4444', dark: '#F87171' }  // Vermelho
```

---

## Layout Principles

- **Dark mode por padrão** — app de IPTV é usado em ambientes escuros (TV, quarto)
- **Toque único** — canal deve ser acessível em no máximo 2 toques
- **Logos dos canais** — exibir logo quando disponível, fallback com inicial do nome
- **Player imersivo** — controles desaparecem após 3s, tap para reexibir
- **Landscape automático** — player rotaciona para landscape ao abrir
