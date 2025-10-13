/*
  # Ticket Booking System Database Schema

  1. New Tables
    - `profiles`
      - `id` (uuid, primary key, references auth.users)
      - `email` (text, not null)
      - `full_name` (text, not null)
      - `is_admin` (boolean, default false)
      - `created_at` (timestamptz)
    
    - `events`
      - `id` (uuid, primary key)
      - `title` (text, not null)
      - `description` (text)
      - `event_type` (text, not null) - movie, concert, travel, etc
      - `venue` (text, not null)
      - `event_date` (timestamptz, not null)
      - `image_url` (text)
      - `price` (numeric, not null)
      - `total_seats` (integer, not null)
      - `available_seats` (integer, not null)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `bookings`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `event_id` (uuid, references events)
      - `seats_booked` (integer, not null)
      - `total_amount` (numeric, not null)
      - `booking_status` (text, default 'confirmed')
      - `created_at` (timestamptz)
    
    - `seats`
      - `id` (uuid, primary key)
      - `event_id` (uuid, references events)
      - `seat_number` (text, not null)
      - `is_booked` (boolean, default false)
      - `booking_id` (uuid, references bookings, nullable)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Policies for profiles: users can view and update their own profile
    - Policies for events: all authenticated users can view, only admins can create/update/delete
    - Policies for bookings: users can view their own bookings and create new bookings, admins can view all
    - Policies for seats: authenticated users can view seats, system manages booking status

  3. Indexes
    - Index on events.event_date for efficient date-based queries
    - Index on bookings.user_id for fast user booking history retrieval
    - Index on seats.event_id for quick seat availability checks
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  full_name text NOT NULL,
  is_admin boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create events table
CREATE TABLE IF NOT EXISTS events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  event_type text NOT NULL,
  venue text NOT NULL,
  event_date timestamptz NOT NULL,
  image_url text,
  price numeric(10,2) NOT NULL,
  total_seats integer NOT NULL,
  available_seats integer NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  event_id uuid NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  seats_booked integer NOT NULL,
  total_amount numeric(10,2) NOT NULL,
  booking_status text DEFAULT 'confirmed',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Create seats table
CREATE TABLE IF NOT EXISTS seats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  seat_number text NOT NULL,
  is_booked boolean DEFAULT false,
  booking_id uuid REFERENCES bookings(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(event_id, seat_number)
);

ALTER TABLE seats ENABLE ROW LEVEL SECURITY;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_events_date ON events(event_date);
CREATE INDEX IF NOT EXISTS idx_bookings_user ON bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_seats_event ON seats(event_id);

-- RLS Policies for profiles
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- RLS Policies for events
CREATE POLICY "Anyone can view events"
  ON events FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can insert events"
  ON events FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

CREATE POLICY "Admins can update events"
  ON events FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

CREATE POLICY "Admins can delete events"
  ON events FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

-- RLS Policies for bookings
CREATE POLICY "Users can view own bookings"
  ON bookings FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

CREATE POLICY "Users can create bookings"
  ON bookings FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- RLS Policies for seats
CREATE POLICY "Users can view seats"
  ON seats FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "System can manage seats"
  ON seats FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

-- Function to automatically update event available seats
CREATE OR REPLACE FUNCTION update_available_seats()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE events
    SET available_seats = available_seats - NEW.seats_booked
    WHERE id = NEW.event_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER booking_created
  AFTER INSERT ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION update_available_seats();