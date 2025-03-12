// Debug flag
const DEBUG = true;

// Function to log debug messages
function debug(...args) {
    if (DEBUG) {
        console.log('[Blog Debug]:', ...args);
    }
}

// Function to get base URL for assets
function getBaseUrl() {
    const hostname = window.location.hostname;
    debug('Current hostname:', hostname);
    
    // Check if we're on GitHub Pages
    if (hostname.includes('github.io')) {
        debug('Using GitHub Pages base URL');
        return '/msingi-ai.github.io';
    }
    
    debug('Using local development base URL');
    return '';
}

// Function to get asset URL with proper path handling
function getAssetUrl(path) {
    const baseUrl = getBaseUrl();
    const cleanPath = path.startsWith('/') ? path.substring(1) : path;
    const fullUrl = `${baseUrl}${baseUrl && !cleanPath.startsWith('/') ? '/' : ''}${cleanPath}`;
    debug('Generated URL:', fullUrl);
    return fullUrl;
}

// Function to format date
function formatDate(dateString) {
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    } catch (error) {
        console.error('Error formatting date:', error);
        return dateString;
    }
}

// Function to create post card HTML
function createPostCard(post) {
    const formattedDate = formatDate(post.date);
    const htmlFilename = post.filename.replace('.md', '.html');
    const postUrl = getAssetUrl(`posts/html/${htmlFilename}`);
    debug('Creating post card with URL:', postUrl);
    
    return `
        <article class="bg-white rounded-lg shadow-lg overflow-hidden transform transition duration-300 hover:shadow-xl hover:-translate-y-1" data-aos="fade-up">
            <a href="${postUrl}" class="block">
                <div class="p-6">
                    <div class="flex items-center text-sm text-gray-600 mb-4">
                        <time datetime="${post.date}">${formattedDate}</time>
                        <span class="mx-2">·</span>
                        <span>By ${post.author}</span>
                    </div>
                    <h2 class="text-xl font-bold text-gray-900 mb-3 hover:text-indigo-600 transition-colors">
                        ${post.title}
                    </h2>
                    <p class="text-gray-600 line-clamp-3">
                        ${post.excerpt}
                    </p>
                    <div class="mt-4">
                        <span class="inline-flex items-center text-indigo-600 hover:text-indigo-700">
                            Read more
                            <svg class="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                            </svg>
                        </span>
                    </div>
                </div>
            </a>
        </article>
    `;
}

// Function to show error message
function showError(container, message, error = null) {
    if (error) {
        debug('Error details:', error);
    }
    container.innerHTML = `
        <div class="text-center py-12">
            <p class="text-red-600">${message}</p>
            <button onclick="loadBlogPosts()" class="mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">
                Try Again
            </button>
        </div>
    `;
}

// Function to load and display blog posts
async function loadBlogPosts() {
    debug('Starting to load blog posts...');
    const postsContainer = document.getElementById('blog-posts');
    
    if (!postsContainer) {
        console.error('Blog posts container not found');
        return;
    }

    // Show loading state
    postsContainer.innerHTML = `
        <div class="text-center py-12">
            <div class="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
            <p class="mt-4 text-gray-600">Loading blog posts...</p>
        </div>
    `;

    try {
        debug('Fetching posts index...');
        const indexUrl = getAssetUrl('posts/index.json');
        debug('Index URL:', indexUrl);
        
        const response = await fetch(indexUrl);
        debug('Response status:', response.status);
        
        if (!response.ok) {
            throw new Error(`Failed to fetch posts index: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        debug('Posts index data:', data);
        const posts = data.posts || [];

        if (posts.length === 0) {
            debug('No posts found in index');
            postsContainer.innerHTML = '<p class="text-center text-gray-600 py-12">No blog posts available.</p>';
            return;
        }

        // Filter out the featured post
        const regularPosts = posts.filter(post => post.filename !== 'funding-announcement.md');

        // Clear container and create grid for post cards
        postsContainer.innerHTML = '<div class="grid gap-8 md:grid-cols-2 lg:grid-cols-2"></div>';
        const grid = postsContainer.firstChild;

        // Create post cards for regular posts
        regularPosts.forEach(post => {
            debug('Creating post card for:', post.filename);
            grid.innerHTML += createPostCard(post);
        });
        
        debug('Successfully loaded all blog posts');
    } catch (error) {
        console.error('Error loading blog posts:', error);
        showError(postsContainer, `Error loading blog posts: ${error.message}`);
    }
}

// Initialize AOS
document.addEventListener('DOMContentLoaded', () => {
    debug('DOM loaded, initializing blog system...');
    AOS.init({
        duration: 800,
        once: true,
        offset: 100
    });
    loadBlogPosts();
});