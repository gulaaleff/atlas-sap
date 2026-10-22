(MOD.co=MOD.co||{}).es={
name:'CO · Controlling', short:'Controlling',
lead:'La visión interna de costes y resultados: centros de coste, órdenes, coste del producto, margen y cómo CO usa los mismos datos que FI para responder preguntas de gestión.',
ORDER:['Cálculo del coste del producto','Liberación del precio estándar','Consumo y actividades en la orden','Entrada del producto terminado','Cálculo de desviaciones','Liquidación'],
FLOWS:{
 overhead:{name:'Costes indirectos', note:'De la contabilización primaria al informe plan × real.', steps:[
  {t:'FI · MM · HCM', b:'Contabilización primaria', m:'gasto con centro de coste',
   ctrl:'Toda cuenta de resultados exige un objeto de coste. La contabilización llega de FI, de una entrada para consumo en MM o de la nómina.',
   integ:'FI: mismo documento en ACDOCA.',
   effect:'D Gasto en el centro de coste / H contrapartida (proveedor, stock, nómina).',
   arch:'Sin el objeto de coste correcto en origen, ninguna imputación arregla la información después.'},
  {t:'KSV5 / KSU5', b:'Distribución o reparto', m:'ciclos periódicos',
   ctrl:'La distribución traslada costes primarios manteniendo la clase de coste original. El reparto agrupa costes en una clase de coste secundaria. Las bases pueden ser fijas o índices estadísticos.',
   integ:'En S/4HANA, las apps de Universal Allocation hacen ambas cosas.',
   effect:'D Centro receptor / H Centro emisor (sin impacto en el resultado total).',
   arch:'El reparto es más fácil de leer; la distribución conserva el detalle por cuenta. Elija según lo que el responsable necesite ver.'},
  {t:'KB21N', b:'Imputación de actividades', m:'cantidad × tarifa',
   ctrl:'El centro emisor entrega horas (clase de actividad) a otro centro u orden, valoradas por la tarifa planificada.',
   integ:'PP y PM notifican actividades en las órdenes automáticamente.',
   effect:'D Objeto receptor / H Centro emisor, en clase de coste secundaria.',
   arch:'Unas tarifas bien calculadas son la base del coste del producto. Una tarifa errónea contamina el stock y el margen.'},
  {t:'Informes', b:'Plan × real', m:'análisis por centro de coste',
   ctrl:'Comparación de costes reales con el plan, por clase de coste y centro de coste.',
   integ:'La planificación puede venir de SAP Analytics Cloud.',
   effect:'Sin contabilización.',
   arch:'El informe solo ayuda si el responsable del centro sabe qué hacer con la desviación.'}
 ]},
 producao:{name:'Orden de fabricación', note:'Del coste estándar a la desviación liquidada.', steps:[
  {t:'CK11N / CK24', b:'Coste estándar', m:'cálculo y liberación',
   ctrl:'El cálculo suma materiales (lista de materiales), actividades (hoja de ruta × tarifas) y costes indirectos. Liberado, se convierte en el precio estándar del material.',
   integ:'PP: lista de materiales y hoja de ruta. MM: precio de los componentes.',
   effect:'Actualiza el precio estándar; revaloriza el stock si hay saldo.',
   arch:'El coste estándar es la regla de todo el análisis de desviaciones. Revisarlo sin criterio quita valor a la comparación.'},
  {t:'Orden de fabricación', b:'Costes reales en la orden', m:'consumo y notificación',
   ctrl:'El consumo de componentes (261) y las notificaciones de actividades cargan la orden; los costes indirectos se aplican en el cierre.',
   integ:'MM y PP contabilizan directamente en la orden.',
   effect:'D Orden / H Stock de componentes y H Centros de coste.',
   arch:'La orden acumula el coste real del lote. Las notificaciones tardías distorsionan el período.'},
  {t:'MIGO · 101', b:'Entrada del producto', m:'abono al estándar',
   ctrl:'La entrada del producto terminado abona la orden al coste estándar.',
   integ:'MM: stock del producto.',
   effect:'D Stock de producto terminado / H Orden (al estándar).',
   arch:'Lo que queda en la orden es desviación o trabajo en curso.'},
  {t:'KKAX · KKS2 · KO88', b:'Cierre de la orden', m:'trabajo en curso, desviaciones y liquidación',
   ctrl:'Las órdenes abiertas calculan trabajo en curso; las terminadas calculan desviaciones, que se liquidan.',
   integ:'FI: la desviación va a resultados; CO-PA puede recibirla por categoría.',
   effect:'D Desviación de fabricación / H Orden (o al revés).',
   arch:'Las desviaciones por categoría (precio, cantidad, rendimiento) dicen dónde la fábrica ganó o perdió dinero.'}
 ]},
 margem:{name:'Análisis de márgenes', note:'De la factura al resultado por cliente y producto.', steps:[
  {t:'VF01', b:'Factura de SD', m:'ingresos y descuentos',
   ctrl:'La factura contabiliza ingresos y descuentos con características de mercado (cliente, producto, región, canal).',
   integ:'SD y FI.',
   effect:'D Cliente / H Ingresos, con objeto de resultados.',
   arch:'La riqueza del análisis depende de las características informadas en la venta.'},
  {t:'Salida de mercancías', b:'Coste de las ventas', m:'puede desglosarse por componentes',
   ctrl:'El coste de las ventas de la salida lleva las mismas características. En S/4HANA puede desglosarse en componentes de coste.',
   integ:'MM y CO (coste estándar).',
   effect:'D Coste de las ventas / H Stock, con objeto de resultados.',
   arch:'Desglosar el coste de las ventas muestra cuánto del margen es material, mano de obra o costes indirectos.'},
  {t:'Liquidaciones', b:'Desviaciones y otros costes', m:'asignados a resultados',
   ctrl:'Las desviaciones de fabricación y otros costes pueden liquidarse a segmentos de resultados.',
   integ:'CO: órdenes y centros de coste.',
   effect:'D Resultados (segmento) / H Orden o centro.',
   arch:'Sin asignar desviaciones, el margen queda bonito en el informe y distinto en el balance.'},
  {t:'Informe de margen', b:'Resultado por segmento', m:'cliente, producto, región',
   ctrl:'Informes y apps analíticas sobre ACDOCA, sin conciliación con FI.',
   integ:'SAP Analytics Cloud para análisis y planificación.',
   effect:'Sin contabilización.',
   arch:'El margen por cliente es la pregunta que más hace el director comercial. El diseño de las características debe nacer de esa pregunta.'}
 ]}
},
CHAPTERS:[
 {id:'papel', t:'El papel de CO en el negocio', guide:'¿Para qué una contabilidad interna si FI ya lo registra todo?',
  body:`<p>FI responde a la pregunta legal: cuánto ganó o perdió la empresa. CO responde a las preguntas de gestión: <b>dónde</b> ocurrió el coste (centro de coste), <b>para qué</b> (orden, proyecto, producto) y <b>con quién</b> gana dinero la empresa (margen por cliente, producto, región).</p>
  <p>En S/4HANA, FI y CO usan el mismo documento contable. Ya no hay conciliación entre ambos: CO ve las mismas líneas con más dimensiones.</p>
  <p>Áreas de CO:</p>
  <ul><li>Costes indirectos: centros de coste y órdenes internas</li><li>Coste del producto: planificación y cálculo de órdenes</li><li>Análisis de resultados: margen y centro de beneficio</li><li>Planificación y presupuesto</li></ul>`,
  arch:'Pregunte al controller qué informes usa hoy para decidir. El diseño de CO nace de esas preguntas, no de la estructura del sistema antiguo.',
  acts:[
   {q:'¿Qué pregunta es típica de CO y no de FI?', o:['¿Cuánto debemos a proveedores?','¿Cuál es el margen por cliente?','¿Cuál es el saldo de caja?','¿Cuánto impuesto liquidar?'], a:1, w:'El margen por cliente es análisis de gestión.'},
   {q:'En S/4HANA, la conciliación entre FI y CO:', o:['Es mensual','Ya no existe','Es anual','Se hace en BW'], a:1, w:'El mismo documento graba ambas visiones.'}],
  reflect:'Explique con sus palabras la diferencia entre contabilidad financiera y de gestión.'},
 {id:'estrutura', t:'Estructura organizativa', guide:'¿Cómo organiza CO la empresa para medir costes y resultados?',
  body:`<div class="org"><div><b>Sociedad CO</b><span>Agrupa una o más sociedades para la visión de costes. Exige el mismo plan de cuentas operativo.</span></div><div><b>Jerarquía estándar</b><span>Árbol que contiene todos los centros de coste de la sociedad CO.</span></div><div><b>Centro de coste</b><span>Unidad de responsabilidad donde ocurre el coste: TI, mantenimiento, administración.</span></div><div><b>Centro de beneficio</b><span>Unidad de resultados. En S/4HANA vive en el libro mayor, con ingresos, costes y saldos.</span></div></div>
  <p>Además de los centros, CO usa <b>objetos de coste</b> temporales: órdenes internas, elementos PEP, órdenes de fabricación y de mantenimiento. Y el <b>objeto de resultados</b>, que guarda las características de mercado del margen.</p>`,
  arch:'La jerarquía de centros de coste debe reflejar responsabilidad, no el organigrama. Un centro de coste sin dueño se convierte en un cajón de gastos sin análisis.',
  acts:[
   {q:'¿Qué es un centro de coste?', o:['Una unidad de resultados','Una unidad de responsabilidad donde ocurre el coste','Un tipo de material','Una sociedad'], a:1, w:'El centro de beneficio es la unidad de resultados.'},
   {q:'La jerarquía estándar contiene:', o:['Solo centros productivos','Todos los centros de coste de la sociedad CO','Solo centros de beneficio','Los activos fijos'], a:1, w:'Todo centro de coste pertenece a ella.'}],
  reflect:'Dibuje la jerarquía de centros de coste de un área que conozca.'},
 {id:'mestres', t:'Datos maestros', guide:'¿Qué datos maestros permiten medir y mover costes?',
  body:`<div class="tbl"><table><thead><tr><th>Dato maestro</th><th>Para qué sirve</th></tr></thead><tbody>
  <tr><td>Clase de coste primaria</td><td>Cuenta de mayor de resultados que recibe costes externos (material, servicios, salarios)</td></tr>
  <tr><td>Clase de coste secundaria</td><td>Cuenta de mayor usada solo en movimientos internos de CO (reparto, actividades, liquidación)</td></tr>
  <tr><td>Centro de coste</td><td>Responsable, categoría, centro de beneficio asignado, sociedad</td></tr>
  <tr><td>Clase de actividad</td><td>Unidad de prestación de un centro (hora máquina, hora persona) con tarifa planificada</td></tr>
  <tr><td>Índice estadístico</td><td>Base de reparto (número de empleados, metros cuadrados, usuarios)</td></tr>
  <tr><td>Orden interna</td><td>Recoge costes de un evento, proyecto pequeño o inversión</td></tr></tbody></table></div>`,
  arch:'El centro de beneficio asignado al centro de coste es lo que lleva los costes indirectos a la visión de resultados. Revise ese vínculo antes de cualquier migración.',
  acts:[
   {q:'Una clase de coste secundaria se usa en:', o:['Facturas de proveedor','Movimientos internos de CO','Pagos','Amortización fiscal'], a:1, w:'Repartos, actividades y liquidaciones.'},
   {q:'El número de empleados como base de reparto es un:', o:['Clase de actividad','Índice estadístico','Centro de beneficio','Libro mayor'], a:1, w:'Sirve de base para los ciclos.'}],
  reflect:'¿Qué índice estadístico usaría para repartir el coste de un comedor?'},
 {id:'fluxo', t:'Flujo de los costes indirectos', guide:'¿Cómo sale un coste de la contabilización original y llega a quien lo consumió?', widget:'flow', flowKey:'overhead',
  body:`<div class="tbl"><table><thead><tr><th>Método</th><th>Cómo funciona</th><th>Clase de coste</th></tr></thead><tbody>
  <tr><td>Distribución</td><td>Traslada costes primarios del emisor a los receptores</td><td>Mantiene la primaria original</td></tr>
  <tr><td>Reparto</td><td>Agrupa costes y los traslada como un bloque</td><td>Secundaria de reparto</td></tr>
  <tr><td>Imputación de actividades</td><td>Cantidad entregada × tarifa</td><td>Secundaria de actividad</td></tr>
  <tr><td>Liquidación</td><td>Vacía una orden hacia sus receptores (centro, activo, resultados)</td><td>Según la norma de liquidación</td></tr></tbody></table></div>
  <p>Siga el flujo de abajo: el coste nace en la contabilización primaria y se mueve dentro de CO sin cambiar el resultado total de la empresa.</p>`,
  arch:'Demasiados ciclos de imputación vuelven ilegible el resultado. Prefiera pocos ciclos, con bases que el responsable entienda y acepte.',
  acts:[
   {q:'¿Qué método mantiene la clase de coste primaria original?', o:['Reparto','Distribución','Liquidación','Imputación de actividades'], a:1, w:'El reparto usa una clase secundaria.'},
   {q:'La imputación de actividades se valora por:', o:['Precio de venta','Cantidad × tarifa','Valor del pedido','Amortización'], a:1, w:'Tarifa planificada de la clase de actividad.'}],
  reflect:'¿Por qué las imputaciones internas no cambian el resultado total de la empresa?'},
 {id:'produto', t:'Coste del producto', guide:'¿Cuánto cuesta fabricar un producto y dónde aparece la diferencia con el real?', widget:'flow', flowKey:'producao', order:true,
  body:`<p>El <b>coste estándar</b> se obtiene de un cálculo que suma materiales (lista de materiales), actividades (hoja de ruta × tarifas) y costes indirectos. Al liberarse, se convierte en el precio estándar del material.</p>
  <p>En la orden de fabricación se acumulan los costes reales. La entrada del producto abona la orden al estándar. Lo que queda es <b>trabajo en curso</b> (orden abierta) o <b>desviación</b> (orden terminada), liquidada en el cierre.</p>
  <p>En S/4HANA el <b>Material Ledger</b> es obligatorio. Con el cálculo de costes reales activo, las desviaciones se redistribuyen a stock y coste de las ventas, hasta el coste real del período.</p>`,
  arch:'El cálculo de costes reales ayuda a empresas con costes de insumos muy volátiles, pero aumenta el esfuerzo de cierre. Recomiéndelo cuando la pregunta de negocio lo pida.',
  acts:[
   {q:'La entrada del producto terminado abona la orden por:', o:['Coste real','Coste estándar','Precio de venta','Valor de la factura'], a:1, w:'La diferencia se convierte en desviación o trabajo en curso.'},
   {q:'En una orden terminada, el saldo restante se trata como:', o:['Trabajo en curso','Desviación','Ingreso','Provisión'], a:1, w:'El trabajo en curso es para órdenes abiertas.'}],
  reflect:'Explique a un jefe de planta qué significa una desviación de cantidad.'},
 {id:'margem', t:'Análisis de márgenes y centro de beneficio', guide:'¿Con quién y con qué gana dinero la empresa?', widget:'flow', flowKey:'margem',
  body:`<p>El <b>análisis de márgenes</b> (CO-PA contable) registra ingresos y costes con características de mercado: cliente, producto, región, canal. En S/4HANA usa la propia ACDOCA, sin conciliación con FI.</p>
  <p>El <b>centro de beneficio</b> muestra el resultado por unidad interna (línea de negocio, sucursal). También puede tener balance parcial, porque vive en el libro mayor.</p>
  <p>Los precios de transferencia entre centros de beneficio o sociedades pueden tratarse con valoración paralela, cuando el grupo necesita visiones legal, de grupo y de centro de beneficio.</p>`,
  arch:'El CO-PA basado en costes sigue existiendo, pero la dirección en S/4HANA es el contable. En migraciones, mapee los informes antiguos antes de apagarlo.',
  acts:[
   {q:'En S/4HANA, el análisis de márgenes estándar es:', o:['Basado en costes','Contable','Solo en BW','Inexistente'], a:1, w:'Usa ACDOCA.'},
   {q:'El centro de beneficio en S/4HANA:', o:['Está en un módulo aparte','Vive en el libro mayor, en el mismo documento','Solo existe en CO-PA','Se eliminó'], a:1, w:'Antes era EC-PCA, separado.'}],
  reflect:'¿Qué características usaría para el margen de un distribuidor?'},
 {id:'plano', t:'Planificación y presupuesto', guide:'¿Cómo compara CO lo planificado con lo que ocurrió?',
  body:`<ul><li><b>Planificación de costes</b> por centro de coste y clase de coste</li><li><b>Planificación de actividades</b> y cálculo de tarifas</li><li><b>Presupuesto de órdenes y proyectos</b> con control de disponibilidad: el sistema avisa o bloquea cuando el gasto supera lo presupuestado</li><li><b>Planificación integrada</b> en SAP Analytics Cloud, dirección de SAP para la planificación</li></ul>
  <p>Los informes plan × real muestran la diferencia por centro y clase de coste, y el responsable justifica las desviaciones.</p>`,
  arch:'La planificación es donde más se usa Excel en paralelo. Al proponer SAC, muestre la ganancia en ciclo y versiones, no solo la herramienta.',
  acts:[
   {q:'El control de disponibilidad sirve para:', o:['Calcular tarifas','Avisar o bloquear el gasto por encima del presupuesto','Amortizar activos','Pagar a proveedores'], a:1, w:'Se usa en órdenes y proyectos.'},
   {q:'La dirección de SAP para la planificación es:', o:['Hojas de cálculo','SAP Analytics Cloud','BW antiguo','CO-PA basado en costes'], a:1, w:'Integrado con S/4HANA.'}],
  reflect:'¿Cómo se hace hoy el plan de costes de su área y qué cambiaría con SAC?'},
 {id:'s4', t:'S/4HANA y límites del estándar', guide:'¿Qué cambió y dónde el estándar suele no bastar?',
  body:`<div class="tbl"><table><thead><tr><th>Tema</th><th>ECC</th><th>S/4HANA</th></tr></thead><tbody>
  <tr><td>Clase de coste</td><td>Objeto separado (KA01)</td><td>Cuenta de mayor con tipo</td></tr>
  <tr><td>Totales de CO</td><td>COEP / COSP / COSS</td><td>ACDOCA</td></tr>
  <tr><td>Análisis de resultados</td><td>CO-PA basado en costes habitual</td><td>Contable como estándar</td></tr>
  <tr><td>Centro de beneficio</td><td>EC-PCA separado</td><td>En el libro mayor</td></tr>
  <tr><td>Material Ledger</td><td>Opcional</td><td>Obligatorio</td></tr>
  <tr><td>Imputaciones</td><td>Transacciones clásicas de ciclos</td><td>Universal Allocation en Fiori</td></tr></tbody></table></div>
  <p><b>Donde el estándar funciona bien:</b> costes indirectos, coste del producto, margen y centro de beneficio integrados en el libro mayor.</p>
  <p><b>Donde suele pedir extensión:</b> modelos de costes muy específicos (ABC detallado), informes de gestión fuera del estándar y planificación compleja, que tiende a ir a SAC.</p>`,
  arch:'Para el controller, el mayor cambio es no conciliar más FI y CO. Úselo como argumento de valor, pero prepare al equipo para la nueva lógica de cuentas de coste.',
  acts:[
   {q:'En S/4HANA, una clase de coste primaria es:', o:['Objeto KA01','Cuenta de mayor','Centro de coste','Clase de actividad'], a:1, w:'Se crea como cuenta de mayor con tipo.'},
   {q:'Las imputaciones en S/4HANA pueden hacerse con:', o:['Universal Allocation','F110','MIRO','VF01'], a:0, w:'Apps Fiori para reparto y distribución.'}],
  reflect:'¿Qué informe de gestión de su día a día cambiaría con ACDOCA?'}
],
THEMES:[
 {id:'org', t:'Estructura y datos maestros', qs:[
  {q:'La sociedad CO exige:', o:['El mismo plan de cuentas operativo','La misma moneda de venta','El mismo centro','El mismo proveedor'], a:0, w:'Agrupa sociedades con el mismo plan.'},
  {q:'El centro de beneficio es una unidad de:', o:['Responsabilidad de costes','Resultados','Stock','Compras'], a:1, w:'El centro de coste es de responsabilidad.'},
  {q:'La clase de actividad es:', o:['Una cuenta de balance','La unidad de prestación de un centro, con tarifa','Un proveedor','Un activo fijo'], a:1, w:'Hora máquina, hora persona.'},
  {q:'La orden interna sirve para:', o:['Facturar a clientes','Recoger costes de un evento o inversión','Pagar a proveedores','Planificar el MRP'], a:1, w:'Después se liquida.'}]},
 {id:'fluxo', t:'Flujo de costes', qs:[
  {q:'El reparto usa una clase de coste:', o:['Primaria original','Secundaria','De balance','De stock'], a:1, w:'La distribución mantiene la primaria.'},
  {q:'La transacción de imputación directa de actividades es:', o:['KB21N','KSU5','KO88','CK11N'], a:0, w:'KSU5 es reparto; KO88 liquidación.'},
  {q:'La liquidación sirve para:', o:['Vaciar una orden hacia sus receptores','Pagar a un proveedor','Crear un centro de coste','Contabilizar ingresos'], a:0, w:'Centro, activo o resultados.'},
  {q:'¿Las imputaciones internas cambian el resultado total?', o:['Sí','No','Solo a fin de año','Solo en moneda extranjera'], a:1, w:'Solo mueven coste entre objetos.'}]},
 {id:'produto', t:'Coste del producto', qs:[
  {q:'El cálculo del coste suma:', o:['Materiales, actividades y costes indirectos','Solo materiales','Ingresos y descuentos','Impuestos'], a:0, w:'Lista de materiales, hoja de ruta y costes indirectos.'},
  {q:'El cálculo liberado se convierte en:', o:['Precio de venta','Precio estándar del material','Tarifa de actividad','Presupuesto'], a:1, w:'CK24 lo libera.'},
  {q:'Una orden abierta a fin de período genera:', o:['Desviación','Trabajo en curso','Ingreso','Amortización'], a:1, w:'La desviación es para órdenes terminadas.'},
  {q:'El cálculo de costes reales del Material Ledger:', o:['Es obligatorio','Es opcional','No existe','Solo en ECC'], a:1, w:'La valoración con ML es obligatoria; el cálculo real no.'}]},
 {id:'margem', t:'Margen y centro de beneficio', qs:[
  {q:'Las características de mercado están en el:', o:['Objeto de resultados','Centro de coste','Activo fijo','Libro mayor'], a:0, w:'Cliente, producto, región, canal.'},
  {q:'El coste de las ventas en S/4HANA puede:', o:['Desglosarse por componentes de coste','Ser solo total','Ignorarse','Contabilizarse solo en FI'], a:0, w:'Muestra material, mano de obra e indirectos.'},
  {q:'El centro de beneficio en S/4HANA está:', o:['En el libro mayor','En EC-PCA','En BW','En SD'], a:0, w:'Mismo documento.'},
  {q:'Las desviaciones no asignadas a resultados hacen que el margen:', o:['Cuadre con el balance','Difiera del balance','Desaparezca','Se duplique'], a:1, w:'Asignar desviaciones cierra la diferencia.'}]},
 {id:'integ', t:'Integración', qs:[
  {q:'La notificación de una orden de fabricación genera en CO:', o:['Imputación de actividades','Pago','Factura','Amortización'], a:0, w:'Horas × tarifa en la orden.'},
  {q:'La nómina llega a CO como:', o:['Coste primario en centros de coste','Ingreso','Activo fijo','Stock'], a:0, w:'Por la imputación en la nómina.'},
  {q:'Los costes de mantenimiento (PM) se:', o:['Liquidan a centro de coste o activo','Facturan al cliente','Ignoran','Contabilizan en SD'], a:0, w:'La orden de mantenimiento se liquida.'},
  {q:'Los ingresos del margen vienen de:', o:['Factura de SD','MIRO','F110','AFAB'], a:0, w:'Con características de mercado.'}]},
 {id:'s4', t:'S/4HANA', qs:[
  {q:'Los totales de CO en S/4HANA están en:', o:['ACDOCA','COSP','COEP','KNA1'], a:0, w:'Universal Journal.'},
  {q:'Análisis de resultados estándar:', o:['Contable','Basado en costes','Solo BW','Hoja de cálculo'], a:0, w:'El basado en costes sigue existiendo.'},
  {q:'La clase de coste se crea como:', o:['Cuenta de mayor','Objeto KA01 aislado','Centro de coste','Orden'], a:0, w:'Con tipo de coste.'},
  {q:'Herramienta estratégica de planificación de SAP:', o:['SAP Analytics Cloud','BPS','Excel','CO-PA basado en costes'], a:0, w:'Integrada con S/4HANA.'}]}
],
INTEG:[
 {k:'FI', n:'FI', sub:'Contabilidad', dir:'FI ↔ CO', step:'Toda contabilización de resultados',
  what:'Mismo documento en ACDOCA; las cuentas de resultados exigen objeto de coste.', varies:'Las cuentas de costes secundarios existen solo para movimientos internos.'},
 {k:'SD', n:'SD', sub:'Ventas', dir:'SD → CO', step:'Factura y salida de mercancías',
  what:'Ingresos, descuentos y coste de las ventas llegan al margen con características de mercado.', varies:'La fabricación sobre pedido lleva costes a la posición del pedido de cliente.'},
 {k:'MM', n:'MM', sub:'Compras y stock', dir:'MM → CO', step:'Pedido, entrada y valoración',
  what:'Compromisos y costes reales en objetos de coste; Material Ledger y diferencias de precio.', varies:'El precio estándar genera desviaciones analizadas en CO.'},
 {k:'PP', n:'PP', sub:'Producción', dir:'PP ↔ CO', step:'Orden de fabricación',
  what:'El coste estándar viene de la lista de materiales y la hoja de ruta; las órdenes acumulan coste real y generan desviaciones.', varies:'La fabricación repetitiva usa un colector de costes del producto en lugar de órdenes.'},
 {k:'PS', n:'PS', sub:'Proyectos', dir:'PS ↔ CO', step:'Elemento PEP',
  what:'Presupuesto, costes reales, análisis de resultados y liquidación por elemento PEP.', varies:'Los proyectos de inversión liquidan a inmovilizado en curso.'},
 {k:'PM', n:'PM', sub:'Mantenimiento', dir:'PM → CO', step:'Orden de mantenimiento',
  what:'Materiales y horas se acumulan en la orden, liquidada a centro de coste o activo fijo.', varies:'El mantenimiento activable va a activo fijo.'},
 {k:'HCM', n:'HCM', sub:'Nómina', dir:'HCM → CO', step:'Contabilización de la nómina',
  what:'Los costes de personal llegan a los centros de coste; las horas pueden imputarse como actividad.', varies:'El registro de horas en proyectos cambia el destino del coste.'},
 {k:'SAC', n:'SAC', sub:'Planificación', dir:'SAC ↔ CO', step:'Planificación y análisis',
  what:'Planes de costes y resultados hechos en SAP Analytics Cloud y grabados en S/4HANA para plan × real.', varies:'Clientes sin SAC usan planificación clásica u hojas de cálculo.'}
],
CARDS:[
 {id:'co1', f:'Clase de coste secundaria', b:'Cuenta de mayor usada solo en movimientos internos de CO: reparto, actividades y liquidación.', mod:'CO'},
 {id:'co2', f:'Reparto × distribución', b:'El reparto agrupa costes en una clase secundaria; la distribución los traslada manteniendo la primaria original.', mod:'CO'},
 {id:'co3', f:'Clase de actividad', b:'Unidad de prestación de un centro de coste (hora máquina, hora persona), valorada por tarifa.', mod:'CO'},
 {id:'co4', f:'Liquidación', b:'Vacía una orden o proyecto hacia sus receptores: centro de coste, activo fijo o resultados.', mod:'CO'},
 {id:'co5', f:'Análisis de márgenes contable', b:'CO-PA en S/4HANA: ingresos y costes con características de mercado, directamente en ACDOCA.', mod:'CO'},
 {id:'co6', f:'Desviación de fabricación', b:'Diferencia entre el coste real de la orden y el abono al estándar en la entrada del producto.', mod:'CO/PP'}
],
CHALLENGE:{title:'Coste de TI repercutido a las unidades de negocio',
 ctx:'Un cliente quiere que el coste del departamento de TI se repercuta cada mes a sus cuatro unidades de negocio, en proporción al número de usuarios de cada una. Hoy el controller hace contabilizaciones manuales.',
 q:'¿Qué diseño propone?',
 o:[{t:'Un ciclo de reparto o distribución desde el centro de coste de TI, con un índice estadístico de usuarios por unidad.', s:3, w:'Estándar de CO, ejecutado en el cierre. La base se actualiza cambiando el índice estadístico.'},
    {t:'Contabilizaciones manuales mensuales en FI.', s:1, w:'Funciona, pero es repetitivo, propenso a errores y la regla no es trazable.'},
    {t:'Una orden interna por unidad, liquidada manualmente.', s:2, w:'Posible, pero más pesado de lo que el problema pide.'},
    {t:'Un programa ABAP que calcula y contabiliza el reparto.', s:0, w:'Recrea en código lo que ya hacen los ciclos de imputación.'}]},
TERMS:{papel:['coarea','cctr','pc','ma'],estrutura:['coarea','stdh','cctr','pc','io'],mestres:['celem','acttype','skf','io'],fluxo:['assess','distr','actalloc','settle'],produto:['pce','stdpr','wip','var','ml'],margem:['ma','pc'],plano:['avc','sac'],s4:['celem','ml','ma']}
};
