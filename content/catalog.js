/* Catálogo de módulos e soluções. open:true = conteúdo disponível. */
const OPEN_MODS = ['sd','mm','fi','co'];
const CATALOG = {
 core:[
  {k:'sd',code:'SD',open:true},
  {k:'mm',code:'MM',open:true},
  {k:'fi',code:'FI',open:true},
  {k:'co',code:'CO',open:true},
  {k:'pp',code:'PP',name:{pt:'Planejamento da produção',en:'Production planning',es:'Planificación de la producción'},desc:{pt:'MRP, ordens de produção, lista técnica e roteiro.',en:'MRP, production orders, BOM and routing.',es:'MRP, órdenes de fabricación, lista de materiales y hoja de ruta.'}},
  {k:'qm',code:'QM',name:{pt:'Gestão da qualidade',en:'Quality management',es:'Gestión de calidad'},desc:{pt:'Lotes de controle, inspeções e notificações de qualidade.',en:'Inspection lots, inspections and quality notifications.',es:'Lotes de inspección, inspecciones y avisos de calidad.'}},
  {k:'pm',code:'PM',name:{pt:'Manutenção',en:'Plant maintenance',es:'Mantenimiento'},desc:{pt:'Equipamentos, planos de manutenção e ordens.',en:'Equipment, maintenance plans and orders.',es:'Equipos, planes de mantenimiento y órdenes.'}},
  {k:'ps',code:'PS',name:{pt:'Projetos',en:'Project system',es:'Sistema de proyectos'},desc:{pt:'Estrutura de projeto, elementos PEP, orçamento e faturamento.',en:'Project structure, WBS elements, budget and billing.',es:'Estructura de proyecto, elementos PEP, presupuesto y facturación.'}}
 ],
 other:[
  {k:'ewm',code:'EWM',name:{pt:'Extended Warehouse Management',en:'Extended Warehouse Management',es:'Extended Warehouse Management'},desc:{pt:'Armazém em nível de posição, ondas e tarefas.',en:'Bin-level warehousing, waves and tasks.',es:'Almacén a nivel de ubicación, oleadas y tareas.'}},
  {k:'tm',code:'TM',name:{pt:'Transportation Management',en:'Transportation Management',es:'Transportation Management'},desc:{pt:'Planejamento de frete, transportadoras e custos de transporte.',en:'Freight planning, carriers and transport costs.',es:'Planificación de fletes, transportistas y costes de transporte.'}},
  {k:'sf',code:'SF',name:{pt:'SuccessFactors',en:'SuccessFactors',es:'SuccessFactors'},desc:{pt:'Gestão de pessoas na nuvem: cadastro, folha, talentos.',en:'Cloud HR: employee data, payroll, talent.',es:'Gestión de personas en la nube: datos, nómina, talento.'}},
  {k:'ariba',code:'ARB',name:{pt:'Ariba',en:'Ariba',es:'Ariba'},desc:{pt:'Sourcing, contratos e colaboração com fornecedores.',en:'Sourcing, contracts and supplier collaboration.',es:'Aprovisionamiento, contratos y colaboración con proveedores.'}},
  {k:'concur',code:'CNC',name:{pt:'Concur',en:'Concur',es:'Concur'},desc:{pt:'Viagens e despesas de funcionários.',en:'Employee travel and expenses.',es:'Viajes y gastos de empleados.'}},
  {k:'fg',code:'FG',name:{pt:'Fieldglass',en:'Fieldglass',es:'Fieldglass'},desc:{pt:'Gestão de força de trabalho externa e serviços.',en:'External workforce and services management.',es:'Gestión de personal externo y servicios.'}},
  {k:'ibp',code:'IBP',name:{pt:'Integrated Business Planning',en:'Integrated Business Planning',es:'Integrated Business Planning'},desc:{pt:'Planejamento de demanda, suprimento e S&OP.',en:'Demand, supply and S&OP planning.',es:'Planificación de demanda, suministro y S&OP.'}},
  {k:'sac',code:'SAC',name:{pt:'SAP Analytics Cloud',en:'SAP Analytics Cloud',es:'SAP Analytics Cloud'},desc:{pt:'Análises, dashboards e planejamento.',en:'Analytics, dashboards and planning.',es:'Análisis, dashboards y planificación.'}},
  {k:'btp',code:'BTP',name:{pt:'Business Technology Platform',en:'Business Technology Platform',es:'Business Technology Platform'},desc:{pt:'Integração, extensões side-by-side e dados.',en:'Integration, side-by-side extensions and data.',es:'Integración, extensiones side-by-side y datos.'}},
  {k:'sig',code:'SIG',name:{pt:'Signavio',en:'Signavio',es:'Signavio'},desc:{pt:'Modelagem e mineração de processos.',en:'Process modeling and mining.',es:'Modelado y minería de procesos.'}},
  {k:'dsp',code:'DSP',name:{pt:'Datasphere',en:'Datasphere',es:'Datasphere'},desc:{pt:'Camada de dados de negócio e modelos semânticos.',en:'Business data layer and semantic models.',es:'Capa de datos de negocio y modelos semánticos.'}},
  {k:'drc',code:'DRC',name:{pt:'Document and Reporting Compliance',en:'Document and Reporting Compliance',es:'Document and Reporting Compliance'},desc:{pt:'Documentos fiscais eletrônicos e obrigações legais.',en:'Electronic tax documents and statutory reporting.',es:'Documentos fiscales electrónicos y obligaciones legales.'}}
 ]
};
const TRAILS = {
 pt:[
  {n:'0',t:'Fundamentos',d:'ERP, ECC x S/4HANA, Clean Core, estrutura organizacional, dados mestres, fluxo de documentos.',mods:['O que é ERP','ECC x S/4HANA','Estrutura organizacional','Business Partner','Material','Fluxo de documentos']},
  {n:'1',t:'Processos end-to-end',d:'Como um evento de negócio atravessa vários módulos até virar lançamento contábil.',mods:['Lead to Cash','Source to Pay','Design to Operate','Recruit to Retire','Record to Report']},
  {n:'2',t:'Módulos',d:'Um módulo por página, sempre no mesmo modelo: estudo em capítulos, revisão por temas e integrações.',mods:['SD','MM','FI','CO','PP','QM','PM','PS'],live:['SD','MM','FI','CO']},
  {n:'3',t:'Localização Brasil',d:'Como o SAP trata NF-e, NFS-e, impostos no documento, DRC, SPED e a Reforma Tributária.',mods:['NF-e e NFS-e','Impostos no documento','DRC','SPED','IBS / CBS']},
  {n:'4',t:'Tecnologia para arquiteto',d:'Integração, extensibilidade, analytics, Fiori e autorizações.',mods:['IDoc, APIs e eventos','Extensibilidade','CDS e Embedded Analytics','Fiori','Autorizações']},
  {n:'5',t:'Visão de arquiteto',d:'Fit-to-standard, padrão x customizado, Greenfield x Brownfield, SAP Activate.',mods:['Fit-to-standard','Padrão x custom','Greenfield x Brownfield','SAP Activate','Limitações recorrentes']}],
 en:[
  {n:'0',t:'Foundations',d:'ERP, ECC vs. S/4HANA, Clean Core, organizational structure, master data, document flow.',mods:['What an ERP is','ECC vs. S/4HANA','Organizational structure','Business Partner','Material','Document flow']},
  {n:'1',t:'End-to-end processes',d:'How a business event crosses several modules until it becomes an accounting entry.',mods:['Lead to Cash','Source to Pay','Design to Operate','Recruit to Retire','Record to Report']},
  {n:'2',t:'Modules',d:'One module per page, always in the same model: study in chapters, review by topic and integrations.',mods:['SD','MM','FI','CO','PP','QM','PM','PS'],live:['SD','MM','FI','CO']},
  {n:'3',t:'Brazil localization',d:'How SAP handles NF-e, NFS-e, taxes in the document, DRC, SPED and the tax reform.',mods:['NF-e and NFS-e','Taxes in the document','DRC','SPED','IBS / CBS']},
  {n:'4',t:'Technology for architects',d:'Integration, extensibility, analytics, Fiori and authorizations.',mods:['IDocs, APIs and events','Extensibility','CDS and Embedded Analytics','Fiori','Authorizations']},
  {n:'5',t:'Architect view',d:'Fit-to-standard, standard vs. custom, greenfield vs. brownfield, SAP Activate.',mods:['Fit-to-standard','Standard vs. custom','Greenfield vs. brownfield','SAP Activate','Recurring limitations']}],
 es:[
  {n:'0',t:'Fundamentos',d:'ERP, ECC frente a S/4HANA, Clean Core, estructura organizativa, datos maestros, flujo de documentos.',mods:['Qué es un ERP','ECC frente a S/4HANA','Estructura organizativa','Interlocutor comercial','Material','Flujo de documentos']},
  {n:'1',t:'Procesos end-to-end',d:'Cómo un evento de negocio atraviesa varios módulos hasta convertirse en un asiento contable.',mods:['Lead to Cash','Source to Pay','Design to Operate','Recruit to Retire','Record to Report']},
  {n:'2',t:'Módulos',d:'Un módulo por página, siempre con el mismo modelo: estudio en capítulos, repaso por temas e integraciones.',mods:['SD','MM','FI','CO','PP','QM','PM','PS'],live:['SD','MM','FI','CO']},
  {n:'3',t:'Localización Brasil',d:'Cómo SAP trata NF-e, NFS-e, impuestos en el documento, DRC, SPED y la reforma tributaria.',mods:['NF-e y NFS-e','Impuestos en el documento','DRC','SPED','IBS / CBS']},
  {n:'4',t:'Tecnología para arquitectos',d:'Integración, extensibilidad, analítica, Fiori y autorizaciones.',mods:['IDoc, APIs y eventos','Extensibilidad','CDS y Embedded Analytics','Fiori','Autorizaciones']},
  {n:'5',t:'Visión de arquitecto',d:'Fit-to-standard, estándar frente a desarrollo propio, greenfield frente a brownfield, SAP Activate.',mods:['Fit-to-standard','Estándar o desarrollo','Greenfield o brownfield','SAP Activate','Limitaciones recurrentes']}]
};
