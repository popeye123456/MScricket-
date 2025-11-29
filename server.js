const express = require('express');
const path = require('path');
const app = express();
const PORT = 2020;

// Serve static files from the current directory
app.use(express.static(__dirname));

// Route for the main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
        console.log(`To stop the server, press Ctrl+C`);
    });
}

module.exports = app;
