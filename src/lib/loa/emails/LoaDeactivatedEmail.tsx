import React from 'react';
import { Heading, Text } from '@react-email/components';
import { EmailLayout } from '@/lib/mailer/EmailLayout';

export interface LoaDeactivatedEmailProps {
    user: { first_name: string };
}

export const LoaDeactivatedEmail: React.FC<LoaDeactivatedEmailProps> = ({ user }) => (
    <EmailLayout>
        <Heading as="h2">Hi {user.first_name},</Heading>
        <Text>Welcome back from your leave of absence!</Text>
        <Text>
            You are now subject to quarterly currency requirements. If your leave impacts your
            ability to meet these requirements by the end of the quarter, please reach out to the
            ATM or DATM through Discord or by sending an email to management@houston.center to
            avoid being erroneously removed from the roster.
        </Text>
        <Text>- The Houston Virtual ARTCC team</Text>
    </EmailLayout>
);
