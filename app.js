let products = [];
let suppliers = [];
let movements = [];


function renderProducts() {
    return `
    <h2>Products</h2>
    <div id="product-form">
        <input type="text" id="prod-name" placeholder="product name"/>
        <input type="number" id="prod-price" placeholder="price"/>
        <input type="number" id="prod-stock" placeholder="stock quantity"/>
        <input type="text" id="prod-category" placeholder="category"/>
        <button onclick="addProduct()">Add product</button>
    </div>
    <input type="text" id="search-input" placeholder="Search by name..." oninput="searchProducts()"/>
    <table id="product-table">
        <thead>
            <tr>
                <th>Name</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Category</th>
                <th>Action</th>
            </tr>
            </thead>
            <tbody id="product-tbody"> 
            </tbody>
            </table>
            `;
}

function addProduct() {
    let name = document.getElementById('prod-name').value;
    let price = document.getElementById('prod-price').value;
    let stock = document.getElementById('prod-stock').value;
    let category = document.getElementById('prod-category').value;

    if (name === '' || price === '' || stock === '') {
        alert('please fill all fields');
        return;
    }

    products.push({
        id: Date.now(),
        name: name,
        price: Number(price),
        stock: Number(stock),
        category: category
    });
    renderProductTable();

    document.getElementById('prod-name').value = '';
    document.getElementById('prod-price').value = '';
    document.getElementById('prod-stock').value = '';
    document.getElementById('prod-category').value = '';
}

// ONE function handles both show all + search
function renderProductTable(list) {
    if(!list) list = products;  // no list passed = show all
    
    let tbody = document.getElementById('product-tbody');
    tbody.innerHTML = '';

    if(list.length === 0){
        tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;">No products found</td></tr>';
        return;
    }

    list.forEach(function(p) {
        tbody.innerHTML += ` 
        <tr>
            <td>${p.name}</td>
            <td>${p.price}</td>
            <td>${p.stock}</td>
            <td>${p.category || '-'}</td>
            <td>
                <button onclick="editProduct(${p.id})">Edit</button>
                <button onclick="deleteProduct(${p.id})">Delete</button>
            </td>
        </tr>
        `;
    });
}

// search just filters and passes to renderProductTable
function searchProducts(){
    let query = document.getElementById('search-input').value.toLowerCase();
    let filtered = products.filter(p => p.name.toLowerCase().includes(query));
    renderProductTable(filtered);
}

function deleteProduct(id) {
    products = products.filter(function (p) {
        return p.id !== id;
    });
    renderProductTable();
}

function editProduct(id) {
    let p = products.find(function (p) { return p.id === id; });
    if (!p) return;
    document.getElementById('prod-name').value = p.name;
    document.getElementById('prod-price').value = p.price;
    document.getElementById('prod-stock').value = p.stock;
    document.getElementById('prod-category').value = p.category || '';

    products = products.filter(function (p) { return p.id !== id; });
    renderProductTable();
}



function renderDashboard() {
    let totalProducts = products.length;
    let totalStockValue = products.reduce((sum, p) => sum + (p.price * p.stock), 0);
    let lowStockCount = products.filter(p => p.stock < 10).length;
    let suppliersCount = suppliers.length;

    return `
    <h2>Dashboard</h2>
    <div id="kpi-grid">
    <div class ="kpi-card">
    <p>Total Products</p>
    <h3>${totalProducts}</h3>
    </div>
    <div class="kpi-card">
    <p>Total Stock Value</p>
    <h3>$${totalStockValue.toLocaleString()}</h3>
    </div>
    <div class = "kpi-card">
    <p>Low Stock Alert</p>
    <h3>${lowStockCount}</h3>
    </div>
    <div class="kpi-card">
    <p>Suppliers</p>
    <h3>${suppliersCount}</h3>
    </div>
    </div>
    `;
}

function renderSuppliers() {
    return `
    <h2>Suppliers</h2>
    <div id="supplier-form">
        <input type="text" id="sup-name" placeholder="Supplier name"/>
        <input type="text" id="sup-contact" placeholder="Contact number"/>
        <input type="email" id="sup-email" placeholder="Email"/>
        <input type="text" id="sup-city" placeholder="City"/>
        <button onclick="addSupplier()">Add Supplier</button>
    </div>
    <table id="supplier-table">
        <thead>
            <tr>
                <th>Name</th>
                <th>Contact</th>
                <th>Email</th>
                <th>City</th>
                <th>Action</th>
            </tr>
        </thead>
        <tbody id="supplier-tbody">
        </tbody>
    </table>
    `;
}

function renderStock() {
    return `
    <h2>Stock Movement</h2>
    <div id="stock-form">
        <select id="mov-product">
            <option value="">-- Select Product --</option>
            ${products.map(p => `<option value="${p.id}">${p.name}</option>`).join('')}
        </select>
        <input type="number" id="mov-qty" placeholder="Quantity"/>
        <select id="mov-type">
            <option value="IN">IN</option>
            <option value="OUT">OUT</option>
        </select>
        <input type="date" id="mov-date"/>
        <button onclick="addMovement()">Add Movement</button>
    </div>
    <table id="stock-table">
        <thead>
            <tr>
                <th>Product</th>
                <th>Type</th>
                <th>Quantity</th>
                <th>Date</th>
            </tr>
        </thead>
        <tbody id="stock-tbody">
        </tbody>
    </table>
    `;
}

function addMovement() {
    let productId = Number(document.getElementById('mov-product').value);
    let qty = Number(document.getElementById('mov-qty').value);
    let type = document.getElementById('mov-type').value;
    let date = document.getElementById('mov-date').value;

    if (!productId || !qty || !date) {
        alert('Please fill all fields');
        return;
    }

    // Find product and update its stock
    let product = products.find(p => p.id === productId);
    if (type === 'OUT' && product.stock < qty) {
        alert('Not enough stock!');
        return;
    }
    if (type === 'IN') {
        product.stock += qty;
    } else {
        product.stock -= qty;
    }

    movements.push({
        id: Date.now(),
        productId: productId,
        productName: product.name,
        type: type,
        qty: qty,
        date: date
    });

    renderMovementTable();

    document.getElementById('mov-product').value = '';
    document.getElementById('mov-qty').value = '';
    document.getElementById('mov-date').value = '';
}


function renderMovementTable() {
    let tbody = document.getElementById('stock-tbody');
    tbody.innerHTML = '';

    movements.forEach(function (m) {
        tbody.innerHTML += `
        <tr>
            <td>${m.productName}</td>
            <td style="color: ${m.type === 'IN' ? 'lightgreen' : 'salmon'}">${m.type}</td>
            <td>${m.qty}</td>
            <td>${m.date}</td>
        </tr>
        `;
    });
}

function renderLowStock() {
    let lowItems = products.filter(p => p.stock < 10);

    return `
    <h2>Low Stock Alert</h2>
    ${lowItems.length === 0 ? '<p>All products are well stocked!</p>' : ''}
    <table id="lowstock-table">
        <thead>
            <tr>
                <th>Name</th>
                <th>Category</th>
                <th>Stock</th>
                <th>Price</th>
            </tr>
        </thead>
        <tbody>
            ${lowItems.map(p => `
            <tr style="background: #5c1f1f;">
                <td>${p.name}</td>
                <td>${p.category || '-'}</td>
                <td style="color: salmon; font-weight: bold;">${p.stock}</td>
                <td>$${p.price}</td>
            </tr>
            `).join('')}
        </tbody>
    </table>
    `;
}
function renderReports() {
    let lowItems = products.filter(p => p.stock < 10);

    return `
    <h2>Reports</h2>

    <h3>All Products & Total Value</h3>
    <table>
        <thead>
            <tr>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Total Value</th>
            </tr>
        </thead>
        <tbody>
            ${products.length === 0 ? '<tr><td colspan="5">No products yet</td></tr>' :
            products.map(p => `
            <tr>
                <td>${p.name}</td>
                <td>${p.category || '-'}</td>
                <td>$${p.price}</td>
                <td>${p.stock}</td>
                <td>$${(p.price * p.stock).toLocaleString()}</td>
            </tr>
            `).join('')}
        </tbody>
    </table>

    <h3 style="margin-top: 30px;">Low Stock Products</h3>
    <table>
        <thead>
            <tr>
                <th>Name</th>
                <th>Category</th>
                <th>Stock</th>
            </tr>
        </thead>
        <tbody>
            ${lowItems.length === 0 ? '<tr><td colspan="3">No low stock items</td></tr>' :
            lowItems.map(p => `
            <tr>
                <td>${p.name}</td>
                <td>${p.category || '-'}</td>
                <td style="color: salmon;">${p.stock}</td>
            </tr>
            `).join('')}
        </tbody>
    </table>

    <h3 style="margin-top: 30px;">Stock Movement History</h3>
    <table>
        <thead>
            <tr>
                <th>Product</th>
                <th>Type</th>
                <th>Quantity</th>
                <th>Date</th>
            </tr>
        </thead>
        <tbody>
            ${movements.length === 0 ? '<tr><td colspan="4">No movements yet</td></tr>' :
            movements.map(m => `
            <tr>
                <td>${m.productName}</td>
                <td style="color: ${m.type === 'IN' ? 'lightgreen' : 'salmon'}">${m.type}</td>
                <td>${m.qty}</td>
                <td>${m.date}</td>
            </tr>
            `).join('')}
        </tbody>
    </table>
    `;
}

function addSupplier() {
    let name = document.getElementById('sup-name').value;
    let contact = document.getElementById('sup-contact').value;
    let email = document.getElementById('sup-email').value;
    let city = document.getElementById('sup-city').value;

    if (name === '' || contact === '' || email === '' || city === '') {
        alert('Please fill all fields');
        return;
    }

    suppliers.push({
        id: Date.now(),
        name: name,
        contact: contact,
        email: email,
        city: city
    });
    renderSupplierTable();

    document.getElementById('sup-name').value = '';
    document.getElementById('sup-contact').value = '';
    document.getElementById('sup-email').value = '';
    document.getElementById('sup-city').value = '';
}

function renderSupplierTable() {
    let tbody = document.getElementById('supplier-tbody');
    tbody.innerHTML = '';

    suppliers.forEach(function (s) {
        tbody.innerHTML += `
        <tr>
            <td>${s.name}</td>
            <td>${s.contact}</td>
            <td>${s.email}</td>
            <td>${s.city}</td>
            <td>
                <button onclick="deleteSupplier(${s.id})">Delete</button>
            </td>
        </tr>
        `;
    });
}

function deleteSupplier(id) {
    suppliers = suppliers.filter(function (s) {
        return s.id !== id;
    });
    renderSupplierTable();
}




function navigate(page, btn) {
    document.querySelectorAll("button")
        .forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('page-title').textContent = page;
    if (page === 'Dashboard') {
        document.getElementById('content').innerHTML = renderDashboard();

    } else if (page === 'Products') {
        document.getElementById('content').innerHTML = renderProducts();

    } else if (page === 'Suppliers') {
        document.getElementById('content').innerHTML = renderSuppliers();
    }
    else if (page === 'Stock') {
        document.getElementById('content').innerHTML = renderStock();
    }
    else if (page === 'Low Stock') {
        document.getElementById('content').innerHTML = renderLowStock();
    }
    else if (page === 'Reports') {
        document.getElementById('content').innerHTML = renderReports();
    }
    else {
        document.getElementById('content').innerHTML = '<h2>' + page + '</h2>';
    }
}

document.getElementById('content').innerHTML = renderDashboard();