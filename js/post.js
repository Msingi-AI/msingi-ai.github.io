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
    return `${getBaseUrl()}${path}`;
}

// Function to parse markdown frontmatter
function parseFrontMatter(markdown) {
    if (!markdown) {
        console.error('No markdown content provided');
        return null;
    }
    
    try {
        const match = markdown.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
        if (!match) {
            console.error('No frontmatter found in markdown');
            return { content: markdown };
        }

        const frontMatter = {};
        const frontMatterText = match[1];
        const lines = frontMatterText.split('\n');
        
        for (const line of lines) {
            const colonIndex = line.indexOf(':');
            if (colonIndex > 0) {
                const key = line.slice(0, colonIndex).trim();
                const value = line.slice(colonIndex + 1).trim();
                if (key && value) {
                    frontMatter[key] = value;
                }
            }
        }

        return {
            ...frontMatter,
            content: match[2].trim()
        };
    } catch (error) {
        console.error('Error parsing frontmatter:', error);
        return null;
    }
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
function createPostContent(postData) {
    if (!postData || !postData.title) {
        throw new Error('Invalid post data: missing title');
    }

    const formattedDate = formatDate(postData.date);
    
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
                    ${marked.parse(postData.content || '')}
                </div>
                <div class="mt-8 pt-8 border-t border-gray-200">
                    <a href="${getBaseUrl()}/blog.html" class="text-indigo-600 hover:text-indigo-700">
                        ← Back to Blog
                    </a>
                </div>
            </div>
        </article>
    `;
}

// Function to show error message
function showError(container, message) {
    container.innerHTML = `
        <div class="text-center py-12">
            <p class="text-red-600">${message}</p>
            <a href="${getBaseUrl()}/blog.html" class="mt-4 inline-block px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">
                Back to Blog
            </a>
        </div>
    `;
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

        console.log('Fetching post:', postFilename);
        const response = await fetch(getAssetUrl(`/posts/${postFilename}`));
        
        if (!response.ok) {
            throw new Error(`Failed to fetch post: ${response.status}`);
        }
        
        const markdown = await response.text();
        console.log('Markdown content:', markdown.substring(0, 100) + '...');
        
        const postData = parseFrontMatter(markdown);
        console.log('Parsed post data:', postData);
        
        if (!postData || !postData.title) {
            throw new Error('Failed to parse post content');
        }

        // Update page title
        document.title = `${postData.title} - Msingi AI Blog`;
        
        // Display post content
        postContainer.innerHTML = createPostContent(postData);
        
        // Update URL to include post title as hash
        if (postData.title) {
            const titleSlug = postData.title
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '');
            history.replaceState(null, '', `?post=${postFilename}#${titleSlug}`);
        }
        
    } catch (error) {
        console.error('Error loading post:', error);
        showError(postContainer, error.message || 'Error loading post. Please try again.');
    }
}

// Initialize marked with options when the page loads
window.addEventListener('load', function() {
    if (typeof marked !== 'undefined') {
        marked.use({
            breaks: true,
            gfm: true
        });
        console.log('Marked.js initialized with options');
    } else {
        console.error('Marked.js not loaded');
    }
});

// Load post when the page loads
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing post system...');
    loadPost();
});
