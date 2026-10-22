(MOD.mm=MOD.mm||{}).es={
name:'MM · Gestión de materiales', short:'Gestión de materiales',
lead:'De la necesidad de compra al pago al proveedor: documentos, controles, valoración de stock y dónde MM entrega trabajo a FI, CO y logística.',
ORDER:['Solicitud de pedido','Pedido de compras','Entrada de mercancías','Verificación de facturas','Pago'],
FLOWS:{
 padrao:{name:'Compra para stock', note:'Material con stock, pedido con precio del registro info.', steps:[
  {t:'ME51N · clase NB', b:'Solicitud de pedido', m:'manual o generada por el MRP',
   ctrl:'La clase de documento define numeración y campos. La solicitud puede venir del MRP o crearla el solicitante, con o sin imputación.',
   integ:'PP/MRP genera solicitudes automáticamente. Con imputación, CO puede registrar un compromiso.',
   effect:'Sin asiento contable.',
   arch:'La solicitud es el pedido interno. Muchas empresas la omiten en compras recurrentes con contrato o plan de entregas.'},
  {t:'ME21N · clase NB', b:'Pedido de compras', m:'precio del registro info',
   ctrl:'La clase de documento y el tipo de posición definen el comportamiento. Precio, condiciones de pago e incoterms vienen del registro info y del proveedor. La aprobación usa estrategia de liberación o workflow flexible.',
   integ:'El proveedor recibe el pedido (impresión, EDI, Ariba). CO registra compromiso cuando hay imputación.',
   effect:'Sin asiento contable. Puede generar compromiso en el presupuesto.',
   arch:'El pedido es el documento jurídico con el proveedor. Aquí quedan fijados precio y condiciones para la verificación de facturas.'},
  {t:'MIGO · mov. 101', b:'Entrada de mercancías', m:'el stock aumenta',
   ctrl:'Clase de movimiento 101 con referencia al pedido. La determinación de cuentas usa la categoría de valoración del material (claves BSX y WRX).',
   integ:'QM puede abrir un lote de inspección; EWM ejecuta la entrada física. Fiscal: la NF-e del proveedor acompaña la mercancía.',
   effect:'D Stock / H EM/RF, por el valor del pedido.',
   arch:'El valor de la entrada es el del pedido, no el de la factura. La cuenta EM/RF queda abierta hasta que llega la factura.'},
  {t:'MIRO', b:'Verificación de facturas', m:'pedido × entrada × factura',
   ctrl:'Verificación a tres bandas: cantidad y precio de la factura contra pedido y entrada. Fuera de tolerancia, la factura queda bloqueada para el pago.',
   integ:'FI: partida abierta del proveedor. Fiscal: impuestos de la nota de entrada (ICMS, IPI, PIS, COFINS).',
   effect:'D EM/RF e impuestos a recuperar / H Proveedor.',
   arch:'Las facturas bloqueadas por diferencias son uno de los mayores cuellos de botella de cuentas a pagar. Unas tolerancias bien definidas evitan retrabajo.'},
  {t:'F110', b:'Pago', m:'programa de pagos automático',
   ctrl:'FI selecciona partidas vencidas por vía de pago y banco, genera la propuesta, la ejecuta y crea el fichero bancario.',
   integ:'Bancos: fichero de envío y retorno (en Brasil, CNAB o API del banco).',
   effect:'D Proveedor / H Banco (o cuenta transitoria hasta el extracto).',
   arch:'El pago ya es FI. MM termina en la verificación de facturas; el proceso completo solo se cierra aquí.'}
 ]},
 servico:{name:'Compra de servicio', note:'Sin stock: la aceptación del servicio sustituye a la entrada de mercancías.', steps:[
  {t:'ME21N · posición D', b:'Pedido de servicio', m:'líneas de servicio · imputación',
   ctrl:'Tipo de posición de servicio con líneas de servicio e imputación obligatoria (centro de coste, orden, proyecto).',
   integ:'CO: compromiso en el objeto de coste.',
   effect:'Sin asiento contable.',
   arch:'El servicio casi siempre es consumo directo. La imputación decide quién paga en CO.'},
  {t:'Hoja de entrada', b:'Aceptación del servicio', m:'equivale a la entrada',
   ctrl:'El responsable registra lo ejecutado y lo aprueba. La aceptación contabiliza como si fuera una entrada.',
   integ:'CO: coste real en el objeto imputado.',
   effect:'D Gasto (en el objeto de coste) / H EM/RF.',
   arch:'Sin aceptación formal, la factura llega antes del registro y se bloquea. El proceso de aceptación importa tanto como el pedido.'},
  {t:'MIRO', b:'Verificación de facturas', m:'contra la aceptación',
   ctrl:'La factura se verifica con el valor aceptado.',
   integ:'FI y Fiscal: nota de servicio (NFS-e) y retenciones (ISS, IR, PIS, COFINS, CSLL, INSS según el caso).',
   effect:'D EM/RF / H Proveedor y H Retenciones a pagar.',
   arch:'Las retenciones en origen son un punto sensible en Brasil. Dependen del servicio, el municipio y el régimen del proveedor.'}
 ]},
 subcontratacao:{name:'Subcontratación', note:'El proveedor transforma componentes enviados por la empresa.', steps:[
  {t:'ME21N · posición L', b:'Pedido de subcontratación', m:'producto final + componentes',
   ctrl:'Tipo de posición L. El pedido incluye el producto a recibir y los componentes a suministrar.',
   integ:'PP: la lista de materiales define los componentes. El MRP ve la necesidad de componentes en el proveedor.',
   effect:'Sin asiento contable.',
   arch:'El proveedor cobra solo el servicio. El material sigue siendo de la empresa hasta convertirse en producto.'},
  {t:'MB1B / MIGO · mov. 541', b:'Suministro de componentes', m:'stock en el proveedor',
   ctrl:'Traspaso a stock especial en el proveedor. El material sigue en el stock valorado de la empresa.',
   integ:'Fiscal: nota de envío para industrialización.',
   effect:'Sin cambio de valor: solo cambia el tipo de stock.',
   arch:'Controlar el stock en terceros es esencial para el inventario y para el fiscal (envío y retorno).'},
  {t:'MIGO · 101 + 543', b:'Entrada del producto', m:'consumo automático de componentes',
   ctrl:'La entrada del producto (101) consume automáticamente los componentes del stock en el proveedor (543).',
   integ:'CO: el coste del producto incluye componentes y servicio.',
   effect:'D Stock del producto / H Consumo de componentes y H EM/RF del servicio.',
   arch:'Las diferencias de consumo (mermas en el proveedor) necesitan ajuste. Acuerde la regla antes de implantar.'},
  {t:'MIRO', b:'Factura del servicio', m:'solo el valor de industrialización',
   ctrl:'La factura cubre el servicio del proveedor, verificada contra pedido y entrada.',
   integ:'FI y Fiscal: nota de retorno con el cobro de la industrialización.',
   effect:'D EM/RF / H Proveedor.',
   arch:'En Brasil el retorno tiene tratamiento fiscal propio. Valídelo con el equipo fiscal del cliente.'}
 ]}
},
CHAPTERS:[
 {id:'papel', t:'El papel de MM en el negocio', guide:'¿Qué resuelve MM y qué deja a otros módulos?',
  body:`<p>MM cubre tres grandes frentes: <b>compras</b> (solicitud, oferta, pedido, contratos), <b>gestión de stocks</b> (entradas, salidas, traspasos, inventario) y <b>verificación de facturas</b> del proveedor. También guarda la valoración del stock.</p>
  <p>Lo que no hace: no paga al proveedor (FI), no planifica la producción en detalle (PP), no ejecuta el almacén a nivel de ubicación y tarea (EWM) y no emite la nota fiscal por sí solo (localización Brasil).</p>
  <p>Procesos que cubre el módulo:</p>
  <ul><li>Compra de material para stock</li><li>Compra para consumo directo (centro de coste, orden, proyecto)</li><li>Compra de servicios</li><li>Subcontratación</li><li>Consignación de proveedor</li><li>Traslado entre centros</li><li>Inventario físico</li></ul>`,
  arch:'Pregunte pronto cuánto volumen es compra directa (productiva) y cuánto indirecta, y si existe Ariba o un portal de proveedores. Eso cambia el diseño de aprobación, catálogo e integración.',
  acts:[
   {q:'¿Quién paga al proveedor?', o:['MM, en la MIRO','FI, con el programa de pagos','El comprador, en el pedido','EWM'], a:1, w:'La MIRO registra la factura y crea la partida abierta. El pago es FI.'},
   {q:'¿Cuál de estos NO es un proceso de MM?', o:['Inventario físico','Subcontratación','Facturación al cliente','Compra de servicios'], a:2, w:'La facturación al cliente es SD.'}],
  reflect:'Explique con sus palabras la diferencia entre que la MIRO registre la factura y que FI pague al proveedor.'},
 {id:'estrutura', t:'Estructura organizativa', guide:'¿Quién compra, para qué centro y dónde está el stock?',
  body:`<div class="org"><div><b>Organización de compras</b><span>Negocia con proveedores y responde de las condiciones. Puede atender uno o varios centros.</span></div><div><b>Grupo de compras</b><span>El comprador o el equipo responsable. No se asigna a otras unidades.</span></div><div><b>Centro</b><span>Donde el material se produce, almacena o consume. Asignado a una sociedad de FI.</span></div><div><b>Almacén</b><span>Subdivisión del centro donde está físicamente el stock.</span></div></div>
  <p>El <b>centro</b> suele ser el nivel de valoración: el mismo material puede tener precios distintos en centros distintos. La sociedad del centro define en qué balance aparece el stock.</p>`,
  arch:'Organización de compras central o por centro es una decisión temprana: cambia quién negocia, dónde están contratos y registros info y cómo se mide el ahorro.',
  acts:[
   {q:'¿Qué hay entre el centro y el stock físico?', o:['Almacén','Organización de compras','Grupo de compras','Sociedad'], a:0, w:'El almacén subdivide el centro.'},
   {q:'El grupo de compras representa:', o:['La sociedad','El comprador o el equipo responsable','El almacén','El proveedor'], a:1, w:'Es quien lleva la compra en el día a día.'}],
  reflect:'Una empresa tiene 5 fábricas. ¿Usaría una organización de compras central o una por fábrica? ¿Por qué?'},
 {id:'mestres', t:'Datos maestros', guide:'¿Qué datos maestros hacen que el pedido nazca casi listo?',
  body:`<div class="tbl"><table><thead><tr><th>Dato maestro</th><th>Qué usa MM</th><th>Quién más lo comparte</th></tr></thead><tbody>
  <tr><td>Interlocutor comercial (proveedor)</td><td>Datos por organización de compras: moneda, condiciones de pago, incoterms, verificación de facturas basada en la entrada</td><td>FI (cuenta asociada, vía de pago), Fiscal</td></tr>
  <tr><td>Material</td><td>Vistas de compras, MRP y contabilidad: grupo de artículos, categoría de valoración, control de precios</td><td>SD, PP, EWM, CO</td></tr>
  <tr><td>Registro info de compras</td><td>Precio y condiciones del par proveedor × material × organización de compras</td><td>—</td></tr>
  <tr><td>Libro de pedidos y contratos</td><td>Fuentes permitidas y contratos marco con cantidad o valor</td><td>El MRP los usa para asignar la fuente</td></tr></tbody></table></div>
  <p>En el pedido, dirección y condiciones de pago vienen del proveedor; texto, unidad y grupo de artículos vienen del material; el precio negociado viene del registro info.</p>`,
  arch:'La categoría de valoración del material define las cuentas contables de la entrada a stock. Un error de dato maestro aquí se convierte en un error contable silencioso.',
  acts:[
   {q:'¿De dónde viene el precio negociado en el pedido?', o:['Maestro de materiales','Interlocutor comercial','Registro info de compras','Centro'], a:2, w:'El registro info guarda precio y condiciones por proveedor y material.'},
   {q:'¿Qué campo del material define la cuenta de stock?', o:['Grupo de artículos','Categoría de valoración','Grupo de compras','Unidad de medida'], a:1, w:'La categoría de valoración entra en la determinación de cuentas.'}],
  reflect:'Enumere tres campos del proveedor que afectan al pago.'},
 {id:'anatomia', t:'Documentos y controles', guide:'¿Qué decide el comportamiento de cada documento y posición de compra?',
  body:`<div class="tbl"><table><thead><tr><th>Control</th><th>Qué decide</th><th>Ejemplo</th></tr></thead><tbody>
  <tr><td>Clase de documento</td><td>Numeración, campos, tipos de posición permitidos</td><td class="mono">NB</td></tr>
  <tr><td>Tipo de posición</td><td>Comportamiento de la posición: stock, consignación, subcontratación, terceros, traslado, servicio</td><td class="mono">(vacío), K, L, S, U, D</td></tr>
  <tr><td>Tipo de imputación</td><td>Si va a stock o a consumo directo, y en qué objeto</td><td class="mono">K centro de coste, F orden, P proyecto, A activo fijo</td></tr>
  <tr><td>Clase de movimiento</td><td>Qué ocurre con el stock y con la contabilidad</td><td class="mono">101, 122, 201, 261, 311, 541</td></tr>
  <tr><td>Determinación de cuentas</td><td>Qué cuentas reciben cada contabilización automática</td><td class="mono">BSX stock, WRX EM/RF, PRD diferencia de precio</td></tr></tbody></table></div>
  <div class="tbl"><table><thead><tr><th>Documento</th><th>Tablas</th><th>Transacción</th></tr></thead><tbody>
  <tr><td>Solicitud de pedido</td><td class="mono">EBAN</td><td class="mono">ME51N</td></tr><tr><td>Pedido de compras</td><td class="mono">EKKO / EKPO</td><td class="mono">ME21N</td></tr><tr><td>Documento de material</td><td class="mono">MATDOC</td><td class="mono">MIGO</td></tr><tr><td>Factura del proveedor</td><td class="mono">RBKP / RSEG</td><td class="mono">MIRO</td></tr></tbody></table></div>`,
  arch:'Compra para stock o para consumo la decide la imputación. Cambia todo en FI y CO, por eso merece una regla clara por tipo de material.',
  acts:[
   {q:'¿Qué define si la compra va a stock o a consumo directo?', o:['Clase de documento','Tipo de imputación','Grupo de compras','Organización de compras'], a:1, w:'Sin imputación, la posición va a stock; con K, F, P o A, va al objeto.'},
   {q:'En la determinación de cuentas, la clave BSX representa:', o:['Cuenta de stock','EM/RF','Diferencia de precio','Proveedor'], a:0, w:'WRX es EM/RF y PRD la diferencia de precio.'}],
  reflect:'Explique por qué la clase de movimiento funciona como el verbo del stock.'},
 {id:'padrao', t:'Procure-to-pay, paso a paso', guide:'¿Qué ocurre, en cada módulo, desde la solicitud hasta el pago?', widget:'flow', flowKey:'padrao', order:true,
  body:`<p>Siga el flujo haciendo clic en cada documento. Observe cuándo aparece el primer asiento contable y qué cuenta queda abierta esperando la factura.</p>`,
  arch:'La cuenta EM/RF es el termómetro del proceso. Un saldo abierto antiguo indica entrada sin factura o factura sin entrada, y se convierte en un tema de cierre.',
  acts:[
   {q:'¿En qué momento aumenta el stock y se abona la EM/RF?', o:['En la solicitud','En el pedido','En la entrada de mercancías','En la MIRO'], a:2, w:'Movimiento 101: D Stock / H EM/RF.'},
   {q:'La verificación a tres bandas compara:', o:['Solicitud, pedido y pago','Pedido, entrada y factura','Proveedor, banco y factura','Centro, almacén y factura'], a:1, w:'Cantidad y precio deben coincidir entre los tres.'}],
  reflect:'Cuente el recorrido de una compra como si se lo explicara a alguien de finanzas, sin nombres de transacciones.'},
 {id:'variacoes', t:'Variantes del proceso', guide:'¿Qué cambia cuando la compra no es para stock?', widget:'flow', flowKey:'servico',
  body:`<div class="tbl"><table><thead><tr><th>Escenario</th><th>Tipo</th><th>Entrada</th><th>Qué cambia</th></tr></thead><tbody>
  <tr><td>Consumo directo</td><td class="mono">(vacío) + K/F/P</td><td>Sí</td><td>La entrada contabiliza gasto en el objeto de coste, no stock</td></tr>
  <tr><td>Servicio</td><td class="mono">D</td><td>Aceptación del servicio</td><td>Líneas de servicio; la aceptación sustituye a la entrada</td></tr>
  <tr><td>Subcontratación</td><td class="mono">L</td><td>Sí (101 + 543)</td><td>Componentes suministrados con el movimiento 541</td></tr>
  <tr><td>Consignación de proveedor</td><td class="mono">K</td><td>Sí, sin valor</td><td>La deuda nace solo en la retirada (411 K); liquidación periódica</td></tr>
  <tr><td>Traslado entre centros</td><td class="mono">U</td><td>Sí (641 / 101)</td><td>Pedido de traslado con entrega de salida</td></tr>
  <tr><td>Contrato y plan de entregas</td><td>—</td><td>Sí</td><td>Acuerdo a largo plazo; el plan de entregas trae el calendario</td></tr></tbody></table></div>
  <p>Compare la compra de servicio y la subcontratación en el flujo de abajo.</p>`,
  arch:'Subcontratación y consignación tienen nota de envío y retorno en Brasil. El diseño fiscal debe avanzar junto con el logístico.',
  acts:[
   {q:'En la subcontratación, ¿cómo llegan los componentes al proveedor?', o:['Venta por SD','Movimiento 541 a stock en el proveedor','Consumo 201','No llegan: el proveedor los compra'], a:1, w:'El material sigue en el stock valorado de la empresa, en poder del proveedor.'},
   {q:'En la consignación de proveedor, ¿cuándo nace la deuda?', o:['En la entrada','En el pedido','En la retirada del stock de consignación','En el inventario'], a:2, w:'Hasta la retirada, el material es del proveedor.'}],
  reflect:'Elija una empresa que conozca y diga qué variantes de compra usa.'},
 {id:'valoracao', t:'Valoración y verificación de facturas', guide:'¿Cuánto vale el stock y qué ocurre cuando la factura llega distinta?',
  body:`<p>Cada material tiene un <b>control de precios</b>:</p>
  <ul><li><b>Precio estándar (S):</b> el stock se valora siempre al mismo precio. Las diferencias de factura van a la cuenta de diferencias de precio (PRD).</li><li><b>Precio medio variable (V):</b> el precio se ajusta con cada entrada. Las diferencias de factura ajustan el stock mientras haya saldo.</li></ul>
  <p>En S/4HANA el <b>Material Ledger</b> es obligatorio para la valoración. El cálculo de costes reales, que redistribuye las diferencias al final del período, es opcional.</p>
  <p>En la MIRO, las <b>tolerancias</b> de precio y cantidad deciden si la factura pasa o queda bloqueada. Las facturas bloqueadas se liberan tras el análisis.</p>
  <p>En Brasil, los impuestos recuperables (ICMS, IPI, PIS, COFINS, según el régimen) salen del coste y van a cuentas de impuestos a recuperar.</p>`,
  arch:'Precio estándar o medio es una decisión de negocio y de controlling. La industria tiende al estándar, por el análisis de desviaciones; retail y distribución tienden al medio.',
  acts:[
   {q:'Material con precio estándar: la diferencia en la factura va a:', o:['El stock','La cuenta de diferencias de precio','El proveedor','EM/RF, para siempre'], a:1, w:'Con precio estándar, el valor del stock no cambia.'},
   {q:'En S/4HANA, el Material Ledger es:', o:['Obligatorio para la valoración','Prohibido','Solo nube pública','Solo retail'], a:0, w:'El cálculo de costes reales sigue siendo opcional.'}],
  reflect:'Para un cliente distribuidor, ¿recomendaría precio estándar o medio variable? Justifique.'},
 {id:'s4', t:'S/4HANA y límites del estándar', guide:'¿Qué cambió y dónde el estándar suele no bastar?',
  body:`<div class="tbl"><table><thead><tr><th>Tema</th><th>ECC</th><th>S/4HANA</th></tr></thead><tbody>
  <tr><td>Proveedor</td><td>Maestro de proveedores (LFA1)</td><td>Interlocutor comercial obligatorio, vía CVI</td></tr>
  <tr><td>Documento de material</td><td>MKPF / MSEG</td><td>Tabla única MATDOC</td></tr>
  <tr><td>Aprobación</td><td>Estrategia de liberación clásica</td><td>Workflow flexible como dirección para escenarios nuevos</td></tr>
  <tr><td>Valoración</td><td>Material Ledger opcional</td><td>Material Ledger obligatorio</td></tr>
  <tr><td>Número de material</td><td>Hasta 18 caracteres</td><td>Hasta 40 caracteres (opcional)</td></tr>
  <tr><td>Análisis</td><td>LIS e informes ME2x</td><td>Apps analíticas Fiori sobre CDS</td></tr></tbody></table></div>
  <p><b>Donde el estándar funciona bien:</b> ciclo completo de compras, stocks y valoración, integración nativa con FI, CO, PP y Fiscal.</p>
  <p><b>Donde suele pedir extensión:</b> reglas de aprobación muy específicas, portales de proveedor fuera de Ariba, cálculos fiscales poco comunes en la entrada, integraciones con sistemas de almacén de terceros.</p>`,
  arch:'Antes de desarrollar una aprobación a medida, evalúe el workflow flexible. Cubre aprobación por valor, grupo y centro de coste sin código en el núcleo.',
  acts:[
   {q:'¿Dónde se guardan los documentos de material en S/4HANA?', o:['MKPF / MSEG','MATDOC','EKPO','BSEG'], a:1, w:'MKPF y MSEG pasan a ser vistas de compatibilidad.'},
   {q:'Para aprobar pedidos en proyectos nuevos, SAP orienta hacia:', o:['Estrategia clásica','ABAP propio','Workflow flexible','Correo electrónico'], a:2, w:'La estrategia clásica aún funciona, pero el workflow flexible es la dirección.'}],
  reflect:'Piense en un desarrollo de MM que haya visto. ¿Cabía en el estándar?'}
],
THEMES:[
 {id:'org', t:'Estructura y datos maestros', qs:[
  {q:'El nivel de valoración más común del stock es:', o:['Sociedad','Centro','Almacén','Organización de compras'], a:1, w:'El mismo material puede tener precios distintos por centro.'},
  {q:'¿Quién negocia y responde de las condiciones con el proveedor?', o:['Grupo de compras','Organización de compras','Almacén','Centro'], a:1, w:'El grupo es el comprador; la organización responde de las condiciones.'},
  {q:'El precio negociado por proveedor y material está en:', o:['Registro info de compras','Maestro de materiales','Libro de pedidos','Pedido anterior'], a:0, w:'El pedido lo toma de ahí.'},
  {q:'La cuenta asociada del proveedor está en:', o:['Datos de compras','Datos de sociedad del interlocutor','Registro info','Pedido'], a:1, w:'Es un dato financiero, por sociedad.'}]},
 {id:'docs', t:'Documentos y controles', qs:[
  {q:'El tipo de posición L indica:', o:['Servicio','Subcontratación','Consignación','Terceros'], a:1, w:'K es consignación, D servicio, S terceros.'},
  {q:'La imputación K significa:', o:['Consignación','Centro de coste','Proyecto','Activo fijo'], a:1, w:'F orden, P proyecto, A activo fijo.'},
  {q:'El movimiento 261 es:', o:['Entrada por pedido','Consumo para orden','Traspaso','Devolución al proveedor'], a:1, w:'Consumo de componentes en la orden de fabricación.'},
  {q:'La clave WRX en la determinación de cuentas es:', o:['Stock','EM/RF','Diferencia de precio','Flete'], a:1, w:'Cuenta transitoria entre entrada y factura.'}]},
 {id:'fluxos', t:'Flujos y variantes', qs:[
  {q:'La entrada de mercancías por pedido usa el movimiento:', o:['101','201','311','601'], a:0, w:'101 con referencia al pedido.'},
  {q:'En la compra de servicios, ¿qué sustituye a la entrada de mercancías?', o:['El pedido','La aceptación del servicio','La MIRO','El pago'], a:1, w:'La aceptación contabiliza contra EM/RF.'},
  {q:'En la subcontratación, el consumo de componentes ocurre con:', o:['541','543','261','122'], a:1, w:'Automático en la entrada 101 del producto.'},
  {q:'El traslado entre centros con entrega usa en la salida:', o:['641','101','561','122'], a:0, w:'Y 101 en la entrada del centro receptor.'}]},
 {id:'valor', t:'Valoración y factura', qs:[
  {q:'Con precio medio variable, la diferencia de factura:', o:['Va siempre a PRD','Ajusta el stock mientras haya saldo','Se ignora','Va al proveedor'], a:1, w:'Sin saldo, va a diferencias de precio.'},
  {q:'Una factura por encima de la tolerancia de precio queda:', o:['Contabilizada y pagada','Bloqueada para el pago','Eliminada','Anulada'], a:1, w:'Se libera tras el análisis.'},
  {q:'La entrada de mercancías se valora por:', o:['Valor de la factura','Valor del pedido','Precio de venta','Coste estándar del cliente'], a:1, w:'La factura llega después.'},
  {q:'Los impuestos recuperables en la compra:', o:['Entran en el coste','Van a impuestos a recuperar','Van a CO','Se ignoran'], a:1, w:'Según el régimen fiscal.'}]},
 {id:'integ', t:'Integración', qs:[
  {q:'La entrada de mercancías contabiliza:', o:['D Stock / H EM/RF','D Proveedor / H Banco','D EM/RF / H Proveedor','Nada'], a:0, w:'La MIRO contabiliza EM/RF contra proveedor.'},
  {q:'¿Quién genera solicitudes automáticamente?', o:['FI','MRP','CO-PA','SD'], a:1, w:'La planificación de necesidades.'},
  {q:'¿Quién abre lote de inspección en la entrada?', o:['QM','PM','FI','HCM'], a:0, w:'El material queda en stock en control de calidad.'},
  {q:'El pago al proveedor se hace en:', o:['MM','FI','CO','SD'], a:1, w:'Programa de pagos automático.'}]},
 {id:'s4', t:'S/4HANA', qs:[
  {q:'Los documentos de material en S/4HANA están en:', o:['MATDOC','MSEG','EKBE','BKPF'], a:0, w:'Tabla única.'},
  {q:'El proveedor en S/4HANA se mantiene como:', o:['Maestro LFA1 aislado','Interlocutor comercial','Registro info','Centro'], a:1, w:'CVI sincroniza con las tablas antiguas.'},
  {q:'El Material Ledger en S/4HANA es:', o:['Opcional','Obligatorio para la valoración','Eliminado','Solo CO'], a:1, w:'El cálculo de costes reales sigue opcional.'},
  {q:'El número de material puede tener hasta:', o:['18 caracteres','40 caracteres','10 caracteres','60 caracteres'], a:1, w:'Extensión opcional.'}]}
],
INTEG:[
 {k:'SD', n:'SD', sub:'Ventas', dir:'SD ↔ MM', step:'Pedido de cliente y salida de mercancías',
  what:'SD consulta la disponibilidad en el stock de MM y la salida de mercancías crea un documento de material 601.', varies:'La venta a través de terceros (TAS) genera una solicitud de pedido desde el pedido de cliente.'},
 {k:'PP', n:'PP', sub:'Producción', dir:'PP ↔ MM', step:'MRP, consumo y entrada de producción',
  what:'El MRP genera solicitudes; la orden consume componentes (261) y da entrada al producto (101).', varies:'La subcontratación une PP y MM en el proveedor.'},
 {k:'QM', n:'QM', sub:'Calidad', dir:'MM → QM → MM', step:'Entrada de mercancías',
  what:'La entrada abre un lote de inspección; la decisión de empleo libera o bloquea el stock.', varies:'Depende del tipo de inspección activo en el material.'},
 {k:'EWM', n:'EWM', sub:'Almacén', dir:'MM ↔ EWM', step:'Entrada y salida física',
  what:'En almacenes gestionados por EWM, la entrada física se hace con tareas de almacén y confirma el documento de material.', varies:'Sin EWM, la MIGO basta.'},
 {k:'FI', n:'FI', sub:'Contabilidad', dir:'MM → FI', step:'Entrada, MIRO y pago',
  what:'Entrada: D Stock / H EM/RF. MIRO: D EM/RF / H Proveedor. El pago es FI.', varies:'El consumo directo contabiliza gasto en lugar de stock.'},
 {k:'CO', n:'CO', sub:'Controlling', dir:'MM → CO', step:'Pedido y entrada con imputación',
  what:'Compromisos en el pedido y coste real en el objeto (centro de coste, orden, proyecto) en la entrada.', varies:'El precio estándar genera desviaciones analizadas en CO.'},
 {k:'FISCAL', n:'Fiscal BR', sub:'NF-e de entrada', dir:'Proveedor → Fiscal → MM', step:'Entrada y MIRO',
  what:'DRC recibe la NF-e del proveedor; la nota de entrada se crea en la MIGO o la MIRO con impuestos y CFOP.', varies:'Industrialización, consignación e importación tienen escenarios propios.'},
 {k:'ARIBA', n:'Ariba', sub:'Aprovisionamiento', dir:'MM ↔ Ariba', step:'Oferta, contrato y pedido',
  what:'Eventos de aprovisionamiento, contratos y pedidos colaborativos con el proveedor; el documento oficial queda en S/4HANA.', varies:'Común en compras indirectas y empresas con muchos proveedores.'}
],
CARDS:[
 {id:'mm1', f:'Categoría de valoración', b:'Campo del material que, con la clase de movimiento, define las cuentas contables del stock.', mod:'MM'},
 {id:'mm2', f:'Determinación de cuentas (BSX, WRX, PRD)', b:'Reglas que eligen las cuentas de las contabilizaciones automáticas de MM: stock, EM/RF y diferencia de precio.', mod:'MM/FI'},
 {id:'mm3', f:'Registro info de compras', b:'Precio y condiciones de un proveedor para un material en una organización de compras.', mod:'MM'},
 {id:'mm4', f:'Verificación a tres bandas', b:'Comprobación de cantidad y precio entre pedido, entrada de mercancías y factura.', mod:'MM'},
 {id:'mm5', f:'Precio estándar × medio variable', b:'S mantiene el valor fijo y envía diferencias a PRD; V ajusta el precio con cada entrada.', mod:'MM/CO'},
 {id:'mm6', f:'Cuenta EM/RF', b:'Cuenta de compensación entre entrada de mercancías y factura del proveedor. Un saldo abierto indica un desajuste.', mod:'MM/FI'}
],
CHALLENGE:{title:'Aprobación de pedidos por valor y centro de coste',
 ctx:'Un cliente en S/4HANA quiere aprobar pedidos de compras por niveles: hasta 10 mil el responsable del centro de coste, por encima también el director. El equipo propone un workflow ABAP propio.',
 q:'¿Qué diseño propone?',
 o:[{t:'Workflow ABAP a medida con una tabla Z de aprobadores.', s:0, w:'Resuelve, pero crea código en el núcleo para algo que cubre el estándar y genera coste en cada actualización.'},
    {t:'Workflow flexible de pedidos, con condiciones por valor y centro de coste y aprobadores por regla.', s:3, w:'Estándar de S/4HANA, configurado en apps Fiori. Cubre niveles por valor y por objeto de coste.'},
    {t:'Estrategia de liberación clásica con clasificación.', s:2, w:'Funciona y es conocida, pero es el enfoque antiguo; para un escenario nuevo, el workflow flexible es la dirección.'},
    {t:'Aprobación por correo fuera del sistema.', s:1, w:'Sin trazabilidad ni bloqueo en el documento. Falla en auditoría.'}]},
TERMS:{papel:['preq','po','gr','iv'],estrutura:['porg','pgrp','plant','sloc'],mestres:['bp','pir','valcl','srcl'],anatomia:['itcat','acat','mvt','accdet'],padrao:['preq','po','gr','iv','grir','payrun'],variacoes:['subc','vcons','sto','ses'],valoracao:['stdpr','map','prdiff','ml'],s4:['bp','flexwf','ml']}
};
