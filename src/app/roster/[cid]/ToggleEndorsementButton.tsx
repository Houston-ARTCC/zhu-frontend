import React, { useState } from 'react';
import { LuPlusCircle } from 'react-icons/lu';
import ReactDOM from 'react-dom';
import { AddSoloModal } from '@/app/roster/[cid]/AddSoloModal';
import type { EndorsementBadgeProps } from '@/app/roster/ProfileBadges';
import { EndorsementBadge } from '@/app/roster/ProfileBadges';

interface CertDropdownProps extends EndorsementBadgeProps {
    onUpdate: (status: boolean | string) => void;
}

export const ToggleEndorsementButton: React.FC<CertDropdownProps> = ({ tier, name, status, onUpdate }) => {
    const [showSoloModal, setShowSoloModal] = useState<boolean>(false);

    return (
        <>
            <button type="button" onClick={() => onUpdate(status !== true)}>
                <EndorsementBadge tier={tier} name={name} status={status}>
                    {tier === 0 && (status === true || status === false) && (
                        <button
                            className="absolute left-1.5"
                            aria-label="Add Solo Endorsement"
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                setShowSoloModal(true);
                            }}
                        >
                            <LuPlusCircle size={15} />
                        </button>
                    )}
                </EndorsementBadge>
            </button>
            {ReactDOM.createPortal(
                <AddSoloModal
                    update={onUpdate}
                    show={showSoloModal}
                    close={() => setShowSoloModal(false)}
                />,
                document.body,
            )}
        </>
    );
};
