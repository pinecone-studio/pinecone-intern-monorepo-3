import { NotificationModel } from '../models/notifications';

export const createNotification = async (userId: string, fromUserId: string, message: string) => {
  return await NotificationModel.create({
    user: userId,
    fromUser: fromUserId,
    message: message,
    isRead: false,
    type: 'follow',
  });
};
