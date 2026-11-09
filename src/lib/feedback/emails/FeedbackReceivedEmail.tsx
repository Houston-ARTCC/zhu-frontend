import React from 'react';
import { Heading, Text } from '@react-email/components';
import type { AuthenticatedBasicUser } from '@/types/users';
import { EmailLayout } from '@/lib/mailer/EmailLayout';

export interface FeedbackReceivedEmailProps {
    user: Pick<AuthenticatedBasicUser, 'first_name'>;
    feedback: {
        rating: number;
        pilot_callsign?: string;
        event?: { name: string };
        comments: string;
    };
}

export const FeedbackReceivedEmail: React.FC<FeedbackReceivedEmailProps> = ({ user, feedback }) => {
    const stars = '*'.repeat(feedback.rating);

    return (
        <EmailLayout>
            <Heading as="h2">Hi {user.first_name},</Heading>
            <Text>You have received new feedback from a pilot.</Text>
            <Text>
                <strong>Rating:</strong> {stars} ({feedback.rating}/5)
            </Text>
            {feedback.pilot_callsign && (
                <Text>
                    <strong>Pilot callsign:</strong> {feedback.pilot_callsign}
                </Text>
            )}
            {feedback.event && (
                <Text>
                    <strong>Event:</strong> {feedback.event.name}
                </Text>
            )}
            <Text>
                <strong>Comments:</strong>
            </Text>
            <Text>{feedback.comments}</Text>
            <Text>- The Houston Virtual ARTCC team</Text>
        </EmailLayout>
    );
};
