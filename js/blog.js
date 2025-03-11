// Function to get base URL for GitHub Pages or local development
function getBaseUrl() {
    const isGitHubPages = window.location.hostname.includes('github.io');
    return isGitHubPages ? '/msingi-ai.github.io' : '';
}

// Function to format date
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

// Function to create a post card
function createPostCard(post) {
    const baseUrl = getBaseUrl();
    const card = document.createElement('div');
    card.className = 'bg-white rounded-xl shadow-md overflow-hidden transform transition duration-300 hover:shadow-xl hover:-translate-y-1';
    
    card.innerHTML = `
        <a href="${baseUrl}/post.html?post=${post.filename}" class="block">
            <div class="p-6">
                <div class="uppercase tracking-wide text-sm text-indigo-600 font-semibold">${post.category || 'Research'}</div>
                <h3 class="mt-2 text-xl font-semibold text-gray-900">${post.title}</h3>
                <p class="mt-3 text-base text-gray-500">${post.description || 'Click to read more about this exciting update from Msingi AI.'}</p>
                <div class="mt-4 flex items-center">
                    <div class="flex-shrink-0">
                        <span class="sr-only">${post.author}</span>
                        <div class="h-10 w-10 rounded-full bg-indigo-600 flex items-center justify-center">
                            <span class="text-white font-semibold">${post.author ? post.author[0] : 'M'}</span>
                        </div>
                    </div>
                    <div class="ml-3">
                        <p class="text-sm font-medium text-gray-900">${post.author || 'Msingi AI Team'}</p>
                        <div class="flex space-x-1 text-sm text-gray-500">
                            <time datetime="${post.date}">${formatDate(post.date)}</time>
                            <span aria-hidden="true">&middot;</span>
                            <span>${post.readTime || '5 min read'}</span>
                        </div>
                    </div>
                </div>
            </div>
        </a>
    `;
    
    return card;
}

// Function to load blog posts
async function loadBlogPosts() {
    try {
        const baseUrl = getBaseUrl();
        const response = await fetch(`${baseUrl}/posts/index.json`);
        if (!response.ok) throw new Error('Failed to fetch posts index');
        
        const posts = await response.json();
        const blogPostsContainer = document.getElementById('blog-posts');
        
        // Clear loading state
        blogPostsContainer.innerHTML = '';
        
        // Sort posts by date (newest first)
        posts.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        // Create and append post cards
        posts.forEach(post => {
            const card = createPostCard(post);
            blogPostsContainer.appendChild(card);
        });
    } catch (error) {
        console.error('Error loading blog posts:', error);
        const blogPostsContainer = document.getElementById('blog-posts');
        blogPostsContainer.innerHTML = `
            <div class="text-center py-12 col-span-full">
                <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                </svg>
                <h3 class="mt-2 text-sm font-medium text-gray-900">Error Loading Posts</h3>
                <p class="mt-1 text-sm text-gray-500">Please try refreshing the page.</p>
            </div>
        `;
    }
}

// Load posts when the DOM is ready
document.addEventListener('DOMContentLoaded', loadBlogPosts);
