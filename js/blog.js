// Debug flag
const DEBUG = true;

// Verify script is loaded
console.log('Blog.js script loaded');

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
        return '';  // No need for prefix since we're at root
    }
    
    // For local development
    debug('Using local development base URL');
    return '';
}

// Function to get asset URL with proper path handling
function getAssetUrl(path) {
    const baseUrl = getBaseUrl();
    // Remove leading slash if path starts with one
    const cleanPath = path.startsWith('/') ? path.substring(1) : path;
    // Join base URL and clean path
    const fullUrl = baseUrl ? `${baseUrl}/${cleanPath}` : cleanPath;
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
        <article class="bg-white rounded-lg shadow-lg overflow-hidden transform transition duration-300 hover:shadow-xl hover:-translate-y-1">
            <a href="${postUrl}" class="block">
                <div class="p-6">
                    <div class="flex items-center text-sm text-gray-600 mb-4">
                        <time datetime="${post.date}">${formattedDate}</time>
                        <span class="mx-2">·</span>
                        <span>By ${post.author}</span>
                    </div>
                    <h2 class="text-xl font-bold text-gray-900 mb-3 hover:text-indigo-600">
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
        
        const response = await fetch(indexUrl, {
            headers: {
                'Accept': 'application/json'
            }
        });
        debug('Response status:', response.status);
        
        if (!response.ok) {
            throw new Error(`Failed to fetch posts index: ${response.status} ${response.statusText}`);
        }
        
        const text = await response.text();
        debug('Raw response:', text);
        
        let data;
        try {
            data = JSON.parse(text);
        } catch (e) {
            debug('JSON parse error:', e);
            throw new Error('Failed to parse posts index as JSON. Please check the file format.');
        }
        
        debug('Posts index data:', data);
        const posts = data.posts || [];

        if (posts.length === 0) {
            debug('No posts found in index');
            postsContainer.innerHTML = '<p class="text-center text-gray-600 py-12">No blog posts available.</p>';
            return;
        }

        // Sort posts by date in descending order (newest first)
        posts.sort((a, b) => {
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);
            return dateB - dateA; // Descending order
        });

        // Clear container and create grid for post cards
        postsContainer.innerHTML = '';
        postsContainer.innerHTML = '<div class="grid gap-8 md:grid-cols-2 lg:grid-cols-2"></div>';
        const grid = postsContainer.querySelector('.grid');

        // Create post cards directly from index.json data
        const postCards = posts.map(post => {
            debug('Creating post card for:', post.filename);
            return createPostCard(post);
        }).join('');
        
        grid.innerHTML = postCards;
        
        debug('Successfully loaded all blog posts');
    } catch (error) {
        console.error('Error loading blog posts:', error);
        showError(postsContainer, `Error loading blog posts: ${error.message}`);
    }
}

// Load posts when the page loads
document.addEventListener('DOMContentLoaded', () => {
    debug('DOM loaded, initializing blog system...');
    loadBlogPosts();
});