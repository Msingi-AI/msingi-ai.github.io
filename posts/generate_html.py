import os
import json
import markdown
import frontmatter
from pathlib import Path

def ensure_dir(directory):
    """Ensure a directory exists, creating it if necessary."""
    Path(directory).mkdir(parents=True, exist_ok=True)

def generate_html(md_file, template_file):
    """Generate HTML from markdown file using the template."""
    # Read the markdown file with frontmatter
    with open(md_file, 'r', encoding='utf-8') as f:
        post = frontmatter.load(f)
    
    # Read the template
    with open(template_file, 'r', encoding='utf-8') as f:
        template = f.read()
    
    # Convert markdown to HTML
    md = markdown.Markdown(extensions=['meta'])
    html_content = md.convert(post.content)
    
    # Replace placeholders in template
    html = template.replace('{{title}}', post.get('title', ''))
    html = html.replace('{{date}}', post.get('date', '').strftime('%Y-%m-%d'))
    html = html.replace('{{author}}', post.get('author', ''))
    html = html.replace('{{content}}', html_content)
    
    return html

def main():
    # Set up paths
    base_dir = os.path.dirname(os.path.abspath(__file__))
    html_dir = os.path.join(base_dir, 'html')
    template_file = os.path.join(base_dir, 'template.html')
    
    # Create HTML directory if it doesn't exist
    ensure_dir(html_dir)
    
    # Create template if it doesn't exist
    if not os.path.exists(template_file):
        template = '''<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{title}} - Msingi AI</title>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/tailwindcss/2.2.19/tailwind.min.css" rel="stylesheet">
    <link href="https://unpkg.com/@tailwindcss/typography@0.4.1/dist/typography.min.css" rel="stylesheet">
</head>
<body class="bg-gray-50">
    <!-- Navigation -->
    <nav class="bg-white shadow-lg fixed w-full z-10">
        <div class="max-w-7xl mx-auto px-4">
            <div class="flex justify-between h-16">
                <div class="flex items-center">
                    <a href="../.." class="hover:opacity-90">
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
            <!-- Title Section -->
            <div class="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
                <div class="p-8">
                    <h1 class="text-4xl font-bold text-gray-900 mb-4">{{title}}</h1>
                    <div class="flex items-center text-gray-600">
                        <span class="mr-4">By {{author}}</span>
                        <time datetime="{{date}}">{{date}}</time>
                    </div>
                </div>
            </div>
            
            <!-- Content Section -->
            <div class="bg-white rounded-lg shadow-lg overflow-hidden">
                <div class="p-8">
                    <div class="prose prose-indigo max-w-none">
                        {{content}}
                    </div>
                    <div class="mt-8 pt-8 border-t border-gray-200">
                        <a href="../../blog.html" class="text-indigo-600 hover:text-indigo-700">
                            ← Back to Blog
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</body>
</html>'''
        with open(template_file, 'w', encoding='utf-8') as f:
            f.write(template)
    
    # Process all markdown files
    for md_file in Path(base_dir).glob('*.md'):
        if md_file.name != 'README.md':  # Skip README
            print(f'Processing {md_file.name}...')
            html = generate_html(md_file, template_file)
            
            # Write HTML file
            html_file = Path(html_dir) / md_file.with_suffix('.html').name
            with open(html_file, 'w', encoding='utf-8') as f:
                f.write(html)
            print(f'Generated {html_file.name}')

if __name__ == '__main__':
    main()
