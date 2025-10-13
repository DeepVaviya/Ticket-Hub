# 🎫 Ticket Booking System

A modern, full-stack ticket booking application built with React, TypeScript, and Supabase. Users can browse events, book tickets, and manage their bookings, while administrators can create and manage events.

## ✨ Features

### For Users
- 🔐 **Secure Authentication** - Sign up and sign in with email/password
- 🎭 **Browse Events** - View available events with details
- 🎫 **Book Tickets** - Select seats and book tickets for events
- 📋 **Booking History** - View all your past and current bookings
- 📱 **Responsive Design** - Works on desktop and mobile devices

### For Administrators
- 👑 **Admin Panel** - Full administrative control
- ➕ **Event Management** - Create, edit, and delete events
- 📊 **Booking Overview** - View all user bookings across events
- 🎯 **Event Types** - Support for movies, concerts, travel, sports, and theater events

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Supabase account

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd project
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Supabase**
   - Create a new Supabase project
   - Run the database migration: `supabase/migrations/20251013164157_create_ticket_booking_schema.sql`
   - Get your Supabase URL and anon key

4. **Configure environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:5173`

## 🔑 Default Admin Credentials

The system automatically creates an admin user with the following credentials:

| Field | Value |
|-------|-------|
| **Email** | `admin@ticketbooking.com` |
| **Password** | `admin123` |
| **Name** | System Administrator |

### Admin Access
- Log in with the credentials above
- Navigate to the "Admin" tab in the navigation menu
- Manage events and view all bookings

## 🏗️ Project Structure

```
src/
├── components/          # React components
│   ├── AdminPanel.tsx  # Admin dashboard
│   ├── Auth.tsx        # Login/signup form
│   ├── BookingModal.tsx # Ticket booking modal
│   ├── EventList.tsx   # Events listing
│   └── Header.tsx      # Navigation header
├── contexts/           # React contexts
│   └── AuthContext.tsx # Authentication context
├── lib/               # Utilities and configurations
│   └── supabase.ts    # Supabase client configuration
└── App.tsx           # Main application component
```

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Real-time)
- **Build Tool**: Vite
- **Icons**: Lucide React
- **Styling**: Tailwind CSS

## 📊 Database Schema

The application uses the following main tables:

- **profiles** - User profiles with admin flags
- **events** - Event information and details
- **bookings** - User ticket bookings
- **seats** - Individual seat management

## 🎯 Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build

# Code Quality
npm run lint         # Run ESLint
npm run typecheck    # Run TypeScript checks
```

## 🔧 Configuration

### Supabase Setup
1. Create a new Supabase project
2. Run the migration file to set up the database schema
3. Enable Row Level Security (RLS) policies
4. Configure authentication settings

### Environment Variables
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 🎨 Features Overview

### Event Management
- **Event Types**: Movies, Concerts, Travel, Sports, Theater
- **Event Details**: Title, description, venue, date, price, seating
- **Image Support**: Optional event images via URL

### Booking System
- **Seat Selection**: Choose number of seats
- **Price Calculation**: Automatic total calculation
- **Booking Status**: Confirmed bookings with status tracking
- **User History**: Complete booking history for users

### Admin Features
- **Event CRUD**: Create, read, update, delete events
- **Booking Management**: View all user bookings
- **Real-time Updates**: Live updates when bookings are made
- **User Management**: View user profiles and booking history

## 🔒 Security Features

- **Row Level Security (RLS)** enabled on all tables
- **User Authentication** with Supabase Auth
- **Admin-only Access** to administrative features
- **Secure API** calls with proper error handling

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Vercel/Netlify
1. Connect your repository
2. Set environment variables
3. Deploy automatically

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

If you encounter any issues:

1. Check the browser console for errors
2. Verify Supabase connection
3. Ensure all environment variables are set
4. Check that database migrations have been run

## 🔄 Updates

The admin user is automatically created when the application starts. If you need to reset the admin user:

1. Delete the user from Supabase Auth
2. Delete the profile from the profiles table
3. Restart the application

---

**Happy Booking! 🎫**
