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
  seedBasicData_(ss); seedAssetsFromRecoveredMaps_(ss); addInitialAdmin(GIDI_INITIAL_ADMIN,'Luis Martínez Redondo');
  return {spreadsheetId:ss.getId(),url:ss.getUrl(),assets:ss.getSheetByName(APP.SHEETS.ACTIVOS).getLastRow()-1};
}
function createSheet_(ss,name,headers){let sh=ss.getSheetByName(name)||ss.insertSheet(name);sh.clear();sh.getRange(1,1,1,headers.length).setValues([headers]);sh.setFrozenRows(1);sh.getRange(1,1,1,headers.length).setFontWeight('bold');sh.autoResizeColumns(1,headers.length);return sh;}
function seedBasicData_(ss){
  const aulas=['1º DAM / 1º SMR-V','FPB I','2º DAW / 1º ASIR','2º SMR','1º DAW / 2º SMR-V','FPB II','2º DAM / 2º ASIR','1º SMR'];
  ss.getSheetByName(APP.SHEETS.AULAS).getRange(2,1,8,4).setValues(aulas.map((n,i)=>[`A${String(i+1).padStart(2,'0')}`,n,'','SI']));
  const cats=['Hardware','Software','Red / Internet','Periférico','Proyector','Electricidad','Mobiliario','Climatización','Otro'];
  ss.getSheetByName(APP.SHEETS.CATEGORIAS).getRange(2,1,cats.length,2).setValues(cats.map(c=>[c,'SI']));
  ss.getSheetByName(APP.SHEETS.CONFIG).getRange(2,1,4,2).setValues([['APP_VERSION',APP.VERSION],['MAP_SOURCE','Croquis recuperados IMG_3125–IMG_3132'],['EXPECTED_STUDENT_PCS','25'],['SETUP_DATE',new Date()]]);
}
function seedAssetsFromRecoveredMaps_(ss){
 const seats={
 A01:[[8,25],[18,24],[8,36],[18,35],[8,47],[18,46],[7,61],[18,60],[29,60],[40,60],[79,23],[89,22],[61,34],[71,34],[80,33],[90,33],[61,45],[71,45],[80,45],[90,45],[61,57],[71,57],[80,57],[90,57],[81,69],[91,69]],
 A02:[[13,26],[26,26],[12,39],[26,39],[12,54],[26,54],[61,26],[75,26],[60,38],[75,38],[60,51],[75,51],[59,64],[75,64],[59,76],[75,76]],
 A03:[[8,25],[19,25],[8,37],[19,37],[8,49],[19,49],[20,63],[55,38],[66,38],[77,25],[88,25],[55,49],[66,49],[77,49],[88,49],[55,62],[66,62],[77,62],[88,62],[77,75],[88,75]],
 A04:[[8,26],[18,26],[35,25],[45,25],[55,25],[65,25],[79,24],[89,24],[8,37],[18,37],[35,36],[45,36],[55,36],[79,36],[89,36],[35,49],[45,49],[55,49],[79,49],[89,49],[35,61],[45,61],[55,61],[79,61],[89,61],[79,73]],
 A05:[[5,27],[16,27],[27,27],[38,27],[49,27],[88,27],[5,37],[16,37],[27,37],[38,37],[49,37],[88,37],[5,47],[16,47],[27,47],[38,47],[49,47],[88,47],[5,57],[16,57],[27,57],[38,57],[49,57],[88,57],[5,67],[16,67],[27,67],[38,67],[49,67]],
 A06:[[11,27],[26,27],[11,39],[26,39],[11,54],[26,54],[64,25],[80,25],[72,37],[72,51]],
 A07:[[5,26],[16,26],[27,26],[5,37],[16,37],[27,37],[5,49],[16,49],[27,49],[5,61],[16,61],[27,61],[16,73],[27,73],[57,25],[69,25],[81,25],[57,36],[69,36],[81,36],[57,48],[69,48],[81,48],[70,72],[82,72]],
 A08:[[10,27],[20,27],[31,27],[10,39],[20,39],[31,39],[10,51],[20,51],[31,51],[10,63],[20,63],[31,63],[10,75],[20,75],[31,75],[72,25],[83,25],[72,37],[83,37],[72,49],[83,49],[72,61],[83,61],[72,73],[83,73]]};
 const teachers={A01:[19,10],A02:[20,11],A03:[25,9],A04:[37,10],A05:[24,9],A06:[22,10],A07:[23,9],A08:[25,10]};
 const rows=[];
 Object.keys(seats).forEach(aula=>{
   seats[aula].slice(0,25).forEach((p,i)=>rows.push([`${aula}-PC${String(i+1).padStart(2,'0')}`,aula,'PC_ALUMNO',`PC ${String(i+1).padStart(2,'0')}`,Math.max(0,p[0]-3.8),Math.max(0,p[1]-2.25),7.6,4.5,0,'OPERATIVO','SI']));
   const t=teachers[aula]; rows.push([`${aula}-PROF`,aula,'PC_PROFESOR','Equipo profesor',Math.max(0,t[0]-9),Math.max(0,t[1]-3.75),18,7.5,0,'OPERATIVO','SI']);
   rows.push([`${aula}-PROY`,aula,'PROYECTOR','Proyector',41,1,18,6,0,'OPERATIVO','SI']);
 });
 const sh=ss.getSheetByName(APP.SHEETS.ACTIVOS); if(rows.length)sh.getRange(2,1,rows.length,rows[0].length).setValues(rows);
}
function addInitialAdmin(email,nombre){const e=String(email||'').trim().toLowerCase();if(!e||!e.includes('@'))throw new Error('Indica un correo válido.');const sh=getSpreadsheet_().getSheetByName(APP.SHEETS.USUARIOS),v=sh.getDataRange().getValues();for(let r=1;r<v.length;r++){if(String(v[r][0]).trim().toLowerCase()===e){sh.getRange(r+1,1,1,4).setValues([[e,String(nombre||''),'ADMIN','SI']]);return true;}}sh.appendRow([e,String(nombre||''),'ADMIN','SI']);return true;}
