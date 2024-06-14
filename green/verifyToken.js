const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
    const token = req.header('auth-token');
    if (!token) 
        return res.redirect('/login.html');
    try {
        const verified = jwt.verify(token, process.env.TOKEN_SECRET);
        req.user = verified;
        next(); // Call next to move to the next middleware or route handler
    } catch (err) {
        res.status(400).send('Invalid Token');
    }
};

