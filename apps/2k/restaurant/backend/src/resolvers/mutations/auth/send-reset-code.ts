import { SendResetCodeInput } from '../../../generated';
import { UserModel } from '../../../models/user.model';

export const sendResetCode = async (_: unknown, { input }: { input: SendResetCodeInput }) => {
  const user = await UserModel.findOne({ email: input.email });
  if (!user) throw new Error('Email not found');

  const code = Math.floor(100000 + Math.random() * 900000).toString();
  user.resetCode = code;
  await user.save();

  console.log('Reset code:', code);

  //   return { success: true, message: 'Reset code sent to your email' };  eniig yg jinken eail dre hereglene tur zuur shalgahiin tuld door bgag ashiglasan sho
  return { success: true, message: `Reset code sent (DEV): ${code}` };
};
