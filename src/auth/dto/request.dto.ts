import { Request } from "express";

export interface AutentificatedRequestDto extends Request {
    user: {
        userId: number;
        email: string;
        roles: Array<string>;
    };
}