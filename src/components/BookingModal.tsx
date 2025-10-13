import { useState } from 'react';
import { Event } from '../lib/supabase';
import { X, Minus, Plus, Ticket } from 'lucide-react';

type BookingModalProps = {
  event: Event | null;
  onClose: () => void;
  onConfirm: (eventId: string, seatsBooked: number) => Promise<void>;
};

export const BookingModal = ({ event, onClose, onConfirm }: BookingModalProps) => {
  const [seatsBooked, setSeatsBooked] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!event) return null;

  const handleConfirm = async () => {
    setLoading(true);
    setError('');

    try {
      await onConfirm(event.id, seatsBooked);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to book tickets');
    } finally {
      setLoading(false);
    }
  };

  const totalAmount = event.price * seatsBooked;
  const maxSeats = Math.min(event.available_seats, 10);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <Ticket className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Book Tickets</h2>
            <p className="text-sm text-gray-600">{event.title}</p>
          </div>
        </div>

        <div className="space-y-4 mb-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-sm text-gray-600 mb-1">Venue</div>
            <div className="font-medium text-gray-900">{event.venue}</div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-sm text-gray-600 mb-1">Date & Time</div>
            <div className="font-medium text-gray-900">
              {new Date(event.event_date).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-sm text-gray-600 mb-3">Number of Tickets</div>
            <div className="flex items-center justify-between">
              <button
                onClick={() => setSeatsBooked(Math.max(1, seatsBooked - 1))}
                className="w-10 h-10 bg-white border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
                disabled={seatsBooked <= 1}
              >
                <Minus className="w-4 h-4" />
              </button>

              <span className="text-2xl font-bold text-gray-900">{seatsBooked}</span>

              <button
                onClick={() => setSeatsBooked(Math.min(maxSeats, seatsBooked + 1))}
                className="w-10 h-10 bg-white border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
                disabled={seatsBooked >= maxSeats}
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <div className="text-xs text-gray-500 text-center mt-2">
              Available: {event.available_seats} seats
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div className="flex justify-between items-center">
              <div>
                <div className="text-sm text-blue-600 mb-1">Total Amount</div>
                <div className="text-2xl font-bold text-blue-700">
                  ${totalAmount.toFixed(2)}
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-blue-600">Price per ticket</div>
                <div className="text-sm font-medium text-blue-700">
                  ${event.price.toFixed(2)}
                </div>
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-4">
            {error}
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={loading}
            className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Booking...' : 'Confirm Booking'}
          </button>
        </div>
      </div>
    </div>
  );
};
