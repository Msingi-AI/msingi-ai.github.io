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
function createPostCard(postData, filename) {
    if (!postData || !postData.title) {
        console.error('Invalid post data:', postData);
        return '';
    }

    try {
        const formattedDate = formatDate(postData.date);
        const postUrl = `post.html?post=${encodeURIComponent(filename)}`;
        
        return `
            <article class="bg-white rounded-lg shadow-lg overflow-hidden transform transition duration-300 hover:shadow-xl hover:-translate-y-1">
                <a href="${postUrl}" class="block">
                    <div class="p-6">
                        <div class="flex items-center text-sm text-gray-600 mb-4">
                            <time datetime="${postData.date || ''}">${formattedDate}</time>
                            <span class="mx-2">·</span>
                            <span>By ${postData.author || 'Unknown'}</span>
                        </div>
                        <h2 class="text-xl font-bold text-gray-900 mb-3 hover:text-indigo-600">
                            ${postData.title}
                        </h2>
                        <p class="text-gray-600 line-clamp-3">
                            ${postData.excerpt || ''}
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
    } catch (error) {
        console.error('Error creating post card:', error);
        return '';
    }
}

// Function to show error message
function showError(container, message) {
    container.innerHTML = `
        <div class="text-center py-12">
            <p class="text-red-600 mb-4">${message}</p>
            <button onclick="loadBlogPosts()" class="inline-block px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">
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
        // Fetch posts index
        console.log('Fetching posts index...');
        const indexPath = 'posts/index.json';
        console.log('Index path:', indexPath);
        
        const response = await fetch(indexPath);
        console.log('Response status:', response.status);
        
        if (!response.ok) {
            throw new Error(`Failed to fetch posts index: ${response.status} ${response.statusText}`);
        }

        let data;
        try {
            data = await response.json();
        } catch (error) {
            console.error('JSON parse error:', error);
            throw new Error('Failed to parse posts index as JSON');
        }

        console.log('Posts index data:', data);
        
        const posts = data.posts || [];
        if (posts.length === 0) {
            console.log('No posts found in index');
            postsContainer.innerHTML = '<p class="text-center text-gray-600 py-12">No blog posts available.</p>';
            return;
        }

        // Create grid for post cards
        postsContainer.innerHTML = '<div class="grid gap-8 md:grid-cols-2 lg:grid-cols-2"></div>';
        const grid = postsContainer.firstChild;

        // Process each post
        let successfulPosts = 0;
        for (const post of posts) {
            try {
                if (!post || !post.filename) {
                    console.error('Invalid post data in index:', post);
                    continue;
                }

                const postCard = createPostCard(post, post.filename);
                if (postCard) {
                    grid.innerHTML += postCard;
                    successfulPosts++;
                }
            } catch (error) {
                console.error(`Error processing post ${post?.filename}:`, error);
                continue;
            }
        }

        // Show error if no posts could be loaded
        if (successfulPosts === 0) {
            throw new Error('No posts could be loaded successfully');
        }

    } catch (error) {
        console.error('Error loading blog posts:', error);
        showError(postsContainer, `Error loading blog posts: ${error.message}`);
    }
}

// Initialize when the page loads
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing blog system...');
    loadBlogPosts();
});
