import { generateAccessToken, generateRefreshToken } from "../utils/jwt.js";

export const MAX_PASSWORD_BYTES = 72;
const ACCESS_TOKEN_MAX_AGE = 60 * 60 * 1000;
const REFRESH_TOKEN_MAX_AGE = 7 * 24 * 60 * 60 * 1000;

export const getCookieOptions = () => ({
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
});

export const setAuthCookies = (res, user) => {
    const cookieOptions = getCookieOptions();
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    // console.log("Setting cookies with accessToken:", accessToken, "and refreshToken:", refreshToken);

    res.cookie('accessToken', accessToken, {
        ...cookieOptions,
        maxAge: ACCESS_TOKEN_MAX_AGE,
    });
    res.cookie('refreshToken', refreshToken, {
        ...cookieOptions,
        maxAge: REFRESH_TOKEN_MAX_AGE,
    });
};