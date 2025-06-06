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

// Function to convert markdown to HTML
async function convertMarkdownToHtml(filename) {
    try {
        const markdownResponse = await fetch(getAssetUrl(`/posts/${filename}`));
        if (!markdownResponse.ok) {
            throw new Error(`Failed to fetch ${filename}: ${markdownResponse.status}`);
        }
        
        const markdown = await markdownResponse.text();
        const postData = parseFrontMatter(markdown);
        const formattedDate = formatDate(postData.date);
        const titleSlug = postData.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');

        const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${postData.title} - Msingi AI Blog</title>
    <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/tailwindcss/2.2.19/tailwind.min.css" rel="stylesheet">
    <link href="https://unpkg.com/@tailwindcss/typography@0.4.1/dist/typography.min.css" rel="stylesheet">
</head>
<body class="bg-gray-50">
    <!-- Navigation -->
    <nav class="bg-white shadow-lg fixed w-full z-10">
        <div class="max-w-7xl mx-auto px-4">
            <div class="flex justify-between h-16">
                <div class="flex items-center">
                    <a href="${getBaseUrl()}/">
                        <svg viewBox="0 0 400 100" width="200" height="50" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="50" cy="50" r="8" fill="#4F46E5"/>
                            <circle cx="90" cy="30" r="8" fill="#4F46E5"/>
                            <circle cx="90" cy="70" r="8" fill="#4F46E5"/>
                            <circle cx="130" cy="50" r="8" fill="#4F46E5"/>
                            <path d="M58 50 L82 30" stroke="#4F46E5" stroke-width="2"/>
                            <path d="M58 50 L82 70" stroke="#4F46E5" stroke-width="2"/>
                            <path d="M98 30 L122 50" stroke="#4F46E5" stroke-width="2"/>
                            <path d="M98 70 L122 50" stroke="#4F46E5" stroke-width="2"/>
                            <path d="M130 35 C140 35, 145 45, 145 50 C145 55, 140 65, 130 65 C120 65, 115 55, 115 50 C115 45, 120 35, 130 35" 
                                fill="none" stroke="#4F46E5" stroke-width="2"/>
                            <path d="M130 42 L130 58 M124 50 L136 50" stroke="#4F46E5" stroke-width="2"/>
                            <text x="160" y="60" font-family="Arial" font-weight="bold" font-size="36" fill="#1F2937">Msingi</text>
                            <text x="280" y="60" font-family="Arial" font-weight="bold" font-size="36" fill="#4F46E5">AI</text>
                        </svg>
                    </a>
                </div>
                <div class="hidden md:flex items-center space-x-8">
                    <a href="${getBaseUrl()}/" class="text-gray-700 hover:text-indigo-600">Home</a>
                    <a href="${getBaseUrl()}/research.html" class="text-gray-700 hover:text-indigo-600">Research</a>
                    <a href="${getBaseUrl()}/community.html" class="text-gray-700 hover:text-indigo-600">Community</a>
                    <a href="${getBaseUrl()}/blog.html" class="text-gray-700 hover:text-indigo-600">Blog</a>
                    <a href="${getBaseUrl()}/data.html" class="text-gray-700 hover:text-indigo-600">Data Challenge</a>
                    <a href="#" class="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">Join Us</a>
                </div>
            </div>
        </div>
    </nav>

    <!-- Post Content -->
    <div class="pt-24">
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <article class="bg-white rounded-lg shadow-lg overflow-hidden">
                <div class="p-8">
                    <div class="mb-8">
                        <h1 class="text-4xl font-bold text-gray-900 mb-4">${postData.title}</h1>
                        <div class="flex items-center text-gray-600">
                            <span class="mr-4">By ${postData.author}</span>
                            <time datetime="${postData.date}">${formattedDate}</time>
                        </div>
                    </div>
                    <div class="prose prose-indigo max-w-none" id="content">
                        ${marked.parse(postData.content)}
                    </div>
                    <div class="mt-8 pt-8 border-t border-gray-200">
                        <a href="${getBaseUrl()}/blog.html" class="text-indigo-600 hover:text-indigo-700">
                            ← Back to Blog
                        </a>
                    </div>
                </div>
            </article>
        </div>
    </div>

    <!-- Footer -->
    <footer class="bg-gray-900 mt-16">
        <div class="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                    <h3 class="text-white text-lg font-semibold mb-4">About Us</h3>
                    <p class="text-gray-400">Building AI that speaks Africa's languages</p>
                </div>
                <div>
                    <h3 class="text-white text-lg font-semibold mb-4">Quick Links</h3>
                    <ul class="space-y-2">
                        <li><a href="${getBaseUrl()}/research.html" class="text-gray-400 hover:text-white">Research</a></li>
                        <li><a href="${getBaseUrl()}/blog.html" class="text-gray-400 hover:text-white">Blog</a></li>
                        <li><a href="${getBaseUrl()}/community.html" class="text-gray-400 hover:text-white">Community</a></li>
                        <li><a href="${getBaseUrl()}/data.html" class="text-gray-400 hover:text-white">Data Challenge</a></li>
                    </ul>
                </div>
                <div>
                    <h3 class="text-white text-lg font-semibold mb-4">Connect</h3>
                    <div class="flex space-x-4">
                        <a href="https://github.com/Msingi-AI" class="text-gray-400 hover:text-white">
                            <span class="sr-only">GitHub</span>
                            <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                <path fill-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clip-rule="evenodd"></path>
                            </svg>
                        </a>
                        <a href="https://discord.gg/2TvwPJpSj6" class="text-gray-400 hover:text-white">
                            <span class="sr-only">Discord</span>
                            <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                <path fill-rule="evenodd" d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 01-1.872-.892.075.075 0 01-.008-.125c.126-.095.252-.193.372-.292a.075.075 0 01.078-.01c3.927 1.793 8.18 1.793 12.061 0a.075.075 0 01.079.01c.12.098.246.198.373.292.044.032.04.1-.009.125-.598.344-1.22.635-1.873.892a.075.075 0 00-.041.106c.36.698.772 1.362 1.225 1.994a.076.076 0 00.084.028 19.834 19.834 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" clip-rule="evenodd"></path>
                            </svg>
                        </a>
                    </div>
                </div>
            </div>
            <div class="mt-8 border-t border-gray-800 pt-8">
                <p class="text-gray-400 text-sm text-center">&copy; 2025 Msingi AI. All rights reserved.</p>
            </div>
        </div>
    </footer>
</body>
</html>`;

        // Write to file
        const htmlFilename = filename.replace('.md', '.html');
        const saveResponse = await fetch(`/posts/html/${htmlFilename}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'text/html'
            },
            body: htmlContent
        });

        if (!saveResponse.ok) {
            throw new Error(`Failed to save HTML file: ${saveResponse.status}`);
        }

        return htmlFilename;
    } catch (error) {
        console.error('Error converting markdown to HTML:', error);
        throw error;
    }
}

// Function to convert all posts
async function convertAllPosts() {
    try {
        const indexResponse = await fetch(getAssetUrl('/posts/index.json'));
        if (!indexResponse.ok) {
            throw new Error(`Failed to fetch posts index: ${indexResponse.status}`);
        }
        
        const data = await indexResponse.json();
        const posts = data.posts || [];
        
        for (const post of posts) {
            try {
                await convertMarkdownToHtml(post.filename);
                console.log(`Converted ${post.filename} to HTML`);
            } catch (error) {
                console.error(`Failed to convert ${post.filename}:`, error);
            }
        }
    } catch (error) {
        console.error('Error converting posts:', error);
    }
}

// Run conversion when script loads
convertAllPosts();
