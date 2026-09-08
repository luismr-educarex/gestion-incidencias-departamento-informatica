function apiEditorBootstrap(aulaCode) {
  const user = requireManager_();
  const aula = getAulaByCode_(aulaCode);
  if (!aula) throw new Error('Aula no encontrada.');
  return { ok: true, user, aula, assets: getActivosByAula_(aulaCode) };
}

function apiSaveMapLayout(aulaCode, assets) {
  requireManager_();
  const aula = String(aulaCode || '').trim().toUpperCase();
  if (!getAulaByCode_(aula)) throw new Error('Aula no encontrada.');
  if (!Array.isArray(assets) || !assets.length) throw new Error('No hay elementos que guardar.');
  if (assets.length > 200) throw new Error('El mapa contiene demasiados elementos.');
  const incoming = new Map();
  assets.forEach(function(asset){
    const code = String(asset && asset.codigo || '').trim();
    if (!code || incoming.has(code)) throw new Error('La disposición contiene elementos duplicados o sin código.');
    incoming.set(code, asset);
  });
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const sh = getSpreadsheet_().getSheetByName(APP.SHEETS.ACTIVOS);
    const values = sh.getDataRange().getValues();
    const headers = values[0].map(String);
    const idx = Object.fromEntries(headers.map((h,i) => [h,i]));
    const required = ['CODIGO','AULA','X','Y','W','H','ROTACION'];
    if (required.some(function(name){ return idx[name] === undefined; })) throw new Error('La hoja ACTIVOS no tiene la estructura esperada.');
    const rows = new Map();
    for (let r=1; r<values.length; r++) if (String(values[r][idx.AULA]).trim().toUpperCase() === aula) rows.set(String(values[r][idx.CODIGO]).trim(), r + 1);
    incoming.forEach(function(asset, code){ if (!rows.has(code)) throw new Error('El elemento '+code+' no pertenece al aula '+aula+'.'); });
    const finite = function(value, label){ const number=Number(value); if(!Number.isFinite(number)) throw new Error('Valor no válido en '+label+'.'); return number; };
    const clamp = function(number,min,max){ return Math.max(min,Math.min(max,number)); };
    let changed = 0;
    incoming.forEach(function(asset, code){
      const w=clamp(finite(asset.w,code+' ancho'),3,40),h=clamp(finite(asset.h,code+' alto'),3,25);
      const row=[clamp(finite(asset.x,code+' X'),0,100-w),clamp(finite(asset.y,code+' Y'),0,100-h),w,h,clamp(finite(asset.rotacion,code+' rotación'),-180,180)];
      sh.getRange(rows.get(code),idx.X+1,1,5).setValues([row]);
      changed++;
    });
    return { ok:true, changed:changed };
  } finally {
    lock.releaseLock();
  }
}
