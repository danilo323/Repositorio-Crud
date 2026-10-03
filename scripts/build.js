const fs = require('fs');
const path = require('path');
const vm = require('vm');

const rootDir = path.join(__dirname, '..');
const distDir = path.join(rootDir, 'dist');

console.log("\n========================================================");
console.log(" INICIANDO PROCESO DE COMPILACIÓN / BUILD AUTOMATIZADO");
console.log("========================================================\n");

const buildStartTime = Date.now();
const buildLog = [];

function log(msg) {
    console.log(msg);
    buildLog.push(msg);
}

// 1. Verificación sintáctica de archivos JavaScript
log("[Paso 1/4] Verificando sintaxis de código fuente...");
const jsFiles = ['js/main.js', 'tests/products.test.js'];

for (const relFile of jsFiles) {
    const fullPath = path.join(rootDir, relFile);
    if (!fs.existsSync(fullPath)) {
        throw new Error(`Archivo requerido no encontrado: ${relFile}`);
    }
    const code = fs.readFileSync(fullPath, 'utf8');
    try {
        new vm.Script(code, { filename: relFile });
        log(`  [OK] Sintaxis válida en: ${relFile}`);
    } catch (err) {
        console.error(`  [ERROR] Error de sintaxis en: ${relFile}`, err.message);
        process.exit(1);
    }
}

// 2. Limpieza y preparación del directorio de distribución dist/
log("\n[Paso 2/4] Preparando carpeta de distribución 'dist/'...");
if (fs.existsSync(distDir)) {
    fs.rmSync(distDir, { recursive: true, force: true });
}
fs.mkdirSync(distDir, { recursive: true });
fs.mkdirSync(path.join(distDir, 'js'), { recursive: true });
fs.mkdirSync(path.join(distDir, 'css'), { recursive: true });

// 3. Procesamiento y optimización de archivos (Build)
log("\n[Paso 3/4] Empaquetando y optimizando artefactos...");

// Copiar y optimizar JS
const mainJsContent = fs.readFileSync(path.join(rootDir, 'js', 'main.js'), 'utf8');
// Minificación básica (remover comentarios multilinea y espacios innecesarios conservando lógica)
const minifiedJs = `/* Build Version 1.0.0 - ${new Date().toISOString()} */\n` + 
    mainJsContent.replace(/\/\*[\s\S]*?\*\/|([^:]|^)\/\/.*$/gm, '$1').trim();

fs.writeFileSync(path.join(distDir, 'js', 'main.js'), minifiedJs, 'utf8');
log("  [OK] Compilado: dist/js/main.js");

// Copiar CSS
const cssDir = path.join(rootDir, 'css');
if (fs.existsSync(cssDir)) {
    const cssFiles = fs.readdirSync(cssDir);
    for (const file of cssFiles) {
        const srcPath = path.join(cssDir, file);
        const destPath = path.join(distDir, 'css', file);
        if (fs.statSync(srcPath).isFile()) {
            fs.copyFileSync(srcPath, destPath);
            log(`  [OK] Copiado recurso CSS: dist/css/${file}`);
        }
    }
}

// Copiar webfonts si existe
const webfontsDir = path.join(rootDir, 'webfonts');
if (fs.existsSync(webfontsDir)) {
    const distWebfonts = path.join(distDir, 'webfonts');
    fs.mkdirSync(distWebfonts, { recursive: true });
    const fonts = fs.readdirSync(webfontsDir);
    for (const font of fonts) {
        fs.copyFileSync(path.join(webfontsDir, font), path.join(distWebfonts, font));
    }
    log(`  [OK] Copiados recursos tipográficos: dist/webfonts/ (${fonts.length} archivos)`);
}

// Copiar index.html
const indexHtmlContent = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf8');
fs.writeFileSync(path.join(distDir, 'index.html'), indexHtmlContent, 'utf8');
log("  [OK] Empaquetado archivo principal: dist/index.html");

// 4. Generación de manifiesto de compilación
log("\n[Paso 4/4] Generando manifiesto de compilación 'build-info.json'...");
const buildDuration = Date.now() - buildStartTime;

function getDirSize(dir) {
    let total = 0;
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            total += getDirSize(full);
        } else {
            total += fs.statSync(full).size;
        }
    }
    return total;
}

const totalDistBytes = getDirSize(distDir);

const buildManifest = {
    status: "SUCCESS",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "production",
    durationMs: buildDuration,
    artifacts: {
        outputDirectory: "dist/",
        totalSizeBytes: totalDistBytes,
        totalSizeKB: (totalDistBytes / 1024).toFixed(2),
        entrypoint: "dist/index.html"
    },
    system: {
        nodeVersion: process.version,
        platform: process.platform
    }
};

fs.writeFileSync(
    path.join(distDir, 'build-info.json'),
    JSON.stringify(buildManifest, null, 2),
    'utf8'
);
log(`  [OK] Generado: dist/build-info.json (${buildManifest.artifacts.totalSizeKB} KB empaquetados)`);

console.log("\n--------------------------------------------------------");
console.log(` COMPILACIÓN COMPLETADA CON ÉXITO EN ${buildDuration}ms`);
console.log("--------------------------------------------------------\n");
