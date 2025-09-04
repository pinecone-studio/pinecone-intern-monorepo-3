import { UserModel } from "../../models";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


type LoginInput = {
  email: string;
  password: string;
};

export const login = async (_: unknown, { login }: { login: LoginInput }) => {
  const { email, password } = login;

   const JWT_SECRET = process.env.JWT_SECRET as string;
  const user = await UserModel.findOne({ email });

  if (!user) {
    throw new Error("Invalid email or password");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new Error("Invalid email or password");
  }
  const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, {
    expiresIn: "7d",
  });

  return {
    user,
    token,
  };
};
