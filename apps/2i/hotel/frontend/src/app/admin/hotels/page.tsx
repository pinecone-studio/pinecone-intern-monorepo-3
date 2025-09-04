import { FixedHotelPage } from '../_Components/FixedHotelPage';
import { SearchInput } from '../_Components/SearchInput';
import { TopBar } from '../_Components/TopBar';

const HotelHomePage = () => {
  return (
    <div className="flex flex-col gap-4">
      <TopBar />
      <SearchInput />
      <FixedHotelPage />
    </div>
  );
};
export default HotelHomePage;
