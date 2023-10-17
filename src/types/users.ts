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

export type AuthenticatedBasicUser = BasicUser & {
    email: string;
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
    del_cert: 0 | 1 | 2 | 3;
    gnd_cert: 0 | 1 | 2 | 3;
    twr_cert: 0 | 1 | 2 | 3;
    app_cert: 0 | 1 | 2 | 3;
    ctr_cert: 0 | 1 | 2 | 3;
    solo_facility?: string;
    cic_endorsed: boolean;
};

export type AuthenticatedUser = User & {
    email: string;
    last_login: string;
    prevent_event_signup: boolean;
};

export type Staff = {
    atm: {
        user?: BasicUser;
    };
    datm: {
        user?: BasicUser;
    };
    ta: {
        user?: BasicUser;
        assistants: BasicUser[];
    };
    fe: {
        user?: BasicUser;
        assistants: BasicUser[];
    };
    ec: {
        user?: BasicUser;
        assistants: BasicUser[];
    };
    wm: {
        user?: BasicUser;
        assistants: BasicUser[];
    };
    ins: BasicUser[];
    mtr: BasicUser[];
    web: BasicUser[];
};

export type Roster<T extends BasicUser = User> = {
    home: T[];
    visiting: T[];
    mavp: T[];
};
