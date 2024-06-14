// Importing necessary modules
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const verify = require('./verifyToken');
//const formSubmitRoutes = require('./routes/formsubmitRoutes');



 

// Configuring environment variables
dotenv.config();



// Initializing Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Connecting to MongoDB
mongoose.connect(process.env.DB_CONNECT, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Failed to connect to MongoDB', err));
// Set the view engine to EJS
app.set('view engine', 'ejs');
// Set the views directory
app.set('views', path.join(__dirname, 'views'));
// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));



app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve HTML file
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.use('/js', express.static(__dirname + '/js', { 
    setHeaders: (res, path) => {
        if (path.endsWith('.js')) {
            res.setHeader('Content-Type', 'application/javascript');
        }
    }
}));





// Importing route handlers
const authRoute = require('./routes/auth');
const authPost = require('./routes/posts');
const ownerDashboard = require('./routes/ownerDashboard');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const profileRoutes = require('./routes/profile');

const mailerRoutes = require('./routes/mailerRoutes'); 



// Middleware
app.use(express.json()); // Parse JSON bodies
app.use('/api/user', authRoute); // Mounting auth routes
app.use('/api/posts', authPost); // 
app.use('/owner-dashboard', ownerDashboard); // Mounting dashboard routes
app.use('/api/users', userRoutes); // Mounting user routes
app.use('/api/products', productRoutes); // Mounting product routes
app.use('/api/orders', orderRoutes); // Mounting order routes
app.use('/profile', profileRoutes);
//app.use('/api/smail', formSubmitRoutes);

app.use('/api', mailerRoutes);



// Protect the "ownerdashboard.html" route with JWT authentication middleware
app.get('/add-product-form.html', verify, (req, res) => {
    // Send the HTML file or render it using a template engine
    res.sendFile(__dirname , '/public/add-product-form.html');
});

app.get('/post.html', verify, (req, res) => {
    // Send the HTML file or render it using a template engine
    res.sendFile(__dirname , '/public/post.html');
});


// Error Handling Middleware
app.use((err, req, res, next) => {
    if (err && err.code === 11000 && err.keyPattern && err.keyPattern.username === 1) {
        // Duplicate key error for username
        if (err.keyValue && err.keyValue.username === null) {
            // Handling duplicate key error for null username
            return res.status(400).json({ error: 'Username cannot be null.' });
        } else {
            // Handling duplicate key error for non-null username
            return res.status(400).json({ error: 'Username already exists.' });
        }
    }
    // Other errors
    console.error(err);
    res.status(500).json({ error: 'Internal server error.' });
});
// Error Handling Middleware
     
// Starting the server
app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});
