const { isTokenValid } = require('../utils/index');
const customError = require('../errors/index');

const authenticateUser = async (req, res, next) => {
    
    const token = req.signedCookies.token;
    
    if (!token) {
        throw new customError.UnauthenticatedError('token invalid');
    }
    try {
        const { name, role, userId } = isTokenValid({ token });
        req.user = { name, role, userId };
        
        next();
    }
    catch (err) {
        throw new customError.UnauthenticatedError('token invalid');
    }
    
};

const authorizePermission = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role))
            throw new customError.unauthorizedError('Access forbidden');
        next();
    }
}

module.exports = { authenticateUser,authorizePermission}