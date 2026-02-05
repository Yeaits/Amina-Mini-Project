export default function MedicineCard({ medicine, onAdd }) {
  return (
    <div className="card flex items-start gap-4">
      <div className="w-14 h-14 bg-indigo-100 rounded-lg flex items-center justify-center">
        <span className="text-2xl font-bold text-indigo-600">
          {medicine.name[0]}
        </span>
      </div>

      <div className="flex-1">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-semibold text-lg">{medicine.name}</h3>
            <p className="text-sm text-gray-600">{medicine.brand}</p>
            <p className="text-sm text-gray-500 mt-1">{medicine.description}</p>
          </div>
        </div>

        <div className="flex items-center justify-between mt-3">
          <div>
            <span className="text-2xl font-bold text-gray-900">
              ₹{medicine.unitPrice.toFixed(2)}
            </span>
            <span className="text-sm text-gray-500 ml-2">
              {medicine.stock > 0 ? (
                <span className="text-green-600">In Stock ({medicine.stock})</span>
              ) : (
                <span className="text-red-600">Out of Stock</span>
              )}
            </span>
          </div>

          <button
            onClick={() => onAdd(medicine)}
            disabled={medicine.stock === 0}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              medicine.stock > 0
                ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
