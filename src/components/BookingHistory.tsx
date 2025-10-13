import { useState, useEffect } from 'react';
import { supabase, Booking } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Calendar, MapPin, Ticket, DollarSign } from 'lucide-react';

export const BookingHistory = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadBookings();
    }
  }, [user]);

  const loadBookings = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('bookings')
      .select(`
        *,
        events (
          title,
          venue,
          event_date,
          event_type,
          image_url
        )
      `)
      .eq('user_id', user?.id)
      .order('created_at', { ascending: false });

    if (data && !error) {
      setBookings(data);
    }
    setLoading(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600">Loading bookings...</div>
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg">
        <Ticket className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600 text-lg mb-2">No bookings yet</p>
        <p className="text-gray-500 text-sm">
          Start booking tickets to see your history here
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {bookings.map((booking) => (
        <div
          key={booking.id}
          className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow"
        >
          <div className="flex flex-col md:flex-row gap-6">
            <div className="w-full md:w-32 h-32 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex-shrink-0 flex items-center justify-center">
              {booking.events?.image_url ? (
                <img
                  src={booking.events.image_url}
                  alt={booking.events.title}
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <div className="text-white text-3xl font-bold">
                  {booking.events?.title?.charAt(0)}
                </div>
              )}
            </div>

            <div className="flex-1">
              <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                <div>
                  <div className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full mb-2">
                    {booking.events?.event_type}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">
                    {booking.events?.title}
                  </h3>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-600 mb-1">Booking ID</div>
                  <div className="text-xs font-mono text-gray-500">
                    {booking.id.substring(0, 8)}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="w-4 h-4 mr-2 flex-shrink-0" />
                  {booking.events?.event_date && formatDate(booking.events.event_date)}
                </div>

                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                  {booking.events?.venue}
                </div>

                <div className="flex items-center text-sm text-gray-600">
                  <Ticket className="w-4 h-4 mr-2 flex-shrink-0" />
                  {booking.seats_booked} {booking.seats_booked === 1 ? 'ticket' : 'tickets'}
                </div>

                <div className="flex items-center text-sm font-semibold text-gray-900">
                  <DollarSign className="w-4 h-4 mr-1 flex-shrink-0" />
                  {booking.total_amount}
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="text-xs text-gray-500">
                  Booked on {formatDate(booking.created_at)}
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  booking.booking_status === 'confirmed'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-700'
                }`}>
                  {booking.booking_status.toUpperCase()}
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
