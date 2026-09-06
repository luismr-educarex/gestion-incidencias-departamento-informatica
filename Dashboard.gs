function apiDashboard(){
  assertManagerAccess_();
  const aulas=getSheetRows_(APP.SHEETS.AULAS).filter(r=>String(r.ACTIVA).toUpperCase()!=='NO');
  const incidents=getSheetRows_(APP.SHEETS.INCIDENCIAS);
  const open=incidents.filter(i=>!['RESUELTA','CERRADA'].includes(String(i.ESTADO).toUpperCase()));
  const today=Utilities.formatDate(new Date(),Session.getScriptTimeZone(),'yyyy-MM-dd');
  const rooms=aulas.map(a=>{
    const list=open.filter(i=>String(i.AULA).toUpperCase()===String(a.CODIGO).toUpperCase());
    return {codigo:String(a.CODIGO),nombre:String(a.NOMBRE),abiertas:list.length,urgentes:list.filter(i=>String(i.PRIORIDAD).toUpperCase()==='URGENTE').length,enProceso:list.filter(i=>String(i.ESTADO).toUpperCase()==='EN_PROCESO').length};
  });
  return {ok:true,summary:{abiertas:open.length,urgentes:open.filter(i=>String(i.PRIORIDAD).toUpperCase()==='URGENTE').length,enProceso:open.filter(i=>String(i.ESTADO).toUpperCase()==='EN_PROCESO').length,hoy:incidents.filter(i=>{const d=i.FECHA_ALTA instanceof Date?i.FECHA_ALTA:new Date(i.FECHA_ALTA);return !isNaN(d)&&Utilities.formatDate(d,Session.getScriptTimeZone(),'yyyy-MM-dd')===today}).length},rooms};
}
function assertManagerAccess_(){const email=Session.getActiveUser().getEmail();if(!email)throw new Error('El panel requiere iniciar sesión con una cuenta autorizada.');}
