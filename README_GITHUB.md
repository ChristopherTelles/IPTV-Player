# IPTV Player — Aplicativo Mobile de Streaming de TV ao Vivo

[![React Native](https://img.shields.io/badge/React%20Native-0.81-61dafb?logo=react)](https://reactnative.dev)
[![Expo](https://img.shields.io/badge/Expo-54-000020?logo=expo)](https://expo.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178c6?logo=typescript)](https://www.typescriptlang.org)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

Um aplicativo mobile moderno e profissional para reprodução de canais IPTV ao vivo, inspirado no **TiviMate**. Desenvolvido com React Native, Expo e TypeScript, oferece suporte completo a playlists M3U, busca em tempo real, favoritos e player de vídeo fullscreen com controles avançados.

## 🎯 Características Principais

### 📺 Reprodução de Canais
- **Player de Vídeo Fullscreen** com expo-video (suporte a HLS, DASH e streams HTTP)
- **Controles Overlay Auto-hide** — Barra de controle desaparece após 4 segundos de inatividade
- **Indicador AO VIVO** com animação de pulsação
- **Mute/Unmute** com feedback visual
- **Favoritar Canais** com persistência local
- **Tela Sempre Ligada** durante reprodução (expo-keep-awake)

### 🔍 Gerenciamento de Canais
- **Busca em Tempo Real** — Filtro instantâneo por nome de canal
- **Filtro por Categoria** — Organize canais por grupo (Abertos, Esportes, Filmes, etc.)
- **Visualização em Lista ou Grade** — Alterne entre layouts
- **Logos de Canais** com fallback automático para iniciais
- **Informações Detalhadas** — Nome, grupo, URL e ID do canal

### 🎬 Gerenciamento de Playlists
- **Adicionar Playlist por URL** — Carregue listas M3U diretamente de um servidor
- **Parser M3U Completo** — Extrai nome, URL, logo, grupo e tvg-id
- **Editar/Remover Playlists** — Gerencie múltiplas fontes de canais
- **Validação de URL** — Verifica conectividade antes de adicionar

### 💾 Persistência de Dados
- **AsyncStorage Local** — Todos os dados salvos no dispositivo
- **Sincronização Automática** — Favoritos e playlists sincronizam entre sessões
- **Histórico de Canais** — Último canal assistido é lembrado

### 🎨 Interface Moderna
- **Tema Dark-First** — Otimizado para conforto visual em ambientes com pouca luz
- **Design Responsivo** — Funciona perfeitamente em todos os tamanhos de tela
- **Animações Suaves** — Transições fluidas entre telas
- **Haptic Feedback** — Feedback tátil em ações principais

## 🚀 Tecnologias Utilizadas

| Tecnologia | Versão | Propósito |
|-----------|--------|----------|
| **React Native** | 0.81 | Framework mobile cross-platform |
| **Expo** | 54 | Plataforma de desenvolvimento e deployment |
| **TypeScript** | 5.9 | Type safety e melhor DX |
| **React Router** | 6 | Navegação e roteamento |
| **NativeWind** | 4 | Tailwind CSS para React Native |
| **expo-video** | 3.0 | Reprodução de vídeo nativa |
| **expo-keep-awake** | 15 | Manter tela ligada |
| **expo-haptics** | 15 | Feedback tátil |
| **AsyncStorage** | 2.2 | Persistência local |
| **Vitest** | 2.1 | Testes unitários |

## 📋 Requisitos

- **Node.js** 18+ ou **pnpm** 9.12+
- **Expo Go** instalado no dispositivo (iOS/Android)
- **Git** para controle de versão

## 🔧 Instalação e Configuração

### 1. Clonar o Repositório
```bash
git clone https://github.com/seu-usuario/iptv-player.git
cd iptv-player
```

### 2. Instalar Dependências
```bash
pnpm install
```

### 3. Iniciar o Servidor de Desenvolvimento
```bash
pnpm dev
```

O servidor iniciará em `http://localhost:8081` e exibirá um QR Code.

### 4. Abrir no Dispositivo
- **iOS/Android**: Abra o app **Expo Go** e escaneie o QR Code
- **Web**: Acesse `http://localhost:8081` no navegador

## 📱 Uso do Aplicativo

### Adicionar uma Playlist
1. Acesse a aba **Config** (⚙️)
2. Clique em **Adicionar Playlist**
3. Cole a URL de uma lista M3U (ex: `http://exemplo.com/playlist.m3u`)
4. Clique em **Carregar**

### Buscar Canais
1. Acesse a aba **Canais** (📺)
2. Use a barra de busca para filtrar por nome
3. Use o dropdown para filtrar por categoria

### Assistir um Canal
1. Clique em um canal na lista
2. O player abrirá em fullscreen
3. Toque na tela para exibir/ocultar controles
4. Use os botões para play/pause, mute e favoritar

### Gerenciar Favoritos
1. Acesse a aba **Favoritos** (❤️)
2. Veja todos os canais favoritados
3. Clique para assistir ou remover dos favoritos

## 🏗️ Estrutura do Projeto

```
iptv-tivimate/
├── app/                          # Rotas e telas do app
│   ├── (tabs)/                   # Navegação por abas
│   │   ├── index.tsx             # Home screen
│   │   ├── channels.tsx          # Lista de canais
│   │   ├── favorites.tsx         # Canais favoritos
│   │   └── settings.tsx          # Configurações
│   ├── player.tsx                # Tela do player fullscreen
│   ├── search.tsx                # Busca global de canais
│   └── _layout.tsx               # Root layout com providers
├── components/                   # Componentes reutilizáveis
│   ├── ChannelCard.tsx           # Card de canal
│   ├── EmptyState.tsx            # Estado vazio
│   ├── screen-container.tsx      # Container com SafeArea
│   └── ui/                       # Componentes UI base
├── context/                      # Context API e providers
│   └── IPTVContext.tsx           # Estado global IPTV
├── lib/                          # Utilitários e helpers
│   ├── m3u-parser.ts            # Parser de playlists M3U
│   ├── theme-provider.tsx        # Provedor de tema
│   └── utils.ts                  # Funções auxiliares
├── types/                        # Definições TypeScript
│   └── iptv.ts                   # Tipos do domínio IPTV
├── hooks/                        # Custom React hooks
│   ├── use-colors.ts             # Hook de cores do tema
│   └── use-color-scheme.ts       # Hook de esquema de cor
├── tests/                        # Testes unitários
│   └── m3u-parser.test.ts        # Testes do parser M3U
├── assets/                       # Imagens e ícones
│   └── images/
│       ├── icon.png              # Ícone do app
│       ├── splash-icon.png       # Ícone de splash
│       └── favicon.png           # Favicon web
├── theme.config.js               # Configuração de cores
├── app.config.ts                 # Configuração do Expo
├── tailwind.config.js            # Configuração Tailwind
└── package.json                  # Dependências do projeto
```

## 💻 Desenvolvimento

### Executar Testes
```bash
pnpm test
```

Testes unitários cobrem:
- Parser M3U (17 testes)
- Extração de metadados
- Filtro e busca de canais
- Validação de grupos

### Verificar Tipos TypeScript
```bash
pnpm check
```

### Formatar Código
```bash
pnpm format
```

### Lint
```bash
pnpm lint
```

## 📝 Comentários no Código

O projeto inclui comentários detalhados em todos os arquivos principais:

### Contexto Global (`context/IPTVContext.tsx`)
```typescript
/**
 * Contexto global para gerenciamento de estado IPTV.
 * Responsável por:
 * - Carregar e persistir playlists
 * - Gerenciar favoritos
 * - Rastrear último canal assistido
 * - Fornecer métodos para busca e filtro
 */
```

### Parser M3U (`lib/m3u-parser.ts`)
```typescript
/**
 * Faz parsing de arquivo M3U e extrai informações de canais.
 * Suporta:
 * - Formato EXTM3U padrão
 * - Atributos: tvg-id, tvg-name, tvg-logo, group-title
 * - URLs HTTP/HTTPS
 */
```

### Player (`app/player.tsx`)
```typescript
/**
 * Tela do player de vídeo fullscreen com controles overlay.
 * Features:
 * - Auto-hide de controles após 4 segundos
 * - Indicador AO VIVO
 * - Botões: play/pause, mute, favoritar
 * - Tela sempre ligada durante reprodução
 */
```

## 🎨 Paleta de Cores

| Cor | Light | Dark | Uso |
|-----|-------|------|-----|
| **Primary** | #0a7ea4 | #0a7ea4 | Botões, links, destaques |
| **Background** | #ffffff | #151718 | Fundo das telas |
| **Surface** | #f5f5f5 | #1e2022 | Cards, superfícies |
| **Foreground** | #11181C | #ECEDEE | Texto principal |
| **Muted** | #687076 | #9BA1A6 | Texto secundário |
| **Border** | #E5E7EB | #334155 | Bordas e divisores |

## 🔐 Segurança

- ✅ Todas as URLs são validadas antes de carregar
- ✅ Sem armazenamento de senhas ou dados sensíveis
- ✅ Conexões HTTPS recomendadas para playlists
- ✅ AsyncStorage local — dados nunca são enviados para servidor

## 📊 Performance

- **Lazy Loading** de canais em listas grandes
- **Memoização** de componentes para evitar re-renders desnecessários
- **Cache de Imagens** com expo-image
- **Parser M3U Otimizado** com regex compilado

## 🐛 Troubleshooting

### App fecha ao abrir
**Solução**: Limpe o cache do Metro Bundler:
```bash
pnpm dev -- --clear
```

### Playlist não carrega
**Verificar**:
1. URL é acessível? Teste no navegador
2. Formato é M3U válido? Verifique com `#EXTM3U` no início
3. Conexão de internet está ativa?

### Player não reproduz
**Verificar**:
1. URL do stream é válida?
2. Formato é HLS/DASH/HTTP?
3. Firewall bloqueia a porta?

## 📄 Licença

Este projeto está licenciado sob a **MIT License** — veja o arquivo [LICENSE](LICENSE) para detalhes.

## 🤝 Contribuindo

Contribuições são bem-vindas! Para contribuir:

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📞 Suporte

Para reportar bugs ou sugerir features, abra uma [Issue](https://github.com/seu-usuario/iptv-player/issues).

## 🙏 Agradecimentos

- [Expo](https://expo.dev) — Plataforma de desenvolvimento
- [React Native](https://reactnative.dev) — Framework mobile
- [NativeWind](https://www.nativewind.dev) — Tailwind CSS para React Native
- Comunidade open-source

---

**Desenvolvido com ❤️ usando React Native e Expo**

Última atualização: Maio 2026
