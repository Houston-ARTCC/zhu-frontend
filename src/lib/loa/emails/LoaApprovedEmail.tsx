import React from 'react';
import { Heading, Text } from '@react-email/components';
import { EmailLayout } from '@/lib/mailer/EmailLayout';

export interface LoaApprovedEmailProps {
    user: { first_name: string };
    loa: { start: string; end: string };
}

export const LoaApprovedEmail: React.FC<LoaApprovedEmailProps> = ({ user, loa }) => (
    <EmailLayout>
        <Heading as="h2">Hi {user.first_name},</Heading>
        <Text>
            Your leave of absence from <strong>{loa.start}</strong> to <strong>{loa.end}</strong>{' '}
            has been approved. Enjoy the time off.
        </Text>
        <Text>- The Houston Virtual ARTCC team</Text>
    </EmailLayout>
);
