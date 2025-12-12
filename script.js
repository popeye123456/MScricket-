// Application State
let selectedMatchType = null;
let selectedMatchPrice = 0;
let selectedDate = null;
let selectedTimeSlot = null;
let bookingData = {};

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    const dateInput = document.getElementById('booking-date');

    // Set minimum date to today in IST
    const today = getISTDate();
    dateInput.min = today;

    // Set maximum date to 90 days from now
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 90);
    dateInput.max = maxDate.toISOString().split('T')[0];

    // Add date change listener
    dateInput.addEventListener('change', handleDateChange);
});

// Utility Functions
function getISTDate() {
    const now = new Date();
    // Convert to IST (UTC+5:30)
    const istOffset = 5.5 * 60 * 60 * 1000; // 5 hours 30 minutes in milliseconds
    const istTime = new Date(now.getTime() + istOffset);
    return istTime.toISOString().split('T')[0];
}

function formatTimeIST(hour) {
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : (hour === 0 ? 12 : hour);
    return `${displayHour}:00 ${period} IST`;
}

function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

function showNotification(message, duration = 3000) {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.classList.add('show');

    setTimeout(() => {
        notification.classList.remove('show');
    }, duration);
}

// Match Type Selection
function selectMatchType(type, price) {
    selectedMatchType = type;
    selectedMatchPrice = price;

    // Update all match cards to show selection
    document.querySelectorAll('.match-card').forEach(card => {
        const cardType = card.getAttribute('data-match-type');
        if (cardType === type) {
            card.style.borderColor = 'var(--primary)';
            card.style.boxShadow = '0 10px 30px rgba(0, 104, 55, 0.3)';
        } else {
            card.style.borderColor = 'transparent';
            card.style.boxShadow = 'var(--shadow-md)';
        }
    });

    // Show selected match info
    const matchNames = {
        't20': 'T20 Match',
        'odi': 'ODI Match',
        'test': 'Test Match'
    };

    document.getElementById('selected-match-name').textContent = matchNames[type];
    document.getElementById('selected-match-price').textContent = `₹${price.toLocaleString('en-IN')}`;
    document.getElementById('selected-match-info').style.display = 'block';

    // Scroll to booking section
    scrollToSection('booking');

    showNotification(`${matchNames[type]} selected! Please choose a date.`);
}

// Date Change Handler
function handleDateChange(event) {
    selectedDate = event.target.value;

    if (!selectedMatchType) {
        showNotification('Please select a match type first!');
        event.target.value = '';
        scrollToSection('matches');
        return;
    }

    generateTimeSlots(selectedDate);
}

// Generate Time Slots for Selected Date
function generateTimeSlots(date) {
    const slotsContainer = document.getElementById('slots-container');
    slotsContainer.innerHTML = '';

    // Define time slots based on match type
    let timeSlots = [];

    switch (selectedMatchType) {
        case 't20':
            // T20: 3-4 hour slots, can have multiple per day
            timeSlots = [
                { start: 6, label: '6:00 AM - 10:00 AM' },
                { start: 10, label: '10:00 AM - 2:00 PM' },
                { start: 14, label: '2:00 PM - 6:00 PM' },
                { start: 18, label: '6:00 PM - 10:00 PM' }
            ];
            break;
        case 'odi':
            // ODI: Full day slots
            timeSlots = [
                { start: 9, label: '9:00 AM - 6:00 PM (Day Match)' },
                { start: 14, label: '2:00 PM - 11:00 PM (Day-Night Match)' }
            ];
            break;
        case 'test':
            // Test: Full day booking
            timeSlots = [
                { start: 9, label: '9:00 AM - 6:00 PM (Full Day)' }
            ];
            break;
    }

    // Generate slot elements
    timeSlots.forEach(slot => {
        const slotDiv = document.createElement('div');
        slotDiv.className = 'time-slot';
        slotDiv.textContent = slot.label;

        // Randomly mark some as booked for realism (30% chance)
        const isBooked = Math.random() < 0.3;

        if (isBooked) {
            slotDiv.classList.add('booked');
            slotDiv.title = 'Already booked';
        } else {
            slotDiv.addEventListener('click', () => selectTimeSlot(slot.label, slotDiv));
        }

        slotsContainer.appendChild(slotDiv);
    });
}

// Time Slot Selection
function selectTimeSlot(timeLabel, element) {
    // Remove previous selection
    document.querySelectorAll('.time-slot').forEach(slot => {
        slot.classList.remove('selected');
    });

    // Add selection to clicked slot
    element.classList.add('selected');
    selectedTimeSlot = timeLabel;

    // Show team form section
    showTeamForm();
}

// Show Team Form and Update Summary
function showTeamForm() {
    const teamFormSection = document.getElementById('team-form');
    teamFormSection.style.display = 'block';

    // Update booking summary
    const matchNames = {
        't20': 'T20 Match',
        'odi': 'ODI Match',
        'test': 'Test Match'
    };

    document.getElementById('summary-match-type').textContent = matchNames[selectedMatchType];
    document.getElementById('summary-date').textContent = new Date(selectedDate).toLocaleDateString('en-IN', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    document.getElementById('summary-time').textContent = selectedTimeSlot;
    document.getElementById('summary-amount').textContent = `₹${selectedMatchPrice.toLocaleString('en-IN')}`;

    // Scroll to form
    setTimeout(() => {
        scrollToSection('team-form');
    }, 300);

    showNotification('Great! Please fill in your team details.');
}

// Go Back to Slots
function goBackToSlots() {
    document.getElementById('team-form').style.display = 'none';
    scrollToSection('booking');

    // Clear form
    document.getElementById('booking-form').reset();
}

// Handle Booking Form Submission
function handleBookingSubmit(event) {
    event.preventDefault();

    // Validate captain declaration checkbox
    const declarationCheckbox = document.getElementById('captain-declaration');
    if (!declarationCheckbox.checked) {
        showNotification('Please accept the team captain declaration to proceed.');
        declarationCheckbox.focus();
        return;
    }

    // Collect form data
    const formData = new FormData(event.target);
    bookingData = {
        matchType: selectedMatchType,
        matchPrice: selectedMatchPrice,
        bookingDate: selectedDate,
        timeSlot: selectedTimeSlot,
        teamName: formData.get('teamName'),
        captainName: formData.get('captainName'),
        captainContact: formData.get('captainContact'),
        captainEmail: formData.get('captainEmail'),
        numPlayers: formData.get('numPlayers'),
        teamType: formData.get('teamType'),
        specialRequirements: formData.get('specialRequirements'),
        captainDeclaration: formData.get('captainDeclaration') === 'on',
        bookingTimestamp: new Date().toISOString()
    };

    // Show loading state
    const submitBtn = event.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Processing...';
    submitBtn.disabled = true;

    // Send booking data to server
    fetch('/api/bookings', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(bookingData)
    })
        .then(response => response.json())
        .then(data => {
            // Reset button
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;

            if (data.success) {
                // Show success modal
                showSuccessModal(data.bookingReference);

                // Reset form and selections
                resetBookingProcess();
            } else {
                showNotification('Booking failed. Please try again.');
            }
        })
        .catch(error => {
            console.error('Booking error:', error);
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            showNotification('An error occurred. Please try again.');
        });
}

// Show Success Modal
function showSuccessModal(bookingRef) {
    const modal = document.getElementById('success-modal');
    document.getElementById('booking-ref-number').textContent = bookingRef;
    modal.style.display = 'flex';
}

// Close Success Modal
function closeSuccessModal() {
    const modal = document.getElementById('success-modal');
    modal.style.display = 'none';
}

// Reset Booking Process
function resetBookingProcess() {
    // Clear selections
    selectedMatchType = null;
    selectedMatchPrice = 0;
    selectedDate = null;
    selectedTimeSlot = null;

    // Reset form
    document.getElementById('booking-form').reset();
    document.getElementById('booking-date').value = '';

    // Hide sections
    document.getElementById('selected-match-info').style.display = 'none';
    document.getElementById('team-form').style.display = 'none';

    // Clear slots
    document.getElementById('slots-container').innerHTML = '<div class="no-selection">Please select a date to view available time slots</div>';

    // Reset match card borders
    document.querySelectorAll('.match-card').forEach(card => {
        card.style.borderColor = 'transparent';
        card.style.boxShadow = 'var(--shadow-md)';
    });

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Close modal on outside click
window.onclick = function (event) {
    const modal = document.getElementById('success-modal');
    if (event.target === modal) {
        closeSuccessModal();
    }
}
