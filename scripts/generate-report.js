const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const reportsDir = path.join(rootDir, 'reports');
const resultsPath = path.join(reportsDir, 'test-results.json');
const buildInfoPath = path.join(rootDir, 'dist', 'build-info.json');

console.log("\n========================================================");
console.log(" GENERACIÓN DE REPORTES DEL PIPELINE CI");
console.log("========================================================\n");

if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir, { recursive: true });
}

let testData = {
    suite: "Sistema de Gestión de Productos - Pruebas Unitarias de CI",
    timestamp: new Date().toISOString(),
    total: 0,
    passed: 0,
    failed: 0,
    durationMs: 0,
    tests: []
};

if (fs.existsSync(resultsPath)) {
    try {
        testData = JSON.parse(fs.readFileSync(resultsPath, 'utf8'));
    } catch (e) {
        console.warn("No se pudo parsear test-results.json, usando valores por defecto.");
    }
}

let buildData = {
    status: "N/A",
    durationMs: 0,
    artifacts: { totalSizeKB: "0" }
};

if (fs.existsSync(buildInfoPath)) {
    try {
        buildData = JSON.parse(fs.readFileSync(buildInfoPath, 'utf8'));
    } catch (e) {
        // build data opcional
    }
}

const passRate = testData.total > 0 ? ((testData.passed / testData.total) * 100).toFixed(1) : "0.0";
const isSuccess = testData.failed === 0 && testData.total > 0;
const pipelineStatusText = isSuccess ? "APROBADO" : "FALLIDO";
const statusColor = isSuccess ? "#10b981" : "#ef4444";
const statusBadge = isSuccess ? "[EXITOSO]" : "[FALLIDO]";

// 1. Generar Reporte Markdown
const markdownReport = `# Reporte de Integración Continua (Pipeline CI)

> **Proyecto:** Sistema de Gestión de Productos (Repositorio-Crud)  
> **Fecha de Ejecución:** ${new Date(testData.timestamp).toLocaleString()}  
> **Estado General:** ${statusBadge}  
> **Tasa de Aprobación:** **${passRate}%**  

---

## Resumen Ejecutivo

| Etapa | Estado | Duración | Detalles |
| :--- | :---: | :---: | :--- |
| **1. Compilación / Build** | ${buildData.status === 'SUCCESS' ? '[OK] Aprobado' : 'Omitido/N/A'} | ${buildData.durationMs || 0} ms | Artefactos generados en \`dist/\` (${buildData.artifacts?.totalSizeKB || 0} KB) |
| **2. Pruebas Unitarias** | ${testData.failed === 0 ? '[OK] Aprobado' : '[ERROR] Falló'} | ${testData.durationMs || 0} ms | **${testData.passed}/${testData.total}** pruebas superadas |
| **3. Generación de Reportes** | [OK] Aprobado | < 10 ms | HTML, Markdown y JSON sincronizados |

---

## Detalle de Pruebas Automatizadas

| # | Caso de Prueba / Validación | Estado | Duración |
| :---: | :--- | :---: | :---: |
${testData.tests.map((t, idx) => `| ${idx + 1} | ${t.name} | ${t.status === 'PASSED' ? '[OK] APROBADO' : '[FALLO]'} | ${t.durationMs}ms |`).join('\n')}

---

## Información del Entorno y Compilación
- **Node.js:** \`${process.version}\`
- **Plataforma:** \`${process.platform}\`
- **Carpeta de distribución:** \`dist/\`
- **Punto de entrada:** \`index.html\`

---
*Reporte generado automáticamente por el pipeline de CI/CD del proyecto.*
`;

fs.writeFileSync(path.join(reportsDir, 'ci-report.md'), markdownReport, 'utf8');
console.log("  [OK] Reporte en Markdown generado: reports/ci-report.md");

// 2. Generar Reporte HTML
const htmlReport = `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reporte de Integración Continua - Sistema de Gestión de Productos</title>
    <style>
        :root {
            --bg-color: #0f172a;
            --card-bg: #1e293b;
            --text-color: #f8fafc;
            --text-muted: #94a3b8;
            --primary: #38bdf8;
            --success: #10b981;
            --danger: #ef4444;
            --border: #334155;
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            background-color: var(--bg-color);
            color: var(--text-color);
            padding: 30px 20px;
            line-height: 1.6;
        }
        .container {
            max-width: 900px;
            margin: 0 auto;
        }
        .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 2px solid var(--border);
            padding-bottom: 20px;
            margin-bottom: 25px;
            flex-wrap: wrap;
            gap: 15px;
        }
        .header h1 {
            font-size: 26px;
            font-weight: 700;
        }
        .badge {
            background-color: ${statusColor};
            color: #fff;
            padding: 8px 18px;
            border-radius: 9999px;
            font-weight: 700;
            font-size: 14px;
            letter-spacing: 0.5px;
        }
        .meta-info {
            color: var(--text-muted);
            font-size: 14px;
            margin-top: 5px;
        }
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
            gap: 15px;
            margin-bottom: 30px;
        }
        .stat-card {
            background-color: var(--card-bg);
            border: 1px solid var(--border);
            border-radius: 12px;
            padding: 18px;
            text-align: center;
        }
        .stat-card .value {
            font-size: 32px;
            font-weight: 800;
            color: var(--primary);
        }
        .stat-card .label {
            font-size: 13px;
            color: var(--text-muted);
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-top: 4px;
        }
        .section-title {
            font-size: 18px;
            font-weight: 600;
            margin-bottom: 12px;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .table-card {
            background-color: var(--card-bg);
            border: 1px solid var(--border);
            border-radius: 12px;
            overflow: hidden;
            margin-bottom: 30px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            text-align: left;
            font-size: 14px;
        }
        th, td {
            padding: 12px 16px;
            border-bottom: 1px solid var(--border);
        }
        th {
            background-color: rgba(255,255,255,0.03);
            color: var(--text-muted);
            font-weight: 600;
            text-transform: uppercase;
            font-size: 12px;
        }
        tr:last-child td {
            border-bottom: none;
        }
        .status-pill {
            display: inline-block;
            padding: 3px 10px;
            border-radius: 9999px;
            font-size: 12px;
            font-weight: 600;
        }
        .status-pass {
            background-color: rgba(16, 185, 129, 0.15);
            color: #34d399;
            border: 1px solid rgba(16, 185, 129, 0.3);
        }
        .status-fail {
            background-color: rgba(239, 68, 68, 0.15);
            color: #f87171;
            border: 1px solid rgba(239, 68, 68, 0.3);
        }
        .footer {
            text-align: center;
            color: var(--text-muted);
            font-size: 13px;
            padding-top: 20px;
            border-top: 1px solid var(--border);
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div>
                <h1>Pipeline de Integración Continua (CI)</h1>
                <div class="meta-info">Ejecutado el ${new Date(testData.timestamp).toLocaleString()} | Node ${process.version}</div>
            </div>
            <div class="badge">${pipelineStatusText} (${passRate}%)</div>
        </div>

        <div class="stats-grid">
            <div class="stat-card">
                <div class="value" style="color: ${statusColor};">${passRate}%</div>
                <div class="label">Tasa de Aprobación</div>
            </div>
            <div class="stat-card">
                <div class="value">${testData.total}</div>
                <div class="label">Pruebas Totales</div>
            </div>
            <div class="stat-card">
                <div class="value" style="color: var(--success);">${testData.passed}</div>
                <div class="label">Aprobadas</div>
            </div>
            <div class="stat-card">
                <div class="value" style="color: ${testData.failed > 0 ? 'var(--danger)' : 'var(--text-muted)'};">${testData.failed}</div>
                <div class="label">Fallidas</div>
            </div>
            <div class="stat-card">
                <div class="value">${testData.durationMs}ms</div>
                <div class="label">Tiempo de Test</div>
            </div>
        </div>

        <h2 class="section-title">Resumen del Proceso de Build</h2>
        <div class="table-card">
            <table>
                <thead>
                    <tr>
                        <th>Paso del Pipeline</th>
                        <th>Estado</th>
                        <th>Duración</th>
                        <th>Salida</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><strong>Compilación y Empaquetado (Build)</strong></td>
                        <td><span class="status-pill status-pass">${buildData.status === 'SUCCESS' ? 'COMPLETADO' : (buildData.status || 'OK')}</span></td>
                        <td>${buildData.durationMs || 0} ms</td>
                        <td>dist/ (${buildData.artifacts?.totalSizeKB || 0} KB)</td>
                    </tr>
                    <tr>
                        <td><strong>Suite de Pruebas Automatizadas</strong></td>
                        <td><span class="status-pill ${testData.failed === 0 ? 'status-pass' : 'status-fail'}">${pipelineStatusText}</span></td>
                        <td>${testData.durationMs || 0} ms</td>
                        <td>${testData.passed} pasadas / ${testData.failed} fallidas</td>
                    </tr>
                    <tr>
                        <td><strong>Generación de Reportes</strong></td>
                        <td><span class="status-pill status-pass">COMPLETADO</span></td>
                        <td>&lt; 10 ms</td>
                        <td>HTML, Markdown y JSON</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <h2 class="section-title">Resultados de las Pruebas Unitarias</h2>
        <div class="table-card">
            <table>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Caso de Prueba</th>
                        <th>Estado</th>
                        <th>Tiempo</th>
                    </tr>
                </thead>
                <tbody>
                    ${testData.tests.map((t, idx) => `
                    <tr>
                        <td>${idx + 1}</td>
                        <td>${t.name}</td>
                        <td><span class="status-pill ${t.status === 'PASSED' ? 'status-pass' : 'status-fail'}">${t.status === 'PASSED' ? 'APROBADO' : 'FALLIDO'}</span></td>
                        <td>${t.durationMs} ms</td>
                    </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>

        <div class="footer">
            Pipeline de Integración Continua Automatizado - Sistema de Gestión de Productos
        </div>
    </div>
</body>
</html>
`;

fs.writeFileSync(path.join(reportsDir, 'ci-report.html'), htmlReport, 'utf8');
console.log("  [OK] Reporte interactivo en HTML generado: reports/ci-report.html");

console.log("\n--------------------------------------------------------");
console.log(" GENERACIÓN DE REPORTES FINALIZADA");
console.log("--------------------------------------------------------\n");
