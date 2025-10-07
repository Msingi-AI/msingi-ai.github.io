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
    
    // Determine category and color
    const category = post.category || 'Research';
    const categoryColors = {
        'Research': 'bg-indigo-100 text-indigo-800',
        'Tutorial': 'bg-purple-100 text-purple-800',
        'Case Study': 'bg-green-100 text-green-800',
        'Announcement': 'bg-orange-100 text-orange-800'
    };
    const categoryColor = categoryColors[category] || 'bg-indigo-100 text-indigo-800';
    
    return `
        <article class="bg-white rounded-2xl border border-gray-200/50 overflow-hidden hover:shadow-lg hover:border-indigo-200 transition-all duration-300 group">
            <a href="${postUrl}" class="block">
                <div class="flex flex-col lg:flex-row">
                    <!-- Content Section -->
                    <div class="flex-1 p-8">
                        <!-- Header with Category and Date -->
                        <div class="flex items-center justify-between mb-4">
                            <div class="inline-flex items-center px-3 py-1 text-sm font-semibold ${categoryColor} rounded-full">
                                ${category}
                            </div>
                            <time class="text-sm text-gray-500 font-medium" datetime="${post.date}">${formattedDate}</time>
                        </div>
                        
                        <!-- Title -->
                        <h2 class="text-2xl font-bold text-gray-900 mb-4 group-hover:text-indigo-600 transition-colors leading-tight">
                            ${post.title}
                        </h2>
                        
                        <!-- Excerpt -->
                        <p class="text-gray-600 leading-relaxed mb-6 text-base line-clamp-2">
                            ${post.excerpt}
                        </p>
                        
                        <!-- Author and CTA -->
                        <div class="flex items-center justify-between">
                            <div class="flex items-center space-x-3">
                                <div class="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                                    <span class="text-white font-bold text-xs">${post.author.charAt(0)}</span>
                                </div>
                                <div>
                                    <p class="text-sm font-semibold text-gray-900">${post.author}</p>
                                </div>
                            </div>
                            <div class="inline-flex items-center text-indigo-600 group-hover:text-indigo-700 transition-colors text-sm font-semibold">
                                Read Article
                                <svg class="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                                </svg>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Visual Element -->
                    <div class="w-full lg:w-64 bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center lg:border-l border-gray-100">
                        <div class="text-center p-6">
                            <div class="w-16 h-16 bg-indigo-600 rounded-2xl mx-auto mb-3 flex items-center justify-center">
                                <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                                </svg>
                            </div>
                            <p class="text-indigo-600 font-medium text-sm">Research Article</p>
                        </div>
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