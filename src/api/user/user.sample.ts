import { Role, User } from "./user.schema";

// Example users for demo purposes
export const homies: User[] = [
    {
        username: "player1",
        password: "readysetgo",
        email: "player1@oasis.vr.com",
        roles: [Role.User],
    },
    {
        username: "CharlieBrown",
        password: "snoopyNo1",
        email: "charlie@peanuts.com",
        roles: [Role.User],
    },
    {
        username: "GLaDOS", // Official capitalization
        password: "glaDOSAllMighty",
        email: "glados@aperture.com",
        roles: [Role.Admin],
    },
    {
        username: "admin", // Add a boring user just in case forgetting the password
        password: "admin",
        email: "admin@contoso.com",
        roles: [Role.Admin],
    },
];
