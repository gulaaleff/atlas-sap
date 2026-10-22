(MOD.sd=MOD.sd||{}).en={
 "name": "SD · Sales and distribution",
 "short": "Sales and distribution",
 "lead": "From the customer order to the nota fiscal: documents, controls and where SD hands work to other modules.",
 "ORDER": [
  "Sales order",
  "Outbound delivery",
  "Picking",
  "Goods issue",
  "Billing document",
  "NF-e"
 ],
 "FLOWS": {
  "padrao": {
   "name": "Standard sale",
   "note": "Goods in stock, delivery-related billing.",
   "steps": [
    {
     "t": "VA01 · type OR",
     "b": "Sales order",
     "m": "item TAN · sched. line CP",
     "ctrl": "The sales document type defines numbering, pricing procedure and which delivery and billing follow. The item category (TAN) says whether the item is relevant for delivery and billing. The schedule line category (CP) links to MRP and the movement type.",
     "integ": "MM: availability check (ATP). Credit: SAP Credit Management. PP: requirement for MRP.",
     "effect": "No accounting entry. Creates a requirement and reserves quantity (ATP).",
     "arch": "The sales order carries most decisions: price, taxes, partners, dates. An error here spreads through the whole flow."
    },
    {
     "t": "VL01N · type LF",
     "b": "Outbound delivery",
     "m": "copy control OR → LF",
     "ctrl": "Copy control defines that OR creates LF and which data is copied (partners, quantities). The delivery item category comes from the sales order.",
     "integ": "EWM or WM: picking and packing tasks. Without warehouse management, picking is confirmed directly in the delivery (MM-IM).",
     "effect": "Still no posting. The picking status moves forward in the document.",
     "arch": "This is where the process changes by industry: a distributor with EWM has waves and tasks; a simple manufacturer confirms picking in the delivery itself."
    },
    {
     "t": "VL02N · mvt. 601",
     "b": "Goods issue",
     "m": "inventory reduction",
     "ctrl": "Movement type 601 comes from the schedule line category. Inventory is reduced in the delivery plant and storage location.",
     "integ": "MM: material document. FI: automatic accounting document.",
     "effect": "Dr Cost of goods sold / Cr Inventory, at the material cost.",
     "arch": "This is when ownership of the goods leaves the company. Reversing later requires care with documents already created."
    },
    {
     "t": "VF01 · type F2",
     "b": "Billing document",
     "m": "copy control LF → F2",
     "ctrl": "Delivery-related billing: the billed quantity comes from the delivered quantity. Prices can be redetermined depending on the pricing type in copy control.",
     "integ": "FI: accounting document. CO: margin by customer/product. Brazil tax: creates the nota fiscal.",
     "effect": "Dr Customer / Cr Revenue and Cr Taxes payable (ICMS, PIS, COFINS, IPI depending on the scenario).",
     "arch": "The billing document is the bridge to FI. Revenue account determination lives here, not in FI."
    },
    {
     "t": "J1BNFE · DRC",
     "b": "NF-e",
     "m": "SEFAZ authorization",
     "ctrl": "The nota fiscal is created from the billing document with the NF type defined for the scenario. Taxes come from the determination done in the sales order.",
     "integ": "DRC (or GRC in older landscapes) sends the XML and receives the authorization protocol from SEFAZ.",
     "effect": "No new posting: the nota fiscal references the billing accounting document.",
     "arch": "In Brazil goods can only leave with an authorized NF-e, so goods issue, billing and NF-e usually run back to back. The exact order varies by company."
    }
   ]
  },
  "servico": {
   "name": "Service sale",
   "note": "No delivery: the sales order goes straight to billing.",
   "steps": [
    {
     "t": "VA01 · type OR",
     "b": "Sales order",
     "m": "service item (e.g. TAD)",
     "ctrl": "The service item category is not relevant for delivery and is relevant for order-related billing.",
     "integ": "No inventory ATP. May have a billing plan (monthly, by milestone).",
     "effect": "No accounting entry.",
     "arch": "The item category decides whether there is a delivery, not the order type. The same order can hold material and service items."
    },
    {
     "t": "VF01 · type F2",
     "b": "Billing document",
     "m": "order-related billing",
     "ctrl": "Copy control OR → F2 uses the order quantity, not the delivered quantity.",
     "integ": "FI and CO, as in the standard sale.",
     "effect": "Dr Customer / Cr Service revenue and taxes (ISS, PIS, COFINS).",
     "arch": "With no goods issue, SD posts no cost. The cost of the service comes from elsewhere (PS, CO, payroll)."
    },
    {
     "t": "NFS-e",
     "b": "Service invoice",
     "m": "national or municipal standard",
     "ctrl": "Brazilian service nota fiscal with ISS. The layout depends on the municipality or the national NFS-e standard.",
     "integ": "Messaging solution (DRC or a partner) to the city hall or the national environment.",
     "effect": "No new posting.",
     "arch": "NFS-e has historically been the most heterogeneous part of Brazilian localization. Always check which transmission solution the customer uses."
    }
   ]
  },
  "devolucao": {
   "name": "Return",
   "note": "The customer returns goods and receives a credit.",
   "steps": [
    {
     "t": "VA01 · type RE",
     "b": "Returns order",
     "m": "with reference to the invoice",
     "ctrl": "Created with reference to the original billing document, inheriting price and taxes. It usually starts with a billing block until inspection.",
     "integ": "No ATP. May require an order reason (return reason).",
     "effect": "No accounting entry.",
     "arch": "The reference to the invoice is what guarantees the credit uses the same price and tax as the sale."
    },
    {
     "t": "VL01N · type LR",
     "b": "Returns delivery",
     "m": "mvt. 651",
     "ctrl": "The physical receipt uses movement type 651, which puts the material into blocked returns stock.",
     "integ": "MM: goods receipt. QM can inspect before release.",
     "effect": "Receipt into blocked returns stock, not valuated in this movement.",
     "arch": "Deciding to reuse or scrap is a later step, with a stock transfer."
    },
    {
     "t": "VF01 · credit",
     "b": "Credit memo",
     "m": "type RE",
     "ctrl": "Credit billing with reference to the returns order, released after removing the block.",
     "integ": "FI and CO, with reversed sign.",
     "effect": "Dr Revenue (returns) and taxes / Cr Customer.",
     "arch": "Poorly configured returns are a classic source of mismatch between tax and accounting."
    },
    {
     "t": "J1BNFE",
     "b": "Returns NF",
     "m": "incoming nota fiscal",
     "ctrl": "Creates the incoming nota fiscal that covers the return, or references the NF-e issued by the customer, depending on the scenario.",
     "integ": "Brazil tax / DRC.",
     "effect": "No new posting.",
     "arch": "Who issues the returns NF (the customer or the company itself) changes the tax scenario. Confirm with the customer’s tax team."
    }
   ]
  }
 },
 "CHAPTERS": [
  {
   "id": "papel",
   "t": "The role of SD in the business",
   "guide": "What does SD solve, and what does it leave to other modules?",
   "body": "<p>SD turns a negotiation with the customer into delivered goods, an issued invoice and posted revenue. It covers quotation, sales order, delivery and billing.</p>\n  <p>Knowing what it does <b>not</b> do matters just as much. SD does not hold inventory (MM), does not run the warehouse (EWM), does not post accounting on its own (FI) and does not issue the nota fiscal by itself (Brazil localization). It creates documents, and those documents trigger the work of the other modules.</p>\n  <p>Processes the module supports:</p>\n  <ul><li>Standard sale of goods in stock</li><li>Service sale, with no delivery</li><li>Returns and credit and debit memos</li><li>Consignment at the customer</li><li>Third-party sale (drop shipment)</li><li>Contracts and scheduling agreements</li><li>Free goods</li></ul>",
   "arch": "In a customer meeting, start by asking which of these processes they run. Each brings different documents, controls and integrations, and that is what sizes an SD project.",
   "acts": [
    {
     "q": "Who reduces inventory when goods are sold?",
     "o": [
      "SD, directly in the billing document",
      "MM, from the goods issue of the delivery",
      "FI, when revenue is posted",
      "EWM, always"
     ],
     "a": 1,
     "w": "SD creates the delivery; the goods issue creates a material document in MM. EWM only takes part when the warehouse is managed by it."
    },
    {
     "q": "Which of these is NOT a process supported by SD?",
     "o": [
      "Consignment at the customer",
      "Third-party sale",
      "Payroll processing",
      "Returns"
     ],
     "a": 2,
     "w": "Payroll is HCM. The other three are sales variants handled in SD."
    }
   ],
   "reflect": "Explain in your own words the difference between SD creating a document and SD posting accounting."
  },
  {
   "id": "estrutura",
   "t": "Organizational structure",
   "guide": "Who sells, through which channel, and where do the goods ship from?",
   "body": "<p>Every sales order belongs to a <b>sales area</b>, which combines three objects:</p>\n  <div class=\"org\"><div><b>Sales organization</b><span>Legally responsible for the sale. Assigned to a company code in FI.</span></div><div><b>Distribution channel</b><span>How the product reaches the customer: wholesale, retail, e-commerce.</span></div><div><b>Division</b><span>Product line. Allows different prices and terms per line.</span></div><div><b>Shipping point</b><span>Where the delivery is processed. Comes from the plant, shipping condition and loading group.</span></div></div>\n  <p>The <b>plant</b> (from MM) says where the goods ship from. The <b>company code</b> (from FI) says which balance sheet the revenue goes to. The sales area ties the sale to both worlds.</p>",
   "arch": "Every new sales area multiplies master data: the customer needs sales data for each combination it buys in. Structures with many channels and divisions are expensive to maintain.",
   "acts": [
    {
     "q": "A sales area is made of:",
     "o": [
      "Company code + plant + storage location",
      "Sales organization + distribution channel + division",
      "Sales organization + shipping point",
      "Channel + division + plant"
     ],
     "a": 1,
     "w": "The three sales objects. Plant and shipping point belong to logistics, not to the sales area."
    },
    {
     "q": "What defines which balance sheet the sales revenue goes to?",
     "o": [
      "The distribution channel",
      "The shipping point",
      "The company code the sales organization is assigned to",
      "The division"
     ],
     "a": 2,
     "w": "A sales organization belongs to a single company code."
    }
   ],
   "reflect": "Sketch (on paper) the sales structure of a company you know: how many sales organizations, channels and divisions would it have?"
  },
  {
   "id": "mestres",
   "t": "Master data",
   "guide": "Which master data does the sales order read to fill itself in?",
   "body": "<p>A well-configured sales order needs almost no typing: it reads what it needs from master data.</p>\n  <div class=\"tbl\"><table><thead><tr><th>Master data</th><th>What SD uses</th><th>Who else shares it</th></tr></thead><tbody>\n  <tr><td>Business Partner (customer)</td><td>Sales area data: currency, payment terms, partner functions (sold-to, ship-to, payer, bill-to)</td><td>FI, Brazil tax (CNPJ, IE)</td></tr>\n  <tr><td>Material</td><td>Sales views: sales unit, item category group, delivering plant</td><td>MM, PP, EWM, CO</td></tr>\n  <tr><td>Condition records</td><td>Price, discounts, freight, taxes</td><td>MM uses the same technique</td></tr>\n  <tr><td>Customer-material info record</td><td>Customer’s material number and texts</td><td>—</td></tr></tbody></table></div>\n  <p>In S/4HANA, customer and supplier are the same object, the Business Partner, with different roles.</p>",
   "arch": "\"Wrong sales order\" problems are almost always master data problems. Before proposing development, check whether master data is complete for that sales area.",
   "acts": [
    {
     "q": "Where are the payment terms the sales order uses by default?",
     "o": [
      "In the BP general data",
      "In the BP sales area data",
      "In the material master",
      "In the info record"
     ],
     "a": 1,
     "w": "Commercial data varies by sales area, so it is kept at that level of the BP."
    },
    {
     "q": "Which material field helps determine the item category?",
     "o": [
      "Material group",
      "Item category group",
      "Gross weight",
      "Valuation type"
     ],
     "a": 1,
     "w": "The item category group (e.g. NORM) is part of item category determination."
    }
   ],
   "reflect": "List three customer fields that, if wrong, would cause a problem in the nota fiscal."
  },
  {
   "id": "anatomia",
   "t": "Anatomy of the documents",
   "guide": "What decides the behavior of each document and each item?",
   "body": "<p>This is the core chapter. Four controls explain almost everything SD does:</p>\n  <div class=\"tbl\"><table><thead><tr><th>Control</th><th>Level</th><th>What it decides</th><th>Example</th></tr></thead><tbody>\n  <tr><td>Document type</td><td>Header</td><td>Numbering, pricing procedure, which delivery and billing follow</td><td class=\"mono\">OR, RE, LF, F2</td></tr>\n  <tr><td>Item category</td><td>Item</td><td>Whether the item creates a delivery, whether it is billed and with reference to what</td><td class=\"mono\">TAN, TAD, TAS, TANN</td></tr>\n  <tr><td>Schedule line category</td><td>Schedule line</td><td>Link to MRP and inventory movement type</td><td class=\"mono\">CP, CN</td></tr>\n  <tr><td>Copy control</td><td>Between documents</td><td>Which document creates which, what data is copied, which checks run</td><td class=\"mono\">OR → LF → F2</td></tr></tbody></table></div>\n  <p>The item category is determined by the sales document type, the material’s item category group and, when present, usage and higher-level item. That is why the same sales order can have one item going to delivery and another going straight to billing.</p>\n  <p>Everything is recorded in the <b>document flow</b> (table VBFA): from any document you can navigate backward and forward.</p>\n  <div class=\"tbl\"><table><thead><tr><th>Document</th><th>Tables</th><th>Transaction</th></tr></thead><tbody>\n  <tr><td>Sales order</td><td class=\"mono\">VBAK / VBAP / VBEP</td><td class=\"mono\">VA01</td></tr><tr><td>Outbound delivery</td><td class=\"mono\">LIKP / LIPS</td><td class=\"mono\">VL01N</td></tr><tr><td>Billing document</td><td class=\"mono\">VBRK / VBRP</td><td class=\"mono\">VF01</td></tr></tbody></table></div>",
   "arch": "When a new requirement shows up, the first question is: does it fit a new document type or item category? If so, it is configuration. Many ABAP proposals come from skipping that question.",
   "acts": [
    {
     "q": "Who decides whether an item creates a delivery?",
     "o": [
      "The order type",
      "The item category",
      "The plant",
      "The customer"
     ],
     "a": 1,
     "w": "Delivery relevance is a property of the item category."
    },
    {
     "q": "Copy control defines:",
     "o": [
      "The material price",
      "Which documents can create which and what data is copied",
      "The sales order numbering",
      "The delivering plant"
     ],
     "a": 1,
     "w": "Example: OR can create LF; a quotation QT can become OR, but not a credit memo request."
    }
   ],
   "reflect": "Explain why the same sales order can have one item with delivery and another without."
  },
  {
   "id": "padrao",
   "t": "Standard sale, step by step",
   "guide": "What happens, in each module, from the order to the NF-e?",
   "widget": "flow",
   "body": "<p>With the controls from the previous chapter in mind, follow the flow by clicking each document. Notice when each module comes in and when the first accounting entry appears.</p>",
   "arch": "The first accounting entry only appears at goods issue. Until then, order and delivery are logistics documents. That is why reversing a delivery is simple and reversing after billing is not.",
   "acts": [
    {
     "q": "When is cost of goods sold posted?",
     "o": [
      "At the sales order",
      "At the delivery",
      "At goods issue",
      "At the NF-e"
     ],
     "a": 2,
     "w": "Movement type 601 reduces inventory and posts COGS against inventory."
    },
    {
     "q": "In delivery-related billing, where does the billed quantity come from?",
     "o": [
      "The sales order",
      "The quantity delivered in the delivery",
      "The customer purchase order",
      "The condition record"
     ],
     "a": 1,
     "w": "That is why partial deliveries create partial invoices."
    }
   ],
   "reflect": "Tell the story of a sale as if explaining it to someone in sales, without using transaction names.",
   "flowKey": "padrao",
   "order": true
  },
  {
   "id": "variacoes",
   "t": "Process variants",
   "guide": "What changes when the sale is not the standard one?",
   "widget": "flow",
   "body": "<p>Variants almost always change through the <b>item category</b>. The rest of the flow adapts to it.</p>\n  <div class=\"tbl\"><table><thead><tr><th>Scenario</th><th>Category</th><th>Delivery</th><th>Billing</th><th>What changes</th></tr></thead><tbody>\n  <tr><td>Service</td><td class=\"mono\">TAD</td><td>No</td><td>Order-related</td><td>No inventory and no COGS from SD</td></tr>\n  <tr><td>Third-party sale</td><td class=\"mono\">TAS</td><td>No (supplier delivers)</td><td>Order-related</td><td>The sales order creates a purchase requisition; the supplier delivers straight to the customer</td></tr>\n  <tr><td>Free goods</td><td class=\"mono\">TANN</td><td>Yes</td><td>No</td><td>Item with no price, but with goods issue and tax impact</td></tr>\n  <tr><td>Consignment fill-up</td><td class=\"mono\">KB</td><td>Yes</td><td>No</td><td>Stock moves to the customer but still belongs to the company</td></tr>\n  <tr><td>Consignment issue</td><td class=\"mono\">KE</td><td>Yes</td><td>Yes</td><td>Only here is revenue created</td></tr>\n  <tr><td>Return</td><td class=\"mono\">REN</td><td>Yes (inbound)</td><td>Credit</td><td>Receipt into blocked returns stock (mvt. 651)</td></tr></tbody></table></div>\n  <p>Use the service and return scenarios in the flow below to compare with the standard sale.</p>",
   "arch": "Variants are where Brazilian tax weighs most: free goods, consignment and returns have their own CFOP and treatment. Always validate with the customer’s tax team.",
   "acts": [
    {
     "q": "In a third-party sale, who delivers the goods to the customer?",
     "o": [
      "The company plant",
      "The supplier, from a purchase order created by the sales order",
      "EWM",
      "The carrier, with no document"
     ],
     "a": 1,
     "w": "Item category TAS creates a purchase requisition; the supplier delivers directly."
    },
    {
     "q": "At which consignment step is revenue recognized?",
     "o": [
      "Fill-up (KB)",
      "Issue (KE)",
      "Pick-up (KA)",
      "Consignment return (KR)"
     ],
     "a": 1,
     "w": "At fill-up the stock still belongs to the company. The sale happens at issue."
    }
   ],
   "reflect": "Pick a real customer (without naming it) and say which variants it uses and why.",
   "flowKey": "servico"
  },
  {
   "id": "preco",
   "t": "Pricing and taxes",
   "guide": "How does the sales order arrive at price and taxes without typing?",
   "body": "<p>SD uses the <b>condition technique</b>, the same as MM:</p>\n  <ol><li>The <b>pricing procedure</b> is chosen by sales area, document pricing procedure and customer pricing procedure.</li><li>The procedure lists the <b>condition types</b> in calculation order (price, discounts, freight, taxes).</li><li>Each condition type has an <b>access sequence</b>, which says in which order to search for records (e.g. customer + material, then material only).</li><li>The <b>condition records</b> hold the value.</li></ol>\n  <p>In S/4HANA the standard price condition became <span class=\"mono\">PPR0</span> (it was <span class=\"mono\">PR00</span> in ECC).</p>\n  <p>In Brazil, the sales order also determines tax code, CFOP and the ICMS, IPI, PIS and COFINS tax laws per item. The nota fiscal inherits them through billing. A tax error in the NF almost always starts in the sales order.</p>",
   "arch": "Before accepting \"we need custom pricing\", ask whether it is just a new condition table or access sequence. The condition technique covers most commercial policies.",
   "acts": [
    {
     "q": "What is the access sequence for?",
     "o": [
      "Defining document numbering",
      "Defining the search order of condition records",
      "Defining the shipping point",
      "Releasing the credit block"
     ],
     "a": 1,
     "w": "It goes from most specific to most generic until it finds a valid record."
    },
    {
     "q": "Where is the CFOP determined first?",
     "o": [
      "In the NF-e",
      "In the sales order item",
      "In FI",
      "In the delivery"
     ],
     "a": 1,
     "w": "The sales order determines it; billing and the nota fiscal inherit it."
    }
   ],
   "reflect": "Describe a customer’s pricing policy and how it would fit the condition technique."
  },
  {
   "id": "s4",
   "t": "S/4HANA and limits of the standard",
   "guide": "What changed, and where is the standard usually not enough?",
   "body": "<div class=\"tbl\"><table><thead><tr><th>Topic</th><th>ECC</th><th>S/4HANA</th></tr></thead><tbody>\n  <tr><td>Customer</td><td>Customer master (KNA1)</td><td>Business Partner mandatory, via CVI</td></tr>\n  <tr><td>Status</td><td>Tables VBUK / VBUP</td><td>Status fields in the headers and items themselves</td></tr>\n  <tr><td>Credit</td><td>Classic SD credit management</td><td>SAP Credit Management (FIN-FSCM)</td></tr>\n  <tr><td>Rebates</td><td>Rebate agreements</td><td>Condition Contract Settlement</td></tr>\n  <tr><td>Output</td><td>NAST</td><td>Output Management with BRF+ (NAST still supported)</td></tr>\n  <tr><td>Accounting</td><td>FI and CO separate</td><td>Universal document (ACDOCA)</td></tr>\n  <tr><td>Warehouse</td><td>Classic WM</td><td>EWM as the strategic direction</td></tr></tbody></table></div>\n  <p><b>Where the standard works well:</b> flexible flows through types and categories, condition technique, traceability in document flow, native integration with FI, CO, MM and Brazil tax.</p>\n  <p><b>Where it usually needs extension:</b> very specific approval rules, dynamic pricing outside the condition technique, external sales channels, unusual tax scenarios (handled by localization BAdIs).</p>",
   "arch": "Evaluation order: configuration, then key-user extension, then side-by-side on BTP, and only last ABAP in the core. That is Clean Core reasoning.",
   "acts": [
    {
     "q": "What replaces classic SD credit management in S/4HANA?",
     "o": [
      "Nothing, it stays",
      "SAP Credit Management (FIN-FSCM)",
      "Ariba",
      "A mandatory BAdI"
     ],
     "a": 1,
     "w": "It is listed in the Simplification List."
    },
    {
     "q": "What is the evaluation order in Clean Core?",
     "o": [
      "ABAP, then configuration",
      "Configuration, key-user extension, side-by-side, and ABAP in the core last",
      "Side-by-side always first",
      "Key-user only in public cloud"
     ],
     "a": 1,
     "w": "The closer to standard, the lower the upgrade cost."
    }
   ],
   "reflect": "Think of an ABAP development you have seen in SD. Could it have been solved by configuration?"
  }
 ],
 "THEMES": [
  {
   "id": "org",
   "t": "Structure and master data",
   "qs": [
    {
     "q": "A sales area is made of:",
     "o": [
      "Sales organization + channel + division",
      "Company code + plant + storage location",
      "Sales organization + plant",
      "Channel + division + shipping point"
     ],
     "a": 0,
     "w": "The three sales objects."
    },
    {
     "q": "The sales organization is assigned to which FI object?",
     "o": [
      "Cost center",
      "Company code",
      "Controlling area",
      "Segment"
     ],
     "a": 1,
     "w": "Each sales organization belongs to one company code."
    },
    {
     "q": "Currency and payment terms for the sale are kept in:",
     "o": [
      "BP general data",
      "BP sales area data",
      "Material master",
      "Info record"
     ],
     "a": 1,
     "w": "They vary by sales area."
    },
    {
     "q": "The shipping point is determined from:",
     "o": [
      "Customer and channel",
      "Plant, shipping condition and loading group",
      "Sales organization",
      "Order type"
     ],
     "a": 1,
     "w": "That is the standard determination rule."
    }
   ]
  },
  {
   "id": "docs",
   "t": "Documents and controls",
   "qs": [
    {
     "q": "Who decides whether an item creates a delivery?",
     "o": [
      "Order type",
      "Item category",
      "Plant",
      "Customer"
     ],
     "a": 1,
     "w": "Delivery relevance belongs to the item category."
    },
    {
     "q": "The item category is determined by:",
     "o": [
      "Only the document type",
      "Document type + item category group (+ usage, higher-level item)",
      "The customer",
      "The plant"
     ],
     "a": 1,
     "w": "That is why different items in the same order behave differently."
    },
    {
     "q": "The schedule line category links the item to:",
     "o": [
      "Pricing",
      "MRP and movement type",
      "Credit",
      "NF-e"
     ],
     "a": 1,
     "w": "E.g. CP with MRP, CN with no planning."
    },
    {
     "q": "Where can you see the order → delivery → invoice history?",
     "o": [
      "BSEG",
      "Document flow (VBFA)",
      "MSEG",
      "Change log"
     ],
     "a": 1,
     "w": "Navigable from any document."
    }
   ]
  },
  {
   "id": "fluxos",
   "t": "Flows and variants",
   "qs": [
    {
     "q": "A service sale normally uses:",
     "o": [
      "Order, delivery and billing",
      "Order and billing",
      "Billing only",
      "Order and delivery"
     ],
     "a": 1,
     "w": "A service item is not delivery-relevant."
    },
    {
     "q": "Item category TAS means:",
     "o": [
      "Free goods",
      "Third-party sale",
      "Consignment",
      "Service"
     ],
     "a": 1,
     "w": "It creates a purchase requisition so the supplier delivers directly."
    },
    {
     "q": "In consignment, billing starts at:",
     "o": [
      "Fill-up KB",
      "Issue KE",
      "Pick-up KA",
      "Return KR"
     ],
     "a": 1,
     "w": "Only the issue is a sale."
    },
    {
     "q": "The physical receipt of a return uses movement type:",
     "o": [
      "601",
      "651",
      "101",
      "261"
     ],
     "a": 1,
     "w": "It goes to blocked returns stock."
    }
   ]
  },
  {
   "id": "preco",
   "t": "Pricing and taxes",
   "qs": [
    {
     "q": "The pricing procedure is chosen by:",
     "o": [
      "Material",
      "Sales area + document pricing procedure + customer pricing procedure",
      "Plant",
      "Delivery type"
     ],
     "a": 1,
     "w": "That is the determination key."
    },
    {
     "q": "The access sequence defines:",
     "o": [
      "The search order of condition records",
      "Numbering",
      "CFOP",
      "Plant"
     ],
     "a": 0,
     "w": "From most specific to most generic."
    },
    {
     "q": "Standard price condition in S/4HANA:",
     "o": [
      "PR00",
      "PPR0",
      "K004",
      "MWST"
     ],
     "a": 1,
     "w": "PR00 was the ECC standard."
    },
    {
     "q": "A CFOP error in the NF-e normally starts:",
     "o": [
      "In DRC",
      "In the sales order",
      "In FI",
      "In the delivery"
     ],
     "a": 1,
     "w": "The sales order determines it; the nota fiscal inherits it."
    }
   ]
  },
  {
   "id": "integ",
   "t": "Integration",
   "qs": [
    {
     "q": "The goods issue posts:",
     "o": [
      "Dr Customer / Cr Revenue",
      "Dr COGS / Cr Inventory",
      "Dr Inventory / Cr GR/IR",
      "Nothing"
     ],
     "a": 1,
     "w": "Movement type 601."
    },
    {
     "q": "Revenue accounts in billing come from:",
     "o": [
      "Manual posting in FI",
      "SD account determination",
      "MM account determination",
      "CO"
     ],
     "a": 1,
     "w": "Configured in SD, not in FI."
    },
    {
     "q": "With EWM, who confirms picking?",
     "o": [
      "SD in the sales order",
      "EWM, which returns the status to the delivery",
      "FI",
      "The customer"
     ],
     "a": 1,
     "w": "The delivery is replicated as an outbound document in EWM."
    },
    {
     "q": "In make-to-order, the sales order:",
     "o": [
      "Has no relation to PP",
      "Creates special stock linked to the order item",
      "Creates billing directly",
      "Blocks MRP"
     ],
     "a": 1,
     "w": "The product is reserved for that sale."
    }
   ]
  },
  {
   "id": "s4",
   "t": "S/4HANA",
   "qs": [
    {
     "q": "FI and CO write together to table:",
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
     "q": "Classic SD credit management was replaced by:",
     "o": [
      "SAP Credit Management",
      "Ariba",
      "BRF+",
      "Nothing"
     ],
     "a": 0,
     "w": "FIN-FSCM."
    },
    {
     "q": "Sales order status in S/4HANA is kept:",
     "o": [
      "In VBUK/VBUP",
      "In the headers and items themselves",
      "In VBFA",
      "In a Z table"
     ],
     "a": 1,
     "w": "VBUK/VBUP were removed."
    },
    {
     "q": "SD rebates moved to:",
     "o": [
      "Condition Contract Settlement",
      "Credit Management",
      "Output Management",
      "EWM"
     ],
     "a": 0,
     "w": "Classic rebate agreements do not continue in S/4."
    }
   ]
  }
 ],
 "INTEG": [
  {
   "k": "MM",
   "n": "MM",
   "sub": "Inventory",
   "dir": "SD ↔ MM",
   "step": "Sales order (availability) and goods issue",
   "what": "The sales order checks stock and planned receipts (ATP). The goods issue creates a material document with movement type 601 in the delivery plant and storage location.",
   "varies": "Consignment and make-to-order use special stock. Third-party sales (TAS) create a purchase requisition from the sales order."
  },
  {
   "k": "EWM",
   "n": "EWM",
   "sub": "Warehouse",
   "dir": "SD → EWM → SD",
   "step": "Outbound delivery",
   "what": "The delivery is replicated as an outbound delivery order in EWM, which creates warehouse tasks, runs picking and packing and returns the confirmation and goods issue.",
   "varies": "Without warehouse management, picking is confirmed in the delivery itself. In ECC with classic WM, through transfer orders. EWM can be embedded or decentralized."
  },
  {
   "k": "FI",
   "n": "FI",
   "sub": "Accounting",
   "dir": "SD → FI",
   "step": "Goods issue and billing",
   "what": "Goods issue: Dr COGS / Cr Inventory. Billing: Dr Customer / Cr Revenue and taxes. Revenue accounts come from SD account determination.",
   "varies": "Deferred revenue in contracts uses Revenue Accounting. Some companies bill before the physical goods issue."
  },
  {
   "k": "CO",
   "n": "CO",
   "sub": "Margin",
   "dir": "SD → CO",
   "step": "Billing and goods issue",
   "what": "Revenue, discounts and COGS reach margin analysis with characteristics such as customer, material and region.",
   "varies": "In S/4HANA, margin analysis (account-based) is the default; the costing-based version still exists at customers who migrated."
  },
  {
   "k": "FISCAL",
   "n": "Brazil tax",
   "sub": "NF-e",
   "dir": "SD → Tax → SEFAZ",
   "step": "Billing",
   "what": "Billing creates the nota fiscal (J_1BNFDOC / J_1BNFLIN) with CFOP and taxes determined in the sales order. DRC sends the XML and receives the authorization.",
   "varies": "Goods (NF-e) and services (NFS-e) follow different paths. The tax reform brings IBS and CBS into the document."
  },
  {
   "k": "PP",
   "n": "PP",
   "sub": "Production",
   "dir": "SD → PP",
   "step": "Sales order (schedule line)",
   "what": "A schedule line with MRP passes the requirement to planning. In make-to-order, the sales order becomes a stock and cost object.",
   "varies": "Make-to-stock, make-to-order and configurable products (variant configuration) change the integration a lot."
  },
  {
   "k": "CRED",
   "n": "Credit",
   "sub": "FIN-FSCM",
   "dir": "SD ↔ Credit Mgmt",
   "step": "Sales order and delivery",
   "what": "The credit check can block the order or delivery based on the customer’s exposure and limit.",
   "varies": "Rules by credit segment and document type. In ECC it was classic SD credit management."
  },
  {
   "k": "PS",
   "n": "PS",
   "sub": "Projects",
   "dir": "SD ↔ PS",
   "step": "Sales order linked to a WBS element",
   "what": "Order items linked to a WBS element; revenue and cost are analyzed in the project. Billing by milestone or billing plan.",
   "varies": "Common in engineering and contract services. Rare in retail and distribution."
  }
 ],
 "CARDS": [
  {
   "id": "c1",
   "f": "Sales area",
   "b": "Sales organization + distribution channel + division. Every sales order belongs to a sales area.",
   "mod": "SD"
  },
  {
   "id": "c2",
   "f": "Copy control",
   "b": "Rules that say which document can create which (OR → LF → F2), what data is copied and which checks run.",
   "mod": "SD"
  },
  {
   "id": "c3",
   "f": "Item category",
   "b": "Defines, per item, whether there is a delivery, whether there is billing and with reference to what (order or delivery).",
   "mod": "SD"
  },
  {
   "id": "c4",
   "f": "Movement type 601",
   "b": "Goods issue for a sales delivery. Reduces inventory and posts cost of goods sold.",
   "mod": "SD/MM"
  },
  {
   "id": "c5",
   "f": "Shipping point",
   "b": "Location that processes the delivery. Determined from plant, shipping condition and loading group.",
   "mod": "SD"
  },
  {
   "id": "c7",
   "f": "Business Partner",
   "b": "Single object for customer and supplier in S/4HANA (CVI synchronizes with KNA1/LFA1).",
   "mod": "Foundations"
  },
  {
   "id": "c9",
   "f": "DRC",
   "b": "Document and Reporting Compliance: SAP solution for electronic tax document messaging and statutory reporting.",
   "mod": "Brazil tax"
  },
  {
   "id": "c10",
   "f": "Order-related billing",
   "b": "The billing document uses the sales order quantity. Typical for services and billing plans.",
   "mod": "SD"
  }
 ],
 "CHALLENGE": {
  "title": "Equipment and installation in one sale",
  "ctx": "An equipment distributor sells the equipment and its installation in the same deal. It wants a single sales order, deliver the equipment now and bill the installation only after the technician finishes. Today the team is thinking about ABAP development.",
  "q": "Which design do you propose?",
  "o": [
   {
    "t": "Two separate sales orders, one per type of sale.",
    "s": 1,
    "w": "It works, but breaks the single commercial view and duplicates pricing, credit and approval. It treats the symptom, not the request."
   },
   {
    "t": "One sales order with a material item (delivery-relevant) and a service item with order-related billing, blocked until completion.",
    "s": 3,
    "w": "Standard SAP. The item category handles the difference between items; the item billing block holds the installation until acceptance. No development."
   },
   {
    "t": "ABAP development that splits the order on save.",
    "s": 0,
    "w": "Adds code for something the standard already does. Breaks Clean Core and becomes maintenance cost at every upgrade."
   },
   {
    "t": "Move the installation to SAP Service and bill it there.",
    "s": 2,
    "w": "Makes sense if there is technician management, scheduling and time confirmation. For a simple acceptance it is more solution than the problem asks for."
   }
  ]
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
