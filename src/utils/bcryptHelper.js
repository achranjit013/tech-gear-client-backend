import bcryptjs from "bcryptjs";

const salt = 15;

export const hashPassword = (plainPassword) => {
  return bcryptjs.hashSync(plainPassword, salt);
};

export const comparePassword = (plainPassword, hashPassword) => {
  return bcryptjs.compareSync(plainPassword, hashPassword);
};
