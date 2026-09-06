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

## V0.3 — Editor visual de mapas

El editor permite arrastrar activos y ajustar X/Y, ancho, alto y rotación. La geometría se persiste en `ACTIVOS`.

Ruta: `.../exec?modo=editor&aula=A01`.

La rama `develop` contiene ya el enrutamiento del editor, la capa de acceso a Google Sheets, el servicio de alta de incidencias, la persistencia del editor y el manifiesto Apps Script.

## Seguridad pendiente

El editor exige actualmente una sesión Google identificable. Antes de producción se sustituirá por una lista explícita de gestores autorizados. El manifiesto sigue siendo de prototipo y debe endurecerse según la configuración Google Workspace del centro.

## Estado

La V0.3 sigue en PR borrador. No debe fusionarse a `main` hasta completar el bootstrap inicial de Sheets, incorporar la interfaz docente completa al repositorio y validar los mapas físicos.

## Siguiente hito

Bootstrap de las 8 aulas + panel de jefatura.