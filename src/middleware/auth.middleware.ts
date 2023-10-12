import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Define a custom Request interface with a role property
interface CustomRequest extends Request {
    role?: string;
}

const authenticationMiddleware = (req: CustomRequest, res: Response, next: NextFunction) => {
    const authorization = req.headers.authorization;
    const token = authorization && authorization.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Token not found' });
    }
    try {
        const payload: any = jwt.verify(token, process.env.SECRET_KEY as string);
        req.role = payload.role;
        next();
    } catch (error) {
        console.log(error);
        return res.status(400).json({ message: 'Token Invalid' });
    }
};

interface AuthorizationMiddlewareOptions {
    role: string[];
}

const authorizationMiddleware = ({ role }: AuthorizationMiddlewareOptions) => (
    req: CustomRequest,
    res: Response,
    next: NextFunction
) => {
    if (!role.includes(req.role || '')) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    next();
};

export { authorizationMiddleware, authenticationMiddleware };
