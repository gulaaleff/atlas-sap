(MOD.co=MOD.co||{}).pt={
name:'CO · Controladoria', short:'Controladoria',
lead:'A visão interna dos custos e do resultado: centros de custo, ordens, custo do produto, margem e como o CO usa os mesmos dados do FI para responder perguntas de gestão.',
ORDER:['Estimativa de custo do produto','Liberação do preço padrão','Consumo e atividades na ordem','Entrada do produto acabado','Cálculo de variações','Liquidação'],
FLOWS:{
 overhead:{name:'Custos indiretos', note:'Do lançamento primário ao relatório plano × real.', steps:[
  {t:'FI · MM · HCM', b:'Lançamento primário', m:'despesa com centro de custo',
   ctrl:'Toda conta de resultado exige um objeto de custo. O lançamento chega do FI, de uma entrada de consumo no MM ou da folha.',
   integ:'FI: mesmo documento na ACDOCA.',
   effect:'D Despesa no centro de custo / C contrapartida (fornecedor, estoque, folha).',
   arch:'Sem objeto de custo correto na origem, nenhuma alocação conserta a informação depois.'},
  {t:'KSV5 / KSU5', b:'Distribuição ou rateio', m:'ciclos periódicos',
   ctrl:'Distribuição repassa custos primários mantendo a natureza original. Rateio agrupa custos numa natureza secundária. As bases podem ser fixas ou índices estatísticos.',
   integ:'No S/4HANA, apps de Universal Allocation fazem os dois.',
   effect:'D Centro recebedor / C Centro emissor (sem impacto no resultado total).',
   arch:'Rateio é mais simples de ler; distribuição preserva o detalhe por conta. Escolha conforme o que o gestor precisa enxergar.'},
  {t:'KB21N', b:'Alocação de atividades', m:'quantidade × tarifa',
   ctrl:'O centro emissor entrega horas (tipo de atividade) a outro centro ou ordem, valoradas pela tarifa planejada.',
   integ:'PP e PM confirmam atividades nas ordens automaticamente.',
   effect:'D Objeto recebedor / C Centro emissor, em natureza secundária.',
   arch:'Tarifas bem calculadas são a base do custo do produto. Tarifa errada contamina estoque e margem.'},
  {t:'Relatórios', b:'Plano × real', m:'análise por centro de custo',
   ctrl:'Comparação de custos reais com o plano, por natureza e centro de custo.',
   integ:'Planejamento pode vir do SAP Analytics Cloud.',
   effect:'Nenhum lançamento.',
   arch:'O relatório só ajuda se o responsável do centro de custo souber o que fazer com a diferença.'}
 ]},
 producao:{name:'Ordem de produção', note:'Do custo padrão à variação liquidada.', steps:[
  {t:'CK11N / CK24', b:'Custo padrão', m:'estimativa e liberação',
   ctrl:'A estimativa soma materiais (lista técnica), atividades (roteiro × tarifas) e overhead. Liberada, vira o preço padrão do material.',
   integ:'PP: lista técnica e roteiro. MM: preço dos componentes.',
   effect:'Atualiza o preço padrão; reavaliação do estoque se houver saldo.',
   arch:'O custo padrão é a régua de toda a análise de variações. Revisá-lo sem critério tira o valor da comparação.'},
  {t:'Ordem de produção', b:'Custos reais na ordem', m:'consumo e confirmação',
   ctrl:'Consumo de componentes (261) e confirmação de atividades debitam a ordem; overhead é aplicado no fechamento.',
   integ:'MM e PP lançam direto na ordem.',
   effect:'D Ordem / C Estoque de componentes e C Centros de custo.',
   arch:'A ordem acumula o custo real do lote. Confirmações atrasadas distorcem o período.'},
  {t:'MIGO · 101', b:'Entrada do produto', m:'crédito pelo padrão',
   ctrl:'A entrada do produto acabado credita a ordem pelo custo padrão.',
   integ:'MM: estoque do produto.',
   effect:'D Estoque de produto acabado / C Ordem (pelo padrão).',
   arch:'O saldo que sobra na ordem é a variação ou o estoque em elaboração.'},
  {t:'KKAX · KKS2 · KO88', b:'Fechamento da ordem', m:'WIP, variações e liquidação',
   ctrl:'Ordens abertas calculam estoque em elaboração; ordens encerradas calculam variações, que são liquidadas.',
   integ:'FI: variação vai para o resultado; CO-PA pode receber por categoria.',
   effect:'D Variação de produção / C Ordem (ou o contrário).',
   arch:'Variações por categoria (preço, quantidade, rendimento) dizem onde a fábrica ganhou ou perdeu dinheiro.'}
 ]},
 margem:{name:'Análise de margem', note:'Do faturamento ao resultado por cliente e produto.', steps:[
  {t:'VF01', b:'Fatura do SD', m:'receita e descontos',
   ctrl:'A fatura lança receita e descontos com as características de mercado (cliente, produto, região, canal).',
   integ:'SD e FI.',
   effect:'D Cliente / C Receita, com objeto de resultado.',
   arch:'A riqueza da análise depende das características preenchidas na venda.'},
  {t:'Saída de mercadoria', b:'Custo da mercadoria vendida', m:'pode ser dividido por componentes',
   ctrl:'O CMV da saída leva as mesmas características. No S/4HANA pode ser dividido em componentes de custo.',
   integ:'MM e CO (custo padrão).',
   effect:'D CMV / C Estoque, com objeto de resultado.',
   arch:'Dividir o CMV mostra quanto da margem é material, mão de obra ou overhead.'},
  {t:'Liquidações', b:'Variações e outros custos', m:'atribuídos ao resultado',
   ctrl:'Variações de produção e outros custos podem ser liquidados para segmentos de resultado.',
   integ:'CO: ordens e centros de custo.',
   effect:'D Resultado (segmento) / C Ordem ou centro.',
   arch:'Sem atribuir variações, a margem fica bonita no relatório e diferente no balanço.'},
  {t:'Relatório de margem', b:'Resultado por segmento', m:'cliente, produto, região',
   ctrl:'Relatórios e apps analíticos sobre a ACDOCA, sem reconciliação com o FI.',
   integ:'SAP Analytics Cloud para análises e planejamento.',
   effect:'Nenhum lançamento.',
   arch:'Margem por cliente é a pergunta que o diretor comercial mais faz. O desenho das características precisa nascer dessa pergunta.'}
 ]}
},
CHAPTERS:[
 {id:'papel', t:'O papel do CO no negócio', guide:'Para que serve uma contabilidade interna se o FI já registra tudo?',
  body:`<p>O FI responde à pergunta legal: quanto a empresa ganhou ou perdeu. O CO responde às perguntas de gestão: <b>onde</b> o custo aconteceu (centro de custo), <b>para quê</b> (ordem, projeto, produto) e <b>com quem</b> a empresa ganha dinheiro (margem por cliente, produto, região).</p>
  <p>No S/4HANA, FI e CO usam o mesmo documento contábil. Não existe mais conciliação entre os dois: o CO enxerga as mesmas linhas com mais dimensões.</p>
  <p>Áreas do CO:</p>
  <ul><li>Custos indiretos: centros de custo e ordens internas</li><li>Custo do produto: planejamento e apuração de ordens</li><li>Análise de resultado: margem e centro de lucro</li><li>Planejamento e orçamento</li></ul>`,
  arch:'Pergunte ao controller quais relatórios ele usa hoje para decidir. O desenho do CO nasce dessas perguntas, não da estrutura do sistema antigo.',
  acts:[
   {q:'Qual pergunta é típica do CO, e não do FI?', o:['Quanto devemos a fornecedores?','Qual a margem por cliente?','Qual o saldo de caixa?','Quanto de imposto apurar?'], a:1, w:'Margem por cliente é análise gerencial.'},
   {q:'No S/4HANA, a conciliação entre FI e CO:', o:['É mensal','Não existe mais','É anual','É feita no BW'], a:1, w:'O mesmo documento grava as duas visões.'}],
  reflect:'Explique com suas palavras a diferença entre contabilidade financeira e gerencial.'},
 {id:'estrutura', t:'Estrutura organizacional', guide:'Como o CO organiza a empresa para medir custos e resultado?',
  body:`<div class="org"><div><b>Área de contabilidade de custos</b><span>Agrupa uma ou mais empresas para a visão de custos. Exige o mesmo plano de contas operacional.</span></div><div><b>Hierarquia padrão</b><span>Árvore que contém todos os centros de custo da área.</span></div><div><b>Centro de custo</b><span>Unidade de responsabilidade onde o custo acontece: TI, manutenção, administração.</span></div><div><b>Centro de lucro</b><span>Unidade de resultado. No S/4HANA vive no razão, com receitas, custos e saldos.</span></div></div>
  <p>Além dos centros, o CO usa <b>objetos de custo</b> temporários: ordens internas, elementos PEP, ordens de produção e manutenção. E o <b>objeto de resultado</b>, que guarda as características de mercado da margem.</p>`,
  arch:'A hierarquia de centros de custo deve espelhar responsabilidade, não organograma. Centro de custo sem dono vira depósito de despesa sem análise.',
  acts:[
   {q:'O que é um centro de custo?', o:['Uma unidade de resultado','Uma unidade de responsabilidade onde o custo acontece','Um tipo de material','Uma empresa'], a:1, w:'Centro de lucro é a unidade de resultado.'},
   {q:'A hierarquia padrão contém:', o:['Só centros produtivos','Todos os centros de custo da área','Só os centros de lucro','Os ativos'], a:1, w:'Todo centro de custo pertence a ela.'}],
  reflect:'Desenhe a hierarquia de centros de custo de uma área que você conhece.'},
 {id:'mestres', t:'Dados mestres', guide:'Quais cadastros permitem que custos sejam medidos e movidos?',
  body:`<div class="tbl"><table><thead><tr><th>Dado mestre</th><th>Para que serve</th></tr></thead><tbody>
  <tr><td>Natureza de custo primária</td><td>Conta do razão de resultado que recebe custos externos (material, serviço, salário)</td></tr>
  <tr><td>Natureza de custo secundária</td><td>Conta do razão usada só em movimentos internos do CO (rateio, atividades, liquidação)</td></tr>
  <tr><td>Centro de custo</td><td>Responsável, categoria, centro de lucro atribuído, empresa</td></tr>
  <tr><td>Tipo de atividade</td><td>Unidade de entrega de um centro (hora máquina, hora pessoa) com tarifa planejada</td></tr>
  <tr><td>Índice estatístico</td><td>Base de rateio (número de funcionários, metros quadrados, usuários)</td></tr>
  <tr><td>Ordem interna</td><td>Coleta custos de um evento, projeto pequeno ou investimento</td></tr></tbody></table></div>`,
  arch:'O centro de lucro atribuído ao centro de custo é o que leva custos indiretos para a visão de resultado. Revise esse vínculo antes de qualquer migração.',
  acts:[
   {q:'Uma natureza de custo secundária é usada em:', o:['Faturas de fornecedor','Movimentos internos do CO','Pagamentos','Depreciação fiscal'], a:1, w:'Rateios, atividades e liquidações.'},
   {q:'Número de funcionários como base de rateio é um:', o:['Tipo de atividade','Índice estatístico','Centro de lucro','Ledger'], a:1, w:'Serve de base para ciclos.'}],
  reflect:'Que índice estatístico você usaria para ratear o custo de um refeitório?'},
 {id:'fluxo', t:'Fluxo dos custos indiretos', guide:'Como um custo sai do lançamento original e chega a quem o consumiu?', widget:'flow', flowKey:'overhead',
  body:`<div class="tbl"><table><thead><tr><th>Método</th><th>Como funciona</th><th>Natureza</th></tr></thead><tbody>
  <tr><td>Distribuição</td><td>Repassa custos primários do emissor para os recebedores</td><td>Mantém a primária original</td></tr>
  <tr><td>Rateio (assessment)</td><td>Agrupa custos e repassa como um bloco</td><td>Secundária de rateio</td></tr>
  <tr><td>Alocação de atividades</td><td>Quantidade entregue × tarifa</td><td>Secundária de atividade</td></tr>
  <tr><td>Liquidação</td><td>Esvazia uma ordem para seus recebedores (centro, ativo, resultado)</td><td>Conforme a regra de liquidação</td></tr></tbody></table></div>
  <p>Siga o fluxo abaixo: o custo nasce no lançamento primário e se move dentro do CO sem mudar o resultado total da empresa.</p>`,
  arch:'Ciclos de alocação demais tornam o resultado ilegível. Prefira poucos ciclos, com bases que o gestor entende e aceita.',
  acts:[
   {q:'Qual método mantém a natureza de custo primária original?', o:['Rateio','Distribuição','Liquidação','Alocação de atividades'], a:1, w:'O rateio usa natureza secundária.'},
   {q:'Alocação de atividades é valorada por:', o:['Preço de venda','Quantidade × tarifa','Valor do pedido','Depreciação'], a:1, w:'Tarifa planejada do tipo de atividade.'}],
  reflect:'Por que alocações internas não mudam o resultado total da empresa?'},
 {id:'produto', t:'Custo do produto', guide:'Quanto custa fabricar um produto, e onde aparece a diferença para o real?', widget:'flow', flowKey:'producao', order:true,
  body:`<p>O <b>custo padrão</b> é calculado por uma estimativa que soma materiais (lista técnica), atividades (roteiro × tarifas) e overhead. Ao ser liberado, vira o preço padrão do material.</p>
  <p>Na ordem de produção, os custos reais se acumulam. A entrada do produto credita a ordem pelo padrão. O que sobra é <b>estoque em elaboração</b> (ordem aberta) ou <b>variação</b> (ordem encerrada), liquidada no fechamento.</p>
  <p>No S/4HANA o <b>Material Ledger</b> é obrigatório. Com o custeio real ativo, as variações são redistribuídas para estoque e CMV, chegando ao custo real do período.</p>`,
  arch:'Custeio real ajuda empresas com custo de insumo muito volátil, mas aumenta o esforço de fechamento. Recomende quando a pergunta de negócio pedir.',
  acts:[
   {q:'A entrada do produto acabado credita a ordem por:', o:['Custo real','Custo padrão','Preço de venda','Valor da fatura'], a:1, w:'A diferença vira variação ou WIP.'},
   {q:'Em ordem encerrada, o saldo restante é tratado como:', o:['Estoque em elaboração','Variação','Receita','Provisão'], a:1, w:'WIP é para ordens abertas.'}],
  reflect:'Explique para um gerente de fábrica o que significa uma variação de quantidade.'},
 {id:'margem', t:'Análise de margem e centro de lucro', guide:'Com quem e com o quê a empresa ganha dinheiro?', widget:'flow', flowKey:'margem',
  body:`<p>A <b>análise de margem</b> (CO-PA baseado em contas) registra receitas e custos com características de mercado: cliente, produto, região, canal. No S/4HANA ela usa a própria ACDOCA, sem reconciliação com o FI.</p>
  <p>O <b>centro de lucro</b> mostra resultado por unidade interna (linha de negócio, filial). Ele também pode ter balanço parcial, porque vive no razão.</p>
  <p>Preços de transferência entre centros de lucro ou empresas podem ser tratados com avaliação paralela, quando o grupo precisa de visões legal, de grupo e de centro de lucro.</p>`,
  arch:'O CO-PA baseado em custo ainda existe, mas a direção no S/4HANA é o baseado em contas. Em migrações, mapeie relatórios antigos antes de desligar.',
  acts:[
   {q:'No S/4HANA, a análise de margem padrão é:', o:['Baseada em custo','Baseada em contas','Feita só no BW','Inexistente'], a:1, w:'Usa a ACDOCA.'},
   {q:'O centro de lucro no S/4HANA:', o:['Fica num módulo separado','Vive no razão, no mesmo documento','Só existe em CO-PA','Foi removido'], a:1, w:'Antes era EC-PCA, separado.'}],
  reflect:'Quais características você usaria para a margem de um distribuidor?'},
 {id:'plano', t:'Planejamento e orçamento', guide:'Como o CO compara o que foi planejado com o que aconteceu?',
  body:`<ul><li><b>Planejamento de custos</b> por centro de custo e natureza</li><li><b>Planejamento de atividades</b> e cálculo de tarifas</li><li><b>Orçamento de ordens e projetos</b> com controle de disponibilidade: o sistema avisa ou bloqueia quando o gasto passa do orçado</li><li><b>Planejamento integrado</b> no SAP Analytics Cloud, direção da SAP para planejamento</li></ul>
  <p>Relatórios plano × real mostram a diferença por centro e natureza, e o responsável justifica os desvios.</p>`,
  arch:'Planejamento é onde mais se usa Excel paralelo. Ao propor SAC, mostre ganho de ciclo e de versões, não só a ferramenta.',
  acts:[
   {q:'Controle de disponibilidade serve para:', o:['Calcular tarifas','Avisar ou bloquear gasto acima do orçamento','Depreciar ativos','Pagar fornecedores'], a:1, w:'Usado em ordens e projetos.'},
   {q:'A direção da SAP para planejamento é:', o:['Planilhas','SAP Analytics Cloud','BW antigo','CO-PA baseado em custo'], a:1, w:'Integrado ao S/4HANA.'}],
  reflect:'Como o plano de custos da sua área é feito hoje e o que mudaria com SAC?'},
 {id:'s4', t:'S/4HANA e limites do padrão', guide:'O que mudou e onde o padrão costuma não bastar?',
  body:`<div class="tbl"><table><thead><tr><th>Tema</th><th>ECC</th><th>S/4HANA</th></tr></thead><tbody>
  <tr><td>Natureza de custo</td><td>Objeto separado (KA01)</td><td>Conta do razão com tipo</td></tr>
  <tr><td>Totais do CO</td><td>COEP / COSP / COSS</td><td>ACDOCA</td></tr>
  <tr><td>Análise de resultado</td><td>CO-PA baseado em custo comum</td><td>Baseado em contas como padrão</td></tr>
  <tr><td>Centro de lucro</td><td>EC-PCA separado</td><td>No razão</td></tr>
  <tr><td>Material Ledger</td><td>Opcional</td><td>Obrigatório</td></tr>
  <tr><td>Alocações</td><td>Transações clássicas de ciclo</td><td>Universal Allocation em Fiori</td></tr></tbody></table></div>
  <p><b>Onde o padrão atende bem:</b> custos indiretos, custo do produto, margem e centro de lucro integrados ao razão.</p>
  <p><b>Onde costuma pedir extensão:</b> modelos de custeio muito específicos (ABC detalhado), relatórios gerenciais fora do padrão e planejamento complexo, que tende a ir para SAC.</p>`,
  arch:'Para o controller, a maior mudança é não conciliar mais FI e CO. Use isso como argumento de valor, mas prepare a equipe para a nova lógica de contas de custo.',
  acts:[
   {q:'No S/4HANA, natureza de custo primária é:', o:['Objeto KA01','Conta do razão','Centro de custo','Tipo de atividade'], a:1, w:'Criada como conta do razão com tipo.'},
   {q:'Alocações no S/4HANA podem ser feitas com:', o:['Universal Allocation','F110','MIRO','VF01'], a:0, w:'Apps Fiori para rateio e distribuição.'}],
  reflect:'Que relatório gerencial do seu dia a dia mudaria com a ACDOCA?'}
],
THEMES:[
 {id:'org', t:'Estrutura e dados mestres', qs:[
  {q:'A área de contabilidade de custos exige:', o:['Mesmo plano de contas operacional','Mesma moeda de venda','Mesmo centro','Mesmo fornecedor'], a:0, w:'Agrupa empresas com o mesmo plano.'},
  {q:'Centro de lucro é uma unidade de:', o:['Responsabilidade de custo','Resultado','Estoque','Compras'], a:1, w:'Centro de custo é de responsabilidade.'},
  {q:'Tipo de atividade é:', o:['Uma conta de balanço','Unidade de entrega de um centro, com tarifa','Um fornecedor','Um ativo'], a:1, w:'Hora máquina, hora pessoa.'},
  {q:'Ordem interna serve para:', o:['Faturar clientes','Coletar custos de um evento ou investimento','Pagar fornecedores','Planejar MRP'], a:1, w:'Depois é liquidada.'}]},
 {id:'fluxo', t:'Fluxo de custos', qs:[
  {q:'Rateio (assessment) usa natureza:', o:['Primária original','Secundária','De balanço','De estoque'], a:1, w:'Distribuição mantém a primária.'},
  {q:'A transação de alocação direta de atividades é:', o:['KB21N','KSU5','KO88','CK11N'], a:0, w:'KSU5 é rateio; KO88 liquidação.'},
  {q:'Liquidação serve para:', o:['Esvaziar uma ordem para seus recebedores','Pagar fornecedor','Criar centro de custo','Lançar receita'], a:0, w:'Centro, ativo ou resultado.'},
  {q:'Alocações internas mudam o resultado total?', o:['Sim','Não','Só no fim do ano','Só em moeda estrangeira'], a:1, w:'Só movem custo entre objetos.'}]},
 {id:'produto', t:'Custo do produto', qs:[
  {q:'A estimativa de custo soma:', o:['Materiais, atividades e overhead','Só materiais','Receita e desconto','Impostos'], a:0, w:'Lista técnica, roteiro e overhead.'},
  {q:'A estimativa liberada vira:', o:['Preço de venda','Preço padrão do material','Tarifa de atividade','Orçamento'], a:1, w:'CK24 libera.'},
  {q:'Ordem aberta no fim do período gera:', o:['Variação','Estoque em elaboração','Receita','Depreciação'], a:1, w:'Variação é para ordens encerradas.'},
  {q:'O custeio real do Material Ledger:', o:['É obrigatório','É opcional','Não existe','Só no ECC'], a:1, w:'A valoração pelo ML é obrigatória; o custeio real não.'}]},
 {id:'margem', t:'Margem e centro de lucro', qs:[
  {q:'Características de mercado ficam no:', o:['Objeto de resultado','Centro de custo','Ativo','Ledger'], a:0, w:'Cliente, produto, região, canal.'},
  {q:'O CMV no S/4HANA pode ser:', o:['Dividido por componentes de custo','Só total','Ignorado','Lançado só no FI'], a:0, w:'Mostra material, mão de obra e overhead.'},
  {q:'Centro de lucro no S/4HANA fica:', o:['No razão','No EC-PCA','No BW','No SD'], a:0, w:'Mesmo documento.'},
  {q:'Variações não atribuídas ao resultado fazem a margem:', o:['Bater com o balanço','Diferir do balanço','Sumir','Dobrar'], a:1, w:'Atribuir variações fecha a conta.'}]},
 {id:'integ', t:'Integração', qs:[
  {q:'Confirmação de ordem de produção gera no CO:', o:['Alocação de atividades','Pagamento','Fatura','Depreciação'], a:0, w:'Horas × tarifa na ordem.'},
  {q:'A folha chega ao CO como:', o:['Custo primário em centros de custo','Receita','Ativo','Estoque'], a:0, w:'Pela classificação na folha.'},
  {q:'Custos de manutenção (PM) são:', o:['Liquidados para centro de custo ou ativo','Faturados ao cliente','Ignorados','Lançados no SD'], a:0, w:'A ordem de manutenção é liquidada.'},
  {q:'A receita da margem vem de:', o:['Fatura do SD','MIRO','F110','AFAB'], a:0, w:'Com características de mercado.'}]},
 {id:'s4', t:'S/4HANA', qs:[
  {q:'Totais do CO no S/4HANA ficam em:', o:['ACDOCA','COSP','COEP','KNA1'], a:0, w:'Universal Journal.'},
  {q:'Análise de resultado padrão:', o:['Baseada em contas','Baseada em custo','Só BW','Planilha'], a:0, w:'A baseada em custo ainda existe.'},
  {q:'Natureza de custo é criada como:', o:['Conta do razão','Objeto KA01 isolado','Centro de custo','Ordem'], a:0, w:'Com tipo de custo.'},
  {q:'Planejamento estratégico da SAP:', o:['SAP Analytics Cloud','BPS','Excel','CO-PA custo'], a:0, w:'Integrado ao S/4HANA.'}]}
],
INTEG:[
 {k:'FI', n:'FI', sub:'Contabilidade', dir:'FI ↔ CO', step:'Todo lançamento de resultado',
  what:'Mesmo documento na ACDOCA; contas de resultado exigem objeto de custo.', varies:'Contas de custos secundários existem só para movimentos internos.'},
 {k:'SD', n:'SD', sub:'Vendas', dir:'SD → CO', step:'Fatura e saída de mercadoria',
  what:'Receita, descontos e CMV chegam à margem com características de mercado.', varies:'Produção sob encomenda leva custos ao item da OV.'},
 {k:'MM', n:'MM', sub:'Compras e estoque', dir:'MM → CO', step:'Pedido, entrada e valoração',
  what:'Compromissos e custos reais em objetos de custo; Material Ledger e variações de preço.', varies:'Preço padrão gera variações analisadas no CO.'},
 {k:'PP', n:'PP', sub:'Produção', dir:'PP ↔ CO', step:'Ordem de produção',
  what:'Custo padrão vem de lista técnica e roteiro; ordens acumulam custo real e geram variações.', varies:'Produção repetitiva usa coletor de custos no lugar de ordens.'},
 {k:'PS', n:'PS', sub:'Projetos', dir:'PS ↔ CO', step:'Elemento PEP',
  what:'Orçamento, custos reais, apuração de resultado e liquidação por elemento PEP.', varies:'Projetos de investimento liquidam para ativo em construção.'},
 {k:'PM', n:'PM', sub:'Manutenção', dir:'PM → CO', step:'Ordem de manutenção',
  what:'Materiais e horas acumulam na ordem, liquidada para centro de custo ou ativo.', varies:'Manutenção capitalizável vai para ativo.'},
 {k:'HCM', n:'HCM', sub:'Folha', dir:'HCM → CO', step:'Lançamento da folha',
  what:'Custos de pessoal chegam aos centros de custo; horas podem ser alocadas como atividade.', varies:'Apontamento de horas em projetos muda o destino do custo.'},
 {k:'SAC', n:'SAC', sub:'Planejamento', dir:'SAC ↔ CO', step:'Planejamento e análise',
  what:'Planos de custo e resultado feitos no SAP Analytics Cloud e gravados no S/4HANA para plano × real.', varies:'Clientes sem SAC usam planejamento clássico ou planilhas.'}
],
CARDS:[
 {id:'co1', f:'Natureza de custo secundária', b:'Conta do razão usada só em movimentos internos do CO: rateio, atividades e liquidação.', mod:'CO'},
 {id:'co2', f:'Rateio × distribuição', b:'Rateio agrupa custos em natureza secundária; distribuição repassa mantendo a primária original.', mod:'CO'},
 {id:'co3', f:'Tipo de atividade', b:'Unidade de entrega de um centro de custo (hora máquina, hora pessoa), valorada por tarifa.', mod:'CO'},
 {id:'co4', f:'Liquidação', b:'Esvazia uma ordem ou projeto para seus recebedores: centro de custo, ativo ou resultado.', mod:'CO'},
 {id:'co5', f:'Análise de margem baseada em contas', b:'CO-PA no S/4HANA: receitas e custos com características de mercado, direto na ACDOCA.', mod:'CO'},
 {id:'co6', f:'Variação de produção', b:'Diferença entre custo real da ordem e o crédito pelo padrão na entrada do produto.', mod:'CO/PP'}
],
CHALLENGE:{title:'Custo da TI repassado às unidades de negócio',
 ctx:'Um cliente quer que o custo do departamento de TI seja repassado todo mês para as quatro unidades de negócio, proporcional ao número de usuários de cada uma. Hoje o controller faz lançamentos manuais.',
 q:'Qual desenho você propõe?',
 o:[{t:'Ciclo de rateio ou distribuição a partir do centro de custo de TI, com índice estatístico de usuários por unidade.', s:3, w:'Padrão do CO, executado no fechamento. A base é atualizada mudando o índice estatístico.'},
    {t:'Lançamentos manuais mensais no FI.', s:1, w:'Funciona, mas é trabalho repetitivo, sujeito a erro e sem rastreabilidade da regra.'},
    {t:'Uma ordem interna por unidade, liquidada manualmente.', s:2, w:'Possível, mas mais pesado do que o problema pede.'},
    {t:'Programa ABAP que calcula e lança o rateio.', s:0, w:'Recria em código o que os ciclos de alocação já fazem.'}]},
TERMS:{papel:['coarea','cctr','pc','ma'],estrutura:['coarea','stdh','cctr','pc','io'],mestres:['celem','acttype','skf','io'],fluxo:['assess','distr','actalloc','settle'],produto:['pce','stdpr','wip','var','ml'],margem:['ma','pc'],plano:['avc','sac'],s4:['celem','ml','ma']}
};
