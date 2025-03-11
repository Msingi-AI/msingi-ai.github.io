// Function to get base URL for navigation
function getBaseUrl() {
    // Check if we're on GitHub Pages or localhost
    if (window.location.hostname.includes('github.io')) {
        return '/msingi-ai.github.io';
    } else if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        return '';
    }
    return '';
}

// Function to handle logo click
function handleLogoClick(event) {
    event.preventDefault();
    window.location.href = `${getBaseUrl()}/`;
}

// Add click event listener to logo when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const logoLink = document.querySelector('.logo-link');
    if (logoLink) {
        logoLink.addEventListener('click', handleLogoClick);
    }
});
