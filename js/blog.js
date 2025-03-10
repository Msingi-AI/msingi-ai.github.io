// Function to get base URL for assets
function getBaseUrl() {
    // Check if we're on GitHub Pages or localhost
    if (window.location.hostname.includes('github.io')) {
        return '/msingi-ai.github.io';
    } else if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        return '';
    }
    return '';
}

// Function to get asset URL
function getAssetUrl(path) {
    return `${getBaseUrl()}${path}`;
}

// Function to fetch and parse markdown content
async function fetchMarkdownPost(filename) {
    try {
        const url = getAssetUrl(`/posts/${filename}`);
        console.log('Fetching markdown file:', url);
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to fetch ${filename}: ${response.status}`);
        }
        const text = await response.text();
        console.log('Successfully fetched markdown:', filename);
        return text;
    } catch (error) {
        console.error('Error fetching markdown:', error);
        throw error;
    }
}

// Function to parse markdown frontmatter
function parseFrontMatter(markdown) {
    if (!markdown) return null;
    
    const match = markdown.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
    if (!match) {
        console.error('No frontmatter found in markdown');
        return { content: markdown };
    }

    const frontMatter = {};
    match[1].split('\n').forEach(line => {
        const [key, value] = line.split(': ');
        if (key && value) {
            frontMatter[key.trim()] = value.trim();
        }
    });

    return {
        ...frontMatter,
        content: match[2].trim()
    };
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
function createPostElement(postData, filename) {
    const article = document.createElement('article');
    article.className = 'bg-white rounded-lg shadow-lg overflow-hidden mb-8';
    article.id = filename.replace('.md', '');
    
    const formattedDate = formatDate(postData.date);
    
    article.innerHTML = `
        <div class="p-8">
            <div class="sm:flex sm:items-center sm:justify-between">
                <div class="sm:flex sm:items-center">
                    <p class="text-sm text-indigo-600">
                        <time datetime="${postData.date}">${formattedDate}</time>
                    </p>
                </div>
            </div>
            <div class="mt-4">
                <h2 class="text-2xl font-bold text-gray-900">${postData.title}</h2>
                <p class="mt-1 text-sm text-gray-600">By ${postData.author}</p>
            </div>
            <div class="mt-6 prose prose-indigo max-w-none">${marked.parse(postData.content)}</div>
        </div>
    `;
    
    return article;
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
        console.log('Fetching posts index...');
        const indexUrl = getAssetUrl('/posts/index.json');
        console.log('Index URL:', indexUrl);
        const response = await fetch(indexUrl);
        
        if (!response.ok) {
            throw new Error(`Failed to fetch posts index: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Posts index data:', data);
        const posts = data.posts || [];

        if (posts.length === 0) {
            console.log('No posts found in index');
            postsContainer.innerHTML = '<p class="text-center text-gray-600 py-12">No blog posts available.</p>';
            return;
        }

        // Clear container and load posts
        postsContainer.innerHTML = '';

        for (const post of posts) {
            try {
                console.log('Processing post:', post.filename);
                const markdown = await fetchMarkdownPost(post.filename);
                const postData = parseFrontMatter(markdown);
                
                if (!postData) {
                    console.error('Failed to parse frontmatter for:', post.filename);
                    continue;
                }

                console.log('Creating post element for:', post.filename);
                const postElement = createPostElement(postData, post.filename);
                postsContainer.appendChild(postElement);
            } catch (error) {
                console.error(`Error processing post ${post.filename}:`, error);
                // Continue with other posts if one fails
                continue;
            }
        }

        // If there's a hash in the URL, scroll to that post
        if (window.location.hash) {
            setTimeout(() => {
                const targetPost = document.querySelector(window.location.hash);
                if (targetPost) {
                    targetPost.scrollIntoView({ behavior: 'smooth' });
                }
            }, 100);
        }
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
