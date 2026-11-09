import React from 'react';
import { Heading, Link, Text } from '@react-email/components';
import { EmailLayout } from '@/lib/mailer/EmailLayout';

export interface ActivityReminderEmailProps {
    user: { first_name: string; rating: string };
}

export const ActivityReminderEmail: React.FC<ActivityReminderEmailProps> = ({ user }) => (
    <EmailLayout>
        <Heading as="h2">Hi {user.first_name},</Heading>
        <Text>
            You are receiving this email to inform you that you have not fulfilled your quarterly activity
            requirements as per General Policy P0001, Chapter 3, Section 3. This may put you at risk for
            removal from the Houston ARTCC controller roster.
        </Text>
        {user.rating === 'OBS' && (
            <Text>
                If you have been actively filing training requests, you may ignore this email. Observers who
                are making a good faith effort to complete their training are exempt from this requirement.
            </Text>
        )}
        <Text>
            Please sign in at{' '}
            <Link href="https://houston.center/dashboard/status">https://houston.center/dashboard/status</Link>
            {' '}to see your current status for the quarter.
        </Text>
        <Text>- The Houston Virtual ARTCC team</Text>
    </EmailLayout>
);
