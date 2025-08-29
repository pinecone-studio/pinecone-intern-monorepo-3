'use client';

import { motion, AnimatePresence } from 'framer-motion';

interface SearchPanelProps {
  isVisible: boolean;
}

export const SearchPanel = ({ isVisible }: SearchPanelProps) => {
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
          <h2 className="text-lg font-semibold mb-4">Search</h2>
          <input type="text" placeholder="Search..." className="w-full border rounded-md p-2" />
          <div className="mt-4 text-gray-500">No recent searches.</div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
