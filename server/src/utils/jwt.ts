import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'yourSuperSecretKey';

export const generateToken = (payload: object, expiresIn: string = '1h') => {
    return jwt.sign(payload, JWT_SECRET);
};

export const verifyToken = (token: string) => {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (error) {
        return null
    }
};
