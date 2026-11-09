import React from 'react';
import { Heading, Text } from '@react-email/components';
import { EmailLayout } from '@/lib/mailer/EmailLayout';

export interface TrainingScheduledEmailProps {
    user: { first_name: string };
    session: {
        instructor: { full_name: string };
        start: string;
        end: string;
        position: string | null;
        type_display: string;
        level_display: string;
    };
}

export const TrainingScheduledEmail: React.FC<TrainingScheduledEmailProps> = ({ user, session }) => (
    <EmailLayout>
        <Heading as="h2">Hi {user.first_name},</Heading>
        <Text>
            Your training request has been picked up by a member of training staff and a training
            session has been scheduled.
        </Text>
        <Text>Here are the details of the session:</Text>
        <ul>
            <li><strong>Instructor:</strong> {session.instructor.full_name}</li>
            <li>
                <strong>Date:</strong>{' '}
                {new Date(session.start).toLocaleDateString(
                    'en-US',
                    { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' },
                )}
            </li>
            <li><strong>Start:</strong> {new Date(session.start).toISOString().slice(11, 16)}z</li>
            <li><strong>End:</strong> {new Date(session.end).toISOString().slice(11, 16)}z</li>
            <li><strong>Position:</strong> {session.position ?? 'N/A'}</li>
            <li><strong>Type:</strong> {session.type_display}</li>
            <li><strong>Level:</strong> {session.level_display}</li>
        </ul>
        <Text>- The Houston Virtual ARTCC team</Text>
    </EmailLayout>
);
