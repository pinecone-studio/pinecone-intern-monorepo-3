export const OrderFilter = () => {
  return (
    <div className="flex gap-[300px] mb-[20px]">
      <h1 className="font-semibold text-[28px]">Захиалга</h1>

      <div className="flex gap-3">
        <button className="rounded-md border border-gray-500 px-3 py-1">Өнөөдөр</button>
        <button className="rounded-md border border-gray-500 px-3 py-1">Төлөв</button>
      </div>
    </div>
  );
};