import React from 'react';
import { Heading, Text } from '@react-email/components';
import { EmailLayout } from '@/lib/mailer/EmailLayout';

export interface LoaCancelledEmailProps {
    user: { first_name: string };
    loa: { start: string; end: string };
}

export const LoaCancelledEmail: React.FC<LoaCancelledEmailProps> = ({ user, loa }) => (
    <EmailLayout>
        <Heading as="h2">Hi {user.first_name},</Heading>
        <Text>
            Your approved leave of absence from <strong>{loa.start}</strong> to{' '}
            <strong>{loa.end}</strong> has been cancelled by staff. Contact us if you have
            questions.
        </Text>
        <Text>- The Houston Virtual ARTCC team</Text>
    </EmailLayout>
);
