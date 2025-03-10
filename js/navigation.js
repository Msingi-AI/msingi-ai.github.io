// Function to get base URL for assets
function getBaseUrl() {
    return window.location.hostname.includes('github.io') ? '/msingi-ai.github.io' : '';
}

// Function to get asset URL
function getAssetUrl(path) {
    const base = getBaseUrl();
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `${base}${cleanPath}`;
}

// Function to update navigation links
function updateNavigationLinks() {
    // Update all navigation links
    document.querySelectorAll('nav a').forEach(link => {
        const href = link.getAttribute('href');
        if (href && href.startsWith('/')) {
            link.href = getAssetUrl(href);
        }
    });

    // Update logo link
    const logoLink = document.querySelector('.logo-link');
    if (logoLink) {
        logoLink.href = getAssetUrl('/');
    }
}

// Initialize when the page loads
document.addEventListener('DOMContentLoaded', () => {
    console.log('Initializing navigation...');
    updateNavigationLinks();
});
