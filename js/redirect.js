window.addEventListener('click', function(e) {
    if (e.target.matches('a')) {
      let href = e.target.getAttribute('href');
      if (href.endsWith('.html')) {
        e.preventDefault();
        let newUrl = href.slice(0, -5); // Remove .html
        history.pushState({}, '', newUrl);
        // Load the content here if needed
      }
    }
  });