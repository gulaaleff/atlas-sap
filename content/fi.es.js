(MOD.fi=MOD.fi||{}).es={
name:'FI · Contabilidad financiera', short:'Contabilidad financiera',
lead:'El reflejo financiero de todo lo que ocurre en la empresa: libro mayor, cuentas a pagar y a cobrar, activos fijos, cierre y dónde FI recibe trabajo de todos los demás módulos.',
ORDER:['Entrada de mercancías','Factura del proveedor','Propuesta de pago','Pago','Extracto y compensación'],
FLOWS:{
 pagar:{name:'Cuentas a pagar', note:'De la factura del proveedor al extracto bancario.', steps:[
  {t:'MIRO o FB60 · clase RE/KR', b:'Factura del proveedor', m:'partida abierta',
   ctrl:'La factura con pedido entra por la MIRO (clase RE); sin pedido, directamente en FI (clase KR). Las condiciones de pago definen vencimiento y descuento.',
   integ:'MM: verificación contra pedido y entrada. Fiscal: nota de entrada y retenciones.',
   effect:'D Gasto o EM/RF e impuestos / H Proveedor (cuenta asociada en el mayor).',
   arch:'Cada factura se convierte en una partida abierta del proveedor y, al mismo tiempo, en un saldo de la cuenta asociada del mayor.'},
  {t:'F110 · propuesta', b:'Propuesta de pago', m:'selección por vencimiento',
   ctrl:'El programa selecciona partidas vencidas por sociedad, vía de pago y banco. La propuesta puede revisarse antes de la ejecución.',
   integ:'Las facturas bloqueadas en la MIRO quedan fuera de la propuesta.',
   effect:'Sin contabilización: es solo una lista editable.',
   arch:'La propuesta es el punto de control del tesorero. Separar quién propone de quién ejecuta es control interno básico.'},
  {t:'F110 · ejecución · KZ', b:'Pago', m:'documento y fichero bancario',
   ctrl:'La ejecución contabiliza el pago, compensa las partidas del proveedor y genera el soporte de pago.',
   integ:'Bancos: fichero de envío (en Brasil, CNAB o API).',
   effect:'D Proveedor / H Banco o cuenta transitoria de pagos.',
   arch:'Usar una cuenta transitoria hasta el extracto da visibilidad de lo enviado que aún no salió del banco.'},
  {t:'FF_5 · extracto', b:'Extracto y compensación', m:'conciliación bancaria',
   ctrl:'Se importa el extracto electrónico y unas reglas de búsqueda compensan las partidas de la cuenta transitoria.',
   integ:'Bancos: fichero de retorno o extracto.',
   effect:'D Cuenta transitoria / H Banco (cuenta principal).',
   arch:'Una conciliación automática bien configurada reduce el cierre de días a horas.'}
 ]},
 receber:{name:'Cuentas a cobrar', note:'De la factura al cobro y la reclamación.', steps:[
  {t:'VF01 · clase RV', b:'Factura procedente de SD', m:'partida abierta del cliente',
   ctrl:'La factura de SD crea el documento contable. Las condiciones de pago vienen del pedido.',
   integ:'SD: determinación de cuentas de ingresos. Crédito: riesgo del cliente.',
   effect:'D Cliente / H Ingresos e impuestos.',
   arch:'FI no decide la cuenta de ingresos: viene configurada desde SD.'},
  {t:'Boleto · cobro', b:'Instrumento de cobro', m:'en Brasil, boleto o PIX',
   ctrl:'El programa de pagos también puede generar cobros a clientes (vía de pago de entrada).',
   integ:'Bancos: registro del boleto.',
   effect:'Sin nueva contabilización.',
   arch:'En Brasil el cobro bancario forma parte del proceso; la integración con bancos suele ser por CNAB o API.'},
  {t:'F-28 o extracto · DZ', b:'Cobro', m:'compensación de la partida',
   ctrl:'El cobro compensa la partida del cliente, manualmente o desde el extracto.',
   integ:'Bancos: fichero de retorno.',
   effect:'D Banco / H Cliente.',
   arch:'Los pagos parciales y sin referencia son la mayor fuente de trabajo manual en cuentas a cobrar.'},
  {t:'F150', b:'Reclamación', m:'cartas de reclamación',
   ctrl:'El programa de reclamación selecciona partidas vencidas y envía avisos por niveles.',
   integ:'Crédito: el nivel de reclamación puede bloquear nuevas ventas.',
   effect:'Puede contabilizar intereses, según la configuración.',
   arch:'Defina los niveles con el área financiera del cliente; una reclamación demasiado agresiva afecta a la relación comercial.'}
 ]},
 fechamento:{name:'Cierre', note:'Lo que ocurre al final de cada período.', steps:[
  {t:'Contabilizaciones periódicas', b:'Provisiones y periodificaciones', m:'recurrentes y manuales',
   ctrl:'Contabilizaciones periódicas, provisiones y periodificaciones.',
   integ:'CO: los mismos importes aparecen en los objetos de coste.',
   effect:'D Gasto / H Provisión (ejemplo).',
   arch:'Cuanto más llegue automáticamente de los procesos, menos ajustes manuales en el cierre.'},
  {t:'AFAB', b:'Amortización', m:'todas las áreas de valoración',
   ctrl:'El programa de amortización contabiliza la amortización planificada de los activos.',
   integ:'Activos fijos (FI-AA) y CO (centro de coste del activo).',
   effect:'D Gasto de amortización / H Amortización acumulada.',
   arch:'En S/4HANA cada área de valoración contabiliza en su libro mayor, sin conciliación posterior.'},
  {t:'FAGL_FCV', b:'Valoración de moneda extranjera', m:'partidas abiertas y saldos',
   ctrl:'Revalora partidas en moneda extranjera al tipo de cambio de cierre.',
   integ:'Tesorería: tabla de tipos de cambio.',
   effect:'D/H Diferencia de cambio contra la cuenta valorada.',
   arch:'Los importes en moneda extranjera son comunes en importaciones. La valoración necesita tipos cargados antes del cierre.'},
  {t:'Cerrar períodos', b:'Bloqueo y estados financieros', m:'balance y cuenta de resultados',
   ctrl:'El período se cierra para contabilizaciones y los estados salen de las estructuras de balance.',
   integ:'Fiscal BR: SPED ECD y ECF.',
   effect:'Sin nueva contabilización.',
   arch:'Un cockpit de cierre ayuda a orquestar tareas, responsables y dependencias entre sociedades.'}
 ]}
},
CHAPTERS:[
 {id:'papel', t:'El papel de FI en el negocio', guide:'¿Por qué FI recibe contabilizaciones de casi todos los módulos?',
  body:`<p>FI registra el reflejo financiero de todo con fines legales: balance, cuenta de resultados y obligaciones. Su núcleo es el <b>libro mayor</b>, que da una visión actual, central y completa de todas las transacciones con valor.</p>
  <p>Alrededor están los <b>libros auxiliares</b>: cuentas a pagar (proveedores), cuentas a cobrar (clientes) y activos fijos. Cada contabilización en un libro auxiliar aparece al instante en el mayor a través de una cuenta asociada.</p>
  <p>FI no decide el precio (SD), ni el coste del stock (MM), ni el coste interno por centro (CO). Recibe esos valores y los organiza para la visión externa.</p>
  <ul><li>Contabilizaciones manuales en el mayor</li><li>Cuentas a pagar y pagos</li><li>Cuentas a cobrar, cobro y reclamación</li><li>Activos fijos</li><li>Bancos y conciliación</li><li>Cierre y estados financieros</li></ul>`,
  arch:'En los proyectos, FI es donde todo converge. Un error de configuración en SD o MM aparece primero como diferencia contable. Por eso el arquitecto de FI necesita entender los demás módulos.',
  acts:[
   {q:'¿Cómo llega una contabilización de proveedor al libro mayor?', o:['Por interfaz nocturna','Por la cuenta asociada, al instante','Manualmente en el cierre','Por CO'], a:1, w:'La cuenta asociada mantiene el auxiliar y el mayor siempre iguales.'},
   {q:'¿Cuál de estos es un libro auxiliar de FI?', o:['Centro de coste','Cuentas a cobrar','Orden interna','Lista de materiales'], a:1, w:'Cuentas a pagar, a cobrar y activos fijos son los auxiliares.'}],
  reflect:'Explique por qué un error en la determinación de cuentas de SD se convierte en un problema de FI.'},
 {id:'estrutura', t:'Estructura organizativa', guide:'¿Cuál es la unidad más pequeña con balance propio y qué más estructura la contabilidad?',
  body:`<div class="org"><div><b>Sociedad</b><span>Unidad más pequeña con contabilidad completa y estados legales. Tiene moneda y país.</span></div><div><b>Plan de cuentas</b><span>Lista de cuentas del día a día, asignada a la sociedad. En Brasil puede haber un plan del país en paralelo.</span></div><div><b>Variante de ejercicio</b><span>Define el ejercicio y los períodos (en general 12 más períodos especiales).</span></div><div><b>Libro mayor (ledger)</b><span>El principal (0L) sigue la norma principal; los paralelos atienden otras normas.</span></div></div>
  <p>Para informes por unidad de negocio, FI usa <b>centro de beneficio</b> y <b>segmento</b>. En S/4HANA ambos viven en el mismo documento contable.</p>`,
  arch:'El número de sociedades y libros mayores es una decisión estructural difícil de cambiar después. Defínala con el contable y el controller antes de configurar.',
  acts:[
   {q:'¿Cuál es la unidad más pequeña con estados legales completos?', o:['Centro','Sociedad','Centro de beneficio','Segmento'], a:1, w:'La sociedad (company code).'},
   {q:'Para atender IFRS y la norma local a la vez, lo estándar es usar:', o:['Dos sociedades','Libros mayores paralelos','Dos variantes de ejercicio','Dos centros de beneficio'], a:1, w:'Mayor principal en una norma y mayor paralelo en la otra.'}],
  reflect:'Un grupo tiene 3 entidades legales en Brasil y una matriz en el extranjero. ¿Cuántas sociedades y libros mayores propondría?'},
 {id:'mestres', t:'Datos maestros', guide:'¿Qué datos maestros sostienen las contabilizaciones?',
  body:`<div class="tbl"><table><thead><tr><th>Dato maestro</th><th>Qué usa FI</th><th>Observación</th></tr></thead><tbody>
  <tr><td>Cuenta de mayor</td><td>Tipo (balance, resultados, costes primarios o secundarios), moneda, gestión de partidas abiertas</td><td>En S/4HANA la clase de coste es una cuenta de mayor</td></tr>
  <tr><td>Interlocutor comercial (cliente/proveedor)</td><td>Datos de sociedad: cuenta asociada, condiciones y vía de pago, datos bancarios</td><td>Mismo objeto que usan SD y MM</td></tr>
  <tr><td>Activo fijo</td><td>Clase de activo fijo, centro de coste, áreas de valoración y claves de amortización</td><td>Libro auxiliar FI-AA</td></tr>
  <tr><td>Bancos propios</td><td>Bancos y cuentas bancarias usados en pagos y extractos</td><td>Base del programa de pagos</td></tr></tbody></table></div>`,
  arch:'La cuenta asociada en el maestro del cliente o proveedor define en qué cuenta del balance aparece ese saldo. Separar proveedores nacionales, extranjeros y vinculados empieza aquí.',
  acts:[
   {q:'¿Dónde está la cuenta asociada del proveedor?', o:['Datos de compras','Datos de sociedad del interlocutor','Plan de cuentas','Pedido'], a:1, w:'Es un dato financiero, por sociedad.'},
   {q:'En S/4HANA, una clase de coste es:', o:['Un objeto separado de FI','Una cuenta de mayor con tipo de coste','Un centro de coste','Un libro mayor'], a:1, w:'Primarias y secundarias son cuentas de mayor.'}],
  reflect:'¿Qué criterios usaría para separar cuentas asociadas de proveedores?'},
 {id:'documento', t:'El documento contable', guide:'¿Cómo es una contabilización por dentro y por qué el debe siempre iguala al haber?',
  body:`<p>Toda contabilización tiene <b>cabecera</b> (sociedad, fecha, clase de documento, referencia) y <b>posiciones</b>. Cada posición usa una <b>clave de contabilización</b>, que indica si es debe o haber y qué tipo de cuenta la recibe. Debe y haber deben cuadrar a cero.</p>
  <div class="tbl"><table><thead><tr><th>Clase de documento</th><th>Origen</th></tr></thead><tbody>
  <tr><td class="mono">SA</td><td>Contabilización manual en el mayor</td></tr><tr><td class="mono">KR / KZ</td><td>Factura y pago de proveedor en FI</td></tr><tr><td class="mono">DR / DZ</td><td>Factura y cobro de cliente en FI</td></tr><tr><td class="mono">RV</td><td>Factura procedente de SD</td></tr><tr><td class="mono">WE</td><td>Entrada de mercancías</td></tr><tr><td class="mono">RE</td><td>Factura de la MIRO</td></tr></tbody></table></div>
  <div class="tbl"><table><thead><tr><th>Clave</th><th>Significado</th></tr></thead><tbody>
  <tr><td class="mono">40 / 50</td><td>Debe / haber en cuenta de mayor</td></tr><tr><td class="mono">01 / 15</td><td>Factura / cobro de cliente</td></tr><tr><td class="mono">31 / 25</td><td>Factura / pago de proveedor</td></tr></tbody></table></div>
  <p>En S/4HANA cada posición se graba en la tabla <b>ACDOCA</b> con todas las dimensiones juntas: cuenta, centro de coste, centro de beneficio, segmento, libro mayor y monedas.</p>
  <p>Las cuentas con <b>gestión de partidas abiertas</b> (proveedor, cliente, EM/RF, transitorias bancarias) solo llegan a cero por <b>compensación</b>: una contabilización que une el debe con el haber correspondiente.</p>`,
  arch:'La clase de documento es la mejor pista del origen. En una auditoría, filtrar por clase muestra rápidamente qué vino de procesos y qué se contabilizó a mano.',
  acts:[
   {q:'La clave 31 representa:', o:['Debe en cuenta de mayor','Factura de proveedor (haber)','Cobro de cliente','Pago a proveedor'], a:1, w:'25 es el pago a proveedor.'},
   {q:'¿Qué deja a cero una partida abierta?', o:['El cierre del período','La compensación','La amortización','La anulación del pedido'], a:1, w:'La compensación une el debe con el haber correspondiente.'}],
  reflect:'¿Por qué la clase de documento ayuda en una auditoría?'},
 {id:'apar', t:'Cuentas a pagar y a cobrar', guide:'¿Cómo entra y sale el dinero y dónde se conecta FI con los bancos?', widget:'flow', flowKey:'pagar', order:true,
  body:`<p>Siga los flujos de cuentas a pagar y a cobrar. Observe que la factura siempre genera una partida abierta y que solo la compensación la cierra.</p>`,
  arch:'La automatización bancaria (pagos y extractos) es donde FI más tiempo ahorra. En Brasil, CNAB o las API de los bancos entran en el alcance de casi todo proyecto.',
  acts:[
   {q:'Las facturas bloqueadas en la MIRO:', o:['Se pagan normalmente','Quedan fuera de la propuesta de pago','Van a CO','Se anulan'], a:1, w:'El bloqueo impide el pago hasta la liberación.'},
   {q:'El programa de reclamación sirve para:', o:['Pagar a proveedores','Reclamar a clientes con partidas vencidas','Amortizar activos','Cerrar períodos'], a:1, w:'Envía avisos por niveles.'}],
  reflect:'Describa cómo sale un pago de SAP y vuelve como extracto, sin nombres de transacciones.'},
 {id:'ativos', t:'Activos fijos', guide:'¿Cómo entra un bien en el balance, pierde valor y sale?',
  body:`<p>FI-AA es un libro auxiliar del libro mayor. El ciclo de un activo:</p>
  <ol><li><b>Adquisición:</b> por pedido con imputación a activo (A), por factura directa o por liquidación de un proyecto u orden de inversión.</li><li><b>Amortización:</b> el programa calcula y contabiliza la amortización de cada <b>área de valoración</b> (mercantil, fiscal, IFRS).</li><li><b>Traslado:</b> entre centros de coste, sociedades o clases.</li><li><b>Baja:</b> por venta o desguace, con ganancia o pérdida.</li></ol>
  <p>En S/4HANA la <b>nueva contabilidad de activos fijos</b> es obligatoria: cada área de valoración contabiliza en tiempo real en su libro mayor, sin conciliación posterior.</p>
  <p>En Brasil es común tener amortización mercantil y fiscal en áreas distintas, y el crédito de ICMS sobre activos (CIAP) tratado por la localización.</p>`,
  arch:'La migración de activos es uno de los puntos más laboriosos de una conversión a S/4HANA. Planifique pronto la carga de saldos y las áreas de valoración.',
  acts:[
   {q:'Para tener amortización mercantil y fiscal distintas se usan:', o:['Dos sociedades','Áreas de valoración distintas','Dos centros de coste','Dos planes de cuentas'], a:1, w:'Cada área calcula con sus reglas.'},
   {q:'En S/4HANA, la nueva contabilidad de activos fijos es:', o:['Opcional','Obligatoria','Solo nube','Eliminada'], a:1, w:'Contabiliza en tiempo real en todas las áreas.'}],
  reflect:'Enumere las formas en que se puede adquirir un activo en SAP.'},
 {id:'fechamento', t:'Cierre e informes', guide:'¿Qué tiene que ocurrir para poder cerrar el mes?', widget:'flow', flowKey:'fechamento',
  body:`<p>El cierre es una secuencia de tareas con dependencias. Las principales:</p>
  <ul><li>Abrir el nuevo período y cerrar el anterior para contabilizaciones</li><li>Provisiones, periodificaciones y contabilizaciones periódicas</li><li>Amortización</li><li>Valoración de moneda extranjera</li><li>Análisis de la EM/RF y conciliaciones</li><li>Conciliación entre sociedades del grupo</li><li>Estados financieros desde las estructuras de balance</li><li>En Brasil: SPED ECD y ECF</li></ul>
  <p>A fin de año, el arrastre de saldos lleva los saldos de balance al año nuevo y deja a cero las cuentas de resultados contra resultados acumulados.</p>`,
  arch:'Los días de cierre son un indicador que todo CFO sigue. En preventa, preguntar cuántos días tarda el cliente en cerrar abre la conversación sobre automatización.',
  acts:[
   {q:'La valoración de moneda extranjera sirve para:', o:['Convertir el plan de cuentas','Revalorar partidas en moneda extranjera al tipo de cierre','Pagar a proveedores en el extranjero','Calcular la amortización'], a:1, w:'Genera diferencias de cambio contra la cuenta valorada.'},
   {q:'¿Qué hace el arrastre de saldos con las cuentas de resultados?', o:['Lleva el saldo al año nuevo','Las deja a cero contra resultados acumulados','Las borra','Las envía a CO'], a:1, w:'Las de balance arrastran saldo; las de resultados quedan a cero.'}],
  reflect:'Ordene las tareas de cierre de una empresa que conozca.'},
 {id:'s4', t:'S/4HANA y límites del estándar', guide:'¿Qué cambió y dónde el estándar suele no bastar?',
  body:`<div class="tbl"><table><thead><tr><th>Tema</th><th>ECC</th><th>S/4HANA</th></tr></thead><tbody>
  <tr><td>Documento</td><td>BKPF / BSEG y varias tablas de totales</td><td>ACDOCA (Universal Journal); totales calculados al momento</td></tr>
  <tr><td>Clase de coste</td><td>Objeto separado de CO</td><td>Cuenta de mayor con tipo</td></tr>
  <tr><td>Activos fijos</td><td>Contabilidad de activos clásica</td><td>Nueva contabilidad de activos obligatoria</td></tr>
  <tr><td>Cliente y proveedor</td><td>Maestros separados</td><td>Interlocutor comercial</td></tr>
  <tr><td>Consolidación</td><td>EC-CS / BCS</td><td>Group Reporting</td></tr>
  <tr><td>Bancos</td><td>Maestro de cuentas bancarias clásico</td><td>Bank Account Management</td></tr></tbody></table></div>
  <p><b>Donde el estándar funciona bien:</b> libro mayor, cuentas a pagar y a cobrar, activos fijos, cierre, múltiples normas y monedas.</p>
  <p><b>Donde suele pedir extensión:</b> integraciones bancarias específicas, reglas de cobro fuera de la reclamación, informes de gestión muy particulares y obligaciones fiscales poco comunes.</p>`,
  arch:'Con todo en ACDOCA, la conciliación entre FI y CO deja de existir. Eso cambia el cierre y es un argumento central en proyectos de migración.',
  acts:[
   {q:'En S/4HANA, las posiciones contables están en:', o:['Solo BSEG','ACDOCA','COEP','GLT0'], a:1, w:'BSEG sigue existiendo para partidas abiertas, pero ACDOCA es la base.'},
   {q:'La consolidación en S/4HANA usa:', o:['EC-CS','Group Reporting','CO-PA','Material Ledger'], a:1, w:'Es la solución actual de consolidación.'}],
  reflect:'¿Qué cambio de S/4HANA impacta más en el cierre contable, en su opinión?'}
],
THEMES:[
 {id:'org', t:'Estructura y datos maestros', qs:[
  {q:'La sociedad (company code) es:', o:['Un centro de coste','La unidad más pequeña con estados legales','Un almacén','Un libro mayor'], a:1, w:'Tiene moneda y país propios.'},
  {q:'El libro mayor principal estándar es:', o:['0L','2L','L1','00'], a:0, w:'Los paralelos atienden otras normas.'},
  {q:'La variante de ejercicio define:', o:['Moneda','Ejercicio y períodos','Plan de cuentas','Centro de beneficio'], a:1, w:'En general 12 períodos más especiales.'},
  {q:'La cuenta asociada une:', o:['CO y FI','Libro auxiliar y libro mayor','Banco y caja','Dos libros mayores'], a:1, w:'Los mantiene siempre iguales.'}]},
 {id:'docs', t:'Documento contable', qs:[
  {q:'La clase de documento RV viene de:', o:['MIRO','Factura de SD','Entrada de mercancías','Contabilización manual'], a:1, w:'RE es MIRO, WE entrada, SA manual.'},
  {q:'La clave 40 significa:', o:['Haber en el mayor','Debe en el mayor','Factura de cliente','Pago'], a:1, w:'50 es haber en el mayor.'},
  {q:'La tabla del Universal Journal es:', o:['ACDOCA','BKPF','COSP','FAGLFLEXT'], a:0, w:'Una línea por posición con todas las dimensiones.'},
  {q:'Las partidas abiertas llegan a cero por:', o:['Cierre','Compensación','Amortización','Reclamación'], a:1, w:'La compensación une debe y haber.'}]},
 {id:'apar', t:'Pagar y cobrar', qs:[
  {q:'El programa de pagos automático es:', o:['F110','F150','FB50','AFAB'], a:0, w:'F150 es reclamación.'},
  {q:'Antes de ejecutar el pago, el tesorero revisa:', o:['El extracto','La propuesta de pago','El balance','La amortización'], a:1, w:'Propuesta editable.'},
  {q:'El cobro de un cliente contabiliza:', o:['D Banco / H Cliente','D Cliente / H Ingresos','D Proveedor / H Banco','D Gasto / H Banco'], a:0, w:'Y compensa la partida del cliente.'},
  {q:'La reclamación es:', o:['Pago a proveedores','Avisos escalonados a clientes','Valoración de moneda','Arrastre de saldos'], a:1, w:'Avisos por niveles.'}]},
 {id:'ativos', t:'Activos y cierre', qs:[
  {q:'El programa de amortización es:', o:['AFAB','F110','FAGL_FCV','MIRO'], a:0, w:'Contabiliza en todas las áreas de valoración.'},
  {q:'Amortización mercantil y fiscal distintas usan:', o:['Dos sociedades','Áreas de valoración','Dos activos','Dos clases'], a:1, w:'Cada área con sus reglas.'},
  {q:'La valoración de moneda extranjera genera:', o:['Amortización','Diferencias de cambio','Provisiones','Ingresos'], a:1, w:'Contra la cuenta valorada.'},
  {q:'En el arrastre de saldos, las cuentas de resultados:', o:['Arrastran saldo','Quedan a cero contra resultados acumulados','Se borran','Van a CO'], a:1, w:'Las de balance arrastran saldo.'}]},
 {id:'integ', t:'Integración', qs:[
  {q:'La cuenta de ingresos de la factura de SD viene de:', o:['FI manual','Determinación de cuentas de SD','CO','MM'], a:1, w:'Configurada en SD.'},
  {q:'La MIRO contabiliza:', o:['D EM/RF / H Proveedor','D Stock / H EM/RF','D Banco / H Cliente','Nada'], a:0, w:'La entrada contabiliza stock contra EM/RF.'},
  {q:'El resultado de la nómina llega a FI por:', o:['Contabilización de la nómina de HCM','SD','CO-PA','Ariba'], a:0, w:'Salarios, cargas sociales y provisiones.'},
  {q:'El SPED ECD se alimenta de:', o:['Datos de FI','Solo SD','EWM','PM'], a:0, w:'Contabilidad digital brasileña.'}]},
 {id:'s4', t:'S/4HANA', qs:[
  {q:'En S/4HANA, la conciliación FI × CO:', o:['Sigue siendo mensual','Deja de existir','Pasa a ser anual','Va al BW'], a:1, w:'Mismo documento en ACDOCA.'},
  {q:'La nueva contabilidad de activos fijos es:', o:['Opcional','Obligatoria','Eliminada','Solo nube'], a:1, w:'Contabiliza en tiempo real.'},
  {q:'Consolidación en S/4HANA:', o:['Group Reporting','EC-CS','CO-PA','FSCM'], a:0, w:'Solución actual.'},
  {q:'Cliente y proveedor en S/4HANA son:', o:['Maestros separados','Interlocutor comercial','Cuentas de mayor','Centros de beneficio'], a:1, w:'Con roles distintos.'}]}
],
INTEG:[
 {k:'SD', n:'SD', sub:'Ventas', dir:'SD → FI', step:'Salida de mercancías y factura',
  what:'Salida: D Coste de las ventas / H Stock. Factura: D Cliente / H Ingresos e impuestos.', varies:'Los ingresos diferidos en contratos usan Revenue Accounting.'},
 {k:'MM', n:'MM', sub:'Compras', dir:'MM → FI', step:'Entrada de mercancías y MIRO',
  what:'Entrada: D Stock / H EM/RF. MIRO: D EM/RF / H Proveedor.', varies:'El consumo directo contabiliza gasto en lugar de stock.'},
 {k:'CO', n:'CO', sub:'Controlling', dir:'FI ↔ CO', step:'Toda contabilización de coste o ingreso',
  what:'En S/4HANA, FI y CO graban en el mismo documento (ACDOCA). Las cuentas de resultados exigen objeto de coste.', varies:'Las imputaciones internas de CO usan cuentas de costes secundarios.'},
 {k:'AA', n:'FI-AA', sub:'Activos fijos', dir:'FI-AA → mayor', step:'Adquisición, amortización y baja',
  what:'Libro auxiliar de activos, contabilizado en tiempo real por área de valoración.', varies:'Áreas mercantil, fiscal e IFRS según el país.'},
 {k:'HCM', n:'HCM', sub:'Nómina', dir:'HCM → FI', step:'Contabilización de la nómina',
  what:'Salarios, cargas sociales y provisiones contabilizados en el mayor y en los centros de coste.', varies:'La nómina puede estar en SAP HCM, SuccessFactors o un sistema de terceros.'},
 {k:'BANK', n:'Bancos', sub:'Pagos', dir:'FI ↔ Bancos', step:'Pago, cobro y extracto',
  what:'Ficheros de envío y retorno, extractos electrónicos y conciliación automática.', varies:'En Brasil, CNAB o API de los bancos.'},
 {k:'FISCAL', n:'Fiscal BR', sub:'SPED', dir:'FI → Fiscal', step:'Cierre y obligaciones',
  what:'Los datos contables alimentan el SPED ECD y ECF; los impuestos calculados van a las obligaciones legales.', varies:'La reforma tributaria cambia el cálculo y las cuentas de impuestos.'},
 {k:'GR', n:'Group Reporting', sub:'Consolidación', dir:'FI → Consolidación', step:'Cierre del grupo',
  what:'Los saldos de las sociedades se consolidan, con eliminaciones entre sociedades del grupo.', varies:'Los grupos con una sola sociedad no lo necesitan.'}
],
CARDS:[
 {id:'fi1', f:'Cuenta asociada', b:'Cuenta de mayor vinculada a un libro auxiliar (clientes, proveedores, activos). Recibe las contabilizaciones al instante.', mod:'FI'},
 {id:'fi2', f:'Libro mayor principal (0L)', b:'Libro contable de la norma principal. Los paralelos atienden otras normas.', mod:'FI'},
 {id:'fi3', f:'Clave de contabilización', b:'Indica si la posición es debe o haber y qué tipo de cuenta la recibe (40/50 mayor, 01/15 cliente, 31/25 proveedor).', mod:'FI'},
 {id:'fi4', f:'Compensación', b:'Contabilización que une un debe con un haber correspondiente y deja a cero partidas abiertas.', mod:'FI'},
 {id:'fi5', f:'Nueva contabilidad de activos fijos', b:'Obligatoria en S/4HANA: cada área de valoración contabiliza en tiempo real en su libro mayor.', mod:'FI'},
 {id:'fi6', f:'ACDOCA', b:'Universal Journal de S/4HANA: FI, CO, activos fijos y Material Ledger en el mismo documento.', mod:'FI/CO'}
],
CHALLENGE:{title:'Dos normas contables en el mismo grupo',
 ctx:'Una empresa brasileña fue comprada por un grupo europeo. La matriz quiere informes IFRS cada mes; la operación local sigue obligada a las normas brasileñas y al SPED. El cliente piensa en hojas de cálculo de ajuste.',
 q:'¿Qué diseño propone?',
 o:[{t:'Libro mayor principal en una norma y libro mayor paralelo en la otra, con contabilizaciones específicas por libro.', s:3, w:'Enfoque recomendado en S/4HANA: el mismo documento graba en ambos libros y las diferencias entran solo donde hace falta.'},
    {t:'Cuentas paralelas en el mismo libro mayor, con rangos de cuentas por norma.', s:2, w:'Funciona y sigue soportado, pero el plan de cuentas se vuelve pesado y los informes exigen más cuidado.'},
    {t:'Crear una segunda sociedad para la visión IFRS.', s:0, w:'Duplica datos maestros, documentos y controles. La sociedad no existe para eso.'},
    {t:'Hojas de cálculo de ajuste fuera del sistema.', s:1, w:'Resuelve a corto plazo, pero sin trazabilidad y con alto riesgo en auditoría.'}]},
TERMS:{papel:['gl','recon','ap','ar'],estrutura:['cc','coa','fyv','ledger','pc','seg'],mestres:['glacc','recon','asset','bank'],documento:['doctfi','pkey','openitem','clear'],apar:['payrun','dunning','clear'],ativos:['asset','deparea','depr'],fechamento:['postper','fxval','depr'],s4:['ledger','grp','bp']}
};
