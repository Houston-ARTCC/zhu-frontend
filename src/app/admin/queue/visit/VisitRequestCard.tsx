import React from 'react';
import { Card } from '@/components/Card';
import { type VisitRequest } from '@/types/visit';
import { RejectRequestButton } from '../RejectRequestModal';
import { ApproveRequestButton } from '../ApproveRequestModal';

interface VisitRequestCardProps {
    request: VisitRequest;
}

export const VisitRequestCard: React.FC<VisitRequestCardProps> = ({ request }) => (
    <Card className="flex flex-col">
        <h4 className="text-xl font-bold">
            {request.user.first_name} {request.user.last_name}
        </h4>
        <p className="mb-3 font-medium text-slate-500">
            from {request.user.home_facility}
        </p>

        <p>
            <b>CID: </b> {request.user.cid}
        </p>
        <p className="mb-3">
            <b>Rating: </b> {request.user.rating.long}
        </p>

        <blockquote className="mb-5 border-l-4 border-l-slate-200 pl-4">
            {request.reason}
        </blockquote>

        <div className="mt-auto flex gap-3">
            <RejectRequestButton
                title="Reject Visiting Request"
                confirmation={`Are you sure you would like to reject ${request.user.first_name} ${request.user.last_name}'s visiting request?`}
                needsReason
                endpoint={`/visit/${request.id}/`}
                toastConfig={{
                    pending: 'Rejecting visiting request',
                    success: 'Successfully rejected',
                }}
            />
            <ApproveRequestButton
                title="Approve Visiting Request"
                confirmation={`Are you sure you would like to approve ${request.user.first_name} ${request.user.last_name}'s visiting request?`}
                endpoint={`/visit/${request.id}/`}
                toastConfig={{
                    pending: 'Approving visiting request',
                    success: 'Successfully approved',
                }}
            />
        </div>
    </Card>
);
