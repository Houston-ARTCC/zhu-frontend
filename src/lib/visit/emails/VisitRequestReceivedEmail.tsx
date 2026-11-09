import React from 'react';
import { Heading, Text } from '@react-email/components';
import { EmailLayout } from '@/lib/mailer/EmailLayout';

export interface VisitRequestReceivedEmailProps {
    user: { first_name: string };
}

export const VisitRequestReceivedEmail: React.FC<VisitRequestReceivedEmailProps> = ({ user }) => (
    <EmailLayout>
        <Heading as="h2">Hi {user.first_name},</Heading>
        <Text>
            We have received your request to visit the Virtual Houston ARTCC. Please hold tight
            while our administration reviews your visiting request. You will be notified once
            this is done.
        </Text>
        <Text>- The Houston Virtual ARTCC team</Text>
    </EmailLayout>
);
