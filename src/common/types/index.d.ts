declare global {
    interface ReqUser {
        id: string;
        username: string;
        email: string;
        roles: string[];
    }
    namespace Express {
        // eslint-disable-next-line @typescript-eslint/no-empty-object-type
        interface User extends ReqUser {}
    }
}

export {};
