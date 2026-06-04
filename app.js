let products = JSON.parse(localStorage.getItem('products')) || [];
let suppliers = JSON.parse(localStorage.getItem('suppliers')) || [];
let movements = JSON.parse(localStorage.getItem('movements')) || [];

function saveData(){
    localStorage.setItem('products', JSON.stringify(products));
    localStorage.setItem('suppliers', JSON.stringify(suppliers));
    localStorage.setItem('movements', JSON.stringify(movements));
}

function showToast(message, type = 'success') {
    let toast = document.createElement('div');
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed; bottom: 24px; right: 24px;
        background: ${type === 'success' ? '#166534' : '#7f1d1d'};
        color: white; padding: 12px 20px;
        border-radius: 8px; font-size: 14px;
        z-index: 999; opacity: 0;
        transition: opacity 0.3s ease;
        border-left: 4px solid ${type === 'success' ? '#4ade80' : '#f87171'};
    `;
    document.body.appendChild(toast);
    setTimeout(() => toast.style.opacity = '1', 10);
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}


function renderProducts() {
    return `
    <h2>Products</h2>
    <div id="product-form">
        <input type="text" id="prod-name" placeholder="product name"/>
        <input type="number" id="prod-price" placeholder="price"/>
        <input type="number" id="prod-stock" placeholder="stock quantity"/>
        <input type="text" id="prod-category" placeholder="category"/>
        <button id="add-product-btn">Add product</button>
    </div>
    <input id="search-input" placeholder="Search by name..." />
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
        showToast('please fill all fields', 'error');
        return;
    }

    products.push({
        id: Date.now(),
        name: name,
        price: Number(price),
        stock: Number(stock),
        category: category
    });
    saveData();
    showToast('Product added ')
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
            <button class="edit-btn" data-id="${p.id}">Edit</button>
            <button class="delete-btn" data-id="${p.id}">Delete</button>
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
    saveData();
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
    saveData();
    renderProductTable();
}



function renderDashboard() {
    let totalProducts = products.length;
    let totalStockValue = products.reduce((sum, p) => sum + (p.price * p.stock), 0);
    let lowStockCount = products.filter(p => p.stock < 10).length;
    let suppliersCount = suppliers.length;

    return `
    <div class="hero-banner">
    <h2>Inventory Overview</h2>
    <p>Track products, suppliers and stock movements in one place.</p>
    </div>

    <div id="kpi-grid">
    <div class="kpi-card">
    <p>Total Products</p>
    <h3>${totalProducts}</h3>
    </div>
    <div class="kpi-card">
    <p>Total Stock Value</p>
    <h3>$${totalStockValue.toLocaleString()}</h3>
    </div>
    <div class="kpi-card">
    <p>Low Stock Alert</p>
    <h3>${lowStockCount}</h3>
    </div>
    <div class="kpi-card">
    <p>Suppliers</p>
    <h3>${suppliersCount}</h3>
    </div>
    </div>

    <div style="display:flex; gap:24px; margin-top:30px;">
        <div style="flex:1; background:rgba(255,255,255,.05); border-radius:16px; padding:20px;">
            <h3 style="color:white; margin-bottom:16px;">Stock by Product</h3>
            <canvas id="stockChart"></canvas>
        </div>
        <div style="flex:1; background:rgba(255,255,255,.05); border-radius:16px; padding:20px;">
            <h3 style="color:white; margin-bottom:16px;">Stock Value by Product</h3>
            <canvas id="valueChart"></canvas>
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
        <button id="add-supplier-btn">Add Supplier</button>
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
        <button id="add-movement-btn">Add Movement</button>
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
        showToast('Please fill all fields', 'error');
        return;
    }

    // Find product and update its stock
    let product = products.find(p => p.id === productId);
    if (type === 'OUT' && product.stock < qty) {
        showToast('Not enough stock!', 'error');
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
    saveData();
    showToast('Movement recorded')
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
        showToast('Please fill all fields','error');
        return;
    }

    suppliers.push({
        id: Date.now(),
        name: name,
        contact: contact,
        email: email,
        city: city
    });
    saveData();
    showToast('supplier added!')
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
                <button class="delete-supplier-btn" data-id="${s.id}">Delete</button>
            </td>
        </tr>
        `;
    });
}

function deleteSupplier(id) {
    suppliers = suppliers.filter(function (s) {
        return s.id !== id;
    });
    saveData();
    renderSupplierTable();
}


function renderCharts() {
    if (products.length === 0) return;

    let labels = products.map(p => p.name);
    let stockData = products.map(p => p.stock);
    let valueData = products.map(p => p.price * p.stock);

    // Bar chart — stock quantity
    new Chart(document.getElementById('stockChart'), {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Stock Quantity',
                data: stockData,
                backgroundColor: 'rgba(59, 130, 246, 0.7)',
                borderColor: '#3b82f6',
                borderWidth: 1
            }]
        },
        options: {
            plugins: { legend: { labels: { color: 'white' } } },
            scales: {
                x: { ticks: { color: 'white' }, grid: { color: 'rgba(255,255,255,0.1)' } },
                y: { ticks: { color: 'white' }, grid: { color: 'rgba(255,255,255,0.1)' } }
            }
        }
    });

    // Line chart — stock value
    new Chart(document.getElementById('valueChart'), {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Stock Value ($)',
                data: valueData,
                backgroundColor: 'rgba(124, 58, 237, 0.2)',
                borderColor: '#7c3aed',
                borderWidth: 2,
                pointBackgroundColor: '#7c3aed',
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            plugins: { legend: { labels: { color: 'white' } } },
            scales: {
                x: { ticks: { color: 'white' }, grid: { color: 'rgba(255,255,255,0.1)' } },
                y: { ticks: { color: 'white' }, grid: { color: 'rgba(255,255,255,0.1)' } }
            }
        }
    });
}


function navigate(page, btn) {
    document.getElementById('sidebar').classList.remove('open');
    document.getElementById('overlay').classList.remove('show');

    document.querySelectorAll("button")
        .forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('page-title').textContent = page;

    if (page === 'Dashboard') {
        document.getElementById('content').innerHTML = renderDashboard();
        renderCharts();
    } else if (page === 'Products') {
        document.getElementById('content').innerHTML = renderProducts();
    } else if (page === 'Suppliers') {
        document.getElementById('content').innerHTML = renderSuppliers();
    } else if (page === 'Stock') {
        document.getElementById('content').innerHTML = renderStock();
    } else if (page === 'Low Stock') {
        document.getElementById('content').innerHTML = renderLowStock();
    } else if (page === 'Reports') {
        document.getElementById('content').innerHTML = renderReports();
    } else {
        document.getElementById('content').innerHTML = '<h2>' + page + '</h2>';
    }
}

// Use event delegation on #content for all dynamic buttons
document.getElementById('content').addEventListener('click', function(e) {

    // Add Product button
    if (e.target.id === 'add-product-btn') {
        addProduct();
    }

    // Edit product
    if (e.target.classList.contains('edit-btn')) {
        let id = Number(e.target.dataset.id);
        editProduct(id);
    }

    // Delete product
    if (e.target.classList.contains('delete-btn')) {
        let id = Number(e.target.dataset.id);
        deleteProduct(id);
    }

    // Add Movement
    if (e.target.id === 'add-movement-btn') {
        addMovement();
    }

    // Delete supplier
    if (e.target.classList.contains('delete-supplier-btn')) {
        let id = Number(e.target.dataset.id);
        deleteSupplier(id);
    }

    // Add Supplier
    if (e.target.id === 'add-supplier-btn') {
        addSupplier();
    }
});

// Search input (input event, not click)
document.getElementById('content').addEventListener('input', function(e) {
    if (e.target.id === 'search-input') {
        searchProducts();
    }
});

document.getElementById('content').innerHTML = renderDashboard();
renderCharts();

// Hamburger menu
document.getElementById('hamburger').addEventListener('click', function() {
    document.getElementById('sidebar').classList.toggle('open');
    document.getElementById('overlay').classList.toggle('show');
});

// Close sidebar when overlay is clicked
document.getElementById('overlay').addEventListener('click', function() {
    document.getElementById('sidebar').classList.remove('open');
    document.getElementById('overlay').classList.remove('show');
});

document.getElementById('sidebar').addEventListener('click', function(e) {
    let page = e.target.dataset.page;
    if (page) {
        navigate(page, e.target);
    }
});