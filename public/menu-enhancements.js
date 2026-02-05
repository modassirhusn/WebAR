// ========== MENU ENHANCEMENT SCRIPT ==========
// Adds order status bars and veg/non-veg badges to menu items

// Sample order status data (you can customize these values)
const ORDER_STATUS_DATA = {
    'butter-chicken': { status: 95, isVeg: false },
    'paneer-tikka': { status: 88, isVeg: true },
    'dal-makhani': { status: 72, isVeg: true },
    'garlic-naan': { status: 85, isVeg: true },
    'veg-biryani': { status: 78, isVeg: true },
    'hakka-noodles': { status: 65, isVeg: true },
    'veg-manchurian': { status: 58, isVeg: true },
    'chilli-chicken': { status: 82, isVeg: false },
    'dim-sums': { status: 70, isVeg: true },
    'spring-rolls': { status: 62, isVeg: true },
    'masala-dosa': { status: 90, isVeg: true },
    'idli-sambhar': { status: 75, isVeg: true },
    'medu-vada': { status: 68, isVeg: true },
    'onion-uttapam': { status: 55, isVeg: true },
    'lemon-rice': { status: 48, isVeg: true },
    'gulab-jamun': { status: 92, isVeg: true },
    'rasmalai': { status: 86, isVeg: true },
    'kulfi': { status: 80, isVeg: true },
    'brownie': { status: 73, isVeg: true },
    'ice-cream': { status: 88, isVeg: true }
};

// Add enhancements to menu cards
function enhanceMenuCards() {
    const foodCards = document.querySelectorAll('.food-card');

    foodCards.forEach(card => {
        const dishId = card.getAttribute('onclick')?.match(/'([^']+)'/)?.[1];
        if (!dishId || !ORDER_STATUS_DATA[dishId]) return;

        const data = ORDER_STATUS_DATA[dishId];

        // Add veg/non-veg badge
        if (!card.querySelector('.food-type-badge')) {
            const badge = document.createElement('div');
            badge.className = `food-type-badge ${data.isVeg ? 'veg' : 'non-veg'}`;
            card.style.position = 'relative';
            card.appendChild(badge);
        }

        // Add order status bar
        if (!card.querySelector('.order-status')) {
            const dishName = card.querySelector('h3');
            if (dishName) {
                const statusDiv = document.createElement('div');
                statusDiv.className = 'order-status';

                const statusClass = data.status >= 80 ? 'high' : data.status >= 50 ? 'medium' : 'low';

                statusDiv.innerHTML = `
                    <span class="order-status-label">Popularity</span>
                    <div class="status-bar-container">
                        <div class="status-bar-fill ${statusClass}" style="width: ${data.status}%"></div>
                    </div>
                `;

                dishName.parentNode.insertBefore(statusDiv, dishName.nextSibling);
            }
        }
    });
}

// Run on page load and after menu updates
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(enhanceMenuCards, 500);
});

// Re-run when menu is shown
const originalShowSection = window.showSection;
if (originalShowSection) {
    window.showSection = function (sectionId) {
        originalShowSection(sectionId);
        if (sectionId === 'menu-screen') {
            setTimeout(enhanceMenuCards, 100);
        }
    };
}

// Export for manual triggering
window.enhanceMenuCards = enhanceMenuCards;
