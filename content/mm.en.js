(MOD.mm=MOD.mm||{}).en={
name:'MM · Materials management', short:'Materials management',
lead:'From the purchasing need to paying the supplier: documents, controls, inventory valuation and where MM hands work to FI, CO and logistics.',
ORDER:['Purchase requisition','Purchase order','Goods receipt','Invoice verification','Payment'],
FLOWS:{
 padrao:{name:'Purchase to stock', note:'Stock material, purchase order priced from the info record.', steps:[
  {t:'ME51N · type NB', b:'Purchase requisition', m:'manual or created by MRP',
   ctrl:'The document type defines numbering and fields. The requisition can come from MRP or be entered by the requester, with or without account assignment.',
   integ:'PP/MRP creates requisitions automatically. With account assignment, CO can record a commitment.',
   effect:'No accounting entry.',
   arch:'The requisition is the internal request. Many companies skip it for recurring purchases with contracts or scheduling agreements.'},
  {t:'ME21N · type NB', b:'Purchase order', m:'price from the info record',
   ctrl:'Document type and item category define behavior. Price, payment terms and incoterms come from the info record and the supplier. Approval uses a release strategy or flexible workflow.',
   integ:'The supplier receives the order (print, EDI, Ariba). CO records a commitment when there is account assignment.',
   effect:'No accounting entry. It may create a budget commitment.',
   arch:'The purchase order is the legal document with the supplier. Price and terms are locked here for invoice verification.'},
  {t:'MIGO · mvt. 101', b:'Goods receipt', m:'inventory increases',
   ctrl:'Movement type 101 with reference to the purchase order. Account determination uses the material valuation class (keys BSX and WRX).',
   integ:'QM can open an inspection lot; EWM runs the physical receipt. Brazil tax: the supplier NF-e travels with the goods.',
   effect:'Dr Inventory / Cr GR/IR, at the purchase order value.',
   arch:'The receipt is valued at the PO price, not the invoice price. The GR/IR account stays open until the invoice arrives.'},
  {t:'MIRO', b:'Invoice verification', m:'PO × receipt × invoice',
   ctrl:'Three-way match: invoice quantity and price against the PO and the receipt. Outside tolerance, the invoice is blocked for payment.',
   integ:'FI: open item for the supplier. Brazil tax: taxes on the incoming nota fiscal (ICMS, IPI, PIS, COFINS).',
   effect:'Dr GR/IR and recoverable taxes / Cr Supplier.',
   arch:'Invoices blocked for variances are one of the biggest accounts payable bottlenecks. Well-defined tolerances avoid rework.'},
  {t:'F110', b:'Payment', m:'automatic payment program',
   ctrl:'FI selects due items by payment method and bank, builds a proposal, runs it and creates the bank file.',
   integ:'Banks: payment and return files (in Brazil, CNAB or bank APIs).',
   effect:'Dr Supplier / Cr Bank (or a clearing account until the statement).',
   arch:'Payment is already FI. MM ends at invoice verification; the end-to-end process only closes here.'}
 ]},
 servico:{name:'Service purchase', note:'No inventory: service acceptance replaces the goods receipt.', steps:[
  {t:'ME21N · item D', b:'Service purchase order', m:'service lines · account assignment',
   ctrl:'Service item category with service lines and mandatory account assignment (cost center, order, project).',
   integ:'CO: commitment on the cost object.',
   effect:'No accounting entry.',
   arch:'Services are almost always direct consumption. The account assignment decides who pays in CO.'},
  {t:'Entry sheet', b:'Service acceptance', m:'works as the receipt',
   ctrl:'The responsible person records what was performed and approves it. Acceptance posts as if it were a goods receipt.',
   integ:'CO: actual cost on the assigned object.',
   effect:'Dr Expense (on the cost object) / Cr GR/IR.',
   arch:'Without formal acceptance, the invoice arrives before the entry and gets stuck. The acceptance process matters as much as the PO.'},
  {t:'MIRO', b:'Invoice verification', m:'against the acceptance',
   ctrl:'The invoice is checked against the accepted value.',
   integ:'FI and Brazil tax: service nota fiscal (NFS-e) and withholdings (ISS, IR, PIS, COFINS, CSLL, INSS as applicable).',
   effect:'Dr GR/IR / Cr Supplier and Cr Withholding taxes payable.',
   arch:'Withholding taxes are sensitive in Brazil. They depend on the service, the municipality and the supplier’s tax regime.'}
 ]},
 subcontratacao:{name:'Subcontracting', note:'The supplier processes components provided by the company.', steps:[
  {t:'ME21N · item L', b:'Subcontracting PO', m:'end product + components',
   ctrl:'Item category L. The PO holds the product to receive and the components to provide.',
   integ:'PP: the BOM defines the components. MRP sees the component requirement at the supplier.',
   effect:'No accounting entry.',
   arch:'The supplier charges only for the service. The material still belongs to the company until it becomes the product.'},
  {t:'MB1B / MIGO · mvt. 541', b:'Component provision', m:'stock with the supplier',
   ctrl:'Transfer posting to special stock at the supplier. The material stays in the company’s valuated stock.',
   integ:'Brazil tax: shipment nota fiscal for processing by a third party.',
   effect:'No value change: only the stock type changes.',
   arch:'Controlling stock at third parties is essential for inventory and for tax (shipment and return).'},
  {t:'MIGO · 101 + 543', b:'Product receipt', m:'automatic component consumption',
   ctrl:'Receiving the product (101) automatically consumes the components from stock at the supplier (543).',
   integ:'CO: the product cost includes components and service.',
   effect:'Dr Product inventory / Cr Component consumption and Cr GR/IR for the service.',
   arch:'Consumption differences (losses at the supplier) need adjustment. Agree on the rule before go-live.'},
  {t:'MIRO', b:'Service invoice', m:'processing value only',
   ctrl:'The invoice covers the supplier’s service, checked against PO and receipt.',
   integ:'FI and Brazil tax: return nota fiscal with the processing charge.',
   effect:'Dr GR/IR / Cr Supplier.',
   arch:'In Brazil the return has its own tax treatment. Validate with the customer’s tax team.'}
 ]}
},
CHAPTERS:[
 {id:'papel', t:'The role of MM in the business', guide:'What does MM solve, and what does it leave to other modules?',
  body:`<p>MM covers three main areas: <b>purchasing</b> (requisition, quotation, purchase order, contracts), <b>inventory management</b> (receipts, issues, transfers, physical inventory) and supplier <b>invoice verification</b>. It also holds inventory valuation.</p>
  <p>What it does not do: it does not pay the supplier (FI), does not plan production in detail (PP), does not run the warehouse at bin and task level (EWM) and does not issue the nota fiscal by itself (Brazil localization).</p>
  <p>Processes the module supports:</p>
  <ul><li>Purchasing material to stock</li><li>Purchasing for direct consumption (cost center, order, project)</li><li>Purchasing services</li><li>Subcontracting</li><li>Supplier consignment</li><li>Stock transfer between plants</li><li>Physical inventory</li></ul>`,
  arch:'Ask early how much volume is direct (production) versus indirect purchasing, and whether Ariba or a supplier portal exists. That changes approval, catalog and integration design.',
  acts:[
   {q:'Who pays the supplier?', o:['MM, in invoice verification','FI, through the payment program','The buyer, in the PO','EWM'], a:1, w:'Invoice verification records the invoice and creates the open item. Payment is FI.'},
   {q:'Which of these is NOT an MM process?', o:['Physical inventory','Subcontracting','Customer billing','Service purchasing'], a:2, w:'Customer billing is SD.'}],
  reflect:'Explain in your own words the difference between invoice verification recording the invoice and FI paying the supplier.'},
 {id:'estrutura', t:'Organizational structure', guide:'Who buys, for which plant, and where is the stock kept?',
  body:`<div class="org"><div><b>Purchasing organization</b><span>Negotiates with suppliers and is responsible for the terms. Can serve one or several plants.</span></div><div><b>Purchasing group</b><span>The buyer or team responsible. Not assigned to other units.</span></div><div><b>Plant</b><span>Where material is produced, stored or consumed. Assigned to a company code in FI.</span></div><div><b>Storage location</b><span>Subdivision of the plant where stock is physically kept.</span></div></div>
  <p>The <b>plant</b> is usually the valuation level: the same material can have different prices in different plants. The plant’s company code defines which balance sheet the stock appears in.</p>`,
  arch:'Central or plant-level purchasing organizations is an early project decision: it changes who negotiates, where contracts and info records live and how savings are measured.',
  acts:[
   {q:'What sits between the plant and the physical stock?', o:['Storage location','Purchasing organization','Purchasing group','Company code'], a:0, w:'The storage location subdivides the plant.'},
   {q:'The purchasing group represents:', o:['The company code','The buyer or responsible team','The storage location','The supplier'], a:1, w:'It runs the purchase day to day.'}],
  reflect:'A company has 5 plants. Would you use one central purchasing organization or one per plant? Why?'},
 {id:'mestres', t:'Master data', guide:'Which master data make the PO almost fill itself?',
  body:`<div class="tbl"><table><thead><tr><th>Master data</th><th>What MM uses</th><th>Who else shares it</th></tr></thead><tbody>
  <tr><td>Business Partner (supplier)</td><td>Purchasing organization data: currency, payment terms, incoterms, GR-based invoice verification</td><td>FI (reconciliation account, payment method), Brazil tax</td></tr>
  <tr><td>Material</td><td>Purchasing, MRP and accounting views: material group, valuation class, price control</td><td>SD, PP, EWM, CO</td></tr>
  <tr><td>Purchasing info record</td><td>Price and terms for supplier × material × purchasing organization</td><td>—</td></tr>
  <tr><td>Source list and contracts</td><td>Allowed sources and outline agreements with quantity or value</td><td>MRP uses them to assign sources</td></tr></tbody></table></div>
  <p>In the PO, address and payment terms come from the supplier; text, unit and material group come from the material; the negotiated price comes from the info record.</p>`,
  arch:'The valuation class on the material defines the G/L accounts of a stock receipt. A master data error here becomes a silent accounting error.',
  acts:[
   {q:'Where does the negotiated price in the PO come from?', o:['Material master','Business Partner','Purchasing info record','Plant'], a:2, w:'The info record holds price and terms per supplier and material.'},
   {q:'What on the material defines the inventory account?', o:['Material group','Valuation class','Purchasing group','Unit of measure'], a:1, w:'The valuation class is part of account determination.'}],
  reflect:'List three supplier fields that affect payment.'},
 {id:'anatomia', t:'Documents and controls', guide:'What decides the behavior of each purchasing document and item?',
  body:`<div class="tbl"><table><thead><tr><th>Control</th><th>What it decides</th><th>Example</th></tr></thead><tbody>
  <tr><td>Document type</td><td>Numbering, fields, allowed item categories</td><td class="mono">NB</td></tr>
  <tr><td>Item category</td><td>Item behavior: stock, consignment, subcontracting, third party, stock transfer, service</td><td class="mono">(blank), K, L, S, U, D</td></tr>
  <tr><td>Account assignment category</td><td>Whether it goes to stock or direct consumption, and on which object</td><td class="mono">K cost center, F order, P project, A asset</td></tr>
  <tr><td>Movement type</td><td>What happens to stock and accounting</td><td class="mono">101, 122, 201, 261, 311, 541</td></tr>
  <tr><td>Account determination</td><td>Which accounts receive each automatic posting</td><td class="mono">BSX inventory, WRX GR/IR, PRD price difference</td></tr></tbody></table></div>
  <div class="tbl"><table><thead><tr><th>Document</th><th>Tables</th><th>Transaction</th></tr></thead><tbody>
  <tr><td>Purchase requisition</td><td class="mono">EBAN</td><td class="mono">ME51N</td></tr><tr><td>Purchase order</td><td class="mono">EKKO / EKPO</td><td class="mono">ME21N</td></tr><tr><td>Material document</td><td class="mono">MATDOC</td><td class="mono">MIGO</td></tr><tr><td>Supplier invoice</td><td class="mono">RBKP / RSEG</td><td class="mono">MIRO</td></tr></tbody></table></div>`,
  arch:'Stock versus consumption purchasing is decided by the account assignment. It changes everything in FI and CO, so it deserves a clear rule per material type.',
  acts:[
   {q:'What decides whether a purchase goes to stock or direct consumption?', o:['Document type','Account assignment category','Purchasing group','Purchasing organization'], a:1, w:'With no account assignment, the item goes to stock; with K, F, P or A, it goes to the object.'},
   {q:'In account determination, key BSX stands for:', o:['Inventory account','GR/IR','Price difference','Supplier'], a:0, w:'WRX is GR/IR and PRD is price difference.'}],
  reflect:'Explain why the movement type works as the verb of inventory.'},
 {id:'padrao', t:'Procure-to-pay, step by step', guide:'What happens, in each module, from requisition to payment?', widget:'flow', flowKey:'padrao', order:true,
  body:`<p>Follow the flow by clicking each document. Notice when the first accounting entry appears and which account stays open waiting for the invoice.</p>`,
  arch:'GR/IR is the thermometer of the process. An old open balance means a receipt without invoice or an invoice without receipt, and becomes a closing issue.',
  acts:[
   {q:'When does inventory increase and GR/IR get credited?', o:['At the requisition','At the PO','At goods receipt','At invoice verification'], a:2, w:'Movement 101: Dr Inventory / Cr GR/IR.'},
   {q:'The three-way match compares:', o:['Requisition, PO and payment','PO, goods receipt and invoice','Supplier, bank and invoice','Plant, storage location and invoice'], a:1, w:'Quantity and price must match across the three.'}],
  reflect:'Tell the story of a purchase as if explaining it to someone in finance, without transaction names.'},
 {id:'variacoes', t:'Process variants', guide:'What changes when the purchase is not to stock?', widget:'flow', flowKey:'servico',
  body:`<div class="tbl"><table><thead><tr><th>Scenario</th><th>Category</th><th>Receipt</th><th>What changes</th></tr></thead><tbody>
  <tr><td>Direct consumption</td><td class="mono">(blank) + K/F/P</td><td>Yes</td><td>The receipt posts expense on the cost object, not inventory</td></tr>
  <tr><td>Service</td><td class="mono">D</td><td>Service acceptance</td><td>Service lines; acceptance replaces the receipt</td></tr>
  <tr><td>Subcontracting</td><td class="mono">L</td><td>Yes (101 + 543)</td><td>Components provided with movement 541</td></tr>
  <tr><td>Supplier consignment</td><td class="mono">K</td><td>Yes, no value</td><td>Liability arises only at withdrawal (411 K); periodic settlement</td></tr>
  <tr><td>Stock transfer between plants</td><td class="mono">U</td><td>Yes (641 / 101)</td><td>Stock transport order with outbound delivery</td></tr>
  <tr><td>Contract and scheduling agreement</td><td>—</td><td>Yes</td><td>Long-term agreement; the scheduling agreement holds the delivery schedule</td></tr></tbody></table></div>
  <p>Compare service purchasing and subcontracting in the flow below.</p>`,
  arch:'Subcontracting and consignment have shipment and return notas fiscais in Brazil. The tax design must move together with the logistics design.',
  acts:[
   {q:'In subcontracting, how do components reach the supplier?', o:['Sold through SD','Movement 541 to stock with the supplier','Consumption 201','They don’t: the supplier buys them'], a:1, w:'The material stays in the company’s valuated stock, held by the supplier.'},
   {q:'In supplier consignment, when does the liability arise?', o:['At receipt','At the PO','At withdrawal from consignment stock','At physical inventory'], a:2, w:'Until withdrawal, the material belongs to the supplier.'}],
  reflect:'Pick a company you know and say which purchasing variants it uses.'},
 {id:'valoracao', t:'Valuation and invoice verification', guide:'What is the stock worth, and what happens when the invoice differs?',
  body:`<p>Each material has a <b>price control</b>:</p>
  <ul><li><b>Standard price (S):</b> stock is always valued at the same price. Invoice differences go to the price difference account (PRD).</li><li><b>Moving average price (V):</b> the price adjusts with each receipt. Invoice differences adjust inventory while stock remains.</li></ul>
  <p>In S/4HANA the <b>Material Ledger</b> is mandatory for valuation. Actual costing, which redistributes differences at period end, is optional.</p>
  <p>In invoice verification, price and quantity <b>tolerances</b> decide whether the invoice passes or is blocked. Blocked invoices are released after review.</p>
  <p>In Brazil, recoverable taxes (ICMS, IPI, PIS, COFINS, depending on the regime) leave the cost and go to recoverable tax accounts.</p>`,
  arch:'Standard or moving average is a business and controlling decision. Manufacturing tends toward standard, for variance analysis; retail and distribution toward moving average.',
  acts:[
   {q:'Standard-price material: the invoice difference goes to:', o:['Inventory','The price difference account','The supplier','GR/IR, forever'], a:1, w:'With standard price, stock value does not change.'},
   {q:'In S/4HANA, the Material Ledger is:', o:['Mandatory for valuation','Forbidden','Public cloud only','Retail only'], a:0, w:'Actual costing remains optional.'}],
  reflect:'For a distributor customer, would you recommend standard or moving average price? Justify.'},
 {id:'s4', t:'S/4HANA and limits of the standard', guide:'What changed, and where is the standard usually not enough?',
  body:`<div class="tbl"><table><thead><tr><th>Topic</th><th>ECC</th><th>S/4HANA</th></tr></thead><tbody>
  <tr><td>Supplier</td><td>Vendor master (LFA1)</td><td>Business Partner mandatory, via CVI</td></tr>
  <tr><td>Material document</td><td>MKPF / MSEG</td><td>Single table MATDOC</td></tr>
  <tr><td>Approval</td><td>Classic release strategy</td><td>Flexible workflow as the direction for new scenarios</td></tr>
  <tr><td>Valuation</td><td>Material Ledger optional</td><td>Material Ledger mandatory</td></tr>
  <tr><td>Material number</td><td>Up to 18 characters</td><td>Up to 40 characters (optional)</td></tr>
  <tr><td>Analytics</td><td>LIS and ME2x reports</td><td>Fiori analytical apps on CDS</td></tr></tbody></table></div>
  <p><b>Where the standard works well:</b> full purchasing, inventory and valuation cycle, native integration with FI, CO, PP and Brazil tax.</p>
  <p><b>Where it usually needs extension:</b> very specific approval rules, supplier portals outside Ariba, unusual tax calculations at receipt, integration with third-party warehouse systems.</p>`,
  arch:'Before developing custom approval, evaluate flexible workflow. It covers approval by value, group and cost center without code in the core.',
  acts:[
   {q:'Where are material documents stored in S/4HANA?', o:['MKPF / MSEG','MATDOC','EKPO','BSEG'], a:1, w:'MKPF and MSEG become compatibility views.'},
   {q:'For PO approval in new projects, SAP points to:', o:['Classic release strategy','Custom ABAP','Flexible workflow','E-mail'], a:2, w:'The classic strategy still works, but flexible workflow is the direction.'}],
  reflect:'Think of an MM development you have seen. Did it fit the standard?'}
],
THEMES:[
 {id:'org', t:'Structure and master data', qs:[
  {q:'The most common inventory valuation level is:', o:['Company code','Plant','Storage location','Purchasing organization'], a:1, w:'The same material can have different prices per plant.'},
  {q:'Who negotiates and is responsible for supplier terms?', o:['Purchasing group','Purchasing organization','Storage location','Plant'], a:1, w:'The group is the buyer; the organization owns the terms.'},
  {q:'The negotiated price per supplier and material is kept in:', o:['Purchasing info record','Material master','Source list','Previous PO'], a:0, w:'The PO reads it.'},
  {q:'The supplier reconciliation account is kept in:', o:['Purchasing data','BP company code data','Info record','PO'], a:1, w:'It is financial data, per company code.'}]},
 {id:'docs', t:'Documents and controls', qs:[
  {q:'Item category L means:', o:['Service','Subcontracting','Consignment','Third party'], a:1, w:'K is consignment, D service, S third party.'},
  {q:'Account assignment K means:', o:['Consignment','Cost center','Project','Asset'], a:1, w:'F order, P project, A asset.'},
  {q:'Movement 261 is:', o:['Receipt for PO','Consumption for order','Transfer','Return to supplier'], a:1, w:'Component consumption on the production order.'},
  {q:'Key WRX in account determination is:', o:['Inventory','GR/IR','Price difference','Freight'], a:1, w:'Clearing account between receipt and invoice.'}]},
 {id:'fluxos', t:'Flows and variants', qs:[
  {q:'Goods receipt for a PO uses movement:', o:['101','201','311','601'], a:0, w:'101 with reference to the PO.'},
  {q:'In service purchasing, what replaces the goods receipt?', o:['The PO','Service acceptance','Invoice verification','Payment'], a:1, w:'Acceptance posts against GR/IR.'},
  {q:'In subcontracting, component consumption happens with:', o:['541','543','261','122'], a:1, w:'Automatic at product receipt 101.'},
  {q:'A stock transfer with delivery uses at goods issue:', o:['641','101','561','122'], a:0, w:'And 101 at receipt in the receiving plant.'}]},
 {id:'valor', t:'Valuation and invoice', qs:[
  {q:'With moving average price, an invoice difference:', o:['Always goes to PRD','Adjusts inventory while stock remains','Is ignored','Goes to the supplier'], a:1, w:'With no stock, it goes to price difference.'},
  {q:'An invoice above price tolerance is:', o:['Posted and paid','Blocked for payment','Deleted','Reversed'], a:1, w:'It is released after review.'},
  {q:'Goods receipt is valued at:', o:['Invoice value','PO value','Sales price','Customer standard cost'], a:1, w:'The invoice comes later.'},
  {q:'Recoverable taxes on purchases:', o:['Go into cost','Go to recoverable tax accounts','Go to CO','Are ignored'], a:1, w:'Depending on the tax regime.'}]},
 {id:'integ', t:'Integration', qs:[
  {q:'Goods receipt posts:', o:['Dr Inventory / Cr GR/IR','Dr Supplier / Cr Bank','Dr GR/IR / Cr Supplier','Nothing'], a:0, w:'Invoice verification posts GR/IR against supplier.'},
  {q:'Who creates requisitions automatically?', o:['FI','MRP','CO-PA','SD'], a:1, w:'Material requirements planning.'},
  {q:'Who opens an inspection lot at receipt?', o:['QM','PM','FI','HCM'], a:0, w:'The material goes to quality inspection stock.'},
  {q:'Supplier payment happens in:', o:['MM','FI','CO','SD'], a:1, w:'Automatic payment program.'}]},
 {id:'s4', t:'S/4HANA', qs:[
  {q:'Material documents in S/4HANA are stored in:', o:['MATDOC','MSEG','EKBE','BKPF'], a:0, w:'Single table.'},
  {q:'The supplier in S/4HANA is kept as:', o:['Standalone LFA1 master','Business Partner','Info record','Plant'], a:1, w:'CVI synchronizes with the old tables.'},
  {q:'The Material Ledger in S/4HANA is:', o:['Optional','Mandatory for valuation','Removed','CO only'], a:1, w:'Actual costing remains optional.'},
  {q:'The material number can have up to:', o:['18 characters','40 characters','10 characters','60 characters'], a:1, w:'Optional extension.'}]}
],
INTEG:[
 {k:'SD', n:'SD', sub:'Sales', dir:'SD ↔ MM', step:'Sales order and goods issue',
  what:'SD checks availability in MM stock and the goods issue creates a 601 material document.', varies:'Third-party sales (TAS) create a purchase requisition from the sales order.'},
 {k:'PP', n:'PP', sub:'Production', dir:'PP ↔ MM', step:'MRP, consumption and production receipt',
  what:'MRP creates requisitions; the order consumes components (261) and receives the product (101).', varies:'Subcontracting links PP and MM at the supplier.'},
 {k:'QM', n:'QM', sub:'Quality', dir:'MM → QM → MM', step:'Goods receipt',
  what:'The receipt opens an inspection lot; the usage decision releases or blocks the stock.', varies:'Depends on the inspection type active on the material.'},
 {k:'EWM', n:'EWM', sub:'Warehouse', dir:'MM ↔ EWM', step:'Physical receipt and issue',
  what:'In EWM-managed warehouses, physical receipt happens through warehouse tasks and confirms the material document.', varies:'Without EWM, MIGO is enough.'},
 {k:'FI', n:'FI', sub:'Accounting', dir:'MM → FI', step:'Receipt, invoice verification and payment',
  what:'Receipt: Dr Inventory / Cr GR/IR. Invoice: Dr GR/IR / Cr Supplier. Payment is FI.', varies:'Direct consumption posts expense instead of inventory.'},
 {k:'CO', n:'CO', sub:'Controlling', dir:'MM → CO', step:'PO and receipt with account assignment',
  what:'Commitments at the PO and actual cost on the object (cost center, order, project) at receipt.', varies:'Standard price creates variances analyzed in CO.'},
 {k:'FISCAL', n:'Brazil tax', sub:'Incoming NF-e', dir:'Supplier → Tax → MM', step:'Receipt and invoice verification',
  what:'DRC receives the supplier NF-e; the incoming nota fiscal is created in MIGO or MIRO with taxes and CFOP.', varies:'Processing by third parties, consignment and imports have their own scenarios.'},
 {k:'ARIBA', n:'Ariba', sub:'Sourcing', dir:'MM ↔ Ariba', step:'Quote, contract and PO',
  what:'Sourcing events, contracts and collaborative POs with the supplier; the official document stays in S/4HANA.', varies:'Common in indirect purchasing and companies with many suppliers.'}
],
CARDS:[
 {id:'mm1', f:'Valuation class', b:'Material field that, with the movement type, defines the inventory G/L accounts.', mod:'MM'},
 {id:'mm2', f:'Account determination (BSX, WRX, PRD)', b:'Rules that pick the accounts for MM automatic postings: inventory, GR/IR and price difference.', mod:'MM/FI'},
 {id:'mm3', f:'Purchasing info record', b:'Price and terms of a supplier for a material in a purchasing organization.', mod:'MM'},
 {id:'mm4', f:'Three-way match', b:'Check of quantity and price between purchase order, goods receipt and invoice.', mod:'MM'},
 {id:'mm5', f:'Standard × moving average price', b:'S keeps a fixed value and sends differences to PRD; V adjusts the price with each receipt.', mod:'MM/CO'},
 {id:'mm6', f:'GR/IR account', b:'Clearing account between goods receipt and supplier invoice. An open balance signals a mismatch.', mod:'MM/FI'}
],
CHALLENGE:{title:'PO approval by value and cost center',
 ctx:'A customer on S/4HANA wants to approve purchase orders in levels: up to 10 thousand by the cost center manager, above that also by the director. The team proposes a custom ABAP workflow.',
 q:'Which design do you propose?',
 o:[{t:'Custom ABAP workflow with a Z table of approvers.', s:0, w:'It works, but adds code in the core for something the standard covers and becomes cost at every upgrade.'},
    {t:'Flexible workflow for purchase orders, with conditions by value and cost center and rule-based approvers.', s:3, w:'S/4HANA standard, configured in Fiori apps. Covers levels by value and by cost object.'},
    {t:'Classic release strategy with classification.', s:2, w:'It works and is well known, but it is the old approach; for a new scenario, flexible workflow is the direction.'},
    {t:'Approval by e-mail outside the system.', s:1, w:'No traceability and no block on the document. Fails audits.'}]},
TERMS:{papel:['preq','po','gr','iv'],estrutura:['porg','pgrp','plant','sloc'],mestres:['bp','pir','valcl','srcl'],anatomia:['itcat','acat','mvt','accdet'],padrao:['preq','po','gr','iv','grir','payrun'],variacoes:['subc','vcons','sto','ses'],valoracao:['stdpr','map','prdiff','ml'],s4:['bp','flexwf','ml']}
};
