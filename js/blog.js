// Function to get base URL for assets
function getBaseUrl() {
    if (window.location.hostname.includes('github.io')) {
        return '/msingi-ai.github.io';
    }
    return '';
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
    const postUrl = `${getBaseUrl()}/posts/${post.url}`;
    
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
function showError(container, message) {
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
    console.log('Starting to load blog posts...');
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
        console.log('Fetching posts data...');
        const response = await fetch(`${getBaseUrl()}/posts.json`);
        
        if (!response.ok) {
            throw new Error(`Failed to fetch posts: ${response.status}`);
        }
        
        const posts = await response.json();
        console.log('Posts data:', posts);

        if (!posts || posts.length === 0) {
            console.log('No posts found');
            postsContainer.innerHTML = '<p class="text-center text-gray-600 py-12">No blog posts available.</p>';
            return;
        }

        // Clear container and create grid for post cards
        postsContainer.innerHTML = '<div class="grid gap-8 md:grid-cols-2 lg:grid-cols-2"></div>';
        const grid = postsContainer.firstChild;

        // Create post cards
        posts.forEach(post => {
            console.log('Creating post card for:', post.title);
            grid.innerHTML += createPostCard(post);
        });
    } catch (error) {
        console.error('Error loading blog posts:', error);
        showError(postsContainer, 'Error loading blog posts. Please try again.');
    }
}

// Load posts when the page loads
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing blog system...');
    loadBlogPosts();
});
