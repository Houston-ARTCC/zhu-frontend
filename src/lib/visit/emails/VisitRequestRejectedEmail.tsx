import React from 'react';
import { Heading, Text } from '@react-email/components';
import { EmailLayout } from '@/lib/mailer/EmailLayout';

export interface VisitRequestRejectedEmailProps {
    user: { first_name: string };
    reason?: string;
}

export const VisitRequestRejectedEmail: React.FC<VisitRequestRejectedEmailProps> = ({ user, reason }) => (
    <EmailLayout>
        <Heading as="h2">Hi {user.first_name},</Heading>
        <Text>
            Your visiting request was not approved. We are unable to add you to our roster at
            this time.
        </Text>
        {reason && (
            <Text>
                <strong>Reason:</strong> {reason}
            </Text>
        )}
        <Text>- The Houston Virtual ARTCC team</Text>
    </EmailLayout>
);
