function apiClassroomAdminBootstrap(){
  requireAdmin_();
  const rooms=getSheetRows_(APP.SHEETS.AULAS).map(function(row){
    return{codigo:String(row.CODIGO||'').trim().toUpperCase(),nombre:String(row.NOMBRE||''),ubicacion:String(row.UBICACION||''),activa:String(row.ACTIVA||'SI').toUpperCase()==='NO'?'NO':'SI'};
  }).filter(function(room){return room.codigo;}).sort(function(a,b){return a.codigo.localeCompare(b.codigo);});
  const assets=getSheetRows_(APP.SHEETS.ACTIVOS).map(function(row){
    return{codigo:String(row.CODIGO||'').trim(),aula:String(row.AULA||'').trim().toUpperCase(),tipo:String(row.TIPO||''),nombre:String(row.NOMBRE||row.CODIGO||''),estado:String(row.ESTADO||'OPERATIVO').trim().toUpperCase(),activo:String(row.ACTIVO||'SI').toUpperCase()==='NO'?'NO':'SI'};
  }).filter(function(asset){return asset.codigo;}).sort(function(a,b){return a.aula.localeCompare(b.aula)||a.codigo.localeCompare(b.codigo);});
  return{ok:true,rooms:rooms,assets:assets};
}

function apiSaveClassroomAdministration(payload){
  requireAdmin_();
  const rooms=payload&&payload.rooms,assets=payload&&payload.assets;
  if(!Array.isArray(rooms)||!Array.isArray(assets))throw new Error('Los datos recibidos no son válidos.');
  if(rooms.length>100||assets.length>2000)throw new Error('Se han recibido demasiados registros.');
  const roomUpdates=new Map(),assetUpdates=new Map();
  rooms.forEach(function(room){
    const code=String(room&&room.codigo||'').trim().toUpperCase(),name=String(room&&room.nombre||'').trim(),location=String(room&&room.ubicacion||'').trim();
    if(!code||roomUpdates.has(code))throw new Error('Hay aulas duplicadas o sin código.');
    if(!name)throw new Error('El aula '+code+' debe tener nombre.');
    if(name.length>120||location.length>160)throw new Error('El nombre o la ubicación de '+code+' es demasiado largo.');
    roomUpdates.set(code,{nombre:name,ubicacion:location,activa:String(room.activa||'SI').toUpperCase()==='NO'?'NO':'SI'});
  });
  assets.forEach(function(asset){
    const code=String(asset&&asset.codigo||'').trim(),name=String(asset&&asset.nombre||'').trim(),state=String(asset&&asset.estado||'OPERATIVO').trim().toUpperCase();
    if(!code||assetUpdates.has(code))throw new Error('Hay puestos duplicados o sin código.');
    if(!name)throw new Error('El puesto '+code+' debe tener nombre.');
    if(name.length>120||!state||state.length>40)throw new Error('El nombre o el estado de '+code+' no es válido.');
    assetUpdates.set(code,{nombre:name,estado:state,activo:String(asset.activo||'SI').toUpperCase()==='NO'?'NO':'SI'});
  });
  const lock=LockService.getScriptLock();lock.waitLock(10000);
  try{
    const ss=getSpreadsheet_(),roomSheet=ss.getSheetByName(APP.SHEETS.AULAS),assetSheet=ss.getSheetByName(APP.SHEETS.ACTIVOS);
    const roomValues=roomSheet.getDataRange().getValues(),assetValues=assetSheet.getDataRange().getValues();
    const roomIdx=Object.fromEntries(roomValues[0].map(function(header,index){return[String(header),index];}));
    const assetIdx=Object.fromEntries(assetValues[0].map(function(header,index){return[String(header),index];}));
    if(['CODIGO','NOMBRE','UBICACION','ACTIVA'].some(function(header){return roomIdx[header]===undefined;}))throw new Error('La hoja AULAS no tiene la estructura esperada.');
    if(['CODIGO','NOMBRE','ESTADO','ACTIVO'].some(function(header){return assetIdx[header]===undefined;}))throw new Error('La hoja ACTIVOS no tiene la estructura esperada.');
    let roomsChanged=0,assetsChanged=0;
    roomUpdates.forEach(function(update,code){
      const row=roomValues.find(function(values,index){return index>0&&String(values[roomIdx.CODIGO]).trim().toUpperCase()===code;});
      if(!row)throw new Error('El aula '+code+' ya no existe. Recarga la página.');
      if(String(row[roomIdx.NOMBRE])!==update.nombre||String(row[roomIdx.UBICACION])!==update.ubicacion||String(row[roomIdx.ACTIVA]).toUpperCase()!==update.activa){row[roomIdx.NOMBRE]=update.nombre;row[roomIdx.UBICACION]=update.ubicacion;row[roomIdx.ACTIVA]=update.activa;roomsChanged++;}
    });
    assetUpdates.forEach(function(update,code){
      const row=assetValues.find(function(values,index){return index>0&&String(values[assetIdx.CODIGO]).trim()===code;});
      if(!row)throw new Error('El puesto '+code+' ya no existe. Recarga la página.');
      if(String(row[assetIdx.NOMBRE])!==update.nombre||String(row[assetIdx.ESTADO]).toUpperCase()!==update.estado||String(row[assetIdx.ACTIVO]).toUpperCase()!==update.activo){row[assetIdx.NOMBRE]=update.nombre;row[assetIdx.ESTADO]=update.estado;row[assetIdx.ACTIVO]=update.activo;assetsChanged++;}
    });
    if(roomsChanged){
      const rows=roomValues.slice(1);
      roomSheet.getRange(2,roomIdx.NOMBRE+1,rows.length,1).setValues(rows.map(function(row){return[row[roomIdx.NOMBRE]];}));
      roomSheet.getRange(2,roomIdx.UBICACION+1,rows.length,1).setValues(rows.map(function(row){return[row[roomIdx.UBICACION]];}));
      roomSheet.getRange(2,roomIdx.ACTIVA+1,rows.length,1).setValues(rows.map(function(row){return[row[roomIdx.ACTIVA]];}));
    }
    if(assetsChanged){
      const rows=assetValues.slice(1);
      assetSheet.getRange(2,assetIdx.NOMBRE+1,rows.length,1).setValues(rows.map(function(row){return[row[assetIdx.NOMBRE]];}));
      assetSheet.getRange(2,assetIdx.ESTADO+1,rows.length,1).setValues(rows.map(function(row){return[row[assetIdx.ESTADO]];}));
      assetSheet.getRange(2,assetIdx.ACTIVO+1,rows.length,1).setValues(rows.map(function(row){return[row[assetIdx.ACTIVO]];}));
    }
    return{ok:true,roomsChanged:roomsChanged,assetsChanged:assetsChanged};
  }finally{lock.releaseLock();}
}
