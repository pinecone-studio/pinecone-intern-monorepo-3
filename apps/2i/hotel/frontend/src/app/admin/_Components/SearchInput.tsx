import { Input } from '@/components/ui/input';
import { LocationComboBox } from './FilterComboBox';

export const SearchInput = () => {
  return (
    <div className="flex gap-2">
      <Input placeholder="Search" />
      <LocationComboBox />
      <LocationComboBox />
      <LocationComboBox />
      <LocationComboBox />
    </div>
  );
};
