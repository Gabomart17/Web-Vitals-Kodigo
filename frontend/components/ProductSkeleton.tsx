export default function ProductSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
        <div key={n} className="border rounded-xl p-4 h-[320px] animate-pulse bg-white">
          <div className="bg-gray-200 h-48 rounded-lg mb-4"></div>
          <div className="bg-gray-200 h-6 w-3/4 mb-2 rounded"></div>
          <div className="bg-gray-200 h-4 w-1/2 mb-4 rounded"></div>
          <div className="bg-gray-200 h-6 w-1/4 rounded"></div>
        </div>
      ))}
    </div>
  );
}