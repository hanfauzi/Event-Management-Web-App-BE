import { sign, SignOptions } from "jsonwebtoken";

interface CreateUserTokenProps {
  userId: string;
  role?: "USER" | "ORGANIZER";
  secretKey: string;
  options?: SignOptions;
}

export const createToken = ({
  userId,
  role,
  secretKey,
  options,
}: CreateUserTokenProps) => {
  const payload = { userId, role };
  return sign(payload, secretKey, options);
};

