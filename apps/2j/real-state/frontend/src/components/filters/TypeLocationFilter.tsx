interface TypeLocationFilterProps {
  propertyType: string;
  location: string;
  onTypeLocationChange: (_key: string, _value: string) => void;
}

const TypeLocationFilter = ({ propertyType, location, onTypeLocationChange }: TypeLocationFilterProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Төрөл ба байршил</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Үл хөдлөх хөрөнгийн төрөл
          </label>
          <select
            value={propertyType}
            onChange={(e) => onTypeLocationChange('propertyType', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Бүгд</option>
            <option value="apartment">Орон сууц</option>
            <option value="house">Гэр</option>
            <option value="commercial">Аж ахуйн байр</option>
            <option value="land">Газар</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Байршил
          </label>
          <input
            type="text"
            value={location}
            onChange={(e) => onTypeLocationChange('location', e.target.value)}
            placeholder="Дүүрэг, хороо..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>
    </div>
  );
};

export default TypeLocationFilter;
