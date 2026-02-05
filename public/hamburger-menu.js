// ========== HAMBURGER MENU FUNCTIONS ==========
let currentPage = 'scanner';

function toggleMenu() {
    const menu = document.getElementById('slide-menu');
    menu.classList.toggle('active');
}

function navigateTo(page) {
    // Close menu
    toggleMenu();

    // Update current page
    currentPage = page;

    // Update active button
    document.querySelectorAll('.menu-links button').forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-page') === page) {
            btn.classList.add('active');
        }
    });

    // Navigate to page
    if (page === 'scanner') {
        showScanner();
    } else {
        showSection(page);
    }
}

// Update showSection to track current page
const originalShowSection = showSection;
showSection = function (sectionId) {
    currentPage = sectionId;

    // Update active button
    document.querySelectorAll('.menu-links button').forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-page') === sectionId) {
            btn.classList.add('active');
        }
    });

    originalShowSection(sectionId);
};
