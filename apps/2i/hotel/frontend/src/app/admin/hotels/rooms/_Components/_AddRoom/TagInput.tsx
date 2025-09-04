'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';

type TagInputProps = {
  value: string[];
  onChange: (_value: string[]) => void;
  placeholder?: string;
};

export const TagInput = ({ value, onChange, placeholder }: TagInputProps) => {
  const [inputValue, setInputValue] = useState<string>('');
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim() !== '') {
      e.preventDefault();
      const newTag = inputValue.trim();
      if (!value.includes(newTag)) {
        onChange([...value, newTag]);
      }
      setInputValue('');
    }
  };
  const removeItem = (item: string) => {
    onChange(value.filter((i) => i !== item));
  };

  return (
    <div className="flex flex-col gap-3">
      <Input value={inputValue} onChange={(e) => setInputValue(e.target.value)} onKeyDown={handleKeyDown} placeholder={placeholder || 'Type and press Enter'} />
      <div className="flex gap-2 flex-wrap">
        {value.map((item, idx) => (
          <Badge key={idx} className="flex items-center gap-1 px-2 py-1 text-sm" variant="secondary">
            {item}
            <X size={12} className="cursor-pointer hover:text-red-500" onClick={() => removeItem(item)} />
          </Badge>
        ))}
      </div>
    </div>
  );
};
