import bcrypt from 'bcryptjs';


// this is used to compare the password if someone login
export async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
};

// compares password to ensure correct login
export async function comparePassword(password, hashedPassword) {
    // hashPassword is coming from database
    const isMatch = await bcrypt.compare(password, hashedPassword);
    return isMatch;
}