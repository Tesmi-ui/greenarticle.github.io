                
    
    document.addEventListener('DOMContentLoaded', () => {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('No token found, please log in.');
            return;
        }
        populateOrderForm(product);
    
        const userId = getUserIdFromToken(token);
        
        function getUserIdFromToken(token) {
            try {
                const decoded = jwt_decode(token);
                return decoded._id;
            } catch (error) {
                console.error('Error decoding token:', error);
                alert('Invalid token, please log in again.');
            }
        }


    
    // Function to populate order form with product details
    function populateOrderForm(product) {
        const orderForm = document.getElementById('orderForm');
    
        // Clear previous content
        orderForm.innerHTML = '';
    
        // Create elements to display product details in order form
        const nameField = document.createElement('p');
        nameField.textContent = `Name: ${product.name}`;
    
        const descriptionField = document.createElement('p');
        descriptionField.textContent = `Description: ${product.description}`;
    
        const priceField = document.createElement('p');
        priceField.textContent = `Price: $${product.price}`;
    
        const categoryField = document.createElement('p');
        categoryField.textContent = `Category: ${product.category}`;
    
        const stockQuantityField = document.createElement('p');
        stockQuantityField.textContent = `Stock Quantity: ${product.stockQuantity}`;
    
        // Append product details to order form
        orderForm.append(nameField, descriptionField, priceField, categoryField, stockQuantityField);
    }

   
});