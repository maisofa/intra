export interface User {
    id: string;
    name: string;
    password: string;
    email: string;
}

export type UserCookieData = Pick<User, 'id' | 'name'>;