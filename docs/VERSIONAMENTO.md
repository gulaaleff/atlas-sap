# Diretrizes de versionamento do Atlas SAP

O Atlas SAP usa o formato **MAJOR.MINOR.PATCH** do [Versionamento Semântico 2.0.0](https://semver.org/lang/pt-BR/) e registra as mudanças no padrão [Keep a Changelog 1.1.0](https://keepachangelog.com/pt-BR/1.1.0/). A primeira versão publicada é a **1.0.1**.

## 1. O que conta como "API pública" do site

O Versionamento Semântico pede que o projeto declare sua API pública: é ela que define se uma mudança é compatível ou não. No Atlas SAP, a API pública é:

| Item | Por que importa |
| --- | --- |
| Endereços das páginas (`#painel`, `#modulos`, `#sd`, `#mm`, `#fi`, `#co`, `#revisao`...) | Favoritos e links salvos dependem deles |
| Formato do progresso salvo no navegador (chave `atlas-sap-v1`) | Mudança incompatível apaga XP, capítulos e cartões |
| Estrutura dos arquivos de conteúdo (`content/<módulo>.<idioma>.js`) | Novos módulos seguem o mesmo molde |
| Idiomas oferecidos (PT, EN, ES) | Remover um idioma quebra quem estuda nele |

## 2. Qual número muda

Regra geral: quando um número sobe, os números à direita voltam a zero (1.2.3 → 1.3.0 → 2.0.0).

| Muda | Quando | Exemplos no Atlas SAP |
| --- | --- | --- |
| **MAJOR** (2.0.0) | Mudança incompatível com a API pública | Novo formato de progresso que exige zerar o salvo; remoção de um módulo, página ou idioma; troca dos endereços das páginas |
| **MINOR** (1.1.0) | Funcionalidade nova, compatível | Novo módulo aberto (PP, QM...); nova trilha ou seção; novo tipo de atividade; novo idioma; recurso marcado como obsoleto |
| **PATCH** (1.0.2) | Correção compatível | Erro de conteúdo, termo ou tradução; texto melhorado; bug visual ou de navegação; ajuste de cor, espaçamento ou acessibilidade |

## 3. Quantidade de ajustes por versão

Uma versão pode juntar vários ajustes. Vale o maior nível entre eles.

- Só correções, em qualquer quantidade: **PATCH**.
- Pelo menos uma funcionalidade nova: **MINOR**, mesmo que venha junto com correções.
- Pelo menos uma mudança incompatível: **MAJOR**.

Recomendação de tamanho, para facilitar a revisão:

| Tipo | Tamanho recomendado | Observação |
| --- | --- | --- |
| PATCH | até 10 correções | Pode sair a qualquer momento |
| MINOR | 1 módulo novo ou até 3 recursos novos | Evita versões grandes demais para revisar |
| MAJOR | só quando inevitável | Exige plano de migração do progresso salvo |

## 4. Complexidade e cuidados

| Complexidade | Exemplos | O que fazer antes de publicar |
| --- | --- | --- |
| Baixa | Corrigir texto, termo ou tradução | Conferir os três idiomas |
| Média | Novo capítulo, novo tema de quiz, novo fluxo | Validar estrutura igual nos três idiomas; testar no celular |
| Alta | Novo módulo, nova página, mudança no progresso salvo | Validação automática da estrutura, teste completo de navegação, plano de migração se o progresso mudar |

## 5. Versões de pré-lançamento

Para testar algo antes de publicar, use sufixo de pré-lançamento: `1.1.0-beta.1`, `1.1.0-rc.1`. Pré-lançamentos têm precedência menor que a versão final (`1.1.0-beta.1` < `1.1.0`) e não aparecem na página Novidades.

## 6. Como registrar a mudança

1. Durante o trabalho, anote tudo na seção **Não publicado** do `CHANGELOG.md`.
2. Agrupe por tipo: **Adicionado**, **Alterado**, **Obsoleto**, **Removido**, **Corrigido**, **Segurança**.
3. Ao publicar, troque "Não publicado" pelo número e pela data no formato AAAA-MM-DD.
4. Copie os itens para o topo de `CHANGES` em `assets/i18n.js`, nos três idiomas. É isso que gera o aviso de novidade no site.
5. Escreva para quem estuda: o que mudou para você, não o que mudou no código.

## 7. Checklist de publicação

- [ ] Número da versão decidido pela tabela da seção 2
- [ ] `CHANGELOG.md` atualizado
- [ ] `CHANGES` atualizado nos três idiomas
- [ ] Estrutura do conteúdo validada (mesmos capítulos, perguntas e respostas nos três idiomas)
- [ ] Navegação testada no computador e no celular, tema claro e escuro
- [ ] Progresso salvo continua funcionando (ou migração testada, se MAJOR)

---

Fontes: [Semantic Versioning 2.0.0](https://semver.org/) · [Keep a Changelog 1.1.0](https://keepachangelog.com/en/1.1.0/)
