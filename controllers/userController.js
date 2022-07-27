const User = require('../models/User');
const { StatusCodes } = require('http-status-codes');
const customError = require('../errors/index');
const { custom } = require('joi');
const { createTokenUser, attachCookiesToResponse } = require('../utils');
const { findOne } = require('../models/User');
const checkPermission = require('../utils/checkPermission');

const getAllUsers = async (req, res) => {
    console.log(req.user);
	const users = await User.find({ role: 'user' }).select('-password');
	res.status(StatusCodes.OK).json({ users });
};

const getSingleUser = async (req, res) => {
	//console.log(req.user);
	 const user = await User.findOne({ _id: req.params.id }).select('-password');
  if (!user) {
    throw new CustomError.NotFoundError(`No user with id : ${req.params.id}`);
  }
  checkPermission(req.user, user._id);
  res.status(StatusCodes.OK).json({ user });	
};

const showCurrentUser = async (req, res) => {
	res.status(StatusCodes.OK).json({ user: req.user });
};


const updateUser = async (req, res) => {

	const { email, name } = req.body;
	if (!email || !name) throw new customError.BadRequestError('provide both values');
	const user = await User.findOne({ _id: req.user.userId });

	user.email = email;
	user.name = name;
	await user.save();

	const tokenUser = createTokenUser(user);
	attachCookiesToResponse({ res, user: tokenUser });

	res.status(StatusCodes.OK).json({ user: tokenUser });
};


const updateUserPassword = async (req, res) => {

	const { oldPassword, newPassword } = req.body;
	if (!oldPassword || !newPassword) throw new customError.BadRequestError('provide both passwords');

	const user = await User.findOne({ _id: req.user.userId });

	const isPasswordCorrect = user.comparePassword(oldPassword);
	if (!isPasswordCorrect) throw new customError.UnauthenticatedError('Invalid credentials');

	user.password = newPassword;
	await user.save();

	res.status(StatusCodes.OK).json({ msg: 'password updation success' });
};

module.exports = {
	getAllUsers,
	getSingleUser,
	updateUser,
	updateUserPassword,
	showCurrentUser
};
