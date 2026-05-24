# 🚀 Guia de Início Rápido — IPTV Player

Bem-vindo ao IPTV Player! Este guia vai te ajudar a começar em 5 minutos.

## ⚡ Início Rápido (5 minutos)

### 1. Clonar o Repositório
```bash
git clone https://github.com/ChristopherTelles/IPTV-Player.git
cd IPTV-Player
```

### 2. Instalar Dependências
```bash
pnpm install
```

### 3. Iniciar o Servidor
```bash
pnpm dev
```

Você verá um QR Code no terminal.

### 4. Abrir no Dispositivo
- **iOS/Android**: Abra o app **Expo Go** e escaneie o QR Code
- **Web**: Acesse `http://localhost:8081` no navegador

## 📱 Primeiro Uso

### Adicionar uma Playlist
1. Abra o app
2. Vá para a aba **Config** (⚙️)
3. Clique em **Adicionar Playlist**
4. Cole uma URL M3U válida:
   ```
   https://example.com/playlist.m3u
   ```
5. Clique em **Carregar**

### Playlists de Teste
Se quiser testar sem ter uma playlist própria, você pode criar um arquivo `test.m3u`:

```m3u
#EXTM3U
#EXTINF:-1 tvg-id="globo" tvg-name="Globo" tvg-logo="https://example.com/globo.png" group-title="Abertos",Globo
http://example.com/globo.m3u8
#EXTINF:-1 tvg-id="sbt" tvg-name="SBT" group-title="Abertos",SBT
http://example.com/sbt.m3u8
```

### Assistir um Canal
1. Vá para a aba **Canais** (📺)
2. Clique em um canal para abrir o player
3. Toque na tela para mostrar/ocultar controles
4. Use os botões para controlar a reprodução

## 🎯 Funcionalidades Principais

### 🔍 Busca
- Acesse a aba **Canais**
- Use a barra de busca para filtrar por nome
- Use o dropdown para filtrar por categoria

### ❤️ Favoritos
- Clique no ícone ❤️ em qualquer canal para favoritá-lo
- Acesse a aba **Favoritos** para ver todos os favoritados
- Favoritos são salvos automaticamente

### 🏠 Home
- Veja os canais recentes
- Acesse favoritos rapidamente
- Navegue por categorias

### ⚙️ Configurações
- Adicione múltiplas playlists
- Atualize playlists existentes
- Remova playlists que não usa mais

## 🎮 Controles do Player

| Ação | Como Fazer |
|------|-----------|
| Play/Pause | Clique no botão ▶️ |
| Mute | Clique no ícone 🔊 |
| Favoritar | Clique no ❤️ |
| Voltar | Clique em ◀️ |
| Mostrar/Ocultar Controles | Toque na tela |

## 🛠️ Desenvolvimento

### Estrutura do Projeto
```
iptv-player/
├── app/              # Telas e rotas
├── components/       # Componentes reutilizáveis
├── context/          # Estado global
├── lib/              # Utilitários
├── types/            # Tipos TypeScript
├── tests/            # Testes unitários
└── assets/           # Imagens e ícones
```

### Comandos Úteis
```bash
# Executar testes
pnpm test

# Verificar tipos TypeScript
pnpm check

# Formatar código
pnpm format

# Lint
pnpm lint

# Build para produção
pnpm build
```

### Adicionar uma Nova Tela
1. Crie um arquivo em `app/minha-tela.tsx`
2. Exporte um componente padrão
3. Use `ScreenContainer` para SafeArea

```typescript
import { ScreenContainer } from "@/components/screen-container";
import { Text } from "react-native";

export default function MinhaTelaScreen() {
  return (
    <ScreenContainer className="p-4">
      <Text className="text-2xl font-bold text-foreground">
        Minha Tela
      </Text>
    </ScreenContainer>
  );
}
```

### Usar o Contexto IPTV
```typescript
import { useIPTV } from "@/context/IPTVContext";

export default function MeuComponente() {
  const { channels, favorites, toggleFavorite } = useIPTV();

  return (
    // Seu componente aqui
  );
}
```

## 🐛 Troubleshooting

### App não abre
**Solução**: Limpe o cache do Metro:
```bash
pnpm dev -- --clear
```

### Playlist não carrega
**Verificar**:
1. URL é acessível? Teste no navegador
2. Arquivo começa com `#EXTM3U`?
3. Conexão de internet está ativa?

### Player não reproduz
**Verificar**:
1. URL do stream é válida?
2. Formato é HLS/DASH/HTTP?
3. Firewall bloqueia a porta?

## 📚 Próximos Passos

1. **Ler a Documentação Completa**: Veja [README.md](README.md)
2. **Entender a Arquitetura**: Leia [ARCHITECTURE.md](ARCHITECTURE.md)
3. **Contribuir**: Veja [CONTRIBUTING.md](CONTRIBUTING.md)
4. **Explorar o Código**: Comece por `app/(tabs)/index.tsx`

## 🤝 Precisa de Ajuda?

- 📖 Leia a [Wiki](https://github.com/ChristopherTelles/IPTV-Player/wiki)
- 🐛 Abra uma [Issue](https://github.com/ChristopherTelles/IPTV-Player/issues)
- 💬 Participe das [Discussions](https://github.com/ChristopherTelles/IPTV-Player/discussions)

## 🎉 Pronto!

Agora você está pronto para usar e desenvolver o IPTV Player. Divirta-se! 🚀

---

**Última atualização:** Maio 2026
