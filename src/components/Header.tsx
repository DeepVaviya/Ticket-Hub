import { useAuth } from '../contexts/AuthContext';
import { Ticket, LogOut, User, ShieldCheck } from 'lucide-react';

type HeaderProps = {
  activeView: 'events' | 'bookings' | 'admin';
  onViewChange: (view: 'events' | 'bookings' | 'admin') => void;
};

export const Header = ({ activeView, onViewChange }: HeaderProps) => {
  const { profile, signOut } = useAuth();

  return (
    <header className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <Ticket className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-900">TicketHub</h1>
          </div>

          <nav className="hidden md:flex items-center gap-2">
            <button
              onClick={() => onViewChange('events')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeView === 'events'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Events
            </button>
            <button
              onClick={() => onViewChange('bookings')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeView === 'bookings'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              My Bookings
            </button>
            {profile?.is_admin && (
              <button
                onClick={() => onViewChange('admin')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                  activeView === 'admin'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                Admin
              </button>
            )}
          </nav>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 text-sm">
              <User className="w-4 h-4 text-gray-600" />
              <span className="text-gray-700">{profile?.full_name}</span>
            </div>
            <button
              onClick={() => signOut()}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>

        <nav className="md:hidden flex items-center gap-2 pb-3 overflow-x-auto">
          <button
            onClick={() => onViewChange('events')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
              activeView === 'events'
                ? 'bg-blue-600 text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            Events
          </button>
          <button
            onClick={() => onViewChange('bookings')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
              activeView === 'bookings'
                ? 'bg-blue-600 text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            My Bookings
          </button>
          {profile?.is_admin && (
            <button
              onClick={() => onViewChange('admin')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 whitespace-nowrap ${
                activeView === 'admin'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              Admin
            </button>
          )}
        </nav>
      </div>
    </header>
  );
};
