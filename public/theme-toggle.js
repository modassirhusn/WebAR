// ========== THEME TOGGLE ==========
let isDarkMode = true; // Default to night mode

function toggleTheme() {
    isDarkMode = !isDarkMode;
    document.body.classList.toggle('day-theme', !isDarkMode);

    // Update toggle button icon
    const toggleBtn = document.getElementById('theme-toggle');
    if (toggleBtn) {
        toggleBtn.textContent = isDarkMode ? '☀️' : '🌙';
    }

    // Save preference
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
}

// Load saved theme on startup
document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        isDarkMode = false;
        document.body.classList.add('day-theme');
        const toggleBtn = document.getElementById('theme-toggle');
        if (toggleBtn) toggleBtn.textContent = '🌙';
    }
});

// Export for use in HTML
window.toggleTheme = toggleTheme;
