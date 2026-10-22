(MOD.mm=MOD.mm||{}).pt={
name:'MM · Gestão de materiais', short:'Gestão de materiais',
lead:'Da necessidade de compra ao pagamento do fornecedor: documentos, controles, valoração de estoque e onde o MM entrega trabalho para FI, CO e logística.',
ORDER:['Requisição de compra','Pedido de compra','Entrada de mercadoria','Verificação de fatura','Pagamento'],
FLOWS:{
 padrao:{name:'Compra para estoque', note:'Material com estoque, pedido com preço do registro info.', steps:[
  {t:'ME51N · tipo NB', b:'Requisição de compra', m:'manual ou gerada pelo MRP',
   ctrl:'O tipo de documento define numeração e campos. A requisição pode nascer do MRP ou ser criada pelo solicitante, com ou sem classificação contábil.',
   integ:'PP/MRP gera requisições automaticamente. Com classificação contábil, o CO pode registrar compromisso.',
   effect:'Nenhum lançamento contábil.',
   arch:'A requisição é o pedido interno. Muitas empresas pulam essa etapa em compras recorrentes com contrato ou programa de remessa.'},
  {t:'ME21N · tipo NB', b:'Pedido de compra', m:'preço do registro info',
   ctrl:'O tipo de documento e a categoria de item definem o comportamento. Preço, condição de pagamento e incoterms vêm do registro info e do fornecedor. A aprovação usa estratégia de liberação ou workflow flexível.',
   integ:'Fornecedor recebe o pedido (impressão, EDI, Ariba). CO registra compromisso quando há classificação contábil.',
   effect:'Nenhum lançamento contábil. Pode gerar compromisso no orçamento.',
   arch:'O pedido é o documento jurídico com o fornecedor. É nele que preço e condição ficam travados para a verificação da fatura.'},
  {t:'MIGO · mov. 101', b:'Entrada de mercadoria', m:'estoque aumenta',
   ctrl:'O tipo de movimento 101 com referência ao pedido. A determinação de contas usa a classe de avaliação do material (chaves BSX e WRX).',
   integ:'QM pode abrir lote de controle; EWM executa a entrada física. Fiscal: a NF-e do fornecedor acompanha a mercadoria.',
   effect:'D Estoque / C GR/IR, pelo valor do pedido.',
   arch:'O valor da entrada é o do pedido, não o da fatura. A conta GR/IR fica aberta até a fatura chegar.'},
  {t:'MIRO', b:'Verificação de fatura', m:'pedido × entrada × fatura',
   ctrl:'Verificação em três vias: quantidade e preço da fatura contra pedido e entrada. Fora da tolerância, a fatura é bloqueada para pagamento.',
   integ:'FI: partida em aberto do fornecedor. Fiscal: impostos da nota de entrada (ICMS, IPI, PIS, COFINS).',
   effect:'D GR/IR e impostos a recuperar / C Fornecedor.',
   arch:'Faturas bloqueadas por divergência são um dos maiores gargalos de contas a pagar. Tolerâncias bem definidas evitam retrabalho.'},
  {t:'F110', b:'Pagamento', m:'programa de pagamento automático',
   ctrl:'O FI seleciona partidas vencidas por forma de pagamento e banco, gera proposta, executa e cria o arquivo bancário.',
   integ:'Bancos: arquivo de remessa e retorno (no Brasil, CNAB ou API do banco).',
   effect:'D Fornecedor / C Banco (ou conta transitória até o extrato).',
   arch:'O pagamento já é FI. O MM termina na MIRO; o processo de ponta a ponta só fecha aqui.'}
 ]},
 servico:{name:'Compra de serviço', note:'Sem estoque: o aceite do serviço substitui a entrada de mercadoria.', steps:[
  {t:'ME21N · item D', b:'Pedido de serviço', m:'linhas de serviço · classificação contábil',
   ctrl:'Categoria de item de serviço com linhas de serviço e classificação contábil obrigatória (centro de custo, ordem, projeto).',
   integ:'CO: compromisso no objeto de custo.',
   effect:'Nenhum lançamento contábil.',
   arch:'Serviço quase sempre é consumo direto. A classificação contábil decide quem paga a conta no CO.'},
  {t:'Folha de registro', b:'Aceite do serviço', m:'equivale à entrada',
   ctrl:'O responsável registra o que foi executado e aprova. O aceite gera o lançamento como se fosse uma entrada.',
   integ:'CO: custo real no objeto da classificação.',
   effect:'D Despesa (no objeto de custo) / C GR/IR.',
   arch:'Sem aceite formal, a fatura chega antes do registro e trava. O processo de aceite é tão importante quanto o pedido.'},
  {t:'MIRO', b:'Verificação de fatura', m:'contra o aceite',
   ctrl:'A fatura é conferida com o valor aceito.',
   integ:'FI e Fiscal: nota de serviço (NFS-e) e retenções (ISS, IR, PIS, COFINS, CSLL, INSS conforme o caso).',
   effect:'D GR/IR / C Fornecedor e C Retenções a recolher.',
   arch:'Retenções na fonte são um ponto sensível no Brasil. Elas dependem de serviço, município e regime do fornecedor.'}
 ]},
 subcontratacao:{name:'Subcontratação', note:'O fornecedor transforma componentes enviados pela empresa.', steps:[
  {t:'ME21N · item L', b:'Pedido de subcontratação', m:'produto final + componentes',
   ctrl:'Categoria de item L. O pedido traz o produto a receber e a lista de componentes a enviar.',
   integ:'PP: lista técnica define os componentes. MRP enxerga a necessidade de componentes no fornecedor.',
   effect:'Nenhum lançamento contábil.',
   arch:'O fornecedor cobra só o serviço. O material continua sendo da empresa até virar produto.'},
  {t:'MB1B / MIGO · mov. 541', b:'Remessa de componentes', m:'estoque com o fornecedor',
   ctrl:'Transferência para estoque especial com o fornecedor. O material continua no estoque valorado da empresa.',
   integ:'Fiscal: nota de remessa para industrialização.',
   effect:'Sem mudança de valor: só troca o tipo de estoque.',
   arch:'Controlar o estoque em terceiros é essencial para inventário e para o fiscal (remessa e retorno).'},
  {t:'MIGO · 101 + 543', b:'Entrada do produto', m:'consumo automático dos componentes',
   ctrl:'A entrada do produto (101) baixa automaticamente os componentes do estoque com o fornecedor (543).',
   integ:'CO: custo do produto inclui componentes e serviço.',
   effect:'D Estoque do produto / C Consumo dos componentes e C GR/IR do serviço.',
   arch:'Diferenças de consumo (perdas no fornecedor) precisam de ajuste. Combine a regra antes de implantar.'},
  {t:'MIRO', b:'Fatura do serviço', m:'só o valor de industrialização',
   ctrl:'A fatura cobre o serviço do fornecedor, conferida contra o pedido e a entrada.',
   integ:'FI e Fiscal: nota de retorno com a cobrança da industrialização.',
   effect:'D GR/IR / C Fornecedor.',
   arch:'No Brasil o retorno tem tratamento fiscal próprio. Valide com o fiscal do cliente.'}
 ]}
},
CHAPTERS:[
 {id:'papel', t:'O papel do MM no negócio', guide:'O que o MM resolve, e o que ele deixa para outros módulos?',
  body:`<p>O MM cobre três grandes frentes: <b>compras</b> (requisição, cotação, pedido, contratos), <b>gestão de estoque</b> (entradas, saídas, transferências, inventário) e <b>verificação de faturas</b> do fornecedor. Ele também guarda a valoração do estoque.</p>
  <p>O que ele não faz: não paga o fornecedor (FI), não planeja a produção em detalhe (PP), não executa o armazém em nível de posição e tarefa (EWM) e não emite a nota sozinho (localização Brasil).</p>
  <p>Processos que o módulo atende:</p>
  <ul><li>Compra de material para estoque</li><li>Compra para consumo direto (centro de custo, ordem, projeto)</li><li>Compra de serviços</li><li>Subcontratação (industrialização em terceiros)</li><li>Consignação de fornecedor</li><li>Transferência entre centros</li><li>Inventário físico</li></ul>`,
  arch:'Pergunte logo quanto do volume é compra direta (produtiva) e quanto é indireta, e se existe Ariba ou portal de fornecedores. Isso muda o desenho de aprovação, catálogo e integração.',
  acts:[
   {q:'Quem paga o fornecedor?', o:['O MM, na MIRO','O FI, pelo programa de pagamento','O comprador, no pedido','O EWM'], a:1, w:'A MIRO registra a fatura e cria a partida em aberto. O pagamento é FI.'},
   {q:'Qual destes NÃO é processo do MM?', o:['Inventário físico','Subcontratação','Faturamento ao cliente','Compra de serviço'], a:2, w:'Faturamento ao cliente é SD.'}],
  reflect:'Explique com suas palavras a diferença entre a MIRO registrar a fatura e o FI pagar o fornecedor.'},
 {id:'estrutura', t:'Estrutura organizacional', guide:'Quem compra, para qual centro, e onde o estoque fica?',
  body:`<div class="org"><div><b>Organização de compras</b><span>Negocia com fornecedores e responde pelas condições. Pode atender um ou vários centros.</span></div><div><b>Grupo de compras</b><span>O comprador ou a equipe responsável. Não é atribuído a outras unidades.</span></div><div><b>Centro</b><span>Onde o material é produzido, armazenado ou consumido. Ligado a uma empresa do FI.</span></div><div><b>Depósito</b><span>Subdivisão do centro onde o estoque fica fisicamente.</span></div></div>
  <p>O <b>centro</b> costuma ser o nível de valoração: o mesmo material pode ter preços diferentes em centros diferentes. A empresa do centro define em qual balanço o estoque aparece.</p>`,
  arch:'Organização de compras central ou por centro é decisão cedo no projeto: muda quem negocia, onde ficam contratos e registros info e como se mede saving.',
  acts:[
   {q:'O que fica entre o centro e o estoque físico?', o:['Depósito','Organização de compras','Grupo de compras','Empresa'], a:0, w:'O depósito subdivide o centro.'},
   {q:'O grupo de compras representa:', o:['A empresa','O comprador ou a equipe responsável','O depósito','O fornecedor'], a:1, w:'É quem conduz a compra no dia a dia.'}],
  reflect:'Uma empresa tem 5 fábricas. Você usaria uma organização de compras central ou uma por fábrica? Por quê?'},
 {id:'mestres', t:'Dados mestres', guide:'Quais cadastros fazem o pedido nascer quase pronto?',
  body:`<div class="tbl"><table><thead><tr><th>Dado mestre</th><th>O que o MM usa</th><th>Quem mais compartilha</th></tr></thead><tbody>
  <tr><td>Business Partner (fornecedor)</td><td>Dados por organização de compras: moeda, condição de pagamento, incoterms, verificação de fatura com base na entrada</td><td>FI (conta de reconciliação, forma de pagamento), Fiscal</td></tr>
  <tr><td>Material</td><td>Visões de compras, MRP e contabilidade: grupo de mercadorias, classe de avaliação, controle de preço</td><td>SD, PP, EWM, CO</td></tr>
  <tr><td>Registro info</td><td>Preço e condições do par fornecedor × material × organização de compras</td><td>—</td></tr>
  <tr><td>Lista de fontes e contratos</td><td>Fontes permitidas e contratos marco com quantidade ou valor</td><td>MRP usa para atribuir fonte</td></tr></tbody></table></div>
  <p>No pedido, endereço e condição de pagamento vêm do fornecedor; texto, unidade e grupo de mercadorias vêm do material; o preço negociado vem do registro info.</p>`,
  arch:'A classe de avaliação no material define as contas contábeis da entrada de estoque. Erro de cadastro aqui vira erro contábil silencioso.',
  acts:[
   {q:'De onde vem o preço negociado no pedido?', o:['Mestre de material','Business Partner','Registro info','Centro'], a:2, w:'O registro info guarda preço e condições por fornecedor e material.'},
   {q:'O que no material define a conta de estoque?', o:['Grupo de mercadorias','Classe de avaliação','Grupo de compras','Unidade de medida'], a:1, w:'A classe de avaliação entra na determinação de contas.'}],
  reflect:'Liste três campos do fornecedor que afetam o pagamento.'},
 {id:'anatomia', t:'Documentos e controles', guide:'O que decide o comportamento de cada documento e item de compra?',
  body:`<div class="tbl"><table><thead><tr><th>Controle</th><th>O que decide</th><th>Exemplo</th></tr></thead><tbody>
  <tr><td>Tipo de documento</td><td>Numeração, campos, tipos de item permitidos</td><td class="mono">NB</td></tr>
  <tr><td>Categoria de item</td><td>Comportamento do item: estoque, consignação, subcontratação, terceiros, transferência, serviço</td><td class="mono">(vazio), K, L, S, U, D</td></tr>
  <tr><td>Categoria de classificação contábil</td><td>Se vai para estoque ou consumo direto, e em qual objeto</td><td class="mono">K centro de custo, F ordem, P projeto, A ativo</td></tr>
  <tr><td>Tipo de movimento</td><td>O que acontece com o estoque e com a contabilidade</td><td class="mono">101, 122, 201, 261, 311, 541</td></tr>
  <tr><td>Determinação de contas</td><td>Quais contas recebem cada lançamento automático</td><td class="mono">BSX estoque, WRX GR/IR, PRD diferença de preço</td></tr></tbody></table></div>
  <div class="tbl"><table><thead><tr><th>Documento</th><th>Tabelas</th><th>Transação</th></tr></thead><tbody>
  <tr><td>Requisição de compra</td><td class="mono">EBAN</td><td class="mono">ME51N</td></tr><tr><td>Pedido de compra</td><td class="mono">EKKO / EKPO</td><td class="mono">ME21N</td></tr><tr><td>Documento de material</td><td class="mono">MATDOC</td><td class="mono">MIGO</td></tr><tr><td>Fatura do fornecedor</td><td class="mono">RBKP / RSEG</td><td class="mono">MIRO</td></tr></tbody></table></div>`,
  arch:'Compra para estoque ou para consumo é decidida pela classificação contábil. Ela muda tudo no FI e no CO, por isso merece regra clara por tipo de material.',
  acts:[
   {q:'O que define se a compra vai para estoque ou consumo direto?', o:['Tipo de documento','Categoria de classificação contábil','Grupo de compras','Organização de compras'], a:1, w:'Sem classificação, o item entra em estoque; com K, F, P ou A, vai para o objeto.'},
   {q:'Na determinação de contas, a chave BSX representa:', o:['Conta de estoque','GR/IR','Diferença de preço','Fornecedor'], a:0, w:'WRX é a GR/IR e PRD a diferença de preço.'}],
  reflect:'Explique por que o tipo de movimento funciona como o verbo do estoque.'},
 {id:'padrao', t:'Procure-to-pay, passo a passo', guide:'O que acontece, em cada módulo, da requisição ao pagamento?', widget:'flow', flowKey:'padrao', order:true,
  body:`<p>Siga o fluxo clicando em cada documento. Repare quando aparece o primeiro lançamento contábil e qual conta fica aberta esperando a fatura.</p>`,
  arch:'A GR/IR é o termômetro do processo. Saldo aberto antigo indica entrada sem fatura ou fatura sem entrada, e vira assunto de fechamento contábil.',
  acts:[
   {q:'Em que momento o estoque aumenta e a GR/IR é creditada?', o:['Na requisição','No pedido','Na entrada de mercadoria','Na MIRO'], a:2, w:'Movimento 101: D Estoque / C GR/IR.'},
   {q:'A verificação em três vias compara:', o:['Requisição, pedido e pagamento','Pedido, entrada e fatura','Fornecedor, banco e fatura','Centro, depósito e fatura'], a:1, w:'Quantidade e preço precisam bater entre os três.'}],
  reflect:'Conte a jornada de uma compra como se explicasse para alguém do financeiro, sem nomes de transação.'},
 {id:'variacoes', t:'Variações do processo', guide:'O que muda quando a compra não é para estoque?', widget:'flow', flowKey:'servico',
  body:`<div class="tbl"><table><thead><tr><th>Cenário</th><th>Categoria</th><th>Entrada</th><th>O que muda</th></tr></thead><tbody>
  <tr><td>Consumo direto</td><td class="mono">(vazio) + K/F/P</td><td>Sim</td><td>A entrada lança despesa no objeto de custo, não estoque</td></tr>
  <tr><td>Serviço</td><td class="mono">D</td><td>Aceite do serviço</td><td>Linhas de serviço; o aceite substitui a entrada</td></tr>
  <tr><td>Subcontratação</td><td class="mono">L</td><td>Sim (101 + 543)</td><td>Componentes enviados com movimento 541</td></tr>
  <tr><td>Consignação de fornecedor</td><td class="mono">K</td><td>Sim, sem valor</td><td>Dívida nasce só na retirada (411 K); liquidação periódica</td></tr>
  <tr><td>Transferência entre centros</td><td class="mono">U</td><td>Sim (641 / 101)</td><td>Pedido de transferência com remessa de saída</td></tr>
  <tr><td>Contrato e programa de remessa</td><td>—</td><td>Sim</td><td>Acordo de longo prazo; programa traz o cronograma de entregas</td></tr></tbody></table></div>
  <p>Compare compra de serviço e subcontratação no fluxo abaixo.</p>`,
  arch:'Subcontratação e consignação têm nota de remessa e retorno no Brasil. O desenho fiscal precisa andar junto com o logístico.',
  acts:[
   {q:'Na subcontratação, como os componentes vão ao fornecedor?', o:['Venda pelo SD','Movimento 541 para estoque com o fornecedor','Baixa por consumo 201','Não vão: o fornecedor compra'], a:1, w:'O material segue no estoque valorado da empresa, mas em poder do fornecedor.'},
   {q:'Na consignação de fornecedor, quando nasce a dívida?', o:['Na entrada','No pedido','Na retirada do estoque de consignação','No inventário'], a:2, w:'Até a retirada, o material é do fornecedor.'}],
  reflect:'Escolha uma empresa que você conhece e diga quais variações de compra ela usa.'},
 {id:'valoracao', t:'Valoração e verificação de fatura', guide:'Quanto vale o estoque e o que acontece quando a fatura vem diferente?',
  body:`<p>Cada material tem um <b>controle de preço</b>:</p>
  <ul><li><b>Preço padrão (S):</b> o estoque é valorado sempre pelo mesmo preço. Diferenças de fatura vão para a conta de diferença de preço (PRD).</li><li><b>Preço médio móvel (V):</b> o preço se ajusta a cada entrada. Diferenças de fatura ajustam o estoque quando ainda há saldo.</li></ul>
  <p>No S/4HANA o <b>Material Ledger</b> é obrigatório para a valoração. O custeio real, que redistribui as diferenças ao fim do período, é opcional.</p>
  <p>Na MIRO, <b>tolerâncias</b> de preço e quantidade decidem se a fatura passa ou fica bloqueada. Faturas bloqueadas são liberadas depois da análise.</p>
  <p>No Brasil, impostos recuperáveis (ICMS, IPI, PIS, COFINS, conforme o regime) saem do custo e vão para contas de impostos a recuperar.</p>`,
  arch:'Preço padrão ou médio é decisão de negócio e de controladoria. Indústria tende ao padrão, por causa da análise de variações; varejo e distribuição tendem ao médio.',
  acts:[
   {q:'Material com preço padrão: a diferença na fatura vai para:', o:['O estoque','A conta de diferença de preço','O fornecedor','A GR/IR, para sempre'], a:1, w:'Com preço padrão, o estoque não muda de valor.'},
   {q:'No S/4HANA, o Material Ledger é:', o:['Obrigatório para a valoração','Proibido','Só para nuvem pública','Só para varejo'], a:0, w:'Custeio real continua opcional.'}],
  reflect:'Para um cliente distribuidor, você recomendaria preço padrão ou médio móvel? Justifique.'},
 {id:'s4', t:'S/4HANA e limites do padrão', guide:'O que mudou e onde o padrão costuma não bastar?',
  body:`<div class="tbl"><table><thead><tr><th>Tema</th><th>ECC</th><th>S/4HANA</th></tr></thead><tbody>
  <tr><td>Fornecedor</td><td>Mestre de fornecedor (LFA1)</td><td>Business Partner obrigatório, via CVI</td></tr>
  <tr><td>Documento de material</td><td>MKPF / MSEG</td><td>Tabela única MATDOC</td></tr>
  <tr><td>Aprovação</td><td>Estratégia de liberação clássica</td><td>Workflow flexível como direção para novos cenários</td></tr>
  <tr><td>Valoração</td><td>Material Ledger opcional</td><td>Material Ledger obrigatório</td></tr>
  <tr><td>Código do material</td><td>Até 18 caracteres</td><td>Até 40 caracteres (opcional)</td></tr>
  <tr><td>Análises</td><td>LIS e relatórios ME2x</td><td>Apps analíticos Fiori sobre CDS</td></tr></tbody></table></div>
  <p><b>Onde o padrão atende bem:</b> ciclo completo de compras, estoques e valoração, integração nativa com FI, CO, PP e Fiscal.</p>
  <p><b>Onde costuma pedir extensão:</b> regras de aprovação muito específicas, portais de fornecedor fora do Ariba, cálculos fiscais incomuns na entrada, integrações com sistemas de armazém de terceiros.</p>`,
  arch:'Antes de desenvolver aprovação customizada, avalie o workflow flexível. Ele cobre aprovação por valor, grupo e centro de custo sem código no core.',
  acts:[
   {q:'Onde ficam os documentos de material no S/4HANA?', o:['MKPF / MSEG','MATDOC','EKPO','BSEG'], a:1, w:'MKPF e MSEG viram visões de compatibilidade.'},
   {q:'Para aprovação de pedidos em projetos novos, a SAP direciona para:', o:['Estratégia clássica','ABAP próprio','Workflow flexível','E-mail'], a:2, w:'A estratégia clássica ainda funciona, mas o workflow flexível é a direção.'}],
  reflect:'Pense num desenvolvimento em MM que você já viu. Ele cabia no padrão?'}
],
THEMES:[
 {id:'org', t:'Estrutura e dados mestres', qs:[
  {q:'O nível de valoração mais comum do estoque é:', o:['Empresa','Centro','Depósito','Organização de compras'], a:1, w:'O mesmo material pode ter preços diferentes por centro.'},
  {q:'Quem negocia e responde pelas condições com o fornecedor?', o:['Grupo de compras','Organização de compras','Depósito','Centro'], a:1, w:'O grupo é o comprador; a organização responde pelas condições.'},
  {q:'O preço negociado por fornecedor e material fica em:', o:['Registro info','Mestre de material','Lista de fontes','Pedido anterior'], a:0, w:'O pedido busca dele.'},
  {q:'A conta de reconciliação do fornecedor fica em:', o:['Dados de compras','Dados de empresa do BP','Registro info','Pedido'], a:1, w:'É dado financeiro, por empresa.'}]},
 {id:'docs', t:'Documentos e controles', qs:[
  {q:'A categoria de item L indica:', o:['Serviço','Subcontratação','Consignação','Terceiros'], a:1, w:'K é consignação, D serviço, S terceiros.'},
  {q:'Classificação contábil K significa:', o:['Consignação','Centro de custo','Projeto','Ativo'], a:1, w:'F ordem, P projeto, A ativo.'},
  {q:'O movimento 261 é:', o:['Entrada por pedido','Consumo para ordem','Transferência','Devolução ao fornecedor'], a:1, w:'Consumo de componentes na ordem de produção.'},
  {q:'A chave WRX na determinação de contas é:', o:['Estoque','GR/IR','Diferença de preço','Frete'], a:1, w:'Conta transitória entre entrada e fatura.'}]},
 {id:'fluxos', t:'Fluxos e variações', qs:[
  {q:'A entrada de mercadoria por pedido usa o movimento:', o:['101','201','311','601'], a:0, w:'101 com referência ao pedido.'},
  {q:'Na compra de serviço, o que substitui a entrada de mercadoria?', o:['O pedido','O aceite do serviço','A MIRO','O pagamento'], a:1, w:'O aceite gera o lançamento contra a GR/IR.'},
  {q:'Na subcontratação, o consumo dos componentes ocorre com:', o:['541','543','261','122'], a:1, w:'Automático na entrada 101 do produto.'},
  {q:'A transferência entre centros com remessa usa na saída:', o:['641','101','561','122'], a:0, w:'E 101 na entrada do centro recebedor.'}]},
 {id:'valor', t:'Valoração e fatura', qs:[
  {q:'Com preço médio móvel, a diferença de fatura:', o:['Vai sempre para PRD','Ajusta o estoque quando há saldo','É ignorada','Vai para o fornecedor'], a:1, w:'Sem saldo, vai para diferença de preço.'},
  {q:'Fatura acima da tolerância de preço fica:', o:['Lançada e paga','Bloqueada para pagamento','Excluída','Estornada'], a:1, w:'É liberada depois da análise.'},
  {q:'A entrada de mercadoria é valorada por:', o:['Valor da fatura','Valor do pedido','Preço de venda','Custo padrão do cliente'], a:1, w:'A fatura vem depois.'},
  {q:'Impostos recuperáveis na compra:', o:['Entram no custo','Vão para impostos a recuperar','Vão para o CO','São ignorados'], a:1, w:'Conforme o regime tributário.'}]},
 {id:'integ', t:'Integração', qs:[
  {q:'A entrada de mercadoria lança:', o:['D Estoque / C GR/IR','D Fornecedor / C Banco','D GR/IR / C Fornecedor','Nada'], a:0, w:'A MIRO lança GR/IR contra fornecedor.'},
  {q:'Quem gera requisições automaticamente?', o:['FI','MRP','CO-PA','SD'], a:1, w:'O planejamento de necessidades.'},
  {q:'Quem abre lote de controle no recebimento?', o:['QM','PM','FI','HCM'], a:0, w:'O material fica em controle de qualidade.'},
  {q:'O pagamento ao fornecedor é feito em:', o:['MM','FI','CO','SD'], a:1, w:'Programa de pagamento automático.'}]},
 {id:'s4', t:'S/4HANA', qs:[
  {q:'Documentos de material no S/4HANA ficam em:', o:['MATDOC','MSEG','EKBE','BKPF'], a:0, w:'Tabela única.'},
  {q:'O fornecedor no S/4HANA é mantido como:', o:['Mestre LFA1 isolado','Business Partner','Registro info','Centro'], a:1, w:'CVI sincroniza com as tabelas antigas.'},
  {q:'O Material Ledger no S/4HANA é:', o:['Opcional','Obrigatório para valoração','Removido','Só para CO'], a:1, w:'Custeio real segue opcional.'},
  {q:'O código de material pode ter até:', o:['18 caracteres','40 caracteres','10 caracteres','60 caracteres'], a:1, w:'Extensão opcional.'}]}
],
INTEG:[
 {k:'SD', n:'SD', sub:'Vendas', dir:'SD ↔ MM', step:'Ordem de venda e saída de mercadoria',
  what:'O SD consulta disponibilidade no estoque do MM e a saída de mercadoria cria documento de material 601.', varies:'Venda por terceiros (TAS) gera requisição de compra a partir da OV.'},
 {k:'PP', n:'PP', sub:'Produção', dir:'PP ↔ MM', step:'MRP, consumo e entrada da produção',
  what:'O MRP gera requisições; a ordem consome componentes (261) e dá entrada no produto (101).', varies:'Subcontratação liga PP e MM no fornecedor.'},
 {k:'QM', n:'QM', sub:'Qualidade', dir:'MM → QM → MM', step:'Entrada de mercadoria',
  what:'A entrada abre lote de controle; a decisão de utilização libera ou bloqueia o estoque.', varies:'Depende do tipo de inspeção ativo no material.'},
 {k:'EWM', n:'EWM', sub:'Armazém', dir:'MM ↔ EWM', step:'Entrada e saída física',
  what:'Em depósitos gerenciados pelo EWM, a entrada física acontece por tarefas de armazém e confirma o documento de material.', varies:'Sem EWM, a MIGO basta.'},
 {k:'FI', n:'FI', sub:'Contabilidade', dir:'MM → FI', step:'Entrada, MIRO e pagamento',
  what:'Entrada: D Estoque / C GR/IR. MIRO: D GR/IR / C Fornecedor. O pagamento é FI.', varies:'Consumo direto lança despesa em vez de estoque.'},
 {k:'CO', n:'CO', sub:'Controladoria', dir:'MM → CO', step:'Pedido e entrada com classificação',
  what:'Compromissos no pedido e custo real no objeto (centro de custo, ordem, projeto) na entrada.', varies:'Preço padrão gera variações analisadas no CO.'},
 {k:'FISCAL', n:'Fiscal BR', sub:'NF-e entrada', dir:'Fornecedor → Fiscal → MM', step:'Entrada e MIRO',
  what:'O DRC recebe a NF-e do fornecedor; a nota de entrada é criada na MIGO ou MIRO com impostos e CFOP.', varies:'Industrialização, consignação e importação têm cenários próprios.'},
 {k:'ARIBA', n:'Ariba', sub:'Sourcing', dir:'MM ↔ Ariba', step:'Cotação, contrato e pedido',
  what:'Eventos de sourcing, contratos e pedidos colaborativos com o fornecedor; o documento oficial fica no S/4HANA.', varies:'Comum em compras indiretas e empresas com muitos fornecedores.'}
],
CARDS:[
 {id:'mm1', f:'Classe de avaliação', b:'Campo do material que, com o tipo de movimento, define as contas contábeis do estoque.', mod:'MM'},
 {id:'mm2', f:'Determinação de contas (BSX, WRX, PRD)', b:'Regras que escolhem as contas dos lançamentos automáticos do MM: estoque, GR/IR e diferença de preço.', mod:'MM/FI'},
 {id:'mm3', f:'Registro info', b:'Preço e condições de um fornecedor para um material em uma organização de compras.', mod:'MM'},
 {id:'mm4', f:'Verificação em três vias', b:'Conferência de quantidade e preço entre pedido, entrada de mercadoria e fatura.', mod:'MM'},
 {id:'mm5', f:'Preço padrão × médio móvel', b:'S mantém o valor fixo e joga diferenças para PRD; V ajusta o preço a cada entrada.', mod:'MM/CO'},
 {id:'mm6', f:'Conta GR/IR', b:'Conta transitória entre entrada de mercadoria e fatura do fornecedor. Saldo aberto indica descasamento.', mod:'MM/FI'}
],
CHALLENGE:{title:'Aprovação de pedidos por valor e centro de custo',
 ctx:'Um cliente em S/4HANA quer aprovar pedidos de compra em níveis: até 10 mil pelo gestor do centro de custo, acima disso também pelo diretor. O time propõe um workflow ABAP próprio.',
 q:'Qual desenho você propõe?',
 o:[{t:'Workflow ABAP customizado com tabela Z de aprovadores.', s:0, w:'Resolve, mas cria código no core para algo que o padrão cobre e vira custo a cada upgrade.'},
    {t:'Workflow flexível de pedidos, com condições por valor e centro de custo e aprovadores por regra.', s:3, w:'Padrão do S/4HANA, configurado em apps Fiori. Atende níveis por valor e por objeto de custo.'},
    {t:'Estratégia de liberação clássica com classificação.', s:2, w:'Funciona e é conhecida, mas é a abordagem antiga; para cenário novo, o workflow flexível é a direção.'},
    {t:'Aprovação por e-mail fora do sistema.', s:1, w:'Sem rastreabilidade nem bloqueio no documento. Falha em auditoria.'}]},
TERMS:{papel:['preq','po','gr','iv'],estrutura:['porg','pgrp','plant','sloc'],mestres:['bp','pir','valcl','srcl'],anatomia:['itcat','acat','mvt','accdet'],padrao:['preq','po','gr','iv','grir','payrun'],variacoes:['subc','vcons','sto','ses'],valoracao:['stdpr','map','prdiff','ml'],s4:['bp','flexwf','ml']}
};
