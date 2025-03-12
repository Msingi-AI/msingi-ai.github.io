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

    // Process content to remove any H1 headers that match the title
    const lines = match[2].trim().split('\n');
    const cleanedLines = [];
    let inCodeBlock = false;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        
        // Track code blocks
        if (line.trim().startsWith('```')) {
            inCodeBlock = !inCodeBlock;
            cleanedLines.push(line);
            continue;
        }
        
        // Skip H1 headers outside code blocks
        if (!inCodeBlock && line.trim().startsWith('# ')) {
            continue;
        }
        
        cleanedLines.push(line);
    }

    return {
        ...frontMatter,
        content: cleanedLines.join('\n')
    };
}

// Function to create title HTML
function createTitleSection(postData) {
    const formattedDate = formatDate(postData.date);
    
    return `
        <div class="p-8">
            <h1 class="text-4xl font-bold text-gray-900 mb-4">${postData.title}</h1>
            <div class="flex items-center text-gray-600">
                <span class="mr-4">By ${postData.author}</span>
                <time datetime="${postData.date}">${formattedDate}</time>
            </div>
        </div>
    `;
}

// Function to create content HTML
function createContentSection(postData) {
    // Configure marked
    marked.setOptions({
        gfm: true,
        breaks: true,
        headerIds: true,
        headerPrefix: 'content-'
    });
    
    return `
        <div class="p-8">
            <div class="prose prose-indigo max-w-none">
                ${marked.parse(postData.content)}
            </div>
            <div class="mt-8 pt-8 border-t border-gray-200">
                <a href="../blog.html" class="text-indigo-600 hover:text-indigo-700">
                    ← Back to Blog
                </a>
            </div>
        </div>
    `;
}

// Function to load and display post content
async function loadPost() {
    const titleContainer = document.getElementById('post-title');
    const contentContainer = document.getElementById('post-content');
    
    if (!titleContainer || !contentContainer) {
        console.error('Required containers not found');
        return;
    }

    try {
        // Get the markdown filename from the URL
        const urlParams = new URLSearchParams(window.location.search);
        const markdownFile = urlParams.get('post');
        
        if (!markdownFile) {
            throw new Error('No post specified in URL');
        }

        // Show loading state
        contentContainer.innerHTML = `
            <div class="text-center py-12">
                <div class="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
                <p class="mt-4 text-gray-600">Loading post...</p>
            </div>
        `;

        // Fetch the markdown content
        const response = await fetch(markdownFile);
        if (!response.ok) {
            throw new Error(`Failed to fetch post: ${response.status} ${response.statusText}`);
        }

        const markdown = await response.text();
        const postData = parseFrontMatter(markdown);
        
        if (!postData) {
            throw new Error('Failed to parse post content');
        }

        // Update the page title
        document.title = `${postData.title} - Msingi AI Blog`;
        
        // Display the title and content separately
        titleContainer.innerHTML = createTitleSection(postData);
        contentContainer.innerHTML = createContentSection(postData);
    } catch (error) {
        console.error('Error loading post:', error);
        contentContainer.innerHTML = `
            <div class="text-center py-12">
                <p class="text-red-600">Error loading post: ${error.message}</p>
                <a href="../blog.html" class="mt-4 inline-block px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">
                    Back to Blog
                </a>
            </div>
        `;
    }
}

// Load post when the page loads
document.addEventListener('DOMContentLoaded', loadPost);
