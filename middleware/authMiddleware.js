import { UnauthenticatedError, UnauthorizedError, BadRequestError } from '../errors/customErrors.js';
import { verifyJWT } from '../utils/tokenUtils.js';

export const authenticateUser = (req, res, next) => {
    
    // check if token exist in cookies or not
    const { token } = req.cookies;
    if (!token) throw new UnauthenticatedError('authentication invalid');
    
    try {
        const {userId, role}=verifyJWT(token);
        // for test drive user--explore the app without login
        const testUser=userId === '66eb098a095b9dfbbf6c7aba'
        req.user={userId, role, testUser};
        next();
    } catch (error) {
        throw new UnauthenticatedError('authentication invalid');
    }
    
};


export const authorizePermissions = (...roles) => {
    return (req, res, next) => {
      if (!roles.includes(req.user.role)) {
        throw new UnauthorizedError('Unauthorized to access this route');
      }
      next();
    };
};


export const checkForTestUser = async (req,res,next) =>{
  if(req.user.testUser) throw new BadRequestError('Demo User. Please Signup/login!')
    next();
}