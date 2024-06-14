document.getElementById("registrationForm").addEventListener("submit", async function(event) {
    event.preventDefault();
    
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const userData = {
        name: name,
        email: email,
        password: password
    };

    try {
        const response = await fetch('/api/user/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });

        const data = await response.json();
        document.getElementById("message").innerText = data.message;
    } catch (error) {
        console.error('Error:', error);
        document.getElementById("message").innerText = 'Registration failed. Please try again later.';
    }
});
