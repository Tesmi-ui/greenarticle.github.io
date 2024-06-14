document.getElementById('searchForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent form submission
    const searchQuery = document.getElementById('searchInput').value.trim();
    if (searchQuery) {
        // Send the search query to the server
        searchProducts(searchQuery);
    }
});

function searchProducts(query) {
    fetch(`/api/products/userDashboard?q=${encodeURIComponent(query)}`)
        .then(response => response.json())
        .then(products => {
            displaySearchResults(products);
        })
        .catch(error => console.error('error fetching search results:', error));
}

function displaySearchResults(products) {
    const searchResultsContainer = document.getElementById('searchResults');
    searchResultsContainer.innerHTML = '';

    if (products.length === 0) {
        searchResultsContainer.innerHTML = '<p>No products found.</p>';
        return;
    }

    const ul = document.createElement('ul');
    products.forEach(product => {
        const li = document.createElement('li');
        li.textContent = product.name + ' - ' + product.category;
        ul.appendChild(li);
    });
    searchResultsContainer.appendChild(ul);
}