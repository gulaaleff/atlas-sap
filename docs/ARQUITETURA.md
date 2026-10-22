# Arquitetura do Atlas SAP

Site estático, sem build e sem dependências. Roda direto no GitHub Pages.

## Estrutura de pastas

```
atlas-sap/
├── index.html              página única; carrega os scripts na ordem abaixo
├── atlas-sap-logo.svg      logo (também usado como ícone da aba)
├── .nojekyll               evita processamento do GitHub Pages
├── assets/
│   ├── style.css           tema claro e escuro, layout
│   ├── i18n.js             textos de interface (PT, EN, ES), novidades (CHANGES) e logo
│   └── app.js              estado, navegação e telas
├── content/
│   ├── _init.js            cria os registros MOD e CORE
│   ├── catalog.js          módulos abertos e bloqueados, outras soluções, trilhas
│   ├── glossary.js         glossário trilíngue
│   ├── sources.js          fontes oficiais por módulo
│   ├── core.<idioma>.js    mapa de integração global
│   └── <módulo>.<idioma>.js  conteúdo de cada módulo (sd, mm, fi, co)
├── docs/                   documentação do projeto
├── CHANGELOG.md
└── README.md
```

## Molde de um módulo

Cada arquivo `content/<módulo>.<idioma>.js` preenche `MOD.<módulo>.<idioma>` com:

| Campo | Conteúdo |
| --- | --- |
| `name`, `short`, `lead` | Título, nome curto e resumo |
| `CHAPTERS` | 8 capítulos: `id`, `t`, `guide` (pergunta-guia), `body` (HTML), `arch`, `acts` (2 questões), `reflect`, e opcionalmente `widget:'flow'`, `flowKey`, `order:true` |
| `FLOWS` | Cenários de fluxo com passos (`ctrl`, `integ`, `effect`, `arch`) |
| `ORDER` | Sequência correta para o jogo de montar o fluxo |
| `THEMES` | 6 temas com 4 perguntas cada (`q`, `o`, `a` = índice da correta, `w` = explicação) |
| `INTEG` | 8 integrações do módulo (`dir`, `step`, `what`, `varies`) |
| `CARDS` | Cartões de revisão com `id` único no site |
| `CHALLENGE` | Desafio de arquiteto com 4 opções pontuadas de 0 a 3 |
| `TERMS` | Termos do glossário por capítulo |

Os três idiomas precisam ter a mesma estrutura: mesmos `id`, mesma quantidade de itens e mesmos índices de resposta.

## Como abrir um módulo novo (ex.: PP)

1. Criar `content/pp.pt.js`, `pp.en.js` e `pp.es.js` no molde acima.
2. Incluir os três arquivos no `index.html`, antes de `assets/i18n.js`.
3. Em `content/catalog.js`, mudar o PP para `open:true` e incluir `'pp'` em `OPEN_MODS`.
4. Incluir as fontes em `content/sources.js` e os termos novos em `content/glossary.js`.
5. Registrar a versão MINOR conforme `docs/VERSIONAMENTO.md`.

## Progresso

Fica no `localStorage` do navegador, chave `atlas-sap-v1`. Chaves de capítulo e quiz levam o prefixo do módulo (`mm:anatomia`). Não há servidor nem login.
