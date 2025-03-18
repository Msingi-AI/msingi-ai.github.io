<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="2.0" 
                xmlns:html="http://www.w3.org/TR/REC-html40"
                xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9"
                xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>
  <xsl:template match="/">
    <html xmlns="http://www.w3.org/1999/xhtml">
      <head>
        <title>XML Sitemap - Msingi AI</title>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <style type="text/css">
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;
            color: #333;
            max-width: 75em;
            margin: 0 auto;
            padding: 2em;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin: 2em 0;
          }
          th, td {
            padding: 1em;
            text-align: left;
            border-bottom: 1px solid #eee;
          }
          th {
            background: #f8f9fa;
            font-weight: 600;
          }
          .url {
            color: #4F46E5;
            text-decoration: none;
          }
          .url:hover {
            text-decoration: underline;
          }
          h1 {
            color: #1F2937;
            margin-bottom: 1em;
          }
          p {
            color: #666;
            margin-bottom: 2em;
          }
        </style>
      </head>
      <body>
        <h1>XML Sitemap</h1>
        <p>This is the XML sitemap for Msingi AI, which is used by search engines to discover and index our content.</p>
        <table>
          <tr>
            <th>URL</th>
            <th>Last Modified</th>
            <th>Change Frequency</th>
            <th>Priority</th>
          </tr>
          <xsl:for-each select="sitemap:urlset/sitemap:url">
            <tr>
              <td>
                <a class="url" href="{sitemap:loc}">
                  <xsl:value-of select="sitemap:loc"/>
                </a>
              </td>
              <td><xsl:value-of select="sitemap:lastmod"/></td>
              <td><xsl:value-of select="sitemap:changefreq"/></td>
              <td><xsl:value-of select="sitemap:priority"/></td>
            </tr>
          </xsl:for-each>
        </table>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
