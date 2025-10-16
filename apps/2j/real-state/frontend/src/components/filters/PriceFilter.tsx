interface PriceFilterProps {
  priceMin: string;
  priceMax: string;
  onPriceChange: (_key: string, _value: string) => void;
}

const PriceFilter = ({ priceMin, priceMax, onPriceChange }: PriceFilterProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Үнэ</h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Хамгийн бага
          </label>
          <input
            type="number"
            value={priceMin}
            onChange={(e) => onPriceChange('priceMin', e.target.value)}
            placeholder="0"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Хамгийн их
          </label>
          <input
            type="number"
            value={priceMax}
            onChange={(e) => onPriceChange('priceMax', e.target.value)}
            placeholder="1000000000"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>
    </div>
  );
};

export default PriceFilter;
