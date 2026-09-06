# GIDI

**Gestión de Incidencias del Departamento de Informática**.

Aplicación para registrar y gestionar incidencias de las aulas de informática mediante QR, mapa interactivo del aula y Google Apps Script/Sheets.

## Alcance

- 8 aulas.
- 25 equipos de alumnado por aula como objetivo operativo.
- Equipo de profesor y proyector.
- Registro de incidencias por activo y generales de aula.
- Estados, prioridades e historial.
- Interfaz responsive para móvil, tablet y ordenador.
- Mapas basados en los croquis reales recuperados.

## V0.3 — Editor visual de mapas

El editor permite arrastrar activos y ajustar X/Y, ancho, alto y rotación. La geometría se persiste en la hoja `ACTIVOS`.

Ruta prevista: `.../exec?modo=editor&aula=A01`.

## Estado del repositorio

La rama `develop` contiene el trabajo de la V0.3. La aplicación Apps Script completa se está incorporando de forma incremental y no debe desplegarse desde `main` hasta integrar y revisar la base funcional.