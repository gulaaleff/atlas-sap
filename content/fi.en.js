(MOD.fi=MOD.fi||{}).en={
name:'FI · Financial accounting', short:'Financial accounting',
lead:'The financial reflection of everything that happens in the company: general ledger, payables and receivables, assets, closing and where FI receives work from every other module.',
ORDER:['Goods receipt','Supplier invoice','Payment proposal','Payment','Statement and clearing'],
FLOWS:{
 pagar:{name:'Accounts payable', note:'From supplier invoice to bank statement.', steps:[
  {t:'MIRO or FB60 · type RE/KR', b:'Supplier invoice', m:'open item',
   ctrl:'An invoice with a PO comes through MIRO (type RE); without a PO, directly in FI (type KR). Payment terms define due date and discount.',
   integ:'MM: check against PO and receipt. Brazil tax: incoming nota fiscal and withholdings.',
   effect:'Dr Expense or GR/IR and taxes / Cr Supplier (reconciliation account in the ledger).',
   arch:'Every invoice becomes an open item on the supplier and, at the same time, a balance in the reconciliation account of the ledger.'},
  {t:'F110 · proposal', b:'Payment proposal', m:'selection by due date',
   ctrl:'The program selects due items by company code, payment method and bank. The proposal can be edited before the run.',
   integ:'Invoices blocked in MIRO stay out of the proposal.',
   effect:'No posting: just an editable list.',
   arch:'The proposal is the treasurer’s checkpoint. Separating who proposes from who executes is a basic internal control.'},
  {t:'F110 · run · KZ', b:'Payment', m:'document and bank file',
   ctrl:'The run posts the payment, clears the supplier items and creates the payment medium.',
   integ:'Banks: payment file (in Brazil, CNAB or API).',
   effect:'Dr Supplier / Cr Bank or outgoing payments clearing account.',
   arch:'Using a clearing account until the statement shows what was sent and has not yet left the bank.'},
  {t:'FF_5 · statement', b:'Statement and clearing', m:'bank reconciliation',
   ctrl:'The electronic statement is imported and search rules clear items on the clearing account.',
   integ:'Banks: return file or statement.',
   effect:'Dr Clearing account / Cr Bank (main account).',
   arch:'Well-configured automatic reconciliation cuts closing from days to hours.'}
 ]},
 receber:{name:'Accounts receivable', note:'From invoice to receipt and collection.', steps:[
  {t:'VF01 · type RV', b:'Billing from SD', m:'customer open item',
   ctrl:'The SD billing document creates the accounting document. Payment terms come from the sales order.',
   integ:'SD: revenue account determination. Credit: customer exposure.',
   effect:'Dr Customer / Cr Revenue and taxes.',
   arch:'FI does not decide the revenue account: it comes configured from SD.'},
  {t:'Boleto · collection', b:'Collection instrument', m:'in Brazil, boleto or PIX',
   ctrl:'The payment program can also create customer collections (incoming payment method).',
   integ:'Banks: boleto registration.',
   effect:'No new posting.',
   arch:'In Brazil bank collection is part of the process; bank integration is usually CNAB or API.'},
  {t:'F-28 or statement · DZ', b:'Incoming payment', m:'clearing the item',
   ctrl:'The incoming payment clears the customer item, manually or from the statement.',
   integ:'Banks: return file.',
   effect:'Dr Bank / Cr Customer.',
   arch:'Partial payments and payments without reference are the biggest source of manual work in receivables.'},
  {t:'F150', b:'Dunning', m:'reminder letters',
   ctrl:'The dunning program selects overdue items and sends notices in levels.',
   integ:'Credit: the dunning level can block new sales.',
   effect:'May post interest, depending on configuration.',
   arch:'Define levels with the customer’s finance team; overly aggressive dunning hurts commercial relationships.'}
 ]},
 fechamento:{name:'Closing', note:'What happens at the end of each period.', steps:[
  {t:'Periodic postings', b:'Accruals and deferrals', m:'recurring and manual',
   ctrl:'Recurring entries, provisions and accruals.',
   integ:'CO: the same values appear on cost objects.',
   effect:'Dr Expense / Cr Provision (example).',
   arch:'The more that comes automatically from processes, the fewer manual adjustments at closing.'},
  {t:'AFAB', b:'Depreciation', m:'all depreciation areas',
   ctrl:'The depreciation run posts planned depreciation for assets.',
   integ:'Asset Accounting (FI-AA) and CO (asset cost center).',
   effect:'Dr Depreciation expense / Cr Accumulated depreciation.',
   arch:'In S/4HANA each depreciation area posts to its own ledger, with no later reconciliation.'},
  {t:'FAGL_FCV', b:'Foreign currency valuation', m:'open items and balances',
   ctrl:'Revalues foreign currency items at the closing rate.',
   integ:'Treasury: exchange rate table.',
   effect:'Dr/Cr Exchange rate difference against the valued account.',
   arch:'Foreign currency amounts are common with imports. Valuation needs rates loaded before closing.'},
  {t:'Close periods', b:'Lock and statements', m:'balance sheet and P&L',
   ctrl:'The period is closed for posting and statements come from financial statement versions.',
   integ:'Brazil tax: SPED ECD and ECF.',
   effect:'No new posting.',
   arch:'A closing cockpit helps orchestrate tasks, owners and dependencies across company codes.'}
 ]}
},
CHAPTERS:[
 {id:'papel', t:'The role of FI in the business', guide:'Why does FI receive postings from almost every module?',
  body:`<p>FI records the financial reflection of everything for legal purposes: balance sheet, income statement and obligations. Its core is the <b>general ledger</b>, which gives a current, central and complete view of all value-related transactions.</p>
  <p>Around it are the <b>subledgers</b>: accounts payable (suppliers), accounts receivable (customers) and fixed assets. Each subledger posting appears immediately in the general ledger through a reconciliation account.</p>
  <p>FI does not decide price (SD), inventory cost (MM) or internal cost by center (CO). It receives these values and organizes them for the external view.</p>
  <ul><li>Manual G/L postings</li><li>Accounts payable and payments</li><li>Accounts receivable, collection and dunning</li><li>Fixed assets</li><li>Banks and reconciliation</li><li>Closing and financial statements</li></ul>`,
  arch:'In projects, FI is where everything converges. A configuration error in SD or MM shows up first as an accounting difference. That is why the FI architect needs to understand the other modules.',
  acts:[
   {q:'How does a supplier posting reach the general ledger?', o:['Through a nightly interface','Through the reconciliation account, immediately','Manually at closing','Through CO'], a:1, w:'The reconciliation account keeps subledger and general ledger always equal.'},
   {q:'Which of these is an FI subledger?', o:['Cost center','Accounts receivable','Internal order','Bill of materials'], a:1, w:'Payables, receivables and assets are the subledgers.'}],
  reflect:'Explain why an error in SD account determination becomes an FI problem.'},
 {id:'estrutura', t:'Organizational structure', guide:'What is the smallest unit with its own balance sheet, and what else structures accounting?',
  body:`<div class="org"><div><b>Company code</b><span>Smallest unit with complete accounting and legal statements. Has its own currency and country.</span></div><div><b>Chart of accounts</b><span>List of accounts used day to day, assigned to the company code. In Brazil a country chart can run in parallel.</span></div><div><b>Fiscal year variant</b><span>Defines the fiscal year and periods (usually 12 plus special periods).</span></div><div><b>Ledger</b><span>Accounting book. The leading ledger (0L) follows the main standard; parallel ledgers serve other standards.</span></div></div>
  <p>For reporting by business unit, FI uses <b>profit center</b> and <b>segment</b>. In S/4HANA both live in the same accounting document.</p>`,
  arch:'The number of company codes and ledgers is a structural decision that is hard to change later. Define it with the accountant and the controller before any configuration.',
  acts:[
   {q:'What is the smallest unit with complete legal statements?', o:['Plant','Company code','Profit center','Segment'], a:1, w:'The company code.'},
   {q:'To serve IFRS and local GAAP at the same time, the standard approach uses:', o:['Two company codes','Parallel ledgers','Two fiscal year variants','Two profit centers'], a:1, w:'Leading ledger in one standard and a parallel ledger in the other.'}],
  reflect:'A group has 3 legal entities in Brazil and a parent abroad. How many company codes and ledgers would you propose?'},
 {id:'mestres', t:'Master data', guide:'Which master data support accounting postings?',
  body:`<div class="tbl"><table><thead><tr><th>Master data</th><th>What FI uses</th><th>Note</th></tr></thead><tbody>
  <tr><td>G/L account</td><td>Type (balance sheet, P&L, primary or secondary costs), currency, open item management</td><td>In S/4HANA the cost element is a G/L account</td></tr>
  <tr><td>Business Partner (customer/supplier)</td><td>Company code data: reconciliation account, payment terms and method, bank details</td><td>Same object used by SD and MM</td></tr>
  <tr><td>Fixed asset</td><td>Asset class, cost center, depreciation areas and keys</td><td>FI-AA subledger</td></tr>
  <tr><td>House banks</td><td>Banks and bank accounts used in payments and statements</td><td>Basis for the payment program</td></tr></tbody></table></div>`,
  arch:'The reconciliation account in the customer or supplier record defines which balance sheet account shows that balance. Separating domestic, foreign and related-party suppliers starts here.',
  acts:[
   {q:'Where is the supplier reconciliation account kept?', o:['Purchasing data','BP company code data','Chart of accounts','Purchase order'], a:1, w:'It is financial data, kept per company code.'},
   {q:'In S/4HANA, a cost element is:', o:['An object separate from FI','A G/L account with a cost type','A cost center','A ledger'], a:1, w:'Primary and secondary cost elements are G/L accounts.'}],
  reflect:'What criteria would you use to separate supplier reconciliation accounts?'},
 {id:'documento', t:'The accounting document', guide:'What does a posting look like inside, and why must debit always equal credit?',
  body:`<p>Every posting has a <b>header</b> (company code, date, document type, reference) and <b>line items</b>. Each item uses a <b>posting key</b>, which says whether it is debit or credit and which account type receives it. Debits and credits must net to zero.</p>
  <div class="tbl"><table><thead><tr><th>Document type</th><th>Origin</th></tr></thead><tbody>
  <tr><td class="mono">SA</td><td>Manual G/L posting</td></tr><tr><td class="mono">KR / KZ</td><td>Supplier invoice and payment in FI</td></tr><tr><td class="mono">DR / DZ</td><td>Customer invoice and payment in FI</td></tr><tr><td class="mono">RV</td><td>Billing from SD</td></tr><tr><td class="mono">WE</td><td>Goods receipt</td></tr><tr><td class="mono">RE</td><td>Invoice from MIRO</td></tr></tbody></table></div>
  <div class="tbl"><table><thead><tr><th>Key</th><th>Meaning</th></tr></thead><tbody>
  <tr><td class="mono">40 / 50</td><td>Debit / credit on a G/L account</td></tr><tr><td class="mono">01 / 15</td><td>Customer invoice / incoming payment</td></tr><tr><td class="mono">31 / 25</td><td>Supplier invoice / outgoing payment</td></tr></tbody></table></div>
  <p>In S/4HANA each item is stored in table <b>ACDOCA</b> with all dimensions together: account, cost center, profit center, segment, ledger and currencies.</p>
  <p>Accounts with <b>open item management</b> (supplier, customer, GR/IR, bank clearing) only reach zero through <b>clearing</b>: a posting that links the debit to the matching credit.</p>`,
  arch:'The document type is the best clue to origin. In an audit, filtering by type quickly shows what came from processes and what was posted by hand.',
  acts:[
   {q:'Posting key 31 stands for:', o:['Debit on a G/L account','Supplier invoice (credit)','Customer incoming payment','Supplier payment'], a:1, w:'25 is the supplier payment.'},
   {q:'What brings an open item to zero?', o:['Period closing','Clearing','Depreciation','PO reversal'], a:1, w:'Clearing links the debit to the matching credit.'}],
  reflect:'Why does the document type help in an audit?'},
 {id:'apar', t:'Payables and receivables', guide:'How does money come in and go out, and where does FI connect to banks?', widget:'flow', flowKey:'pagar', order:true,
  body:`<p>Follow the payables and receivables flows. Notice that the invoice always creates an open item and that only clearing closes it.</p>`,
  arch:'Bank automation (payments and statements) is where FI saves the most time. In Brazil, CNAB or bank APIs are in scope in almost every project.',
  acts:[
   {q:'Invoices blocked in MIRO:', o:['Are paid normally','Stay out of the payment proposal','Go to CO','Are reversed'], a:1, w:'The block prevents payment until release.'},
   {q:'The dunning program is used to:', o:['Pay suppliers','Chase customers with overdue items','Depreciate assets','Close periods'], a:1, w:'It sends notices in levels.'}],
  reflect:'Describe how a payment leaves SAP and comes back as a statement, without transaction names.'},
 {id:'ativos', t:'Fixed assets', guide:'How does an asset enter the balance sheet, lose value and leave?',
  body:`<p>FI-AA is a subledger of the general ledger. An asset’s life cycle:</p>
  <ol><li><b>Acquisition:</b> through a PO with asset account assignment (A), a direct invoice, or settlement of a project or investment order.</li><li><b>Depreciation:</b> the run calculates and posts depreciation for each <b>depreciation area</b> (book, tax, IFRS).</li><li><b>Transfer:</b> between cost centers, company codes or classes.</li><li><b>Retirement:</b> by sale or scrapping, with gain or loss.</li></ol>
  <p>In S/4HANA the <b>new Asset Accounting</b> is mandatory: each depreciation area posts in real time to its ledger, with no later reconciliation.</p>
  <p>In Brazil it is common to have book and tax depreciation in different areas, and the ICMS credit on assets (CIAP) handled by localization.</p>`,
  arch:'Asset migration is one of the most laborious parts of an S/4HANA conversion. Plan balance loads and depreciation areas early.',
  acts:[
   {q:'To have different book and tax depreciation, you use:', o:['Two company codes','Different depreciation areas','Two cost centers','Two charts of accounts'], a:1, w:'Each area calculates with its own rules.'},
   {q:'In S/4HANA, new Asset Accounting is:', o:['Optional','Mandatory','Cloud only','Removed'], a:1, w:'It posts in real time in all areas.'}],
  reflect:'List the ways an asset can be acquired in SAP.'},
 {id:'fechamento', t:'Closing and reporting', guide:'What has to happen before the month can be closed?', widget:'flow', flowKey:'fechamento',
  body:`<p>Closing is a sequence of tasks with dependencies. The main ones:</p>
  <ul><li>Open the new period and close the previous one for posting</li><li>Provisions, accruals and recurring entries</li><li>Depreciation</li><li>Foreign currency valuation</li><li>GR/IR analysis and reconciliations</li><li>Intercompany reconciliation</li><li>Statements from financial statement versions</li><li>In Brazil: SPED ECD and ECF</li></ul>
  <p>At year end, balance carryforward takes balance sheet balances into the new year and zeroes P&L accounts against retained earnings.</p>`,
  arch:'Days to close is a metric every CFO tracks. In presales, asking how many days the customer takes to close opens a conversation about automation.',
  acts:[
   {q:'Foreign currency valuation is used to:', o:['Convert the chart of accounts','Revalue foreign currency items at the closing rate','Pay suppliers abroad','Calculate depreciation'], a:1, w:'It posts exchange differences against the valued account.'},
   {q:'What does balance carryforward do with P&L accounts?', o:['Carries the balance into the new year','Zeroes them against retained earnings','Deletes them','Sends them to CO'], a:1, w:'Balance sheet accounts carry balances; P&L accounts zero out.'}],
  reflect:'Put in order the closing tasks of a company you know.'},
 {id:'s4', t:'S/4HANA and limits of the standard', guide:'What changed, and where is the standard usually not enough?',
  body:`<div class="tbl"><table><thead><tr><th>Topic</th><th>ECC</th><th>S/4HANA</th></tr></thead><tbody>
  <tr><td>Document</td><td>BKPF / BSEG and several totals tables</td><td>ACDOCA (Universal Journal); totals calculated on the fly</td></tr>
  <tr><td>Cost element</td><td>Separate CO object</td><td>G/L account with a type</td></tr>
  <tr><td>Assets</td><td>Classic Asset Accounting</td><td>New Asset Accounting mandatory</td></tr>
  <tr><td>Customer and supplier</td><td>Separate masters</td><td>Business Partner</td></tr>
  <tr><td>Consolidation</td><td>EC-CS / BCS</td><td>Group Reporting</td></tr>
  <tr><td>Banks</td><td>Classic bank account master</td><td>Bank Account Management</td></tr></tbody></table></div>
  <p><b>Where the standard works well:</b> general ledger, payables and receivables, assets, closing, multiple standards and currencies.</p>
  <p><b>Where it usually needs extension:</b> specific bank integrations, collection rules outside dunning, very particular management reports and unusual tax obligations.</p>`,
  arch:'With everything in ACDOCA, reconciliation between FI and CO no longer exists. That changes closing and is a central argument in migration projects.',
  acts:[
   {q:'In S/4HANA, accounting line items are stored in:', o:['BSEG only','ACDOCA','COEP','GLT0'], a:1, w:'BSEG still exists for open items, but ACDOCA is the basis.'},
   {q:'Consolidation in S/4HANA uses:', o:['EC-CS','Group Reporting','CO-PA','Material Ledger'], a:1, w:'It is the current consolidation solution.'}],
  reflect:'Which S/4HANA change has the biggest impact on closing, in your view?'}
],
THEMES:[
 {id:'org', t:'Structure and master data', qs:[
  {q:'The company code is:', o:['A cost center','The smallest unit with legal statements','A storage location','A ledger'], a:1, w:'It has its own currency and country.'},
  {q:'The standard leading ledger is:', o:['0L','2L','L1','00'], a:0, w:'Parallel ledgers serve other standards.'},
  {q:'The fiscal year variant defines:', o:['Currency','Fiscal year and periods','Chart of accounts','Profit center'], a:1, w:'Usually 12 periods plus special ones.'},
  {q:'A reconciliation account links:', o:['CO and FI','Subledger and general ledger','Bank and cash','Two ledgers'], a:1, w:'Keeps both always equal.'}]},
 {id:'docs', t:'Accounting document', qs:[
  {q:'Document type RV comes from:', o:['MIRO','SD billing','Goods receipt','Manual posting'], a:1, w:'RE is MIRO, WE receipt, SA manual.'},
  {q:'Posting key 40 means:', o:['G/L credit','G/L debit','Customer invoice','Payment'], a:1, w:'50 is G/L credit.'},
  {q:'The Universal Journal table is:', o:['ACDOCA','BKPF','COSP','FAGLFLEXT'], a:0, w:'One line per item with all dimensions.'},
  {q:'Open items reach zero through:', o:['Closing','Clearing','Depreciation','Dunning'], a:1, w:'Clearing links debit and credit.'}]},
 {id:'apar', t:'Payables and receivables', qs:[
  {q:'The automatic payment program is:', o:['F110','F150','FB50','AFAB'], a:0, w:'F150 is dunning.'},
  {q:'Before running payments, the treasurer reviews:', o:['The statement','The payment proposal','The balance sheet','Depreciation'], a:1, w:'Editable proposal.'},
  {q:'A customer incoming payment posts:', o:['Dr Bank / Cr Customer','Dr Customer / Cr Revenue','Dr Supplier / Cr Bank','Dr Expense / Cr Bank'], a:0, w:'And clears the customer item.'},
  {q:'Dunning is:', o:['Paying suppliers','Escalating reminders to customers','Currency valuation','Balance carryforward'], a:1, w:'Notices in levels.'}]},
 {id:'ativos', t:'Assets and closing', qs:[
  {q:'The depreciation run is:', o:['AFAB','F110','FAGL_FCV','MIRO'], a:0, w:'Posts in all depreciation areas.'},
  {q:'Different book and tax depreciation use:', o:['Two company codes','Depreciation areas','Two assets','Two classes'], a:1, w:'Each area with its own rules.'},
  {q:'Foreign currency valuation creates:', o:['Depreciation','Exchange rate differences','Provisions','Revenue'], a:1, w:'Against the valued account.'},
  {q:'In balance carryforward, P&L accounts:', o:['Carry balance','Zero out against retained earnings','Are deleted','Go to CO'], a:1, w:'Balance sheet accounts carry balance.'}]},
 {id:'integ', t:'Integration', qs:[
  {q:'The revenue account in SD billing comes from:', o:['Manual FI','SD account determination','CO','MM'], a:1, w:'Configured in SD.'},
  {q:'MIRO posts:', o:['Dr GR/IR / Cr Supplier','Dr Inventory / Cr GR/IR','Dr Bank / Cr Customer','Nothing'], a:0, w:'Goods receipt posts inventory against GR/IR.'},
  {q:'Payroll results reach FI through:', o:['HCM payroll posting','SD','CO-PA','Ariba'], a:0, w:'Salaries, social charges and accruals.'},
  {q:'SPED ECD is fed by:', o:['FI data','SD only','EWM','PM'], a:0, w:'Brazilian digital bookkeeping.'}]},
 {id:'s4', t:'S/4HANA', qs:[
  {q:'In S/4HANA, FI × CO reconciliation:', o:['Remains monthly','No longer exists','Becomes yearly','Moves to BW'], a:1, w:'Same document in ACDOCA.'},
  {q:'New Asset Accounting is:', o:['Optional','Mandatory','Removed','Cloud only'], a:1, w:'It posts in real time.'},
  {q:'Consolidation in S/4HANA:', o:['Group Reporting','EC-CS','CO-PA','FSCM'], a:0, w:'Current solution.'},
  {q:'Customer and supplier in S/4HANA are:', o:['Separate masters','Business Partner','G/L accounts','Profit centers'], a:1, w:'With different roles.'}]}
],
INTEG:[
 {k:'SD', n:'SD', sub:'Sales', dir:'SD → FI', step:'Goods issue and billing',
  what:'Goods issue: Dr COGS / Cr Inventory. Billing: Dr Customer / Cr Revenue and taxes.', varies:'Deferred revenue in contracts uses Revenue Accounting.'},
 {k:'MM', n:'MM', sub:'Purchasing', dir:'MM → FI', step:'Goods receipt and invoice verification',
  what:'Receipt: Dr Inventory / Cr GR/IR. Invoice: Dr GR/IR / Cr Supplier.', varies:'Direct consumption posts expense instead of inventory.'},
 {k:'CO', n:'CO', sub:'Controlling', dir:'FI ↔ CO', step:'Every cost or revenue posting',
  what:'In S/4HANA, FI and CO write to the same document (ACDOCA). P&L accounts require a cost object.', varies:'Internal CO allocations use secondary cost accounts.'},
 {k:'AA', n:'FI-AA', sub:'Assets', dir:'FI-AA → ledger', step:'Acquisition, depreciation and retirement',
  what:'Asset subledger, posted in real time per depreciation area.', varies:'Book, tax and IFRS areas depending on the country.'},
 {k:'HCM', n:'HCM', sub:'Payroll', dir:'HCM → FI', step:'Payroll posting',
  what:'Salaries, social charges and accruals posted to the ledger and cost centers.', varies:'Payroll may run in SAP HCM, SuccessFactors or a third-party system.'},
 {k:'BANK', n:'Banks', sub:'Payments', dir:'FI ↔ Banks', step:'Payment, collection and statement',
  what:'Payment and return files, electronic statements and automatic reconciliation.', varies:'In Brazil, CNAB or bank APIs.'},
 {k:'FISCAL', n:'Brazil tax', sub:'SPED', dir:'FI → Tax', step:'Closing and obligations',
  what:'Accounting data feeds SPED ECD and ECF; calculated taxes go to statutory obligations.', varies:'The tax reform changes tax calculation and tax accounts.'},
 {k:'GR', n:'Group Reporting', sub:'Consolidation', dir:'FI → Consolidation', step:'Group closing',
  what:'Company code balances are consolidated, with intercompany eliminations.', varies:'Groups with a single company code do not need it.'}
],
CARDS:[
 {id:'fi1', f:'Reconciliation account', b:'G/L account linked to a subledger (customers, suppliers, assets). Receives postings immediately.', mod:'FI'},
 {id:'fi2', f:'Leading ledger (0L)', b:'Accounting book for the main standard. Parallel ledgers serve other standards.', mod:'FI'},
 {id:'fi3', f:'Posting key', b:'Says whether the item is debit or credit and which account type receives it (40/50 G/L, 01/15 customer, 31/25 supplier).', mod:'FI'},
 {id:'fi4', f:'Clearing', b:'Posting that links a debit to a matching credit and zeroes open items.', mod:'FI'},
 {id:'fi5', f:'New Asset Accounting', b:'Mandatory in S/4HANA: each depreciation area posts in real time to its ledger.', mod:'FI'},
 {id:'fi6', f:'ACDOCA', b:'S/4HANA Universal Journal: FI, CO, assets and Material Ledger in the same document.', mod:'FI/CO'}
],
CHALLENGE:{title:'Two accounting standards in one group',
 ctx:'A Brazilian company was acquired by a European group. The parent wants monthly IFRS reporting; the local operation must still follow Brazilian standards and SPED. The customer is considering adjustment spreadsheets.',
 q:'Which design do you propose?',
 o:[{t:'Leading ledger in one standard and a parallel ledger in the other, with ledger-specific postings.', s:3, w:'Recommended approach in S/4HANA: the same document writes to both ledgers and differences go only where needed.'},
    {t:'Parallel accounts in the same ledger, with account ranges per standard.', s:2, w:'It works and is still supported, but the chart of accounts gets heavy and reports need more care.'},
    {t:'Create a second company code for the IFRS view.', s:0, w:'Duplicates master data, documents and controls. That is not what a company code is for.'},
    {t:'Adjustment spreadsheets outside the system.', s:1, w:'Solves it short term, but with no traceability and high audit risk.'}]},
TERMS:{papel:['gl','recon','ap','ar'],estrutura:['cc','coa','fyv','ledger','pc','seg'],mestres:['glacc','recon','asset','bank'],documento:['doctfi','pkey','openitem','clear'],apar:['payrun','dunning','clear'],ativos:['asset','deparea','depr'],fechamento:['postper','fxval','depr'],s4:['ledger','grp','bp']}
};
