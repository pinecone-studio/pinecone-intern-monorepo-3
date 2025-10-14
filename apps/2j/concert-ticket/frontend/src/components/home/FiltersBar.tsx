import React from 'react';

interface Props {
  className?: string;
}

// FiltersBar — UI-only (үйлдэлгүй)
const FiltersBar: React.FC<Props> = ({ className }) => {
  return (
    <div className={`flex items-center justify-between rounded-[12px] bg-[#0f0f0f] px-[12px] py-[10px] ${className ?? ''}`}>
      <div className="flex items-center gap-[8px]">
        <select className="h-[36px] rounded-[8px] bg-[#1a1a1a] px-[12px] text-[12px] outline-none">
          <option>Клуб</option>
        </select>
        <select className="h-[36px] rounded-[8px] bg-[#1a1a1a] px-[12px] text-[12px] outline-none">
          <option>Эрэмбэ</option>
        </select>
      </div>
      <button className="h-[36px] rounded-[8px] bg-[#1a1a1a] px-[12px] text-[12px]">Шүүлт</button>
    </div>
  );
};

export default FiltersBar;


