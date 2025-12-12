const express = require('express');
const path = require('path');
const app = express();
const PORT = 2020;

// Middleware to parse JSON bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the current directory
app.use(express.static(__dirname));

// Route for the main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// API endpoint for booking submissions
app.post('/api/bookings', (req, res) => {
    const bookingData = req.body;

    // Generate a unique booking reference
    const bookingReference = 'CG-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9).toUpperCase();

    // Log booking data (in production, this would save to a database)
    console.log('New Booking Received:');
    console.log('='.repeat(50));
    console.log(`Booking Reference: ${bookingReference}`);
    console.log(`Match Type: ${bookingData.matchType?.toUpperCase()}`);
    console.log(`Date: ${bookingData.bookingDate}`);
    console.log(`Time Slot: ${bookingData.timeSlot}`);
    console.log(`Price: ₹${bookingData.matchPrice}`);
    console.log(`Team: ${bookingData.teamName}`);
    console.log(`Captain: ${bookingData.captainName}`);
    console.log(`Contact: ${bookingData.captainContact}`);
    console.log(`Email: ${bookingData.captainEmail}`);
    console.log(`Players: ${bookingData.numPlayers}`);
    console.log(`Team Type: ${bookingData.teamType}`);
    console.log(`Declaration Accepted: ${bookingData.captainDeclaration}`);
    console.log('='.repeat(50));

    // Send success response
    res.json({
        success: true,
        bookingReference: bookingReference,
        message: 'Booking confirmed successfully',
        bookingData: {
            ...bookingData,
            bookingReference
        }
    });
});

if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`🏏 Cricket Ground Booking Server`);
        console.log(`Server is running on http://localhost:${PORT}`);
        console.log(`To stop the server, press Ctrl+C`);
    });
}

module.exports = app;
