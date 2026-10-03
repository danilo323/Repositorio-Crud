const { execSync } = require('child_process');
const path = require('path');

const rootDir = path.join(__dirname, '..');

console.log("================================================================================");
console.log(" INICIANDO SIMULADOR DE INTEGRACIÓN CONTINUA (CI PIPELINE RUNNER)");
console.log("================================================================================\n");

const pipelineStartTime = Date.now();

function runStep(name, command) {
    console.log(`\n[CI STEP] ${name}`);
    console.log(`  Comando: ${command}`);
    const stepStart = Date.now();
    try {
        execSync(command, { cwd: rootDir, stdio: 'inherit' });
        const stepDuration = Date.now() - stepStart;
        console.log(`[CI STEP SUCCESS] ${name} completado en ${stepDuration}ms`);
        return true;
    } catch (err) {
        const stepDuration = Date.now() - stepStart;
        console.error(`[CI STEP FAILURE] ${name} fallo tras ${stepDuration}ms`);
        return false;
    }
}

// Paso 1: Compilación / Build
const buildSuccess = runStep("Etapa 1: Compilación / Build Automatizado", "node scripts/build.js");
if (!buildSuccess) {
    console.error("\n[ERROR] Pipeline CI abortado en la etapa de Compilación.");
    process.exit(1);
}

// Paso 2: Ejecución de Pruebas Automatizadas
const testSuccess = runStep("Etapa 2: Pruebas Automatizadas (Unit Tests)", "node tests/products.test.js");
if (!testSuccess) {
    console.error("\n[ERROR] Pipeline CI falló en la etapa de Pruebas Automatizadas.");
}

// Paso 3: Generación de Reportes
const reportSuccess = runStep("Etapa 3: Generación de Reportes de CI", "node scripts/generate-report.js");

const totalPipelineDuration = Date.now() - pipelineStartTime;

console.log("\n================================================================================");
if (buildSuccess && testSuccess && reportSuccess) {
    console.log(` PIPELINE CI COMPLETADO CON ÉXITO EN ${totalPipelineDuration}ms`);
    console.log("  - Artefactos de Build: dist/");
    console.log("  - Reporte HTML: reports/ci-report.html");
    console.log("  - Reporte Markdown: reports/ci-report.md");
    console.log("================================================================================\n");
    process.exit(0);
} else {
    console.error(` PIPELINE CI TERMINÓ CON ERRORES TRAS ${totalPipelineDuration}ms`);
    console.log("================================================================================\n");
    process.exit(1);
}
