import os
from PIL import Image

def check_image(filepath):
    """Check if an image meets our requirements."""
    try:
        with Image.open(filepath) as img:
            width, height = img.size
            format = img.format
            filesize = os.path.getsize(filepath) / (1024 * 1024)  # Size in MB
            
            errors = []
            
            # Check dimensions
            if width > 2000 or height > 2000:
                errors.append(f"Image too large: {width}x{height}px (max 2000x2000px)")
            
            # Check file size
            if filesize > 2:
                errors.append(f"File too large: {filesize:.1f}MB (max 2MB)")
            
            # Check format
            if format not in ['JPEG', 'PNG', 'WEBP']:
                errors.append(f"Invalid format: {format} (use JPEG, PNG, or WEBP)")
            
            return errors
    except Exception as e:
        return [f"Error processing image: {str(e)}"]

def main():
    """Check all images in the repository."""
    image_dirs = [
        os.path.join('images', 'posts'),
        os.path.join('images', 'authors')
    ]
    
    errors = []
    
    for directory in image_dirs:
        if not os.path.exists(directory):
            continue
            
        for filename in os.listdir(directory):
            if filename.lower().endswith(('.jpg', '.jpeg', '.png', '.webp')):
                filepath = os.path.join(directory, filename)
                image_errors = check_image(filepath)
                
                if image_errors:
                    errors.append(f"\nErrors in {filepath}:")
                    errors.extend([f"  - {error}" for error in image_errors])
    
    if errors:
        print("\n".join(errors))
        exit(1)
    else:
        print("All images validated successfully!")

if __name__ == '__main__':
    main()
