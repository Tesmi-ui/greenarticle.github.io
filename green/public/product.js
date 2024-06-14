// product.js
document.addEventListener('DOMContentLoaded', function() {
    const addProductForm = document.getElementById('add-product-form');

    addProductForm.addEventListener('submit', async function(event) {
        event.preventDefault();

        const formData = new FormData(addProductForm);
        
        try {
            const response = await fetch('api/products', {
                method: 'POST',
                body: formData
            });
            const data = await response.json();
            console.log(data); // Handle success response
        } catch (error) {
            console.error(error); // Handle error
        }
    });

    // Function to fetch and display product details
    async function fetchProductDetails() {
        try {
            const response = await fetch('/products/details');
            const products = await response.json();
            console.log(products); // Handle product data
        } catch (error) {
            console.error(error); // Handle error
        }
    }

    fetchProductDetails(); // Fetch product details on page load
});

// Function to edit and update product data
async function editProduct(productId, updatedData) {
    try {
        const response = await fetch(`/api/products/${productId}`, {
            method: 'PUT',
            body: JSON.stringify(updatedData),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const data = await response.json();
        console.log(data); // Handle success response
    } catch (error) {
        console.error(error); // Handle error
    }
}

editProduct(productId, updatedData);

