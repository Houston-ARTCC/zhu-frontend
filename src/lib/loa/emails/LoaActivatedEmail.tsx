import React from 'react';
import { Heading, Text } from '@react-email/components';
import { EmailLayout } from '@/lib/mailer/EmailLayout';

export interface LoaActivatedEmailProps {
    user: { first_name: string };
    loa: { start: string; end: string };
}

export const LoaActivatedEmail: React.FC<LoaActivatedEmailProps> = ({ user, loa }) => (
    <EmailLayout>
        <Heading as="h2">Hi {user.first_name},</Heading>
        <Text>
            You have been placed on a leave of absence. You are not expected to fulfill currency
            requirements during your leave, however, you may still be expected to fulfill them by
            the end of the quarter.
        </Text>
        <Text>
            As a reminder, your LOA will be in effect from <strong>{loa.start}</strong> until{' '}
            <strong>{loa.end}</strong>.
        </Text>
        <Text>- The Houston Virtual ARTCC team</Text>
    </EmailLayout>
);
