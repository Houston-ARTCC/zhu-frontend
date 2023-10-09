import React from 'react';
import { LuArrowRight, LuMail } from 'react-icons/lu';
import { format } from 'date-fns-tz';
import { HiOutlineCalendar, HiOutlineClock } from 'react-icons/hi2';
import { Card } from '@/components/Card';
import { type SupportRequest } from '@/types/admin';
import { RejectRequestButton } from '../RejectRequestModal';
import { ApproveRequestButton } from '../ApproveRequestModal';

interface VisitRequestCardProps {
    request: SupportRequest;
}

export const SupportRequestCard: React.FC<VisitRequestCardProps> = ({ request }) => (
    <Card className="flex flex-col">
        <h4 className="text-xl font-bold">
            {request.name}
        </h4>
        <p className="mb-3 font-medium text-slate-500">
            Presented by {request.host}
        </p>

        <div className="mb-2 flex items-center gap-3">
            <HiOutlineCalendar size={23} />
            <span className="font-medium">{format(new Date(request.start), 'MMM d, y')}</span>
        </div>
        <div className="mb-3 flex items-center gap-3">
            <HiOutlineClock size={23} />
            <span className="flex items-center gap-1.5 font-medium">
                {format(new Date(request.start), 'HH:mm zzz')}
                <LuArrowRight />
                {format(new Date(request.end), 'HH:mm zzz')}
            </span>
        </div>

        <blockquote className="mb-3 border-l-4 border-l-slate-200 pl-4">
            {request.description}
        </blockquote>

        <p>Requested by</p>
        <p className="mb-5 flex items-center gap-2">
            <b className="font-medium">{request.user.first_name} {request.user.last_name} ({request.user.cid})</b>
            <a className="text-inherit" href={`mailto:${request.user.email}`}>
                <LuMail size={18} />
            </a>
        </p>

        <div className="mt-auto flex gap-3">
            <RejectRequestButton
                title="Reject Visiting Request"
                confirmation={`Are you sure you would like to reject the support request for ${request.name}?`}
                endpoint={`/events/support/${request.id}/`}
                toastConfig={{
                    pending: 'Rejecting Support request',
                    success: 'Successfully rejected',
                }}
            />
            <ApproveRequestButton
                title="Approve Support Request"
                confirmation={`Are you sure you would like to approve the support request for ${request.name}?`}
                endpoint={`/events/support/${request.id}/`}
                toastConfig={{
                    pending: 'Approving support request',
                    success: 'Successfully approved',
                }}
            />
        </div>
    </Card>
);
