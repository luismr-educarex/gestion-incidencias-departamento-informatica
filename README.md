# GIDI

**Gestión de Incidencias del Departamento de Informática**.

Aplicación para registrar y gestionar incidencias de las aulas de informática mediante QR, mapa interactivo y Google Apps Script/Sheets.

## Alcance

- 8 aulas.
- 25 equipos de alumnado por aula como objetivo operativo.
- Equipo de profesor y proyector.
- Registro de incidencias por activo y generales de aula.
- Estados, prioridades e historial.
- Interfaz responsive para móvil, tablet y ordenador.
- Mapas basados en los croquis reales recuperados.

## V0.3 — Aplicación desplegable

La rama `develop` contiene la aplicación completa para Google Apps Script:

- alta de incidencias desde el plano de cada aula;
- panel de seguimiento;
- gestión del ciclo de vida de las incidencias;
- editor visual de mapas;
- bootstrap de la hoja de cálculo, las 8 aulas y sus activos.

Rutas principales:

- `.../exec`: panel por defecto;
- `.../exec?modo=panel`: panel de seguimiento;
- `.../exec?modo=aulas`: selector de aulas para el ordenador del profesor;
- `.../exec?modo=incidencias`: gestión de incidencias;
- `.../exec?aula=A01`: registro docente para el aula A01;
- `.../exec?modo=editor&aula=A01`: editor del mapa de A01.

El editor permite arrastrar activos y ajustar X/Y, ancho, alto y rotación. La geometría se persiste en `ACTIVOS`.

El selector `modo=aulas` ofrece enlaces directos y copiables a las ocho aulas. Está pensado para guardarlo como favorito en el ordenador del profesor.

## Seguridad

La Web App se ejecuta con la identidad del propietario del despliegue y limita el acceso al dominio de Google Workspace. Las acciones de gestión requieren además un usuario identificado con rol autorizado en la hoja `USUARIOS`.

## Estado

La V0.3 sigue en `develop`. El bootstrap, la interfaz docente y la prueba end-to-end están completos. No debe fusionarse a `main` hasta validar el acceso con una segunda cuenta del dominio y contrastar físicamente los mapas y proyectores.

## Siguiente hito

Validación en el centro con una segunda cuenta de Google Workspace y revisión física de las 8 aulas.
