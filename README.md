# Conference Scheduler

This is a simple Next.js/TypeScript conference scheduling app. Only an administrator can use the site.

## Features added for admin-only usage

- **Admin sign-in page** (`/signin`) protected by environment variable `ADMIN_EMAIL`.
- Middleware redirects all requests to `/signin` if the `admin` cookie is not present or invalid.
- API routes (`/api/sessions`, `/api/users`, `/api/analytics`, etc.) also check the admin cookie.
- Admin can create sessions and assign attendees by **email address**.
  - If an attendee email does not yet exist in the database a user record is automatically created.
- Home page (`/`) renders the admin dashboard component.

## Setup

1. Copy the example environment file or set the variables yourself:
   ```bash
   cp .env .env.local
   # edit ADMIN_EMAIL/ADMIN_NAME as needed
   ```
2. Install dependencies (using pnpm as seen in the repo):
   ```bash
   pnpm install
   ```
3. Run the development server:
   ```bash
   pnpm dev
   ```

The `initializeDatabase` helper will seed some sample users and always ensure an administrator account exists using `ADMIN_EMAIL`.

## Usage

1. Open the app in your browser (`http://localhost:3000`).
2. You'll be redirected to `/signin` if not authenticated.
3. Sign in using the email specified in `ADMIN_EMAIL`.
4. Once signed in you'll see the dashboard. Use the "Add Session" form to create meetings and provide attendee emails separated by commas.
5. The admin may sign out using the link in the sidebar.

> **Note:** The sign-in is intentionally minimal; it only checks the email against the configured admin address. In a production system you'd want stronger authentication.
