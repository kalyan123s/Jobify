// Multer is a middleware for handling multipart/form-data in Node.js, which is primarily used for uploading files. 
// It processes the incoming file data and stores it on the server (or elsewhere, depending on the configuration). 
// Multer is built on top of busboy, a Node.js library that parses form data.
import multer from 'multer';

// export const formatImage = (file) => {
//   const fileExtension = path.extname(file.originalname).toString();
//   return parser.format(fileExtension, file.buffer).content;
// };

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // set the directory where uploaded files will be stored
    // cb: The callback function. It’s used to pass any potential errors and the destination directory to Multer.
    // below line tells us null means no error and upload the file in public/upload 
    cb(null, 'public/uploads');
  },
  filename: (req, file, cb) => {
    const fileName = file.originalname;
    // set the name of the uploaded file
    cb(null, fileName);
  },
});

const upload = multer({ storage });
export default upload;