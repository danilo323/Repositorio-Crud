/* Versión de Compilación 1.0.0 - Distribución de Producción */
var isBrowser = typeof window !== 'undefined' && typeof document !== 'undefined';

var productNameInput = isBrowser ? document.getElementById("productNameInput") : null;
var productPriceInput = isBrowser ? document.getElementById("productPriceInput") : null;
var ProductCategoryInput = isBrowser ? document.getElementById("ProductCategoryInput") : null;
var productDescInput = isBrowser ? document.getElementById("productDescInput") : null;
var addBtn = isBrowser ? document.getElementById("addBtn") : null;
var updateBtn = isBrowser ? document.getElementById("updateBtn") : null;

var productsContainer = [];
var currentIndex = null;

if (isBrowser && typeof localStorage !== 'undefined' && localStorage.getItem("myProducts") != null) {
    productsContainer = JSON.parse(localStorage.getItem("myProducts"));
    displayProducts(productsContainer);
}

function addProduct() {
    if (validateProductName() && validatePrice() && validateCategory()) {
        var product = {
            name: productNameInput.value,
            price: productPriceInput.value,
            category: ProductCategoryInput.value,
            desc: productDescInput.value,
        };
        productsContainer.push(product);
        if (typeof localStorage !== 'undefined') {
            localStorage.setItem("myProducts", JSON.stringify(productsContainer));
        }
        displayProducts(productsContainer);
        clearForm();
    } else {
        alert("Por favor ingrese valores válidos.");
    }
}

function clearForm() {
    if (!productNameInput || !productPriceInput || !ProductCategoryInput || !productDescInput) return;
    productNameInput.value = "";
    productPriceInput.value = "";
    ProductCategoryInput.value = "";
    productDescInput.value = "";

    productNameInput.classList.remove("is-valid", "is-invalid");
    productPriceInput.classList.remove("is-valid", "is-invalid");
    ProductCategoryInput.classList.remove("is-valid", "is-invalid");
}

function displayProducts(productList) {
    if (!isBrowser) return;
    var cartoona = "";
    for (var i = 0; i < productList.length; i++) {
        cartoona += `
            <tr>
                <td>${i}</td>
                <td>${productList[i].name}</td>
                <td>$${productList[i].price}</td>
                <td>${productList[i].category}</td>
                <td>${productList[i].desc}</td>
                <td><button onclick="setFormForUpdate(${i});" class="btn btn-outline-warning btn-sm">Editar</button></td>
                <td><button onclick="deleteProducts(${i});" class="btn btn-outline-danger btn-sm">Eliminar</button></td>
            </tr>
        `;
    }
    var tableBody = document.getElementById("tableBody");
    if (tableBody) {
        tableBody.innerHTML = cartoona;
    }
}

function deleteProducts(index) {
    productsContainer.splice(index, 1);
    if (typeof localStorage !== 'undefined') {
        localStorage.setItem("myProducts", JSON.stringify(productsContainer));
    }
    displayProducts(productsContainer);
}

function setFormForUpdate(index) {
    var product = productsContainer[index];
    productNameInput.value = product.name;
    productPriceInput.value = product.price;
    ProductCategoryInput.value = product.category;
    productDescInput.value = product.desc;

    currentIndex = index;
    if (updateBtn) updateBtn.classList.replace("d-none", "d-inline-block");
    if (addBtn) addBtn.classList.add("d-none");
}

function updateProduct() {
    if (validateProductName() && validatePrice() && validateCategory()) {
        productsContainer[currentIndex] = {
            name: productNameInput.value,
            price: productPriceInput.value,
            category: ProductCategoryInput.value,
            desc: productDescInput.value,
        };
        if (typeof localStorage !== 'undefined') {
            localStorage.setItem("myProducts", JSON.stringify(productsContainer));
        }
        displayProducts(productsContainer);
        clearForm();
        if (updateBtn) updateBtn.classList.replace("d-inline-block", "d-none");
        if (addBtn) addBtn.classList.remove("d-none");
    } else {
        alert("Por favor corrija los campos antes de actualizar.");
    }
}

function searchProduct(term) {
    var result = filterProducts(productsContainer, term);
    displayProducts(result);
}

function filterProducts(productList, term) {
    if (!Array.isArray(productList)) return [];
    if (!term) return productList;
    return productList.filter((p) => p.name && p.name.toLowerCase().includes(term.toLowerCase()));
}

function isProductNameValid(name) {
    if (!name || typeof name !== 'string') return false;
    var regex = /^[A-Z][a-z]{3,8}$/;
    return regex.test(name.trim());
}

function isPriceValid(price) {
    var parsed = parseFloat(price);
    return !isNaN(parsed) && parsed > 0;
}

function isCategoryValid(category) {
    if (!category || typeof category !== 'string') return false;
    var regex = /^[A-Za-z\s]{3,15}$/;
    return regex.test(category.trim());
}

function validateProductName() {
    if (!productNameInput) return false;
    if (isProductNameValid(productNameInput.value)) {
        setValid(productNameInput);
        return true;
    } else {
        setInvalid(productNameInput);
        return false;
    }
}

function validatePrice() {
    if (!productPriceInput) return false;
    if (isPriceValid(productPriceInput.value)) {
        setValid(productPriceInput);
        return true;
    } else {
        setInvalid(productPriceInput);
        return false;
    }
}

function validateCategory() {
    if (!ProductCategoryInput) return false;
    if (isCategoryValid(ProductCategoryInput.value)) {
        setValid(ProductCategoryInput);
        return true;
    } else {
        setInvalid(ProductCategoryInput);
        return false;
    }
}

function setValid(input) {
    if (!input) return;
    input.classList.add("is-valid");
    input.classList.remove("is-invalid");
}

function setInvalid(input) {
    if (!input) return;
    input.classList.add("is-invalid");
    input.classList.remove("is-valid");
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        isProductNameValid,
        isPriceValid,
        isCategoryValid,
        filterProducts
    };
}