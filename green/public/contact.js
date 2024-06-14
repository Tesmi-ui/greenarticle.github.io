document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');

    contactForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const formData = new FormData(contactForm);
        const formDataObject = {};
        formData.forEach((value, key) => {
            formDataObject[key] = value;
        });

        fetch('/api/send-contact-email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formDataObject)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to send contact email');
            }
            return response.text();
        })
        .then(data => {
            console.log(data);
            alert('Contact email sent successfully');
            contactForm.reset(); // Reset the form after successful submission
        })
        .catch(error => {
            console.error(error);
            alert('Failed to send contact email');
        });
    });
});
