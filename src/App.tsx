import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Auth } from './components/Auth';
import { Header } from './components/Header';
import { EventList } from './components/EventList';
import { BookingModal } from './components/BookingModal';
import { BookingHistory } from './components/BookingHistory';
import { AdminPanel } from './components/AdminPanel';
import { supabase, Event } from './lib/supabase';

function AppContent() {
  const { user, profile, loading, setupAdminUser } = useAuth();
  const [activeView, setActiveView] = useState<'events' | 'bookings' | 'admin'>('events');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);

  // Setup admin user on app start
  useEffect(() => {
    setupAdminUser();
  }, [setupAdminUser]);

  const handleBookEvent = (event: Event) => {
    setSelectedEvent(event);
    setShowBookingModal(true);
  };

  const handleConfirmBooking = async (eventId: string, seatsBooked: number) => {
    if (!user || !profile) return;

    const event = selectedEvent;
    if (!event) return;

    const totalAmount = event.price * seatsBooked;

    const { error } = await supabase.from('bookings').insert([
      {
        user_id: user.id,
        event_id: eventId,
        seats_booked: seatsBooked,
        total_amount: totalAmount,
        booking_status: 'confirmed',
      },
    ]);

    if (error) {
      throw error;
    }

    setShowBookingModal(false);
    setSelectedEvent(null);

    if (activeView === 'events') {
      window.location.reload();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <Auth />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header activeView={activeView} onViewChange={setActiveView} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeView === 'events' && <EventList onBookEvent={handleBookEvent} />}
        {activeView === 'bookings' && <BookingHistory />}
        {activeView === 'admin' && profile?.is_admin && <AdminPanel />}
      </main>

      {showBookingModal && (
        <BookingModal
          event={selectedEvent}
          onClose={() => {
            setShowBookingModal(false);
            setSelectedEvent(null);
          }}
          onConfirm={handleConfirmBooking}
        />
      )}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
