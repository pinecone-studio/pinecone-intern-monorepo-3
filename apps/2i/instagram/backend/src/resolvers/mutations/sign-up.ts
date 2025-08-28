
import { UserModel } from "../../models"
import bcrypt from 'bcryptjs';  




type SignupInput = {
  username: string;
  email: string;
  password: string;
  fullname: string;
};

 export const signup =  async (_: unknown, { signup }: { signup: SignupInput }) => {
      const { username, email, password, fullname } = signup

      const existingUser = await UserModel.findOne({
        email
      })

      if (existingUser) {
        throw new Error('Phone or email already in use')
      }

      const hashedPassword = await bcrypt.hash(password, 10)

      const user = await UserModel.create({
          fullname,
          username,
          email,
          password: hashedPassword,   
      })
      return {
         user,
      }
    }
  
  
