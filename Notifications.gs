function getIncidentTrackingUrl_(id){return getWebAppUrl_()+'?modo=seguimiento&id='+encodeURIComponent(String(id||''));}

function escapeHtml_(value){return String(value==null?'':value).replace(/[&<>"']/g,function(char){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[char];});}

function incidentEmailDetails_(incident){return[['Código',incident.ID],['Aula',incident.AULA],['Equipo',incident.ACTIVO],['Categoría',incident.CATEGORIA],['Prioridad',incident.PRIORIDAD],['Estado',incident.ESTADO],['Descripción',incident.DESCRIPCION]];}

function sendIncidentEmail_(incident,kind){
  const recipient=String(incident.DOCENTE||'').trim().toLowerCase();
  if(!isEducarexEmail_(recipient))throw new Error('La incidencia no tiene un correo docente @educarex.es válido.');
  const resolved=kind==='RESUELTA',trackingUrl=getIncidentTrackingUrl_(incident.ID),details=incidentEmailDetails_(incident);
  if(resolved&&incident.SOLUCION)details.push(['Solución',incident.SOLUCION]);
  const heading=resolved?'Tu incidencia ha sido resuelta':'Hemos recibido tu incidencia';
  const subject=resolved?'[GIDI] Incidencia '+incident.ID+' resuelta':'[GIDI] Confirmación de incidencia '+incident.ID;
  const rows=details.map(function(pair){return '<tr><th style="text-align:left;padding:7px 10px;border-bottom:1px solid #e5e7eb;color:#475467">'+escapeHtml_(pair[0])+'</th><td style="padding:7px 10px;border-bottom:1px solid #e5e7eb">'+escapeHtml_(pair[1])+'</td></tr>';}).join('');
  const html='<div style="font-family:Arial,sans-serif;color:#172033;max-width:640px"><div style="background:#1d4ed8;color:#fff;padding:18px 22px"><strong>GIDI · Departamento de Informática</strong></div><div style="padding:22px;border:1px solid #d8dee8;border-top:0"><h2 style="margin-top:0">'+heading+'</h2><table style="width:100%;border-collapse:collapse;margin:16px 0">'+rows+'</table><p><a href="'+escapeHtml_(trackingUrl)+'" style="display:inline-block;background:#1d4ed8;color:#fff;text-decoration:none;padding:12px 18px;border-radius:8px;font-weight:bold">Consultar seguimiento</a></p><p style="font-size:12px;color:#667085">Este mensaje ha sido generado automáticamente por GIDI.</p></div></div>';
  const body=heading+'\n\n'+details.map(function(pair){return pair[0]+': '+String(pair[1]||'');}).join('\n')+'\n\nSeguimiento: '+trackingUrl;
  MailApp.sendEmail({to:recipient,subject:subject,body:body,htmlBody:html,name:'GIDI'});
}

function sendNotificationSafely_(incident,kind){
  try{
    sendIncidentEmail_(incident,kind);
    appendHistory_(incident.ID,'EMAIL_'+kind,incident.ESTADO,incident.ESTADO,'SISTEMA','Notificación enviada a '+incident.DOCENTE);
    return{emailSent:true};
  }catch(error){
    try{appendHistory_(incident.ID,'EMAIL_ERROR',incident.ESTADO,incident.ESTADO,'SISTEMA','No se pudo enviar la notificación: '+String(error.message||error).slice(0,300));}catch(ignore){}
    console.error(error);
    return{emailSent:false,warning:'La incidencia se guardó correctamente, pero no se pudo enviar el correo de aviso.'};
  }
}

function sendIncidentCreatedNotificationSafely_(incident){return sendNotificationSafely_(incident,'ALTA');}
function sendIncidentResolvedNotificationSafely_(incident){return sendNotificationSafely_(incident,'RESUELTA');}

function authorizeEmailNotifications(){
  requireAdmin_();
  return{ok:true,remainingQuota:MailApp.getRemainingDailyQuota()};
}
