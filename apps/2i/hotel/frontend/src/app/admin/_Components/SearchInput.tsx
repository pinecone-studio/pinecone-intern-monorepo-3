import { Input } from '@/components/ui/input';
import { LocationComboBox } from './LocationComboBox';
import { StarComboBox } from './StarComboBox';
import { RoomComboBox } from './RoomComboBox';
import { RatingComboBox } from './RatingComboBox';

export const SearchInput = () => {
  return (
    <div className="flex gap-2">
      <Input placeholder="Search" />
      <LocationComboBox />
      <RoomComboBox />
      <StarComboBox />

      <RatingComboBox />
    </div>
  );
};
