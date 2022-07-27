const customError = require('../errors/index');
const { route } = require('../routes/authRoute');

const checkPermission = (requestUser, resourceUserId) => {
    
	if (requestUser.role === 'admin') return;
	if (requestUser.userId === resourceUserId.toString()) return;
	throw new CustomError.UnauthorizedError('Not authorized to access this route');
};

module.exports = checkPermission;
