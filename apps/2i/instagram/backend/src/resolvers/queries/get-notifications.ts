import { NotificationModel } from '../../models/notifications';

export const getNotifications = async (_: unknown, { userId }: { userId: string }) => {
  const notifications = await NotificationModel.find({ user: userId }).populate('user').populate('fromUser').lean();
  if (!notifications) {
    return [];
  }
  return notifications;
};
