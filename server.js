const express = require('express');
const path = require('path');
const app = express();
const port = 8000;

// Enable CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

// Serve static files with proper MIME types
app.use(express.static('.', {
    setHeaders: (res, path) => {
        if (path.endsWith('.json')) {
            res.set('Content-Type', 'application/json');
        }
    }
}));

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
