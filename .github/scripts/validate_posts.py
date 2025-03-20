import os
import yaml
from datetime import datetime

def validate_frontmatter(content, filename):
    """Validate post frontmatter."""
    if not content.startswith('---\n'):
        return False, f"Error in {filename}: Missing frontmatter"
    
    try:
        parts = content.split('---\n', 2)
        if len(parts) < 3:
            return False, f"Error in {filename}: Invalid frontmatter format"
        
        frontmatter = yaml.safe_load(parts[1])
        
        # Required fields
        required = ['title', 'date', 'author', 'excerpt']
        for field in required:
            if field not in frontmatter:
                return False, f"Error in {filename}: Missing required field '{field}'"
        
        # Validate date format
        try:
            datetime.strptime(frontmatter['date'], '%Y-%m-%d')
        except ValueError:
            return False, f"Error in {filename}: Invalid date format. Use YYYY-MM-DD"
        
        # Title length
        if len(frontmatter['title']) > 100:
            return False, f"Error in {filename}: Title too long (max 100 characters)"
        
        # Excerpt length
        if len(frontmatter['excerpt']) > 200:
            return False, f"Error in {filename}: Excerpt too long (max 200 characters)"
        
        return True, None
    except yaml.YAMLError:
        return False, f"Error in {filename}: Invalid YAML in frontmatter"

def main():
    """Validate all markdown posts."""
    posts_dir = 'posts'
    errors = []
    
    for filename in os.listdir(posts_dir):
        if filename.endswith('.md') and filename != 'CONTRIBUTING.md' and filename != 'POST-TEMPLATE.md':
            filepath = os.path.join(posts_dir, filename)
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
            
            valid, error = validate_frontmatter(content, filename)
            if not valid:
                errors.append(error)
    
    if errors:
        print("\n".join(errors))
        exit(1)
    else:
        print("All posts validated successfully!")

if __name__ == '__main__':
    main()
