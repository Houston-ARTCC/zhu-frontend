import { afterEach, expect, test, vi } from 'vitest';
import { getHomeFacility } from './homeFacility';

afterEach(() => {
    vi.restoreAllMocks();
});

test('non-USA division returns VAT-prefixed code without calling VATUSA', async () => {
    const fetchSpy = vi.spyOn(global, 'fetch');
    expect(await getHomeFacility(1, 'EUR')).toBe('VATEUR');
    expect(fetchSpy).not.toHaveBeenCalled();
});

test('USA division returns the VATUSA facility on 200', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValue(
        new Response(JSON.stringify({ data: { facility: 'ZHU' } }), { status: 200 }),
    );
    expect(await getHomeFacility(123, 'USA')).toBe('ZHU');
});

test('USA division returns VATUSA on a 404', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValue(new Response('', { status: 404 }));
    expect(await getHomeFacility(123, 'USA')).toBe('VATUSA');
});

test('USA division falls back to the existing facility on a non-200/404 error', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValue(new Response('', { status: 503 }));
    expect(await getHomeFacility(123, 'USA', 'ZLA')).toBe('ZLA');
});

test('USA division returns VATUSA on an error when there is no existing facility', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValue(new Response('', { status: 503 }));
    expect(await getHomeFacility(123, 'USA')).toBe('VATUSA');
});
