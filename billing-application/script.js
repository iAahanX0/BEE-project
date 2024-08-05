document.addEventListener('DOMContentLoaded', function() {
    const productForm = document.getElementById('productForm');
    const customerForm = document.getElementById('customerForm');
    const billForm = document.getElementById('billForm');
    
    const productsTableBody = document.getElementById('productsTableBody');
    const customersTableBody = document.getElementById('customersTableBody');
    const billsTableBody = document.getElementById('billsTableBody');
    
    const selectCustomer = document.getElementById('selectCustomer');
    const selectProduct = document.getElementById('selectProduct');
    const contactMethod = document.getElementById('contactMethod');
    const customerContactLabel = document.getElementById('customerContactLabel');
    const customerContact = document.getElementById('customerContact');

    let products = JSON.parse(localStorage.getItem('products')) || [];
    let customers = JSON.parse(localStorage.getItem('customers')) || [];
    let bills = JSON.parse(localStorage.getItem('bills')) || [];

    function saveData() {
        localStorage.setItem('products', JSON.stringify(products));
        localStorage.setItem('customers', JSON.stringify(customers));
        localStorage.setItem('bills', JSON.stringify(bills));
    }

    // Add Product
    if (productForm) {
        productForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            const productName = document.getElementById('productName').value;
            const productPrice = document.getElementById('productPrice').value;
            const productStock = document.getElementById('productStock').value;

            const product = { name: productName, price: parseFloat(productPrice), stock: parseInt(productStock) };
            products.push(product);
            saveData();
            updateProductsTable();
            updateSelectProduct();
            
            productForm.reset();
        });
    }

    // Add Customer
    if (customerForm) {
        customerForm.addEventListener('submit', function(event) {
            event.preventDefault();

            const customerName = document.getElementById('customerName').value;
            const contactMethodValue = contactMethod.value;
            const customerContactValue = customerContact.value;

            const customer = {
                name: customerName,
                contactMethod: contactMethodValue,
                contact: customerContactValue
            };
            customers.push(customer);
            saveData();
            updateCustomersTable();
            updateSelectCustomer();
            
            customerForm.reset();
        });

        contactMethod.addEventListener('change', function() {
            if (contactMethod.value === 'phone') {
                customerContactLabel.textContent = 'Customer Phone:';
                customerContact.type = 'tel';
            } else {
                customerContactLabel.textContent = 'Customer Email:';
                customerContact.type = 'email';
            }
        });
    }

    // Generate Bill
    if (billForm) {
        billForm.addEventListener('submit', function(event) {
            event.preventDefault();

            const customerName = selectCustomer.value;
            const productName = selectProduct.value;
            const quantity = document.getElementById('quantity').value;

            const product = products.find(p => p.name === productName);
            const totalAmount = product.price * quantity;

            const bill = { customerName, productName, quantity: parseInt(quantity), totalAmount };
            bills.push(bill);
            saveData();
            updateBillsTable();

            billForm.reset();
        });
    }

    // Update Products Table
    function updateProductsTable() {
        productsTableBody.innerHTML = '';
        products.forEach(product => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${product.name}</td>
                <td>${product.price.toFixed(2)}</td>
                <td>${product.stock}</td>
                <td>
                    <button onclick="deleteProduct('${product.name}')">Delete</button>
                </td>
            `;
            productsTableBody.appendChild(row);
        });
    }

    // Update Customers Table
    function updateCustomersTable() {
        customersTableBody.innerHTML = '';
        customers.forEach(customer => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${customer.name}</td>
                <td>${customer.contactMethod}</td>
                <td>${customer.contact}</td>
                <td>
                    <button onclick="deleteCustomer('${customer.name}')">Delete</button>
                </td>
            `;
            customersTableBody.appendChild(row);
        });
    }

    // Update Bills Table
    function updateBillsTable() {
        billsTableBody.innerHTML = '';
        bills.forEach(bill => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${bill.customerName}</td>
                <td>${bill.productName}</td>
                <td>${bill.quantity}</td>
                <td>${bill.totalAmount.toFixed(2)}</td>
                <td>
                    <button onclick="deleteBill('${bill.customerName}', '${bill.productName}')">Delete</button>
                </td>
            `;
            billsTableBody.appendChild(row);
        });
    }

    // Update Select Customer
    function updateSelectCustomer() {
        selectCustomer.innerHTML = '';
        customers.forEach(customer => {
            const option = document.createElement('option');
            option.value = customer.name;
            option.textContent = customer.name;
            selectCustomer.appendChild(option);
        });
    }

    // Update Select Product
    function updateSelectProduct() {
        selectProduct.innerHTML = '';
        products.forEach(product => {
            const option = document.createElement('option');
            option.value = product.name;
            option.textContent = product.name;
            selectProduct.appendChild(option);
        });
    }

    // Delete Product
    window.deleteProduct = function(productName) {
        products = products.filter(product => product.name !== productName);
        saveData();
        updateProductsTable();
        updateSelectProduct();
    }

    // Delete Customer
    window.deleteCustomer = function(customerName) {
        customers = customers.filter(customer => customer.name !== customerName);
        saveData();
        updateCustomersTable();
        updateSelectCustomer();
    }

    // Delete Bill
    window.deleteBill = function(customerName, productName) {
        bills = bills.filter(bill => !(bill.customerName === customerName && bill.productName === productName));
        saveData();
        updateBillsTable();
    }

    // Initial Data Load
    updateProductsTable();
    updateCustomersTable();
    updateBillsTable();
    updateSelectCustomer();
    updateSelectProduct();
});
