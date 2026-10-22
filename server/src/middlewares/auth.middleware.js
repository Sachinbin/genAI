import { verifyAccessToken } from "../utils/jwt.js";

export const authMiddleware = (req, res, next) => {
    const cookieToken = req.cookies?.accessToken;
    const authHeader = req.headers?.authorization;

    const headerToken =
        authHeader?.startsWith("Bearer ")
            ? authHeader.split(" ")[1]
            : null;

    const token = cookieToken || headerToken;

    if (!token) {
        return res.status(401).json({
            message: "Access denied. No token provided.",
        });
    }

    try {
        const decoded = verifyAccessToken(token);

        req.user = decoded;

        next();
    } catch (error) {
        return res.status(401).json({
            message: "Invalid or expired token.",
        });
    }
};