const CustomError = require('../errors');
const { isTokenValid } = require('../utils');

const authenticateUser = async (req, res, next) => {
  const token = req.signedCookies.token;

  if (!token) {
    throw new CustomError.UnauthenticatedError('Authentication Invalid');
  }
  try {
    const {
      fullName,
      username,
      city,
      status,
      zip,
      state,
      country,
      email,
      phone,
      referralId,
      userId,
      role,
    } = isTokenValid({ token });
    req.user = {
      fullName,
      username,
      city,
      zip,
      status,
      state,
      country,
      email,
      referralId,
      phone,
      userId,
      role,
    };
    next();
  } catch (error) {
    throw new CustomError.UnauthenticatedError('Authentication Invalid');
  }
};

// const authenticatePermissions = (req, res, next) => {
//     if(req.user.role !== 'admin'){
//         throw new CustomError.UnauthorizedError('Not Permitted')
//     }
//     next()
// }

const authenticatePermissions = (...role) => {
  return (req, res, next) => {
    if (!role.includes(req.user.role)) {
      throw new CustomError.UnauthorizedError('Not Permitted');
    }
    next();
  };
};
module.exports = {
  authenticateUser,
  authenticatePermissions,
};
