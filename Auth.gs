const GIDI_INITIAL_ADMIN='lmartinezr10@educarex.es';
const GIDI_ROLES=Object.freeze({DOCENTE:'DOCENTE',SUPERVISOR:'SUPERVISOR',ADMIN:'ADMIN'});

function normalizeRole_(role){
  const value=String(role||'').trim().toUpperCase();
  return value==='GESTOR'?GIDI_ROLES.SUPERVISOR:value;
}

function isEducarexEmail_(email){return /^[^@\s]+@educarex\.es$/i.test(String(email||'').trim());}

function getCurrentUser_(){
  const email=String(Session.getActiveUser().getEmail()||'').trim().toLowerCase();
  if(!email)return{email:'',role:null};
  if(email===GIDI_INITIAL_ADMIN)return{email:email,role:GIDI_ROLES.ADMIN};
  const row=getSheetRows_(APP.SHEETS.USUARIOS).find(function(user){return String(user.EMAIL||'').trim().toLowerCase()===email&&String(user.ACTIVO||'SI').toUpperCase()!=='NO';});
  return{email:email,role:row?normalizeRole_(row.ROL):null};
}

function requireRole_(allowed){
  const user=getCurrentUser_();
  if(!user.email)throw new Error('Debes iniciar sesión con una cuenta @educarex.es.');
  if(!user.role)throw new Error('Tu cuenta no está dada de alta en GIDI. Contacta con el administrador.');
  if(!allowed.includes(user.role))throw new Error('No tienes permisos para realizar esta acción.');
  return user;
}

function requireRegisteredUser_(){return requireRole_([GIDI_ROLES.DOCENTE,GIDI_ROLES.SUPERVISOR,GIDI_ROLES.ADMIN]);}
function apiCurrentUser(){const user=getCurrentUser_();return{ok:true,email:user.email,role:user.role};}
function requireManager_(){return requireRole_([GIDI_ROLES.SUPERVISOR,GIDI_ROLES.ADMIN]);}
function requireAdmin_(){return requireRole_([GIDI_ROLES.ADMIN]);}
