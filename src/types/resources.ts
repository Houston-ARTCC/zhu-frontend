export enum Category {
    VRC = 'vrc',
    VSTARS = 'vstars',
    VERAM = 'veram',
    VATIS = 'vatis',
    SOP = 'sop',
    LOA = 'loa',
    MAVP = 'mavp',
    Misc = 'misc',
}

export type Resource = {
    id: number;
    extension: string;
    size: string;
    name: string;
    category: Category;
    path: string;
    updated: string;
}

export type ResourceData = {
    [Category.VRC]: Resource[];
    [Category.VSTARS]: Resource[];
    [Category.VERAM]: Resource[];
    [Category.VATIS]: Resource[];
    [Category.SOP]: Resource[];
    [Category.LOA]: Resource[];
    [Category.MAVP]: Resource[];
    [Category.Misc]: Resource[];
}
