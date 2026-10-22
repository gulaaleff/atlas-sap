CORE.pt={
 "NODES": {
  "SD": {
   "x": 110,
   "y": 70,
   "sub": "Vendas e distribuição"
  },
  "MM": {
   "x": 300,
   "y": 70,
   "sub": "Compras e estoque"
  },
  "PP": {
   "x": 490,
   "y": 70,
   "sub": "Produção"
  },
  "ARIBA": {
   "x": 680,
   "y": 70,
   "sub": "Sourcing (nuvem)",
   "label": "Ariba"
  },
  "FISCAL": {
   "x": 110,
   "y": 200,
   "sub": "NF-e, DRC, SPED",
   "label": "Fiscal BR"
  },
  "FI": {
   "x": 300,
   "y": 200,
   "sub": "Contabilidade"
  },
  "CO": {
   "x": 490,
   "y": 200,
   "sub": "Controladoria"
  },
  "QM": {
   "x": 680,
   "y": 200,
   "sub": "Qualidade"
  },
  "EWM": {
   "x": 110,
   "y": 330,
   "sub": "Armazém"
  },
  "HCM": {
   "x": 300,
   "y": 330,
   "sub": "Pessoas e folha"
  },
  "PS": {
   "x": 490,
   "y": 330,
   "sub": "Projetos"
  },
  "PM": {
   "x": 680,
   "y": 330,
   "sub": "Manutenção"
  }
 },
 "EDGES": [
  [
   "SD",
   "MM",
   "Verificação de disponibilidade (ATP) na OV; a saída de mercadoria da remessa baixa o estoque (tipo de movimento 601)."
  ],
  [
   "SD",
   "EWM",
   "A remessa de saída é replicada para o EWM, que executa picking, embalagem e confirma a saída de mercadoria."
  ],
  [
   "SD",
   "FI",
   "A saída de mercadoria lança custo da mercadoria vendida contra estoque; a fatura lança cliente contra receita e impostos."
  ],
  [
   "SD",
   "CO",
   "Receita, descontos e custo chegam à análise de margem (CO-PA / Margin Analysis) pelo mesmo documento contábil."
  ],
  [
   "SD",
   "FISCAL",
   "A fatura gera a nota fiscal (J_1BNFDOC) e o DRC transmite a NF-e para a SEFAZ."
  ],
  [
   "SD",
   "PP",
   "Itens de venda geram necessidade para o MRP; em produção sob encomenda a OV vira estoque especial do cliente."
  ],
  [
   "SD",
   "PS",
   "Venda ligada a elemento PEP, com faturamento por marco ou plano de faturamento."
  ],
  [
   "MM",
   "FI",
   "Entrada de mercadoria lança estoque contra GR/IR; a MIRO lança GR/IR contra fornecedor."
  ],
  [
   "MM",
   "EWM",
   "Entradas e saídas físicas em depósitos gerenciados pelo EWM."
  ],
  [
   "MM",
   "PP",
   "Consumo de componentes na ordem (mov. 261) e entrada do produto acabado (mov. 101)."
  ],
  [
   "MM",
   "QM",
   "Lote de controle no recebimento: o material entra em estoque de controle de qualidade até a decisão de utilização."
  ],
  [
   "MM",
   "ARIBA",
   "Cotação, contrato e pedido colaborativo com o fornecedor; o documento oficial continua no S/4HANA."
  ],
  [
   "MM",
   "FISCAL",
   "Recebimento da NF-e do fornecedor (DRC inbound) e nota fiscal de entrada na MIGO/MIRO."
  ],
  [
   "MM",
   "PM",
   "Reservas de material e compras de serviço para ordens de manutenção."
  ],
  [
   "PP",
   "CO",
   "Custo padrão do produto e apuração da ordem de produção (variações)."
  ],
  [
   "PP",
   "QM",
   "Inspeção durante a produção e no produto acabado."
  ],
  [
   "PM",
   "CO",
   "Custos da ordem de manutenção liquidados em centro de custo ou ativo."
  ],
  [
   "PS",
   "CO",
   "Orçamento, custos reais e apuração de resultado por elemento PEP."
  ],
  [
   "HCM",
   "FI",
   "Resultado da folha lançado na contabilidade (salários, encargos, provisões)."
  ],
  [
   "CO",
   "FI",
   "No S/4HANA, FI e CO gravam no mesmo documento universal (tabela ACDOCA): não há reconciliação entre eles."
  ],
  [
   "FI",
   "FISCAL",
   "Impostos apurados alimentam as obrigações acessórias (SPED)."
  ]
 ]
};
