import { NextFunction, Request, Response } from 'express';
import { validateSid } from '../services/qnap-api';
import { Cookies } from '../types/types';

export default async function (req: Request, res: Response, next: NextFunction) {
    const cookies = req.cookies as Cookies;

    if (!cookies) {
        res.redirect('/login');
    } else {
        const sidValid = await validateSid(cookies.sid);
        if (((await sidValid.json()) as { status: number }).status === 1) {
            next();
        } else {
            res.redirect('/login');
        }
    }
}
