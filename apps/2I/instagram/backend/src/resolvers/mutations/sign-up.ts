import { UserModel } from "../../models"


const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')


const JWT_SECRET = process.env.JWT_SECRET as string;

 export const signup =  async (_: unknown, { signup }: { signup: any }) => {
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

      const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
        expiresIn: '7d',
      })

      return {
        token,
        user,
      }
    }
  

