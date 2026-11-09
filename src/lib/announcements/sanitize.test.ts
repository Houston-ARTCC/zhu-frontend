import { expect, test } from 'vitest';
import { sanitizeAnnouncementBody } from './sanitize';

test('keeps allowed formatting tags', () => {
    const input = '<p>Hello <strong>world</strong></p><ul><li>one</li></ul>';
    expect(sanitizeAnnouncementBody(input)).toBe(input);
});

test('strips disallowed tags and their dangerous content', () => {
    const out = sanitizeAnnouncementBody('<p>ok</p><script>alert(1)</script>');
    expect(out).not.toContain('<script>');
    expect(out).not.toContain('alert(1)');
});

test('strips a disallowed event-handler attribute', () => {
    const out = sanitizeAnnouncementBody('<p onclick="evil()">text</p>');
    expect(out).not.toContain('onclick');
    expect(out).toContain('text');
});

test('removes empty paragraph-break artifacts', () => {
    expect(sanitizeAnnouncementBody('<p>real</p><p><br></p>')).toBe('<p>real</p>');
});

test('keeps img src on allowed images', () => {
    const out = sanitizeAnnouncementBody('<p><img src="https://example.com/a.png" alt="a"></p>');
    expect(out).toContain('src="https://example.com/a.png"');
});
