import { body,param, validationResult } from 'express-validator';
import { BadRequestError, NotFoundError, UnauthorizedError } from '../errors/customErrors.js';
import { JOB_STATUS,JOB_TYPE } from '../utils/constants.js';
import mongoose from 'mongoose';
import Job from "../models/jobModel.js"
import User from '../models/UserModel.js';

const withValidationErrors = (validateValues) =>{

    return [
        validateValues,
        (req,res,next)=>{
            const errors = validationResult(req);
            if(!errors.isEmpty()){
                const errorMessages = errors.array().map((error)=>error.msg);
                if(errorMessages[0].startsWith('no job')){
                    throw new NotFoundError(errorMessages)
                }
                if(errorMessages[0].startsWith('not authorized')){
                    throw new UnauthorizedError('not authorized to access this route!')
                }
                throw new BadRequestError(errorMessages);
            }
            next();
        },
    ];
}


// export const validateTest = withValidationErrors([
//     body('name')
//       .notEmpty()
//       .withMessage('name is required')
//       .isLength({min:3, max:50})
//       .withMessage(' name must be between 3 and 50 characters long')
//       .trim(),
// ]);

export const validateJobInput= withValidationErrors([
    body('company').notEmpty().withMessage('company is required'),
    body('position').notEmpty().withMessage('position is required'),
    body('jobLocation').notEmpty().withMessage('job location is required'),
    body('jobStatus')
    .isIn(Object.values(JOB_STATUS))
    .withMessage('Invalid status value'),
    body('jobType')
    .isIn(Object.values(JOB_TYPE))
    .withMessage('Invalid type value')
])

export const validateIdParam = withValidationErrors([
    // param('id').custom(
    //     async(value,{req})=>{
    //     const isValid = mongoose.Types.ObjectId.isValid(value)
    //     if(!isValid) throw new BadRequestError('invalid MongoDB id')

    //     const job=await Job.findById(id)
    //     if (!job) throw new NotFoundError(`no job with id: ${id}`);
        
    //     // below code tells- if a job created by user and he wants to access then he can access and make sure no outsider access the job created by others
    //     const isAdmin=req.user.role ==='admin'
    //     const isOwner =req.user.userId === job.createdBy.toString();

    //     if(!isAdmin && !isOwner) throw new UnauthorizedError('not authorized to access this route!')
    // })
      param('id').custom(
        async (value, { req }) => {
          // Validate MongoDB ObjectId
          const isValid = mongoose.Types.ObjectId.isValid(value);
          if (!isValid) throw new BadRequestError('Invalid MongoDB id');
    
          // Find job by the 'id' provided in the param
          const job = await Job.findById(value);
          if (!job) throw new NotFoundError(`No job with id: ${value}`);
    
          // Check if the user is admin or the owner of the job
          const isAdmin = req.user.role === 'admin';
          const isOwner = req.user.userId === job.createdBy.toString();
    
          if (!isAdmin && !isOwner) throw new UnauthorizedError('Not authorized to access this route!');
        }
      )
    
    
]);


//=== validate register ====//
export const validateRegisterInput = withValidationErrors([
    body('name').notEmpty().withMessage('name is required'),
    
    // custom is used to ensure that only unique email id gets register
    body('email').notEmpty().withMessage('email is required').isEmail().withMessage('invalid email format')
      .custom(async (email) => {
        const user = await User.findOne({ email });
        if (user) {
          throw new BadRequestError('email already exists');
        }
      }),
    body('password').notEmpty().withMessage('password is required').isLength({ min: 8 }).withMessage('password must be at least 8 characters long!'),
    body('location').notEmpty().withMessage('location is required'),
    body('lastName').notEmpty().withMessage('last name is required'),
  ]);


//=== validate User Login ====//
export const validateLoginInput = withValidationErrors([
    body('email').notEmpty().withMessage('email is required').isEmail().withMessage('invalid email format'),
    body('password').notEmpty().withMessage('password is required')
]);


// validation is required if someone is updating their profile
export const validateUpdateUserInput = withValidationErrors([
    body('name').notEmpty().withMessage('name is required'),
    body('email').notEmpty().withMessage('email is required').isEmail().withMessage('invalid email format')
      .custom(async (email, { req }) => {
        const user = await User.findOne({ email });
        // this checks whether user exist or not
        if (user && user._id.toString() !== req.user.userId) {
          throw new Error('email already exists');
        }
      }),
    body('lastName').notEmpty().withMessage('last name is required'),
    body('location').notEmpty().withMessage('location is required'),
  ]);