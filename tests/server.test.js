const request = require('supertest');
const app = require('../server');

describe('Cricket Ground Booking API Tests', () => {

    describe('GET /', () => {
        it('should return 200 OK and serve HTML', async () => {
            const res = await request(app).get('/');
            expect(res.statusCode).toEqual(200);
            expect(res.type).toMatch(/html/);
        });
    });

    describe('POST /api/bookings', () => {
        it('should accept a valid booking', async () => {
            const bookingData = {
                matchType: 't20',
                matchPrice: 5000,
                bookingDate: '2025-12-15',
                timeSlot: '6:00 PM - 10:00 PM',
                teamName: 'Mumbai Warriors',
                captainName: 'Rahul Sharma',
                captainContact: '+919876543210',
                captainEmail: 'rahul@test.com',
                numPlayers: '15',
                teamType: 'Club Team',
                captainDeclaration: true
            };

            const res = await request(app)
                .post('/api/bookings')
                .send(bookingData)
                .set('Content-Type', 'application/json');

            expect(res.statusCode).toEqual(200);
            expect(res.body.success).toBe(true);
            expect(res.body.bookingReference).toBeDefined();
            expect(res.body.bookingReference).toMatch(/^CG-/);
        });

        it('should return booking reference in correct format', async () => {
            const bookingData = {
                matchType: 'odi',
                matchPrice: 10000,
                bookingDate: '2025-12-20',
                timeSlot: '9:00 AM - 6:00 PM',
                teamName: 'Test Team',
                captainName: 'Test Captain',
                captainContact: '+919999999999',
                captainEmail: 'test@test.com',
                numPlayers: '11',
                teamType: 'College Team',
                captainDeclaration: true
            };

            const res = await request(app)
                .post('/api/bookings')
                .send(bookingData);

            expect(res.body.bookingReference).toMatch(/^CG-\d+-[A-Z0-9]+$/);
        });
    });

    describe('Static Files', () => {
        it('should serve style.css', async () => {
            const res = await request(app).get('/style.css');
            expect(res.statusCode).toEqual(200);
            expect(res.type).toMatch(/css/);
        });

        it('should serve script.js', async () => {
            const res = await request(app).get('/script.js');
            expect(res.statusCode).toEqual(200);
            expect(res.type).toMatch(/javascript/);
        });

        it('should serve rahul_dravid.png', async () => {
            const res = await request(app).get('/rahul_dravid.png');
            expect(res.statusCode).toEqual(200);
            expect(res.type).toMatch(/image/);
        });
    });

    describe('404 Handler', () => {
        it('should return 404 for non-existent routes', async () => {
            const res = await request(app).get('/non-existent-page');
            expect(res.statusCode).toEqual(404);
        });
    });
});
