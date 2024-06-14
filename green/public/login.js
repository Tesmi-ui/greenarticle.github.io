document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const loginMessage = document.getElementById('loginMessage');

    loginForm.addEventListener('submit', async function(event) {
        event.preventDefault();

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            const response = await fetch('/api/user/login', {
                method: 'POST',
                headers: {
                    'auth-token': 'token',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            // Check if login was successful
            if (response.ok) {
                // Store the token in localStorage
                localStorage.setItem('token', data.token);
            } else {
                loginMessage.textContent = data.message; // Display error message from backend
            }
        } catch (error) {
            console.error('Error:', error);
            loginMessage.textContent = 'An error occurred. Please try again later.';
        }
    });
});




// Function to fetch protected data
function fetchProtectedData() {
    // Get the token from local storage
    const token = localStorage.getItem('authToken');

    if (!token) {
        // Handle the case where the token is not present (user is not authenticated)
        console.error('Token not found');
        return;
    }

    // Make a request to a protected route with the token included in the headers
    fetch('/protected-route', {
        headers: {
            'auth-token': token
        }
    })
    .then(response => {
        if (response.ok) {
            // If the response is okay, handle the data
            return response.json();
        } else {
            // If the response is not okay, handle the error
            throw new Error('Failed to fetch protected data');
        }
    })
    .then(data => {
        // Handle the response data
        console.log(data);
    })
    .catch(error => {
        // Handle any errors that occurred during the fetch
        console.error('Error:', error);
    });
}



