import * as React from 'react';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FoodOrderStatus } from '@/generated';

interface SelectStatusProps {
  value: string;
  onValueChange: (value: string) => void;
  isAll?: boolean;
}

export const SelectStatus: React.FC<SelectStatusProps> = ({ value, onValueChange, isAll }) => {

  console.log(value);
  
  
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Статус сонгоно уу" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {isAll && <SelectItem value="Бүгд">Бүгд</SelectItem>}
          <SelectItem value="SERVED">Бэлэн</SelectItem>
          <SelectItem value="PENDING">Хүлээгдэж байна</SelectItem>
          <SelectItem value="INPROGRESS">Хийгдэж байна</SelectItem>
          <SelectItem value="COMPLETED">Дууссан</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

