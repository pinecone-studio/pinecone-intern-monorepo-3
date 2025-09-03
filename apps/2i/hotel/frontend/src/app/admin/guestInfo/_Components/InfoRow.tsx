export const InfoRow = ({ label, value }: { label: string; value?: string | number }) => {
  if (!value) return null;
  return (
    <div className="flex flex-col">
      <span className="text-gray-500 text-sm">{label}</span>
      <span className="text-gray-800 font-medium">{value}</span>
    </div>
  );
};

export const StatusBadge = ({ status }: { status?: string }) => {
  if (!status) return null;
  const colorClass = status === 'Booked' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800';
  return <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${colorClass}`}>{status}</span>;
};
