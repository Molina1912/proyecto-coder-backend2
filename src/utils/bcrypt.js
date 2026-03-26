import bcrypt from 'bcrypt';

export const createHash = async (password) => {
    const saltRounds = 10;
    const hash = await bcrypt.hash(password, saltRounds);
    return hash;
};

export const isValidPassword = async (password, hash) => {
    const isValid = await bcrypt.compare(password, hash);
    return isValid;
};