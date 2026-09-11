function apiTrackIncident(id){
  const user=requireRegisteredUser_(),incident=findIncident_(id);
  if(!incident)throw new Error('Incidencia no encontrada.');
  const owner=String(incident.DOCENTE||'').trim().toLowerCase();
  if(user.role===GIDI_ROLES.DOCENTE&&owner!==user.email)throw new Error('No tienes permisos para consultar esta incidencia.');
  const history=getSheetRows_(APP.SHEETS.HISTORIAL).filter(function(row){return String(row.INCIDENCIA)===String(id)&&String(row.ACCION)!=='EMAIL_ERROR';}).map(function(row){return{fecha:formatDateTime_(row.FECHA),accion:String(row.ACCION||''),estadoAnterior:String(row.ESTADO_ANTERIOR||''),estadoNuevo:String(row.ESTADO_NUEVO||''),observacion:String(row.OBSERVACION||'')};});
  return{ok:true,user:user,incident:{id:String(incident.ID),fecha:formatDateTime_(incident.FECHA_ALTA),aula:String(incident.AULA),activo:String(incident.ACTIVO),categoria:String(incident.CATEGORIA),prioridad:String(incident.PRIORIDAD),descripcion:String(incident.DESCRIPCION),estado:String(incident.ESTADO),responsable:String(incident.RESPONSABLE||''),fechaResolucion:formatDateTime_(incident.FECHA_RESOLUCION),solucion:String(incident.SOLUCION||'')},history:history};
}
