function apiClassrooms(){
  const user=getCurrentUser_();
  const rooms=getSheetRows_(APP.SHEETS.AULAS)
    .filter(function(row){return String(row.ACTIVA||'SI').toUpperCase()!=='NO';})
    .map(function(row){
      return{codigo:String(row.CODIGO||''),nombre:String(row.NOMBRE||''),ubicacion:String(row.UBICACION||'')};
    });
  return{ok:true,user:user,baseUrl:ScriptApp.getService().getUrl(),rooms:rooms};
}
