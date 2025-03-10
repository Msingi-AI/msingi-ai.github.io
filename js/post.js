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

// Function to parse markdown frontmatter
function parseFrontmatter(markdown) {
    try {
        const match = markdown.match(/^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/);
        if (!match) {
            console.warn('No frontmatter found in markdown');
            return {
                metadata: {},
                content: markdown
            };
        }

        const [, frontmatter, content] = match;
        const metadata = {};
        const lines = frontmatter.split('\n');

        for (const line of lines) {
            const [key, ...valueParts] = line.split(':');
            if (key && valueParts.length > 0) {
                const value = valueParts.join(':').trim();
                metadata[key.trim()] = value;
            }
        }

        return {
            metadata,
            content: content.trim()
        };
    } catch (error) {
        console.error('Error parsing frontmatter:', error);
        return {
            metadata: {},
            content: markdown
        };
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

// Function to show error message
function showError(container, message) {
    container.innerHTML = `
        <div class="text-center py-12">
            <p class="text-red-600 mb-4">${message}</p>
            <button onclick="window.location.href='blog.html'" class="inline-block px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">
                Back to Blog
            </button>
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
        // Get post filename from URL
        const urlParams = new URLSearchParams(window.location.search);
        const postFilename = urlParams.get('post');
        
        if (!postFilename) {
            throw new Error('No post specified');
        }

        // Fetch post content
        console.log('Fetching post:', postFilename);
        const postPath = `posts/${postFilename}`;
        console.log('Post path:', postPath);
        
        const response = await fetch(postPath);
        console.log('Response status:', response.status);

        if (!response.ok) {
            throw new Error(`Failed to fetch post: ${response.status} ${response.statusText}`);
        }

        const markdown = await response.text();
        console.log('Markdown content length:', markdown.length);

        // Parse frontmatter and content
        const { metadata, content } = parseFrontmatter(markdown);
        console.log('Post metadata:', metadata);

        if (!metadata.title) {
            console.warn('No title found in post metadata');
        }

        // Update page title
        document.title = metadata.title ? `${metadata.title} - Msingi AI Blog` : 'Msingi AI Blog Post';

        // Render post content
        const formattedDate = formatDate(metadata.date);
        const html = `
            <article class="prose prose-lg mx-auto bg-white rounded-xl shadow-lg p-8 md:p-12">
                <header class="mb-8">
                    <h1 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        ${metadata.title || 'Untitled Post'}
                    </h1>
                    <div class="flex items-center text-gray-600">
                        <time datetime="${metadata.date || ''}">${formattedDate}</time>
                        ${metadata.author ? `
                            <span class="mx-2">·</span>
                            <span>By ${metadata.author}</span>
                        ` : ''}
                        ${metadata.readingTime ? `
                            <span class="mx-2">·</span>
                            <span>${metadata.readingTime}</span>
                        ` : ''}
                    </div>
                </header>
                <div class="markdown-content">
                    ${marked(content)}
                </div>
                <footer class="mt-12 pt-8 border-t border-gray-200">
                    <button onclick="window.location.href='blog.html'" class="inline-flex items-center text-indigo-600 hover:text-indigo-700">
                        <svg class="mr-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
                        </svg>
                        Back to Blog
                    </button>
                </footer>
            </article>
        `;

        postContainer.innerHTML = html;

    } catch (error) {
        console.error('Error loading post:', error);
        showError(postContainer, `Error loading post: ${error.message}`);
    }
}

// Initialize when the page loads
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing post system...');
    // Initialize marked with options
    if (typeof marked !== 'undefined') {
        console.log('Configuring marked parser...');
        marked.use({
            breaks: true,
            gfm: true,
            headerIds: true,
            mangle: false
        });
    } else {
        console.error('marked library not loaded');
        const postContainer = document.getElementById('post-content');
        if (postContainer) {
            showError(postContainer, 'Markdown parser not available');
            return;
        }
    }
    loadPost();
});
