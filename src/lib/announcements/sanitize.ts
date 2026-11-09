import sanitizeHtml from 'sanitize-html';

const ALLOWED_TAGS = [
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'pre', 'span', 'img', 'strong',
    'blockquote', 'p', 'a', 'u', 's', 'em', 'br', 'ul', 'ol', 'li',
];

export function sanitizeAnnouncementBody(html: string): string {
    const clean = sanitizeHtml(html, {
        allowedTags: ALLOWED_TAGS,
        // bleach.clean was called with only `tags=`, so bleach's default
        // attribute allowlist applied.
        allowedAttributes: {
            a: ['href', 'title'],
            abbr: ['title'],
            acronym: ['title'],
            img: ['src', 'alt', 'width', 'height'],
        },
    });
    return clean.replace(/<p><br\s*\/?><\/p>/g, '');
}
