module.exports = (err, req, res, next) => {
    if (err && err.code === 11000 && err.keyPattern && err.keyPattern.username === 1) {
        // Duplicate key error for username
        return res.status(400).json({ error: 'Username already exists.' });
    }
    // Other errors
    console.error(err);
    res.status(500).json({ error: 'Internal server error.' });
};
