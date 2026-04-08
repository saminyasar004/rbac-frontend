# RBAC System - Frontend

A Next.js 15 (App Router) frontend application for the RBAC System with authentication, user management, role assignment, and permission-based access control.

## Features

- **Authentication** - Login/Register with JWT tokens, auto-refresh on expiration
- **Role-Based UI** - Dynamic sidebar and content based on user permissions
- **User Management** - Create, edit users; assign roles and extra permissions
- **Permission Management** - Grant/revoke specific permissions beyond role
- **Dashboard** - Personalized stats and quick actions based on permissions
- **Responsive Design** - Mobile-friendly with sidebar navigation

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **State Management**: Zustand
- **HTTP Client**: Axios with interceptors
- **Icons**: Lucide React

## Project Structure

```
src/
├── app/                        # Next.js App Router pages
│   ├── (auth)/                 # Authentication routes
│   │   ├── login/              # Login page
│   │   └── signup/             # Registration page
│   ├── (dashboard)/            # Protected dashboard routes
│   │   ├── dashboard/          # Main dashboard
│   │   ├── users/              # User management
│   │   ├── roles/              # Role management
│   │   ├── permissions/        # Permission management
│   │   ├── leads/              # Lead management
│   │   ├── tasks/              # Task management
│   │   ├── reports/            # Reports
│   │   ├── audit-logs/         # Audit logs
│   │   └── settings/           # Settings
│   ├── customer-portal/        # Customer-facing portal
│   └── page.tsx                # Root redirect
├── components/
│   ├── layout/                 # Layout components (Sidebar, Header)
│   └── ui/                     # shadcn/ui components
├── lib/
│   ├── api.ts                  # Axios instance with interceptors
│   └── utils.ts                # Utility functions
├── store/
│   └── authStore.ts            # Zustand auth state store
└── middleware.ts               # Next.js middleware for route protection
```

## Getting Started

### Prerequisites

- Node.js 18+
- Running RBAC server on port 5000 (or configure via env)

### Environment Variables

Create `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### Installation

```bash
yarn install
```

### Running the Application

```bash
# Development
yarn dev

# Production
yarn build && yarn start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Authentication Flow

### Login

1. User enters credentials at `/login`
2. Backend returns access token + user data
3. Token stored in localStorage + httpOnly cookie
4. User redirected to dashboard

### Token Refresh (Automatic)

1. Axios interceptor detects 401 response
2. Uses refresh token to get new access token
3. Retries original request
4. On failure, redirects to login

### Logout

1. Calls `/auth/logout` endpoint
2. Clears localStorage and cookies
3. Redirects to login

## Permission-Based UI

The frontend checks permissions using the `hasPermission()` method from the auth store:

```tsx
import { useAuthStore } from "@/store/authStore";

const { hasPermission } = useAuthStore();

// Conditional rendering
{
	hasPermission("users.view") && <UsersTable />;
}
{
	hasPermission("users.create") && <CreateUserButton />;
}
```

### Sidebar Navigation

The sidebar dynamically shows/hides menu items based on permissions:

| Menu Item   | Required Permission |
| ----------- | ------------------- |
| Dashboard   | `dashboard.view`    |
| Users       | `users.view`        |
| Roles       | `roles.view`        |
| Permissions | `permissions.view`  |
| Leads       | `leads.view`        |
| Tasks       | `tasks.view`        |
| Reports     | `reports.view`      |
| Audit Logs  | `audit_logs.view`   |
| Settings    | Always visible      |

## API Client Configuration

The API client (`src/lib/api.ts`) is configured with:

- **Base URL**: From `NEXT_PUBLIC_API_URL` env var
- **Credentials**: Include cookies in requests
- **Request Interceptor**: Attaches `Authorization: Bearer <token>` header
- **Response Interceptor**: Handles 401 errors and token refresh

```typescript
// Making API calls
import api from '@/lib/api';

const response = await api.get('/users');
const created = await api.post('/users', { firstName: 'John', ... });
const updated = await api.patch('/users/123', { roleId: '...' });
await api.delete('/users/123');
```

## State Management

### Auth Store (Zustand)

Manages authentication state with persistence:

```typescript
import { useAuthStore } from "@/store/authStore";

const {
	user, // Current user object
	isAuthenticated, // Boolean auth status
	hasPermission, // Permission checker function
	login, // Login action
	logout, // Logout action
	checkAuth, // Verify token validity
} = useAuthStore();
```

### User Object Structure

```typescript
interface User {
	id: string;
	email: string;
	firstName: string;
	lastName: string;
	role: string; // 'ADMIN' | 'MANAGER' | 'AGENT' | 'CUSTOMER'
	roleId: string;
	permissions: string[]; // Combined role + extra permissions
}
```

## Key Pages

### Dashboard (`/dashboard`)

- Welcome message with user name
- Personal stats (leads, tasks, role, status)
- System overview (admin/manager only)
- Quick action cards based on permissions

### Users (`/users`)

- User list with search/filter
- Create new user dialog
- Inline role/status editing
- Extra permission management modal
- Grant ceiling enforcement in UI

### Roles (`/roles`)

- Role listing with permissions
- Create/edit/delete roles
- Assign/remove permissions to roles

### Permissions (`/permissions`)

- Permission listing
- Create/edit/delete permissions

### Leads, Tasks, Reports, Audit Logs

- Standard CRUD interfaces
- Permission-gated actions

## Security Features

### Route Protection (Middleware)

- Redirects unauthenticated users to `/login`
- Redirects authenticated users away from auth pages
- Token validation via cookie or header

### Client-Side Permission Checks

- Hides UI elements user can't access
- Server also enforces permissions on API calls

### Secure Token Storage

- Access token in localStorage + cookie
- Refresh token in httpOnly cookie (set by server)
- Automatic cleanup on logout

## Customizing

### Adding New UI Components

Follow shadcn/ui patterns:

```bash
npx shadcn@latest add button
```

### Adding New API Endpoints

Extend the API client:

```typescript
// src/lib/api.ts
export const api = axios.create({...});

// Add your endpoints
export const leadsApi = {
  getAll: () => api.get('/leads'),
  create: (data: Lead) => api.post('/leads', data),
  // ...
};
```

### Extending Auth Store

Add new state/actions:

```typescript
export const useAuthStore = create<AuthState>()(
	persist(
		(set, get) => ({
			// ...existing state

			// New action
			updateProfile: async (data) => {
				await api.patch("/auth/profile", data);
				set({ user: { ...get().user, ...data } });
			},
		}),
		{ name: "auth-storage" },
	),
);
```

## Troubleshooting

### CORS Errors

Ensure server has CORS configured for `localhost:3000` in development.

### Token Expiration

The interceptor handles refresh automatically. If logout occurs unexpectedly, check:

1. `JWT_EXPIRES_IN` on server
2. `REFRESH_TOKEN_EXPIRES_IN` on server

### Permission Not Working

1. Verify user has permission in database
2. Check role has permission assigned
3. Check extra permissions on user
4. Ensure `hasPermission()` is called after login

## API Documentation

Refer to the server README for complete API endpoint documentation.

## License

MIT License - See root LICENSE file.
