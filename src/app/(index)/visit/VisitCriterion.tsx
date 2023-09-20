import React from 'react';
import { LuCheck, LuX } from 'react-icons/lu';

interface VisitCriterionProps {
    status: boolean;
}

export const VisitCriterion: React.FC<VisitCriterionProps> = ({ status }) => (
    status
        ? <LuCheck size={25} className="text-emerald-400" />
        : <LuX size={25} className="text-red-400" />
);
