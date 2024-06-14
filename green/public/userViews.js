document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('profileModal');
    const updateProfileBtn = document.getElementById('updateProfileBtn');
    const closeButton = document.querySelector('.close-button');
  
    modal.style.display = 'block';
  
    closeButton.addEventListener('click', () => {
      modal.style.display = 'none';
    });
  
    updateProfileBtn.addEventListener('click', () => {
      window.location.href = '/update-profile';  // Replace with your actual profile update page URL
    });
  
    window.addEventListener('click', (event) => {
      if (event.target == modal) {
        modal.style.display = 'none';
      }
    });
  });
  
  document.getElementById('profileUpdateForm').addEventListener('submit', (event) => {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const profileData = {};
    
    formData.forEach((value, key) => {
      profileData[key] = value;
    });
    
    // Perform form submission, e.g., using Fetch API
    fetch('/api/update-profile', {
      method: 'POST',
      body: JSON.stringify(profileData),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        alert('Profile updated successfully!');
        // Optionally redirect or update UI
      } else {
        alert('There was an error updating your profile.');
      }
    })
    .catch(error => console.error('Error:', error));
  });
  