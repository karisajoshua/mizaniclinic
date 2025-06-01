
# Developer Guide

This section provides technical documentation for developers working with the Mizani Clinic Ambassador platform.

## Technology Stack

### Frontend
- **React 18.3.1**: Modern React with hooks and functional components
- **TypeScript**: Type-safe JavaScript development
- **Vite**: Fast build tool and development server
- **Tailwind CSS**: Utility-first CSS framework
- **Shadcn/UI**: Pre-built component library

### Backend & Services
- **Supabase**: Backend-as-a-Service platform
- **PostgreSQL**: Primary database
- **Edge Functions**: Serverless function execution
- **Real-time subscriptions**: Live data updates

### Key Libraries
- **React Router DOM**: Client-side routing
- **React Hook Form**: Form management
- **Tanstack Query**: Data fetching and caching
- **Lucide React**: Icon library
- **Recharts**: Data visualization

## Project Structure

```
📁 mizani-clinic-app/
├── 📁 docs/                    # VitePress documentation
├── 📁 public/                  # Static assets
├── 📁 src/
│   ├── 📁 components/          # Reusable UI components
│   │   ├── 📁 ui/             # Shadcn/UI components
│   │   ├── 📁 admin/          # Admin-specific components
│   │   ├── 📁 dashboard/      # Dashboard components
│   │   └── 📁 appointments/   # Appointment-related components
│   ├── 📁 hooks/              # Custom React hooks
│   ├── 📁 pages/              # Page components (routing)
│   ├── 📁 types/              # TypeScript type definitions
│   ├── 📁 utils/              # Utility functions
│   ├── 📁 integrations/       # External service integrations
│   └── 📁 lib/                # Library configurations
├── 📁 supabase/               # Database migrations and functions
└── 📄 Configuration files
```

## Quick Start

### Prerequisites
- Node.js 18+ and npm/yarn
- Supabase account and project
- Git for version control

### Installation

1. **Clone Repository**
```bash
git clone https://github.com/mizani-clinic/ambassador-app.git
cd ambassador-app
```

2. **Install Dependencies**
```bash
npm install
```

3. **Environment Setup**
```bash
cp .env.example .env.local
# Edit .env.local with your Supabase credentials
```

4. **Start Development Server**
```bash
npm run dev
```

5. **Run Documentation**
```bash
npm run docs:dev
```

## Development Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run docs:dev` | Start documentation server |
| `npm run docs:build` | Build documentation |

## Core Concepts

### Authentication Flow
The app uses Supabase Auth with email/password and social providers:

```typescript
const { user, loading, signIn, signUp, signOut } = useAuth();
```

### Database Integration
Data fetching uses Tanstack Query with Supabase:

```typescript
const { data, isLoading, error } = useQuery({
  queryKey: ['referrals', user?.id],
  queryFn: () => fetchUserReferrals(user?.id),
});
```

### Component Architecture
- **Atomic Design**: Small, reusable components
- **Composition Pattern**: Flexible component composition
- **Props Interface**: Strongly typed component props

### State Management
- **React Hooks**: Local component state
- **Tanstack Query**: Server state management
- **Context API**: Global app state when needed

## Development Guidelines

### Code Standards
- **TypeScript**: Always use TypeScript for type safety
- **ESLint**: Follow configured linting rules
- **Prettier**: Consistent code formatting
- **Component Naming**: PascalCase for components, camelCase for functions

### Git Workflow
1. Create feature branch from `main`
2. Make atomic commits with clear messages
3. Open pull request for review
4. Merge after approval and testing

### Testing Strategy
- **Unit Tests**: Component and function testing
- **Integration Tests**: API and database interactions
- **E2E Tests**: Critical user flows
- **Performance Tests**: Load and stress testing

## Next Steps

- [Project Architecture →](/developer/architecture)
- [Database Schema →](/developer/database)
- [Component Library →](/developer/components)
- [API Integration →](/developer/api)
