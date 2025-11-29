// State
let selectedDate = null;
let selectedSlot = null;
let selectedAdPackage = null;
let currentPaymentType = null; // 'booking' or 'advertising'

// DOM Elements
const dateInput = document.getElementById('booking-date');
const slotsContainer = document.getElementById('slots-container');
const bookingSummary = document.getElementById('booking-summary');
const summaryDate = document.getElementById('summary-date');
const summaryTime = document.getElementById('summary-time');
const summaryPrice = document.getElementById('summary-price');
const paymentModal = document.getElementById('payment-modal');
const paymentAmount = document.getElementById('payment-amount');
const paymentDesc = document.getElementById('payment-description');
const notification = document.getElementById('notification');

// Set min date to today
const today = new Date().toISOString().split('T')[0];
dateInput.min = today;

// Event Listeners
dateInput.addEventListener('change', (e) => {
    selectedDate = e.target.value;
    generateSlots(selectedDate);
    bookingSummary.style.display = 'none';
    selectedSlot = null;
});

// Functions
function scrollToSection(id) {
    document.getElementById(id).scrollIntoView({ behavior: 'smooth' });
}

function generateSlots(date) {
    slotsContainer.innerHTML = '';

    // Mock data: Generate slots from 9 AM to 9 PM
    const startHour = 9;
    const endHour = 21;

    // Randomly decide some slots are booked for realism
    const isWeekend = new Date(date).getDay() % 6 === 0;

    for (let i = startHour; i < endHour; i++) {
        const slotDiv = document.createElement('div');
        slotDiv.className = 'time-slot';

        const timeString = `${i > 12 ? i - 12 : i}:00 ${i >= 12 ? 'PM' : 'AM'}`;
        slotDiv.textContent = timeString;

        // Randomly mark as booked (higher chance on weekends)
        const isBooked = Math.random() < (isWeekend ? 0.6 : 0.3);

        if (isBooked) {
            slotDiv.classList.add('booked');
            slotDiv.title = "Already Booked";
        } else {
            slotDiv.onclick = () => selectSlot(slotDiv, timeString, isWeekend ? 70 : 50);
        }

        slotsContainer.appendChild(slotDiv);
    }
}

function selectSlot(element, time, price) {
    // Remove previous selection
    document.querySelectorAll('.time-slot.selected').forEach(el => el.classList.remove('selected'));

    // Add new selection
    element.classList.add('selected');
    selectedSlot = { time, price };

    // Update Summary
    summaryDate.textContent = selectedDate;
    summaryTime.textContent = time;
    summaryPrice.textContent = `$${price}.00`;
    bookingSummary.style.display = 'block';
}

function selectAdPackage(name, price) {
    selectedAdPackage = { name, price };
    openPaymentModal('advertising');
}

function openPaymentModal(type) {
    currentPaymentType = type;
    paymentModal.style.display = 'flex';

    if (type === 'booking') {
        paymentDesc.textContent = `Booking: ${selectedDate} at ${selectedSlot.time}`;
        paymentAmount.textContent = `$${selectedSlot.price}.00`;
    } else {
        paymentDesc.textContent = `Advertising: ${selectedAdPackage.name}`;
        paymentAmount.textContent = `$${selectedAdPackage.price}.00`;
    }
}

function closePaymentModal() {
    paymentModal.style.display = 'none';
    document.getElementById('payment-form').reset();
}

function handlePayment(e) {
    e.preventDefault();

    // Simulate processing delay
    const payBtn = document.querySelector('.pay-btn');
    const originalText = payBtn.textContent;
    payBtn.textContent = 'Processing...';
    payBtn.disabled = true;

    setTimeout(() => {
        closePaymentModal();
        showNotification('Payment Successful! Confirmation sent to email.');

        // Reset UI
        payBtn.textContent = originalText;
        payBtn.disabled = false;

        if (currentPaymentType === 'booking') {
            // Mark slot as booked (visually only for this session)
            const selectedEl = document.querySelector('.time-slot.selected');
            if (selectedEl) {
                selectedEl.classList.remove('selected');
                selectedEl.classList.add('booked');
                selectedEl.onclick = null;
            }
            bookingSummary.style.display = 'none';
            selectedSlot = null;
        }
    }, 1500);
}

function showNotification(msg) {
    notification.textContent = msg;
    notification.classList.add('show');
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// Close modal on outside click
window.onclick = function (event) {
    if (event.target == paymentModal) {
        closePaymentModal();
    }
}
