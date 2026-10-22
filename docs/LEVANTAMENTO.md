# Levantamento do projeto Atlas SAP

## Objetivo

Um site pessoal para estudar SAP pelo processo de negócio, no nível de key-user com olhar de arquiteto: o que cada módulo resolve, como funciona por dentro (documentos, controles, parâmetros), onde integra com outras soluções e onde o padrão tem limites. Configuração passo a passo fica fora.

## Premissas

- S/4HANA como base, com diferenças para ECC em cada módulo.
- Processos end-to-end como eixo; módulos como peças desses processos.
- Fontes oficiais: SAP Learning, SAP Training, SAP Help Portal, SAP Signavio Process Navigator, órgãos públicos para o fiscal brasileiro.
- Três idiomas (PT, EN, ES) para estudar com a terminologia correta de cada um.
- Uso pessoal, publicado no GitHub Pages da conta pessoal.

## Estrutura de conteúdo

| # | Trilha | Situação na 1.0.1 |
| --- | --- | --- |
| 0 | Fundamentos | Prevista |
| 1 | Processos end-to-end | Prevista |
| 2 | Módulos | SD, MM, FI e CO abertos; PP, QM, PM e PS em breve |
| 3 | Localização Brasil | Prevista (tratada dentro dos módulos por enquanto) |
| 4 | Tecnologia para arquiteto | Prevista |
| 5 | Visão de arquiteto | Prevista |

## Método de estudo

Baseado nas técnicas de maior evidência na pesquisa em aprendizagem ([Dunlosky et al., 2013](https://journals.sagepub.com/doi/10.1177/1529100612453266); [The Learning Scientists](https://www.learningscientists.org/downloadable-materials)):

- Prática de teste: atividades, quiz por tema, cartões.
- Prática distribuída: cartões em caixas com intervalos de 1 a 14 dias.
- Intercalação: revisão misturada entre módulos.
- Interrogação elaborativa e autoexplicação: pergunta-guia, resposta com suas palavras, desafio de arquiteto.
- Exemplos concretos e codificação dupla: fluxos clicáveis e mapas de integração.

## Decisões

| Data | Decisão |
| --- | --- |
| 2026-10-21 | Profundidade: funcionamento de cada módulo sem configuração (documentos, controles, integrações, variações por segmento) |
| 2026-10-21 | Sem Notion; o site é a única ferramenta |
| 2026-10-21 | Hospedagem no GitHub pessoal; repositório público (GitHub Free) com `noindex` |
| 2026-10-21 | Módulo em três modos: Estudo, Revisão e Integrações |
| 2026-10-21 | Idiomas PT, EN e ES em todo o conteúdo |
| 2026-10-21 | Toda melhoria entra na página Novidades e no CHANGELOG |
| 2026-10-21 | Site começa na versão 1.0.1, com SD, MM, FI e CO; demais módulos bloqueados |
| 2026-10-21 | Versionamento segue SemVer 2.0.0 e Keep a Changelog 1.1.0 |

## Próximos passos sugeridos

- PP, QM, PM e PS no mesmo molde (versões MINOR).
- Trilha 1, processos end-to-end, ligando os módulos já abertos.
- Validação dos termos em espanhol e inglês pela transação SAPTERM.
