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

// Function to parse markdown frontmatter
function parseFrontMatter(markdown) {
    const match = markdown.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
    if (!match) return { content: markdown };

    const frontMatter = {};
    const frontMatterText = match[1];
    const content = match[2];

    frontMatterText.split('\n').forEach(line => {
        const [key, ...valueParts] = line.split(':');
        if (key && valueParts.length) {
            frontMatter[key.trim()] = valueParts.join(':').trim();
        }
    });

    return {
        ...frontMatter,
        content: content.trim()
    };
}

// Function to create post HTML
function createPostHTML(postData) {
    const { title, author, date, content } = postData;
    
    return `
        <article class="prose prose-indigo lg:prose-lg mx-auto">
            <header class="mb-8">
                <h1 class="text-4xl font-bold text-gray-900 mb-4">${title || 'Untitled Post'}</h1>
                <div class="flex items-center space-x-4">
                    <div class="flex-shrink-0">
                        <div class="h-10 w-10 rounded-full bg-indigo-600 flex items-center justify-center">
                            <span class="text-white font-semibold">${author ? author[0] : 'M'}</span>
                        </div>
                    </div>
                    <div>
                        <p class="text-sm font-medium text-gray-900">${author || 'Msingi AI Team'}</p>
                        <time class="text-sm text-gray-500" datetime="${date}">${formatDate(date)}</time>
                    </div>
                </div>
            </header>
            <div class="markdown-content">
                ${marked(content)}
            </div>
            <footer class="mt-12 pt-6 border-t border-gray-200">
                <a href="/blog.html" class="inline-flex items-center text-indigo-600 hover:text-indigo-700">
                    <svg class="mr-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16l-4-4m0 0l4-4m-4 4h18"/>
                    </svg>
                    Back to Blog
                </a>
            </footer>
        </article>
    `;
}

// Function to load and display post
async function loadPost() {
    const postContainer = document.getElementById('post-content');
    if (!postContainer) return;

    try {
        // Get post filename from URL
        const urlParams = new URLSearchParams(window.location.search);
        const postFilename = urlParams.get('post');
        if (!postFilename) throw new Error('No post specified');

        // Fetch post content
        const baseUrl = getBaseUrl();
        const response = await fetch(`${baseUrl}/posts/${postFilename}`);
        if (!response.ok) throw new Error('Failed to fetch post');
        
        const markdown = await response.text();
        const postData = parseFrontMatter(markdown);
        
        // Update page title
        document.title = `${postData.title || 'Blog Post'} - Msingi AI`;
        
        // Render post
        postContainer.innerHTML = createPostHTML(postData);
        
        // Fix relative URLs in content
        const links = postContainer.getElementsByTagName('a');
        Array.from(links).forEach(link => {
            if (link.href.startsWith(window.location.origin)) {
                link.href = `${baseUrl}${link.pathname}`;
            }
        });
        
        // Fix relative image URLs
        const images = postContainer.getElementsByTagName('img');
        Array.from(images).forEach(img => {
            if (!img.src.startsWith('http')) {
                img.src = `${baseUrl}${img.getAttribute('src')}`;
            }
        });

    } catch (error) {
        console.error('Error loading post:', error);
        postContainer.innerHTML = `
            <div class="text-center py-12">
                <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                </svg>
                <h3 class="mt-2 text-sm font-medium text-gray-900">Error Loading Post</h3>
                <p class="mt-1 text-sm text-gray-500">The post could not be loaded. Please try again later.</p>
                <div class="mt-6">
                    <a href="/blog.html" class="text-indigo-600 hover:text-indigo-700">
                        Return to Blog
                    </a>
                </div>
            </div>
        `;
    }
}

// Load post when the DOM is ready
document.addEventListener('DOMContentLoaded', loadPost);
