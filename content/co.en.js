(MOD.co=MOD.co||{}).en={
name:'CO · Controlling', short:'Controlling',
lead:'The internal view of costs and results: cost centers, orders, product cost, margin and how CO uses the same data as FI to answer management questions.',
ORDER:['Product cost estimate','Standard price release','Consumption and activities on the order','Finished product receipt','Variance calculation','Settlement'],
FLOWS:{
 overhead:{name:'Overhead costs', note:'From primary posting to the plan × actual report.', steps:[
  {t:'FI · MM · HCM', b:'Primary posting', m:'expense with cost center',
   ctrl:'Every P&L account requires a cost object. The posting comes from FI, from a consumption receipt in MM or from payroll.',
   integ:'FI: same document in ACDOCA.',
   effect:'Dr Expense on the cost center / Cr offset (supplier, inventory, payroll).',
   arch:'Without the right cost object at the source, no allocation can fix the information later.'},
  {t:'KSV5 / KSU5', b:'Distribution or assessment', m:'periodic cycles',
   ctrl:'Distribution passes on primary costs keeping the original cost element. Assessment groups costs into a secondary cost element. Bases can be fixed or statistical key figures.',
   integ:'In S/4HANA, Universal Allocation apps do both.',
   effect:'Dr Receiver center / Cr Sender center (no impact on total result).',
   arch:'Assessment is easier to read; distribution keeps detail by account. Choose by what the manager needs to see.'},
  {t:'KB21N', b:'Activity allocation', m:'quantity × rate',
   ctrl:'The sender center delivers hours (activity type) to another center or order, valued at the planned rate.',
   integ:'PP and PM confirm activities on orders automatically.',
   effect:'Dr Receiver object / Cr Sender center, on a secondary cost element.',
   arch:'Well-calculated rates are the basis of product cost. A wrong rate contaminates inventory and margin.'},
  {t:'Reports', b:'Plan × actual', m:'analysis by cost center',
   ctrl:'Comparison of actual costs with plan, by cost element and cost center.',
   integ:'Planning can come from SAP Analytics Cloud.',
   effect:'No posting.',
   arch:'The report only helps if the cost center owner knows what to do with the variance.'}
 ]},
 producao:{name:'Production order', note:'From standard cost to settled variance.', steps:[
  {t:'CK11N / CK24', b:'Standard cost', m:'estimate and release',
   ctrl:'The estimate adds materials (BOM), activities (routing × rates) and overhead. Once released, it becomes the material standard price.',
   integ:'PP: BOM and routing. MM: component prices.',
   effect:'Updates the standard price; revalues stock if there is a balance.',
   arch:'Standard cost is the yardstick for all variance analysis. Revising it without criteria removes the value of the comparison.'},
  {t:'Production order', b:'Actual costs on the order', m:'consumption and confirmation',
   ctrl:'Component consumption (261) and activity confirmations debit the order; overhead is applied at closing.',
   integ:'MM and PP post directly to the order.',
   effect:'Dr Order / Cr Component inventory and Cr Cost centers.',
   arch:'The order collects the actual cost of the lot. Late confirmations distort the period.'},
  {t:'MIGO · 101', b:'Product receipt', m:'credit at standard',
   ctrl:'The finished product receipt credits the order at standard cost.',
   integ:'MM: product inventory.',
   effect:'Dr Finished goods inventory / Cr Order (at standard).',
   arch:'What remains on the order is variance or work in process.'},
  {t:'KKAX · KKS2 · KO88', b:'Order closing', m:'WIP, variances and settlement',
   ctrl:'Open orders calculate work in process; finished orders calculate variances, which are settled.',
   integ:'FI: variance goes to P&L; CO-PA can receive it by category.',
   effect:'Dr Production variance / Cr Order (or the reverse).',
   arch:'Variances by category (price, quantity, yield) tell where the plant made or lost money.'}
 ]},
 margem:{name:'Margin analysis', note:'From billing to results by customer and product.', steps:[
  {t:'VF01', b:'SD billing', m:'revenue and discounts',
   ctrl:'Billing posts revenue and discounts with market characteristics (customer, product, region, channel).',
   integ:'SD and FI.',
   effect:'Dr Customer / Cr Revenue, with profitability segment.',
   arch:'The richness of the analysis depends on the characteristics filled in the sale.'},
  {t:'Goods issue', b:'Cost of goods sold', m:'can be split by cost components',
   ctrl:'COGS from the goods issue carries the same characteristics. In S/4HANA it can be split into cost components.',
   integ:'MM and CO (standard cost).',
   effect:'Dr COGS / Cr Inventory, with profitability segment.',
   arch:'Splitting COGS shows how much of the margin is material, labor or overhead.'},
  {t:'Settlements', b:'Variances and other costs', m:'assigned to profitability',
   ctrl:'Production variances and other costs can be settled to profitability segments.',
   integ:'CO: orders and cost centers.',
   effect:'Dr Profitability segment / Cr Order or center.',
   arch:'Without assigning variances, margin looks good in the report and different in the balance sheet.'},
  {t:'Margin report', b:'Results by segment', m:'customer, product, region',
   ctrl:'Reports and analytical apps on ACDOCA, with no reconciliation to FI.',
   integ:'SAP Analytics Cloud for analysis and planning.',
   effect:'No posting.',
   arch:'Margin by customer is the question sales directors ask most. Characteristic design must start from that question.'}
 ]}
},
CHAPTERS:[
 {id:'papel', t:'The role of CO in the business', guide:'Why have internal accounting if FI already records everything?',
  body:`<p>FI answers the legal question: how much the company made or lost. CO answers management questions: <b>where</b> the cost happened (cost center), <b>what for</b> (order, project, product) and <b>with whom</b> the company makes money (margin by customer, product, region).</p>
  <p>In S/4HANA, FI and CO use the same accounting document. There is no longer reconciliation between them: CO sees the same lines with more dimensions.</p>
  <p>Areas of CO:</p>
  <ul><li>Overhead costs: cost centers and internal orders</li><li>Product cost: planning and order costing</li><li>Profitability: margin and profit center</li><li>Planning and budgeting</li></ul>`,
  arch:'Ask the controller which reports they use today to decide. CO design starts from those questions, not from the old system’s structure.',
  acts:[
   {q:'Which question is typical of CO, not FI?', o:['How much do we owe suppliers?','What is the margin by customer?','What is the cash balance?','How much tax to pay?'], a:1, w:'Margin by customer is management analysis.'},
   {q:'In S/4HANA, reconciliation between FI and CO:', o:['Is monthly','No longer exists','Is yearly','Happens in BW'], a:1, w:'The same document writes both views.'}],
  reflect:'Explain in your own words the difference between financial and management accounting.'},
 {id:'estrutura', t:'Organizational structure', guide:'How does CO organize the company to measure costs and results?',
  body:`<div class="org"><div><b>Controlling area</b><span>Groups one or more company codes for the cost view. Requires the same operating chart of accounts.</span></div><div><b>Standard hierarchy</b><span>Tree that holds all cost centers of the area.</span></div><div><b>Cost center</b><span>Unit of responsibility where cost happens: IT, maintenance, administration.</span></div><div><b>Profit center</b><span>Unit of results. In S/4HANA it lives in the ledger, with revenue, costs and balances.</span></div></div>
  <p>Besides centers, CO uses temporary <b>cost objects</b>: internal orders, WBS elements, production and maintenance orders. And the <b>profitability segment</b>, which holds the market characteristics for margin.</p>`,
  arch:'The cost center hierarchy should mirror responsibility, not the org chart. A cost center with no owner becomes an expense bin with no analysis.',
  acts:[
   {q:'What is a cost center?', o:['A unit of results','A unit of responsibility where cost happens','A material type','A company code'], a:1, w:'The profit center is the unit of results.'},
   {q:'The standard hierarchy holds:', o:['Only production centers','All cost centers of the area','Only profit centers','Assets'], a:1, w:'Every cost center belongs to it.'}],
  reflect:'Sketch the cost center hierarchy of an area you know.'},
 {id:'mestres', t:'Master data', guide:'Which master data let costs be measured and moved?',
  body:`<div class="tbl"><table><thead><tr><th>Master data</th><th>What it is for</th></tr></thead><tbody>
  <tr><td>Primary cost element</td><td>P&L G/L account that receives external costs (material, services, salaries)</td></tr>
  <tr><td>Secondary cost element</td><td>G/L account used only in internal CO movements (assessment, activities, settlement)</td></tr>
  <tr><td>Cost center</td><td>Owner, category, assigned profit center, company code</td></tr>
  <tr><td>Activity type</td><td>A center’s unit of output (machine hour, labor hour) with a planned rate</td></tr>
  <tr><td>Statistical key figure</td><td>Allocation base (number of employees, square meters, users)</td></tr>
  <tr><td>Internal order</td><td>Collects costs of an event, small project or investment</td></tr></tbody></table></div>`,
  arch:'The profit center assigned to the cost center is what carries overhead into the results view. Review that link before any migration.',
  acts:[
   {q:'A secondary cost element is used in:', o:['Supplier invoices','Internal CO movements','Payments','Tax depreciation'], a:1, w:'Assessments, activities and settlements.'},
   {q:'Number of employees as an allocation base is a:', o:['Activity type','Statistical key figure','Profit center','Ledger'], a:1, w:'It serves as the basis for cycles.'}],
  reflect:'Which statistical key figure would you use to allocate the cost of a cafeteria?'},
 {id:'fluxo', t:'Overhead cost flow', guide:'How does a cost leave the original posting and reach whoever consumed it?', widget:'flow', flowKey:'overhead',
  body:`<div class="tbl"><table><thead><tr><th>Method</th><th>How it works</th><th>Cost element</th></tr></thead><tbody>
  <tr><td>Distribution</td><td>Passes primary costs from sender to receivers</td><td>Keeps the original primary</td></tr>
  <tr><td>Assessment</td><td>Groups costs and passes them as one block</td><td>Secondary assessment element</td></tr>
  <tr><td>Activity allocation</td><td>Delivered quantity × rate</td><td>Secondary activity element</td></tr>
  <tr><td>Settlement</td><td>Empties an order to its receivers (center, asset, profitability)</td><td>Per settlement rule</td></tr></tbody></table></div>
  <p>Follow the flow below: cost is born in the primary posting and moves inside CO without changing the company’s total result.</p>`,
  arch:'Too many allocation cycles make results unreadable. Prefer few cycles, with bases the manager understands and accepts.',
  acts:[
   {q:'Which method keeps the original primary cost element?', o:['Assessment','Distribution','Settlement','Activity allocation'], a:1, w:'Assessment uses a secondary element.'},
   {q:'Activity allocation is valued at:', o:['Sales price','Quantity × rate','PO value','Depreciation'], a:1, w:'Planned rate of the activity type.'}],
  reflect:'Why don’t internal allocations change the company’s total result?'},
 {id:'produto', t:'Product cost', guide:'How much does it cost to make a product, and where does the difference to actual show up?', widget:'flow', flowKey:'producao', order:true,
  body:`<p><b>Standard cost</b> comes from an estimate that adds materials (BOM), activities (routing × rates) and overhead. When released, it becomes the material standard price.</p>
  <p>On the production order, actual costs accumulate. The product receipt credits the order at standard. What remains is <b>work in process</b> (open order) or <b>variance</b> (finished order), settled at closing.</p>
  <p>In S/4HANA the <b>Material Ledger</b> is mandatory. With actual costing active, variances are redistributed to inventory and COGS, reaching the period’s actual cost.</p>`,
  arch:'Actual costing helps companies with very volatile input costs, but increases closing effort. Recommend it when the business question calls for it.',
  acts:[
   {q:'The finished product receipt credits the order at:', o:['Actual cost','Standard cost','Sales price','Invoice value'], a:1, w:'The difference becomes variance or WIP.'},
   {q:'On a finished order, the remaining balance is treated as:', o:['Work in process','Variance','Revenue','Provision'], a:1, w:'WIP is for open orders.'}],
  reflect:'Explain to a plant manager what a quantity variance means.'},
 {id:'margem', t:'Margin analysis and profit center', guide:'With whom and with what does the company make money?', widget:'flow', flowKey:'margem',
  body:`<p><b>Margin analysis</b> (account-based CO-PA) records revenue and cost with market characteristics: customer, product, region, channel. In S/4HANA it uses ACDOCA itself, with no reconciliation to FI.</p>
  <p>The <b>profit center</b> shows results by internal unit (business line, branch). It can also have a partial balance sheet, because it lives in the ledger.</p>
  <p>Transfer prices between profit centers or company codes can be handled with parallel valuation, when the group needs legal, group and profit center views.</p>`,
  arch:'Costing-based CO-PA still exists, but the direction in S/4HANA is account-based. In migrations, map old reports before switching off.',
  acts:[
   {q:'In S/4HANA, standard margin analysis is:', o:['Costing-based','Account-based','BW only','Not available'], a:1, w:'It uses ACDOCA.'},
   {q:'The profit center in S/4HANA:', o:['Sits in a separate module','Lives in the ledger, in the same document','Exists only in CO-PA','Was removed'], a:1, w:'It used to be EC-PCA, separate.'}],
  reflect:'Which characteristics would you use for a distributor’s margin?'},
 {id:'plano', t:'Planning and budgeting', guide:'How does CO compare what was planned with what happened?',
  body:`<ul><li><b>Cost planning</b> by cost center and cost element</li><li><b>Activity planning</b> and rate calculation</li><li><b>Order and project budgets</b> with availability control: the system warns or blocks when spending exceeds the budget</li><li><b>Integrated planning</b> in SAP Analytics Cloud, SAP’s direction for planning</li></ul>
  <p>Plan × actual reports show the difference by center and cost element, and the owner explains the deviations.</p>`,
  arch:'Planning is where parallel Excel is used most. When proposing SAC, show gains in cycle time and versions, not just the tool.',
  acts:[
   {q:'Availability control is used to:', o:['Calculate rates','Warn or block spending above budget','Depreciate assets','Pay suppliers'], a:1, w:'Used on orders and projects.'},
   {q:'SAP’s direction for planning is:', o:['Spreadsheets','SAP Analytics Cloud','Old BW','Costing-based CO-PA'], a:1, w:'Integrated with S/4HANA.'}],
  reflect:'How is your area’s cost plan made today, and what would change with SAC?'},
 {id:'s4', t:'S/4HANA and limits of the standard', guide:'What changed, and where is the standard usually not enough?',
  body:`<div class="tbl"><table><thead><tr><th>Topic</th><th>ECC</th><th>S/4HANA</th></tr></thead><tbody>
  <tr><td>Cost element</td><td>Separate object (KA01)</td><td>G/L account with a type</td></tr>
  <tr><td>CO totals</td><td>COEP / COSP / COSS</td><td>ACDOCA</td></tr>
  <tr><td>Profitability</td><td>Costing-based CO-PA common</td><td>Account-based as the default</td></tr>
  <tr><td>Profit center</td><td>Separate EC-PCA</td><td>In the ledger</td></tr>
  <tr><td>Material Ledger</td><td>Optional</td><td>Mandatory</td></tr>
  <tr><td>Allocations</td><td>Classic cycle transactions</td><td>Universal Allocation in Fiori</td></tr></tbody></table></div>
  <p><b>Where the standard works well:</b> overhead, product cost, margin and profit center integrated with the ledger.</p>
  <p><b>Where it usually needs extension:</b> very specific costing models (detailed ABC), non-standard management reports and complex planning, which tends to move to SAC.</p>`,
  arch:'For the controller, the biggest change is no longer reconciling FI and CO. Use that as a value argument, but prepare the team for the new cost account logic.',
  acts:[
   {q:'In S/4HANA, a primary cost element is:', o:['A KA01 object','A G/L account','A cost center','An activity type'], a:1, w:'Created as a G/L account with a type.'},
   {q:'Allocations in S/4HANA can be done with:', o:['Universal Allocation','F110','MIRO','VF01'], a:0, w:'Fiori apps for assessment and distribution.'}],
  reflect:'Which management report from your daily work would change with ACDOCA?'}
],
THEMES:[
 {id:'org', t:'Structure and master data', qs:[
  {q:'The controlling area requires:', o:['The same operating chart of accounts','The same sales currency','The same plant','The same supplier'], a:0, w:'It groups company codes with the same chart.'},
  {q:'A profit center is a unit of:', o:['Cost responsibility','Results','Inventory','Purchasing'], a:1, w:'The cost center is the unit of responsibility.'},
  {q:'An activity type is:', o:['A balance sheet account','A center’s unit of output, with a rate','A supplier','An asset'], a:1, w:'Machine hour, labor hour.'},
  {q:'An internal order is used to:', o:['Bill customers','Collect costs of an event or investment','Pay suppliers','Plan MRP'], a:1, w:'It is settled later.'}]},
 {id:'fluxo', t:'Cost flow', qs:[
  {q:'Assessment uses a cost element that is:', o:['The original primary','Secondary','Balance sheet','Inventory'], a:1, w:'Distribution keeps the primary.'},
  {q:'The direct activity allocation transaction is:', o:['KB21N','KSU5','KO88','CK11N'], a:0, w:'KSU5 is assessment; KO88 settlement.'},
  {q:'Settlement is used to:', o:['Empty an order to its receivers','Pay a supplier','Create a cost center','Post revenue'], a:0, w:'Center, asset or profitability.'},
  {q:'Do internal allocations change the total result?', o:['Yes','No','Only at year end','Only in foreign currency'], a:1, w:'They only move cost between objects.'}]},
 {id:'produto', t:'Product cost', qs:[
  {q:'The cost estimate adds:', o:['Materials, activities and overhead','Materials only','Revenue and discount','Taxes'], a:0, w:'BOM, routing and overhead.'},
  {q:'A released estimate becomes:', o:['Sales price','Material standard price','Activity rate','Budget'], a:1, w:'CK24 releases it.'},
  {q:'An open order at period end creates:', o:['Variance','Work in process','Revenue','Depreciation'], a:1, w:'Variance is for finished orders.'},
  {q:'Material Ledger actual costing:', o:['Is mandatory','Is optional','Does not exist','ECC only'], a:1, w:'ML valuation is mandatory; actual costing is not.'}]},
 {id:'margem', t:'Margin and profit center', qs:[
  {q:'Market characteristics are kept on the:', o:['Profitability segment','Cost center','Asset','Ledger'], a:0, w:'Customer, product, region, channel.'},
  {q:'COGS in S/4HANA can be:', o:['Split by cost components','Total only','Ignored','Posted only in FI'], a:0, w:'Shows material, labor and overhead.'},
  {q:'The profit center in S/4HANA is:', o:['In the ledger','In EC-PCA','In BW','In SD'], a:0, w:'Same document.'},
  {q:'Variances not assigned to profitability make margin:', o:['Match the balance sheet','Differ from the balance sheet','Disappear','Double'], a:1, w:'Assigning variances closes the gap.'}]},
 {id:'integ', t:'Integration', qs:[
  {q:'A production order confirmation creates in CO:', o:['Activity allocation','Payment','Billing','Depreciation'], a:0, w:'Hours × rate on the order.'},
  {q:'Payroll reaches CO as:', o:['Primary cost on cost centers','Revenue','Asset','Inventory'], a:0, w:'Through payroll account assignment.'},
  {q:'Maintenance (PM) costs are:', o:['Settled to cost center or asset','Billed to the customer','Ignored','Posted in SD'], a:0, w:'The maintenance order is settled.'},
  {q:'Margin revenue comes from:', o:['SD billing','MIRO','F110','AFAB'], a:0, w:'With market characteristics.'}]},
 {id:'s4', t:'S/4HANA', qs:[
  {q:'CO totals in S/4HANA are in:', o:['ACDOCA','COSP','COEP','KNA1'], a:0, w:'Universal Journal.'},
  {q:'Default profitability analysis:', o:['Account-based','Costing-based','BW only','Spreadsheet'], a:0, w:'Costing-based still exists.'},
  {q:'A cost element is created as:', o:['A G/L account','A standalone KA01 object','A cost center','An order'], a:0, w:'With a cost type.'},
  {q:'SAP’s strategic planning tool:', o:['SAP Analytics Cloud','BPS','Excel','Costing-based CO-PA'], a:0, w:'Integrated with S/4HANA.'}]}
],
INTEG:[
 {k:'FI', n:'FI', sub:'Accounting', dir:'FI ↔ CO', step:'Every P&L posting',
  what:'Same document in ACDOCA; P&L accounts require a cost object.', varies:'Secondary cost accounts exist only for internal movements.'},
 {k:'SD', n:'SD', sub:'Sales', dir:'SD → CO', step:'Billing and goods issue',
  what:'Revenue, discounts and COGS reach margin with market characteristics.', varies:'Make-to-order carries costs to the sales order item.'},
 {k:'MM', n:'MM', sub:'Purchasing and inventory', dir:'MM → CO', step:'PO, receipt and valuation',
  what:'Commitments and actual costs on cost objects; Material Ledger and price variances.', varies:'Standard price creates variances analyzed in CO.'},
 {k:'PP', n:'PP', sub:'Production', dir:'PP ↔ CO', step:'Production order',
  what:'Standard cost comes from BOM and routing; orders collect actual cost and create variances.', varies:'Repetitive manufacturing uses a product cost collector instead of orders.'},
 {k:'PS', n:'PS', sub:'Projects', dir:'PS ↔ CO', step:'WBS element',
  what:'Budget, actual costs, results analysis and settlement per WBS element.', varies:'Investment projects settle to assets under construction.'},
 {k:'PM', n:'PM', sub:'Maintenance', dir:'PM → CO', step:'Maintenance order',
  what:'Materials and hours accumulate on the order, settled to a cost center or asset.', varies:'Capitalizable maintenance goes to assets.'},
 {k:'HCM', n:'HCM', sub:'Payroll', dir:'HCM → CO', step:'Payroll posting',
  what:'Personnel costs reach cost centers; hours can be allocated as activities.', varies:'Time recording on projects changes where cost lands.'},
 {k:'SAC', n:'SAC', sub:'Planning', dir:'SAC ↔ CO', step:'Planning and analysis',
  what:'Cost and result plans built in SAP Analytics Cloud and written to S/4HANA for plan × actual.', varies:'Customers without SAC use classic planning or spreadsheets.'}
],
CARDS:[
 {id:'co1', f:'Secondary cost element', b:'G/L account used only in internal CO movements: assessment, activities and settlement.', mod:'CO'},
 {id:'co2', f:'Assessment × distribution', b:'Assessment groups costs on a secondary element; distribution passes them keeping the original primary.', mod:'CO'},
 {id:'co3', f:'Activity type', b:'A cost center’s unit of output (machine hour, labor hour), valued at a rate.', mod:'CO'},
 {id:'co4', f:'Settlement', b:'Empties an order or project to its receivers: cost center, asset or profitability.', mod:'CO'},
 {id:'co5', f:'Account-based margin analysis', b:'CO-PA in S/4HANA: revenue and cost with market characteristics, directly in ACDOCA.', mod:'CO'},
 {id:'co6', f:'Production variance', b:'Difference between the order’s actual cost and the standard credit at product receipt.', mod:'CO/PP'}
],
CHALLENGE:{title:'IT cost charged to business units',
 ctx:'A customer wants the IT department’s cost charged every month to its four business units, in proportion to each unit’s number of users. Today the controller posts manual entries.',
 q:'Which design do you propose?',
 o:[{t:'An assessment or distribution cycle from the IT cost center, with a statistical key figure for users per unit.', s:3, w:'CO standard, run at closing. The base is updated by changing the statistical key figure.'},
    {t:'Monthly manual entries in FI.', s:1, w:'It works, but it is repetitive, error-prone and the rule is not traceable.'},
    {t:'One internal order per unit, settled manually.', s:2, w:'Possible, but heavier than the problem needs.'},
    {t:'An ABAP program that calculates and posts the allocation.', s:0, w:'Rebuilds in code what allocation cycles already do.'}]},
TERMS:{papel:['coarea','cctr','pc','ma'],estrutura:['coarea','stdh','cctr','pc','io'],mestres:['celem','acttype','skf','io'],fluxo:['assess','distr','actalloc','settle'],produto:['pce','stdpr','wip','var','ml'],margem:['ma','pc'],plano:['avc','sac'],s4:['celem','ml','ma']}
};
