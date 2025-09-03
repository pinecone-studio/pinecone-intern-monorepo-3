import { UserModel } from "../../models"
import bcrypt from 'bcryptjs';  

type update =  {
password:string
email:string
}

export const updatePassword = async (_:unknown, {input}: {input:update}) => {

const {password, email} = input ;
    

   const existingUser = await UserModel.findOne({
        email
      })

   if (!existingUser) {
  throw new Error('User not found');
}


 const hashedPassword = await bcrypt.hash(password, 10)

 await UserModel.findOneAndUpdate({ email },{ password: hashedPassword });


 return {
    message:"Password updated successfully"
 }

}