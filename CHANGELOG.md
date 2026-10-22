# Changelog

Todas as mudanças relevantes do Atlas SAP ficam neste arquivo.

O formato segue o [Keep a Changelog 1.1.0](https://keepachangelog.com/pt-BR/1.1.0/) e o projeto usa [Versionamento Semântico 2.0.0](https://semver.org/lang/pt-BR/). Regras do projeto em [docs/VERSIONAMENTO.md](docs/VERSIONAMENTO.md).

## [Não publicado]

## [1.0.1] - 2026-10-21

Primeira versão publicada do site.

### Adicionado
- Módulos MM, FI e CO completos, cada um com 8 capítulos, atividades, quiz em 6 temas, integrações, fluxos clicáveis, cartões de revisão e desafio de arquiteto, em português, inglês e espanhol.
- Aba única **Módulos** com seletor e troca rápida entre módulos.
- PP, QM, PM e PS exibidos como bloqueados (em breve).
- Seção **Outras soluções SAP** com EWM, TM, SuccessFactors, Ariba, Concur, Fieldglass, IBP, SAP Analytics Cloud, BTP, Signavio, Datasphere e DRC, bloqueadas.
- Glossário com 102 termos e filtro por módulo.
- Fontes oficiais por módulo no fim de cada capítulo.
- Número da versão no rodapé.
- Diretrizes de versionamento (`docs/VERSIONAMENTO.md`).

### Alterado
- Cartões de revisão e desafios passam a cobrir todos os módulos abertos.
- Painel mostra o progresso de cada módulo e sugere o próximo capítulo do módulo atual.
- Opções das perguntas aparecem em ordem embaralhada fixa.
- Código separado em arquivos: conteúdo em `content/`, interface em `assets/`.

### Corrigido
- Progresso salvo no protótipo (só SD) é migrado automaticamente para o novo formato.

## Histórico do protótipo

- **0.3** (2026-10-21): idiomas PT, EN e ES, glossário trilíngue, logo, créditos e página de Novidades.
- **0.2** (2026-10-21): módulo SD em três modos (Estudo, Revisão, Integrações).
- **0.1** (2026-10-21): primeiro protótipo com painel, trilhas, mapa, módulo SD, cartões e desafio.

[Não publicado]: https://github.com/
[1.0.1]: https://github.com/
