'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { OrderItemType, typeOrderItemType } from '@/types/orderType';

export const OrderItemCard = ({ order }: { order: OrderItemType }) => {
  const [isOrderDetail, setIsOrderDetail] = useState(false);
  const toggleOrderDetail = () => setIsOrderDetail((prev) => !prev);

  return (
    <div className="max-w-[600px]">
      <motion.div
        layout
        transition={{ layout: { type: 'spring', stiffness: 150, damping: 20 } }}
        className="border border-gray-200 bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 p-6 flex flex-col gap-6"
      >
        {/* Header */}
        <div className="flex justify-between items-center">
          <div className="flex gap-6 items-center">
            <p className="text-[22px] font-medium text-gray-800">{order.table}</p>
            <p className="text-[22px] text-gray-500">{order.orderNumber}</p>
          </div>
          <p className="text-[14px] text-gray-400">🕒 {order.time}</p>
        </div>

        <div className="h-[1px] bg-gray-200"></div>

        {/* Order details */}
        <AnimatePresence>
          {isOrderDetail && (
            <motion.div
              key="details"
              initial={{ opacity: 0, y: 10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 180, damping: 16 }}
              className="flex flex-col gap-4"
            >
              {order.items.map((item:typeOrderItemType, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08, duration: 0.25 }}
                  className="flex items-center justify-between bg-gray-50 hover:bg-white transition-all duration-300 rounded-xl p-3 border border-gray-100 shadow-sm hover:shadow-md"
                >
                  {/* Image */}
                  <motion.div whileHover={{ scale: 1.05 }} transition={{ type: 'spring', stiffness: 200, damping: 12 }} className="relative">
                    <motion.img src={item.image} alt={item.name} className="w-[80px] h-[80px] rounded-2xl object-cover border border-gray-200 shadow-sm" />
                    <div className="absolute bottom-1 right-1 bg-white/90 text-gray-700 text-[12px] px-2 py-[2px] rounded-full shadow">x{item.quantity}</div>
                  </motion.div>

                  {/* Info */}
                  <div className="flex flex-col flex-1 ml-4">
                    <p className="font-semibold text-gray-800 text-[16px] tracking-wide">{item.name}</p>
                    <p className="text-[14px] text-gray-500 mt-[2px]">{item.desc}</p>
                  </div>

                  {/* Price */}
                  <div className="text-right">
                    <p className="text-[15px] font-semibold text-gray-800">{item.price.toLocaleString()}₮</p>
                  </div>
                </motion.div>
              ))}
              <div className="h-[1px] w-full bg-gray-200"></div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Total */}
        <div className="flex justify-between items-center">
          <p className="text-gray-600">Нийлбэр дүн:</p>
          <p className="font-semibold text-[20px] text-gray-800">{order.total.toLocaleString()}₮</p>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-2">
          {isOrderDetail ? (
            <>
              <motion.button whileTap={{ scale: 0.95 }} className="rounded-lg border border-gray-300 text-gray-700 px-4 py-2 hover:bg-gray-50 transition">
                Хүлээгдэж буй
              </motion.button>
              <motion.button whileTap={{ scale: 0.95 }} onClick={toggleOrderDetail} className="rounded-lg border border-gray-800 bg-gray-800 text-white px-4 py-2 hover:bg-gray-700 transition">
                Хаах
              </motion.button>
            </>
          ) : (
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.96 }}
              onClick={toggleOrderDetail}
              className="rounded-lg border border-gray-400 px-4 py-2 text-gray-700 hover:bg-gray-100 transition"
            >
              Дэлгэрэнгүй харах
            </motion.button>
          )}
        </div>
      </motion.div>
    </div>
  );
};
