import { sign, SignOptions } from "jsonwebtoken";

export const generateToken = (
  payload: any,
  secretKey: string,
  options: SignOptions
) => {
  return sign(payload, secretKey, options);
};
