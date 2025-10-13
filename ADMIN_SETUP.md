# Admin User Setup

## Default Admin Credentials

The system will automatically create an admin user with the following credentials:

- **Email**: `admin@ticketbooking.com`
- **Password**: `admin123`
- **Name**: System Administrator

## How It Works

1. When the application starts, it automatically checks if an admin user exists
2. If no admin user is found, it creates one with the credentials above
3. If a user with that email already exists, it updates their profile to make them an admin
4. The admin user has full access to the admin panel for managing events and bookings

## Admin Features

Once logged in as admin, you can:

- **View Admin Panel**: Click on the "Admin" tab in the navigation
- **Manage Events**: Create, edit, and delete events
- **View All Bookings**: See all user bookings across all events
- **Event Management**: Add new events with details like title, description, venue, date, price, and seating

## Security Note

**Important**: Change the default admin password after first login for security purposes. You can do this through the Supabase dashboard or by implementing a password change feature.

## Accessing Admin Panel

1. Start the application
2. Go to the login page
3. Use the admin credentials above
4. Once logged in, you'll see an "Admin" tab in the navigation (only visible to admin users)
5. Click on "Admin" to access the admin panel

## Troubleshooting

If the admin user isn't created automatically:
1. Check the browser console for any error messages
2. Ensure your Supabase connection is working
3. Verify that the database migration has been run
4. Check that the `profiles` table exists and has the correct structure
