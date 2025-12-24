'use client';

import { useGetNotificationsQuery } from '@/generated';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

interface NotificationPanelProps {
  isVisible: boolean;
}

export const NotificationPanel = ({ isVisible }: NotificationPanelProps) => {
  const [userId, setUserId] = useState<string>('');
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      setUserId(payload.userId);
    } catch (err) {
      console.error('Invalid token', err);
    }
  }, []);
  console.log('jjhjhk', userId);
  const { data } = useGetNotificationsQuery({
    variables: {
      userId,
    },
    skip: !userId, // userId байхгүй бол query хийхгүй
  });

  // if (loading) return <div className="p-4 text-gray-500">Loading notifications...</div>;
  // if (error) return <div className="p-4 text-red-500">Error loading notifications</div>;

  const notifications = data?.getNotifications ?? [];
  console.log('Notifications d', notifications);
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ x: -300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -300, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="absolute left-20 top-0 w-80 h-screen border-r border-gray-200 bg-white p-4 z-10"
        >
          <h2 className="text-lg font-semibold mb-4">Notifications</h2>

          <div className="p-4 space-y-3">
            {notifications.length === 0 ? (
              <p className="text-gray-500">No notifications yet.</p>
            ) : (
              notifications.map((el, index) => (
                <div key={index} className="bg-white p-3 flex gap-3 hover:bg-gray-100 cursor-pointer">
                  <img className="border rounded-full" src={el?.fromUser?.profilePicture || '/pro1.jpg'} alt="img" width={48} height={48} />
                  <p>
                    <span className="font-bold">{el.fromUser.username}</span> {el.message}
                  </p>
                </div>
              ))
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
