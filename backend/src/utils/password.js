import bcrypt from "bcrypt";

const SALT_ROUNDS = 12;

export const hashPassword = async (password) => {
    if (Buffer.byteLength(password, "utf8") > 72) {
        throw new Error("Password exceeds bcrypt's 72-byte limit");
    }

    return bcrypt.hash(password, SALT_ROUNDS);
};

export const comparePassword = async (
    password,
    passwordHash
) => {
    if (Buffer.byteLength(password, "utf8") > 72) {
        return false;
    }

    return bcrypt.compare(password, passwordHash);
};