function apiCreateIncident(p){
  const user=requireRegisteredUser_();
  if(!p||!String(p.aula||'').trim()||!String(p.categoria||'').trim()||!String(p.descripcion||'').trim())throw new Error('Completa aula, categoría y descripción.');
  const sh=getSpreadsheet_().getSheetByName(APP.SHEETS.INCIDENCIAS),lock=LockService.getScriptLock(),email=user.email;
  let id,now,incident;
  lock.waitLock(10000);
  try{
    id=nextIncidentId_();now=new Date();
    incident={ID:id,FECHA_ALTA:now,AULA:String(p.aula).trim().toUpperCase(),ACTIVO:String(p.activo||'AULA'),TIPO_ACTIVO:String(p.tipoActivo||'GENERAL'),DOCENTE:email,CATEGORIA:String(p.categoria),PRIORIDAD:String(p.prioridad||'NORMAL').toUpperCase(),DESCRIPCION:String(p.descripcion).slice(0,1000),ESTADO:APP.STATUS.NUEVA,RESPONSABLE:'',FECHA_ASIGNACION:'',FECHA_RESOLUCION:'',SOLUCION:'',OBSERVACIONES:''};
    sh.appendRow([incident.ID,incident.FECHA_ALTA,incident.AULA,incident.ACTIVO,incident.TIPO_ACTIVO,incident.DOCENTE,incident.CATEGORIA,incident.PRIORIDAD,incident.DESCRIPCION,incident.ESTADO,'','','','','']);
    appendHistory_(id,'ALTA','',APP.STATUS.NUEVA,email,incident.DESCRIPCION);
  }finally{lock.releaseLock();}
  const notification=sendIncidentCreatedNotificationSafely_(incident);
  return{ok:true,id:id,fecha:formatDateTime_(now),trackingUrl:getIncidentTrackingUrl_(id),emailSent:notification.emailSent,emailWarning:notification.warning||''};
}
function nextIncidentId_(){const pr=PropertiesService.getScriptProperties(),y=Utilities.formatDate(new Date(),Session.getScriptTimeZone(),'yyyy'),k=`INC_SEQ_${y}`,n=Number(pr.getProperty(k)||0)+1;pr.setProperty(k,String(n));return`INC-${y}-${String(n).padStart(6,'0')}`}
function appendHistory_(incidentId,action,fromState,toState,user,notes){getSpreadsheet_().getSheetByName(APP.SHEETS.HISTORIAL).appendRow([new Date(),incidentId,user||'',action,fromState||'',toState||'',notes||''])}
