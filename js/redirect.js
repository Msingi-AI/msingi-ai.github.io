// Redirect to .html if the URL does not already include it
if (!window.location.pathname.endsWith(".html") && window.location.pathname !== "/") {
    const pathWithHtml = window.location.pathname + ".html";
    window.location.replace(pathWithHtml);
}
