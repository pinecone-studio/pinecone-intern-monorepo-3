import * as React from 'react';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface SelectStatusProps {
  value: string;
  onValueChange: (_: string) => void;
  isAll?: boolean;
}

export const SelectStatus: React.FC<SelectStatusProps> = ({ value, onValueChange, isAll }) => (
  <Select value={value} onValueChange={onValueChange}>
    <SelectTrigger className="w-[180px]">
      <SelectValue placeholder="Статус сонгоно уу" />
    </SelectTrigger>
    <SelectContent>
      <SelectGroup>
        {isAll && <SelectItem value="Бүгд">Бүгд</SelectItem>}
        <SelectItem value="Бэлэн">Бэлэн</SelectItem>
        <SelectItem value="Хүлээгдэж буй">Хүлээгдэж буй</SelectItem>
        <SelectItem value="Хийгдэж буй">Хийгдэж буй</SelectItem>
        <SelectItem value="Дууссан">Дууссан</SelectItem>
      </SelectGroup>
    </SelectContent>
  </Select>
);
