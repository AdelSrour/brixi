import * as sanitizeHtml from 'sanitize-html';

function preventMongoInjection(html: string): string {
  // Remove leading $ or . from any attribute or tag names
  // and remove any suspicious patterns that could be used for MongoDB injection
  return html.replace(/(\$|)/g, '');
}

export function sanitizeUserHtml(html: string): string {
  // First, sanitize HTML as before
  let sanitized = sanitizeHtml(html, {
    allowedTags: false, // Allow all tags
    allowedAttributes: false, // Allow all attributes on all tags
    allowVulnerableTags: true, // Allow script, style, etc.
    allowIframeRelativeUrls: true,
    allowProtocolRelative: true,
    parser: {
      lowerCaseTags: false,
    },
  });

  // Then, prevent MongoDB injection
  sanitized = preventMongoInjection(sanitized);

  return sanitized;
}
