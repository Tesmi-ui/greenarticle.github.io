document.addEventListener('DOMContentLoaded', () => {
    let productsData = [];

    const fetchAndPopulateProducts = () => {
        fetch('/api/products/userDashboard')
            .then(response => response.json())
            .then(products => {
                productsData = products;
                populateProducts(products);
            })
            .catch(error => console.error('Error fetching product data:', error));
    };

    const populateProducts = (products) => {
        const productList = document.getElementById('product-list');
        productList.innerHTML = '';

        products.forEach(product => {
            const productCard = createProductCard(product);
            productList.appendChild(productCard);
        });
    };

    const createProductCard = (product) => {
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
        price.textContent = `Price: ${product.price} Rupees`;

        const category = document.createElement('p');
        category.textContent = `Category: ${product.category}`;

        const stockQuantity = document.createElement('p');
        stockQuantity.textContent = `Stock Quantity: ${product.stockQuantity}`;

        const buyButton = document.createElement('button');
        buyButton.textContent = 'Buy';
        buyButton.classList.add('buy-button');
        buyButton.dataset.productId = product._id;

        buyButton.addEventListener('click', () => {
            handleBuyButtonClick(product);

        });

        productDetails.append(name, description, price, category, stockQuantity, buyButton);
        productCard.append(image, productDetails);

        return productCard;
    };

    const handleBuyButtonClick = (product) => {
        const token = localStorage.getItem('token');
        if (!token) {
            window.location.href = '/login.html';
            return;
        }

        const userId = getUserIdFromToken(token);

        document.getElementById('productId').value = product._id;
        document.getElementById('userId').value = userId;
        document.getElementById('productNameDisplay').value = product.name;
        document.getElementById('basePrice').value = product.price;
        document.getElementById('total').value = product.price;

        document.getElementById('orderForm').style.display = 'block';
        
    };

    const getUserIdFromToken = (token) => {
        const decodedToken = jwt_decode(token);
        return decodedToken._id; // Adjust this line based on how the user ID is stored in the token
    };

    document.getElementById('quantity').addEventListener('input', (event) => {
        const quantity = event.target.value;
        const basePrice = parseFloat(document.getElementById('basePrice').value);
        const totalPrice = quantity > 0 ? quantity * basePrice : basePrice;
        document.getElementById('total').value = totalPrice;
    });

    document.getElementById('orderForm').addEventListener('submit', (event) => {
        event.preventDefault();

        const formData = new FormData(event.target);
        const orderData = Object.fromEntries(formData.entries());

        console.log('Submitting order data:', orderData); // Log order data before submitting

        fetch('/api/orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(orderData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                console.error('Error:', data.error);
                alert('Error placing order: ' + data.message);
            } else {
                alert('Order placed successfully');
                document.getElementById('orderForm').reset();
                document.getElementById('orderForm').style.display = 'none';
            }
        })
        .catch(error => console.error('Error placing order:', error));
    });

    fetchAndPopulateProducts();
});
