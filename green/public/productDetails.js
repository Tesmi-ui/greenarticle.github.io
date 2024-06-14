document.addEventListener('DOMContentLoaded', function() {
    // Retrieve product ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    if (productId) {
        // Fetch product data by ID
        fetch(`/api/products/${product._id}`)
            .then(response => response.json())
            .then(product => {
                // Display product information
                const productDetailsContainer = document.getElementById('product-details');
                productDetailsContainer.innerHTML = `
                    <h2>Name: ${product.name}</h2>
                    <img src="uploads/${product.imageURL}" alt="${product.name}">
                    <p>Description: ${product.description}</p>
                    <p>Price: $${product.price}</p>
                    <p>Category: ${product.category}</p>
                    <p>Stock Quantity: ${product.stockQuantity}</p>
                `;
            })
            .catch(error => console.error('Error fetching product details:', error));
    } else {
        console.error('Product ID not found in URL.');
    }
});


// productDetails.js

// Function to fetch product details by ID
function fetchProductDetails(productId) {
    return fetch(`/api/products/${productId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch product details');
            }
            return response.json();
        });
}

// Function to populate product details on the page
function populateProductDetails(product) {
    // Code to populate product details on the page
    console.log(product);
}

// Function to handle page load
window.onload = function () {
    // Get the product ID from the URL query parameters
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    // Fetch product details by ID
    fetchProductDetails(productId)
        .then(product => {
            // Populate product details on the page
            populateProductDetails(product);
        })
        .catch(error => {
            console.error('Error fetching product details:', error);
            // Handle error
        });
};

