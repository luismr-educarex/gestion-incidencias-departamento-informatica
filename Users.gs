function apiListUsers(){
  requireAdmin_();
  const users=getSheetRows_(APP.SHEETS.USUARIOS).map(function(row){
    const email=String(row.EMAIL||'').trim().toLowerCase();
    return{email:email,nombre:String(row.NOMBRE||''),rol:email===GIDI_INITIAL_ADMIN?GIDI_ROLES.ADMIN:normalizeRole_(row.ROL),activo:String(row.ACTIVO||'SI').toUpperCase()!=='NO'?'SI':'NO'};
  });
  if(!users.some(function(user){return user.email===GIDI_INITIAL_ADMIN;}))users.unshift({email:GIDI_INITIAL_ADMIN,nombre:'Luis Martínez Redondo',rol:GIDI_ROLES.ADMIN,activo:'SI'});
  return{ok:true,users:users,roles:[GIDI_ROLES.DOCENTE,GIDI_ROLES.SUPERVISOR],initialAdmin:GIDI_INITIAL_ADMIN};
}

function apiUpsertUser(payload){
  requireAdmin_();
  const email=String(payload&&payload.email||'').trim().toLowerCase(),nombre=String(payload&&payload.nombre||'').trim(),rol=normalizeRole_(payload&&payload.rol||GIDI_ROLES.DOCENTE),activo=String(payload&&payload.activo||'SI').trim().toUpperCase()==='NO'?'NO':'SI';
  if(!isEducarexEmail_(email))throw new Error('El correo debe pertenecer al dominio @educarex.es.');
  if(email===GIDI_INITIAL_ADMIN&&rol!==GIDI_ROLES.ADMIN)throw new Error('No se puede cambiar el rol del administrador inicial.');
  if(email!==GIDI_INITIAL_ADMIN&&![GIDI_ROLES.DOCENTE,GIDI_ROLES.SUPERVISOR].includes(rol))throw new Error('El rol debe ser DOCENTE o SUPERVISOR.');
  if(email===GIDI_INITIAL_ADMIN&&activo==='NO')throw new Error('No se puede desactivar el administrador inicial.');
  const sh=getSpreadsheet_().getSheetByName(APP.SHEETS.USUARIOS),values=sh.getDataRange().getValues();
  for(let row=1;row<values.length;row++)if(String(values[row][0]).trim().toLowerCase()===email){sh.getRange(row+1,1,1,4).setValues([[email,nombre,rol,activo]]);return{ok:true,updated:true,user:{email:email,nombre:nombre,rol:rol,activo:activo}};}
  sh.appendRow([email,nombre,rol,activo]);
  return{ok:true,created:true,user:{email:email,nombre:nombre,rol:rol,activo:activo}};
}

function apiDisableUser(email){
  requireAdmin_();
  const target=String(email||'').trim().toLowerCase();
  if(target===GIDI_INITIAL_ADMIN)throw new Error('No se puede desactivar el administrador inicial.');
  const sh=getSpreadsheet_().getSheetByName(APP.SHEETS.USUARIOS),values=sh.getDataRange().getValues();
  for(let row=1;row<values.length;row++)if(String(values[row][0]).trim().toLowerCase()===target){sh.getRange(row+1,4).setValue('NO');return{ok:true};}
  throw new Error('Usuario no encontrado.');
}
