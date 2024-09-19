import { StatusCodes } from "http-status-codes";
import User from '../models/UserModel.js'
import { comparePassword, hashPassword } from '../utils/passwordUtils.js';
import { UnauthenticatedError } from "../errors/customErrors.js";
import { createJWT } from "../utils/tokenUtils.js";

export const register = async (req, res) => {

    // below code is to count accounts a user has
    const isFirstAccount =await User.countDocuments()=== 0
    req.body.role = isFirstAccount? 'admin' : 'user';
    
    // this is to secure password of users and admin, read readMe file
    const hashedPassword = await hashPassword(req.body.password);
    req.body.password = hashedPassword;
    
    const user = await User.create(req.body);
    // console.log(user);
    res.status(StatusCodes.CREATED).json({ msg:'user created' });
};

//=== validate login === ///
export const login = async (req, res) => {
    // compares emails with existing emails
    const user = await User.findOne({email:req.body.email});
    // compares password with existing password in db and also email
    const isValidUser= user && await comparePassword(req.body.password, user.password);
    if(!isValidUser) throw new UnauthenticatedError('Invalid credentials!');
    
    // tokens used to secure authentication and authorization, and it helps in secure communication between application and systems
    // tokens contains info about users , admin etc..when user logins in frontend then their email,password etc.. come through this tokens(a encrypted string) in backend
    const token = createJWT({userId:user._id, role:user.role});
    
    // convert one day in milliseconds
    const oneDay = 1000 * 60 * 60 * 24;
    res.cookie('token', token, {
        httpOnly: true,
        expires: new Date(Date.now() + oneDay),
        secure: process.env.NODE_ENV === 'production',
    });
    res.status(StatusCodes.OK).json({msg:'user logged in'});
}; 


// === logout functionality ===//
export const logout = (req, res) => {
    res.cookie('token', 'logout', {
      httpOnly: true,
      expires: new Date(Date.now()),
    });
    res.status(StatusCodes.OK).json({ msg: 'user logged out!' });
};
