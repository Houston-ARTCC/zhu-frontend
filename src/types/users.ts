export type Role = {
    short: string;
    long: string;
};

export type Endorsements = {
    gnd: boolean | string;
    hou_gnd: boolean | string;
    iah_gnd: boolean | string;
    twr: boolean | string;
    hou_twr: boolean | string;
    iah_twr: boolean | string;
    app: boolean | string;
    i90_app: boolean | string;
    zhu: boolean | string;
};

export type BasicUser = {
    cid: number;
    first_name: string;
    last_name: string;
    initials: string;
    profile?: string;
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
    profile?: string;
    biography?: string;
    home_facility: string;
    status: number;
    initials: string;
    joined: string;
    endorsements: Endorsements;
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
};
