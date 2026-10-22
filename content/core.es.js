CORE.es={
 "NODES": {
  "SD": {
   "x": 110,
   "y": 70,
   "sub": "Ventas y distribución"
  },
  "MM": {
   "x": 300,
   "y": 70,
   "sub": "Compras y stock"
  },
  "PP": {
   "x": 490,
   "y": 70,
   "sub": "Producción"
  },
  "ARIBA": {
   "x": 680,
   "y": 70,
   "sub": "Aprovisionamiento (nube)",
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
   "sub": "Contabilidad"
  },
  "CO": {
   "x": 490,
   "y": 200,
   "sub": "Controlling"
  },
  "QM": {
   "x": 680,
   "y": 200,
   "sub": "Calidad"
  },
  "EWM": {
   "x": 110,
   "y": 330,
   "sub": "Almacén"
  },
  "HCM": {
   "x": 300,
   "y": 330,
   "sub": "Personas y nómina"
  },
  "PS": {
   "x": 490,
   "y": 330,
   "sub": "Proyectos"
  },
  "PM": {
   "x": 680,
   "y": 330,
   "sub": "Mantenimiento"
  }
 },
 "EDGES": [
  [
   "SD",
   "MM",
   "Verificación de disponibilidad (ATP) en el pedido de cliente; la salida de mercancías de la entrega reduce el stock (clase de movimiento 601)."
  ],
  [
   "SD",
   "EWM",
   "La entrega de salida se replica en EWM, que ejecuta el picking y el embalaje y confirma la salida de mercancías."
  ],
  [
   "SD",
   "FI",
   "La salida de mercancías contabiliza el coste de las ventas contra stock; la factura contabiliza cliente contra ingresos e impuestos."
  ],
  [
   "SD",
   "CO",
   "Ingresos, descuentos y coste llegan al análisis de márgenes (CO-PA / Margin Analysis) con el mismo documento contable."
  ],
  [
   "SD",
   "FISCAL",
   "La factura genera la nota fiscal (J_1BNFDOC) y DRC transmite la NF-e a la SEFAZ."
  ],
  [
   "SD",
   "PP",
   "Las posiciones de venta generan necesidades para el MRP; en fabricación sobre pedido el pedido de cliente se convierte en stock especial del cliente."
  ],
  [
   "SD",
   "PS",
   "Venta vinculada a un elemento PEP, facturada por hito o plan de facturación."
  ],
  [
   "MM",
   "FI",
   "La entrada de mercancías contabiliza stock contra la cuenta EM/RF; la factura del proveedor (MIRO) contabiliza EM/RF contra proveedor."
  ],
  [
   "MM",
   "EWM",
   "Entradas y salidas físicas en almacenes gestionados por EWM."
  ],
  [
   "MM",
   "PP",
   "Consumo de componentes en la orden (mov. 261) y entrada del producto terminado (mov. 101)."
  ],
  [
   "MM",
   "QM",
   "Lote de inspección en la entrada: el material queda en stock en control de calidad hasta la decisión de empleo."
  ],
  [
   "MM",
   "ARIBA",
   "Ofertas, contratos y pedidos colaborativos con el proveedor; el documento oficial sigue en S/4HANA."
  ],
  [
   "MM",
   "FISCAL",
   "Recepción de la NF-e del proveedor (DRC inbound) y nota fiscal de entrada en MIGO/MIRO."
  ],
  [
   "MM",
   "PM",
   "Reservas de material y compra de servicios para órdenes de mantenimiento."
  ],
  [
   "PP",
   "CO",
   "Coste estándar del producto y liquidación de la orden de fabricación (desviaciones)."
  ],
  [
   "PP",
   "QM",
   "Inspección durante la producción y del producto terminado."
  ],
  [
   "PM",
   "CO",
   "Costes de la orden de mantenimiento liquidados a centro de coste o activo fijo."
  ],
  [
   "PS",
   "CO",
   "Presupuesto, costes reales y análisis de resultados por elemento PEP."
  ],
  [
   "HCM",
   "FI",
   "Resultados de nómina contabilizados (salarios, cargas sociales, provisiones)."
  ],
  [
   "CO",
   "FI",
   "En S/4HANA, FI y CO graban en el mismo documento universal (tabla ACDOCA): no hay conciliación entre ellos."
  ],
  [
   "FI",
   "FISCAL",
   "Los impuestos calculados alimentan las obligaciones legales (SPED)."
  ]
 ]
};
