import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Profile = {
  id: string;
  email: string;
  full_name: string;
  is_admin: boolean;
  created_at: string;
};

export type Event = {
  id: string;
  title: string;
  description: string;
  event_type: string;
  venue: string;
  event_date: string;
  image_url: string;
  price: number;
  total_seats: number;
  available_seats: number;
  created_at: string;
  updated_at: string;
};

export type Booking = {
  id: string;
  user_id: string;
  event_id: string;
  seats_booked: number;
  total_amount: number;
  booking_status: string;
  created_at: string;
  events?: Event;
};

export type Seat = {
  id: string;
  event_id: string;
  seat_number: string;
  is_booked: boolean;
  booking_id: string | null;
  created_at: string;
};
