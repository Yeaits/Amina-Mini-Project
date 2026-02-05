import { format } from 'date-fns';

export default function OrderCard({ order, onStatusUpdate, isAdmin }) {
  const getStatusColor = (status) => {
    switch (status) {
      case 'placed':
        return 'bg-blue-100 text-blue-800';
      case 'packed':
        return 'bg-yellow-100 text-yellow-800';
      case 'ready':
        return 'bg-green-100 text-green-800';
      case 'picked_up':
        return 'bg-gray-100 text-gray-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="card">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-lg font-semibold">Order #{order._id.slice(-6)}</h3>
          <p className="text-sm text-gray-600">
            {format(new Date(order.createdAt), 'MMM dd, yyyy h:mm a')}
          </p>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
            order.status
          )}`}
        >
          {order.status.toUpperCase()}
        </span>
      </div>

      {isAdmin && order.customer && (
        <div className="mb-3 pb-3 border-b">
          <p className="text-sm text-gray-600">
            <span className="font-medium">Customer:</span> {order.customer.name}
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-medium">Phone:</span> {order.customer.phone || 'N/A'}
          </p>
        </div>
      )}

      {!isAdmin && order.pharmacy && (
        <div className="mb-3 pb-3 border-b">
          <p className="text-sm text-gray-600">
            <span className="font-medium">Pharmacy:</span> {order.pharmacy.name}
          </p>
          <p className="text-sm text-gray-600">{order.pharmacy.address}</p>
        </div>
      )}

      <div className="mb-3">
        <p className="text-sm font-medium mb-2">Items:</p>
        {order.items.map((item, index) => (
          <div key={index} className="flex justify-between text-sm mb-1">
            <span className="text-gray-600">
              {item.medicine.name} × {item.quantity}
            </span>
            <span className="font-medium">₹{item.lineTotal.toFixed(2)}</span>
          </div>
        ))}
      </div>

      {order.pickupTime && (
        <div className="mb-3 text-sm">
          <span className="font-medium">Pickup Time:</span>{' '}
          <span className="text-gray-600">
            {format(new Date(order.pickupTime), 'MMM dd, yyyy h:mm a')}
          </span>
        </div>
      )}

      <div className="flex justify-between items-center pt-3 border-t">
        <span className="text-lg font-bold">Total: ₹{order.total.toFixed(2)}</span>

        {isAdmin && order.status === 'placed' && (
          <button
            onClick={() => onStatusUpdate(order._id, 'ready')}
            className="btn-success"
          >
            Mark as Ready
          </button>
        )}

        {isAdmin && order.status === 'ready' && (
          <button
            onClick={() => onStatusUpdate(order._id, 'picked_up')}
            className="btn-secondary"
          >
            Mark as Picked Up
          </button>
        )}
      </div>
    </div>
  );
}
