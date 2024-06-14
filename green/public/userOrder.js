document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '/login.html';
        return;
    }

    const userId = getUserIdFromToken(token);

    fetch(`/api/orders/user/${userId}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then(orders => {
        displayOrders(orders);
    })
    .catch(error => console.error('Error fetching orders:', error));

    function getUserIdFromToken(token) {
        const decodedToken = jwt_decode(token);
        return decodedToken._id; // Adjust this line based on how the user ID is stored in the token
    }

    function displayOrders(orders) {
        const orderList = document.getElementById('order-list');
        orderList.innerHTML = ''; // Clear any existing orders

        if (orders.length === 0) {
            orderList.textContent = 'No orders found.';
            return;
        }

        orders.forEach(order => {
            const orderItem = document.createElement('div');
            orderItem.classList.add('order-item');

            const orderDetails = `
                <p>Order ID: ${order._id}</p>
                <p>Product Name: ${order.productName}</p>
                <p>Quantity: ${order.quantity}</p>
                <p>Total Price: ${order.total}</p>
                <p>Shipping Address: ${order.shippingAddress}</p>
                <p>Status: ${order.status}</p>
            `;

            orderItem.innerHTML = orderDetails;

            if (order.status === 'pending') {
                const cancelButton = document.createElement('button');
                cancelButton.textContent = 'Cancel Order';
                cancelButton.addEventListener('click', () => updateOrderStatus(order._id, 'cancelled'));
                orderItem.appendChild(cancelButton);
            }

            orderList.appendChild(orderItem);
        });
    }

    function updateOrderStatus(orderId, status) {
        fetch(`/api/orders/${orderId}/status`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ status })
        })
        .then(response => response.json())
        .then(updatedOrder => {
            alert('Order status updated');
            // Refresh the order list
            fetch(`/api/orders/${userId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            .then(response => response.json())
            .then(orders => {
                
                console.log('Fetched orders after update:', orders); // Log fetched orders after update
                displayOrders(orders);
            })
            .catch(error => console.error('Error fetching orders:', error));
        })
        .catch(error => console.error('Error updating order status:', error));
    }
});
