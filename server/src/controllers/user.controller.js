import User from '../models/user.model.js';
import { MAX_PASSWORD_BYTES,setAuthCookies,getCookieOptions} from '../constant/auth.constant.js';
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const registerUser = async (req, res) => {
    const { name, email, password } = req.body ?? {};

    if (
        typeof name !== 'string' ||
        typeof email !== 'string' ||
        typeof password !== 'string'
    ) {
        return res.status(400).json({ message: 'Please provide a valid name, email and password' });
    }

    const normalizedName = name.trim();
    const normalizedEmail = email.trim().toLowerCase();
    const passwordBytes = Buffer.byteLength(password, 'utf8');

    if (!normalizedName || normalizedName.length > 100) {
        return res.status(400).json({ message: 'Name must be between 1 and 100 characters' });
    }
    if (!isValidEmail(normalizedEmail) || normalizedEmail.length > 254) {
        return res.status(400).json({ message: 'Please provide a valid email address' });
    }
    if (password.length < 8 || passwordBytes > MAX_PASSWORD_BYTES) {
        return res.status(400).json({ message: 'Password must be at least 8 characters and no more than 72 bytes' });
    }

    try {
        const existingUser = await User.findOne({ email: normalizedEmail }).select('_id');
        if (existingUser) {
            return res.status(409).json({ message: 'User already exists' });
        }

        const user = await User.create({
            name: normalizedName,
            email: normalizedEmail,
            password,
        });

        setAuthCookies(res, user);
        return res.status(201).json({ message: 'User created successfully' , user: { name: user.name, email: user.email } });
    } catch (error) {
        if (error?.code === 11000) {
            return res.status(409).json({ message: 'User already exists' });
        }
        console.error('Failed to register user:', error?.name ?? 'UnknownError', error?.code ?? '');
        return res.status(500).json({ message: 'Unable to create user' });
    }
};

const loginUser = async (req, res) => {
    const { email, password } = req.body ?? {};

    if (
        typeof email !== 'string' ||
        typeof password !== 'string' ||
        !isValidEmail(email.trim()) ||
        email.trim().length > 254 ||
        !password ||
        Buffer.byteLength(password, 'utf8') > MAX_PASSWORD_BYTES
    ) {
        return res.status(400).json({ message: 'Please provide a valid email and password' });
    }

    try {
        const normalizedEmail = email.trim().toLowerCase();
        const user = await User.findOne({ email: normalizedEmail });
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        setAuthCookies(res, user);
        return res.status(200).json({ message: 'Login successful' ,user: { name: user.name, email: user.email } });
    } catch (error) {
        console.error('Failed to log in user:', error?.name ?? 'UnknownError', error?.code ?? '');
        return res.status(500).json({ message: 'Unable to log in' ,error: error?.message ?? 'Internal Server Error'});
    }
};

const getMe = async (req, res) => {
    if (!req.user?.id) {
        return res.status(401).json({ message: 'Authentication required' });
    }

    try {
        const user = await User.findById(req.user.id).select('-password -__v');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        return res.status(200).json(user);
    } catch (error) {
        console.error('Failed to fetch user data:', error?.name ?? 'UnknownError', error?.code ?? '');
        return res.status(500).json({ message: 'Unable to fetch user data' });
    }
};

const logoutUser = (req, res) => {
    const cookieOptions = getCookieOptions();
    res.clearCookie('accessToken', cookieOptions);
    res.clearCookie('refreshToken', cookieOptions);
    return res.status(200).json({ message: 'Logout successful' });
};

export { registerUser, loginUser, logoutUser, getMe };
