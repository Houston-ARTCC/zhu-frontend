import React from 'react';
import { Heading, Text } from '@react-email/components';
import { EmailLayout } from '@/lib/mailer/EmailLayout';

export interface LoaRejectedEmailProps {
    user: { first_name: string };
    loa: { start: string; end: string };
    reason?: string;
}

export const LoaRejectedEmail: React.FC<LoaRejectedEmailProps> = ({ user, loa, reason }) => (
    <EmailLayout>
        <Heading as="h2">Hi {user.first_name},</Heading>
        <Text>
            Your leave of absence request from <strong>{loa.start}</strong> to{' '}
            <strong>{loa.end}</strong> was not approved.
        </Text>
        {reason && (
            <Text>
                <strong>Reason:</strong> {reason}
            </Text>
        )}
        <Text>If you have questions, reach out to staff.</Text>
        <Text>- The Houston Virtual ARTCC team</Text>
    </EmailLayout>
);
