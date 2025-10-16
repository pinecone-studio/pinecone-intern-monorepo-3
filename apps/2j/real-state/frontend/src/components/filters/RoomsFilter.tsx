interface RoomsFilterProps {
  bedrooms: string;
  bathrooms: string;
  onRoomsChange: (_key: string, _value: string) => void;
}

const RoomsFilter = ({ bedrooms, bathrooms, onRoomsChange }: RoomsFilterProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Өрөөний тоо</h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Унтлагын өрөө
          </label>
          <select
            value={bedrooms}
            onChange={(e) => onRoomsChange('bedrooms', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Бүгд</option>
            <option value="1">1+</option>
            <option value="2">2+</option>
            <option value="3">3+</option>
            <option value="4">4+</option>
            <option value="5">5+</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Угаалгын өрөө
          </label>
          <select
            value={bathrooms}
            onChange={(e) => onRoomsChange('bathrooms', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Бүгд</option>
            <option value="1">1+</option>
            <option value="2">2+</option>
            <option value="3">3+</option>
            <option value="4">4+</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default RoomsFilter;
