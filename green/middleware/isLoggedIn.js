// check user logged in or not
// if he is logged in, give access or send to next
// if not, send to login page or previous page or send error "You do not have permission"

function isLoggedIn(req, res, next) {
    if (req.user) {
        // Verify token and check owner
        if (req.user.token === 'valid' && req.user.owner === true) {
            // User is logged in and has valid token, proceed with the next middleware
            next();
        } else {
            // User is not authorized, handle the unauthorized access
            res.status(403).send('You do not have permission'); // Send an error message
        }

        next();
    } else {
        // User is not logged in, handle the unauthorized access
        res.redirect('/login'); // Redirect to the login page
        // or
        // res.redirect(req.headers.referer); // Redirect to the previous page
        // or
        // res.status(403).send('You do not have permission'); // Send an error message
    }
}

module.exports = isLoggedIn;