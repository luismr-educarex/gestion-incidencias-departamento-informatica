function apiCreateIncident(p){
  const user=requireRegisteredUser_();
  if(!p||!String(p.aula||'').trim()||!String(p.categoria||'').trim()||!String(p.descripcion||'').trim())throw new Error('Completa aula, categoría y descripción.');
  const aula=String(p.aula).trim().toUpperCase(),category=String(p.categoria).trim(),priority=String(p.prioridad||'NORMAL').trim().toUpperCase(),description=String(p.descripcion).trim().slice(0,1000),assetCode=String(p.activo||'AULA').trim();
  if(!getAulaByCode_(aula))throw new Error('El aula no existe o está desactivada.');
  if(!getCategories_().includes(category))throw new Error('La categoría no existe o está desactivada.');
  if(!APP.PRIORITIES.includes(priority))throw new Error('La prioridad indicada no es válida.');
  let assetType='GENERAL';
  if(assetCode!=='AULA'){
    const asset=getActivosByAula_(aula).find(function(item){return item.codigo===assetCode;});
    if(!asset)throw new Error('El equipo no pertenece al aula o está desactivado.');
    assetType=asset.tipo;
  }
  const sh=getSpreadsheet_().getSheetByName(APP.SHEETS.INCIDENCIAS),lock=LockService.getScriptLock(),email=user.email;
  let id,now,incident;
  lock.waitLock(10000);
  try{
    id=nextIncidentId_();now=new Date();
    incident={ID:id,FECHA_ALTA:now,AULA:aula,ACTIVO:assetCode,TIPO_ACTIVO:assetType,DOCENTE:email,CATEGORIA:category,PRIORIDAD:priority,DESCRIPCION:description,ESTADO:APP.STATUS.NUEVA,RESPONSABLE:'',FECHA_ASIGNACION:'',FECHA_RESOLUCION:'',SOLUCION:'',OBSERVACIONES:''};
    sh.appendRow([incident.ID,incident.FECHA_ALTA,incident.AULA,incident.ACTIVO,incident.TIPO_ACTIVO,incident.DOCENTE,incident.CATEGORIA,incident.PRIORIDAD,incident.DESCRIPCION,incident.ESTADO,'','','','','']);
    appendHistory_(id,'ALTA','',APP.STATUS.NUEVA,email,incident.DESCRIPCION);
  }finally{lock.releaseLock();}
  const notification=sendIncidentCreatedNotificationSafely_(incident);
  return{ok:true,id:id,fecha:formatDateTime_(now),trackingUrl:getIncidentTrackingUrl_(id),emailSent:notification.emailSent,emailWarning:notification.warning||''};
}
function nextIncidentId_(){const pr=PropertiesService.getScriptProperties(),y=Utilities.formatDate(new Date(),Session.getScriptTimeZone(),'yyyy'),k=`INC_SEQ_${y}`,n=Number(pr.getProperty(k)||0)+1;pr.setProperty(k,String(n));return`INC-${y}-${String(n).padStart(6,'0')}`}
function appendHistory_(incidentId,action,fromState,toState,user,notes){getSpreadsheet_().getSheetByName(APP.SHEETS.HISTORIAL).appendRow([new Date(),incidentId,user||'',action,fromState||'',toState||'',notes||''])}
