import React from 'react';
import { Heading, Text } from '@react-email/components';
import { EmailLayout } from '@/lib/mailer/EmailLayout';

export interface TrainingCancelledEmailProps {
    user: { first_name: string };
    session: {
        instructor: { full_name: string };
        start: string;
    };
}

export const TrainingCancelledEmail: React.FC<TrainingCancelledEmailProps> = ({ user, session }) => (
    <EmailLayout>
        <Heading as="h2">Hi {user.first_name},</Heading>
        <Text>
            Your training session on{' '}
            <strong>
                {new Date(session.start).toLocaleDateString(
                    'en-US',
                    { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' },
                )}
            </strong>{' '}
            with <strong>{session.instructor.full_name}</strong> has been cancelled.
            Please contact your instructor if you believe this was a mistake.
        </Text>
        <Text>- The Houston Virtual ARTCC team</Text>
    </EmailLayout>
);
