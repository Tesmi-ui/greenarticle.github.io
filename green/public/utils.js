// utils.js

// Function to extract user ID from JWT token
function getUserIdFromToken(token) {
    try {
        // Decode the JWT token to access its payload
        const decodedToken = jwt.verify(token, 'process.env.TOKEN_SECRET'); // Replace 'your_secret_key' with your actual JWT secret key
        // Extract user ID from the decoded token
        const userId = decodedToken.userId; // Assuming 'userId' is the key in the token payload containing the user ID
        return userId;
    } catch (error) {
        console.error('Error decoding token:', error);
        return null; // Return null in case of error
    }
}

// Function to fetch protected data
async function fetchProtectedData(token) {
    try {
        // Make a request to a protected route with the token included in the headers
        const response = await fetch('/', {
            headers: {
                'auth-token': token
            }
        });
        if (response.ok) {
            // If the response is okay, handle the data
            const data = await response.json();
            console.log(data);
        } else {
            // If the response is not okay, handle the error
            throw new Error('Failed to fetch protected data');
        }
    } catch (error) {
        // Handle any errors that occurred during the fetch
        console.error('Error:', error);
    }
}

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
        if (response.ok) {
            // If the response is okay, handle the data
            const data = await response.json();
            console.log(data);
        } else {
            // If the response is not okay, handle the error
            throw new Error('Failed to update product data');
        }
    } catch (error) {
        // Handle any errors that occurred during the fetch
        console.error('Error:', error);
    }
}

// Function to fetch and display product details
async function fetchProductDetails() {
    try {
        const response = await fetch('/products/details');
        if (response.ok) {
            // If the response is okay, handle the data
            const products = await response.json();
            console.log(products);
        } else {
            // If the response is not okay, handle the error
            throw new Error('Failed to fetch product details');
        }
    } catch (error) {
        // Handle any errors that occurred during the fetch
        console.error('Error:', error);
    }
}

// Function to fetch product data and create product cards
function fetchProductData() {
    fetch('/api/products')
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error('Failed to fetch product data');
        }
    })
    .then(products => {
        const productList = document.getElementById('product-list');
        products.forEach(product => {
            const productCard = document.createElement('div');
            productCard.classList.add('product-card');
            const image = document.createElement('img');
            image.src = `uploads/${product.imageURL}`;
            image.alt = product.name;
            const productDetails = document.createElement('div');
            productDetails.classList.add('product-details');
            const name = document.createElement('h2');
            name.textContent = `Name: ${product.name}`;
            const description = document.createElement('p');
            description.textContent = `Description: ${product.description}`;
            const price = document.createElement('p');
            price.textContent = `Price: $${product.price}`;
            const category = document.createElement('p');
            category.textContent = `Category: ${product.category}`;
            const stockQuantity = document.createElement('p');
            stockQuantity.textContent = `Stock Quantity: ${product.stockQuantity}`;
            productDetails.append(name, description, price, category, stockQuantity);
            productCard.append(image, productDetails);
            productList.appendChild(productCard);
        });
    })
    .catch(error => console.error('Error fetching product data:', error));
}

// Export the functions to be used in other modules
module.exports = {
    getUserIdFromToken,
    fetchProtectedData,
    editProduct,
    fetchProductDetails,
    fetchProductData
};