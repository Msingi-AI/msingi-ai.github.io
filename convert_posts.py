import os
import json
import markdown
from datetime import datetime

def load_authors():
    """Load author information from authors.json."""
    try:
        with open(os.path.join('posts', 'authors.json'), 'r', encoding='utf-8') as f:
            data = json.load(f)
            # Create a lookup dictionary for quick access
            return {author['name']: author for author in data['authors']}
    except Exception as e:
        print(f"Warning: Could not load authors.json - {e}")
        return {}

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

def read_template():
    """Read the HTML template file."""
    template_path = os.path.join('posts', 'template.html')
    with open(template_path, 'r', encoding='utf-8') as f:
        return f.read()

def create_html(frontmatter, content, authors):
    """Create HTML content using the template."""
    template = read_template()
    formatted_date = format_date(frontmatter.get('date', ''))
    author_name = frontmatter.get('author', 'Msingi AI Research Team')
    
    # Get author info from authors.json
    author = authors.get(author_name, {
        'name': author_name,
        'image': 'msingi-small-logo.png',
        'bio': '',
        'social': {}
    })
    
    # Convert markdown to HTML
    html_content = markdown.markdown(content, extensions=['extra', 'codehilite'])
    
    # Replace template variables
    html = template.replace('{{title}}', frontmatter.get('title', 'Blog Post'))
    html = html.replace('{{author}}', author['name'])
    html = html.replace('{{date}}', formatted_date)
    html = html.replace('{{content}}', html_content)
    html = html.replace('{{author_img}}', author['image'])
    
    # Add author bio if available
    if author.get('bio'):
        bio_html = f'<p class="text-sm text-gray-600 mt-2">{author["bio"]}</p>'
        html = html.replace('{{author_bio}}', bio_html)
    else:
        html = html.replace('{{author_bio}}', '')
    
    # Add social links if available
    social_html = ''
    if author.get('social'):
        social_html = '<div class="flex items-center space-x-4 mt-4">'
        if author['social'].get('twitter'):
            social_html += f'<a href="{author["social"]["twitter"]}" target="_blank" class="text-gray-400 hover:text-blue-400"><svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg></a>'
        if author['social'].get('linkedin'):
            social_html += f'<a href="{author["social"]["linkedin"]}" target="_blank" class="text-gray-400 hover:text-blue-600"><svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M15.8 0H4.2C1.88 0 0 1.88 0 4.2v11.6C0 18.12 1.88 20 4.2 20h11.6c2.32 0 4.2-1.88 4.2-4.2V4.2C20 1.88 18.12 0 15.8 0zM6.5 17H3.8V7.5h2.7V17zM5.15 6.2c-.87 0-1.57-.7-1.57-1.57s.7-1.57 1.57-1.57 1.57.7 1.57 1.57-.7 1.57-1.57 1.57zm11.85 10.8h-2.7v-4.63c0-1.1-.02-2.52-1.53-2.52-1.53 0-1.77 1.2-1.77 2.44V17h-2.7V7.5h2.58v1.18h.04c.4-.75 1.37-1.53 2.82-1.53 3.02 0 3.57 1.98 3.57 4.56V17z"/></svg></a>'
        if author['social'].get('github'):
            social_html += f'<a href="{author["social"]["github"]}" target="_blank" class="text-gray-400 hover:text-gray-900"><svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.335-1.755-1.335-1.755-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.605-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12"/></svg></a>'
        social_html += '</div>'
    html = html.replace('{{author_social}}', social_html)
    
    return html

def main():
    """Convert markdown posts to HTML."""
    # Load author information
    authors = load_authors()
    
    # Create posts/html directory if it doesn't exist
    os.makedirs('posts/html', exist_ok=True)
    
    # Get list of markdown files
    posts_dir = 'posts'
    for filename in os.listdir(posts_dir):
        if filename.endswith('.md'):
            md_path = os.path.join(posts_dir, filename)
            html_path = os.path.join(posts_dir, 'html', filename.replace('.md', '.html'))
            
            # Read markdown content
            with open(md_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Parse frontmatter and content
            frontmatter, md_content = parse_frontmatter(content)
            if not frontmatter:
                print(f"Warning: No frontmatter found in {filename}")
                continue
            
            # Create HTML
            html = create_html(frontmatter, md_content, authors)
            
            # Write HTML file
            with open(html_path, 'w', encoding='utf-8') as f:
                f.write(html)
            
            print(f"Generated {html_path}")

if __name__ == '__main__':
    main()
