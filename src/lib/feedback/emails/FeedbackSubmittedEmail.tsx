import React from 'react';
import { Heading, Text } from '@react-email/components';
import type { AuthenticatedBasicUser } from '@/types/users';
import { EmailLayout } from '@/lib/mailer/EmailLayout';

export interface FeedbackSubmittedEmailProps {
    user: Pick<AuthenticatedBasicUser, 'first_name'>;
    feedback: {
        controller?: Pick<AuthenticatedBasicUser, 'first_name' | 'last_name'>;
    };
}

export const FeedbackSubmittedEmail: React.FC<FeedbackSubmittedEmailProps> = ({ user, feedback }) => {
    const controllerName = feedback.controller
        ? `${feedback.controller.first_name} ${feedback.controller.last_name}`
        : 'the Houston ARTCC';

    return (
        <EmailLayout>
            <Heading as="h2">Hi {user.first_name},</Heading>
            <Text>
                Thank you for submitting feedback for <strong>{controllerName}</strong>. Our staff
                will review it shortly. If approved, it will be shared with the controller.
            </Text>
            <Text>- The Houston Virtual ARTCC team</Text>
        </EmailLayout>
    );
};
