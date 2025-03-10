// Function to fetch and parse markdown content
async function fetchMarkdownPost(filename) {
    try {
        const response = await fetch(`/posts/${filename}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch ${filename}`);
        }
        const text = await response.text();
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
    if (!match) return { content: markdown };

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
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
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
    const postsContainer = document.getElementById('blog-posts');
    const loadingElement = document.getElementById('loading');
    
    if (!postsContainer) return;

    try {
        const response = await fetch('/posts/index.json');
        if (!response.ok) {
            throw new Error('Failed to fetch posts index');
        }
        
        const data = await response.json();
        const posts = data.posts || [];
        
        // Clear loading message
        if (loadingElement) {
            loadingElement.remove();
        }

        if (posts.length === 0) {
            postsContainer.innerHTML = '<p class="text-center text-gray-600">No blog posts available.</p>';
            return;
        }

        for (const post of posts) {
            const markdown = await fetchMarkdownPost(post.filename);
            if (!markdown) continue;

            const postData = parseFrontMatter(markdown);
            if (!postData) continue;

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
document.addEventListener('DOMContentLoaded', loadBlogPosts);
