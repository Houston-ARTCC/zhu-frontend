export type Category = 'poly' | 'proc' | 'loa' | 'vatis' | 'rvm' | 'ref';

export const CATEGORY_STRING: { [key in Category]: string } = {
    poly: 'Policy',
    proc: 'Procedure',
    loa: 'LOA',
    vatis: 'vATIS Profile',
    rvm: 'RVM List',
    ref: 'Reference',
};

export type Resource = {
    id: number;
    extension: string;
    size: string;
    name: string;
    category: Category;
    path: string;
    updated: string;
};

export type ResourceData = { [key in Category]: Resource[] };
