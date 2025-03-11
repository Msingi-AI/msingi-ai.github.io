// Function to get base URL for assets
function getBaseUrl() {
    // Check if we're on GitHub Pages or localhost
    const hostname = window.location.hostname;
    console.log('Current hostname:', hostname);
    if (hostname.includes('github.io')) {
        console.log('Using GitHub Pages base URL');
        return '/msingi-ai.github.io';
    }
    console.log('Using local base URL');
    return '';
}

// Function to get asset URL
function getAssetUrl(path) {
    // Remove leading slash if present since we add it in getBaseUrl
    const normalizedPath = path.startsWith('/') ? path.substring(1) : path;
    const baseUrl = getBaseUrl();
    const url = baseUrl ? `${baseUrl}/${normalizedPath}` : normalizedPath;
    console.log('Generated URL:', url);
    return url;
}

// Function to parse markdown frontmatter
function parseFrontMatter(markdown) {
    console.log('Parsing markdown:', markdown ? markdown.substring(0, 100) + '...' : 'null');
    
    if (!markdown) {
        console.error('No markdown content provided');
        return null;
    }
    
    try {
        // More flexible regex that handles different line endings and whitespace
        const match = markdown.replace(/\r\n/g, '\n').match(/^---[\s]*\n([\s\S]*?)\n[\s]*---[\s]*\n([\s\S]*)$/);
        if (!match) {
            console.error('No frontmatter found in markdown');
            console.log('Raw markdown start:', markdown.substring(0, 200));
            return { content: markdown };
        }

        const frontMatter = {};
        const frontMatterText = match[1].trim();
        console.log('Found frontmatter:', frontMatterText);
        
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

        console.log('Parsed frontmatter:', frontMatter);
        return {
            ...frontMatter,
            content: match[2].trim()
        };
    } catch (error) {
        console.error('Error parsing frontmatter:', error);
        console.log('Raw markdown that caused error:', markdown);
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

// Function to get excerpt from content
function getExcerpt(content, maxLength = 200) {
    if (!content) return '';
    
    const plainText = content
        .replace(/#+\s[^\n]+/g, '') // Remove headers
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Replace links with just text
        .replace(/[*_`]/g, '') // Remove markdown formatting
        .replace(/\s+/g, ' ') // Normalize whitespace
        .trim();
    
    if (plainText.length <= maxLength) {
        return plainText;
    }
    
    return plainText.substring(0, maxLength).trim() + '...';
}

// Function to create post card HTML
function createPostCard(postData, filename) {
    if (!postData || !postData.title) {
        console.error('Invalid post data:', postData);
        return '';
    }

    const formattedDate = formatDate(postData.date);
    const titleSlug = postData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    
    const excerpt = postData.excerpt || getExcerpt(postData.content);
    
    return `
        <article class="bg-white rounded-lg shadow-lg overflow-hidden transform transition duration-300 hover:shadow-xl hover:-translate-y-1">
            <a href="${getAssetUrl('post.html')}?post=${filename}#${titleSlug}" class="block">
                <div class="p-6">
                    <div class="flex items-center text-sm text-gray-600 mb-4">
                        <time datetime="${postData.date || ''}">${formattedDate}</time>
                        <span class="mx-2">·</span>
                        <span>By ${postData.author || 'Unknown'}</span>
                    </div>
                    <h2 class="text-xl font-bold text-gray-900 mb-3 hover:text-indigo-600">
                        ${postData.title}
                    </h2>
                    <p class="text-gray-600 line-clamp-3">
                        ${excerpt}
                    </p>
                    <div class="mt-4">
                        <span class="inline-flex items-center text-indigo-600 hover:text-indigo-700">
                            Read more
                            <svg class="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                            </svg>
                        </span>
                    </div>
                </div>
            </a>
        </article>
    `;
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

// Function to fetch markdown post
async function fetchMarkdownPost(filename) {
    try {
        const url = getAssetUrl(`posts/${filename}`);
        console.log('Fetching markdown file:', url);
        const response = await fetch(url);
        
        if (!response.ok) {
            console.error(`Failed to fetch ${filename}: ${response.status}`);
            throw new Error(`Failed to fetch ${filename}: ${response.status}`);
        }
        
        const text = await response.text();
        console.log('Markdown response:', text ? text.substring(0, 100) + '...' : 'empty');
        return text;
    } catch (error) {
        console.error('Error fetching markdown:', error);
        throw error;
    }
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
        const indexUrl = getAssetUrl('posts/index.json');
        console.log('Index URL:', indexUrl);
        const response = await fetch(indexUrl);
        
        if (!response.ok) {
            console.error(`Failed to fetch posts index: ${response.status}`);
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

        // Clear container and create grid for post cards
        postsContainer.innerHTML = '<div class="grid gap-8 md:grid-cols-2 lg:grid-cols-2"></div>';
        const grid = postsContainer.firstChild;

        let successfulPosts = 0;
        for (const post of posts) {
            try {
                if (!post || !post.filename) {
                    console.error('Invalid post data in index:', post);
                    continue;
                }

                console.log('Processing post:', post.filename);
                const markdown = await fetchMarkdownPost(post.filename);
                const postData = parseFrontMatter(markdown);
                
                if (!postData || !postData.title) {
                    console.error('Failed to parse frontmatter for:', post.filename);
                    console.log('Raw markdown:', markdown);
                    continue;
                }

                console.log('Creating post card for:', post.filename);
                const postCard = createPostCard(postData, post.filename);
                if (postCard) {
                    grid.innerHTML += postCard;
                    successfulPosts++;
                }
            } catch (error) {
                console.error(`Error processing post ${post.filename}:`, error);
                // Continue with other posts if one fails
                continue;
            }
        }

        // If no posts were successfully loaded, show error
        if (successfulPosts === 0) {
            throw new Error('No posts could be loaded successfully');
        }
    } catch (error) {
        console.error('Error loading blog posts:', error);
        showError(postsContainer, error.message || 'Error loading blog posts. Please try again.');
    }
}

// Function to update featured post link
function updateFeaturedPostLink() {
    const featuredLink = document.getElementById('featured-post-link');
    if (featuredLink) {
        console.log('Updating featured post link...');
        const currentHref = featuredLink.getAttribute('href');
        const newHref = getAssetUrl(currentHref);
        console.log('Updating featured post link from:', currentHref, 'to:', newHref);
        featuredLink.href = newHref;
    } else {
        console.log('Featured post link not found');
    }
}

// Load posts when the page loads
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing blog system...');
    updateFeaturedPostLink();
    loadBlogPosts();
});
