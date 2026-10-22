(MOD.sd=MOD.sd||{}).es={
 "name": "SD · Ventas y distribución",
 "short": "Ventas y distribución",
 "lead": "Del pedido del cliente a la nota fiscal: documentos, controles y dónde SD entrega trabajo a otros módulos.",
 "ORDER": [
  "Pedido de cliente",
  "Entrega de salida",
  "Picking",
  "Salida de mercancías",
  "Factura",
  "NF-e"
 ],
 "FLOWS": {
  "padrao": {
   "name": "Venta estándar",
   "note": "Mercancía en stock, facturación relacionada con la entrega.",
   "steps": [
    {
     "t": "VA01 · clase OR",
     "b": "Pedido de cliente",
     "m": "posición TAN · reparto CP",
     "ctrl": "La clase de documento de ventas define numeración, esquema de cálculo y qué entrega y factura siguen. El tipo de posición (TAN) indica si la posición es relevante para entrega y facturación. El tipo de reparto (CP) enlaza con el MRP y la clase de movimiento.",
     "integ": "MM: verificación de disponibilidad (ATP). Crédito: SAP Credit Management. PP: necesidad para el MRP.",
     "effect": "Sin asiento contable. Genera necesidad y reserva cantidad (ATP).",
     "arch": "El pedido de cliente concentra la mayoría de las decisiones: precio, impuestos, interlocutores, fechas. Un error aquí se propaga a todo el flujo."
    },
    {
     "t": "VL01N · clase LF",
     "b": "Entrega de salida",
     "m": "control de copia OR → LF",
     "ctrl": "El control de copia define que OR genera LF y qué datos se copian (interlocutores, cantidades). El tipo de posición de la entrega viene del pedido.",
     "integ": "EWM o WM: tareas de picking y embalaje. Sin gestión de almacenes, el picking se confirma en la propia entrega (MM-IM).",
     "effect": "Todavía sin contabilización. El status de picking avanza en el documento.",
     "arch": "Aquí el proceso cambia según el sector: un distribuidor con EWM tiene oleadas y tareas; un fabricante sencillo confirma el picking en la propia entrega."
    },
    {
     "t": "VL02N · mov. 601",
     "b": "Salida de mercancías",
     "m": "baja de stock",
     "ctrl": "La clase de movimiento 601 viene del tipo de reparto. El stock se reduce en el centro y almacén de la entrega.",
     "integ": "MM: documento de material. FI: documento contable automático.",
     "effect": "D Coste de las ventas / H Stock, al coste del material.",
     "arch": "Es el momento en que la propiedad de la mercancía sale de la empresa. Anular después exige cuidado con los documentos ya generados."
    },
    {
     "t": "VF01 · clase F2",
     "b": "Factura",
     "m": "control de copia LF → F2",
     "ctrl": "Facturación relacionada con la entrega: la cantidad facturada es la cantidad entregada. El precio puede recalcularse según el tipo de cálculo del control de copia.",
     "integ": "FI: documento contable. CO: margen por cliente y producto. Fiscal: genera la nota fiscal.",
     "effect": "D Cliente / H Ingresos y H Impuestos a pagar (ICMS, PIS, COFINS, IPI según el escenario).",
     "arch": "La factura es el puente con FI. La determinación de cuentas de ingresos está aquí, no en FI."
    },
    {
     "t": "J1BNFE · DRC",
     "b": "NF-e",
     "m": "autorización SEFAZ",
     "ctrl": "La nota fiscal se crea a partir de la factura con el tipo de NF definido para el escenario. Los impuestos vienen de la determinación hecha en el pedido.",
     "integ": "DRC (o GRC en sistemas antiguos) envía el XML y recibe el protocolo de autorización de la SEFAZ.",
     "effect": "Sin nueva contabilización: la nota referencia el documento contable de la factura.",
     "arch": "En Brasil la mercancía solo puede salir con la NF-e autorizada; por eso salida de mercancías, factura y NF-e suelen ejecutarse seguidas. El orden exacto varía por empresa."
    }
   ]
  },
  "servico": {
   "name": "Venta de servicio",
   "note": "Sin entrega: el pedido va directo a la factura.",
   "steps": [
    {
     "t": "VA01 · clase OR",
     "b": "Pedido de cliente",
     "m": "posición de servicio (ej. TAD)",
     "ctrl": "El tipo de posición de servicio no es relevante para entrega y es relevante para facturación relacionada con el pedido.",
     "integ": "Sin ATP de stock. Puede tener plan de facturación (mensual, por hito).",
     "effect": "Sin asiento contable.",
     "arch": "Quien decide si hay entrega es el tipo de posición, no la clase de pedido. El mismo pedido puede tener posiciones de material y de servicio."
    },
    {
     "t": "VF01 · clase F2",
     "b": "Factura",
     "m": "facturación relacionada con el pedido",
     "ctrl": "El control de copia OR → F2 usa la cantidad del pedido, no la entregada.",
     "integ": "FI y CO, como en la venta estándar.",
     "effect": "D Cliente / H Ingresos por servicios e impuestos (ISS, PIS, COFINS).",
     "arch": "Sin salida de mercancías, SD no contabiliza coste. El coste del servicio viene de otro origen (PS, CO, nómina)."
    },
    {
     "t": "NFS-e",
     "b": "Nota de servicio",
     "m": "estándar nacional o municipal",
     "ctrl": "Nota fiscal de servicio brasileña con ISS. El formato depende del municipio o del estándar nacional de la NFS-e.",
     "integ": "Solución de mensajería (DRC o un socio) hasta el ayuntamiento o el entorno nacional.",
     "effect": "Sin nueva contabilización.",
     "arch": "La NFS-e ha sido históricamente lo más heterogéneo de la localización brasileña. Verifique siempre qué solución de transmisión usa el cliente."
    }
   ]
  },
  "devolucao": {
   "name": "Devolución",
   "note": "El cliente devuelve la mercancía y recibe un abono.",
   "steps": [
    {
     "t": "VA01 · clase RE",
     "b": "Pedido de devolución",
     "m": "con referencia a la factura",
     "ctrl": "Se crea con referencia a la factura original y hereda precio e impuestos. Suele nacer con bloqueo de factura hasta la inspección.",
     "integ": "Sin ATP. Puede exigir motivo de pedido (motivo de devolución).",
     "effect": "Sin asiento contable.",
     "arch": "La referencia a la factura garantiza que el abono sale con el mismo precio e impuesto de la venta."
    },
    {
     "t": "VL01N · clase LR",
     "b": "Entrega de devolución",
     "m": "mov. 651",
     "ctrl": "La entrada física usa la clase de movimiento 651, que lleva el material a stock de devoluciones bloqueado.",
     "integ": "MM: entrada de mercancías. QM puede inspeccionar antes de liberar.",
     "effect": "Entrada en stock de devoluciones bloqueado, sin valoración en este movimiento.",
     "arch": "Decidir reutilizar o desguazar es un paso posterior, con traspaso de stock."
    },
    {
     "t": "VF01 · abono",
     "b": "Abono",
     "m": "clase RE",
     "ctrl": "Facturación de abono con referencia al pedido de devolución, liberada al quitar el bloqueo.",
     "integ": "FI y CO, con signo invertido.",
     "effect": "D Ingresos (devolución) e impuestos / H Cliente.",
     "arch": "Una devolución mal parametrizada es fuente clásica de diferencias entre fiscal y contabilidad."
    },
    {
     "t": "J1BNFE",
     "b": "NF de devolución",
     "m": "nota de entrada",
     "ctrl": "Genera la nota de entrada que ampara la devolución, o referencia la NF-e emitida por el cliente, según el escenario.",
     "integ": "Fiscal / DRC.",
     "effect": "Sin nueva contabilización.",
     "arch": "Quién emite la NF de devolución (el cliente o la propia empresa) cambia el escenario fiscal. Confírmelo con el equipo fiscal del cliente."
    }
   ]
  }
 },
 "CHAPTERS": [
  {
   "id": "papel",
   "t": "El papel de SD en el negocio",
   "guide": "¿Qué resuelve SD y qué deja a otros módulos?",
   "body": "<p>SD convierte una negociación con el cliente en mercancía entregada, factura emitida e ingresos contabilizados. Cubre oferta, pedido de cliente, entrega y facturación.</p>\n  <p>Saber lo que <b>no</b> hace es igual de importante. SD no guarda stock (MM), no ejecuta el almacén (EWM), no contabiliza por sí solo (FI) y no emite la nota fiscal por sí mismo (localización Brasil). Genera documentos, y esos documentos disparan el trabajo de los otros módulos.</p>\n  <p>Procesos que cubre el módulo:</p>\n  <ul><li>Venta estándar de mercancía en stock</li><li>Venta de servicio, sin entrega</li><li>Devoluciones, abonos y cargos</li><li>Consignación en el cliente</li><li>Venta a través de terceros (triangular)</li><li>Contratos y planes de entregas</li><li>Bonificación en especie</li></ul>",
   "arch": "En una reunión con el cliente, empiece preguntando cuáles de estos procesos utiliza. Cada uno trae documentos, controles e integraciones distintos, y eso es lo que dimensiona un proyecto de SD.",
   "acts": [
    {
     "q": "¿Quién reduce el stock cuando se vende una mercancía?",
     "o": [
      "SD, directamente en la factura",
      "MM, a partir de la salida de mercancías de la entrega",
      "FI, al contabilizar los ingresos",
      "EWM, siempre"
     ],
     "a": 1,
     "w": "SD genera la entrega; la salida de mercancías crea un documento de material en MM. EWM solo participa cuando el almacén está gestionado por él."
    },
    {
     "q": "¿Cuál de estos NO es un proceso cubierto por SD?",
     "o": [
      "Consignación en el cliente",
      "Venta a través de terceros",
      "Cálculo de la nómina",
      "Devolución"
     ],
     "a": 2,
     "w": "La nómina es HCM. Los otros tres son variantes de venta tratadas en SD."
    }
   ],
   "reflect": "Explique con sus palabras la diferencia entre que SD genere un documento y que SD contabilice."
  },
  {
   "id": "estrutura",
   "t": "Estructura organizativa",
   "guide": "¿Quién vende, por qué canal y desde dónde sale la mercancía?",
   "body": "<p>Todo pedido de cliente pertenece a un <b>área de ventas</b>, que combina tres objetos:</p>\n  <div class=\"org\"><div><b>Organización de ventas</b><span>Responsable legal de la venta. Asignada a una sociedad de FI.</span></div><div><b>Canal de distribución</b><span>Cómo llega el producto al cliente: mayorista, minorista, e-commerce.</span></div><div><b>Sector</b><span>Línea de producto. Permite precios y condiciones distintas por línea.</span></div><div><b>Puesto de expedición</b><span>Donde se procesa la entrega. Viene del centro, la condición de expedición y el grupo de carga.</span></div></div>\n  <p>El <b>centro</b> (de MM) indica desde dónde sale la mercancía. La <b>sociedad</b> (de FI) indica en qué balance entran los ingresos. El área de ventas une la venta a esos dos mundos.</p>",
   "arch": "Cada área de ventas nueva multiplica datos maestros: el cliente necesita datos de ventas para cada combinación en la que compra. Estructuras con muchos canales y sectores son caras de mantener.",
   "acts": [
    {
     "q": "El área de ventas está formada por:",
     "o": [
      "Sociedad + centro + almacén",
      "Organización de ventas + canal de distribución + sector",
      "Organización de ventas + puesto de expedición",
      "Canal + sector + centro"
     ],
     "a": 1,
     "w": "Los tres objetos de ventas. Centro y puesto de expedición pertenecen a la logística, no al área de ventas."
    },
    {
     "q": "¿Qué define en qué balance entran los ingresos de la venta?",
     "o": [
      "El canal de distribución",
      "El puesto de expedición",
      "La sociedad a la que está asignada la organización de ventas",
      "El sector"
     ],
     "a": 2,
     "w": "Una organización de ventas pertenece a una única sociedad."
    }
   ],
   "reflect": "Dibuje (en papel) la estructura de ventas de una empresa que conozca: ¿cuántas organizaciones, canales y sectores tendría?"
  },
  {
   "id": "mestres",
   "t": "Datos maestros",
   "guide": "¿Qué datos maestros consulta el pedido de cliente para completarse solo?",
   "body": "<p>Un pedido bien configurado casi no pide escritura: busca lo que necesita en los datos maestros.</p>\n  <div class=\"tbl\"><table><thead><tr><th>Dato maestro</th><th>Qué usa SD</th><th>Quién más lo comparte</th></tr></thead><tbody>\n  <tr><td>Interlocutor comercial (cliente)</td><td>Datos de área de ventas: moneda, condiciones de pago, funciones de interlocutor (solicitante, destinatario de mercancías, responsable de pago, destinatario de factura)</td><td>FI, Fiscal (CNPJ, IE)</td></tr>\n  <tr><td>Material</td><td>Vistas de ventas: unidad de venta, grupo de tipos de posición, centro suministrador</td><td>MM, PP, EWM, CO</td></tr>\n  <tr><td>Registros de condición</td><td>Precio, descuentos, flete, impuestos</td><td>MM usa la misma técnica</td></tr>\n  <tr><td>Registro info cliente-material</td><td>Número de material del cliente y textos</td><td>—</td></tr></tbody></table></div>\n  <p>En S/4HANA, cliente y proveedor son el mismo objeto, el interlocutor comercial, con roles distintos.</p>",
   "arch": "Los problemas de \"pedido incorrecto\" casi siempre son de datos maestros. Antes de proponer un desarrollo, verifique si el dato maestro está completo para esa área de ventas.",
   "acts": [
    {
     "q": "¿Dónde están las condiciones de pago que el pedido usa por defecto?",
     "o": [
      "En los datos generales del interlocutor",
      "En los datos de área de ventas del interlocutor",
      "En el maestro de materiales",
      "En el registro info"
     ],
     "a": 1,
     "w": "Los datos comerciales varían por área de ventas, por eso están en ese nivel."
    },
    {
     "q": "¿Qué campo del material ayuda a determinar el tipo de posición?",
     "o": [
      "Grupo de artículos",
      "Grupo de tipos de posición",
      "Peso bruto",
      "Clase de valoración"
     ],
     "a": 1,
     "w": "El grupo de tipos de posición (ej. NORM) entra en la determinación del tipo de posición."
    }
   ],
   "reflect": "Enumere tres campos del cliente que, si están mal, causarían problemas en la nota fiscal."
  },
  {
   "id": "anatomia",
   "t": "Anatomía de los documentos",
   "guide": "¿Qué decide el comportamiento de cada documento y de cada posición?",
   "body": "<p>Este es el capítulo central. Cuatro controles explican casi todo lo que hace SD:</p>\n  <div class=\"tbl\"><table><thead><tr><th>Control</th><th>Nivel</th><th>Qué decide</th><th>Ejemplo</th></tr></thead><tbody>\n  <tr><td>Clase de documento</td><td>Cabecera</td><td>Numeración, esquema de cálculo, qué entrega y factura siguen</td><td class=\"mono\">OR, RE, LF, F2</td></tr>\n  <tr><td>Tipo de posición</td><td>Posición</td><td>Si la posición genera entrega, si se factura y con referencia a qué</td><td class=\"mono\">TAN, TAD, TAS, TANN</td></tr>\n  <tr><td>Tipo de reparto</td><td>Reparto</td><td>Enlace con el MRP y clase de movimiento</td><td class=\"mono\">CP, CN</td></tr>\n  <tr><td>Control de copia</td><td>Entre documentos</td><td>Qué documento genera cuál, qué datos se copian, qué verificaciones se ejecutan</td><td class=\"mono\">OR → LF → F2</td></tr></tbody></table></div>\n  <p>El tipo de posición se determina por la clase de documento de ventas, el grupo de tipos de posición del material y, si existen, la utilización y la posición superior. Por eso el mismo pedido puede tener una posición que va a entrega y otra que va directo a factura.</p>\n  <p>Todo queda registrado en el <b>flujo de documentos</b> (tabla VBFA): desde cualquier documento se navega hacia atrás y hacia delante.</p>\n  <div class=\"tbl\"><table><thead><tr><th>Documento</th><th>Tablas</th><th>Transacción</th></tr></thead><tbody>\n  <tr><td>Pedido de cliente</td><td class=\"mono\">VBAK / VBAP / VBEP</td><td class=\"mono\">VA01</td></tr><tr><td>Entrega de salida</td><td class=\"mono\">LIKP / LIPS</td><td class=\"mono\">VL01N</td></tr><tr><td>Factura</td><td class=\"mono\">VBRK / VBRP</td><td class=\"mono\">VF01</td></tr></tbody></table></div>",
   "arch": "Cuando aparece un requisito nuevo, la primera pregunta es: ¿cabe en una nueva clase de documento o tipo de posición? Si cabe, es configuración. Muchas propuestas de ABAP nacen de no hacer esa pregunta.",
   "acts": [
    {
     "q": "¿Quién decide si una posición genera entrega?",
     "o": [
      "La clase de pedido",
      "El tipo de posición",
      "El centro",
      "El cliente"
     ],
     "a": 1,
     "w": "La relevancia para entrega es una propiedad del tipo de posición."
    },
    {
     "q": "El control de copia define:",
     "o": [
      "El precio del material",
      "Qué documentos pueden generar cuáles y qué datos se copian",
      "La numeración del pedido",
      "El centro suministrador"
     ],
     "a": 1,
     "w": "Ejemplo: OR puede generar LF; una oferta QT puede convertirse en OR, pero no en una solicitud de abono."
    }
   ],
   "reflect": "Explique por qué el mismo pedido puede tener una posición con entrega y otra sin."
  },
  {
   "id": "padrao",
   "t": "Venta estándar, paso a paso",
   "guide": "¿Qué ocurre, en cada módulo, desde el pedido hasta la NF-e?",
   "widget": "flow",
   "body": "<p>Con los controles del capítulo anterior en mente, siga el flujo haciendo clic en cada documento. Observe cuándo entra cada módulo y cuándo aparece el primer asiento contable.</p>",
   "arch": "El primer asiento contable solo aparece en la salida de mercancías. Hasta ahí, pedido y entrega son documentos logísticos. Por eso anular una entrega es sencillo y anular después de facturar no lo es.",
   "acts": [
    {
     "q": "¿En qué momento se contabiliza el coste de las ventas?",
     "o": [
      "En el pedido",
      "En la entrega",
      "En la salida de mercancías",
      "En la NF-e"
     ],
     "a": 2,
     "w": "La clase de movimiento 601 reduce el stock y contabiliza el coste contra stock."
    },
    {
     "q": "En la facturación relacionada con la entrega, ¿de dónde viene la cantidad facturada?",
     "o": [
      "Del pedido",
      "De la cantidad entregada",
      "Del pedido de compra del cliente",
      "Del registro de condición"
     ],
     "a": 1,
     "w": "Por eso las entregas parciales generan facturas parciales."
    }
   ],
   "reflect": "Cuente el recorrido de una venta como si se lo explicara a alguien del área comercial, sin usar nombres de transacciones.",
   "flowKey": "padrao",
   "order": true
  },
  {
   "id": "variacoes",
   "t": "Variantes del proceso",
   "guide": "¿Qué cambia cuando la venta no es la estándar?",
   "widget": "flow",
   "body": "<p>Las variantes casi siempre cambian por el <b>tipo de posición</b>. El resto del flujo se adapta a él.</p>\n  <div class=\"tbl\"><table><thead><tr><th>Escenario</th><th>Tipo</th><th>Entrega</th><th>Facturación</th><th>Qué cambia</th></tr></thead><tbody>\n  <tr><td>Servicio</td><td class=\"mono\">TAD</td><td>No</td><td>Relacionada con el pedido</td><td>Sin stock y sin coste desde SD</td></tr>\n  <tr><td>Venta a través de terceros</td><td class=\"mono\">TAS</td><td>No (entrega el proveedor)</td><td>Relacionada con el pedido</td><td>El pedido genera una solicitud de pedido; el proveedor entrega directo al cliente</td></tr>\n  <tr><td>Bonificación en especie</td><td class=\"mono\">TANN</td><td>Sí</td><td>No</td><td>Posición sin precio, pero con salida de stock y efecto fiscal</td></tr>\n  <tr><td>Consignación: reposición</td><td class=\"mono\">KB</td><td>Sí</td><td>No</td><td>El stock va al cliente pero sigue siendo de la empresa</td></tr>\n  <tr><td>Consignación: salida</td><td class=\"mono\">KE</td><td>Sí</td><td>Sí</td><td>Solo aquí nacen los ingresos</td></tr>\n  <tr><td>Devolución</td><td class=\"mono\">REN</td><td>Sí (entrada)</td><td>Abono</td><td>Entrada en stock de devoluciones bloqueado (mov. 651)</td></tr></tbody></table></div>\n  <p>Use los escenarios de servicio y devolución en el flujo de abajo para comparar con la venta estándar.</p>",
   "arch": "Las variantes son donde más pesa la fiscalidad brasileña: bonificación, consignación y devolución tienen CFOP y tratamiento propios. Valídelo siempre con el equipo fiscal del cliente.",
   "acts": [
    {
     "q": "En la venta a través de terceros, ¿quién entrega la mercancía al cliente?",
     "o": [
      "El centro de la empresa",
      "El proveedor, a partir de un pedido de compras generado por el pedido de cliente",
      "EWM",
      "El transportista, sin documento"
     ],
     "a": 1,
     "w": "El tipo de posición TAS genera una solicitud de pedido; el proveedor entrega directamente."
    },
    {
     "q": "¿En qué paso de la consignación se reconocen los ingresos?",
     "o": [
      "Reposición (KB)",
      "Salida (KE)",
      "Recogida (KA)",
      "Devolución en consignación (KR)"
     ],
     "a": 1,
     "w": "En la reposición el stock sigue siendo de la empresa. La venta ocurre en la salida."
    }
   ],
   "reflect": "Elija un cliente real (sin identificarlo) y diga qué variantes usa y por qué.",
   "flowKey": "servico"
  },
  {
   "id": "preco",
   "t": "Precios e impuestos",
   "guide": "¿Cómo llega el pedido al precio y a los impuestos sin escribirlos?",
   "body": "<p>SD usa la <b>técnica de condiciones</b>, la misma que MM:</p>\n  <ol><li>El <b>esquema de cálculo</b> se elige por área de ventas, esquema del documento y esquema del cliente.</li><li>El esquema lista las <b>clases de condición</b> en orden de cálculo (precio, descuentos, flete, impuestos).</li><li>Cada clase de condición tiene una <b>secuencia de acceso</b>, que indica en qué orden buscar los registros (ej.: cliente + material, después solo material).</li><li>Los <b>registros de condición</b> aportan el valor.</li></ol>\n  <p>En S/4HANA la condición de precio estándar pasó a ser <span class=\"mono\">PPR0</span> (en ECC era <span class=\"mono\">PR00</span>).</p>\n  <p>En Brasil, el pedido también determina código de impuesto, CFOP y las leyes fiscales de ICMS, IPI, PIS y COFINS por posición. La nota fiscal lo hereda a través de la factura. Un error de impuesto en la NF casi siempre empieza en el pedido.</p>",
   "arch": "Antes de aceptar \"necesitamos un cálculo de precio a medida\", pregunte si no es solo una nueva tabla de condiciones o secuencia de acceso. La técnica de condiciones resuelve la mayoría de las políticas comerciales.",
   "acts": [
    {
     "q": "¿Para qué sirve la secuencia de acceso?",
     "o": [
      "Definir la numeración de documentos",
      "Definir el orden de búsqueda de los registros de condición",
      "Definir el puesto de expedición",
      "Liberar el bloqueo de crédito"
     ],
     "a": 1,
     "w": "Va de lo más específico a lo más genérico hasta encontrar un registro válido."
    },
    {
     "q": "¿Dónde se determina primero el CFOP?",
     "o": [
      "En la NF-e",
      "En la posición del pedido",
      "En FI",
      "En la entrega"
     ],
     "a": 1,
     "w": "El pedido lo determina; factura y nota fiscal lo heredan."
    }
   ],
   "reflect": "Describa la política de precios de un cliente y cómo encajaría en la técnica de condiciones."
  },
  {
   "id": "s4",
   "t": "S/4HANA y límites del estándar",
   "guide": "¿Qué cambió y dónde el estándar suele no bastar?",
   "body": "<div class=\"tbl\"><table><thead><tr><th>Tema</th><th>ECC</th><th>S/4HANA</th></tr></thead><tbody>\n  <tr><td>Cliente</td><td>Maestro de clientes (KNA1)</td><td>Interlocutor comercial obligatorio, vía CVI</td></tr>\n  <tr><td>Status</td><td>Tablas VBUK / VBUP</td><td>Campos de status en las propias cabeceras y posiciones</td></tr>\n  <tr><td>Crédito</td><td>Gestión de créditos clásica de SD</td><td>SAP Credit Management (FIN-FSCM)</td></tr>\n  <tr><td>Rappels</td><td>Acuerdos de rappel</td><td>Condition Contract Settlement</td></tr>\n  <tr><td>Mensajes</td><td>NAST</td><td>Output Management con BRF+ (NAST sigue soportado)</td></tr>\n  <tr><td>Contabilidad</td><td>FI y CO separados</td><td>Documento universal (ACDOCA)</td></tr>\n  <tr><td>Almacén</td><td>WM clásico</td><td>EWM como dirección estratégica</td></tr></tbody></table></div>\n  <p><b>Donde el estándar funciona bien:</b> flujos flexibles por clases y tipos, técnica de condiciones, trazabilidad en el flujo de documentos, integración nativa con FI, CO, MM y Fiscal.</p>\n  <p><b>Donde suele pedir extensión:</b> reglas de aprobación muy específicas, precios dinámicos fuera de la técnica de condiciones, canales de venta externos, escenarios fiscales poco comunes (tratados con BAdI de la localización).</p>",
   "arch": "Orden de evaluación: configuración, después extensión key-user, después side-by-side en BTP, y solo al final ABAP en el núcleo. Es el razonamiento de Clean Core.",
   "acts": [
    {
     "q": "¿Qué sustituye a la gestión de créditos clásica de SD en S/4HANA?",
     "o": [
      "Nada, se mantiene",
      "SAP Credit Management (FIN-FSCM)",
      "Ariba",
      "Un BAdI obligatorio"
     ],
     "a": 1,
     "w": "Consta en la Simplification List."
    },
    {
     "q": "¿Cuál es el orden de evaluación en Clean Core?",
     "o": [
      "ABAP, después configuración",
      "Configuración, extensión key-user, side-by-side y por último ABAP en el núcleo",
      "Side-by-side siempre primero",
      "Key-user solo en nube pública"
     ],
     "a": 1,
     "w": "Cuanto más cerca del estándar, menor el coste de actualización."
    }
   ],
   "reflect": "Piense en un desarrollo ABAP que haya visto en SD. ¿Podría haberse resuelto con configuración?"
  }
 ],
 "THEMES": [
  {
   "id": "org",
   "t": "Estructura y datos maestros",
   "qs": [
    {
     "q": "El área de ventas está formada por:",
     "o": [
      "Organización de ventas + canal + sector",
      "Sociedad + centro + almacén",
      "Organización de ventas + centro",
      "Canal + sector + puesto de expedición"
     ],
     "a": 0,
     "w": "Los tres objetos de ventas."
    },
    {
     "q": "¿A qué objeto de FI está asignada la organización de ventas?",
     "o": [
      "Centro de coste",
      "Sociedad",
      "Sociedad CO",
      "Segmento"
     ],
     "a": 1,
     "w": "Cada organización de ventas pertenece a una sociedad."
    },
    {
     "q": "La moneda y las condiciones de pago de la venta están en:",
     "o": [
      "Datos generales del interlocutor",
      "Datos de área de ventas del interlocutor",
      "Maestro de materiales",
      "Registro info"
     ],
     "a": 1,
     "w": "Varían por área de ventas."
    },
    {
     "q": "El puesto de expedición se determina a partir de:",
     "o": [
      "Cliente y canal",
      "Centro, condición de expedición y grupo de carga",
      "Organización de ventas",
      "Clase de pedido"
     ],
     "a": 1,
     "w": "Es la regla de determinación estándar."
    }
   ]
  },
  {
   "id": "docs",
   "t": "Documentos y controles",
   "qs": [
    {
     "q": "¿Quién decide si una posición genera entrega?",
     "o": [
      "Clase de pedido",
      "Tipo de posición",
      "Centro",
      "Cliente"
     ],
     "a": 1,
     "w": "La relevancia para entrega es del tipo de posición."
    },
    {
     "q": "El tipo de posición se determina por:",
     "o": [
      "Solo la clase de documento",
      "Clase de documento + grupo de tipos de posición (+ utilización, posición superior)",
      "El cliente",
      "El centro"
     ],
     "a": 1,
     "w": "Por eso posiciones distintas del mismo pedido se comportan distinto."
    },
    {
     "q": "El tipo de reparto enlaza la posición con:",
     "o": [
      "Precio",
      "MRP y clase de movimiento",
      "Crédito",
      "NF-e"
     ],
     "a": 1,
     "w": "Ej.: CP con MRP, CN sin planificación."
    },
    {
     "q": "¿Dónde se ve el historial pedido → entrega → factura?",
     "o": [
      "BSEG",
      "Flujo de documentos (VBFA)",
      "MSEG",
      "Log de modificaciones"
     ],
     "a": 1,
     "w": "Navegable desde cualquier documento."
    }
   ]
  },
  {
   "id": "fluxos",
   "t": "Flujos y variantes",
   "qs": [
    {
     "q": "Una venta de servicio normalmente usa:",
     "o": [
      "Pedido, entrega y factura",
      "Pedido y factura",
      "Solo factura",
      "Pedido y entrega"
     ],
     "a": 1,
     "w": "Una posición de servicio no es relevante para entrega."
    },
    {
     "q": "El tipo de posición TAS indica:",
     "o": [
      "Bonificación",
      "Venta a través de terceros",
      "Consignación",
      "Servicio"
     ],
     "a": 1,
     "w": "Genera una solicitud de pedido para que el proveedor entregue directamente."
    },
    {
     "q": "En la consignación, la facturación nace en la:",
     "o": [
      "Reposición KB",
      "Salida KE",
      "Recogida KA",
      "Devolución KR"
     ],
     "a": 1,
     "w": "Solo la salida es una venta."
    },
    {
     "q": "La entrada física de una devolución usa la clase de movimiento:",
     "o": [
      "601",
      "651",
      "101",
      "261"
     ],
     "a": 1,
     "w": "Va a stock de devoluciones bloqueado."
    }
   ]
  },
  {
   "id": "preco",
   "t": "Precios e impuestos",
   "qs": [
    {
     "q": "El esquema de cálculo se elige por:",
     "o": [
      "Material",
      "Área de ventas + esquema del documento + esquema del cliente",
      "Centro",
      "Clase de entrega"
     ],
     "a": 1,
     "w": "Es la clave de determinación."
    },
    {
     "q": "La secuencia de acceso define:",
     "o": [
      "El orden de búsqueda de los registros de condición",
      "La numeración",
      "El CFOP",
      "El centro"
     ],
     "a": 0,
     "w": "De lo más específico a lo más genérico."
    },
    {
     "q": "Condición de precio estándar en S/4HANA:",
     "o": [
      "PR00",
      "PPR0",
      "K004",
      "MWST"
     ],
     "a": 1,
     "w": "PR00 era el estándar en ECC."
    },
    {
     "q": "Un error de CFOP en la NF-e normalmente empieza:",
     "o": [
      "En DRC",
      "En el pedido de cliente",
      "En FI",
      "En la entrega"
     ],
     "a": 1,
     "w": "El pedido lo determina; la nota lo hereda."
    }
   ]
  },
  {
   "id": "integ",
   "t": "Integración",
   "qs": [
    {
     "q": "La salida de mercancías contabiliza:",
     "o": [
      "D Cliente / H Ingresos",
      "D Coste de las ventas / H Stock",
      "D Stock / H EM/RF",
      "Nada"
     ],
     "a": 1,
     "w": "Clase de movimiento 601."
    },
    {
     "q": "Las cuentas de ingresos de la factura vienen de:",
     "o": [
      "Contabilización manual en FI",
      "Determinación de cuentas de SD",
      "Determinación de cuentas de MM",
      "CO"
     ],
     "a": 1,
     "w": "Se configura en SD, no en FI."
    },
    {
     "q": "Con EWM, ¿quién confirma el picking?",
     "o": [
      "SD en el pedido",
      "EWM, que devuelve el status a la entrega",
      "FI",
      "El cliente"
     ],
     "a": 1,
     "w": "La entrega se replica como documento de salida en EWM."
    },
    {
     "q": "En fabricación sobre pedido, el pedido de cliente:",
     "o": [
      "No tiene relación con PP",
      "Genera stock especial vinculado a la posición del pedido",
      "Genera la factura directamente",
      "Bloquea el MRP"
     ],
     "a": 1,
     "w": "El producto queda reservado para esa venta."
    }
   ]
  },
  {
   "id": "s4",
   "t": "S/4HANA",
   "qs": [
    {
     "q": "FI y CO graban juntos en la tabla:",
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
     "q": "La gestión de créditos clásica de SD fue sustituida por:",
     "o": [
      "SAP Credit Management",
      "Ariba",
      "BRF+",
      "Nada"
     ],
     "a": 0,
     "w": "FIN-FSCM."
    },
    {
     "q": "El status de los pedidos en S/4HANA está:",
     "o": [
      "En VBUK/VBUP",
      "En las propias cabeceras y posiciones",
      "En VBFA",
      "En una tabla Z"
     ],
     "a": 1,
     "w": "VBUK/VBUP se eliminaron."
    },
    {
     "q": "Los rappels de SD pasaron a:",
     "o": [
      "Condition Contract Settlement",
      "Credit Management",
      "Output Management",
      "EWM"
     ],
     "a": 0,
     "w": "Los acuerdos de rappel clásicos no siguen en S/4."
    }
   ]
  }
 ],
 "INTEG": [
  {
   "k": "MM",
   "n": "MM",
   "sub": "Stock",
   "dir": "SD ↔ MM",
   "step": "Pedido (disponibilidad) y salida de mercancías",
   "what": "El pedido consulta stock y entradas planificadas (ATP). La salida de mercancías crea un documento de material con clase de movimiento 601 en el centro y almacén de la entrega.",
   "varies": "Consignación y fabricación sobre pedido usan stock especial. La venta a través de terceros (TAS) crea una solicitud de pedido desde el pedido de cliente."
  },
  {
   "k": "EWM",
   "n": "EWM",
   "sub": "Almacén",
   "dir": "SD → EWM → SD",
   "step": "Entrega de salida",
   "what": "La entrega se replica como pedido de entrega de salida en EWM, que crea tareas de almacén, hace picking y embalaje y devuelve la confirmación y la salida de mercancías.",
   "varies": "Sin gestión de almacenes, el picking se confirma en la propia entrega. En ECC con WM clásico, mediante órdenes de transporte. EWM puede ser embedded o descentralizado."
  },
  {
   "k": "FI",
   "n": "FI",
   "sub": "Contabilidad",
   "dir": "SD → FI",
   "step": "Salida de mercancías y factura",
   "what": "Salida de mercancías: D Coste de las ventas / H Stock. Factura: D Cliente / H Ingresos e impuestos. Las cuentas de ingresos vienen de la determinación de cuentas de SD.",
   "varies": "Los ingresos diferidos en contratos usan Revenue Accounting. Algunas empresas facturan antes de la salida física."
  },
  {
   "k": "CO",
   "n": "CO",
   "sub": "Margen",
   "dir": "SD → CO",
   "step": "Factura y salida de mercancías",
   "what": "Ingresos, descuentos y coste de las ventas llegan al análisis de márgenes con características como cliente, material y región.",
   "varies": "En S/4HANA el análisis de márgenes (contable) es el estándar; la versión basada en costes aún existe en clientes que migraron."
  },
  {
   "k": "FISCAL",
   "n": "Fiscal BR",
   "sub": "NF-e",
   "dir": "SD → Fiscal → SEFAZ",
   "step": "Factura",
   "what": "La factura crea la nota fiscal (J_1BNFDOC / J_1BNFLIN) con CFOP e impuestos determinados en el pedido. DRC envía el XML y recibe la autorización.",
   "varies": "Producto (NF-e) y servicio (NFS-e) siguen caminos distintos. La reforma tributaria trae IBS y CBS al documento."
  },
  {
   "k": "PP",
   "n": "PP",
   "sub": "Producción",
   "dir": "SD → PP",
   "step": "Pedido (reparto)",
   "what": "Un reparto con MRP transfiere la necesidad a la planificación. En fabricación sobre pedido, el pedido se convierte en objeto de stock y de coste.",
   "varies": "Fabricación contra stock, sobre pedido y producto configurable (configuración de variantes) cambian mucho la integración."
  },
  {
   "k": "CRED",
   "n": "Crédito",
   "sub": "FIN-FSCM",
   "dir": "SD ↔ Credit Mgmt",
   "step": "Pedido y entrega",
   "what": "La verificación de crédito puede bloquear el pedido o la entrega según la exposición y el límite del cliente.",
   "varies": "Reglas por segmento de crédito y clase de documento. En ECC era la gestión de créditos clásica de SD."
  },
  {
   "k": "PS",
   "n": "PS",
   "sub": "Proyectos",
   "dir": "SD ↔ PS",
   "step": "Pedido vinculado a elemento PEP",
   "what": "Posiciones del pedido vinculadas a un elemento PEP; ingresos y costes se analizan en el proyecto. Facturación por hito o plan de facturación.",
   "varies": "Común en ingeniería y servicios bajo contrato. Raro en retail y distribución."
  }
 ],
 "CARDS": [
  {
   "id": "c1",
   "f": "Área de ventas",
   "b": "Organización de ventas + canal de distribución + sector. Todo pedido de cliente pertenece a un área de ventas.",
   "mod": "SD"
  },
  {
   "id": "c2",
   "f": "Control de copia",
   "b": "Reglas que indican qué documento puede generar cuál (OR → LF → F2), qué datos se copian y qué verificaciones se ejecutan.",
   "mod": "SD"
  },
  {
   "id": "c3",
   "f": "Tipo de posición",
   "b": "Define, por posición, si hay entrega, si hay facturación y con referencia a qué (pedido o entrega).",
   "mod": "SD"
  },
  {
   "id": "c4",
   "f": "Clase de movimiento 601",
   "b": "Salida de mercancías para entrega de venta. Reduce stock y contabiliza el coste de las ventas.",
   "mod": "SD/MM"
  },
  {
   "id": "c5",
   "f": "Puesto de expedición",
   "b": "Lugar que procesa la entrega. Se determina a partir del centro, la condición de expedición y el grupo de carga.",
   "mod": "SD"
  },
  {
   "id": "c7",
   "f": "Interlocutor comercial",
   "b": "Objeto único para cliente y proveedor en S/4HANA (CVI sincroniza con KNA1/LFA1).",
   "mod": "Fundamentos"
  },
  {
   "id": "c9",
   "f": "DRC",
   "b": "Document and Reporting Compliance: solución SAP para mensajería de documentos fiscales electrónicos y obligaciones legales.",
   "mod": "Fiscal BR"
  },
  {
   "id": "c10",
   "f": "Facturación relacionada con el pedido",
   "b": "La factura usa la cantidad del pedido. Típico de servicios y planes de facturación.",
   "mod": "SD"
  }
 ],
 "CHALLENGE": {
  "title": "Equipo e instalación en la misma venta",
  "ctx": "Un distribuidor de equipos vende el equipo y la instalación en la misma negociación. Quiere un único pedido de cliente, entregar el equipo ya y facturar la instalación solo cuando el técnico termine. Hoy el equipo piensa en un desarrollo ABAP.",
  "q": "¿Qué diseño propone?",
  "o": [
   {
    "t": "Dos pedidos separados, uno por tipo de venta.",
    "s": 1,
    "w": "Funciona, pero rompe la visión comercial única y duplica precio, crédito y aprobación. Resuelve el síntoma, no lo que se pidió."
   },
   {
    "t": "Un pedido con una posición de material (relevante para entrega) y una de servicio con facturación relacionada con el pedido, bloqueada hasta la conclusión.",
    "s": 3,
    "w": "Estándar SAP. El tipo de posición resuelve la diferencia entre posiciones; el bloqueo de factura en la posición retiene la instalación hasta la aceptación. Sin desarrollo."
   },
   {
    "t": "Desarrollo ABAP que divide el pedido al grabar.",
    "s": 0,
    "w": "Añade código para algo que el estándar ya hace. Va contra Clean Core y genera coste de mantenimiento en cada actualización."
   },
   {
    "t": "Llevar la instalación a SAP Service y facturar allí.",
    "s": 2,
    "w": "Tiene sentido si hay gestión de técnicos, agenda y notificación de tiempos. Para una simple aceptación es más solución de la que pide el problema."
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
