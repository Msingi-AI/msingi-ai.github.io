import os
import json

def validate_author(author, authors_dir):
    """Validate an author's information."""
    errors = []
    
    # Required fields
    required = ['name', 'image', 'bio']
    for field in required:
        if field not in author:
            errors.append(f"Missing required field: {field}")
    
    # Check if author image exists
    if 'image' in author:
        image_path = os.path.join(authors_dir, author['image'])
        if not os.path.exists(image_path):
            errors.append(f"Author image not found: {author['image']}")
    
    # Validate social links
    if 'social' in author:
        for platform in author['social']:
            if platform not in ['twitter', 'linkedin', 'github']:
                errors.append(f"Invalid social platform: {platform}")
            elif not author['social'][platform].startswith('https://'):
                errors.append(f"Invalid {platform} URL: {author['social'][platform]}")
    
    # Validate bio length
    if 'bio' in author and len(author['bio']) > 200:
        errors.append("Bio too long (max 200 characters)")
    
    return errors

def main():
    """Validate authors.json and associated images."""
    authors_file = os.path.join('posts', 'authors.json')
    authors_dir = os.path.join('images', 'authors')
    
    if not os.path.exists(authors_file):
        print("Error: authors.json not found")
        exit(1)
    
    try:
        with open(authors_file, 'r', encoding='utf-8') as f:
            data = json.load(f)
    except json.JSONDecodeError as e:
        print(f"Error parsing authors.json: {str(e)}")
        exit(1)
    
    if 'authors' not in data:
        print("Error: Missing 'authors' key in authors.json")
        exit(1)
    
    errors = []
    for author in data['authors']:
        author_errors = validate_author(author, authors_dir)
        if author_errors:
            errors.append(f"\nErrors for author '{author.get('name', 'Unknown')}':")
            errors.extend([f"  - {error}" for error in author_errors])
    
    if errors:
        print("\n".join(errors))
        exit(1)
    else:
        print("All authors validated successfully!")

if __name__ == '__main__':
    main()
