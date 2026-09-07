function apiEditorBootstrap(aulaCode) {
  const aula = getAulaByCode_(aulaCode);
  if (!aula) throw new Error('Aula no encontrada.');
  return { ok: true, aula, assets: getActivosByAula_(aulaCode) };
}

function apiSaveMapLayout(aulaCode, assets) {
  const aula = String(aulaCode || '').trim().toUpperCase();
  if (!getAulaByCode_(aula)) throw new Error('Aula no encontrada.');
  if (!Array.isArray(assets) || !assets.length) throw new Error('No hay elementos que guardar.');
  const allowed = new Map(assets.map(a => [String(a.codigo), a]));
  const sh = getSpreadsheet_().getSheetByName(APP.SHEETS.ACTIVOS);
  const values = sh.getDataRange().getValues();
  const headers = values[0].map(String);
  const idx = Object.fromEntries(headers.map((h,i) => [h,i]));
  const clamp = (n,min,max) => Math.max(min, Math.min(max, Number(n) || 0));
  let changed = 0;
  for (let r=1; r<values.length; r++) {
    if (String(values[r][idx.AULA]).toUpperCase() !== aula) continue;
    const a = allowed.get(String(values[r][idx.CODIGO]));
    if (!a) continue;
    values[r][idx.X] = clamp(a.x,0,95); values[r][idx.Y] = clamp(a.y,0,95);
    values[r][idx.W] = clamp(a.w,3,40); values[r][idx.H] = clamp(a.h,3,25);
    values[r][idx.ROTACION] = clamp(a.rotacion,-180,180); changed++;
  }
  sh.getRange(1,1,values.length,values[0].length).setValues(values);
  return { ok:true, changed };
}
