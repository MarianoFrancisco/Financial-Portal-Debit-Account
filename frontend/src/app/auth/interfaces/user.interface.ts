export enum AuthStatus {
    Checking,
    Authenticated,
    NotAuthenticated
}

export interface Tokens {
    token:          string;
    refreshToken?:   string;
}

export interface User {
    id:                number;
    username:          string;
    name:              string;
    lastname:          string;
    email:             string;
    pin:               string;
    phone:             string;
    genre:             string;
    registration_date: number;
    active:            number;
    notifyme:         number;
    role_id:          number;
}