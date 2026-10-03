const fs = require('fs');
const path = require('path');
const {
    isProductNameValid,
    isPriceValid,
    isCategoryValid,
    filterProducts
} = require('../js/main.js');

// Test suite state
const testResults = {
    suite: "Sistema de Gestión de Productos - Pruebas Unitarias",
    timestamp: new Date().toISOString(),
    total: 0,
    passed: 0,
    failed: 0,
    durationMs: 0,
    tests: []
};

const startTime = Date.now();

function assert(condition, message) {
    if (!condition) {
        throw new Error(message || "Assertion failed");
    }
}

function test(description, testFn) {
    testResults.total++;
    const tStart = Date.now();
    try {
        testFn();
        const duration = Date.now() - tStart;
        testResults.passed++;
        testResults.tests.push({
            name: description,
            status: "PASSED",
            durationMs: duration
        });
        console.log(`  \x1b[32m[PASS]\x1b[0m: ${description} (${duration}ms)`);
    } catch (error) {
        const duration = Date.now() - tStart;
        testResults.failed++;
        testResults.tests.push({
            name: description,
            status: "FAILED",
            durationMs: duration,
            error: error.message
        });
        console.error(`  \x1b[31m[FAIL]\x1b[0m: ${description} - ${error.message}`);
    }
}

console.log("\n========================================================");
console.log(" EJECUTANDO PRUEBAS AUTOMATIZADAS (CI UNIT TESTS)");
console.log("========================================================\n");

// Group 1: Validaciones de Nombre del Producto
console.log("\x1b[36m[Suite: Validación de Nombre de Producto]\x1b[0m");
test("Debe aceptar nombre válido que inicia con mayúscula y tiene entre 4 y 9 letras (ej: 'Laptop')", () => {
    assert(isProductNameValid("Laptop") === true, "Laptop debe ser válido");
    assert(isProductNameValid("Mouse") === true, "Mouse debe ser válido");
    assert(isProductNameValid("Monitor") === true, "Monitor debe ser válido");
});

test("Debe rechazar nombre que inicia con minúscula (ej: 'laptop')", () => {
    assert(isProductNameValid("laptop") === false, "'laptop' con minúscula debe ser rechazado");
});

test("Debe rechazar nombre con menos de 4 caracteres (ej: 'Pc')", () => {
    assert(isProductNameValid("Pc") === false, "'Pc' tiene solo 2 caracteres");
    assert(isProductNameValid("Mac") === false, "'Mac' tiene solo 3 caracteres");
});

test("Debe rechazar nombre con más de 9 caracteres (ej: 'Computadora')", () => {
    assert(isProductNameValid("Computadora") === false, "'Computadora' excede 9 letras");
});

test("Debe rechazar nombres con números, espacios o caracteres especiales", () => {
    assert(isProductNameValid("Phone1") === false, "'Phone1' contiene números");
    assert(isProductNameValid("Lap top") === false, "'Lap top' contiene espacio");
    assert(isProductNameValid("Smart-tv") === false, "'Smart-tv' contiene guión");
});

test("Debe rechazar valores nulos, vacíos o indefinidos", () => {
    assert(isProductNameValid("") === false, "Cadena vacía debe ser rechazada");
    assert(isProductNameValid(null) === false, "Null debe ser rechazado");
    assert(isProductNameValid(undefined) === false, "Undefined debe ser rechazado");
});

// Group 2: Validaciones de Precio
console.log("\n\x1b[36m[Suite: Validación de Precio]\x1b[0m");
test("Debe aceptar precios positivos enteros y decimales válidos", () => {
    assert(isPriceValid("100") === true, "'100' debe ser válido");
    assert(isPriceValid("49.99") === true, "'49.99' debe ser válido");
    assert(isPriceValid(250) === true, "250 numérico debe ser válido");
});

test("Debe rechazar precios iguales a cero o negativos", () => {
    assert(isPriceValid("0") === false, "'0' debe ser rechazado");
    assert(isPriceValid(0) === false, "0 numérico debe ser rechazado");
    assert(isPriceValid("-15") === false, "'-15' debe ser rechazado");
    assert(isPriceValid(-50) === false, "-50 numérico debe ser rechazado");
});

test("Debe rechazar valores de precio no numéricos", () => {
    assert(isPriceValid("abc") === false, "'abc' no es numérico");
    assert(isPriceValid("") === false, "Cadena vacía no es precio válido");
    assert(isPriceValid(null) === false, "Null no es precio válido");
});

// Group 3: Validaciones de Categoría
console.log("\n\x1b[36m[Suite: Validación de Categoría]\x1b[0m");
test("Debe aceptar categorías válidas con longitud entre 3 y 15 letras y espacios", () => {
    assert(isCategoryValid("Electronics") === true, "'Electronics' debe ser válido");
    assert(isCategoryValid("Home Office") === true, "'Home Office' debe ser válido");
    assert(isCategoryValid("Gaming") === true, "'Gaming' debe ser válido");
});

test("Debe rechazar categorías demasiado cortas o demasiado largas", () => {
    assert(isCategoryValid("TV") === false, "'TV' tiene solo 2 caracteres");
    assert(isCategoryValid("SuperExtremelyLongCategoryName") === false, "Excede 15 caracteres");
});

test("Debe rechazar categorías que contengan números o símbolos especiales", () => {
    assert(isCategoryValid("Tech#1") === false, "'Tech#1' tiene símbolos");
    assert(isCategoryValid("Office2024") === false, "'Office2024' contiene números");
});

// Group 4: Lógica CRUD y Búsqueda
console.log("\n\x1b[36m[Suite: Operaciones CRUD y Filtrado]\x1b[0m");
test("Debe filtrar productos por término de búsqueda (insensible a mayúsculas/minúsculas)", () => {
    const products = [
        { name: "Laptop", price: "1200", category: "Electronics", desc: "Gaming laptop" },
        { name: "Mouse", price: "25", category: "Electronics", desc: "Wireless" },
        { name: "Keyboard", price: "80", category: "Electronics", desc: "Mechanical" }
    ];

    const results = filterProducts(products, "lap");
    assert(results.length === 1, "Debe encontrar 1 producto con 'lap'");
    assert(results[0].name === "Laptop", "El producto debe ser 'Laptop'");

    const caseInsensitive = filterProducts(products, "MOUSE");
    assert(caseInsensitive.length === 1, "Debe encontrar 'Mouse' con búsqueda 'MOUSE'");
});

test("Debe devolver lista completa si el término de búsqueda está vacío", () => {
    const products = [
        { name: "Laptop", price: "1200" },
        { name: "Mouse", price: "25" }
    ];
    const results = filterProducts(products, "");
    assert(results.length === 2, "Debe retornar todos los productos cuando el término es vacío");
});

test("Debe retornar arreglo vacío cuando no hay coincidencias", () => {
    const products = [
        { name: "Laptop", price: "1200" }
    ];
    const results = filterProducts(products, "Smartphone");
    assert(results.length === 0, "No debe haber coincidencias para 'Smartphone'");
});

// Summary & export results
testResults.durationMs = Date.now() - startTime;

console.log("\n--------------------------------------------------------");
console.log(` Resultado: ${testResults.passed}/${testResults.total} pruebas pasadas (${testResults.failed} fallidas)`);
console.log(` Tiempo de ejecución: ${testResults.durationMs}ms`);
console.log("--------------------------------------------------------\n");

// Ensure reports directory exists
const reportsDir = path.join(__dirname, '..', 'reports');
if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir, { recursive: true });
}

// Write JSON results for reporting step
fs.writeFileSync(
    path.join(reportsDir, 'test-results.json'),
    JSON.stringify(testResults, null, 2),
    'utf-8'
);

if (testResults.failed > 0) {
    console.error("\x1b[31m[ERROR] Algunas pruebas automatizadas han fallado.\x1b[0m");
    process.exit(1);
} else {
    console.log("\x1b[32m[ÉXITO] Todas las pruebas automatizadas pasaron correctamente.\x1b[0m\n");
    process.exit(0);
}
