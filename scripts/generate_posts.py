import os
import json
import markdown
import frontmatter
from datetime import datetime

def format_date(date_str):
    try:
        date = datetime.strptime(date_str, '%Y-%m-%d')
        return date.strftime('%B %d, %Y')
    except:
        return date_str

def get_relative_url(path):
    # For local development, use relative paths
    # Since we're in posts/html, we need to go up two levels
    return f"../../{path}" if path else "../.."

def create_html_content(post_data, content):
    title = post_data.get('title', '')
    author = post_data.get('author', '')
    date = post_data.get('date', '')
    formatted_date = format_date(str(date))

    return f'''<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{title} - Msingi AI Blog</title>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/tailwindcss/2.2.19/tailwind.min.css" rel="stylesheet">
    <link href="https://unpkg.com/@tailwindcss/typography@0.4.1/dist/typography.min.css" rel="stylesheet">
</head>
<body class="bg-gray-50">
    <!-- Navigation -->
    <nav class="bg-white shadow-lg fixed w-full z-10">
        <div class="max-w-7xl mx-auto px-4">
            <div class="flex justify-between h-16">
                <div class="flex items-center">
                    <a href="{get_relative_url('')}">
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
                    <a href="{get_relative_url('')}" class="text-gray-700 hover:text-indigo-600">Home</a>
                    <a href="{get_relative_url('research.html')}" class="text-gray-700 hover:text-indigo-600">Research</a>
                    <a href="{get_relative_url('community.html')}" class="text-gray-700 hover:text-indigo-600">Community</a>
                    <a href="{get_relative_url('blog.html')}" class="text-gray-700 hover:text-indigo-600">Blog</a>

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
                        <h1 class="text-4xl font-bold text-gray-900 mb-4">{title}</h1>
                        <div class="flex items-center text-gray-600">
                            <span class="mr-4">By {author}</span>
                            <time datetime="{date}">{formatted_date}</time>
                        </div>
                    </div>
                    <div class="prose prose-indigo max-w-none">
                        {content}
                    </div>
                    <div class="mt-8 pt-8 border-t border-gray-200">
                        <a href="{get_relative_url('blog.html')}" class="text-indigo-600 hover:text-indigo-700">
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
                        <li><a href="{get_relative_url('research.html')}" class="text-gray-400 hover:text-white">Research</a></li>
                        <li><a href="{get_relative_url('blog.html')}" class="text-gray-400 hover:text-white">Blog</a></li>
                        <li><a href="{get_relative_url('community.html')}" class="text-gray-400 hover:text-white">Community</a></li>
                        <li><a href="{get_relative_url('data.html')}" class="text-gray-400 hover:text-white">Data Challenge</a></li>
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
</html>'''

def convert_markdown_to_html():
    # Create posts/html directory if it doesn't exist
    os.makedirs('posts/html', exist_ok=True)

    # Initialize posts list
    posts = []

    # Get all markdown files in the posts directory
    md_files = [f for f in os.listdir('posts') if f.endswith('.md')]

    # Convert each post
    for md_file in md_files:
        try:
            # Read markdown file
            md_path = os.path.join('posts', md_file)
            post_data = frontmatter.load(md_path)
            
            # Convert markdown to HTML
            html_content = markdown.markdown(
                post_data.content,
                extensions=['extra', 'codehilite', 'fenced_code', 'tables']
            )
            
            # Create HTML file
            html_filename = md_file.replace('.md', '.html')
            html_path = os.path.join('posts', 'html', html_filename)
            
            with open(html_path, 'w', encoding='utf-8') as f:
                f.write(create_html_content(post_data.metadata, html_content))
            
            # Add post metadata to posts list, ensuring date is a string
            metadata = post_data.metadata
            posts.append({
                'filename': md_file,
                'title': metadata.get('title', ''),
                'date': str(metadata.get('date', '')),
                'author': metadata.get('author', ''),
                'excerpt': metadata.get('excerpt', '')
            })
            
            print(f"Generated HTML for {md_file}")
        except Exception as e:
            print(f"Error processing {md_file}: {str(e)}")

    # Sort posts by date (newest first)
    posts.sort(key=lambda x: x['date'], reverse=True)

    # Write posts index
    index = {'posts': posts}
    with open('posts/index.json', 'w', encoding='utf-8') as f:
        json.dump(index, f, indent=2, ensure_ascii=False)
    print("Generated posts/index.json")

if __name__ == '__main__':
    convert_markdown_to_html()
