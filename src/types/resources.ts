export enum Category {
    POLY = 'POLY',
    PROC = 'PROC',
    LOA = 'LOA',
    VATIS = 'vATIS',
    RVM = 'RVM',
    REF = 'REF',
}

export const CATEGORY_STRING = {
    [Category.POLY]: 'Policy',
    [Category.PROC]: 'Procedure',
    [Category.LOA]: 'LOA',
    [Category.VATIS]: 'vATIS Profile',
    [Category.RVM]: 'RVM List',
    [Category.REF]: 'Reference',
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
    [Category.POLY]: Resource[];
    [Category.PROC]: Resource[];
    [Category.LOA]: Resource[];
    [Category.VATIS]: Resource[];
    [Category.RVM]: Resource[];
    [Category.REF]: Resource[];
}
