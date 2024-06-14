// Function to find a user by ID
// userProfile.js
document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '/login.html';
        return;
    }

    fetch('/api/users/${userId}', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then(user => {
        displayUserProfile(user);
    })
    .catch(error => console.error('Error fetching user details:', error));

    function displayUserProfile(user) {
        const userProfileDiv = document.getElementById('user-profile');
        userProfileDiv.innerHTML = `
            <h1>User Profile</h1>
            <p>Name: ${user.name}</p>
            <p>Email: ${user.email}</p>
            <p>Joined: ${new Date(user.createdAt).toLocaleDateString()}</p>
        `;
    }
});




// Function to find a user by email
async function findUserByEmail() {
    const userEmail = document.getElementById('userEmailInput').value;
    if (!userEmail) {
        alert('Please enter a user email');
        return;
    }

    try {
        const response = await fetch(`/api/users/by-email/${userEmail}`);
        const data = await response.json();

        if (response.ok) {
            displayResult(data);
        } else {
            displayResult({ msg: data.msg });
        }
    } catch (error) {
        console.error('Error fetching user by email:', error);
    }
}

// Function to display the result
function displayResult(data) {
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = JSON.stringify(data, null, 2);
}
