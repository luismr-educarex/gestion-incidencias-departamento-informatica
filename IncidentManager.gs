function apiListIncidents(filters){
  requireManager_();
  const f=filters||{}, rows=getSheetRows_(APP.SHEETS.INCIDENCIAS);
  return {ok:true,incidents:rows.filter(r=>{
    if(f.aula&&String(r.AULA)!==String(f.aula))return false;
    if(f.estado&&String(r.ESTADO)!==String(f.estado))return false;
    if(f.prioridad&&String(r.PRIORIDAD)!==String(f.prioridad))return false;
    if(f.abiertas&&!['NUEVA','ASIGNADA','EN_PROCESO'].includes(String(r.ESTADO).toUpperCase()))return false;
    return true;
  }).map(r=>({id:String(r.ID),fecha:formatDateTime_(r.FECHA_ALTA),aula:String(r.AULA),activo:String(r.ACTIVO),categoria:String(r.CATEGORIA),prioridad:String(r.PRIORIDAD),descripcion:String(r.DESCRIPCION),estado:String(r.ESTADO),responsable:String(r.RESPONSABLE||'')})).reverse()};
}
function apiManagerBootstrap(){
  const user=requireManager_();
  const users=getAssignableManagers_();
  const aulas=getSheetRows_(APP.SHEETS.AULAS).filter(r=>String(r.ACTIVA).toUpperCase()!=='NO').map(r=>({codigo:String(r.CODIGO),nombre:String(r.NOMBRE)}));
  return {ok:true,user,users,aulas,states:['NUEVA','ASIGNADA','EN_PROCESO','RESUELTA','CERRADA'],priorities:APP.PRIORITIES};
}
