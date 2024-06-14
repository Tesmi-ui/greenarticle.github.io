
        
        
        const token = localStorage.getItem('token');


        // Function to fetch products and display them
        async function fetchProducts() {
            const response = await fetch('api/products/ownerDashboard', {
                headers: {
                    'auth-token': token
                }
            });
            if(response.ok) {
                const products = await response.json();
                const productsContainerod = document.getElementById('productsContainer');

                productsContainerod.innerHTML = ''; // Clear previous products
                products.forEach(product => {
                const productElement = document.createElement('div');
                productElement.classList.add('product-card');
                const productDetails = document.createElement('div');
                productDetails.classList.add('product-details');


                productElement.innerHTML = `
                    <h2 class='name'>${product.name}</h2>
                    <p class='price'>Price: $${product.price}</p>
                    <p class='productDescription'>Description: ${product.description}</p>
                    <pclass='category'>Category: ${product.category}</p>
                    <p class='stockQuantity'>Stock Quantity: ${product.stockQuantity}</p>
                    <img class='image' src="uploads/${product.imageURL}" alt="${product.name}" style="max-width: 600px;, max-height:1050px;">
                    <button class="edit-button" data-product-id="${product._id}">Edit Product</button>
                    <button class="delete-button" data-product-id="${product._id}">Delete Product</button>
                `;
                productsContainerod.appendChild(productElement, image);

            
            });
        
            } else {
                window.location.href = '/login.html';
            }
        
            
        }
        // Function to handle form submission for creating a new product
        async function handleSubmit(event) {
            event.preventDefault();
            const formData = new FormData(document.getElementById('productForm'));
            const response = await fetch('api/products', {
                method: 'POST',
                headers: {
                    'auth-token': token //token for autherization
                },
                body: formData
            });
            if (response.ok) {
                fetchProducts(); // Fetch and display updated list of products
            } else {
                const errorMessage = await response.json();
                alert(errorMessage.message);
            }
        }
        // Add event listener for form submission
        document.getElementById('productForm').addEventListener('submit', handleSubmit);
        // Fetch and display products when the page loads
        fetchProducts();

        
         // Function to show edit form for a specific product
        const showEditForm = async (productId) => {
            try {
                const response = await fetch(`/api/products/${productId}`, {
                    headers: {
                        'auth-token': token
                    }
                
                });
                const productData = await response.json();
                // Populate edit form with product data
                const editForm = document.createElement('form');
                editForm.innerHTML = `
                    <input type="hidden" id="productId" name="productId" value="${productData._id}">
                    <label for="name">Name:</label>
                    <input type="text" id="name" name="name" value="${productData.name}">
                    <label for="description">Description:</label>
                    <textarea id="description" name="description">${productData.description}</textarea>
                    <label for="price">Price:</label>
                    <input type="number" id="price" name="price" value="${productData.price}">
                    <label for="stockQuantity">Stock Quantity:</label>
                    <input type="number" id="stockQuantity" name="stockQuantity" value="${productData.stockQuantity}">
                    <label for="category">Category:</label>
                    <input type="text" id="category" name="category" value="${productData.category}">
                    <button type="submit">Save Changes</button>
                    <button type="button" class="delete-button" data-product-id="${productData._id}">Delete Product</button>
                    <button type="button" class="clear-button">Clear</button>
                `;
                 // Display edit form
                 productsContainer.innerHTML = '';
                 productsContainer.appendChild(editForm);
                 // Event listener for clear button click inside the edit form
                 editForm.querySelector('.clear-button').addEventListener('click',() =>{
                        clearEditForm(editForm);
                    });
                } catch (error) {
                    console.error('Error fetching product data for edit:', error);
                }
            };
            const clearEditForm = (editForm) => {
                const formInputs = editForm.querySelectorAll('input, textarea');
                 // Loop through each input and textarea element and set their value to an empty string
                formInputs.forEach(input => {
                    input.value = '';
                });
            };
                // Event listener for form submission
        productsContainer.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const updatedProductData = {};
            formData.forEach((value, key) => {
                updatedProductData[key] = value;
            });
        
            try {
                const response = await fetch(`/api/products/${updatedProductData.productId}`, {
                    method: 'PUT',
                    headers: {
                        'auth-token': token,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(updatedProductData)
                });
                const updatedProduct = await response.json();
                console.log('Updated product:', updatedProduct);
                // Show success message or redirect
            } catch (error) {
                console.error('Error updating product:', error);
                
            }
        });
        
        // Event listener for delete button click
        productsContainer.addEventListener('click', async (event) => {
            if(event.target.classList.contains('delete-button')) {
                const productId = event.target.dataset.productId;
                
                if(productId) {
                    try {
                        const response = await fetch(`/api/products/${productId}`, {
                            method: 'DELETE',
                            headers: {
                                'auth-token' : token
                            }
                        });
                        if(response.ok) {
                            console.log('Product deleted successfully');
                            
                            // Fetch and display updated list of products
                            fetchProducts();
                        } else {
                            console.error('Failed to delete product');
                        }
                    } catch(error) {
                        console.error('Error deleting product:', error);
                    }
                } else {
                    console.error('Invalid product ID');
                }
            }  
        });
        // Event listener for edit button clicks
        productsContainer.addEventListener('click', (event) => {
            if (event.target.classList.contains('edit-button')) {
                const productId = event.target.dataset.productId;
                showEditForm(productId);
            }
        });


// scripts.js
window.onload = async function() {
    try {
        // Fetch all orders when the page loads
        const orders = await fetchOrders();
        displayOrders(orders);
    } catch (error) {
        console.error('Error fetching orders:', error);
    }

    async function fetchOrders() {
        try {
            const response = await fetch('/api/orders');
            if (!response.ok) {
                throw new Error('Failed to fetch orders');
            }
            return await response.json();
        } catch (error) {
            throw error;
        }
    }

    function displayOrders(orders) {
        const ordersContainer = document.getElementById('orders-container');
        const currentDate = new Date();
        const formattedDate = currentDate.toLocaleDateString(); // Format the date
        const formattedTime = currentDate.toLocaleTimeString();
        ordersContainer.innerHTML = ''; // Clear previous content
        let orderNumber = 1;
        orders.forEach(order => {
            const orderElement = document.createElement('div');
            orderElement.classList.add('order');
            orderElement.innerHTML = `
                <h3>Order ${orderNumber}:</h3>
                <h3>Order ID: ${order._id}</h3>
                <p>Customer Name: ${order._id.name}</p>
                <p>User ID: ${order.userId}</p>
                <p>Product ID: ${order.productId}</p>
                
                <p>Shipping Address: ${order.shippingAddress}</p>

                <p>Product Name: ${order.productName}</p>
                <p>Quantity: ${order.quantity}</p>
                <p>Total Price: ${order.total} Rs</p>
                <p>Order Placed On: ${formattedDate} at ${formattedTime}</p>
            `;
            ordersContainer.appendChild(orderElement);
            orderNumber++;
        });
    }
};

