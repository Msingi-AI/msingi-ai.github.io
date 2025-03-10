// Function to get base URL for assets
function getBaseUrl() {
    // Check if we're on GitHub Pages
    const isGitHubPages = window.location.hostname.includes('github.io');
    return isGitHubPages ? '/msingi-ai.github.io' : '';
}

// Function to get asset URL
function getAssetUrl(path) {
    return `${getBaseUrl()}${path}`;
}

// Function to fetch and parse markdown content
async function fetchMarkdownPost(filename) {
    try {
        console.log('Fetching markdown file:', filename);
        const response = await fetch(getAssetUrl(`/posts/${filename}`));
        if (!response.ok) {
            throw new Error(`Failed to fetch ${filename}: ${response.status}`);
        }
        const text = await response.text();
        console.log('Successfully fetched markdown:', filename);
        return text;
    } catch (error) {
        console.error('Error fetching markdown:', error);
        return null;
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
function createPostElement(postData) {
    const article = document.createElement('article');
    article.className = 'bg-white rounded-lg shadow-lg overflow-hidden';
    
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
                <h2 class="text-xl font-bold text-gray-900">${postData.title}</h2>
                <p class="mt-1 text-sm text-gray-600">By ${postData.author}</p>
            </div>
            <div class="mt-6 prose prose-indigo">${marked.parse(postData.content)}</div>
        </div>
    `;
    
    return article;
}

// Function to load and display blog posts
async function loadBlogPosts() {
    console.log('Starting to load blog posts...');
    const postsContainer = document.getElementById('blog-posts');
    const loadingElement = document.getElementById('loading');
    
    if (!postsContainer) {
        console.error('Blog posts container not found');
        return;
    }

    try {
        console.log('Fetching posts index...');
        const response = await fetch(getAssetUrl('/posts/index.json'));
        if (!response.ok) {
            throw new Error(`Failed to fetch posts index: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Posts index data:', data);
        const posts = data.posts || [];
        
        // Clear loading message
        if (loadingElement) {
            loadingElement.remove();
        }

        if (posts.length === 0) {
            console.log('No posts found in index');
            postsContainer.innerHTML = '<p class="text-center text-gray-600">No blog posts available.</p>';
            return;
        }

        for (const post of posts) {
            console.log('Processing post:', post.filename);
            const markdown = await fetchMarkdownPost(post.filename);
            if (!markdown) {
                console.error('Failed to load markdown for:', post.filename);
                continue;
            }

            const postData = parseFrontMatter(markdown);
            if (!postData) {
                console.error('Failed to parse frontmatter for:', post.filename);
                continue;
            }

            console.log('Creating post element for:', post.filename);
            const postElement = createPostElement(postData);
            postsContainer.appendChild(postElement);
        }
    } catch (error) {
        console.error('Error loading blog posts:', error);
        if (loadingElement) {
            loadingElement.textContent = 'Error loading blog posts. Please try again later.';
            loadingElement.className = 'text-center text-red-600';
        }
    }
}

// Load posts when the page loads
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing blog system...');
    loadBlogPosts();
});
