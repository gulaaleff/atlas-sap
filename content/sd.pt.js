(MOD.sd=MOD.sd||{}).pt={
 "name": "SD · Vendas e distribuição",
 "short": "Vendas e distribuição",
 "lead": "Do pedido do cliente à nota fiscal: documentos, controles e onde o SD entrega trabalho para outros módulos.",
 "ORDER": [
  "Ordem de venda",
  "Remessa",
  "Picking",
  "Saída de mercadoria",
  "Fatura",
  "NF-e"
 ],
 "FLOWS": {
  "padrao": {
   "name": "Venda padrão",
   "note": "Mercadoria em estoque, faturamento relacionado à remessa.",
   "steps": [
    {
     "t": "VA01 · tipo OR",
     "b": "Ordem de venda",
     "m": "item TAN · divisão CP",
     "ctrl": "Tipo de ordem define numeração, determinação de preço e qual remessa/fatura segue. A categoria de item (TAN) diz se o item é relevante para remessa e faturamento. A categoria de divisão (CP) liga ao MRP e ao tipo de movimento.",
     "integ": "MM: verificação de disponibilidade (ATP). Crédito: SAP Credit Management. PP: necessidade para o MRP.",
     "effect": "Nenhum lançamento contábil. Gera necessidade e reserva de quantidade (ATP).",
     "arch": "A OV é o documento que carrega a maior parte das decisões: preço, impostos, parceiros, datas. Erro aqui se propaga para todo o fluxo."
    },
    {
     "t": "VL01N · tipo LF",
     "b": "Remessa",
     "m": "controle de cópia OR → LF",
     "ctrl": "O controle de cópia define que OR gera LF e quais dados passam (parceiros, quantidades). A categoria de item da remessa vem da OV.",
     "integ": "EWM ou WM: tarefa de picking e embalagem. Sem gestão de armazém, o picking é confirmado direto na remessa (MM-IM).",
     "effect": "Ainda sem lançamento. O status de picking avança no documento.",
     "arch": "Aqui o processo muda por segmento: um distribuidor com EWM tem ondas e tarefas; uma indústria simples confirma o picking na própria remessa."
    },
    {
     "t": "VL02N · mov. 601",
     "b": "Saída de mercadoria",
     "m": "baixa de estoque",
     "ctrl": "O tipo de movimento 601 vem da categoria de divisão. O estoque é baixado no centro/depósito da remessa.",
     "integ": "MM: documento de material. FI: documento contábil automático.",
     "effect": "D Custo da mercadoria vendida / C Estoque, pelo custo do material.",
     "arch": "É o momento em que a propriedade do estoque sai da empresa. Estornar depois exige cuidado com documentos já gerados."
    },
    {
     "t": "VF01 · tipo F2",
     "b": "Fatura",
     "m": "controle de cópia LF → F2",
     "ctrl": "Faturamento relacionado à remessa: a quantidade faturada vem da quantidade entregue. O preço pode ser recalculado conforme o tipo de cópia.",
     "integ": "FI: documento contábil. CO: margem por cliente/produto. Fiscal: gera a nota fiscal.",
     "effect": "D Cliente / C Receita e C Impostos a recolher (ICMS, PIS, COFINS, IPI conforme o cenário).",
     "arch": "A fatura é a ponte para FI. Regras de conta (determinação de contas de receita) ficam aqui, não no FI."
    },
    {
     "t": "J1BNFE · DRC",
     "b": "NF-e",
     "m": "autorização SEFAZ",
     "ctrl": "A nota fiscal é criada a partir da fatura com o tipo de NF definido para o cenário. Os impostos vêm da determinação feita na OV.",
     "integ": "DRC (ou GRC no legado) transmite o XML e recebe o protocolo de autorização da SEFAZ.",
     "effect": "Sem novo lançamento: a nota referencia o documento contábil da fatura.",
     "arch": "No Brasil a mercadoria só pode sair com NF-e autorizada; por isso saída de mercadoria, fatura e NF-e costumam rodar em sequência imediata. A ordem exata varia por empresa."
    }
   ]
  },
  "servico": {
   "name": "Venda de serviço",
   "note": "Sem remessa: a OV vai direto para a fatura.",
   "steps": [
    {
     "t": "VA01 · tipo OR",
     "b": "Ordem de venda",
     "m": "item de serviço (ex. TAD)",
     "ctrl": "A categoria de item de serviço não é relevante para remessa e é relevante para faturamento com referência à ordem.",
     "integ": "Sem ATP de estoque. Pode ter plano de faturamento (mensal, por marco).",
     "effect": "Nenhum lançamento contábil.",
     "arch": "Quem decide se existe remessa é a categoria de item, não o tipo de ordem. A mesma OV pode ter itens de material e de serviço."
    },
    {
     "t": "VF01 · tipo F2",
     "b": "Fatura",
     "m": "faturamento relacionado à ordem",
     "ctrl": "O controle de cópia OR → F2 usa a quantidade da ordem, não a entregue.",
     "integ": "FI e CO, como na venda padrão.",
     "effect": "D Cliente / C Receita de serviço e impostos (ISS, PIS, COFINS).",
     "arch": "Sem saída de mercadoria, não há custo lançado pelo SD. O custo do serviço vem de outra origem (PS, CO, folha)."
    },
    {
     "t": "NFS-e",
     "b": "Nota de serviço",
     "m": "padrão nacional ou municipal",
     "ctrl": "Nota fiscal de serviço com ISS. O layout depende do município ou do padrão nacional da NFS-e.",
     "integ": "Solução de mensageria (DRC ou parceiro) até a prefeitura ou o ambiente nacional.",
     "effect": "Sem novo lançamento.",
     "arch": "NFS-e é historicamente o ponto mais heterogêneo da localização. Verifique sempre qual solução de transmissão o cliente usa."
    }
   ]
  },
  "devolucao": {
   "name": "Devolução",
   "note": "Cliente devolve mercadoria e recebe crédito.",
   "steps": [
    {
     "t": "VA01 · tipo RE",
     "b": "Ordem de devolução",
     "m": "com referência à fatura",
     "ctrl": "Criada com referência à fatura original, herdando preço e impostos. Costuma nascer com bloqueio de faturamento até a conferência.",
     "integ": "Sem ATP. Pode exigir motivo da ordem (motivo da devolução).",
     "effect": "Nenhum lançamento contábil.",
     "arch": "A referência à fatura é o que garante que o crédito sai com o mesmo preço e imposto da venda."
    },
    {
     "t": "VL01N · tipo LR",
     "b": "Remessa de devolução",
     "m": "mov. 651",
     "ctrl": "A entrada física usa o tipo de movimento 651, que leva o material para estoque bloqueado de devolução.",
     "integ": "MM: entrada de mercadoria. QM pode inspecionar antes de liberar.",
     "effect": "Entrada em estoque bloqueado de devolução, sem valoração neste movimento.",
     "arch": "A decisão de reaproveitar ou sucatear é um passo posterior, com transferência de estoque."
    },
    {
     "t": "VF01 · crédito",
     "b": "Nota de crédito",
     "m": "tipo RE",
     "ctrl": "Faturamento de crédito com referência à ordem de devolução, liberado após remover o bloqueio.",
     "integ": "FI e CO, com sinal invertido.",
     "effect": "D Receita (devolução) e impostos / C Cliente.",
     "arch": "Devolução mal parametrizada é fonte clássica de divergência entre fiscal e contábil."
    },
    {
     "t": "J1BNFE",
     "b": "NF de devolução",
     "m": "nota de entrada",
     "ctrl": "Gera a nota de entrada que acoberta o retorno ou referencia a NF-e emitida pelo cliente, conforme o cenário.",
     "integ": "Fiscal / DRC.",
     "effect": "Sem novo lançamento.",
     "arch": "Quem emite a NF de devolução (cliente contribuinte ou a própria empresa) muda o cenário fiscal. Confirme com o fiscal do cliente."
    }
   ]
  }
 },
 "CHAPTERS": [
  {
   "id": "papel",
   "t": "O papel do SD no negócio",
   "guide": "O que o SD resolve, e o que ele deixa para outros módulos?",
   "body": "<p>O SD transforma uma negociação com o cliente em mercadoria entregue, fatura emitida e receita contabilizada. Ele cobre cotação, ordem de venda, remessa e faturamento.</p>\n  <p>Tão importante quanto saber o que ele faz é saber o que ele <b>não</b> faz. O SD não guarda estoque (MM), não executa o armazém (EWM), não contabiliza por conta própria (FI) e não emite a nota sozinho (localização Brasil). Ele gera documentos, e esses documentos disparam o trabalho dos outros módulos.</p>\n  <p>Processos que o módulo atende:</p>\n  <ul><li>Venda padrão de mercadoria em estoque</li><li>Venda de serviço, sem remessa</li><li>Devolução e notas de crédito e débito</li><li>Consignação no cliente</li><li>Venda por terceiros (triangular)</li><li>Contratos e programas de remessa</li><li>Bonificação</li></ul>",
   "arch": "Em reunião com cliente, comece perguntando quais desses processos ele roda. Cada um traz documentos, controles e integrações diferentes, e é isso que define o tamanho de um projeto de SD.",
   "acts": [
    {
     "q": "Quem baixa o estoque quando uma mercadoria é vendida?",
     "o": [
      "O SD, direto na fatura",
      "O MM, a partir da saída de mercadoria da remessa",
      "O FI, no lançamento da receita",
      "O EWM, sempre"
     ],
     "a": 1,
     "w": "O SD gera a remessa; a saída de mercadoria cria um documento de material no MM. O EWM só participa quando o depósito é gerenciado por ele."
    },
    {
     "q": "Qual destes NÃO é um processo atendido pelo SD?",
     "o": [
      "Consignação no cliente",
      "Venda por terceiros",
      "Apuração da folha de pagamento",
      "Devolução"
     ],
     "a": 2,
     "w": "Folha é HCM. Os outros três são variações de venda tratadas no SD."
    }
   ],
   "reflect": "Explique com suas palavras a diferença entre o SD gerar um documento e o SD contabilizar."
  },
  {
   "id": "estrutura",
   "t": "Estrutura organizacional",
   "guide": "Quem vende, por onde vende e de onde sai a mercadoria?",
   "body": "<p>Toda ordem de venda pertence a uma <b>área de vendas</b>, que combina três objetos:</p>\n  <div class=\"org\"><div><b>Organização de vendas</b><span>Responde legalmente pela venda. Ligada a uma empresa do FI.</span></div><div><b>Canal de distribuição</b><span>Como o produto chega ao cliente: atacado, varejo, e-commerce.</span></div><div><b>Setor de atividade</b><span>Linha de produto. Permite preço e condições diferentes por linha.</span></div><div><b>Centro de expedição</b><span>Onde a remessa é processada. Vem do centro, da condição de expedição e do grupo de carregamento.</span></div></div>\n  <p>O <b>centro</b> (do MM) diz de onde sai a mercadoria. A <b>empresa</b> (do FI) diz em qual balanço a receita entra. A área de vendas liga a venda a esses dois mundos.</p>",
   "arch": "Cada área de vendas nova multiplica cadastro: o cliente precisa de dados de vendas para cada combinação em que compra. Estruturas com muitos canais e setores ficam caras de manter.",
   "acts": [
    {
     "q": "A área de vendas é formada por:",
     "o": [
      "Empresa + centro + depósito",
      "Organização de vendas + canal de distribuição + setor de atividade",
      "Organização de vendas + centro de expedição",
      "Canal + setor + centro"
     ],
     "a": 1,
     "w": "Os três objetos de vendas. Centro e centro de expedição entram na logística, não na área de vendas."
    },
    {
     "q": "O que define em qual balanço a receita da venda entra?",
     "o": [
      "O canal de distribuição",
      "O centro de expedição",
      "A empresa à qual a organização de vendas está ligada",
      "O setor de atividade"
     ],
     "a": 2,
     "w": "A organização de vendas pertence a uma única empresa do FI."
    }
   ],
   "reflect": "Desenhe (no papel) a estrutura de vendas de uma empresa que você conhece: quantas organizações, canais e setores ela teria?"
  },
  {
   "id": "mestres",
   "t": "Dados mestres",
   "guide": "Quais cadastros a ordem de venda consulta para se preencher sozinha?",
   "body": "<p>Uma OV bem configurada quase não pede digitação: ela busca o que precisa nos dados mestres.</p>\n  <div class=\"tbl\"><table><thead><tr><th>Dado mestre</th><th>O que o SD usa</th><th>Quem mais compartilha</th></tr></thead><tbody>\n  <tr><td>Business Partner (cliente)</td><td>Dados por área de vendas: moeda, condição de pagamento, funções de parceiro (emissor, recebedor, pagador, recebedor da fatura)</td><td>FI, Fiscal (CNPJ, IE)</td></tr>\n  <tr><td>Material</td><td>Visões de vendas: unidade de venda, grupo de categorias de item, centro fornecedor</td><td>MM, PP, EWM, CO</td></tr>\n  <tr><td>Registros de condição</td><td>Preço, descontos, frete, impostos</td><td>MM usa a mesma técnica</td></tr>\n  <tr><td>Registro info cliente-material</td><td>Código do material do cliente e textos</td><td>—</td></tr></tbody></table></div>\n  <p>No S/4HANA, cliente e fornecedor são o mesmo objeto, o Business Partner, com funções diferentes.</p>",
   "arch": "Problemas de \"OV errada\" quase sempre são de cadastro. Antes de propor desenvolvimento, verifique se o dado mestre está completo para aquela área de vendas.",
   "acts": [
    {
     "q": "Onde fica a condição de pagamento que a OV usa por padrão?",
     "o": [
      "Nos dados gerais do BP",
      "Nos dados de área de vendas do BP",
      "No mestre de material",
      "No registro info"
     ],
     "a": 1,
     "w": "Dados comerciais variam por área de vendas, por isso ficam nesse nível do BP."
    },
    {
     "q": "Qual campo do material ajuda a determinar a categoria de item?",
     "o": [
      "Grupo de mercadorias",
      "Grupo de categorias de item",
      "Peso bruto",
      "Tipo de avaliação"
     ],
     "a": 1,
     "w": "O grupo de categorias de item (ex. NORM) entra na determinação da categoria de item do documento."
    }
   ],
   "reflect": "Liste três campos do cliente que, se errados, causariam problema na nota fiscal."
  },
  {
   "id": "anatomia",
   "t": "Anatomia dos documentos",
   "guide": "O que decide o comportamento de cada documento e de cada item?",
   "body": "<p>Este é o capítulo central. Quatro controles explicam quase tudo o que o SD faz:</p>\n  <div class=\"tbl\"><table><thead><tr><th>Controle</th><th>Nível</th><th>O que decide</th><th>Exemplo</th></tr></thead><tbody>\n  <tr><td>Tipo de documento</td><td>Cabeçalho</td><td>Numeração, esquema de preço, qual remessa e fatura seguem</td><td class=\"mono\">OR, RE, LF, F2</td></tr>\n  <tr><td>Categoria de item</td><td>Item</td><td>Se o item gera remessa, se gera fatura e com referência a quê</td><td class=\"mono\">TAN, TAD, TAS, TANN</td></tr>\n  <tr><td>Categoria de divisão</td><td>Linha de divisão</td><td>Ligação com MRP e tipo de movimento de estoque</td><td class=\"mono\">CP, CN</td></tr>\n  <tr><td>Controle de cópia</td><td>Entre documentos</td><td>Qual documento gera qual, que dados passam, que verificações rodam</td><td class=\"mono\">OR → LF → F2</td></tr></tbody></table></div>\n  <p>A categoria de item é determinada pela combinação de tipo de documento, grupo de categorias de item do material e, quando houver, utilização e item superior. Por isso a mesma OV pode ter um item que vai para remessa e outro que vai direto para a fatura.</p>\n  <p>Tudo fica registrado no <b>fluxo de documentos</b> (tabela VBFA): de qualquer documento você navega para trás e para frente.</p>\n  <div class=\"tbl\"><table><thead><tr><th>Documento</th><th>Tabelas</th><th>Transação</th></tr></thead><tbody>\n  <tr><td>Ordem de venda</td><td class=\"mono\">VBAK / VBAP / VBEP</td><td class=\"mono\">VA01</td></tr><tr><td>Remessa</td><td class=\"mono\">LIKP / LIPS</td><td class=\"mono\">VL01N</td></tr><tr><td>Fatura</td><td class=\"mono\">VBRK / VBRP</td><td class=\"mono\">VF01</td></tr></tbody></table></div>",
   "arch": "Quando um requisito novo aparece, a primeira pergunta é: ele cabe em um novo tipo de documento ou categoria de item? Se cabe, é configuração. Muita proposta de ABAP nasce de não fazer essa pergunta.",
   "acts": [
    {
     "q": "Quem decide se um item gera remessa?",
     "o": [
      "O tipo de ordem",
      "A categoria de item",
      "O centro",
      "O cliente"
     ],
     "a": 1,
     "w": "A relevância para remessa é uma propriedade da categoria de item."
    },
    {
     "q": "O controle de cópia define:",
     "o": [
      "O preço do material",
      "Quais documentos podem gerar quais e quais dados passam",
      "A numeração da OV",
      "O centro fornecedor"
     ],
     "a": 1,
     "w": "Exemplo: OR pode gerar LF; a cotação QT pode virar OR, mas não uma solicitação de crédito."
    }
   ],
   "reflect": "Explique por que a mesma OV pode ter um item com remessa e outro sem."
  },
  {
   "id": "padrao",
   "t": "Venda padrão, passo a passo",
   "guide": "O que acontece, em cada módulo, do pedido até a NF-e?",
   "widget": "flow",
   "body": "<p>Com os controles do capítulo anterior em mente, siga o fluxo clicando em cada documento. Observe em que momento cada módulo entra e quando aparece o primeiro lançamento contábil.</p>",
   "arch": "O primeiro lançamento contábil só aparece na saída de mercadoria. Até ali, OV e remessa são documentos logísticos. Isso explica por que um estorno de remessa é simples e um estorno após faturamento não.",
   "acts": [
    {
     "q": "Em que momento é lançado o custo da mercadoria vendida?",
     "o": [
      "Na OV",
      "Na remessa",
      "Na saída de mercadoria",
      "Na NF-e"
     ],
     "a": 2,
     "w": "O tipo de movimento 601 baixa o estoque e lança CMV contra estoque."
    },
    {
     "q": "No faturamento relacionado à remessa, de onde vem a quantidade faturada?",
     "o": [
      "Da OV",
      "Da quantidade entregue na remessa",
      "Do pedido do cliente",
      "Do registro de condição"
     ],
     "a": 1,
     "w": "Por isso entregas parciais geram faturas parciais."
    }
   ],
   "reflect": "Conte a jornada de uma venda como se explicasse para alguém do comercial, sem usar nomes de transação.",
   "flowKey": "padrao",
   "order": true
  },
  {
   "id": "variacoes",
   "t": "Variações do processo",
   "guide": "O que muda quando a venda não é a padrão?",
   "widget": "flow",
   "body": "<p>As variações quase sempre mudam pela <b>categoria de item</b>. O resto do fluxo se adapta a ela.</p>\n  <div class=\"tbl\"><table><thead><tr><th>Cenário</th><th>Categoria</th><th>Remessa</th><th>Faturamento</th><th>O que muda</th></tr></thead><tbody>\n  <tr><td>Serviço</td><td class=\"mono\">TAD</td><td>Não</td><td>Com referência à ordem</td><td>Sem estoque e sem CMV pelo SD</td></tr>\n  <tr><td>Venda por terceiros</td><td class=\"mono\">TAS</td><td>Não (fornecedor entrega)</td><td>Com referência à ordem</td><td>A OV gera requisição de compra; o fornecedor entrega direto ao cliente</td></tr>\n  <tr><td>Bonificação</td><td class=\"mono\">TANN</td><td>Sim</td><td>Não</td><td>Item sem preço, mas com saída de estoque e reflexo fiscal</td></tr>\n  <tr><td>Consignação: preenchimento</td><td class=\"mono\">KB</td><td>Sim</td><td>Não</td><td>Estoque vai para o cliente, mas continua da empresa</td></tr>\n  <tr><td>Consignação: retirada</td><td class=\"mono\">KE</td><td>Sim</td><td>Sim</td><td>Só aqui nasce a receita</td></tr>\n  <tr><td>Devolução</td><td class=\"mono\">REN</td><td>Sim (entrada)</td><td>Crédito</td><td>Entrada em estoque bloqueado de devolução (mov. 651)</td></tr></tbody></table></div>\n  <p>Use os cenários de serviço e devolução no fluxo abaixo para comparar com a venda padrão.</p>",
   "arch": "Variações são onde o fiscal brasileiro mais pesa: bonificação, consignação e devolução têm CFOP e tratamento próprios. Valide sempre com o time fiscal do cliente.",
   "acts": [
    {
     "q": "Na venda por terceiros, quem entrega a mercadoria ao cliente?",
     "o": [
      "O centro da empresa",
      "O fornecedor, a partir de um pedido de compra gerado pela OV",
      "O EWM",
      "A transportadora, sem documento"
     ],
     "a": 1,
     "w": "A categoria TAS gera requisição de compra; o fornecedor entrega direto."
    },
    {
     "q": "Em qual etapa da consignação a receita é reconhecida?",
     "o": [
      "Preenchimento (KB)",
      "Retirada (KE)",
      "Coleta (KA)",
      "Devolução de consignação (KR)"
     ],
     "a": 1,
     "w": "No preenchimento o estoque ainda é da empresa. A venda acontece na retirada."
    }
   ],
   "reflect": "Escolha um cliente real (sem identificar) e diga quais variações ele usa e por quê.",
   "flowKey": "servico"
  },
  {
   "id": "preco",
   "t": "Preço e impostos",
   "guide": "Como a OV chega ao preço e aos impostos sem digitação?",
   "body": "<p>O SD usa a <b>técnica de condição</b>, a mesma do MM:</p>\n  <ol><li>O <b>procedimento de determinação de preço</b> é escolhido pela área de vendas, pelo esquema do documento e pelo esquema do cliente.</li><li>O procedimento lista os <b>tipos de condição</b> na ordem de cálculo (preço, descontos, frete, impostos).</li><li>Cada tipo de condição tem uma <b>sequência de acesso</b>, que diz em que ordem procurar os registros (ex.: cliente + material, depois só material).</li><li>Os <b>registros de condição</b> trazem o valor.</li></ol>\n  <p>No S/4HANA a condição de preço padrão passou a ser <span class=\"mono\">PPR0</span> (no ECC era <span class=\"mono\">PR00</span>).</p>\n  <p>No Brasil, a OV também determina código de imposto, CFOP e as leis fiscais de ICMS, IPI, PIS e COFINS por item. A nota fiscal herda isso pela fatura. Erro de imposto na NF quase sempre começa na OV.</p>",
   "arch": "Antes de aceitar \"precisamos de um cálculo de preço customizado\", pergunte se não é só uma nova tabela de condição ou sequência de acesso. A técnica de condição resolve a maior parte das políticas comerciais.",
   "acts": [
    {
     "q": "Para que serve a sequência de acesso?",
     "o": [
      "Definir a numeração dos documentos",
      "Definir a ordem de busca dos registros de condição",
      "Definir o centro de expedição",
      "Liberar o bloqueio de crédito"
     ],
     "a": 1,
     "w": "Ela vai do mais específico para o mais genérico até encontrar um registro válido."
    },
    {
     "q": "Onde o CFOP é determinado primeiro?",
     "o": [
      "Na NF-e",
      "No item da OV",
      "No FI",
      "Na remessa"
     ],
     "a": 1,
     "w": "A OV determina; fatura e nota herdam."
    }
   ],
   "reflect": "Descreva uma política de preço de um cliente e como ela caberia na técnica de condição."
  },
  {
   "id": "s4",
   "t": "S/4HANA e limites do padrão",
   "guide": "O que mudou e onde o padrão costuma não bastar?",
   "body": "<div class=\"tbl\"><table><thead><tr><th>Tema</th><th>ECC</th><th>S/4HANA</th></tr></thead><tbody>\n  <tr><td>Cliente</td><td>Mestre de cliente (KNA1)</td><td>Business Partner obrigatório, via CVI</td></tr>\n  <tr><td>Status</td><td>Tabelas VBUK / VBUP</td><td>Campos de status nos próprios cabeçalhos e itens</td></tr>\n  <tr><td>Crédito</td><td>Crédito clássico do SD</td><td>SAP Credit Management (FIN-FSCM)</td></tr>\n  <tr><td>Rebates</td><td>Acordos de rebate</td><td>Condition Contract Settlement</td></tr>\n  <tr><td>Saída de documentos</td><td>NAST</td><td>Output Management com BRF+ (NAST ainda suportado)</td></tr>\n  <tr><td>Contabilidade</td><td>FI e CO separados</td><td>Documento universal (ACDOCA)</td></tr>\n  <tr><td>Armazém</td><td>WM clássico</td><td>EWM como direção estratégica</td></tr></tbody></table></div>\n  <p><b>Onde o padrão atende bem:</b> fluxos flexíveis por tipos e categorias, técnica de condição, rastreabilidade no fluxo de documentos, integração nativa com FI, CO, MM e Fiscal.</p>\n  <p><b>Onde costuma pedir extensão:</b> regras de aprovação muito específicas, preço dinâmico fora da técnica de condição, canais externos de venda, cenários fiscais incomuns (tratados por BAdI da localização).</p>",
   "arch": "Ordem de avaliação: configuração, depois extensão key-user, depois side-by-side no BTP, e só por último ABAP no core. É o raciocínio do Clean Core.",
   "acts": [
    {
     "q": "O que substitui o crédito clássico do SD no S/4HANA?",
     "o": [
      "Nada, ele continua",
      "SAP Credit Management (FIN-FSCM)",
      "Ariba",
      "Um BAdI obrigatório"
     ],
     "a": 1,
     "w": "Consta na Simplification List."
    },
    {
     "q": "Qual a ordem de avaliação no Clean Core?",
     "o": [
      "ABAP, depois configuração",
      "Configuração, extensão key-user, side-by-side, e por último ABAP no core",
      "Side-by-side sempre primeiro",
      "Key-user só em nuvem pública"
     ],
     "a": 1,
     "w": "Quanto mais perto do padrão, menor o custo de upgrade."
    }
   ],
   "reflect": "Pense num desenvolvimento ABAP que você já viu em SD. Ele poderia ter sido resolvido por configuração?"
  }
 ],
 "THEMES": [
  {
   "id": "org",
   "t": "Estrutura e dados mestres",
   "qs": [
    {
     "q": "A área de vendas é formada por:",
     "o": [
      "Organização de vendas + canal + setor",
      "Empresa + centro + depósito",
      "Organização de vendas + centro",
      "Canal + setor + centro de expedição"
     ],
     "a": 0,
     "w": "Os três objetos de vendas."
    },
    {
     "q": "A organização de vendas está ligada a qual objeto do FI?",
     "o": [
      "Centro de custo",
      "Empresa",
      "Área de contabilidade de custos",
      "Segmento"
     ],
     "a": 1,
     "w": "Cada organização de vendas pertence a uma empresa."
    },
    {
     "q": "Moeda e condição de pagamento da venda ficam em:",
     "o": [
      "Dados gerais do BP",
      "Dados de área de vendas do BP",
      "Mestre de material",
      "Registro info"
     ],
     "a": 1,
     "w": "Variam por área de vendas."
    },
    {
     "q": "O centro de expedição é determinado a partir de:",
     "o": [
      "Cliente e canal",
      "Centro, condição de expedição e grupo de carregamento",
      "Organização de vendas",
      "Tipo de ordem"
     ],
     "a": 1,
     "w": "É a regra de determinação padrão."
    }
   ]
  },
  {
   "id": "docs",
   "t": "Documentos e controles",
   "qs": [
    {
     "q": "Quem decide se um item gera remessa?",
     "o": [
      "Tipo de ordem",
      "Categoria de item",
      "Centro",
      "Cliente"
     ],
     "a": 1,
     "w": "Relevância para remessa é da categoria de item."
    },
    {
     "q": "A categoria de item é determinada por:",
     "o": [
      "Só o tipo de documento",
      "Tipo de documento + grupo de categorias de item (+ utilização, item superior)",
      "O cliente",
      "O centro"
     ],
     "a": 1,
     "w": "Por isso itens diferentes na mesma OV se comportam diferente."
    },
    {
     "q": "A categoria de divisão liga o item a:",
     "o": [
      "Preço",
      "MRP e tipo de movimento",
      "Crédito",
      "NF-e"
     ],
     "a": 1,
     "w": "Ex.: CP com MRP, CN sem planejamento."
    },
    {
     "q": "Onde se vê o histórico OV → remessa → fatura?",
     "o": [
      "BSEG",
      "Fluxo de documentos (VBFA)",
      "MSEG",
      "Log de modificações"
     ],
     "a": 1,
     "w": "Navegável de qualquer documento."
    }
   ]
  },
  {
   "id": "fluxos",
   "t": "Fluxos e variações",
   "qs": [
    {
     "q": "Venda de serviço normalmente usa:",
     "o": [
      "OV, remessa e fatura",
      "OV e fatura",
      "Só fatura",
      "OV e remessa"
     ],
     "a": 1,
     "w": "Item de serviço não é relevante para remessa."
    },
    {
     "q": "A categoria TAS indica:",
     "o": [
      "Bonificação",
      "Venda por terceiros",
      "Consignação",
      "Serviço"
     ],
     "a": 1,
     "w": "Gera requisição de compra para o fornecedor entregar direto."
    },
    {
     "q": "Na consignação, o faturamento nasce na:",
     "o": [
      "Preenchimento KB",
      "Retirada KE",
      "Coleta KA",
      "Devolução KR"
     ],
     "a": 1,
     "w": "Só a retirada é venda."
    },
    {
     "q": "A entrada física de uma devolução usa o movimento:",
     "o": [
      "601",
      "651",
      "101",
      "261"
     ],
     "a": 1,
     "w": "Leva a estoque bloqueado de devolução."
    }
   ]
  },
  {
   "id": "preco",
   "t": "Preço e impostos",
   "qs": [
    {
     "q": "O procedimento de preço é escolhido por:",
     "o": [
      "Material",
      "Área de vendas + esquema do documento + esquema do cliente",
      "Centro",
      "Tipo de remessa"
     ],
     "a": 1,
     "w": "Essa é a chave de determinação."
    },
    {
     "q": "A sequência de acesso define:",
     "o": [
      "A ordem de busca dos registros de condição",
      "A numeração",
      "O CFOP",
      "O centro"
     ],
     "a": 0,
     "w": "Do mais específico para o mais genérico."
    },
    {
     "q": "Condição de preço padrão no S/4HANA:",
     "o": [
      "PR00",
      "PPR0",
      "K004",
      "MWST"
     ],
     "a": 1,
     "w": "PR00 era o padrão no ECC."
    },
    {
     "q": "Erro de CFOP na NF-e normalmente começa:",
     "o": [
      "No DRC",
      "Na OV",
      "No FI",
      "Na remessa"
     ],
     "a": 1,
     "w": "A OV determina; a nota herda."
    }
   ]
  },
  {
   "id": "integ",
   "t": "Integração",
   "qs": [
    {
     "q": "A saída de mercadoria lança:",
     "o": [
      "D Cliente / C Receita",
      "D CMV / C Estoque",
      "D Estoque / C GR/IR",
      "Nada"
     ],
     "a": 1,
     "w": "Movimento 601."
    },
    {
     "q": "As contas de receita da fatura vêm de:",
     "o": [
      "Lançamento manual no FI",
      "Determinação de contas do SD",
      "Determinação de contas do MM",
      "CO"
     ],
     "a": 1,
     "w": "Configurada no SD, não no FI."
    },
    {
     "q": "Com EWM, quem confirma o picking?",
     "o": [
      "O SD na OV",
      "O EWM, que devolve o status à remessa",
      "O FI",
      "O cliente"
     ],
     "a": 1,
     "w": "A remessa é replicada como documento de saída no EWM."
    },
    {
     "q": "Em produção sob encomenda, a OV:",
     "o": [
      "Não tem relação com PP",
      "Gera estoque especial vinculado ao item da OV",
      "Gera fatura direto",
      "Bloqueia o MRP"
     ],
     "a": 1,
     "w": "O produto fica reservado para aquela venda."
    }
   ]
  },
  {
   "id": "s4",
   "t": "S/4HANA",
   "qs": [
    {
     "q": "FI e CO gravam juntos na tabela:",
     "o": [
      "BSEG",
      "ACDOCA",
      "COEP",
      "FAGLFLEXA"
     ],
     "a": 1,
     "w": "Universal Journal."
    },
    {
     "q": "O crédito clássico do SD foi substituído por:",
     "o": [
      "SAP Credit Management",
      "Ariba",
      "BRF+",
      "Nada"
     ],
     "a": 0,
     "w": "FIN-FSCM."
    },
    {
     "q": "O status das ordens no S/4HANA fica:",
     "o": [
      "Em VBUK/VBUP",
      "Nos próprios cabeçalhos e itens",
      "Na VBFA",
      "Em tabela Z"
     ],
     "a": 1,
     "w": "VBUK/VBUP foram eliminadas."
    },
    {
     "q": "Rebates do SD passaram para:",
     "o": [
      "Condition Contract Settlement",
      "Credit Management",
      "Output Management",
      "EWM"
     ],
     "a": 0,
     "w": "Os acordos de rebate clássicos não seguem no S/4."
    }
   ]
  }
 ],
 "INTEG": [
  {
   "k": "MM",
   "n": "MM",
   "sub": "Estoque",
   "dir": "SD ↔ MM",
   "step": "OV (disponibilidade) e saída de mercadoria",
   "what": "A OV consulta estoque e entradas planejadas (ATP). A saída de mercadoria cria documento de material com movimento 601 no centro e depósito da remessa.",
   "varies": "Consignação e produção sob encomenda usam estoque especial. Venda por terceiros (TAS) cria requisição de compra a partir da OV."
  },
  {
   "k": "EWM",
   "n": "EWM",
   "sub": "Armazém",
   "dir": "SD → EWM → SD",
   "step": "Remessa",
   "what": "A remessa é replicada como documento de saída no EWM, que cria ordens de depósito, faz picking e embalagem e devolve a confirmação e a saída de mercadoria.",
   "varies": "Sem gestão de armazém, o picking é confirmado na própria remessa. No ECC com WM clássico, por ordens de transferência. EWM pode ser embedded ou decentral."
  },
  {
   "k": "FI",
   "n": "FI",
   "sub": "Contabilidade",
   "dir": "SD → FI",
   "step": "Saída de mercadoria e fatura",
   "what": "Saída de mercadoria: D CMV / C Estoque. Fatura: D Cliente / C Receita e impostos. As contas de receita vêm da determinação de contas do SD.",
   "varies": "Receita diferida em contratos usa Revenue Accounting. Em algumas empresas o faturamento ocorre antes da saída física."
  },
  {
   "k": "CO",
   "n": "CO",
   "sub": "Margem",
   "dir": "SD → CO",
   "step": "Fatura e saída de mercadoria",
   "what": "Receita, descontos e CMV chegam à análise de margem com características como cliente, material e região.",
   "varies": "No S/4HANA a análise de margem (account-based) é o padrão; a versão costing-based ainda existe em clientes que migraram."
  },
  {
   "k": "FISCAL",
   "n": "Fiscal BR",
   "sub": "NF-e",
   "dir": "SD → Fiscal → SEFAZ",
   "step": "Fatura",
   "what": "A fatura cria a nota fiscal (J_1BNFDOC / J_1BNFLIN) com CFOP e impostos determinados na OV. O DRC transmite o XML e recebe a autorização.",
   "varies": "Produto (NF-e) e serviço (NFS-e) têm caminhos diferentes. A Reforma Tributária traz IBS e CBS para o documento."
  },
  {
   "k": "PP",
   "n": "PP",
   "sub": "Produção",
   "dir": "SD → PP",
   "step": "OV (linha de divisão)",
   "what": "A linha de divisão com MRP transfere a necessidade para o planejamento. Em produção sob encomenda, a OV vira objeto de estoque e de custo.",
   "varies": "Make-to-stock, make-to-order e produto configurável (variant configuration) mudam bastante a integração."
  },
  {
   "k": "CRED",
   "n": "Crédito",
   "sub": "FIN-FSCM",
   "dir": "SD ↔ Credit Mgmt",
   "step": "OV e remessa",
   "what": "A verificação de crédito pode bloquear OV ou remessa conforme exposição e limite do cliente.",
   "varies": "Regras por segmento de crédito e por tipo de documento. No ECC era o crédito clássico do SD."
  },
  {
   "k": "PS",
   "n": "PS",
   "sub": "Projetos",
   "dir": "SD ↔ PS",
   "step": "OV ligada a PEP",
   "what": "Itens da OV vinculados a elemento PEP; receita e custo apurados no projeto. Faturamento por marco ou plano de faturamento.",
   "varies": "Comum em engenharia e serviços sob contrato. Raro em varejo e distribuição."
  }
 ],
 "CARDS": [
  {
   "id": "c1",
   "f": "Área de vendas",
   "b": "Organização de vendas + canal de distribuição + setor de atividade. Toda OV pertence a uma área de vendas.",
   "mod": "SD"
  },
  {
   "id": "c2",
   "f": "Controle de cópia",
   "b": "Regras que dizem qual documento pode gerar qual (OR → LF → F2), que dados passam e quais verificações rodam.",
   "mod": "SD"
  },
  {
   "id": "c3",
   "f": "Categoria de item",
   "b": "Define, por item, se há remessa, se há faturamento e com referência a quê (ordem ou remessa).",
   "mod": "SD"
  },
  {
   "id": "c4",
   "f": "Tipo de movimento 601",
   "b": "Saída de mercadoria para remessa de venda. Baixa estoque e lança CMV.",
   "mod": "SD/MM"
  },
  {
   "id": "c5",
   "f": "Centro de expedição",
   "b": "Local que processa a remessa. Determinado a partir do centro, condição de expedição e grupo de carregamento.",
   "mod": "SD"
  },
  {
   "id": "c7",
   "f": "Business Partner",
   "b": "Objeto único para cliente e fornecedor no S/4HANA (CVI sincroniza com KNA1/LFA1).",
   "mod": "Fundamentos"
  },
  {
   "id": "c9",
   "f": "DRC",
   "b": "Document and Reporting Compliance: solução SAP para mensageria de documentos fiscais eletrônicos e obrigações.",
   "mod": "Fiscal BR"
  },
  {
   "id": "c10",
   "f": "Faturamento relacionado à ordem",
   "b": "A fatura usa a quantidade da OV. Típico de serviços e planos de faturamento.",
   "mod": "SD"
  }
 ],
 "CHALLENGE": {
  "ctx": "Um distribuidor de equipamentos vende o equipamento e a instalação na mesma negociação. Quer uma única OV, entregar o equipamento já e faturar a instalação só depois que o técnico concluir. Hoje o time pensa em um desenvolvimento ABAP.",
  "q": "Qual desenho você propõe?",
  "o": [
   {
    "t": "Duas OVs separadas, uma por tipo de venda.",
    "s": 1,
    "w": "Funciona, mas quebra a visão comercial única e duplica preço, crédito e aprovação. Atende o sintoma, não o pedido."
   },
   {
    "t": "Uma OV com item de material (relevante para remessa) e item de serviço com faturamento relacionado à ordem, bloqueado até a conclusão.",
    "s": 3,
    "w": "Padrão SAP. A categoria de item resolve a diferença entre os itens; o bloqueio de faturamento no item segura a instalação até o aceite. Zero desenvolvimento."
   },
   {
    "t": "Desenvolvimento ABAP que divide a OV na gravação.",
    "s": 0,
    "w": "Adiciona código para algo que o padrão já faz. Fere Clean Core e vira custo de manutenção a cada upgrade."
   },
   {
    "t": "Levar a instalação para o SAP Service e faturar por lá.",
    "s": 2,
    "w": "Faz sentido se houver gestão de técnicos, agenda e apontamento. Para um simples aceite, é mais solução do que o problema pede."
   }
  ],
  "title": "Equipamento e instalação na mesma venda"
 },
 "TERMS": {
  "papel": [
   "so",
   "dlv",
   "bill",
   "gi"
  ],
  "estrutura": [
   "sorg",
   "dch",
   "div",
   "sarea",
   "shpt",
   "plant",
   "cc"
  ],
  "mestres": [
   "bp",
   "pf",
   "pterm",
   "itcg",
   "crec"
  ],
  "anatomia": [
   "doct",
   "itcat",
   "slcat",
   "copy",
   "flow"
  ],
  "padrao": [
   "atp",
   "pick",
   "gi",
   "mvt",
   "cogs",
   "rev"
  ],
  "variacoes": [
   "tp",
   "preq",
   "free",
   "cons",
   "ret",
   "credit"
  ],
  "preco": [
   "pproc",
   "ctype",
   "aseq",
   "crec"
  ],
  "s4": [
   "bp",
   "credm",
   "rebate",
   "ma"
  ]
 }
};
