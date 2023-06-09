export type Role = {
    short: string;
    long: string;
};

export type BasicUser = {
    cid: number;
    first_name: string;
    last_name: string;
    initials: string;
    profile: string;
};

export type User = {
    cid: number;
    rating: {
        short: string;
        long: string;
    };
    roles: Role[];
    first_name: string;
    last_name: string;
    profile: string;
    biography?: string;
    home_facility: string;
    status: number;
    initials: string;
    joined: string;
    del_cert: number;
    gnd_cert: number;
    twr_cert: number;
    app_cert: number;
    ctr_cert: number;
    ocn_cert: number;
    solo_facility?: string;
    cic_endorsed: boolean;
};

export type Staff = {
    atm: {
        user: BasicUser | null;
    };
    datm: {
        user: BasicUser | null;
    };
    ta: {
        user: BasicUser | null;
        assistants: BasicUser[];
    };
    fe: {
        user: BasicUser | null;
        assistants: BasicUser[];
    };
    ec: {
        user: BasicUser | null;
        assistants: BasicUser[];
    };
    wm: {
        user: BasicUser | null;
        assistants: BasicUser[];
    };
    ins: BasicUser[];
    mtr: BasicUser[];
    web: BasicUser[];
};

export type Roster = {
    home: User[];
    visiting: User[];
    mavp: User[];
};
