# MsingiAI Blog

Welcome to the MsingiAI blog repository! This guide will help you contribute content to our blog.

## 🎯 Quick Start for Content Writers

1. **Write a New Post**
   - Go to the [posts directory](posts/)
   - Click "Add file" > "Create new file"
   - Copy content from [POST-TEMPLATE.md](posts/POST-TEMPLATE.md)
   - Name your file `your-post-title.md`
   - Write your post in markdown

2. **Add Images**
   - Go to the relevant images directory:
     - Post images: [images/posts/](images/posts/)
     - Author photos: [images/authors/](images/authors/)
   - Click "Add file" > "Upload files"
   - Drag & drop your images

3. **Preview Your Post**
   - Commit your changes
   - Go to [Actions](https://github.com/Msingi-AI/msingi-ai.github.io/actions)
   - Wait for the "Build Blog" workflow to complete
   - View your post on the [blog page](https://msingi-ai.github.io/blog.html)

## 📝 Writing Guidelines

See our [Contributing Guide](posts/CONTRIBUTING.md) for:
- Post formatting tips
- Image guidelines
- Code examples
- Best practices

## 👥 Adding New Authors

1. Add your photo to [images/authors/](images/authors/)
2. Ask a team member to add your info to [authors.json](posts/authors.json)

## 🛠️ Technical Details

This blog uses:
- GitHub Pages for hosting
- GitHub Actions for automation
- Python for markdown conversion
- Tailwind CSS for styling

### Local Development

```bash
# Clone the repo
git clone https://github.com/Msingi-AI/msingi-ai.github.io.git
cd msingi-ai.github.io

# Install dependencies
pip install markdown

# Convert posts
python convert_posts.py

# Serve locally (using Python's built-in server)
python -m http.server
```

Visit http://localhost:8000 to preview the site.