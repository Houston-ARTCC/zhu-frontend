export enum Category {
    VRC = 'vrc',
    VSTARS = 'vstars',
    VERAM = 'veram',
    VATIS = 'vatis',
    SOP = 'sop',
    MAVP = 'mavp',
    Misc = 'misc',
}

export const CATEGORY_STRING = {
    [Category.VRC]: 'VRC',
    [Category.VSTARS]: 'vSTARS',
    [Category.VERAM]: 'vERAM',
    [Category.VATIS]: 'vATIS',
    [Category.SOP]: 'SOP',
    [Category.MAVP]: 'MAVP',
    [Category.Misc]: 'Miscellaneous',
};

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
    [Category.MAVP]: Resource[];
    [Category.Misc]: Resource[];
}
