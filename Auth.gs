const GIDI_ROLES=Object.freeze({DOCENTE:'DOCENTE',GESTOR:'GESTOR',ADMIN:'ADMIN'});
function getCurrentUser_(){const email=String(Session.getActiveUser().getEmail()||'').trim().toLowerCase();if(!email)return{email:'',role:null};const rows=getSheetRows_('USUARIOS');const row=rows.find(r=>String(r.EMAIL||'').trim().toLowerCase()===email&&String(r.ACTIVO||'SI').toUpperCase()!=='NO');return{email,role:row?String(row.ROL||GIDI_ROLES.DOCENTE).toUpperCase():GIDI_ROLES.DOCENTE};}
function requireRole_(allowed){const user=getCurrentUser_();if(!user.email)throw new Error('Debes iniciar sesión con una cuenta autorizada.');if(!allowed.includes(user.role))throw new Error('No tienes permisos para realizar esta acción.');return user;}
function apiCurrentUser(){const u=getCurrentUser_();return{ok:true,email:u.email,role:u.role};}
function requireManager_(){return requireRole_([GIDI_ROLES.GESTOR,GIDI_ROLES.ADMIN]);}
function requireAdmin_(){return requireRole_([GIDI_ROLES.ADMIN]);}
