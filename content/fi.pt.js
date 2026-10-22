(MOD.fi=MOD.fi||{}).pt={
name:'FI · Contabilidade financeira', short:'Contabilidade financeira',
lead:'O reflexo financeiro de tudo o que acontece na empresa: razão, contas a pagar e a receber, ativos, fechamento e onde o FI recebe trabalho de todos os outros módulos.',
ORDER:['Entrada de mercadoria','Fatura do fornecedor','Proposta de pagamento','Pagamento','Extrato e compensação'],
FLOWS:{
 pagar:{name:'Contas a pagar', note:'Da fatura do fornecedor ao extrato bancário.', steps:[
  {t:'MIRO ou FB60 · tipo RE/KR', b:'Fatura do fornecedor', m:'partida em aberto',
   ctrl:'Fatura com pedido entra pela MIRO (tipo RE); sem pedido, direto no FI (tipo KR). A condição de pagamento define vencimento e desconto.',
   integ:'MM: verificação contra pedido e entrada. Fiscal: nota de entrada e retenções.',
   effect:'D Despesa ou GR/IR e impostos / C Fornecedor (conta de reconciliação no razão).',
   arch:'Toda fatura vira uma partida em aberto no fornecedor e, ao mesmo tempo, um saldo na conta de reconciliação do razão.'},
  {t:'F110 · proposta', b:'Proposta de pagamento', m:'seleção por vencimento',
   ctrl:'O programa seleciona partidas vencidas por empresa, forma de pagamento e banco. A proposta pode ser revisada antes da execução.',
   integ:'Faturas bloqueadas na MIRO ficam fora da proposta.',
   effect:'Nenhum lançamento: é só uma lista editável.',
   arch:'A proposta é o ponto de controle do tesoureiro. Separar quem propõe de quem executa é controle interno básico.'},
  {t:'F110 · execução · KZ', b:'Pagamento', m:'documento e arquivo bancário',
   ctrl:'A execução lança o pagamento, compensa as partidas do fornecedor e gera o meio de pagamento.',
   integ:'Bancos: arquivo de remessa (no Brasil, CNAB ou API).',
   effect:'D Fornecedor / C Banco ou conta transitória de pagamentos.',
   arch:'Usar conta transitória até o extrato dá visibilidade do que foi enviado e ainda não saiu do banco.'},
  {t:'FF_5 · extrato', b:'Extrato e compensação', m:'conciliação bancária',
   ctrl:'O extrato eletrônico é importado e regras de busca compensam as partidas da conta transitória.',
   integ:'Bancos: arquivo de retorno ou extrato.',
   effect:'D Conta transitória / C Banco (conta principal).',
   arch:'Conciliação automática bem configurada reduz o fechamento de dias para horas.'}
 ]},
 receber:{name:'Contas a receber', note:'Da fatura ao recebimento e cobrança.', steps:[
  {t:'VF01 · tipo RV', b:'Fatura vinda do SD', m:'partida em aberto do cliente',
   ctrl:'A fatura do SD cria o documento contábil. A condição de pagamento vem da OV.',
   integ:'SD: determinação de contas de receita. Crédito: exposição do cliente.',
   effect:'D Cliente / C Receita e impostos.',
   arch:'O FI não decide a conta de receita: ela vem configurada do SD.'},
  {t:'Boleto · cobrança', b:'Instrumento de cobrança', m:'no Brasil, boleto ou PIX',
   ctrl:'O programa de pagamento também pode gerar cobranças de clientes (forma de pagamento de entrada).',
   integ:'Bancos: registro do boleto.',
   effect:'Nenhum lançamento novo.',
   arch:'No Brasil a cobrança bancária é parte do processo; a integração com bancos costuma ser via CNAB ou API.'},
  {t:'F-28 ou extrato · DZ', b:'Recebimento', m:'compensação da partida',
   ctrl:'O recebimento compensa a partida do cliente, manual ou pelo extrato.',
   integ:'Bancos: arquivo de retorno.',
   effect:'D Banco / C Cliente.',
   arch:'Pagamentos parciais e sem referência são a maior fonte de trabalho manual em contas a receber.'},
  {t:'F150', b:'Reclamação (dunning)', m:'cartas de cobrança',
   ctrl:'O programa de reclamação seleciona partidas vencidas e envia avisos em níveis.',
   integ:'Crédito: o nível de reclamação pode bloquear novas vendas.',
   effect:'Pode lançar juros, conforme a configuração.',
   arch:'Defina os níveis com o financeiro do cliente; cobrança agressiva demais afeta relacionamento comercial.'}
 ]},
 fechamento:{name:'Fechamento', note:'O que acontece no fim de cada período.', steps:[
  {t:'Lançamentos periódicos', b:'Provisões e apropriações', m:'recorrentes e manuais',
   ctrl:'Lançamentos recorrentes, provisões e apropriações de competência.',
   integ:'CO: os mesmos valores aparecem nos objetos de custo.',
   effect:'D Despesa / C Provisão (exemplo).',
   arch:'Quanto mais vier automático dos processos, menos ajuste manual no fechamento.'},
  {t:'AFAB', b:'Depreciação', m:'todas as áreas de avaliação',
   ctrl:'O programa de depreciação lança a depreciação planejada dos ativos.',
   integ:'Ativos (FI-AA) e CO (centro de custo do ativo).',
   effect:'D Despesa de depreciação / C Depreciação acumulada.',
   arch:'No S/4HANA cada área de avaliação lança no seu ledger, sem reconciliação posterior.'},
  {t:'FAGL_FCV', b:'Avaliação de moeda estrangeira', m:'partidas em aberto e saldos',
   ctrl:'Reavalia partidas em moeda estrangeira pela taxa do fechamento.',
   integ:'Tesouraria: tabela de taxas de câmbio.',
   effect:'D/C Variação cambial contra a conta avaliada.',
   arch:'Valores em moeda estrangeira são comuns em importação. A avaliação precisa de taxas carregadas antes do fechamento.'},
  {t:'Fechar períodos', b:'Bloqueio e demonstrações', m:'balanço e DRE',
   ctrl:'O período é fechado para lançamentos e as demonstrações saem das versões de balanço.',
   integ:'Fiscal BR: SPED ECD e ECF.',
   effect:'Nenhum lançamento novo.',
   arch:'Um cockpit de fechamento ajuda a orquestrar tarefas, responsáveis e dependências entre empresas.'}
 ]}
},
CHAPTERS:[
 {id:'papel', t:'O papel do FI no negócio', guide:'Por que o FI recebe lançamentos de quase todos os módulos?',
  body:`<p>O FI registra o reflexo financeiro de tudo para fins legais: balanço, demonstração de resultado e obrigações. O núcleo é o <b>razão geral</b>, que dá uma visão atual, central e completa de todas as transações com valor.</p>
  <p>Em volta dele ficam os <b>razões auxiliares</b>: contas a pagar (fornecedores), contas a receber (clientes) e ativos imobilizados. Cada lançamento num razão auxiliar aparece na hora no razão geral, por meio de uma conta de reconciliação.</p>
  <p>O FI não decide preço (SD), nem custo de estoque (MM), nem custo interno por centro (CO). Ele recebe esses valores e os organiza para a visão externa.</p>
  <ul><li>Lançamentos manuais no razão</li><li>Contas a pagar e pagamentos</li><li>Contas a receber, cobrança e reclamação</li><li>Ativos imobilizados</li><li>Bancos e conciliação</li><li>Fechamento e demonstrações</li></ul>`,
  arch:'Em projetos, o FI é onde tudo converge. Um erro de configuração em SD ou MM aparece primeiro como diferença contábil. Por isso o arquiteto de FI precisa entender os outros módulos.',
  acts:[
   {q:'Como um lançamento de fornecedor chega ao razão geral?', o:['Por interface noturna','Pela conta de reconciliação, na hora','Manualmente no fechamento','Pelo CO'], a:1, w:'A conta de reconciliação mantém razão auxiliar e razão geral sempre iguais.'},
   {q:'Qual destes é razão auxiliar do FI?', o:['Centro de custo','Contas a receber','Ordem interna','Lista técnica'], a:1, w:'Contas a pagar, a receber e ativos são os razões auxiliares.'}],
  reflect:'Explique por que um erro na determinação de contas do SD vira problema do FI.'},
 {id:'estrutura', t:'Estrutura organizacional', guide:'Qual é a menor unidade com balanço próprio e o que mais estrutura a contabilidade?',
  body:`<div class="org"><div><b>Empresa</b><span>Menor unidade com contabilidade completa e demonstrações legais. Tem moeda e país.</span></div><div><b>Plano de contas</b><span>Lista de contas usada no dia a dia, atribuída à empresa. No Brasil pode haver plano do país em paralelo.</span></div><div><b>Variante de exercício</b><span>Define o ano fiscal e os períodos (em geral 12 mais períodos especiais).</span></div><div><b>Ledger</b><span>Livro contábil. O líder (0L) segue a norma principal; ledgers paralelos atendem outras normas.</span></div></div>
  <p>Para relatórios por unidade de negócio, o FI usa <b>centro de lucro</b> e <b>segmento</b>. No S/4HANA os dois vivem no mesmo documento contábil.</p>`,
  arch:'A quantidade de empresas e ledgers é decisão estrutural difícil de mudar depois. Defina com o contador e o controller antes de qualquer configuração.',
  acts:[
   {q:'Qual é a menor unidade com demonstrações legais completas?', o:['Centro','Empresa','Centro de lucro','Segmento'], a:1, w:'A empresa (company code).'},
   {q:'Para atender IFRS e norma local ao mesmo tempo, o padrão é usar:', o:['Duas empresas','Ledgers paralelos','Duas variantes de exercício','Dois centros de lucro'], a:1, w:'Ledger líder numa norma e ledger paralelo na outra.'}],
  reflect:'Um grupo tem 3 CNPJs no Brasil e uma matriz no exterior. Quantas empresas e ledgers você proporia?'},
 {id:'mestres', t:'Dados mestres', guide:'Quais cadastros sustentam os lançamentos contábeis?',
  body:`<div class="tbl"><table><thead><tr><th>Dado mestre</th><th>O que o FI usa</th><th>Observação</th></tr></thead><tbody>
  <tr><td>Conta do razão</td><td>Tipo (balanço, resultado, custos primários ou secundários), moeda, controle de partida em aberto</td><td>No S/4HANA a natureza de custo é uma conta do razão</td></tr>
  <tr><td>Business Partner (cliente/fornecedor)</td><td>Dados de empresa: conta de reconciliação, condição e forma de pagamento, dados bancários</td><td>Mesmo objeto usado por SD e MM</td></tr>
  <tr><td>Ativo imobilizado</td><td>Classe do ativo, centro de custo, áreas de avaliação e chaves de depreciação</td><td>Razão auxiliar FI-AA</td></tr>
  <tr><td>Bancos da empresa</td><td>Bancos e contas bancárias usados em pagamentos e extratos</td><td>Base para o programa de pagamento</td></tr></tbody></table></div>`,
  arch:'A conta de reconciliação no cadastro do cliente ou fornecedor define em que conta do balanço aquele saldo aparece. Separar fornecedores nacionais, estrangeiros e partes relacionadas começa aqui.',
  acts:[
   {q:'Onde fica a conta de reconciliação do fornecedor?', o:['Dados de compras','Dados de empresa do BP','Plano de contas','Pedido'], a:1, w:'É dado financeiro, mantido por empresa.'},
   {q:'No S/4HANA, uma natureza de custo é:', o:['Um objeto separado do FI','Uma conta do razão com tipo de custo','Um centro de custo','Um ledger'], a:1, w:'Primárias e secundárias são contas do razão.'}],
  reflect:'Que critérios você usaria para separar contas de reconciliação de fornecedores?'},
 {id:'documento', t:'O documento contábil', guide:'Como é um lançamento por dentro e por que débito sempre igual a crédito?',
  body:`<p>Todo lançamento tem <b>cabeçalho</b> (empresa, data, tipo de documento, referência) e <b>itens</b>. Cada item usa uma <b>chave de lançamento</b>, que diz se é débito ou crédito e que tipo de conta recebe. Débitos e créditos precisam fechar em zero.</p>
  <div class="tbl"><table><thead><tr><th>Tipo de documento</th><th>Origem</th></tr></thead><tbody>
  <tr><td class="mono">SA</td><td>Lançamento manual no razão</td></tr><tr><td class="mono">KR / KZ</td><td>Fatura e pagamento de fornecedor no FI</td></tr><tr><td class="mono">DR / DZ</td><td>Fatura e recebimento de cliente no FI</td></tr><tr><td class="mono">RV</td><td>Fatura vinda do SD</td></tr><tr><td class="mono">WE</td><td>Entrada de mercadoria</td></tr><tr><td class="mono">RE</td><td>Fatura da MIRO</td></tr></tbody></table></div>
  <div class="tbl"><table><thead><tr><th>Chave</th><th>Significado</th></tr></thead><tbody>
  <tr><td class="mono">40 / 50</td><td>Débito / crédito em conta do razão</td></tr><tr><td class="mono">01 / 15</td><td>Fatura / recebimento de cliente</td></tr><tr><td class="mono">31 / 25</td><td>Fatura / pagamento de fornecedor</td></tr></tbody></table></div>
  <p>No S/4HANA, cada item é gravado na tabela <b>ACDOCA</b> com todas as dimensões juntas: conta, centro de custo, centro de lucro, segmento, ledger e moedas.</p>
  <p>Contas com <b>partida em aberto</b> (fornecedor, cliente, GR/IR, transitórias de banco) só zeram por <b>compensação</b>: um lançamento que liga o débito ao crédito correspondente.</p>`,
  arch:'O tipo de documento é a melhor pista de origem. Numa auditoria, filtrar por tipo mostra rapidamente o que veio de processo e o que foi lançado à mão.',
  acts:[
   {q:'A chave 31 representa:', o:['Débito em conta do razão','Fatura de fornecedor (crédito)','Recebimento de cliente','Pagamento de fornecedor'], a:1, w:'25 é o pagamento de fornecedor.'},
   {q:'O que zera uma partida em aberto?', o:['O fechamento do período','A compensação','A depreciação','O estorno do pedido'], a:1, w:'Compensação liga o débito ao crédito correspondente.'}],
  reflect:'Por que o tipo de documento ajuda numa auditoria?'},
 {id:'apar', t:'Contas a pagar e a receber', guide:'Como o dinheiro entra e sai, e onde o FI se liga a bancos?', widget:'flow', flowKey:'pagar', order:true,
  body:`<p>Siga os fluxos de contas a pagar e a receber. Repare que a fatura sempre gera uma partida em aberto e que só a compensação a encerra.</p>`,
  arch:'Automação bancária (pagamentos e extratos) é onde o FI mais economiza tempo. No Brasil, o padrão CNAB ou APIs dos bancos entram no escopo de quase todo projeto.',
  acts:[
   {q:'Faturas bloqueadas na MIRO:', o:['São pagas normalmente','Ficam fora da proposta de pagamento','Vão para o CO','São estornadas'], a:1, w:'O bloqueio impede o pagamento até a liberação.'},
   {q:'O programa de reclamação (dunning) serve para:', o:['Pagar fornecedores','Cobrar clientes com partidas vencidas','Depreciar ativos','Fechar períodos'], a:1, w:'Envia avisos em níveis.'}],
  reflect:'Descreva como um pagamento sai do SAP e volta como extrato, sem usar nomes de transação.'},
 {id:'ativos', t:'Ativos imobilizados', guide:'Como um bem entra no balanço, perde valor e sai?',
  body:`<p>O FI-AA é um razão auxiliar do razão geral. O ciclo de um ativo:</p>
  <ol><li><b>Aquisição:</b> por pedido com classificação de ativo (A), por fatura direta ou por liquidação de projeto ou ordem de investimento.</li><li><b>Depreciação:</b> o programa calcula e lança a depreciação de cada <b>área de avaliação</b> (societária, fiscal, IFRS).</li><li><b>Transferência:</b> entre centros de custo, empresas ou classes.</li><li><b>Baixa:</b> por venda ou sucata, com ganho ou perda.</li></ol>
  <p>No S/4HANA o <b>novo Asset Accounting</b> é obrigatório: cada área de avaliação lança em tempo real no seu ledger, sem reconciliação posterior.</p>
  <p>No Brasil é comum ter depreciação societária e fiscal em áreas diferentes, e o crédito de ICMS sobre ativo (CIAP) tratado pela localização.</p>`,
  arch:'Migração de ativos é um dos pontos mais trabalhosos de uma conversão para S/4HANA. Planeje cedo a carga de saldos e áreas de avaliação.',
  acts:[
   {q:'Para ter depreciação societária e fiscal diferentes, usa-se:', o:['Duas empresas','Áreas de avaliação diferentes','Dois centros de custo','Dois planos de contas'], a:1, w:'Cada área calcula com suas regras.'},
   {q:'No S/4HANA, o novo Asset Accounting é:', o:['Opcional','Obrigatório','Só para nuvem','Removido'], a:1, w:'Lança em tempo real em todas as áreas.'}],
  reflect:'Liste as formas pelas quais um ativo pode ser adquirido no SAP.'},
 {id:'fechamento', t:'Fechamento e relatórios', guide:'O que precisa acontecer para o mês poder ser fechado?', widget:'flow', flowKey:'fechamento',
  body:`<p>O fechamento é uma sequência de tarefas com dependências. As principais:</p>
  <ul><li>Abrir o novo período e fechar o anterior para lançamentos</li><li>Provisões, apropriações e lançamentos recorrentes</li><li>Depreciação</li><li>Avaliação de moeda estrangeira</li><li>Análise da GR/IR e reconciliações</li><li>Reconciliação entre empresas do grupo</li><li>Demonstrações pelas versões de balanço</li><li>No Brasil: SPED ECD e ECF</li></ul>
  <p>No fim do ano, o transporte de saldos leva os saldos de balanço para o ano novo e zera as contas de resultado contra lucros acumulados.</p>`,
  arch:'O tempo de fechamento é um indicador que todo CFO acompanha. No pré-venda, perguntar quantos dias o cliente leva para fechar abre conversa sobre automação.',
  acts:[
   {q:'A avaliação de moeda estrangeira serve para:', o:['Converter o plano de contas','Reavaliar partidas em moeda estrangeira pela taxa do fechamento','Pagar fornecedores no exterior','Calcular depreciação'], a:1, w:'Gera variação cambial contra a conta avaliada.'},
   {q:'O que o transporte de saldos faz com as contas de resultado?', o:['Leva o saldo para o ano novo','Zera contra lucros acumulados','Apaga','Envia para o CO'], a:1, w:'Contas de balanço levam saldo; de resultado zeram.'}],
  reflect:'Monte a ordem das tarefas de fechamento de uma empresa que você conhece.'},
 {id:'s4', t:'S/4HANA e limites do padrão', guide:'O que mudou e onde o padrão costuma não bastar?',
  body:`<div class="tbl"><table><thead><tr><th>Tema</th><th>ECC</th><th>S/4HANA</th></tr></thead><tbody>
  <tr><td>Documento</td><td>BKPF / BSEG e várias tabelas de totais</td><td>ACDOCA (Universal Journal); totais calculados na hora</td></tr>
  <tr><td>Natureza de custo</td><td>Objeto separado do CO</td><td>Conta do razão com tipo</td></tr>
  <tr><td>Ativos</td><td>Asset Accounting clássico</td><td>Novo Asset Accounting obrigatório</td></tr>
  <tr><td>Cliente e fornecedor</td><td>Mestres separados</td><td>Business Partner</td></tr>
  <tr><td>Consolidação</td><td>EC-CS / BCS</td><td>Group Reporting</td></tr>
  <tr><td>Bancos</td><td>Cadastro de contas bancárias clássico</td><td>Bank Account Management</td></tr></tbody></table></div>
  <p><b>Onde o padrão atende bem:</b> razão, contas a pagar e receber, ativos, fechamento, múltiplas normas e moedas.</p>
  <p><b>Onde costuma pedir extensão:</b> integrações bancárias específicas, regras de cobrança fora do dunning, relatórios gerenciais muito particulares e obrigações fiscais incomuns.</p>`,
  arch:'Com tudo na ACDOCA, a conciliação entre FI e CO deixa de existir. Isso muda o fechamento e é argumento central em projetos de migração.',
  acts:[
   {q:'No S/4HANA, os itens contábeis ficam em:', o:['BSEG apenas','ACDOCA','COEP','GLT0'], a:1, w:'BSEG ainda existe para itens de partida, mas a ACDOCA é a base.'},
   {q:'A consolidação no S/4HANA usa:', o:['EC-CS','Group Reporting','CO-PA','Material Ledger'], a:1, w:'É a solução atual de consolidação.'}],
  reflect:'Qual mudança do S/4HANA mais impacta o fechamento contábil, na sua opinião?'}
],
THEMES:[
 {id:'org', t:'Estrutura e dados mestres', qs:[
  {q:'A empresa (company code) é:', o:['Um centro de custo','A menor unidade com demonstrações legais','Um depósito','Um ledger'], a:1, w:'Tem moeda e país próprios.'},
  {q:'O ledger líder no padrão é:', o:['0L','2L','L1','00'], a:0, w:'Ledgers paralelos atendem outras normas.'},
  {q:'A variante de exercício define:', o:['Moeda','Ano fiscal e períodos','Plano de contas','Centro de lucro'], a:1, w:'Em geral 12 períodos mais especiais.'},
  {q:'Conta de reconciliação liga:', o:['CO e FI','Razão auxiliar e razão geral','Banco e caixa','Dois ledgers'], a:1, w:'Mantém os dois sempre iguais.'}]},
 {id:'docs', t:'Documento contábil', qs:[
  {q:'O tipo de documento RV vem de:', o:['MIRO','Fatura do SD','Entrada de mercadoria','Lançamento manual'], a:1, w:'RE é MIRO, WE entrada, SA manual.'},
  {q:'A chave 40 significa:', o:['Crédito no razão','Débito no razão','Fatura de cliente','Pagamento'], a:1, w:'50 é crédito no razão.'},
  {q:'A tabela do Universal Journal é:', o:['ACDOCA','BKPF','COSP','FAGLFLEXT'], a:0, w:'Uma linha por item com todas as dimensões.'},
  {q:'Partidas em aberto zeram por:', o:['Fechamento','Compensação','Depreciação','Reclamação'], a:1, w:'A compensação liga débito e crédito.'}]},
 {id:'apar', t:'Pagar e receber', qs:[
  {q:'O programa de pagamento automático é:', o:['F110','F150','FB50','AFAB'], a:0, w:'F150 é reclamação.'},
  {q:'Antes de executar o pagamento, o tesoureiro revisa:', o:['O extrato','A proposta de pagamento','O balanço','A depreciação'], a:1, w:'Proposta editável.'},
  {q:'O recebimento de cliente lança:', o:['D Banco / C Cliente','D Cliente / C Receita','D Fornecedor / C Banco','D Despesa / C Banco'], a:0, w:'E compensa a partida do cliente.'},
  {q:'Reclamação (dunning) é:', o:['Pagamento a fornecedor','Cobrança escalonada de clientes','Avaliação cambial','Transporte de saldos'], a:1, w:'Avisos em níveis.'}]},
 {id:'ativos', t:'Ativos e fechamento', qs:[
  {q:'O programa de depreciação é:', o:['AFAB','F110','FAGL_FCV','MIRO'], a:0, w:'Lança em todas as áreas de avaliação.'},
  {q:'Depreciação societária e fiscal diferentes usam:', o:['Duas empresas','Áreas de avaliação','Dois ativos','Duas classes'], a:1, w:'Cada área com suas regras.'},
  {q:'A avaliação de moeda estrangeira gera:', o:['Depreciação','Variação cambial','Provisão','Receita'], a:1, w:'Contra a conta avaliada.'},
  {q:'No transporte de saldos, contas de resultado:', o:['Levam saldo','Zeram contra lucros acumulados','São apagadas','Vão para o CO'], a:1, w:'Contas de balanço levam saldo.'}]},
 {id:'integ', t:'Integração', qs:[
  {q:'A conta de receita da fatura do SD vem de:', o:['FI manual','Determinação de contas do SD','CO','MM'], a:1, w:'Configurada no SD.'},
  {q:'A MIRO lança:', o:['D GR/IR / C Fornecedor','D Estoque / C GR/IR','D Banco / C Cliente','Nada'], a:0, w:'A entrada lança estoque contra GR/IR.'},
  {q:'O resultado da folha chega ao FI por:', o:['HCM, lançamento da folha','SD','CO-PA','Ariba'], a:0, w:'Salários, encargos e provisões.'},
  {q:'SPED ECD é alimentado por:', o:['Dados do FI','Só pelo SD','Pelo EWM','Pelo PM'], a:0, w:'Escrituração contábil digital.'}]},
 {id:'s4', t:'S/4HANA', qs:[
  {q:'No S/4HANA, a reconciliação FI × CO:', o:['Continua mensal','Deixa de existir','Vira anual','Vai para o BW'], a:1, w:'Mesmo documento na ACDOCA.'},
  {q:'O novo Asset Accounting é:', o:['Opcional','Obrigatório','Removido','Só nuvem'], a:1, w:'Lança em tempo real.'},
  {q:'Consolidação no S/4HANA:', o:['Group Reporting','EC-CS','CO-PA','FSCM'], a:0, w:'Solução atual.'},
  {q:'Cliente e fornecedor no S/4HANA são:', o:['Mestres separados','Business Partner','Contas do razão','Centros de lucro'], a:1, w:'Com funções diferentes.'}]}
],
INTEG:[
 {k:'SD', n:'SD', sub:'Vendas', dir:'SD → FI', step:'Saída de mercadoria e fatura',
  what:'Saída: D CMV / C Estoque. Fatura: D Cliente / C Receita e impostos.', varies:'Receita diferida em contratos usa Revenue Accounting.'},
 {k:'MM', n:'MM', sub:'Compras', dir:'MM → FI', step:'Entrada de mercadoria e MIRO',
  what:'Entrada: D Estoque / C GR/IR. MIRO: D GR/IR / C Fornecedor.', varies:'Consumo direto lança despesa no lugar do estoque.'},
 {k:'CO', n:'CO', sub:'Controladoria', dir:'FI ↔ CO', step:'Todo lançamento de custo ou receita',
  what:'No S/4HANA, FI e CO gravam no mesmo documento (ACDOCA). Contas de resultado exigem objeto de custo.', varies:'Alocações internas do CO usam contas de custos secundários.'},
 {k:'AA', n:'FI-AA', sub:'Ativos', dir:'FI-AA → razão', step:'Aquisição, depreciação e baixa',
  what:'Razão auxiliar de ativos, lançado em tempo real por área de avaliação.', varies:'Áreas societária, fiscal e IFRS conforme o país.'},
 {k:'HCM', n:'HCM', sub:'Folha', dir:'HCM → FI', step:'Lançamento da folha',
  what:'Salários, encargos e provisões lançados no razão e nos centros de custo.', varies:'Folha pode estar no SAP HCM, no SuccessFactors ou em sistema de terceiros.'},
 {k:'BANK', n:'Bancos', sub:'Pagamentos', dir:'FI ↔ Bancos', step:'Pagamento, cobrança e extrato',
  what:'Arquivos de remessa e retorno, extratos eletrônicos e conciliação automática.', varies:'No Brasil, CNAB ou APIs dos bancos.'},
 {k:'FISCAL', n:'Fiscal BR', sub:'SPED', dir:'FI → Fiscal', step:'Fechamento e obrigações',
  what:'Dados contábeis alimentam SPED ECD e ECF; impostos apurados vão para as obrigações.', varies:'A Reforma Tributária muda apuração e contas de impostos.'},
 {k:'GR', n:'Group Reporting', sub:'Consolidação', dir:'FI → Consolidação', step:'Fechamento do grupo',
  what:'Saldos das empresas são consolidados, com eliminações entre empresas do grupo.', varies:'Grupos com uma só empresa não precisam.'}
],
CARDS:[
 {id:'fi1', f:'Conta de reconciliação', b:'Conta do razão ligada a um razão auxiliar (clientes, fornecedores, ativos). Recebe os lançamentos na hora.', mod:'FI'},
 {id:'fi2', f:'Ledger líder (0L)', b:'Livro contábil da norma principal. Ledgers paralelos atendem outras normas.', mod:'FI'},
 {id:'fi3', f:'Chave de lançamento', b:'Diz se o item é débito ou crédito e que tipo de conta recebe (40/50 razão, 01/15 cliente, 31/25 fornecedor).', mod:'FI'},
 {id:'fi4', f:'Compensação', b:'Lançamento que liga um débito a um crédito correspondente e zera partidas em aberto.', mod:'FI'},
 {id:'fi5', f:'Novo Asset Accounting', b:'Obrigatório no S/4HANA: cada área de avaliação lança em tempo real no seu ledger.', mod:'FI'},
 {id:'fi6', f:'ACDOCA', b:'Universal Journal do S/4HANA: FI, CO, ativos e Material Ledger no mesmo documento.', mod:'FI/CO'}
],
CHALLENGE:{title:'Duas normas contábeis no mesmo grupo',
 ctx:'Uma empresa brasileira foi comprada por um grupo europeu. A matriz quer relatórios em IFRS todo mês; a operação local continua obrigada às normas brasileiras e ao SPED. O cliente cogita manter planilhas de ajuste.',
 q:'Qual desenho você propõe?',
 o:[{t:'Ledger líder em uma norma e ledger paralelo na outra, com lançamentos específicos por ledger.', s:3, w:'Abordagem recomendada no S/4HANA: o mesmo documento grava nos dois ledgers e diferenças entram só onde precisam.'},
    {t:'Contas paralelas no mesmo ledger, com faixas de contas por norma.', s:2, w:'Funciona e ainda é suportado, mas o plano de contas fica pesado e os relatórios exigem mais cuidado.'},
    {t:'Criar uma segunda empresa para a visão IFRS.', s:0, w:'Duplica cadastros, documentos e controles. Não é para isso que a empresa existe.'},
    {t:'Planilhas de ajuste fora do sistema.', s:1, w:'Resolve no curto prazo, mas sem rastreabilidade e com risco alto em auditoria.'}]},
TERMS:{papel:['gl','recon','ap','ar'],estrutura:['cc','coa','fyv','ledger','pc','seg'],mestres:['glacc','recon','asset','bank'],documento:['doctfi','pkey','openitem','clear'],apar:['payrun','dunning','clear'],ativos:['asset','deparea','depr'],fechamento:['postper','fxval','depr'],s4:['ledger','grp','bp']}
};
