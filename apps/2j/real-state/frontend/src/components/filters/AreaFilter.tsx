interface AreaFilterProps {
  areaMin: string;
  areaMax: string;
  onAreaChange: (_key: string, _value: string) => void;
}

const AreaFilter = ({ areaMin, areaMax, onAreaChange }: AreaFilterProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Талбай (м²)</h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Хамгийн бага
          </label>
          <input
            type="number"
            value={areaMin}
            onChange={(e) => onAreaChange('areaMin', e.target.value)}
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
            value={areaMax}
            onChange={(e) => onAreaChange('areaMax', e.target.value)}
            placeholder="1000"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>
    </div>
  );
};

export default AreaFilter;
