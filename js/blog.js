// Function to fetch and parse markdown content
async function fetchMarkdownPost(filename) {
    const response = await fetch(`/posts/${filename}`);
    const text = await response.text();
    return text;
}

// Function to parse markdown frontmatter
function parseFrontMatter(markdown) {
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
        content: match[2]
    };
}

// Function to convert markdown to HTML
function markdownToHtml(markdown) {
    // Basic markdown conversion (you can expand this or use a library like marked)
    return markdown
        .replace(/^# (.*$)/gm, '<h1>$1</h1>')
        .replace(/^## (.*$)/gm, '<h2>$1</h2>')
        .replace(/^### (.*$)/gm, '<h3>$1</h3>')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
        .replace(/\n\n/g, '</p><p>')
        .replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');
}

// Function to load and display blog posts
async function loadBlogPosts() {
    try {
        const response = await fetch('/posts/index.json');
        const posts = await response.json();
        
        const postsContainer = document.getElementById('blog-posts');
        if (!postsContainer) return;

        for (const post of posts) {
            const markdown = await fetchMarkdownPost(post.filename);
            const { title, date, author, excerpt, content } = parseFrontMatter(markdown);
            
            const postElement = document.createElement('article');
            postElement.className = 'flex flex-col bg-white rounded-lg shadow-lg overflow-hidden mb-10';
            postElement.innerHTML = `
                <div class="flex-1 p-6 flex flex-col justify-between">
                    <div class="flex-1">
                        <p class="text-sm font-medium text-indigo-600">
                            <time datetime="${date}">${new Date(date).toLocaleDateString()}</time>
                        </p>
                        <a href="#" class="block mt-2">
                            <p class="text-xl font-semibold text-gray-900">${title}</p>
                            <p class="mt-3 text-base text-gray-500">${excerpt || ''}</p>
                        </a>
                    </div>
                    <div class="mt-6">
                        <p class="text-sm font-medium text-gray-900">
                            By ${author}
                        </p>
                    </div>
                    <div class="mt-4 prose">${markdownToHtml(content)}</div>
                </div>
            `;
            
            postsContainer.appendChild(postElement);
        }
    } catch (error) {
        console.error('Error loading blog posts:', error);
    }
}

// Load posts when the page loads
document.addEventListener('DOMContentLoaded', loadBlogPosts);
