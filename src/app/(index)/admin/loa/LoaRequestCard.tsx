'use client';

import React from 'react';
import { format } from 'date-fns';
import { Card } from '@/components/Card';
import { type LoaRequest } from '@/types/admin';
import { RejectRequestButton } from './RejectRequestModal';
import { ApproveRequestButton } from './ApproveRequestModal';

interface LoaRequestCardProps {
    request: LoaRequest;
}

export const LoaRequestCard: React.FC<LoaRequestCardProps> = ({ request }) => (
    <Card className="flex flex-col">
        <h4 className="text-xl font-bold">
            {request.user.first_name} {request.user.last_name}
        </h4>
        <p className="mb-3 font-medium text-slate-500">
            {format(new Date(request.start), 'MMM dd, yyyy')}
            {' \u2013 '}
            {format(new Date(request.start), 'MMM dd, yyyy')}
        </p>

        <blockquote className="mb-5 border-l-4 border-l-slate-200 pl-4">
            {request.remarks}
        </blockquote>

        <div className="mt-auto flex gap-3">
            <RejectRequestButton request={request} />
            <ApproveRequestButton request={request} />
        </div>
    </Card>
);
