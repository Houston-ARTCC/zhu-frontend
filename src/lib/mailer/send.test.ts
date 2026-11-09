import React from 'react';
import { expect, test } from 'vitest';
import { sendMail } from './send';

test('sendMail renders the React element and returns html and text', async () => {
    const result = await sendMail({
        to: 'recipient@example.com',
        subject: 'Smoke test',
        react: React.createElement('div', null, 'Hello, mailer'),
    });

    expect(result.html).toContain('Hello, mailer');
    expect(result.text).toContain('Hello, mailer');
    expect(result.messageId).toBeUndefined();
});
