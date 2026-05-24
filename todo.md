# IPTV Player — TODO

## Setup & Configuração
- [x] Atualizar tema (cores dark-first para IPTV)
- [x] Gerar e configurar logo do app
- [x] Configurar estrutura de tabs (Home, Canais, Favoritos, Config)
- [x] Mapear ícones no icon-symbol.tsx

## Dados & Estado
- [x] Criar tipos TypeScript (Channel, Playlist, EPGProgram, etc.)
- [x] Criar contexto global (IPTVContext) com AsyncStorage
- [x] Implementar parser M3U (URL e texto)
- [ ] Implementar parser EPG (XMLTV)
- [x] Persistência de favoritos
- [x] Persistência de playlists
- [x] Persistência do último canal assistido

## Telas
- [x] Home screen com seções (recentes, favoritos, categorias)
- [x] Tela de Canais com busca e filtro por grupo
- [x] Player de vídeo com expo-video
- [x] Controles do player (overlay com auto-hide)
- [x] Tela de Favoritos
- [x] Tela de Configurações
- [x] Modal/tela Adicionar Playlist
- [ ] Tela EPG / Guia de Programação

## Funcionalidades
- [x] Busca de canais em tempo real
- [x] Filtro por categoria/grupo
- [x] Favoritar/desfavoritar canal
- [x] Carregar playlist por URL
- [ ] Carregar playlist por arquivo local
- [x] Exibir logo do canal (com fallback)
- [ ] Informação do programa atual (EPG) no player
- [ ] Rotação automática para landscape no player
- [x] Manter tela ligada durante reprodução

## Polimento
- [ ] Animações de transição suaves
- [x] Estados de loading e erro
- [x] Estado vazio (sem canais/favoritos)
- [x] Haptic feedback em ações principais
