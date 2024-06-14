/*document.addEventListener('DOMContentLoaded', () => {
  // JavaScript code for fetching product data and creating product cards
  fetch('/api/products/userDashboard')
    .then(response => response.json())
    .then(products => {
      const productList = document.getElementById('product-list');
      products.forEach(product => {
        // Create product card elements
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

        const buyButton = document.createElement('button');
        buyButton.textContent = 'Buy';
        buyButton.classList.add('buy-button');

        // Add event listener to handle buy button click
        buyButton.addEventListener('click', () => {
          handleBuyButtonClick(product);
        });

        // Add event listener to redirect to product profile page on image click
        image.addEventListener('click', () => {
          fetch(`/api/products/${product._id}`)
            .then(response => response.json())
            .then(productDetails => {
              window.location.href = `/product-details.html?id=${productDetails}`;
              populateModal(productDetails);
              modal.style.display = true;
            });
        });

        // Append elements to product card
        productDetails.append(buyButton);
        productDetails.append(name, description, price, category, stockQuantity);
        productCard.append(image, productDetails);
        productList.appendChild(productCard);
      });
    })
    .catch(error => console.error('Error fetching product data:', error));

    // Function to handle the buy button click event
function handleBuyButtonClick(product) {
  // Check if the user is logged in
  const token = localStorage.getItem('token');
  if (!token) {
      // If the user is not logged in, redirect them to the login page
      window.location.href = '/login.html';
      return;
  }
  // If the user is logged in, redirect them to the user dashboard
  window.location.href = '/userDashboard.html';

}
*/


document.addEventListener('DOMContentLoaded', () => {
  let productsData = []; // Store all products data

  // Function to fetch product data and populate the UI
  const fetchAndPopulateProducts = () => {
      fetch('/api/products/userDashboard')
          .then(response => response.json())
          .then(products => {
              productsData = products; // Save products data for filtering
              populateProducts(products);
          })
          .catch(error => console.error('Error fetching product data:', error));
  };

  // Function to populate the UI with products
  const populateProducts = (products) => {
      const productList = document.getElementById('product-list');
      productList.innerHTML = ''; // Clear existing product list

      products.forEach(product => {
          const productCard = createProductCard(product);
          productList.appendChild(productCard);
      });
  };

  // Function to create a product card element
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
      price.textContent = `Price:  ${product.price} Rupees`;

      const category = document.createElement('p');
      category.textContent = `Category: ${product.category}`;

      const stockQuantity = document.createElement('p');
      stockQuantity.textContent = `Stock Quantity: ${product.stockQuantity}`;

      const buyButton = document.createElement('button');
      buyButton.textContent = 'Buy';
      buyButton.classList.add('buy-button');

      buyButton.addEventListener('click', () => {
          handleBuyButtonClick(product);
      });

      productDetails.append(name, description, price, category, stockQuantity, buyButton);
      productCard.append(image, productDetails);

      return productCard;
  };

    // Function to handle search
    const handleSearch = () => {
      const searchInput = document.getElementById('searchInput').value.trim().toLowerCase();
      const searchResults = productsData.filter(product => product.name.toLowerCase().includes(searchInput));
      populateSearchResults(searchResults);
  };

  // Function to populate search results
  const populateSearchResults = (searchResults) => {
      const searchResultsList = document.getElementById('search-results-list');
      searchResultsList.innerHTML = ''; // Clear existing search results

      searchResults.forEach(product => {
          const searchResultCard = createProductCard(product);
          searchResultsList.appendChild(searchResultCard);
      });
  };

  // Event listener for search input
  document.getElementById('searchForm').addEventListener('submit', (event) => {
      event.preventDefault(); // Prevent form submission
      handleSearch();
  });




  // Function to handle the buy button click event
  const handleBuyButtonClick = (product) => {
      const token = localStorage.getItem('token');
      if (!token) {
          window.location.href = '/login.html';
          return;
      }
      window.location.href ='../userDashboard.html';
  };

  // Function to filter products by category
  const filterProductsByCategory = (category) => {
      const filteredProducts = productsData.filter(product => product.category === category);
      populateProducts(filteredProducts);
  };

  // Event listener for category filter
  const categoryFilter = document.getElementById('category-filter');
  categoryFilter.addEventListener('change', (event) => {
      const selectedCategory = event.target.value;
      if (selectedCategory === 'All') {
          populateProducts(productsData);
      } else {
          filterProductsByCategory(selectedCategory);
      }
  });

  // Initialize by fetching and populating products
  fetchAndPopulateProducts();
});



/*
// Function to populate modal with product details
function populateModal(product) {
   const modalContent = document.querySelector('.modal-content');
  modalContent.innerHTML = `
      <span class="close">&times;</span>
      <h2>${product.name}</h2>
      <img src="uploads/${product.imageURL}" alt="${product.name}">
      <p>Description: ${product.description}</p>
      <p>Price: $${product.price}</p>
      <p>Category: ${product.category}</p>
      <p>Stock Quantity: ${product.stockQuantity}</p>
  `;
}

  // Get the modal element
  const modal = document.getElementById('productModal');

  // Get the close button element
  const closeButton = modal.querySelector('.close');

  // Close the modal when the close button is clicked
  closeButton.addEventListener('click', () => {
      modal.style.display = false;
  });

  // Close the modal when the user clicks anywhere outside of it
  window.addEventListener('click', event => {
      if (event.target === modal) {
          modal.style.display = 'none';
      }
  });

// Function to handle the buy button click event
function handleBuyButtonClick(product) {
  // Check if the user is logged in
  const token = localStorage.getItem('token');
  if (!token) {
      // If the user is not logged in, redirect them to the login page
      window.location.href = '/login.html';
      return;
  }
  // If the user is logged in, redirect them to the user dashboard
  window.location.href = '/userDashboard.html';
}



// Function to handle the add to cart button click event
function handleAddToCartButtonClick(product) {
  // Check if the user is logged in
  const token = localStorage.getItem('token');
  if (!token) {
      // If the user is not logged in, redirect them to the login page
      window.location.href = '/login.html';
      return;
  }
  
// Function to update the cart UI
function updateCartUI() {
  const cartList = document.getElementById('cart-list');
  cartList.innerHTML = '';

  cart.forEach(product => {
      const cartItem = document.createElement('li');
      cartItem.textContent = `${product.name} - $${product.price} x ${product.quantity}`;
      cartList.appendChild(cartItem);
  });
}


    // Function to handle the cart button click event

function handleCartButtonClick(product) {
  // Check if the user is logged in
  const token = localStorage.getItem('token');
  if (!token) {
      // If the user is not logged in, redirect them to the login page
      window.location.href = '/login.html';
      return;
  }
  // If the user is logged in, redirect them to the user dashboard
  window.location.href = '/userDashboard.html';
}

     
    // Function to handle the checkout button click event
function handleCheckoutButtonClick() {
  // Check if the user is logged in
  const token = localStorage.getItem('token');
  if (!token) {
      // If the user is not logged in, redirect them to the login page
      window.location.href = '/login.html';
      return;
  }
  // If the user is logged in, redirect them to the checkout page
  window.location.href = '/checkout.html';
}

// Function to handle the logout button click event
function handleLogoutButtonClick() {
  // Clear the token from local storage
  localStorage.removeItem('token');
  // Redirect the user to the login page
  window.location.href = '/login.html';
}


}});
 
  */
   