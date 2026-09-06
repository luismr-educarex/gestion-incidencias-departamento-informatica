function setupApplication(){
  const ss=SpreadsheetApp.create('GIDI · Gestión de Incidencias');
  PropertiesService.getScriptProperties().setProperty('SPREADSHEET_ID',ss.getId());
  createSheet_(ss,APP.SHEETS.AULAS,['CODIGO','NOMBRE','UBICACION','ACTIVA']);
  createSheet_(ss,APP.SHEETS.ACTIVOS,['CODIGO','AULA','TIPO','NOMBRE','X','Y','W','H','ROTACION','ESTADO','ACTIVO']);
  createSheet_(ss,APP.SHEETS.INCIDENCIAS,['ID','FECHA_ALTA','AULA','ACTIVO','TIPO_ACTIVO','DOCENTE','CATEGORIA','PRIORIDAD','DESCRIPCION','ESTADO','RESPONSABLE','FECHA_ASIGNACION','FECHA_RESOLUCION','SOLUCION','OBSERVACIONES']);
  createSheet_(ss,APP.SHEETS.HISTORIAL,['FECHA','INCIDENCIA','USUARIO','ACCION','ESTADO_ANTERIOR','ESTADO_NUEVO','OBSERVACION']);
  createSheet_(ss,APP.SHEETS.CATEGORIAS,['CATEGORIA','ACTIVA']);
  createSheet_(ss,APP.SHEETS.CONFIG,['CLAVE','VALOR']);
  createSheet_(ss,APP.SHEETS.USUARIOS,['EMAIL','NOMBRE','ROL','ACTIVO']);
  seedBasicData_(ss);
  return {spreadsheetId:ss.getId(),url:ss.getUrl()};
}
function createSheet_(ss,name,headers){let sh=ss.getSheetByName(name)||ss.insertSheet(name);sh.clear();sh.getRange(1,1,1,headers.length).setValues([headers]);sh.setFrozenRows(1);sh.getRange(1,1,1,headers.length).setFontWeight('bold');sh.autoResizeColumns(1,headers.length);return sh;}
function seedBasicData_(ss){
  const aulas=['1º DAM / 1º SMR-V','FPB I','2º DAW / 1º ASIR','2º SMR','1º DAW / 2º SMR-V','FPB II','2º DAM / 2º ASIR','1º SMR'];
  ss.getSheetByName(APP.SHEETS.AULAS).getRange(2,1,8,4).setValues(aulas.map((n,i)=>[`A${String(i+1).padStart(2,'0')}`,n,'','SI']));
  const cats=['Hardware','Software','Red / Internet','Periférico','Proyector','Electricidad','Mobiliario','Climatización','Otro'];
  ss.getSheetByName(APP.SHEETS.CATEGORIAS).getRange(2,1,cats.length,2).setValues(cats.map(c=>[c,'SI']));
}
function addInitialAdmin(email,nombre){const e=String(email||'').trim().toLowerCase();if(!e)throw new Error('Indica un correo válido.');const sh=getSpreadsheet_().getSheetByName(APP.SHEETS.USUARIOS);sh.appendRow([e,String(nombre||''),'ADMIN','SI']);return true;}
