
import mongoose, {Schema} from "mongoose"


export interface User extends Document {
  email: string;
  username: string;
  fullname: string;
  password: string;
}



const UserSchema: Schema<User>= new mongoose.Schema({
    email: { type: String, required: true , unique: true },
    username: { type: String, required: true , unique: true },
    fullname: { type: String, required: true },
    password: { type: String, required: true },
})

UserSchema.index({username: 1 }, {unique: true})
 
export const UserModel = mongoose.models.User || mongoose.model('User', UserSchema);

 