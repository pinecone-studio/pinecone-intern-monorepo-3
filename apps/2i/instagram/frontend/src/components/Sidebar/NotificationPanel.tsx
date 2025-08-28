'use client';

import { motion, AnimatePresence } from 'framer-motion';

interface NotificationPanelProps {
  isVisible: boolean;
}

export const NotificationPanel = ({ isVisible }: NotificationPanelProps) => {
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
          <div className="text-gray-500">No new notifications.</div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
