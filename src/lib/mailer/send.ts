import 'server-only';
import { type ReactElement } from 'react';
import { render } from '@react-email/render';
import { DEFAULT_FROM, transport } from './transport';

export interface SendMailArgs {
    to: string;
    cc?: string;
    subject: string;
    react: ReactElement;
    from?: string;
}

export interface SendMailResult {
    html: string;
    text: string;
    messageId?: string;
}

export async function sendMail({ to, cc, subject, react, from }: SendMailArgs): Promise<SendMailResult> {
    const html = await render(react);
    const text = await render(react, { plainText: true });

    const { messageId } = await transport.sendMail({
        from: from ?? DEFAULT_FROM,
        to,
        ...(cc ? { cc } : {}),
        subject,
        html,
        text,
    });

    return { html, text, messageId };
}
