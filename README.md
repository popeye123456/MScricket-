# Cricket Ground Booking System

A premium cricket ground booking website with match type selection, IST time slots, and team captain declaration.

## Features

- 🏏 **Three Match Types:** T20 (₹5,000), ODI (₹10,000), Test (₹17,000)
- ⏰ **IST Time Slots:** All bookings in Indian Standard Time
- 👨‍✈️ **Team Captain Declaration:** Mandatory health & safety agreement
- 🎨 **Premium Design:** Modern UI with Rahul Dravid background
- 🌐 **Responsive:** Works on all devices
- ✅ **Form Validation:** Complete team details validation

## Quick Start

### Prerequisites

- Node.js installed
- npm or node available in PATH

### Installation

1. Clone the repository:
   ```bash
   git clone <your-repo-url>
   cd cricket_ground_booking
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the server:
   ```bash
   npm start
   # OR
   node server.js
   ```

4. Open your browser:
   ```
   http://localhost:2020
   ```

## Usage

1. **Select Match Type:** Choose T20, ODI, or Test match
2. **Pick Date:** Select your preferred booking date
3. **Choose Time Slot:** Select from available IST time slots
4. **Team Details:** Fill in team information
5. **Captain Declaration:** Accept responsibility agreement
6. **Confirm Booking:** Submit and receive booking reference

## Project Structure

```
cricket_ground_booking/
├── index.html           # Main page
├── style.css            # Premium styling
├── script.js            # Booking logic
├── server.js            # Express server (Port 2020)
├── rahul_dravid.png     # Hero background
├── package.json         # Dependencies
└── README.md            # This file
```

## API Endpoints

### POST `/api/bookings`

Submit a booking with team details.

**Request Body:**
```json
{
  "matchType": "t20",
  "matchPrice": 5000,
  "bookingDate": "2025-12-15",
  "timeSlot": "6:00 PM - 10:00 PM",
  "teamName": "Mumbai Warriors",
  "captainName": "Rahul Sharma",
  "captainContact": "+919876543210",
  "captainEmail": "rahul@test.com",
  "numPlayers": "15",
  "teamType": "Club Team",
  "captainDeclaration": true
}
```

**Response:**
```json
{
  "success": true,
  "bookingReference": "CG-1734012345678-ABC123XYZ",
  "message": "Booking confirmed successfully"
}
```

## Match Type Pricing

| Type | Price | Duration |
|------|-------|----------|
| T20  | ₹5,000 | 3-4 hours |
| ODI  | ₹10,000 | Full day |
| Test | ₹17,000 | Per day |

## Technologies Used

- **Frontend:** HTML5, CSS3, Vanilla JavaScript
- **Backend:** Node.js, Express.js
- **Design:** Modern glassmorphism, responsive layout
- **Font:** Google Fonts (Outfit)

## Development

### Running Tests

```bash
npm test
```

### Git Workflow

```bash
# Stage changes
git add .

# Commit
git commit -m "Your message"

# Push to remote
git push origin main
```

## Configuration

**Server Port:** 2020 (configured in `server.js`)

**Time Zone:** IST (UTC+5:30) 

**Date Range:** Today to 90 days ahead

## License

MIT

## Contact

For booking inquiries or support, please contact the ground administrator.

---

**🏏 Gentleman's Game**
