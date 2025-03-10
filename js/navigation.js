// Function to get base URL for assets
function getBaseUrl() {
    const hostname = window.location.hostname;
    return hostname.includes('github.io') ? '/msingi-ai.github.io' : '';
}

// Function to get asset URL
function getAssetUrl(path) {
    const base = getBaseUrl();
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `${base}${cleanPath}`.replace(/([^:]\/)\/+/g, '$1');
}

// Function to update navigation paths
function updateNavigationPaths() {
    // Update all navigation links
    document.querySelectorAll('nav a').forEach(link => {
        const href = link.getAttribute('href');
        if (href && !href.startsWith('http')) {
            const cleanHref = href.startsWith('/') ? href : `/${href}`;
            link.href = cleanHref;
        }
    });

    // Update logo link
    const logoLink = document.querySelector('.logo-link');
    if (logoLink) {
        logoLink.href = 'index.html';
    }
}

// Initialize when the page loads
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing navigation...');
    updateNavigationPaths();
});
