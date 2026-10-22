import jwt from 'jsonwebtoken';

const getTokenSecrets = () => {
    const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
    const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;

    if (!accessTokenSecret || !refreshTokenSecret) {
        throw new Error('ACCESS_TOKEN_SECRET and REFRESH_TOKEN_SECRET must be configured');
    }
    if (accessTokenSecret === refreshTokenSecret) {
        throw new Error('Access and refresh token secrets must be different');
    }

    return { accessTokenSecret, refreshTokenSecret };
};

export const generateAccessToken = (user) => {
    
    const { accessTokenSecret } = getTokenSecrets();
    return jwt.sign(
        { id: user._id.toString(), email: user.email },
        accessTokenSecret,
        { expiresIn: '1h', algorithm: 'HS256' },
    );
};

export const generateRefreshToken = (user) => {
    const { refreshTokenSecret } = getTokenSecrets();
    return jwt.sign(
        { id: user._id.toString(), email: user.email },
        refreshTokenSecret,
        { expiresIn: '7d', algorithm: 'HS256' },
    );
};

export const verifyAccessToken = (token) => {
    const { accessTokenSecret } = getTokenSecrets();

    try {
        return jwt.verify(token, accessTokenSecret, { algorithms: ['HS256'] });
    } catch {
        throw new Error('Invalid token');
    }
};

