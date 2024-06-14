document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    if (!token) {
        alert('No token found, please log in.');
        return;
    }

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

    async function fetchUserOrders() {
        try {
            const response = await fetch(`/api/orders/user/${userId}`, {
                headers: {
                    'auth-token': token
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch user orders');
            }

            const orders = await response.json();
            const orderList = document.getElementById('orderList');
            orderList.innerHTML = '';

            orders.forEach(order => {
                const orderCard = document.createElement('div');
                orderCard.classList.add('order-card');

                const orderDetails = `
                    <p>Order ID: ${order._id}</p>
                    <p>Product Name: ${order.productName}</p>
                    <p>Quantity: ${order.quantity}</p>
                    <p>Total Price: $${order.totalPrice}</p>
                    <p>Status: ${order.status}</p>
                `;

                orderCard.innerHTML = orderDetails;
                orderList.appendChild(orderCard);
            });
        } catch (error) {
            console.error('Error fetching user orders:', error);
            alert('Error fetching user orders, please try again.');
        }
    }

    fetchUserOrders();
});
