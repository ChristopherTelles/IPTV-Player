# Guia de Contribuição — IPTV Player

Obrigado por considerar contribuir para o IPTV Player! Este documento fornece diretrizes e instruções para contribuir com o projeto.

## 📋 Código de Conduta

Este projeto adota um Código de Conduta para garantir um ambiente acolhedor e inclusivo. Esperamos que todos os contribuidores sigam estes princípios:

- Seja respeitoso com outros contribuidores
- Aceite críticas construtivas
- Foque no que é melhor para a comunidade
- Mostre empatia com outros membros

## 🐛 Reportando Bugs

Antes de criar um relatório de bug, verifique a lista de issues — seu problema pode já ter sido reportado.

### Como Reportar um Bug

1. **Use um título descritivo** para identificar o problema
2. **Descreva os passos exatos** para reproduzir o problema
3. **Forneça exemplos específicos** para demonstrar os passos
4. **Descreva o comportamento observado** e explique qual é o problema
5. **Explique qual era o comportamento esperado** e por quê
6. **Inclua screenshots ou GIFs** se possível
7. **Inclua seu ambiente**: SO, versão do Expo, versão do Node.js

### Exemplo de Bug Report

```markdown
**Descrição do Bug**
O app fecha quando tento adicionar uma playlist com URL inválida.

**Passos para Reproduzir**
1. Abra o app
2. Vá para Configurações
3. Clique em "Adicionar Playlist"
4. Cole uma URL inválida: "http://invalid..url"
5. Clique em "Carregar"

**Comportamento Esperado**
Deve exibir mensagem de erro: "URL inválida"

**Comportamento Observado**
App fecha sem mensagem

**Ambiente**
- SO: Android 13
- Expo Go: v2.26.0
- Node.js: v18.16.0
```

## 💡 Sugerindo Melhorias

Sugestões de features são sempre bem-vindas! Para sugerir uma melhoria:

1. Use um **título descritivo**
2. Forneça uma **descrição detalhada** da melhoria sugerida
3. Liste alguns **exemplos de como a feature seria usada**
4. Explique por que essa melhoria seria útil

### Exemplo de Feature Request

```markdown
**Descrição da Feature**
Adicionar suporte a rotação automática para landscape no player.

**Caso de Uso**
Quando o usuário abre o player, o app deveria detectar a orientação do dispositivo 
e rotacionar automaticamente para landscape para melhor visualização.

**Benefício**
Melhor experiência de visualização, consistente com apps como YouTube e Netflix.
```

## 🔧 Processo de Desenvolvimento

### 1. Setup do Ambiente

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/iptv-player.git
cd iptv-player

# Instale as dependências
pnpm install

# Inicie o servidor de desenvolvimento
pnpm dev
```

### 2. Crie uma Branch

```bash
# Atualize a main
git checkout main
git pull origin main

# Crie uma branch para sua feature
git checkout -b feature/sua-feature-aqui
# ou para bug fix
git checkout -b fix/seu-bug-aqui
```

### 3. Faça suas Mudanças

- Siga o estilo de código existente
- Adicione comentários para lógica complexa
- Escreva testes para novas features
- Mantenha commits atômicos e bem descritos

### 4. Teste suas Mudanças

```bash
# Execute os testes
pnpm test

# Verifique tipos TypeScript
pnpm check

# Execute o linter
pnpm lint

# Formate o código
pnpm format
```

### 5. Commit e Push

```bash
# Commit com mensagem descritiva
git commit -m "feat: adicionar suporte a rotação landscape no player"

# Push para sua branch
git push origin feature/sua-feature-aqui
```

### 6. Abra um Pull Request

1. Vá para o repositório no GitHub
2. Clique em "New Pull Request"
3. Selecione sua branch
4. Preencha o template do PR com:
   - Descrição das mudanças
   - Tipo de mudança (feature/fix/refactor)
   - Testes realizados
   - Screenshots (se aplicável)

## 📝 Padrões de Commit

Use mensagens de commit claras e descritivas:

```
feat: adicionar nova feature
fix: corrigir um bug
refactor: reorganizar código sem mudança de funcionalidade
docs: atualizar documentação
test: adicionar ou atualizar testes
style: mudanças de formatação
chore: tarefas de build, dependências, etc.
```

### Exemplos

```
feat: adicionar parser EPG (XMLTV)
fix: corrigir crash ao adicionar playlist com URL inválida
refactor: simplificar lógica do contexto IPTV
docs: adicionar guia de uso no README
test: aumentar cobertura de testes do parser M3U
```

## 🎯 Diretrizes de Código

### TypeScript

- Use tipos explícitos sempre que possível
- Evite `any` — use `unknown` se necessário
- Mantenha interfaces e tipos bem documentados

```typescript
/**
 * Interface para representar um canal IPTV.
 * @property id - ID único do canal
 * @property name - Nome exibido do canal
 * @property url - URL do stream (HLS/DASH/HTTP)
 * @property group - Categoria do canal
 * @property logo - URL da logo do canal
 */
interface Channel {
  id: string;
  name: string;
  url: string;
  group: string;
  logo?: string;
}
```

### React Components

- Use functional components com hooks
- Memoize componentes que recebem muitas props
- Adicione comentários para lógica complexa

```typescript
/**
 * Componente que exibe um card de canal.
 * Inclui logo, nome, grupo e ações (favoritar, assistir).
 * 
 * @param channel - Dados do canal
 * @param onPress - Callback ao clicar no card
 * @param isFavorited - Se o canal está favoritado
 * @param onFavoritePress - Callback ao clicar em favoritar
 */
export const ChannelCard = memo(function ChannelCard({
  channel,
  onPress,
  isFavorited,
  onFavoritePress,
}: ChannelCardProps) {
  // Implementação...
});
```

### Testes

- Escreva testes para novas features
- Mantenha cobertura acima de 80%
- Use nomes descritivos para testes

```typescript
describe("parseM3U", () => {
  it("should extract channel names correctly", () => {
    const result = parseM3U(SAMPLE_M3U, "playlist1");
    expect(result[0].name).toBe("Globo HD");
  });

  it("should handle empty M3U file", () => {
    const result = parseM3U("", "playlist1");
    expect(result).toHaveLength(0);
  });
});
```

## 📚 Documentação

- Mantenha o README atualizado
- Documente APIs e funções complexas
- Adicione exemplos de uso quando apropriado
- Use JSDoc para comentários de função

```typescript
/**
 * Faz parsing de um arquivo M3U e extrai informações de canais.
 * 
 * @param content - Conteúdo do arquivo M3U
 * @param playlistId - ID único da playlist
 * @returns Array de canais extraídos
 * 
 * @example
 * const channels = parseM3U(m3uContent, "my-playlist");
 * console.log(channels[0].name); // "Globo HD"
 */
export function parseM3U(content: string, playlistId: string): Channel[] {
  // Implementação...
}
```

## 🔄 Processo de Review

Todos os PRs passarão por review antes de serem merged:

1. **Verificação Automática**: Testes, linting e build devem passar
2. **Code Review**: Pelo menos um mantenedor revisará o código
3. **Feedback**: Comentários e sugestões podem ser feitos
4. **Ajustes**: Implemente feedback e faça push dos ajustes
5. **Merge**: Após aprovação, seu PR será merged

## 🚀 Releases

Releases seguem [Semantic Versioning](https://semver.org/):

- **MAJOR**: Mudanças incompatíveis (ex: 1.0.0 → 2.0.0)
- **MINOR**: Novas features compatíveis (ex: 1.0.0 → 1.1.0)
- **PATCH**: Bug fixes (ex: 1.0.0 → 1.0.1)

## 📞 Perguntas?

- Abra uma [Discussion](https://github.com/seu-usuario/iptv-player/discussions)
- Verifique a [Wiki](https://github.com/seu-usuario/iptv-player/wiki)
- Leia o [README](README.md)

---

Obrigado por contribuir! 🎉
