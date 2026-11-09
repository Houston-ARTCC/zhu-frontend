import React, { type PropsWithChildren } from 'react';
import {
    Body,
    Container,
    Head,
    Hr,
    Html,
    Tailwind,
    Text,
} from '@react-email/components';

export const EmailLayout: React.FC<PropsWithChildren> = ({ children }) => (
    <Html>
        <Head />
        <Tailwind>
            <Body className="bg-white font-sans">
                <Container className="mx-auto max-w-xl px-6 py-8">
                    {children}
                    <Hr className="my-6 border-gray-200" />
                    <Text className="text-xs text-gray-500">
                        Houston Virtual ARTCC - this is an automated message; do not reply.
                    </Text>
                </Container>
            </Body>
        </Tailwind>
    </Html>
);
