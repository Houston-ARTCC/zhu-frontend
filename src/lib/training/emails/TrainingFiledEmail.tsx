import React from 'react';
import { Heading, Link, Text } from '@react-email/components';
import { EmailLayout } from '@/lib/mailer/EmailLayout';

export interface TrainingFiledEmailProps {
    user: { first_name: string };
    session: {
        instructor: { full_name: string };
        start: string;
    };
}

export const TrainingFiledEmail: React.FC<TrainingFiledEmailProps> = ({ user, session }) => (
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
            with <strong>{session.instructor.full_name}</strong> has been filed!
        </Text>
        <Text>
            More information, including any notes taken throughout the session, can be found at the
            training center at{' '}
            <Link href="https://houston.center/training">https://houston.center/training</Link>.
        </Text>
        <Text>- The Houston Virtual ARTCC team</Text>
    </EmailLayout>
);
