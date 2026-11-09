import 'server-only';
import nodemailer, { type Transporter } from 'nodemailer';

export const DEFAULT_FROM = process.env.SMTP_FROM ?? 'no-reply@houston.center';

export const FROM_MANAGEMENT = 'Houston ARTCC <management@houston.center>';
export const FROM_TRAINING = 'Houston ARTCC <training@houston.center>';

interface SendArgs {
    from: string;
    to: string;
    cc?: string;
    subject: string;
    html: string;
    text: string;
}

interface MinimalTransport {
    sendMail: (args: SendArgs) => Promise<{ messageId?: string }>;
}

function realTransport(): MinimalTransport {
    const transporter: Transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT ?? 587),
        auth: process.env.SMTP_USER && process.env.SMTP_PASS
            ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
            : undefined,
    });
    return {
        sendMail: async (args) => {
            const info = await transporter.sendMail(args);
            return { messageId: info.messageId };
        },
    };
}

function consoleTransport(): MinimalTransport {
    return {
        sendMail: async (args) => {
            const cc = args.cc ? ` CC=${args.cc}` : '';
            console.log(
                `[mailer:dev] To=${args.to}${cc} Subject=${args.subject}\n---HTML---\n${args.html}\n---TEXT---\n${args.text}`,
            );
            return {};
        },
    };
}

export const transport: MinimalTransport = process.env.SMTP_HOST ? realTransport() : consoleTransport();
