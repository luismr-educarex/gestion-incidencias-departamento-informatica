function doGet(e){
  const p=(e&&e.parameter)||{};
  const aula=String(p.aula||'').trim().toUpperCase();
  const modo=String(p.modo||'').trim().toLowerCase();
  let view='Index';
  if(modo==='editor') view='MapEditor';
  else if(modo==='incidencias') view='IncidentsManager';
  else if(modo==='panel'||(!aula&&modo!=='editor')) view='Dashboard';
  const t=HtmlService.createTemplateFromFile(view);t.appName=APP.NAME;t.appVersion=APP.VERSION;t.aula=aula;
  const titles={Dashboard:'GIDI · Panel',MapEditor:`GIDI · Editor ${aula}`,IncidentsManager:'GIDI · Gestión de incidencias'};
  return t.evaluate().setTitle(titles[view]||APP.NAME).addMetaTag('viewport','width=device-width, initial-scale=1, viewport-fit=cover').setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}
function include_(f){return HtmlService.createHtmlOutputFromFile(f).getContent()}
function apiBootstrap(code){const aula=getAulaByCode_(code);if(!aula)return{ok:false,message:'El código de aula no existe o está desactivado.'};const assets=getActivosByAula_(code),incs=getOpenIncidentsByAula_(code),by={};incs.forEach(function(i){(by[i.activo]||(by[i.activo]=[])).push(i);});return{ok:true,app:{name:APP.NAME,version:APP.VERSION},aula:aula,assets:assets.map(function(a){return Object.assign({},a,{incidencias:by[a.codigo]||[]});}),categories:getCategories_(),priorities:APP.PRIORITIES};}
