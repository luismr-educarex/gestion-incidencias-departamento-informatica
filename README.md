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

La rama `develop` ya contiene el enrutamiento del editor, capa de repositorio de Sheets, servicio de alta de incidencias, persistencia del editor y manifiesto Apps Script.

## Seguridad pendiente

El editor exige actualmente una sesión Google identificable. Antes de producción se sustituirá por una lista explícita de gestores autorizados. El manifiesto sigue siendo de prototipo y debe endurecerse según la configuración Google Workspace del centro.

## Siguiente hito

Completar el bootstrap de la hoja de cálculo con los mapas reales y construir el panel de jefatura para las ocho aulas.