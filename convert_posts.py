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

def read_template():
    """Read the HTML template file."""
    template_path = os.path.join('posts', 'template.html')
    with open(template_path, 'r', encoding='utf-8') as f:
        return f.read()

def create_html(frontmatter, content):
    """Create HTML content using the template."""
    template = read_template()
    formatted_date = format_date(frontmatter.get('date', ''))
    author = frontmatter.get('author', 'Msingi AI Research Team')
    
    # Convert markdown to HTML
    html_content = markdown.markdown(content, extensions=['extra', 'codehilite'])
    
    # Replace template variables
    html = template.replace('{{title}}', frontmatter.get('title', 'Blog Post'))
    html = html.replace('{{author}}', author)
    html = html.replace('{{date}}', formatted_date)
    html = html.replace('{{content}}', html_content)
    
    # Handle author image
    if author == 'Kiplangat Korir':
        author_img = 'IMG_20230808_105044.jpg'
    elif author == 'Msingi AI Research Team':
        author_img = 'msingi-small-logo.png'
    else:
        author_img = 'msingi-small-logo.png'  # Default to team logo
    html = html.replace('{{author_img}}', author_img)
    
    return html

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
