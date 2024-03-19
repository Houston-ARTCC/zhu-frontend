import React, { useState } from 'react';
import { LuPlusCircle } from 'react-icons/lu';
import type { EndorsementBadgeProps } from '@/app/roster/ProfileBadges';
import { EndorsementBadge } from '@/app/roster/ProfileBadges';
import { ClientPortal } from '@/components/ClientPortal';
import { AddSoloModal } from './AddSoloModal';

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
            <ClientPortal>
                <AddSoloModal
                    update={onUpdate}
                    show={showSoloModal}
                    close={() => setShowSoloModal(false)}
                />
            </ClientPortal>
        </>
    );
};
