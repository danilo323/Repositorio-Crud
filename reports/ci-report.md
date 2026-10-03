# Reporte de Integración Continua (Pipeline CI)

> **Proyecto:** Sistema de Gestión de Productos (Repositorio-Crud)  
> **Fecha de Ejecución:** 2/10/2026, 11:38:00 p. m.  
> **Estado General:** [EXITOSO]  
> **Tasa de Aprobación:** **100.0%**  

---

## Resumen Ejecutivo

| Etapa | Estado | Duración | Detalles |
| :--- | :---: | :---: | :--- |
| **1. Compilación / Build** | [OK] Aprobado | 42 ms | Artefactos generados en `dist/` (220.84 KB) |
| **2. Pruebas Unitarias** | [OK] Aprobado | 18 ms | **15/15** pruebas superadas |
| **3. Generación de Reportes** | [OK] Aprobado | < 10 ms | HTML, Markdown y JSON sincronizados |

---

## Detalle de Pruebas Automatizadas

| # | Caso de Prueba / Validación | Estado | Duración |
| :---: | :--- | :---: | :---: |
| 1 | Debe aceptar nombre válido que inicia con mayúscula y tiene entre 4 y 9 letras (ej: 'Laptop') | [OK] APROBADO | 1ms |
| 2 | Debe rechazar nombre que inicia con minúscula (ej: 'laptop') | [OK] APROBADO | 1ms |
| 3 | Debe rechazar nombre con menos de 4 caracteres (ej: 'Pc') | [OK] APROBADO | 1ms |
| 4 | Debe rechazar nombre con más de 9 caracteres (ej: 'Computadora') | [OK] APROBADO | 1ms |
| 5 | Debe rechazar nombres con números, espacios o caracteres especiales | [OK] APROBADO | 1ms |
| 6 | Debe rechazar valores nulos, vacíos o indefinidos | [OK] APROBADO | 1ms |
| 7 | Debe aceptar precios positivos enteros y decimales válidos | [OK] APROBADO | 1ms |
| 8 | Debe rechazar precios iguales a cero o negativos | [OK] APROBADO | 1ms |
| 9 | Debe rechazar valores de precio no numéricos | [OK] APROBADO | 1ms |
| 10 | Debe aceptar categorías válidas con longitud entre 3 y 15 letras y espacios | [OK] APROBADO | 1ms |
| 11 | Debe rechazar categorías demasiado cortas o demasiado largas | [OK] APROBADO | 1ms |
| 12 | Debe rechazar categorías que contengan números o símbolos especiales | [OK] APROBADO | 1ms |
| 13 | Debe filtrar productos por término de búsqueda (insensible a mayúsculas/minúsculas) | [OK] APROBADO | 2ms |
| 14 | Debe devolver lista completa si el término de búsqueda está vacío | [OK] APROBADO | 1ms |
| 15 | Debe retornar arreglo vacío cuando no hay coincidencias | [OK] APROBADO | 1ms |

---

## Información del Entorno y Compilación
- **Entorno:** GitHub Actions / Runner Local de Node.js
- **Carpeta de distribución:** `dist/`
- **Punto de entrada:** `index.html`

---
*Reporte generado automáticamente por el pipeline de CI/CD del proyecto.*
