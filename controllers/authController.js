const { StatusCodes } = require('http-status-codes');
const error = require('../errors/index');
const User = require('../models/User');

const { attachCookiesToResponse, createTokenUser } = require('../utils/index');

const register = async (req, res) => {
    const { name, email, password } = req.body;

    const isEmailFound = await User.findOne({ email });
    if (isEmailFound) throw new error.BadRequestError('Email already exist');

    const countDoc = (await User.countDocuments({})) === 0;
    const role = countDoc ? 'admin' : 'user';

    const user = await User.create({ name, email, password, role });
    const tokenUser = createTokenUser(user);
    attachCookiesToResponse({ res, user: tokenUser });
    
    res.status(StatusCodes.CREATED).json({ user: tokenUser });
};

const login = async (req, res) => {

	const { email, password } = req.body;
	if (!email || !password) throw new error.BadRequestError('please provide both email and password');

	const user = await User.findOne({ email });
    if (!user) throw new error.UnauthenticatedError('Invalid Email please register First');

	const isPasswordTrue = await user.comparePassword(password);
	if (!isPasswordTrue) throw new error.UnauthenticatedError('invalid password');

	const tokenUser = createTokenUser(user);
    attachCookiesToResponse({ res, user: tokenUser });
    console.log(req.signedCookies);
	res.status(StatusCodes.CREATED).json({ user: tokenUser });
};


const logout = async (req, res) => {

    res.cookie('token', "COOKIE_DESTROYED", {
        expires: new Date(Date.now())
    })
    res.status(StatusCodes.OK).json({ msg: 'LOGOUT_SUCCESSFUL' });
};

module.exports = {
	register,
	login,
	logout
};

