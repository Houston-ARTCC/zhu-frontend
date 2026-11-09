import { expect, test } from 'vitest';
import { getAdminNotifications } from './repository';

test('getAdminNotifications returns the four count fields as non-negative numbers', async () => {
    const notifications = await getAdminNotifications();

    for (const value of [
        notifications.visiting_applications,
        notifications.pending_feedback,
        notifications.support_requests,
        notifications.loa_requests,
    ]) {
        expect(typeof value).toBe('number');
        expect(value).toBeGreaterThanOrEqual(0);
    }
});
