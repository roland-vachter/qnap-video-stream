import { NextFunction, Request, Response } from 'express';
import { validateSid } from '../services/qnap-api';

export default async function (req: Request, res: Response, next: NextFunction) {
    if (!req.cookies.sid) {
        res.redirect('/login');
    } else {
        const sidValid = await validateSid(req.cookies.sid);
        if ((await sidValid.json()).status === 1) {
            next();
        } else {
            res.redirect('/login');
        }
    }
}