// Function to get base URL for assets
function getBaseUrl() {
    // Check if we're on GitHub Pages or localhost
    const hostname = window.location.hostname;
    if (hostname.includes('github.io')) {
        return '/msingi-ai.github.io';
    }
    return '';
}

// Function to get asset URL
function getAssetUrl(path) {
    // Ensure path starts with a forward slash
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `${getBaseUrl()}${cleanPath}`;
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

// Function to create post HTML
function createPostContent(postData, markdown) {
    if (!postData || !postData.title) {
        throw new Error('Invalid post data: missing title');
    }

    try {
        const formattedDate = formatDate(postData.date);
        
        // Initialize marked with options if not already done
        if (typeof marked !== 'undefined') {
            marked.use({
                breaks: true,
                gfm: true,
                headerIds: true,
                mangle: false
            });
        } else {
            console.error('marked library not loaded');
            throw new Error('Markdown parser not available');
        }
        
        return `
            <article class="bg-white rounded-lg shadow-lg overflow-hidden">
                <div class="p-8">
                    <div class="mb-8">
                        <h1 class="text-4xl font-bold text-gray-900 mb-4">${postData.title}</h1>
                        <div class="flex items-center text-gray-600">
                            <span class="mr-4">By ${postData.author || 'Unknown'}</span>
                            <time datetime="${postData.date || ''}">${formattedDate}</time>
                        </div>
                    </div>
                    <div class="prose prose-indigo max-w-none">
                        ${marked.parse(markdown || '')}
                    </div>
                    <div class="mt-8 pt-8 border-t border-gray-200">
                        <a href="${getAssetUrl('blog.html')}" class="text-indigo-600 hover:text-indigo-700">
                            ← Back to Blog
                        </a>
                    </div>
                </div>
            </article>
        `;
    } catch (error) {
        console.error('Error creating post content:', error);
        throw error;
    }
}

// Function to show error message
function showError(container, message) {
    container.innerHTML = `
        <div class="text-center py-12">
            <p class="text-red-600">${message}</p>
            <a href="${getAssetUrl('blog.html')}" class="mt-4 inline-block px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">
                Back to Blog
            </a>
        </div>
    `;
}

// Function to fetch post data from index.json
async function fetchPostData(filename) {
    try {
        const indexUrl = getAssetUrl('posts/index.json');
        console.log('Fetching index:', indexUrl);
        const response = await fetch(indexUrl);
        
        if (!response.ok) {
            throw new Error(`Failed to fetch index: ${response.status}`);
        }
        
        const data = await response.json();
        const post = data.posts.find(p => p.filename === filename);
        
        if (!post) {
            throw new Error(`Post not found: ${filename}`);
        }
        
        return post;
    } catch (error) {
        console.error('Error fetching post data:', error);
        throw error;
    }
}

// Function to fetch markdown content
async function fetchMarkdownContent(filename) {
    try {
        const url = getAssetUrl(`posts/${filename}`);
        console.log('Fetching markdown:', url);
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`Failed to fetch markdown: ${response.status}`);
        }
        
        const text = await response.text();
        if (!text.trim()) {
            throw new Error('Empty markdown content');
        }
        
        // Remove frontmatter
        const content = text.replace(/^---\n[\s\S]*?\n---\n/, '').trim();
        return content;
    } catch (error) {
        console.error('Error fetching markdown:', error);
        throw error;
    }
}

// Function to load and display post
async function loadPost() {
    console.log('Starting to load post...');
    const postContainer = document.getElementById('post-content');
    
    if (!postContainer) {
        console.error('Post container not found');
        return;
    }

    try {
        // Get post filename from URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        const postFilename = urlParams.get('post');
        
        if (!postFilename) {
            throw new Error('No post specified');
        }

        // Fetch post data and markdown content in parallel
        console.log('Fetching post data and content...');
        const [postData, markdown] = await Promise.all([
            fetchPostData(postFilename),
            fetchMarkdownContent(postFilename)
        ]);

        // Update page title
        document.title = `${postData.title} - Msingi AI Blog`;
        
        // Display post content
        console.log('Creating post content...');
        postContainer.innerHTML = createPostContent(postData, markdown);
        
    } catch (error) {
        console.error('Error loading post:', error);
        showError(postContainer, error.message || 'Error loading post. Please try again.');
    }
}

// Initialize when the page loads
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing post system...');
    loadPost();
});
