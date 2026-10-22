CORE.en={
 "NODES": {
  "SD": {
   "x": 110,
   "y": 70,
   "sub": "Sales and distribution"
  },
  "MM": {
   "x": 300,
   "y": 70,
   "sub": "Purchasing and inventory"
  },
  "PP": {
   "x": 490,
   "y": 70,
   "sub": "Production"
  },
  "ARIBA": {
   "x": 680,
   "y": 70,
   "sub": "Sourcing (cloud)",
   "label": "Ariba"
  },
  "FISCAL": {
   "x": 110,
   "y": 200,
   "sub": "NF-e, DRC, SPED",
   "label": "Brazil tax"
  },
  "FI": {
   "x": 300,
   "y": 200,
   "sub": "Financial accounting"
  },
  "CO": {
   "x": 490,
   "y": 200,
   "sub": "Controlling"
  },
  "QM": {
   "x": 680,
   "y": 200,
   "sub": "Quality"
  },
  "EWM": {
   "x": 110,
   "y": 330,
   "sub": "Warehouse"
  },
  "HCM": {
   "x": 300,
   "y": 330,
   "sub": "People and payroll"
  },
  "PS": {
   "x": 490,
   "y": 330,
   "sub": "Projects"
  },
  "PM": {
   "x": 680,
   "y": 330,
   "sub": "Maintenance"
  }
 },
 "EDGES": [
  [
   "SD",
   "MM",
   "Availability check (ATP) in the sales order; the goods issue for the delivery reduces inventory (movement type 601)."
  ],
  [
   "SD",
   "EWM",
   "The outbound delivery is replicated to EWM, which runs picking and packing and confirms the goods issue."
  ],
  [
   "SD",
   "FI",
   "The goods issue posts cost of goods sold against inventory; the billing document posts customer against revenue and taxes."
  ],
  [
   "SD",
   "CO",
   "Revenue, discounts and cost reach margin analysis (CO-PA / Margin Analysis) through the same accounting document."
  ],
  [
   "SD",
   "FISCAL",
   "The billing document creates the nota fiscal (J_1BNFDOC) and DRC transmits the NF-e to SEFAZ."
  ],
  [
   "SD",
   "PP",
   "Sales items create requirements for MRP; in make-to-order the sales order becomes special stock for the customer."
  ],
  [
   "SD",
   "PS",
   "Sale linked to a WBS element, billed by milestone or billing plan."
  ],
  [
   "MM",
   "FI",
   "The goods receipt posts inventory against GR/IR; the supplier invoice (MIRO) posts GR/IR against the supplier."
  ],
  [
   "MM",
   "EWM",
   "Physical receipts and issues in warehouses managed by EWM."
  ],
  [
   "MM",
   "PP",
   "Component consumption on the order (mvt. 261) and receipt of the finished product (mvt. 101)."
  ],
  [
   "MM",
   "QM",
   "Inspection lot at goods receipt: the material stays in quality inspection stock until the usage decision."
  ],
  [
   "MM",
   "ARIBA",
   "Quotes, contracts and collaborative purchase orders with the supplier; the official document stays in S/4HANA."
  ],
  [
   "MM",
   "FISCAL",
   "Receipt of the supplier NF-e (DRC inbound) and incoming nota fiscal in MIGO/MIRO."
  ],
  [
   "MM",
   "PM",
   "Material reservations and service purchasing for maintenance orders."
  ],
  [
   "PP",
   "CO",
   "Standard product cost and production order settlement (variances)."
  ],
  [
   "PP",
   "QM",
   "Inspection during production and of the finished product."
  ],
  [
   "PM",
   "CO",
   "Maintenance order costs settled to a cost center or asset."
  ],
  [
   "PS",
   "CO",
   "Budget, actual costs and results analysis per WBS element."
  ],
  [
   "HCM",
   "FI",
   "Payroll results posted to accounting (salaries, social charges, accruals)."
  ],
  [
   "CO",
   "FI",
   "In S/4HANA, FI and CO write to the same universal document (table ACDOCA): no reconciliation between them."
  ],
  [
   "FI",
   "FISCAL",
   "Calculated taxes feed the statutory reporting (SPED)."
  ]
 ]
};
