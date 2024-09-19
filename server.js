import 'express-async-errors';
import * as dotenv from 'dotenv'
dotenv.config();
 
import express from 'express';
const app=express();
import mongoose from 'mongoose';
import morgan from 'morgan';

// cookie
import cookieParser from 'cookie-parser';
import { body, validationResult } from 'express-validator';
import cloudinary from 'cloudinary';

// routers
import jobRouter from './routes/jobRouter.js';
import authRouter from "./routes/authRouter.js"
import userRouter from "./routes/userRouter.js"

// public
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import path from 'path';




// Middleware
import errorHandlerMiddleware from './middleware/errorHandlerMiddleware.js';
import { authenticateUser } from './middleware/authMiddleware.js';


cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

//==== as a learning to see how to fetch api data ====//
// try {
//     const response = await fetch('https://www.course-api.com/react-useReducer-cart-project')
//     const cartData=await response.json()
//     console.log(cartData)
// } catch (err) {
//     console.log(`error: err`)
// }


const __dirname = dirname(fileURLToPath(import.meta.url));

app.use(express.static(path.resolve(__dirname,'./public')))


if(process.env.NODE_ENV=== 'development'){
    app.use(morgan('dev')); 
}

app.use(cookieParser());
app.use(express.json());

app.get('/', (req,res)=>{
    res.send("hello ji!");
})


// dummy route
app.get('/api/v1/test', (req, res) => {
  res.json({ msg: 'test route' });
});



app.use('/api/v1/jobs',authenticateUser,jobRouter);
app.use('/api/v1/users',authenticateUser,userRouter);
app.use('/api/v1/auth',authRouter);


app.get('*', (req,res)=>{
  res.sendFile(path.resolve(__dirname, './public','index.html'));
})

// === NOT FOUND -> if all of the above request doesn't run===//
// The "not found" middleware in Express.js is used when a request
//  is made to a route that does not exist. It catches these requests
//  and responds with a 404 status code, indicating that the requested resource was not found.
app.use('*',(req,res)=>{
    res.status(404).json({msg:'not found!'});
})

// === ERROR ===//
app.use(errorHandlerMiddleware);

const port=process.env.PORT || 5100;

try {
    const mongodbInstance = await mongoose.connect(process.env.MONGO_URL);
    console.log(mongodbInstance.connection.host);
    
    app.listen(port, () => {
      console.log(`server running on PORT ${port}....`);
    });
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
