window.addEventListener('DOMContentLoaded', async () => {
    const editButton = document.getElementById('editButton');
    const editForm = document.getElementById('editProductForm');
    const productIdInput = document.getElementById('productId');
    const nameInput = document.getElementById('name');
    const descriptionInput = document.getElementById('description');
    const priceInput = document.getElementById('price');
    const stockQuantityInput = document.getElementById('stockQuantity');
    const categoryInput = document.getElementById('category');

    // Function to show the edit form and populate it with product data
    const showEditForm = async () => {
        const productId = 'productId'; // Replace with the actual product ID
        const response = await fetch(`/api/products/${productId}`);
        const productData = await response.json();

        productIdInput.value = productData._id;
        nameInput.value = productData.name;
        descriptionInput.value = productData.description;
        priceInput.value = productData.price;
        stockQuantityInput.value = productData.stockQuantity;
        categoryInput.value = productData.category;

        editForm.style.display = 'block';
    };

    // Event listener for edit button click
    editButton.addEventListener('click', showEditForm);

    // Event listener for form submission
    editForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const updatedProductData = {};
        formData.forEach((value, key) => {
            updatedProductData[key] = value;
        });

        try {
            const response = await fetch(`/api/products/${productIdInput.value}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedProductData)
            });
            const updatedProduct = await response.json();
            console.log('Updated product:', updatedProduct);
            // Redirect or show success message
        } catch (error) {
            console.error('Error updating product:', error);
            // Handle error
        }
    });
});
