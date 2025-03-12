import os
import json
import markdown
from datetime import datetime

def format_date(date_str):
    try:
        date = datetime.strptime(date_str, '%Y-%m-%d')
        return date.strftime('%B %d, %Y')
    except:
        return date_str

def parse_frontmatter(content):
    """Parse frontmatter from markdown content."""
    if not content.startswith('---\n'):
        return None, content
    
    parts = content.split('---\n', 2)
    if len(parts) < 3:
        return None, content
    
    frontmatter = {}
    for line in parts[1].strip().split('\n'):
        if ':' in line:
            key, value = line.split(':', 1)
            frontmatter[key.strip()] = value.strip()
    
    return frontmatter, parts[2].strip()

def create_html(frontmatter, content):
    """Create HTML content with proper styling."""
    formatted_date = format_date(frontmatter.get('date', ''))
    
    return f'''<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{frontmatter.get('title', 'Blog Post')} - Msingi AI</title>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/tailwindcss/2.2.19/tailwind.min.css" rel="stylesheet">
    <link href="https://unpkg.com/@tailwindcss/typography@0.4.1/dist/typography.min.css" rel="stylesheet">
</head>
<body class="bg-gray-50">
    <!-- Navigation -->
    <nav class="bg-white shadow-lg fixed w-full z-10">
        <div class="max-w-7xl mx-auto px-4">
            <div class="flex justify-between h-16">
                <div class="flex items-center">
                    <a href="../..">
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
                    <a href="../.." class="text-gray-700 hover:text-indigo-600">Home</a>
                    <a href="../../research.html" class="text-gray-700 hover:text-indigo-600">Research</a>
                    <a href="../../community.html" class="text-gray-700 hover:text-indigo-600">Community</a>
                    <a href="../../blog.html" class="text-gray-700 hover:text-indigo-600">Blog</a>
                    <a href="../../data.html" class="text-gray-700 hover:text-indigo-600">Data Challenge</a>
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
                    <h1 class="text-4xl font-bold text-gray-900 mb-4">{frontmatter.get('title', '')}</h1>
                    <div class="flex items-center text-gray-600 mb-8">
                        <span class="mr-4">By {frontmatter.get('author', '')}</span>
                        <time datetime="{frontmatter.get('date', '')}">{formatted_date}</time>
                    </div>
                    <div class="prose prose-indigo max-w-none">
                        {markdown.markdown(content, extensions=['extra', 'codehilite'])}
                    </div>
                    <div class="mt-8 pt-8 border-t border-gray-200">
                        <a href="../../blog.html" class="text-indigo-600 hover:text-indigo-700">
                            ← Back to Blog
                        </a>
                    </div>
                </div>
            </article>
        </div>
    </div>
</body>
</html>'''

def main():
    # Create html directory if it doesn't exist
    html_dir = os.path.join('posts', 'html')
    os.makedirs(html_dir, exist_ok=True)
    
    # Read index.json to get list of posts
    with open(os.path.join('posts', 'index.json'), 'r', encoding='utf-8') as f:
        index = json.load(f)
    
    # Process each post
    for post in index['posts']:
        md_file = os.path.join('posts', post['filename'])
        if not os.path.exists(md_file):
            print(f"Warning: {md_file} not found")
            continue
        
        # Read markdown content
        with open(md_file, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Parse frontmatter and content
        frontmatter, content = parse_frontmatter(content)
        if not frontmatter:
            print(f"Warning: No frontmatter found in {md_file}")
            continue
        
        # Generate HTML filename
        html_file = os.path.join(html_dir, os.path.splitext(post['filename'])[0] + '.html')
        
        # Generate HTML content
        html_content = create_html(frontmatter, content)
        
        # Write HTML file
        with open(html_file, 'w', encoding='utf-8') as f:
            f.write(html_content)
        
        print(f"Generated {html_file}")

if __name__ == '__main__':
    main()
